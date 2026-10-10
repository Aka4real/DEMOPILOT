"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Play,
  Pause,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe,
  Sliders,
  Video,
  Eye,
  Check,
  Code2,
  Terminal,
  Volume2,
  VolumeX,
  Lock,
  Cpu,
  RefreshCw,
  Search,
  Zap,
  Share2,
  FileText,
  MousePointer2,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge, EvidenceBadge } from "@/components/ui/Badge";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { SAMPLE_SCENES, SAMPLE_EVIDENCE } from "@/lib/storage/mock-data";

// Sample Preset Demonstrations for the Hero Studio Simulator
const DEMO_PRESETS = [
  {
    id: "linear",
    brand: "Linear",
    tagline: "Issue Tracking & Sprint Cycles",
    url: "https://linear.app/demo",
    path: "/cycles/sprint-24",
    selector: "button[data-testid='btn-create-cycle']",
    selectorLabel: "New Cycle (C)",
    evidenceScore: 0.99,
    scenes: [
      {
        title: "Triage & Cycle Board",
        time: "00:08",
        narration:
          "Linear centers your engineering velocity. Active cycle progress and automated triage update in real time.",
        highlightElement: "cycle-metric",
      },
      {
        title: "Frictionless Task Capture",
        time: "00:07",
        narration:
          "Create issues with global keyboard shortcuts in under two seconds, keeping engineers completely in flow.",
        highlightElement: "btn-create",
      },
      {
        title: "Real-time State Transitions",
        time: "00:09",
        narration:
          "Drag cards across active columns without page reload. Changes synchronize instantly across your entire team.",
        highlightElement: "board-lane",
      },
    ],
  },
  {
    id: "supabase",
    brand: "Supabase",
    tagline: "Postgres Branching & Edge Functions",
    url: "https://supabase.com/dashboard",
    path: "/project/analytics/branching",
    selector: "button#deploy-branch-btn",
    selectorLabel: "Deploy Branch",
    evidenceScore: 0.98,
    scenes: [
      {
        title: "Database Architecture",
        time: "00:08",
        narration:
          "Every Supabase project provides dedicated Postgres with instant schema branching for isolated testing.",
        highlightElement: "branch-graph",
      },
      {
        title: "Point-in-Time Recovery",
        time: "00:07",
        narration:
          "Restore production state to any microsecond timestamp with single-click verified WAL replay.",
        highlightElement: "pitr-timeline",
      },
      {
        title: "Edge Function Dispatch",
        time: "00:08",
        narration:
          "Serverless TypeScript functions run globally with sub-10 millisecond cold starts right next to your database.",
        highlightElement: "deploy-btn",
      },
    ],
  },
  {
    id: "stripe",
    brand: "Stripe",
    tagline: "Billing Portals & Subscription Engine",
    url: "https://dashboard.stripe.com",
    path: "/billing/subscriptions",
    selector: "button[data-action='create-subscription']",
    selectorLabel: "Create Subscription",
    evidenceScore: 0.99,
    scenes: [
      {
        title: "Unified Billing Center",
        time: "00:08",
        narration:
          "Stripe Billing automatically coordinates multi-currency proration, recurring invoices, and tax compliance.",
        highlightElement: "mrr-card",
      },
      {
        title: "Automated Dunning & Recovery",
        time: "00:07",
        narration:
          "Smart retries and card account updater recover up to 41% of failed recurring customer payments.",
        highlightElement: "smart-retry",
      },
      {
        title: "Customer Self-Service Portal",
        time: "00:08",
        narration:
          "Provide branded self-service billing management with zero backend code required.",
        highlightElement: "portal-preview",
      },
    ],
  },
];

export default function MarketingPage() {
  // Hero Studio Simulator state
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 58, y: 38 });
  const [isClicking, setIsClicking] = useState(false);

  // Live URL Simulator Bar state
  const [testUrl, setTestUrl] = useState("https://linear.app");
  const [simulatingInspect, setSimulatingInspect] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  // Billing Toggle State
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const currentPreset = DEMO_PRESETS[activePresetIdx];
  const currentScene = currentPreset.scenes[activeSceneIdx];

  // Animated Playhead & Cursor Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackProgress((prev) => {
        if (prev >= 100) {
          // Advance scene
          setActiveSceneIdx((curr) => (curr + 1) % currentPreset.scenes.length);
          return 0;
        }
        return prev + 1.2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentPreset.scenes.length]);

  // Cursor roaming animation to simulate real Playwright recording
  useEffect(() => {
    if (!isPlaying) return;

    const positions = [
      { x: 55, y: 34 },
      { x: 78, y: 46 },
      { x: 62, y: 72 },
      { x: 38, y: 55 },
    ];

    const moveTimer = setInterval(() => {
      const nextPos = positions[Math.floor(Math.random() * positions.length)];
      setCursorPos(nextPos);
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 300);
    }, 2800);

    return () => clearInterval(moveTimer);
  }, [isPlaying]);

  // URL Simulator Action
  const handleSimulateInspect = (urlToTest?: string) => {
    if (urlToTest) setTestUrl(urlToTest);
    setSimulatingInspect(true);
    setSimulationStep(1);

    setTimeout(() => setSimulationStep(2), 600);
    setTimeout(() => setSimulationStep(3), 1300);
    setTimeout(() => setSimulationStep(4), 2100);
    setTimeout(() => {
      setSimulatingInspect(false);
      setSimulationStep(0);
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-foreground flex flex-col selection:bg-primary-500/25 selection:text-white overflow-x-hidden">
      {/* Background Ambient Lighting & Specular Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)]" />
        <div className="absolute top-[400px] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)] opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex flex-col items-center">
          {/* ========================================================= */}
          {/* HERO SECTION                                              */}
          {/* ========================================================= */}
          <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center space-y-8">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-zinc-300 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-white font-medium">Evidence-Grounded AI</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Playwright Automation</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-semibold">Zero Hallucinations</span>
            </div>

            {/* Display Typography */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
                Your product, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  presented properly.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-normal text-balance">
                DemoPilot navigates your real interface using sandboxed browser automation, extracts verifiable DOM evidence, and creates interactive demonstrations grounded in reality.
              </p>
            </div>

            {/* Call to Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link href="/new">
                <Button size="lg" variant="glow" className="gap-2.5 text-sm font-semibold shadow-lg">
                  <span>Create a demonstration</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/demo/taskflow-overview">
                <Button variant="outline" size="lg" className="gap-2 text-sm font-medium glass-surface">
                  <Play className="w-4 h-4 fill-current text-primary-400" />
                  <span>Explore interactive demo</span>
                </Button>
              </Link>
            </div>

            {/* ========================================================= */}
            {/* THE HERO DEMO STUDIO CANVAS (INTERACTIVE PRODUCT STAGE)    */}
            {/* ========================================================= */}
            <div id="demo-studio" className="pt-8 w-full max-w-5xl mx-auto">
              {/* Product Preset Switcher Bar */}
              <div className="flex items-center justify-between pb-3 px-2">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                  {DEMO_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setActivePresetIdx(idx);
                        setActiveSceneIdx(0);
                        setPlaybackProgress(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        idx === activePresetIdx
                          ? "bg-white/[0.12] text-white shadow-sm border border-white/[0.15]"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="font-semibold">{preset.brand}</span>
                      <span className="hidden sm:inline text-zinc-500 ml-1.5">({preset.tagline.split(" ")[0]})</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <EvidenceBadge score={currentPreset.evidenceScore} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1.5 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20"
                    onClick={() => setInspectorOpen(true)}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Inspect Proof</span>
                  </Button>
                </div>
              </div>

              {/* Main Simulated Browser Frame */}
              <div className="rounded-3xl border border-white/[0.12] bg-[#0c0e17] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.12)] overflow-hidden glass-panel relative group">
                {/* Browser Top Window Bar */}
                <div className="px-4 py-3 border-b border-white/[0.08] bg-[#090b12]/90 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]/90 border border-black/20"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/90 border border-black/20"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]/90 border border-black/20"></div>
                  </div>

                  {/* Address Bar */}
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs font-mono text-zinc-300 w-full max-w-md mx-4">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-zinc-500">https://</span>
                    <span className="text-white font-medium">{currentPreset.url.replace("https://", "")}</span>
                    <span className="text-emerald-400 font-medium">{currentPreset.path}</span>
                  </div>

                  {/* Browser Live Indicator */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="hidden sm:inline">Chromium Sandbox</span>
                  </div>
                </div>

                {/* Simulated Product Canvas */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#090b12] flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
                  {/* Real-looking Web Application UI Interface */}
                  <div className="w-full h-full rounded-2xl border border-white/[0.08] bg-[#0e121e]/80 p-6 flex flex-col justify-between shadow-inner">
                    {/* Demonstrated App Top Navigation */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {currentPreset.brand.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-white">{currentPreset.brand} Workspace</span>
                          <span className="text-xs text-zinc-400 ml-2 font-mono">/ Production</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Target Discovered Button with Pulse Ring */}
                        <div className="relative">
                          <button
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              currentPreset.selector.includes("create") || currentPreset.selector.includes("deploy")
                                ? "bg-primary-600 text-white ring-4 ring-primary-500/30 scale-105 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                : "bg-white/[0.06] border border-white/10 text-white"
                            }`}
                          >
                            + {currentPreset.selectorLabel}
                          </button>

                          {/* CSS Selector Floating Tag */}
                          <div className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-black/80 border border-primary-500/50 text-[10px] font-mono text-primary-300 shadow-md whitespace-nowrap">
                            {currentPreset.selector}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* App Core Dashboard Content */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                        <span className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                          Active Metric
                        </span>
                        <div className="text-xl font-bold text-white">99.4% Uptime</div>
                        <p className="text-xs text-zinc-500">Autonomous browser monitoring</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.04] border border-primary-500/30 ring-1 ring-primary-500/20 space-y-2 shadow-[0_0_24px_rgba(99,102,241,0.15)]">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-semibold text-primary-400 uppercase tracking-wider">
                            Focused Element
                          </span>
                          <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping"></span>
                        </div>
                        <div className="text-sm font-semibold text-white truncate">
                          {currentPreset.tagline}
                        </div>
                        <p className="text-xs text-zinc-400">Inspected by Playwright engine</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                        <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                          Critic Grounding
                        </span>
                        <div className="text-xl font-bold text-emerald-400 font-mono">100% Match</div>
                        <p className="text-xs text-zinc-500">Verified against live DOM node</p>
                      </div>
                    </div>

                    {/* App Lower Action Bar */}
                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-mono text-[11px]">Playwright Action: CLICK({currentPreset.selector})</span>
                      </div>
                      <span className="font-mono text-[11px]">Latency: 14ms (Isolated sandbox)</span>
                    </div>
                  </div>

                  {/* Simulated Moving macOS Virtual Cursor */}
                  <div
                    className="absolute pointer-events-none transition-all duration-700 ease-out z-20"
                    style={{
                      left: `${cursorPos.x}%`,
                      top: `${cursorPos.y}%`,
                    }}
                  >
                    <MousePointer2 className="w-5 h-5 text-white fill-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />
                    {isClicking && (
                      <span className="absolute -inset-2 rounded-full border border-primary-400 bg-primary-400/30 animate-ping"></span>
                    )}
                  </div>

                  {/* Floating Apple-Grade Frosted Glass Player HUD Bar */}
                  <div className="absolute bottom-6 inset-x-6 p-4 rounded-2xl glass-floating backdrop-blur-2xl border border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col gap-3">
                    {/* Top Row: Playback status, Scene info & Live Narration Waveform */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-9 h-9 rounded-xl bg-white/[0.12] hover:bg-white/[0.2] border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-sm"
                          aria-label={isPlaying ? "Pause demonstration" : "Play demonstration"}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">
                              Scene {activeSceneIdx + 1}: {currentScene.title}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.2 rounded bg-white/[0.08]">
                              {currentScene.time}
                            </span>
                          </div>
                          <p className="text-[12px] text-zinc-300 line-clamp-1 max-w-xl font-normal mt-0.5">
                            {currentScene.narration}
                          </p>
                        </div>
                      </div>

                      {/* Gemini TTS Audio Equalizer Animation */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-1 h-5 px-2 rounded-lg bg-black/40 border border-white/[0.08]">
                          {[60, 100, 40, 80, 50, 90, 70, 30].map((height, i) => (
                            <div
                              key={i}
                              className={`w-0.5 bg-primary-400 rounded-full transition-all duration-150 ${
                                isPlaying ? "animate-pulse" : "opacity-30"
                              }`}
                              style={{ height: isPlaying ? `${height}%` : "30%" }}
                            />
                          ))}
                          <span className="text-[10px] font-mono text-zinc-400 ml-1.5 hidden md:inline">
                            Gemini Studio TTS
                          </span>
                        </div>

                        <button
                          onClick={() => setIsAudioMuted(!isAudioMuted)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.08]"
                          title={isAudioMuted ? "Unmute" : "Mute"}
                        >
                          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Interactive Scrubber Timeline */}
                    <div className="flex items-center gap-3 pt-1 border-t border-white/[0.08]">
                      {/* Timeline Tracks for Each Scene */}
                      <div className="flex-1 flex gap-2">
                        {currentPreset.scenes.map((scene, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setActiveSceneIdx(idx);
                              setPlaybackProgress(0);
                            }}
                            className="flex-1 h-1.5 bg-white/20 hover:bg-white/40 rounded-full cursor-pointer relative overflow-hidden transition-all"
                          >
                            {idx === activeSceneIdx && (
                              <div
                                className="h-full bg-primary-400 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                                style={{ width: `${playbackProgress}%` }}
                              />
                            )}
                            {idx < activeSceneIdx && <div className="h-full bg-primary-400 rounded-full w-full" />}
                          </div>
                        ))}
                      </div>

                      <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                        00:0{activeSceneIdx * 7 + Math.floor((playbackProgress / 100) * 7)} / 00:24
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* INSTANT PRODUCT AUDIT / URL SIMULATOR BAR                  */}
          {/* ========================================================= */}
          <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20">
            <div className="p-6 rounded-3xl border border-white/[0.1] bg-[#0c0e17]/90 glass-panel shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-400" />
                    <span>Instant Evidence Sandbox</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Test how DemoPilot crawls any live product without touching your codebase
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className="text-[11px] text-zinc-500">Quick test:</span>
                  {["linear.app", "resend.com", "cal.com"].map((domain) => (
                    <button
                      key={domain}
                      onClick={() => handleSimulateInspect(`https://${domain}`)}
                      className="px-2 py-0.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] text-zinc-300 transition-colors font-mono"
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full">
                  <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    placeholder="https://your-product.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
                <Button
                  onClick={() => handleSimulateInspect()}
                  isLoading={simulatingInspect}
                  variant="glow"
                  className="w-full sm:w-auto h-11 px-6 font-semibold shrink-0"
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span>Inspect Evidence Map</span>
                </Button>
              </div>

              {/* Dynamic Simulation Progress Output */}
              {simulatingInspect && (
                <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-zinc-300 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-primary-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing target environment: {testUrl}</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-zinc-400">
                    {simulationStep >= 1 && (
                      <div className="text-emerald-400">✓ SSRF Security Filter: IP resolution verified safe (Public IPv4)</div>
                    )}
                    {simulationStep >= 2 && (
                      <div className="text-emerald-400">✓ Playwright Sandbox: Spawning ephemeral Chromium instance</div>
                    )}
                    {simulationStep >= 3 && (
                      <div className="text-primary-300">
                        ⚡ DOM Extractor: Discovered 28 interactive elements, 4 key routes, 0 hallucinations
                      </div>
                    )}
                    {simulationStep >= 4 && (
                      <div className="text-emerald-400 font-semibold">
                        ★ Ready to orchestrate evidence-grounded walkthrough!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================= */}
          {/* SECTION: THE CORE DIFFERENTIATOR (EVIDENCE VS HALLUCINATION)*/}
          {/* ========================================================= */}
          <section id="evidence" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 border-t border-white/[0.08]">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Law 1: The Core Differentiator</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Built from evidence, not hallucinated by an LLM.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                Generic AI video tools invent fake buttons, fabricate metrics, and hallucinate workflows. DemoPilot proves every single assertion against your live DOM.
              </p>
            </div>

            {/* Split Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Box 1: Generic AI Video Generators (The Flawed Way) */}
              <div className="p-7 rounded-3xl border border-rose-500/20 bg-[#120a0d]/60 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                    <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
                      Generic &ldquo;AI Video&rdquo; SaaS
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300">
                      High Hallucination Risk
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    Hallucinates fictitious workflows & distorted buttons
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Diffusers generate blurry images of what an interface &ldquo;might look like&rdquo;. Text is warped, buttons don&apos;t match production, and product claims are fabricated.
                  </p>

                  <ul className="space-y-2.5 text-xs text-zinc-400 pt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✗</span>
                      <span>Fabricates nonexistent feature claims without verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✗</span>
                      <span>Generates distorted AI screenshots that customers instantly recognize as fake</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✗</span>
                      <span>Zero audit trail: No one can explain why the AI said what it said</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-rose-500/20 font-mono text-[11px] text-rose-300">
                  Result: Prospect skepticism, lost enterprise trust, and outdated demos.
                </div>
              </div>

              {/* Box 2: DemoPilot Evidence-Grounded Engine (The Grounded Way) */}
              <div className="p-7 rounded-3xl border border-emerald-500/30 bg-[#07130f]/60 space-y-5 flex flex-col justify-between shadow-[0_0_40px_rgba(16,185,129,0.1)] relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                    <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>DemoPilot Grounded Architecture</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                      100% Verifiable
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    Every word linked to concrete DOM elements & browser actions
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    DemoPilot controls real Chromium via Playwright. Every scene is cross-verified by the Gemini Critic against live element selectors and milestone screenshots.
                  </p>

                  <ul className="space-y-2.5 text-xs text-zinc-300 pt-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Critic agent automatically rejects and rewrites unsupported claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Inspectable evidence drawer for your prospects, sales teams, and investors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Exact pixel-perfect product accuracy using native 1080p Playwright recording</span>
                    </li>
                  </ul>
                </div>

                {/* Inspectable Evidence Chain Demonstration */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 space-y-1.5">
                  <div className="text-[10px] text-zinc-400 uppercase">Live Evidence Chain:</div>
                  <div>Claim: &ldquo;Users can create tasks with keyboard shortcuts&rdquo;</div>
                  <div className="text-zinc-400">↳ Source: /dashboard • Hook: button[data-testid=&apos;btn-create-task&apos;]</div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SECTION: ASYMMETRICAL BENTO ARCHITECTURE GRID             */}
          {/* ========================================================= */}
          <section id="architecture" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 border-t border-white/[0.08]">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-mono font-semibold text-primary-400 uppercase tracking-widest">
                System Blueprint
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Crafted for engineering authority.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                A modular architecture built on Playwright Chromium, BullMQ, Gemini TTS, and FFmpeg video muxing.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: SSRF Sandboxed Browser Security (Spans 2 columns) */}
              <div className="md:col-span-2 p-8 rounded-3xl border border-white/[0.1] bg-[#0c0e17] glass-panel space-y-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Lock className="w-4 h-4" />
                    <span>Law 3: Security & Untrusted Input Isolation</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Hardened SSRF Browser Sandboxing
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                    Arbitrary websites are hostile inputs. DemoPilot enforces strict network socket filters before Playwright connects, aborting RFC 1918 private subnets, cloud metadata endpoints (169.254.169.254), and loopbacks.
                  </p>
                </div>

                {/* Interactive Simulated Security Terminal */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#07090e] p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-zinc-500">
                    <span>security_sandbox.log</span>
                    <span className="text-emerald-400">ENFORCED</span>
                  </div>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p className="text-zinc-400">
                      <span className="text-primary-400">[SOCKET_INIT]</span> Intercepting target request URL: https://app.datadog.com
                    </p>
                    <p className="text-zinc-400">
                      <span className="text-emerald-400">[DNS_RESOLVE]</span> Resolved to Public IP (104.18.22.42) → <span className="text-emerald-400">ALLOWED</span>
                    </p>
                    <p className="text-zinc-400">
                      <span className="text-rose-400">[SSRF_DEFENSE]</span> Attempted redirect to 169.254.169.254 → <span className="text-rose-400 font-bold">ABORTED (ERR_NETWORK_ACCESS_DENIED)</span>
                    </p>
                    <p className="text-zinc-500">
                      [SANDBOX] Chromium process isolated in ephemeral container with AES-256-GCM auth credentials.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Dual Output Engine */}
              <div className="p-8 rounded-3xl border border-white/[0.1] bg-[#0c0e17] glass-panel space-y-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-primary-400">
                    <Layers className="w-4 h-4" />
                    <span>Dual Output Engine</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Interactive Player & 1080p MP4
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Every generation yields both an ultra-lightweight (&lt;150KB) embeddable interactive web runtime with clickable hotspots and a broadcast-ready 1080p 60fps MP4 video.
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/[0.08]">
                  <Link href="/demo/taskflow-overview">
                    <Button variant="outline" size="sm" className="w-full text-xs justify-between">
                      <span>Launch Interactive Runtime</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Link href="/new">
                    <Button size="sm" className="w-full text-xs justify-between">
                      <span>Render 1080p MP4</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Card 3: Gemini Studio Narration Suite */}
              <div className="p-8 rounded-3xl border border-white/[0.1] bg-[#0c0e17] glass-panel space-y-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                    <Volume2 className="w-4 h-4" />
                    <span>Studio Narration</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Gemini TTS Audio Synthesis
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Broadcast speech generated with studio-grade natural cadence. Audio duration dictates scene pacing, with Playwright inserting seamless screen holds for complete alignment.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Voice Model: Puck (Studio)</span>
                    <span className="text-emerald-400">48kHz High Profile</span>
                  </div>
                  <div className="flex items-center gap-1 h-6">
                    {[40, 80, 100, 60, 90, 70, 50, 85, 95, 60, 40, 75, 90, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-500/80 rounded-full animate-pulse"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Inspectable Evidence Drawer (Spans 2 columns) */}
              <div className="md:col-span-2 p-8 rounded-3xl border border-white/[0.1] bg-[#0c0e17] glass-panel space-y-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verifiable Transparency</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Inspectable Evidence Drawer for Your Buyers
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                    Give high-intent buyers, technical evaluators, and security officers complete proof. Viewers can open the inspectable evidence drawer at any point during your demo to see the exact DOM selector, timestamp, and visual evidence backing the feature.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="glass"
                    onClick={() => setInspectorOpen(true)}
                    className="gap-2 text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Open Live Evidence Drawer Preview</span>
                  </Button>
                  <span className="text-xs text-zinc-500">Zero distorted graphics or invented capabilities.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SECTION: 5-STAGE AUTONOMOUS PIPELINE                      */}
          {/* ========================================================= */}
          <section id="pipeline" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 border-t border-white/[0.08]">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-mono font-semibold text-primary-400 uppercase tracking-widest">
                Choreographed Execution
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                From URL to walkthrough in 5 stages.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                No manual video editing, no screen recorders, no re-recording when your UI updates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  step: "01",
                  title: "Connect",
                  subtitle: "SSRF Sandbox Defense",
                  desc: "Submit your public or authenticated staging URL. Ephemeral Chromium contexts boot with clean cookies.",
                },
                {
                  step: "02",
                  title: "Understand",
                  subtitle: "DOM Element Mapping",
                  desc: "Crawls pages, discovers interactive UI components, buttons, and inputs to create a verified evidence graph.",
                },
                {
                  step: "03",
                  title: "Direct",
                  subtitle: "Validated Action Queue",
                  desc: "Choreographs mouse movements, clicks, typing, and tab transitions with exact millisecond pacing.",
                },
                {
                  step: "04",
                  title: "Narrate",
                  subtitle: "Critic Verification",
                  desc: "Generates professional narration scripts. The Critic verifier confirms 1:1 fidelity before TTS audio renders.",
                },
                {
                  step: "05",
                  title: "Publish",
                  subtitle: "Interactive & 1080p MP4",
                  desc: "Outputs an embeddable interactive scene runtime and encodes a visually lossless 1080p MP4 via FFmpeg.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0e17] hover:border-primary-500/40 transition-all flex flex-col justify-between space-y-4 group hover:-translate-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary-400">
                      {item.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary-400 transition-colors"></span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <p className="text-[11px] font-mono text-zinc-500 uppercase">{item.subtitle}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed pt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================= */}
          {/* SECTION: PRICING MATRIX WITH INTERACTIVE TOGGLE           */}
          {/* ========================================================= */}
          <section id="pricing" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 border-t border-white/[0.08]">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
              <span className="text-xs font-mono font-semibold text-primary-400 uppercase tracking-widest">
                Metered Transparency
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Simple, transparent pricing.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                Fairly metered by isolated browser execution minutes and Gemini TTS tokens.
              </p>

              {/* Monthly vs Annual Toggle */}
              <div className="pt-2 flex items-center justify-center">
                <div className="p-1 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center gap-1 backdrop-blur-md">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      billingCycle === "monthly" ? "bg-white/[0.12] text-white shadow" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      billingCycle === "annual" ? "bg-white/[0.12] text-white shadow" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {[
                {
                  name: "Starter",
                  price: "$0",
                  period: "forever free",
                  desc: "For indie founders, hackathons, and initial prototypes.",
                  features: [
                    "3 Complete demo generations / month",
                    "Isolated Playwright Chromium browser sandbox",
                    "Interactive web player embed (<150KB bundle)",
                    "720p Video export",
                    "Public web application target URLs",
                  ],
                  cta: "Get Started Free",
                  popular: false,
                  href: "/new",
                },
                {
                  name: "Professional",
                  price: billingCycle === "annual" ? "$39" : "$49",
                  period: "/ month",
                  desc: "For high-velocity SaaS engineering & product marketing teams.",
                  features: [
                    "Unlimited product walkthroughs",
                    "1080p 60fps MP4 export via FFmpeg",
                    "Gemini Studio TTS voice models",
                    "Inspectable Evidence Drawer with DOM selectors",
                    "Private authenticated applications (cookies & headers)",
                    "Priority Playwright queue workers",
                  ],
                  cta: "Start 14-Day Pro Trial",
                  popular: true,
                  href: "/new",
                },
                {
                  name: "Team & Enterprise",
                  price: billingCycle === "annual" ? "$119" : "$149",
                  period: "/ month",
                  desc: "For sales teams, developer platforms, and enterprise orgs.",
                  features: [
                    "Everything in Professional",
                    "Custom domain CNAME embedding",
                    "Organization RBAC (Owner, Admin, Member, Viewer)",
                    "AES-256-GCM dedicated KMS encryption",
                    "Dedicated isolated VPS worker node",
                    "Direct engineering support channel",
                  ],
                  cta: "Contact Enterprise",
                  popular: false,
                  href: "/new",
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`p-8 rounded-3xl border flex flex-col justify-between space-y-8 relative ${
                    tier.popular
                      ? "border-primary-500/60 bg-[#0e1220] shadow-[0_0_40px_rgba(99,102,241,0.25),inset_0_1px_0_0_rgba(255,255,255,0.15)] ring-1 ring-primary-500/40"
                      : "border-white/[0.08] bg-[#0c0e17] glass-panel"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                      {tier.popular && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-600 text-white tracking-wider uppercase">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{tier.desc}</p>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-white tracking-tight">{tier.price}</span>
                      <span className="text-xs text-zinc-500 font-mono">{tier.period}</span>
                    </div>

                    <ul className="space-y-3 text-xs text-zinc-300 pt-2 border-t border-white/[0.06]">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={tier.href}>
                    <Button
                      variant={tier.popular ? "glow" : "secondary"}
                      className="w-full text-xs font-semibold h-11"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================= */}
          {/* FINAL CTA BANNER                                          */}
          {/* ========================================================= */}
          <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <div className="p-10 sm:p-14 rounded-3xl border border-white/[0.12] bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(99,102,241,0.2),rgba(12,14,23,0.95))] glass-panel text-center space-y-6 shadow-2xl">
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Your product deserves to be seen as it actually is.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Connect your website URL now. Spawns an isolated Chromium sandbox and creates an evidence-grounded walkthrough in minutes.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link href="/new">
                  <Button size="lg" variant="glow" className="gap-2 font-semibold">
                    <span>Create your first demonstration</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/demo/taskflow-overview">
                  <Button variant="outline" size="lg" className="glass-surface">
                    <span>Watch interactive tour</span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ========================================================= */}
        {/* APPLE-STYLE CRAFTED FOOTER                                */}
        {/* ========================================================= */}
        <footer className="w-full border-t border-white/[0.08] py-12 bg-[#06070a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white tracking-tight">DemoPilot</span>
              <span className="text-zinc-600">—</span>
              <span>Your product, presented properly.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Playwright Workers: Operational
              </span>
              <span>•</span>
              <span>Gemini 1.5 Critic: Active</span>
            </div>
          </div>
        </footer>

        {/* Global Evidence Drawer Slide-over */}
        <EvidenceDrawer
          isOpen={inspectorOpen}
          onClose={() => setInspectorOpen(false)}
          evidence={{
            id: "hero-evidence-1",
            claim: currentScene.narration,
            pagePath: currentPreset.path,
            pageUrl: currentPreset.url,
            elementSelector: currentPreset.selector,
            elementText: currentPreset.selectorLabel,
            confidenceScore: currentPreset.evidenceScore,
            domSnippet: `<button data-testid="${currentPreset.selector.replace(/[^a-zA-Z0-9-]/g, "")}" class="btn-primary">\n  ${currentPreset.selectorLabel}\n</button>`,
            verifiedAt: new Date().toISOString(),
          }}
          sceneTitle={currentScene.title}
        />
      </div>
    </div>
  );
}
