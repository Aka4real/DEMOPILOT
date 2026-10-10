# DemoPilot — Architectural Specification & Engineering Constitution

> Refer to the full workspace workflow in [law.md](file:///c:/Users/hp/DEMO%20PILOT/.agents/workflows/law.md) for the binding constitution, 20-point architectural specification, and phased execution roadmap.

## Key Principles Summary
1. **Source of Truth is Customer Product**: Every generated claim is traced to verified website evidence.
2. **Modular Monolith + Dedicated Workers**: Next.js App Router for web/API; BullMQ workers for Playwright, Gemini TTS, and FFmpeg rendering.
3. **Strict Multi-Tenancy**: Organization-scoped queries and RBAC throughout PostgreSQL.
4. **Security Hardened**: Full SSRF protection on Playwright browser workers; prompt injection containment; AES-256-GCM encryption for authenticated sessions.
5. **No Fake Functionality**: Every button and feature is backed by real execution.
