"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  FileText,
  ShieldCheck,
  Compass,
  ExternalLink,
  Globe,
  Share2,
  Check,
  Code,
  Copy,
  X,
  Lock,
  Maximize2,
  CheckCircle2,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, EvidenceBadge } from "@/components/ui/Badge";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { InteractiveDemoManifest, DemoScene } from "@/types";
import { formatDuration } from "@/lib/utils";

export default function InteractiveDemoPage({
  params,
}: {
  params: { slug: string };
}) {
  const [demo, setDemo] = useState<InteractiveDemoManifest | null>(null);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  useEffect(() => {
    fetch(`/api/demos/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.demo) {
          setDemo(data.demo);
        }
      })
      .catch((err) => console.error("Error fetching demo manifest:", err));
  }, [params.slug]);

  const scenes = demo?.scenes || [];
  const currentScene: DemoScene | undefined = scenes[currentSceneIdx];

  // Playback timer & scene progression
  useEffect(() => {
    if (!isPlaying || !currentScene) return;

    const interval = 100; // 100ms ticks
    const stepDurationMs = (currentScene.durationSec || 8) * 1000;

    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        const next = prev + (interval / stepDurationMs) * 100;
        if (next >= 100) {
          // Advance to next scene or loop/pause
          if (currentSceneIdx < scenes.length - 1) {
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, currentScene, scenes.length]);

  const handleNext = React.useCallback(() => {
    setCurrentSceneIdx((prev) => {
      if (prev < scenes.length - 1) {
        setSceneProgress(0);
        return prev + 1;
      }
      return prev;
    });
  }, [scenes.length]);

  const handlePrev = React.useCallback(() => {
    setCurrentSceneIdx((prev) => {
      if (prev > 0) {
        setSceneProgress(0);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        setIsMuted((m) => !m);
      } else if (e.code === "KeyE") {
        e.preventDefault();
        setInspectorOpen((o) => !o);
      } else if (e.code === "KeyT") {
        e.preventDefault();
        setShowTranscript((t) => !t);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Voice narration speech synthesis (browser-native TTS preview)
  useEffect(() => {
    if (!isPlaying || isMuted || !currentScene?.narration?.text) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentScene.narration.text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSceneIdx, isPlaying, isMuted, currentScene]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!demo || !currentScene) {
    return (
      <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center text-xs text-zinc-400 gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 animate-spin">
          <Compass className="w-4 h-4" />
        </div>
        <span>Initializing evidence-grounded runtime…</span>
      </div>
    );
  }

  const totalDuration = scenes.reduce((acc, s) => acc + s.durationSec, 0);

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col justify-between selection:bg-primary-500/30 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="h-14 px-6 border-b border-white/[0.08] bg-[#090b12]/80 backdrop-blur-xl flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white tracking-tight">DemoPilot</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-medium text-zinc-300 truncate max-w-sm">
            {demo.productName} Interactive Tour
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
            Interactive Runtime
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInspectorOpen(true)}
            className="text-xs gap-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/25"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Grounding Evidence</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmbedModal(true)}
            className="text-xs gap-1.5 text-zinc-300 hover:text-white hover:bg-white/10"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Embed</span>
          </Button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 z-20">
        <div className="w-full max-w-5xl rounded-3xl border border-white/[0.12] bg-[#0c0e17] shadow-[0_24px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col glass-panel">
          {/* Simulated Browser Bar */}
          <div className="px-4 py-3 border-b border-white/[0.08] bg-[#090b12]/90 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90"></div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/[0.08] font-mono text-[11px] text-zinc-300 max-w-md w-full mx-4 truncate">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{demo.targetUrl}{currentScene.pagePath}</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span className="text-white font-medium">Scene {currentSceneIdx + 1}</span>
              <span className="text-zinc-600">/</span>
              <span>{scenes.length}</span>
            </div>
          </div>

          {/* Interactive Screen Canvas */}
          <div className="relative aspect-[16/10] bg-[#090b12] flex flex-col justify-between p-6 sm:p-8 select-none overflow-hidden">
            {/* Demonstrated UI Frame */}
            <div className="w-full h-full rounded-2xl border border-white/[0.08] bg-[#0e121e]/80 p-6 sm:p-8 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    {demo.productName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm text-white">
                    {demo.productName} Workspace
                  </span>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-zinc-400 border-white/10">
                  {currentScene.pagePath}
                </Badge>
              </div>

              {/* Dynamic Interactive Hotspot / Focus Center */}
              <div className="text-center space-y-4 max-w-lg mx-auto my-auto p-6 rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-sm relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                  <span>Scene 0{currentSceneIdx + 1}</span>
                  <span>•</span>
                  <span>{currentScene.title}</span>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                  {currentScene.purpose}
                </h2>

                {currentScene.highlightSelector && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-600/20 border border-primary-500/40 text-xs font-mono text-primary-300">
                      <MousePointer2 className="w-3.5 h-3.5" />
                      <span>Action Focus: {currentScene.highlightSelector}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-zinc-400">
                <span className="font-mono text-[11px]">
                  Playwright Timeline offset: 0.0s → {currentScene.durationSec}s
                </span>
                <EvidenceBadge score={currentScene.evidence?.confidenceScore || 0.98} />
              </div>
            </div>

            {/* Transcript Overlay */}
            {showTranscript && (
              <div className="absolute top-6 left-6 right-6 p-5 rounded-2xl bg-[#090b12]/95 border border-white/[0.15] backdrop-blur-2xl text-xs text-zinc-200 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-30">
                <div className="font-semibold text-white flex items-center justify-between pb-1 border-b border-white/[0.08]">
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary-400" />
                    <span>Gemini TTS Narration Script</span>
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">{currentScene.narration?.voice}</span>
                </div>
                <p className="leading-relaxed text-zinc-300 text-sm">
                  &ldquo;{currentScene.narration?.text}&rdquo;
                </p>
              </div>
            )}

            {/* Scene Bottom Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/[0.08]">
              <div
                className="h-full bg-primary-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all duration-100 ease-linear"
                style={{ width: `${sceneProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Apple-Grade Media Control Bar */}
      <footer className="p-4 sm:p-6 flex flex-col items-center z-30">
        <div className="w-full max-w-3xl p-3.5 rounded-2xl glass-floating flex items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Play/Pause & Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              disabled={currentSceneIdx === 0}
              className="text-white hover:bg-white/10 h-8 w-8 disabled:opacity-30"
              aria-label="Previous scene"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              onClick={() => {
                if (sceneProgress >= 100) setSceneProgress(0);
                setIsPlaying(!isPlaying);
              }}
              className="bg-white text-zinc-950 hover:bg-zinc-200 h-9 w-9 rounded-full shadow-md font-bold transition-all active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentSceneIdx === scenes.length - 1}
              className="text-white hover:bg-white/10 h-8 w-8 disabled:opacity-30"
              aria-label="Next scene"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Scene Stepper Buttons */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-center px-4">
            {scenes.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSceneIdx(idx);
                  setSceneProgress(0);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSceneIdx
                    ? "w-8 bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                    : "w-3 bg-white/20 hover:bg-white/40"
                }`}
                title={s.title}
                aria-label={`Jump to scene ${idx + 1}`}
              />
            ))}
          </div>

          {/* Audio Equalizer, Transcript & Timing */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTranscript(!showTranscript)}
              className={`h-8 w-8 ${
                showTranscript ? "text-primary-400 bg-white/10" : "text-zinc-300 hover:text-white"
              }`}
              title="Toggle Transcript (T)"
            >
              <FileText className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className={`h-8 w-8 ${isMuted ? "text-rose-400" : "text-zinc-300 hover:text-white"}`}
              title={isMuted ? "Unmute (M)" : "Mute (M)"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <span className="text-xs font-mono text-zinc-400 pl-1">
              {formatDuration(totalDuration)}
            </span>
          </div>
        </div>

        {/* Keyboard helper hint */}
        <div className="pt-2 text-[11px] font-mono text-zinc-500 hidden sm:flex items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">Space</kbd> Play/Pause</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">←/→</kbd> Seek</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">E</kbd> Evidence</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">T</kbd> Transcript</span>
        </div>
      </footer>

      {/* Grounding Evidence Drawer */}
      <EvidenceDrawer
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        evidence={currentScene?.evidence}
        sceneTitle={currentScene?.title}
      />

      {/* Share & Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0c0e17] border border-white/[0.12] rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl glass-panel">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Share & Embed Demonstration</h3>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Direct Share Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== "undefined" ? window.location.href : ""}
                    className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-zinc-300"
                  />
                  <Button size="sm" variant="outline" onClick={handleShare} className="text-xs gap-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Responsive Embed Snippet</label>
                <textarea
                  rows={4}
                  readOnly
                  value={`<iframe src="${typeof window !== "undefined" ? window.location.origin : "https://demopilot.app"}/demo/${demo.slug}/embed" width="100%" height="560" frameborder="0" allow="autoplay; fullscreen" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);"></iframe>`}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-zinc-400 focus:outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="glow"
                    className="text-xs gap-1.5 font-semibold"
                    onClick={() => {
                      const snippet = `<iframe src="${typeof window !== "undefined" ? window.location.origin : "https://demopilot.app"}/demo/${demo.slug}/embed" width="100%" height="560" frameborder="0" allow="autoplay; fullscreen" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);"></iframe>`;
                      navigator.clipboard.writeText(snippet);
                      setCopiedEmbed(true);
                      setTimeout(() => setCopiedEmbed(false), 2000);
                    }}
                  >
                    {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmbed ? "Snippet Copied" : "Copy Embed Code"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
