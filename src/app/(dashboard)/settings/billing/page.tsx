import React from "react";
import { CreditCard, HardDrive, Cpu, Users, ShieldCheck, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function BillingPage() {
  const usageMetrics = [
    { name: "Gemini Input Tokens", used: 142500, max: 1000000, unit: "tokens" },
    { name: "Gemini Output Tokens", used: 38200, max: 500000, unit: "tokens" },
    { name: "Gemini TTS Characters", used: 24150, max: 250000, unit: "chars" },
    { name: "Browser Automation (Playwright)", used: 48, max: 300, unit: "minutes" },
    { name: "FFmpeg Video Renders", used: 18, max: 120, unit: "minutes" },
    { name: "Object Storage", used: 4.2, max: 50, unit: "GB" },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="pb-6 border-b border-border/60">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Team & Usage Metering
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor your organization usage, API quotas, and team access permissions.
        </p>
      </div>

      {/* Subscription Card */}
      <Card className="p-6 border-primary-500/40 bg-surface-1 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-foreground">Professional Plan</span>
              <Badge variant="verified">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Renews automatically on November 1, 2026 ($49 / month).
            </p>
          </div>

          <Button variant="outline" size="sm" className="text-xs">
            Manage Subscription
          </Button>
        </div>
      </Card>

      {/* Usage Telemetry Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Usage Telemetry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {usageMetrics.map((m) => {
            const pct = Math.round((m.used / m.max) * 100);
            return (
              <div
                key={m.name}
                className="p-4 rounded-xl border border-border/80 bg-surface-1 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{m.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {m.used.toLocaleString()} / {m.max.toLocaleString()} {m.unit}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {pct}% of monthly quota used
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Organization Members</h2>
          <Button size="sm" variant="secondary" className="text-xs gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Invite Member</span>
          </Button>
        </div>

        <div className="rounded-xl border border-border/80 divide-y divide-border/60 bg-surface-1 overflow-hidden">
          {[
            { email: "founder@startup.io", role: "OWNER", name: "Alex Chen" },
            { email: "engineer@startup.io", role: "ADMIN", name: "Marcus Bell" },
            { email: "growth@startup.io", role: "MEMBER", name: "Sophia Torres" },
          ].map((u) => (
            <div key={u.email} className="p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-500/10 text-primary-600 font-semibold flex items-center justify-center text-xs">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{u.name}</div>
                  <div className="text-muted-foreground text-[11px] font-mono">{u.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-2 text-foreground font-semibold">
                  {u.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
