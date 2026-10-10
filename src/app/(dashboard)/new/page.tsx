"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Edit2,
  Lock,
  Key,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductModel, DemoPlan } from "@/types";

type Step = "INPUT" | "ANALYZING" | "UNDERSTANDING" | "PLANNING" | "READY";

export default function CreateDemoPage() {
  const router = useRouter();

  // Form inputs
  const [url, setUrl] = useState("https://linear.app");
  const [objective, setObjective] = useState<
    "product_overview" | "feature_walkthrough" | "investor_demo" | "customer_onboarding"
  >("product_overview");
  const [presentationStyle, setPresentationStyle] = useState<"concise" | "detailed" | "technical">("concise");
  const [voiceStyle, setVoiceStyle] = useState<"professional" | "conversational" | "executive">("professional");

  // Private & Authenticated Environment Settings
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState<"NONE" | "COOKIE" | "BEARER" | "BASIC">("NONE");
  const [cookieString, setCookieString] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [basicUser, setBasicUser] = useState("");
  const [basicPass, setBasicPass] = useState("");

  // Flow State
  const [currentStep, setCurrentStep] = useState<Step>("INPUT");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analyzingStage, setAnalyzingStage] = useState(0);

  // Analysis result
  const [productModel, setProductModel] = useState<ProductModel | null>(null);
  const [demoPlan, setDemoPlan] = useState<DemoPlan | null>(null);

  const startAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setErrorMessage(null);
    setCurrentStep("ANALYZING");
    setAnalyzingStage(1);

    try {
      // Build AuthConfig payload if specified
      let authConfigPayload = undefined;
      if (authType === "COOKIE" && cookieString.trim()) {
        const cookies = cookieString
          .split(";")
          .map((pair) => {
            const [name, ...rest] = pair.trim().split("=");
            return { name: name?.trim() || "", value: rest.join("=").trim() };
          })
          .filter((c) => c.name && c.value);
        authConfigPayload = { authType: "COOKIE" as const, cookies };
      } else if (authType === "BEARER" && bearerToken.trim()) {
        authConfigPayload = { authType: "BEARER" as const, bearerToken: bearerToken.trim() };
      } else if (authType === "BASIC" && basicUser.trim()) {
        authConfigPayload = { authType: "BASIC" as const, basicUser: basicUser.trim(), basicPass };
      }

      // Step 1: Create Project record
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: url,
          objective,
          presentationStyle,
          voiceStyle,
          authConfig: authConfigPayload,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.project) {
        throw new Error(createData.error || "Failed to initialize project");
      }

      const pId = createData.project.id;
      setProjectId(pId);

      // Simulate step progress for user feedback while crawler runs
      const stageTimer1 = setTimeout(() => setAnalyzingStage(2), 1200);
      const stageTimer2 = setTimeout(() => setAnalyzingStage(3), 2800);
      const stageTimer3 = setTimeout(() => setAnalyzingStage(4), 4500);

      // Step 2: Trigger Website Crawler and Gemini Product Analyzer
      const analyzeRes = await fetch(`/api/projects/${pId}/analyze`, {
        method: "POST",
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok || !analyzeData.productModel) {
        throw new Error(analyzeData.error || "Analysis encountered an issue");
      }

      setProductModel(analyzeData.productModel);

      // Step 3: Automatically generate initial Demo Plan
      const planRes = await fetch(`/api/projects/${pId}/plan`, {
        method: "POST",
      });
      const planData = await planRes.json();
      if (planRes.ok && planData.demoPlan) {
        setDemoPlan(planData.demoPlan);
      }

      setCurrentStep("UNDERSTANDING");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Analysis failed");
      setCurrentStep("INPUT");
    }
  };

  const handleGenerate = async () => {
    if (!projectId) return;
    setCurrentStep("PLANNING");

    try {
      const genRes = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
      });
      const genData = await genRes.json();
      if (!genRes.ok) {
        throw new Error(genData.error || "Failed generating demonstration walkthrough");
      }

      router.push(`/projects/${projectId}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Walkthrough execution failed");
      setCurrentStep("UNDERSTANDING");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create a new demonstration
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          DemoPilot observes your live product and extracts a verified, evidence-grounded walkthrough.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Execution Alert</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* STEP 1: INPUT FORM */}
      {currentStep === "INPUT" && (
        <form onSubmit={startAnalysis} className="space-y-6">
          <Card>
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base">Target Website</CardTitle>
              <CardDescription>
                Enter the public address or authenticated landing of your web product.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://yourproduct.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface-0 focus:bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* OBJECTIVE */}
          <Card>
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base">What are you demonstrating?</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "product_overview", label: "Product overview", desc: "High-level tour of primary workspace and value props" },
                { id: "feature_walkthrough", label: "Feature walkthrough", desc: "Deep-dive focus on specific user tasks and workflows" },
                { id: "investor_demo", label: "Investor demo", desc: "Concise demonstration emphasizing market traction and product velocity" },
                { id: "customer_onboarding", label: "Customer onboarding", desc: "Step-by-step guidance for new users launching their account" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setObjective(opt.id as typeof objective)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    objective === opt.id
                      ? "border-primary-500 bg-primary-500/5 ring-1 ring-primary-500/40"
                      : "border-border/80 bg-surface-1 hover:border-border"
                  }`}
                >
                  <div className="font-semibold text-xs text-foreground">{opt.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{opt.desc}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* PRESENTATION & VOICE STYLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm">Presentation style</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-2">
                {[
                  { id: "concise", label: "Concise (Fast & focused)" },
                  { id: "detailed", label: "Detailed (Complete context)" },
                  { id: "technical", label: "Technical (Architecture & controls)" },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setPresentationStyle(s.id as typeof presentationStyle)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                      presentationStyle === s.id
                        ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300 font-semibold"
                        : "border-border/60 bg-surface-0 hover:bg-surface-2 text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm">Voice & Narration</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-2">
                {[
                  { id: "professional", label: "Professional (Puck - Studio)" },
                  { id: "conversational", label: "Conversational (Aoede - Natural)" },
                  { id: "executive", label: "Executive (Charon - Authoritative)" },
                ].map((v) => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => setVoiceStyle(v.id as typeof voiceStyle)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                      voiceStyle === v.id
                        ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300 font-semibold"
                        : "border-border/60 bg-surface-0 hover:bg-surface-2 text-foreground"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* PRIVATE & AUTHENTICATED ACCESS (Phase 12) */}
          <Card className="border-border/80 bg-surface-1">
            <CardHeader className="p-5 pb-3">
              <button
                type="button"
                onClick={() => setShowAuth(!showAuth)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>Private / Authenticated Web App</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        AES-256-GCM
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Demonstrate staging apps or platforms requiring cookies, tokens, or login.
                    </div>
                  </div>
                </div>
                {showAuth ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
            </CardHeader>

            {showAuth && (
              <CardContent className="p-5 pt-0 space-y-4 border-t border-border/60 mt-3 animate-in fade-in duration-200">
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { id: "NONE", label: "Public Website" },
                    { id: "COOKIE", label: "Session Cookies" },
                    { id: "BEARER", label: "Bearer Token" },
                    { id: "BASIC", label: "HTTP Basic Auth" },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setAuthType(t.id as typeof authType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        authType === t.id
                          ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/30"
                          : "bg-surface-0 border-border/70 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {authType === "COOKIE" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Session Cookies (e.g. session_id=xyz; auth_token=123)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="session=a1b2c3d4e5; org_id=acme"
                      value={cookieString}
                      onChange={(e) => setCookieString(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-surface-0 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Encrypted in memory; injected exclusively into isolated Chromium sandbox.</span>
                    </div>
                  </div>
                )}

                {authType === "BEARER" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Bearer Token</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={bearerToken}
                      onChange={(e) => setBearerToken(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-surface-0 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                )}

                {authType === "BASIC" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Username</label>
                      <input
                        type="text"
                        placeholder="staging_user"
                        value={basicUser}
                        onChange={(e) => setBasicUser(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-border bg-surface-0 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={basicPass}
                        onChange={(e) => setBasicPass(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-border bg-surface-0 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          <div className="flex justify-end pt-2">
            <Button size="lg" type="submit" className="gap-2 shadow-md">
              <span>Analyze website</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: PROFESSIONAL ANALYSIS PROGRESS */}
      {currentStep === "ANALYZING" && (
        <Card className="p-8 space-y-6 glass-panel">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Analyzing your product</h2>
            <p className="text-xs text-muted-foreground font-mono">Target: {url}</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { id: 1, label: "Website captured & SSRF security validated" },
              { id: 2, label: "Navigation hierarchy & pages mapped" },
              { id: 3, label: "Interactive elements & buttons indexed" },
              { id: 4, label: "Grounded product model & features synthesized" },
              { id: 5, label: "Demonstration story arc generated" },
            ].map((stg) => {
              const isDone = analyzingStage >= stg.id;
              const isCurrent = analyzingStage === stg.id - 1;

              return (
                <div key={stg.id} className="flex items-center gap-3 text-xs">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border bg-surface-2"></div>
                  )}
                  <span
                    className={
                      isDone
                        ? "text-foreground font-medium"
                        : isCurrent
                        ? "text-primary-600 dark:text-primary-400 font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {stg.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            <span>Building evidence-backed demonstration plan…</span>
          </div>
        </Card>
      )}

      {/* STEP 3: PRODUCT UNDERSTANDING REVIEW */}
      {currentStep === "UNDERSTANDING" && productModel && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="border-b border-border/60 pb-4">
              <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">
                YOUR PRODUCT
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1">
                {productModel.productName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">{productModel.tagline}</p>
              <p className="text-xs text-foreground/80 leading-relaxed mt-2">{productModel.summary}</p>
            </div>

            {/* AUDIENCE */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">
                PRIMARY AUDIENCE
              </span>
              <div className="flex flex-wrap gap-2">
                {productModel.primaryAudience.map((aud, i) => (
                  <Badge key={i} variant="secondary">
                    {aud}
                  </Badge>
                ))}
              </div>
            </div>

            {/* KEY FEATURES */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">
                KEY FEATURES IDENTIFIED
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {productModel.keyFeatures.map((feat, idx) => (
                  <div
                    key={feat.id || idx}
                    className="p-3.5 rounded-xl border border-border/70 bg-surface-0 space-y-1"
                  >
                    <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <span className="font-mono text-[10px] text-primary-500">
                        0{idx + 1}
                      </span>
                      <span>{feat.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOMMENDED STORY */}
            {demoPlan && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">
                    RECOMMENDED DEMO STORY ({demoPlan.scenes.length} SCENES)
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ~{Math.round(demoPlan.estimatedDurationSec)}s duration
                  </span>
                </div>

                <div className="rounded-xl border border-border/80 divide-y divide-border/60 overflow-hidden bg-surface-0">
                  {demoPlan.scenes.map((scene, sIdx) => (
                    <div key={scene.id} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-bold">
                          0{sIdx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-foreground">{scene.title}</div>
                          <div className="text-[11px] text-muted-foreground">{scene.purpose}</div>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {scene.durationSec}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep("INPUT")}
            >
              Adjust Settings
            </Button>
            <Button size="lg" onClick={handleGenerate} className="gap-2 shadow-md">
              <span>Generate demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: WALKTHROUGH EXECUTION PROGRESS */}
      {currentStep === "PLANNING" && (
        <Card className="p-8 text-center space-y-4 glass-panel">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-600 flex items-center justify-center mx-auto animate-bounce">
            <Sliders className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Executing Browser Walkthrough</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Playwright is navigating your real website, capturing high-resolution evidence, and synthesizing Gemini studio narration.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
