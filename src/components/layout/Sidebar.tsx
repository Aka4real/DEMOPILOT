"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  FolderKanban,
  Film,
  Settings,
  CreditCard,
  Plus,
  ExternalLink,
  ChevronDown,
  Building2,
  Users,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Demonstrations", href: "/projects", icon: FolderKanban },
    { name: "Media Assets", href: "/media", icon: Film },
  ];

  const workspaceNav = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Team & Billing", href: "/settings/billing", icon: CreditCard },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#080a10] h-screen flex flex-col justify-between shrink-0 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-[0_0_12px_rgba(99,102,241,0.35)] transition-transform group-hover:scale-105">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white">
                DemoPilot
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Evidence Studio</span>
            </div>
          </Link>
          <div className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
            v1.0
          </div>
        </div>

        {/* Organization Switcher */}
        <div className="p-3">
          <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-white/[0.08] text-xs font-medium text-white transition-all shadow-sm active:scale-[0.99]">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-5 h-5 rounded-md bg-primary-500/20 text-primary-400 flex items-center justify-center text-[10px] font-bold">
                A
              </div>
              <span className="truncate">Acme Workspace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Quick Action */}
        <div className="px-3 pb-3">
          <Link href="/new">
            <Button size="sm" variant="glow" className="w-full gap-2 text-xs font-semibold h-9 shadow-md">
              <Plus className="w-4 h-4" />
              <span>Create Demonstration</span>
            </Button>
          </Link>
        </div>

        {/* Primary Navigation */}
        <div className="px-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            Demonstrations
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary-500/15 text-white font-semibold border border-primary-500/30 shadow-[inset_0_1px_0_rgba(99,102,241,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary-400" : "text-zinc-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Workspace Management */}
        <div className="px-3 mt-6 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            Workspace
          </div>
          {workspaceNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary-500/15 text-white font-semibold border border-primary-500/30 shadow-[inset_0_1px_0_rgba(99,102,241,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className="w-4 h-4 text-zinc-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / Status */}
      <div className="p-4 border-t border-white/[0.06] bg-[#05060a] space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Playwright Workers</span>
          </span>
          <span className="font-mono text-emerald-400 font-semibold">Idle (Ready)</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors pt-1"
        >
          <span>Marketing site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
