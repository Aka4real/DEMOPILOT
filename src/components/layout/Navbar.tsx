"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Menu,
  X,
  Play,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-6 py-3">
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14 rounded-2xl transition-all duration-300 ${
          scrolled
            ? "glass-panel shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] border-white/[0.12] bg-[#090b12]/90"
            : "glass-surface border-white/[0.06] bg-[#090b12]/60"
        }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 via-indigo-500 to-primary-400 flex items-center justify-center text-white shadow-[0_0_16px_rgba(99,102,241,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]">
              <Compass className="w-4.5 h-4.5 stroke-[2.2] transition-transform duration-500 group-hover:rotate-45" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#090b12]"></span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              DemoPilot
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-white/[0.08] text-zinc-300 border border-white/[0.08]">
                v1.0
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-400">
          <Link
            href="#demo-studio"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Live Studio
          </Link>
          <Link
            href="#evidence"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Evidence First</span>
          </Link>
          <Link
            href="#architecture"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Architecture
          </Link>
          <Link
            href="#pipeline"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Pipeline
          </Link>
          <Link
            href="#pricing"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Pricing
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
              Console
            </Button>
          </Link>

          <Link href="/new">
            <Button size="sm" variant="glow" className="gap-1.5 text-xs font-semibold">
              <span>Create Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl glass-panel bg-[#090b12]/95 border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="#demo-studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.05]"
          >
            Live Studio
          </Link>
          <Link
            href="#evidence"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.05]"
          >
            Evidence First
          </Link>
          <Link
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.05]"
          >
            Architecture & Security
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.05]"
          >
            Pricing
          </Link>
          <div className="pt-2 border-t border-white/[0.08] flex gap-2">
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Console
              </Button>
            </Link>
            <Link href="/new" className="w-full">
              <Button variant="primary" size="sm" className="w-full text-xs">
                Create Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
