import React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "verified" | "pending" | "failed";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default:
      "bg-primary-500/10 text-primary-400 border-primary-500/25 shadow-[0_0_12px_rgba(99,102,241,0.15)]",
    secondary:
      "bg-white/[0.05] text-zinc-300 border-white/[0.08]",
    outline:
      "border-white/[0.12] text-foreground bg-transparent",
    verified:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    pending:
      "bg-amber-500/10 text-amber-400 border-amber-500/30",
    failed:
      "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function EvidenceBadge({
  score = 0.98,
  className,
}: {
  score?: number;
  className?: string;
}) {
  const isHigh = score >= 0.9;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border shadow-md backdrop-blur-md transition-all cursor-default select-none",
        isHigh
          ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.2)]"
          : "bg-amber-950/50 text-amber-300 border-amber-500/40",
        className
      )}
      title={`Grounding confidence: ${Math.round(score * 100)}% verified against website DOM snapshot`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span>{Math.round(score * 100)}% Grounded</span>
    </span>
  );
}
