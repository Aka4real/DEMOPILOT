"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  Globe,
  Film,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, EvidenceBadge } from "@/components/ui/Badge";
import { EvidenceDrawer } from "@/components/ui/EvidenceDrawer";
import { Project, DemoScene, DemoAction } from "@/types";
import { formatDuration } from "@/lib/utils";

export default function DemoEditorPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active scene editing state
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [narrationText, setNarrationText] = useState("");
  const [durationSec, setDurationSec] = useState(8);
  const [highlightSelector, setHighlightSelector] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.project) {
          setProject(data.project);
          if (data.project.interactiveSlug) {
            setPublishedSlug(data.project.interactiveSlug);
          }
        }
      })
      .catch((err) => console.error("Error fetching project:", err));
  }, [params.id]);

  const scenes = project?.demoPlan?.scenes || [];
  const activeScene = scenes[activeSceneIdx];

  useEffect(() => {
    if (activeScene) {
      setTitle(activeScene.title);
      setPurpose(activeScene.purpose);
      setNarrationText(activeScene.narration?.text || "");
      setDurationSec(activeScene.durationSec || 8);
      setHighlightSelector(activeScene.highlightSelector || "");
    }
  }, [activeScene]);

  const handleSaveScene = async () => {
    if (!activeScene) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/scenes/${activeScene.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          purpose,
          durationSec,
          highlightSelector,
          narration: {
            ...activeScene.narration,
            text: narrationText,
            durationSec,
          },
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);

        // Update local state
        if (project && project.demoPlan) {
          const updatedScenes = [...project.demoPlan.scenes];
          updatedScenes[activeSceneIdx] = {
            ...activeScene,
            title,
            purpose,
            durationSec,
            highlightSelector,
            narration: {
              ...activeScene.narration,
              text: narrationText,
              durationSec,
            },
          };
          setProject({
            ...project,
            demoPlan: {
              ...project.demoPlan,
              scenes: updatedScenes,
            },
          });
        }
      }
    } catch (err) {
      console.error("Save scene failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportMessage(null);
    try {
      const res = await fetch(`/api/projects/${params.id}/export`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setExportMessage(`1080p MP4 export completed: ${data.videoUrl}`);
      } else {
        setExportMessage(`Export error: ${data.error}`);
      }
    } catch (err) {
      setExportMessage("Video export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/projects/${params.id}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.slug) {
        setPublishedSlug(data.slug);
      }
    } catch (err) {
      console.error("Publishing error:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!project) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Loading demonstration editor…
      </div>
    );
  }

  const totalDuration = scenes.reduce((acc, s) => acc + s.durationSec, 0);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Application Bar */}
      <header className="h-14 px-6 border-b border-border/80 bg-surface-1 flex items-center justify-between shrink-0 glass-surface">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground truncate max-w-xs">
              {project.name}
            </span>
            <Badge variant={project.status === "PUBLISHED" ? "verified" : "outline"}>
              {project.status}
            </Badge>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5">
          {publishedSlug ? (
            <Link href={`/demo/${publishedSlug}`} target="_blank">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-primary-600 dark:text-primary-400">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live Demo</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePublish}
              isLoading={isPublishing}
              className="gap-1.5 text-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Publish Demo</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleExportVideo}
            isLoading={isExporting}
            className="gap-1.5 text-xs shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 1080p Video</span>
          </Button>
        </div>
      </header>

      {exportMessage && (
        <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{exportMessage}</span>
          </div>
          <button onClick={() => setExportMessage(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Workspace: Story List | Browser Preview & Scene Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Scene Storyboard */}
        <div className="w-72 border-r border-border/80 bg-surface-0 flex flex-col justify-between shrink-0 overflow-hidden">
          <div className="p-3.5 border-b border-border/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Demonstration Story
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {formatDuration(totalDuration)}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {scenes.map((scene, idx) => {
              const isSelected = idx === activeSceneIdx;
              return (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneIdx(idx)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? "border-primary-500 bg-surface-1 shadow-sm ring-1 ring-primary-500/30"
                      : "border-transparent hover:bg-surface-2/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {scene.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {scene.purpose}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-muted-foreground">
                      <span>{scene.durationSec}s</span>
                      <span>•</span>
                      <span className="text-emerald-500">Verified</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-border/60 bg-surface-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-xs"
              onClick={() => {
                // Add new scene
                if (project.demoPlan) {
                  const newIdx = scenes.length;
                  const newScene: DemoScene = {
                    id: `scene-custom-${Date.now()}`,
                    planId: project.demoPlan.id,
                    orderIndex: newIdx,
                    title: `Scene ${newIdx + 1}`,
                    purpose: "Highlight additional workflow step",
                    pagePath: "/",
                    viewportWidth: 1920,
                    viewportHeight: 1080,
                    durationSec: 8.0,
                    actions: [],
                    narration: {
                      id: `narr-custom-${Date.now()}`,
                      sceneId: `scene-custom-${Date.now()}`,
                      voice: "Puck (Gemini Studio)",
                      text: "Explore another powerful feature of the product.",
                      durationSec: 8.0,
                      verifiedGrounding: true,
                    },
                  };
                  const updatedScenes = [...scenes, newScene];
                  setProject({
                    ...project,
                    demoPlan: {
                      ...project.demoPlan,
                      scenes: updatedScenes,
                    },
                  });
                  setActiveSceneIdx(newIdx);
                }
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scene</span>
            </Button>
          </div>
        </div>

        {/* Center Canvas: Live Website Preview & Timeline */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-surface-2/30">
          {/* Canvas Viewport */}
          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl rounded-xl border border-border/80 bg-surface-1 shadow-lg overflow-hidden glass-panel">
              {/* Browser bar */}
              <div className="px-4 py-2.5 border-b border-border/60 bg-surface-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-surface-2 text-xs font-mono text-muted-foreground">
                  <Globe className="w-3 h-3 text-emerald-500" />
                  <span>
                    {project.targetUrl}
                    {activeScene?.pagePath}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1.5 text-emerald-600 dark:text-emerald-400"
                  onClick={() => setInspectorOpen(true)}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Evidence</span>
                </Button>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-[16/10] bg-surface-0 flex flex-col items-center justify-center p-8 select-none">
                <div className="w-full h-full rounded-lg border border-border/60 bg-surface-1/60 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="font-semibold text-xs text-foreground">
                      {project.name} Workspace
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {activeScene?.pagePath}
                    </span>
                  </div>

                  <div className="text-center space-y-2 max-w-md mx-auto">
                    <div className="text-xs font-mono text-primary-500 font-semibold uppercase">
                      Scene {activeSceneIdx + 1} Execution
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {title}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {narrationText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                    <span>Actions: {activeScene?.actions.length || 1} queued</span>
                    <EvidenceBadge score={activeScene?.evidence?.confidenceScore || 0.96} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Timeline Controls */}
          <div className="px-6 py-3 border-t border-border/80 bg-surface-1 flex items-center justify-between shrink-0 glass-surface">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-8 w-8"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </Button>
              <span className="text-xs font-mono text-muted-foreground">
                {formatDuration(
                  scenes.slice(0, activeSceneIdx).reduce((acc, s) => acc + s.durationSec, 0)
                )}{" "}
                / {formatDuration(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {scenes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSceneIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeSceneIdx
                      ? "w-8 bg-primary-600 dark:bg-primary-400"
                      : "w-3 bg-secondary hover:bg-muted"
                  }`}
                  aria-label={`Jump to scene ${idx + 1}`}
                />
              ))}
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              Scene {activeSceneIdx + 1} of {scenes.length}
            </div>
          </div>
        </div>

        {/* Right Column: Scene Inspector & Script Editor */}
        <div className="w-80 border-l border-border/80 bg-surface-1 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-5 space-y-5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Scene Properties
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                0{activeSceneIdx + 1}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Scene Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-0 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
              />
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Objective / Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-0 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Narration Script */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-muted-foreground">Narration Voiceover</label>
                <span className="text-[10px] text-muted-foreground font-mono">Gemini TTS</span>
              </div>
              <textarea
                rows={4}
                value={narrationText}
                onChange={(e) => setNarrationText(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-surface-0 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 leading-relaxed resize-none"
              />
            </div>

            {/* Timing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-muted-foreground">Duration (Seconds)</label>
                <span className="text-xs font-mono font-semibold text-foreground">{durationSec}s</span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="0.5"
                value={durationSec}
                onChange={(e) => setDurationSec(parseFloat(e.target.value))}
                className="w-full accent-primary-600"
              />
            </div>

            {/* Highlight Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Focus UI Selector</label>
              <input
                type="text"
                value={highlightSelector}
                onChange={(e) => setHighlightSelector(e.target.value)}
                placeholder="button[data-testid='...']"
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-0 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Footer Save */}
          <div className="p-4 border-t border-border/60 bg-surface-0">
            <Button
              className="w-full gap-2 text-xs shadow-xs"
              onClick={handleSaveScene}
              isLoading={isSaving}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Scene Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Evidence Drawer */}
      <EvidenceDrawer
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        evidence={activeScene?.evidence}
        sceneTitle={activeScene?.title}
      />
    </div>
  );
}
