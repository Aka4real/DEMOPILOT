import { Project, DemoPlan, DemoScene, GenerationProgressEvent, InteractiveDemoManifest } from "@/types";
import { SAMPLE_PROJECT, SAMPLE_SCENES } from "./mock-data";

class DemoPilotStore {
  private projects: Map<string, Project> = new Map();
  private jobs: Map<string, GenerationProgressEvent> = new Map();
  private interactiveDemos: Map<string, InteractiveDemoManifest> = new Map();

  constructor() {
    // Seed sample project
    this.projects.set(SAMPLE_PROJECT.id, SAMPLE_PROJECT);
    if (SAMPLE_PROJECT.interactiveSlug) {
      this.interactiveDemos.set(SAMPLE_PROJECT.interactiveSlug, {
        slug: SAMPLE_PROJECT.interactiveSlug,
        projectId: SAMPLE_PROJECT.id,
        productName: SAMPLE_PROJECT.productModel?.productName || SAMPLE_PROJECT.name,
        targetUrl: SAMPLE_PROJECT.targetUrl,
        totalDurationSec: SAMPLE_PROJECT.demoPlan?.estimatedDurationSec || 32.5,
        scenes: SAMPLE_SCENES,
        publishedAt: new Date().toISOString(),
      });
    }
  }

  // Projects
  async getProjects(orgId = "org-default"): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (p) => p.organizationId === orgId
    );
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async createProject(data: {
    name: string;
    targetUrl: string;
    objective: Project["objective"];
    presentationStyle: Project["presentationStyle"];
    voiceStyle: Project["voiceStyle"];
    authConfig?: Project["authConfig"];
    organizationId?: string;
  }): Promise<Project> {
    const id = `proj-${Date.now()}`;
    const project: Project = {
      id,
      organizationId: data.organizationId || "org-default",
      name: data.name,
      targetUrl: data.targetUrl,
      status: "DRAFT",
      objective: data.objective,
      presentationStyle: data.presentationStyle,
      voiceStyle: data.voiceStyle,
      authConfig: data.authConfig,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const existing = this.projects.get(id);
    if (!existing) return null;
    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Scene editing
  async updateScene(sceneId: string, updates: Partial<DemoScene>): Promise<DemoScene | null> {
    for (const project of Array.from(this.projects.values())) {
      if (project.demoPlan) {
        const index = project.demoPlan.scenes.findIndex((s: DemoScene) => s.id === sceneId);
        if (index !== -1) {
          const updatedScene = { ...project.demoPlan.scenes[index], ...updates };
          project.demoPlan.scenes[index] = updatedScene;
          project.updatedAt = new Date().toISOString();
          return updatedScene;
        }
      }
    }
    return null;
  }

  // Publishing
  async publishDemo(projectId: string, customSlug?: string): Promise<InteractiveDemoManifest | null> {
    const project = this.projects.get(projectId);
    if (!project || !project.demoPlan) return null;

    const slug = customSlug || `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
    
    project.status = "PUBLISHED";
    project.interactiveSlug = slug;
    project.updatedAt = new Date().toISOString();

    const manifest: InteractiveDemoManifest = {
      slug,
      projectId: project.id,
      productName: project.productModel?.productName || project.name,
      targetUrl: project.targetUrl,
      totalDurationSec: project.demoPlan.estimatedDurationSec,
      scenes: project.demoPlan.scenes,
      publishedAt: new Date().toISOString(),
    };

    this.interactiveDemos.set(slug, manifest);
    return manifest;
  }

  async getInteractiveDemo(slug: string): Promise<InteractiveDemoManifest | null> {
    return this.interactiveDemos.get(slug) || null;
  }

  // Jobs & SSE Progress
  setJobProgress(event: GenerationProgressEvent): void {
    this.jobs.set(event.jobId, event);
  }

  getJobProgress(jobId: string): GenerationProgressEvent | null {
    return this.jobs.get(jobId) || null;
  }
}

// Global singleton for Next.js hot-reloads
const globalStore = global as unknown as { __demoPilotStore?: DemoPilotStore };
export const store = globalStore.__demoPilotStore || new DemoPilotStore();
if (process.env.NODE_ENV !== "production") {
  globalStore.__demoPilotStore = store;
}
