import React from "react";
import Link from "next/link";
import { Plus, Film, ExternalLink, Play, Clock, ShieldCheck } from "lucide-react";
import { store } from "@/lib/storage/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await store.getProjects();

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            All evidence-grounded walkthroughs generated for your web products.
          </p>
        </div>

        <Link href="/new">
          <Button className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Create Demonstration</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-xl border border-border/80 bg-surface-1 hover:border-primary-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
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
                <span className="text-[11px] text-muted-foreground font-mono">
                  {formatDuration(proj.demoPlan?.estimatedDurationSec || 0)}
                </span>
              </div>

              <div>
                <Link
                  href={`/projects/${proj.id}`}
                  className="text-base font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                >
                  {proj.name}
                </Link>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {proj.targetUrl}
                </p>
              </div>

              {proj.productModel && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{proj.productModel.evidence.length} Verified Evidence Hooks</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <Link href={`/projects/${proj.id}`}>
                <Button variant="secondary" size="sm" className="text-xs">
                  Edit Story
                </Button>
              </Link>
              {proj.interactiveSlug && (
                <Link href={`/demo/${proj.interactiveSlug}`} target="_blank">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
