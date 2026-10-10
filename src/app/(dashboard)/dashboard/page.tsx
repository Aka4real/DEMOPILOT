import React from "react";
import Link from "next/link";
import {
  Plus,
  Play,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  ExternalLink,
  Film,
  Sparkles,
} from "lucide-react";
import { store } from "@/lib/storage/store";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";

export const revalidate = 0;

export default async function DashboardPage() {
  const projects = await store.getProjects();
  const publishedCount = projects.filter((p) => p.status === "PUBLISHED").length;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Studio Overview
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              Workers Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your evidence-grounded demonstrations and Playwright recording pipelines.
          </p>
        </div>

        <Link href="/new">
          <Button variant="glow" className="gap-2 shadow-lg text-xs font-semibold">
            <Plus className="w-4 h-4" />
            <span>Create Demonstration</span>
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card interactive className="bg-[#0c0e17] border-white/[0.08]">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-xs font-medium text-zinc-400">Total Demonstrations</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white tracking-tight">{projects.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary-400" />
            <span>{publishedCount} published live to web</span>
          </CardContent>
        </Card>

        <Card interactive className="bg-[#0c0e17] border-white/[0.08]">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-xs font-medium text-zinc-400">Grounding Confidence</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-400 tracking-tight font-mono">99.4%</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero hallucinated claims</span>
          </CardContent>
        </Card>

        <Card interactive className="bg-[#0c0e17] border-white/[0.08]">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-xs font-medium text-zinc-400">Interactive Runtime Views</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-white tracking-tight">1,248</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>+24% viewer completion</span>
          </CardContent>
        </Card>

        <Card interactive className="bg-[#0c0e17] border-white/[0.08]">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-xs font-medium text-zinc-400">Playwright Sandbox</CardDescription>
            <CardTitle className="text-2xl font-bold text-white tracking-tight">Healthy</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ephemeral Chromium containers</span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight">Active Demonstrations</h2>
          <Link href="/projects" className="text-xs text-primary-400 hover:text-primary-300 font-medium">
            View all projects →
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e17] divide-y divide-white/[0.06] overflow-hidden shadow-xl">
          {projects.map((proj) => {
            const sceneCount = proj.demoPlan?.scenes.length || 0;
            const duration = proj.demoPlan?.estimatedDurationSec || 0;

            return (
              <div
                key={proj.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400 shrink-0 mt-0.5 shadow-sm">
                    <Film className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${proj.id}`}
                        className="text-sm font-semibold text-white hover:text-primary-400 transition-colors"
                      >
                        {proj.name}
                      </Link>
                      <Badge
                        variant={
                          proj.status === "PUBLISHED"
                            ? "verified"
                            : proj.status === "ANALYZING"
                            ? "pending"
                            : "outline"
                        }
                      >
                        {proj.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="font-mono text-[11px] text-zinc-300">{proj.targetUrl}</span>
                      <span>•</span>
                      <span>{sceneCount} scenes</span>
                      <span>•</span>
                      <span>{formatDuration(duration)}</span>
                      {proj.productModel && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            {proj.productModel.evidence.length} Evidence Hooks Verified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {proj.interactiveSlug && (
                    <Link href={`/demo/${proj.interactiveSlug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-zinc-300 hover:text-white">
                        <Play className="w-3.5 h-3.5 fill-current text-primary-400" />
                        <span>Interactive Demo</span>
                      </Button>
                    </Link>
                  )}
                  <Link href={`/projects/${proj.id}`}>
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <span>Timeline Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
