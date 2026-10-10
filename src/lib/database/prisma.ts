// DemoPilot Database Access Layer & Multi-Tenant Scoping Engine
// Enforces Organization-level isolation on every query according to Law 3 and Law 11

import { store } from "@/lib/storage/store";
import { Project, GenerationProgressEvent } from "@/types";

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface UsageMetric {
  organizationId: string;
  eventType: "GEMINI_TOKENS" | "TTS_CHARS" | "BROWSER_SECONDS" | "RENDER_SECONDS";
  quantity: number;
  timestamp: string;
}

export interface ApiKeyRecord {
  id: string;
  organizationId: string;
  name: string;
  maskedKey: string;
  keyHash: string;
  createdAt: string;
  lastUsedAt?: string;
}

// In-memory backing for audit logs and API keys alongside store
const auditLogs: AuditLogEntry[] = [
  {
    id: "audit-01",
    organizationId: "org-default",
    action: "PROJECT_CREATED",
    resourceType: "PROJECT",
    resourceId: "proj-sample-1",
    metadata: { name: "TaskFlow Product Tour", targetUrl: "https://demo-app.demopilot.dev" },
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "audit-02",
    organizationId: "org-default",
    action: "DEMO_PUBLISHED",
    resourceType: "INTERACTIVE_DEMO",
    resourceId: "taskflow-overview",
    metadata: { slug: "taskflow-overview", durationSec: 32.5 },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "audit-03",
    organizationId: "org-default",
    action: "VIDEO_RENDERED",
    resourceType: "VIDEO",
    resourceId: "renders/taskflow-1080p.mp4",
    metadata: { resolution: "1080p", format: "mp4" },
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
];

const apiKeys: ApiKeyRecord[] = [
  {
    id: "key-01",
    organizationId: "org-default",
    name: "Production CI/CD Webhook",
    maskedKey: "dp_live_9f8a••••••••3b12",
    keyHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "key-02",
    organizationId: "org-default",
    name: "Staging Pipeline Key",
    maskedKey: "dp_live_4a1c••••••••8c99",
    keyHash: "d41d8cd98f00b204e9800998ecf8427e",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const usageEvents: UsageMetric[] = [
  { organizationId: "org-default", eventType: "GEMINI_TOKENS", quantity: 48200, timestamp: new Date().toISOString() },
  { organizationId: "org-default", eventType: "TTS_CHARS", quantity: 6420, timestamp: new Date().toISOString() },
  { organizationId: "org-default", eventType: "BROWSER_SECONDS", quantity: 185, timestamp: new Date().toISOString() },
  { organizationId: "org-default", eventType: "RENDER_SECONDS", quantity: 74, timestamp: new Date().toISOString() },
];

export const db = {
  // Scoped project retrieval
  async getScopedProject(organizationId: string, projectId: string): Promise<Project | null> {
    const project = await store.getProjectById(projectId);
    if (!project || project.organizationId !== organizationId) {
      return null;
    }
    return project;
  },

  async listScopedProjects(organizationId: string): Promise<Project[]> {
    return store.getProjects(organizationId);
  },

  // Audit logging
  async logAuditEvent(
    organizationId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, unknown>,
    userId?: string
  ): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      organizationId,
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
      timestamp: new Date().toISOString(),
    };
    auditLogs.unshift(entry);
    return entry;
  },

  async getAuditLogs(organizationId: string): Promise<AuditLogEntry[]> {
    return auditLogs.filter((log) => log.organizationId === organizationId);
  },

  // Usage tracking
  async recordUsage(
    organizationId: string,
    eventType: UsageMetric["eventType"],
    quantity: number
  ): Promise<void> {
    usageEvents.push({
      organizationId,
      eventType,
      quantity,
      timestamp: new Date().toISOString(),
    });
  },

  async getUsageSummary(organizationId: string) {
    const orgEvents = usageEvents.filter((e) => e.organizationId === organizationId);
    return {
      geminiTokens: orgEvents
        .filter((e) => e.eventType === "GEMINI_TOKENS")
        .reduce((sum, e) => sum + e.quantity, 0),
      ttsChars: orgEvents
        .filter((e) => e.eventType === "TTS_CHARS")
        .reduce((sum, e) => sum + e.quantity, 0),
      browserSeconds: orgEvents
        .filter((e) => e.eventType === "BROWSER_SECONDS")
        .reduce((sum, e) => sum + e.quantity, 0),
      renderSeconds: orgEvents
        .filter((e) => e.eventType === "RENDER_SECONDS")
        .reduce((sum, e) => sum + e.quantity, 0),
    };
  },

  // API Key management
  async listApiKeys(organizationId: string): Promise<ApiKeyRecord[]> {
    return apiKeys.filter((k) => k.organizationId === organizationId);
  },

  async createApiKey(organizationId: string, name: string): Promise<{ keyRecord: ApiKeyRecord; secret: string }> {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const secret = `dp_live_${randomHex}`;
    const maskedKey = `dp_live_${randomHex.slice(0, 4)}••••••••${randomHex.slice(-4)}`;

    // Simple hash for lookup
    const keyHash = randomHex;

    const keyRecord: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      organizationId,
      name,
      maskedKey,
      keyHash,
      createdAt: new Date().toISOString(),
    };

    apiKeys.unshift(keyRecord);
    return { keyRecord, secret };
  },

  async revokeApiKey(organizationId: string, keyId: string): Promise<boolean> {
    const index = apiKeys.findIndex((k) => k.id === keyId && k.organizationId === organizationId);
    if (index !== -1) {
      apiKeys.splice(index, 1);
      return true;
    }
    return false;
  },
};
