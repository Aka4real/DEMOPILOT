"use client";

import React, { useState } from "react";
import {
  Shield,
  Key,
  Database,
  Cpu,
  Plus,
  Trash2,
  Copy,
  Check,
  Lock,
  Clock,
  Server,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ApiKeyRecord, AuditLogEntry } from "@/lib/database/prisma";

interface SettingsClientViewProps {
  initialKeys: ApiKeyRecord[];
  initialAuditLogs: AuditLogEntry[];
}

export function SettingsClientView({
  initialKeys,
  initialAuditLogs,
}: SettingsClientViewProps) {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(initialKeys);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedSecret, setNewlyCreatedSecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/settings/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (res.ok && data.key) {
        setKeys([data.key, ...keys]);
        setNewlyCreatedSecret(data.secret);
        setNewKeyName("");
        setIsCreatingKey(false);
        showToast("New API key generated successfully.");
      } else {
        showToast(data.error || "Failed to generate key.");
      }
    } catch {
      showToast("Error generating API key.");
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      const res = await fetch(`/api/settings/keys?id=${keyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setKeys(keys.filter((k) => k.id !== keyId));
        showToast("API key revoked.");
      } else {
        showToast("Failed to revoke key.");
      }
    } catch {
      showToast("Error revoking API key.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium shadow-xl border border-white/10 flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-6 border-b border-border/60">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Workspace Settings & Security
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure API credentials, inspect the SSRF sandbox defense engine, and manage audit logs.
        </p>
      </div>

      <div className="space-y-6">
        {/* API KEYS MANAGEMENT (Phase 13) */}
        <Card className="p-6 space-y-5 bg-surface-1 border border-border/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base">Organization API Keys</CardTitle>
                <CardDescription>
                  Programmatically trigger crawls, generate demo plans, and export video renders via REST API.
                </CardDescription>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setIsCreatingKey(true);
                setNewlyCreatedSecret(null);
              }}
              className="text-xs gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create API Key</span>
            </Button>
          </div>

          {/* New Key Secret Alert */}
          {newlyCreatedSecret && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>API Key Generated</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Copy now — won’t be shown again
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={newlyCreatedSecret}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface-0 font-mono text-xs text-foreground"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newlyCreatedSecret)}
                  className="text-xs gap-1"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? "Copied" : "Copy Secret"}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Create Key Form */}
          {isCreatingKey && (
            <form onSubmit={handleGenerateKey} className="p-4 rounded-xl bg-surface-0 border border-border space-y-3">
              <div className="text-xs font-semibold text-foreground">Generate New API Key</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Production CI/CD Pipeline"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <Button size="sm" type="submit" className="text-xs">
                  Generate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => setIsCreatingKey(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Keys List */}
          <div className="rounded-xl border border-border/80 divide-y divide-border/60 bg-surface-0 overflow-hidden">
            {keys.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No active API keys found. Create one to enable automated pipeline triggers.
              </div>
            ) : (
              keys.map((k) => (
                <div key={k.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <span>{k.name}</span>
                      <span className="font-mono text-[11px] text-muted-foreground px-1.5 py-0.5 rounded bg-surface-2 border border-border/60">
                        {k.maskedKey}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      Created: {new Date(k.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeKey(k.id)}
                    className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* SECURITY & SANDBOX DEFENSE ENGINE (Phase 14) */}
        <Card className="p-6 space-y-4 bg-surface-1 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">Browser Sandbox & SSRF Defense</CardTitle>
              <CardDescription>
                Zero-trust execution sandbox protects against host network discovery, DNS rebinding, and prompt injection.
              </CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-surface-0 border border-border/70 text-xs space-y-1">
              <div className="text-muted-foreground">RFC 1918 Private IPv4</div>
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Blocked (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-0 border border-border/70 text-xs space-y-1">
              <div className="text-muted-foreground">Cloud Metadata Filter</div>
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Blocked (169.254.169.254, metadata.google.internal)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-0 border border-border/70 text-xs space-y-1">
              <div className="text-muted-foreground">Loopback & Link-Local</div>
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Blocked (127.0.0.0/8, ::1, fe80::/10)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-0 border border-border/70 text-xs space-y-1">
              <div className="text-muted-foreground">Prompt Injection Isolation</div>
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Strict &lt;untrusted_scraped_data&gt; Containers</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ENCRYPTION & SECRETS (Phase 12) */}
        <Card className="p-6 space-y-4 bg-surface-1 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">Authenticated Session Encryption</CardTitle>
              <CardDescription>
                High-security AES-256-GCM authenticated cipher protects user session tokens and credentials.
              </CardDescription>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-0 border border-border flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-foreground">Cipher: AES-256-GCM (96-bit IV, 128-bit Auth Tag)</div>
              <div className="text-muted-foreground font-mono text-[11px]">
                Hardware Acceleration: Active (Node.js OpenSSL)
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Verified
            </span>
          </div>
        </Card>

        {/* AUDIT LOG TRAIL */}
        <Card className="p-6 space-y-4 bg-surface-1 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">Security Audit Logs</CardTitle>
              <CardDescription>
                Immutable record of workspace actions, demo publications, and export events.
              </CardDescription>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 divide-y divide-border/60 bg-surface-0 overflow-hidden">
            {auditLogs.map((entry) => (
              <div key={entry.id} className="p-3 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-semibold">
                    {entry.action}
                  </span>
                  <span className="text-foreground">{entry.resourceType}</span>
                  <span className="text-muted-foreground text-[11px]">({entry.resourceId})</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
