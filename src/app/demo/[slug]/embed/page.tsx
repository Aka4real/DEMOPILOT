"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { InteractiveDemoManifest, DemoScene } from "@/types";
import { cn } from "@/lib/utils";

export default function EmbedDemoPage({
  params,
}: {
  params: { slug: string };
}) {
  const [demo, setDemo] = useState<InteractiveDemoManifest | null>(null);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/demos/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.demo) {
          setDemo(data.demo);
        }
      })
      .catch((err) => console.error("Error fetching embed demo manifest:", err));
  }, [params.slug]);

  const scenes = demo?.scenes || [];
  const currentScene: DemoScene | undefined = scenes[currentSceneIdx];

  // Playback timer & progression
  useEffect(() => {
    if (!isPlaying || !currentScene) return;

    const interval = 100;
    const stepDurationMs = (currentScene.durationSec || 8) * 1000;

    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        const next = prev + (interval / stepDurationMs) * 100;
        if (next >= 100) {
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

  // SpeechSynthesis audio
  useEffect(() => {
    if (!isPlaying || isMuted || !currentScene?.narration?.text) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentScene.narration.text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSceneIdx, isPlaying, isMuted, currentScene]);

  if (!demo || !currentScene) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-xs text-zinc-500 font-mono">
        Loading DemoPilot Interactive Runtime…
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-zinc-950 text-white overflow-hidden select-none flex flex-col justify-between font-sans">
      {/* Top Header Watermark */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href={`/demo/${demo.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white hover:bg-black/80 transition-colors shadow-lg"
          >
            <Compass className="w-3.5 h-3.5 text-primary-400" />
            <span>{demo.productName}</span>
          </Link>

          <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/5">
            Scene {currentSceneIdx + 1}/{scenes.length}
          </span>
        </div>

        <button
          onClick={() => setInspectorOpen(true)}
          className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors shadow-lg"
          title="Inspect verified website DOM evidence"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>98% Grounded</span>
        </button>
      </div>

      {/* Main Screen Viewport */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="text-center space-y-2 max-w-lg z-10">
          <div className="text-xs font-mono text-primary-400 uppercase tracking-wider">
            {currentScene.title}
          </div>
          <p className="text-sm sm:text-base font-medium text-zinc-200 leading-relaxed drop-shadow-md">
            {currentScene.narration?.text || currentScene.purpose}
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-1">
            Target: {demo.targetUrl}
            {currentScene.pagePath}
          </div>
        </div>

        {currentScene.highlightSelector && (
          <div className="mt-4 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-[11px] font-mono text-primary-300 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping"></span>
            <span>Focus: {currentScene.highlightSelector}</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Pill */}
      <div className="p-4 z-20 flex flex-col items-center gap-2">
        {/* Scrub Bar */}
        <div className="w-full max-w-xl h-1 rounded-full bg-white/20 overflow-hidden cursor-pointer">
          <div
            className="h-full bg-primary-500 transition-all duration-100"
            style={{ width: `${sceneProgress}%` }}
          ></div>
        </div>

        <div className="px-4 py-2 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3 text-xs">
          <button
            onClick={() => {
              if (currentSceneIdx > 0) {
                setCurrentSceneIdx((c) => c - 1);
                setSceneProgress(0);
              }
            }}
            disabled={currentSceneIdx === 0}
            className="text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-500 transition-colors shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              if (currentSceneIdx < scenes.length - 1) {
                setCurrentSceneIdx((c) => c + 1);
                setSceneProgress(0);
              }
            }}
            disabled={currentSceneIdx === scenes.length - 1}
            className="text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3 bg-white/20"></span>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <span className="w-px h-3 bg-white/20"></span>

          <Link
            href={`/demo/${demo.slug}`}
            target="_blank"
            className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Full Player</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Evidence Drawer */}
      <EvidenceDrawer
        evidence={currentScene.evidence}
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </div>
  );
}
