export type ProjectStatus =
  | "DRAFT"
  | "ANALYZING"
  | "READY"
  | "GENERATING"
  | "REVIEW"
  | "PUBLISHED"
  | "FAILED"
  | "ARCHIVED";

export type ActionType =
  | "OPEN_URL"
  | "NAVIGATE"
  | "CLICK"
  | "HOVER"
  | "TYPE"
  | "SCROLL"
  | "SELECT"
  | "WAIT"
  | "SCREENSHOT";

export type PresentationStyle = "concise" | "detailed" | "technical";
export type VoiceStyle = "professional" | "conversational" | "executive";
export type DemoObjective =
  | "product_overview"
  | "feature_walkthrough"
  | "investor_demo"
  | "customer_onboarding"
  | "custom";

export interface EvidenceItem {
  id: string;
  claim: string;
  pageUrl: string;
  pagePath: string;
  elementSelector?: string;
  elementText?: string;
  domSnippet?: string;
  screenshotUrl?: string;
  confidenceScore: number; // 0 to 1
  verifiedAt: string;
}

export interface WebsiteElement {
  id: string;
  pageId: string;
  selector: string;
  tagName: string;
  text?: string;
  role?: string;
  testId?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface WebsitePage {
  id: string;
  path: string;
  url: string;
  title: string;
  metaDescription?: string;
  screenshotUrl?: string;
  elements: WebsiteElement[];
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  evidenceRefId?: string;
  sourcePage?: string;
}

export interface ProductModel {
  id: string;
  projectId: string;
  productName: string;
  tagline: string;
  summary: string;
  primaryAudience: string[];
  keyFeatures: ProductFeature[];
  suggestedFlows: {
    id: string;
    name: string;
    description: string;
    stepPages: string[];
  }[];
  evidence: EvidenceItem[];
  analyzedAt: string;
}

export interface DemoAction {
  id: string;
  sceneId: string;
  orderIndex: number;
  actionType: ActionType;
  selector?: string;
  value?: string;
  timingOffsetMs: number;
  description?: string;
}

export interface NarrationScript {
  id: string;
  sceneId: string;
  voice: string;
  text: string;
  audioUrl?: string;
  durationSec: number;
  verifiedGrounding: boolean;
}

export interface DemoScene {
  id: string;
  planId: string;
  orderIndex: number;
  title: string;
  purpose: string;
  pagePath: string;
  viewportWidth: number;
  viewportHeight: number;
  durationSec: number;
  screenshotUrl?: string;
  videoUrl?: string;
  highlightSelector?: string;
  evidence?: EvidenceItem;
  actions: DemoAction[];
  narration: NarrationScript;
}

export interface DemoPlan {
  id: string;
  projectId: string;
  objective: DemoObjective;
  presentationStyle: PresentationStyle;
  voiceStyle: VoiceStyle;
  estimatedDurationSec: number;
  scenes: DemoScene[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthConfig {
  authType?: "NONE" | "BASIC" | "COOKIE" | "BEARER" | "LOGIN_FORM";
  basicUser?: string;
  basicPass?: string;
  cookies?: Array<{ name: string; value: string; domain?: string; path?: string }>;
  bearerToken?: string;
  loginUrl?: string;
  loginUserSelector?: string;
  loginUserValue?: string;
  loginPassSelector?: string;
  loginPassValue?: string;
  loginSubmitSelector?: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  targetUrl: string;
  status: ProjectStatus;
  objective: DemoObjective;
  presentationStyle: PresentationStyle;
  voiceStyle: VoiceStyle;
  authConfig?: AuthConfig;
  productModel?: ProductModel;
  demoPlan?: DemoPlan;
  interactiveSlug?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationProgressEvent {
  jobId: string;
  projectId: string;
  stage:
    | "CONNECTING_WEBSITE"
    | "MAPPING_PAGES"
    | "EXTRACTING_ELEMENTS"
    | "ANALYZING_PRODUCT"
    | "CREATING_DEMO_STORY"
    | "RECORDING_WALKTHROUGH"
    | "SYNTHESIZING_NARRATION"
    | "VERIFYING_EVIDENCE"
    | "BUILDING_INTERACTIVE"
    | "RENDERING_VIDEO"
    | "COMPLETED"
    | "FAILED";
  progressPct: number;
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface InteractiveDemoManifest {
  slug: string;
  projectId: string;
  productName: string;
  targetUrl: string;
  totalDurationSec: number;
  scenes: DemoScene[];
  publishedAt: string;
}
