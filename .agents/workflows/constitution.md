---
description: a strict layout rule that must be followed to achieve th aim. the constitution 
---

# DEMOPILOT — MASTER ARCHITECTURAL CONSTITUTION & SYSTEM BLUEPRINT

> **"Your product, presented properly."**
> DemoPilot turns any web application or website into an evidence-grounded, professional product demonstration. The source of truth is always the customer's actual product; Gemini is the intelligence layer.

---

## PART I: THE DEMOPILOT CONSTITUTION & CORE LAWS

### Law 1: The Principle of Evidence-Grounded Demonstrations
Every claim, narration line, scene title, and user action produced by DemoPilot must be traceable to concrete, verifiable evidence extracted from the real website.
```
MODEL PROPOSES
  → APPLICATION VALIDATES
  → BROWSER EXECUTES
  → SYSTEM CAPTURES EVIDENCE
  → MODEL NARRATES
  → SYSTEM VERIFIES
  → RENDERER PRODUCES OUTPUT
```
- Never allow an LLM to freely invent product features or workflows.
- If the system asserts: *"Users can invite teammates with custom roles,"* there must exist an evidence record linking to a specific page (`/settings/team`), a visible element (`button:has-text("Invite Member")`), a DOM snapshot, and a verified browser interaction.
- The system must answer at any point: *"Why did DemoPilot say this?"* with an inspectable evidence map.

### Law 2: No Fake Functionality
- If a button says **Export Video**, it must queue a real FFmpeg render and produce an actual 1080p MP4.
- If a button says **Publish**, it must generate a live, shareable, permission-controlled interactive demo.
- Every state (Draft, Analyzing, Ready, Generating, Review, Published, Failed, Archived) must be supported by real backend state transitions and database records.

### Law 3: Security & Untrusted Input Isolation
- Arbitrary websites are hostile, untrusted inputs.
- All browser workers must run in isolated sandboxes with strict SSRF defenses (blocking private RFC 1918 subnets, loopbacks, link-local addresses, cloud metadata endpoints `169.254.169.254`, and file schemes).
- Scraped DOM contents and text must be treated strictly as **data**, never as instructions, using strict delimiter isolation to prevent prompt injection.
- User credentials for authenticated demos must be encrypted with AES-256-GCM and never queried in plain text or logged.

### Law 4: Visual & UX Excellence Bar
- Design system: **Material 3 Expressive** (geometry, elevation tokens, touch targets, state layers) fused with **Apple-inspired Frosted Glass** (floating command bars, contextual toolbars, audio/video controls, modal overlays).
- Avoid generic "AI SaaS" tropes: no purple neon gradients everywhere, no glowing blobs, no floating sparkle icons, no robot avatars, no fake testimonial stats.
- Design carries authority through typography (Inter/SF stack), deliberate whitespace, precision alignment, subtle micro-interactions (100–150ms transitions), and real product visual evidence.

---

## PART II: 20-POINT SYSTEM ARCHITECTURE BLUEPRINT

```
                                  +---------------------------------------+
                                  |         Internet / End Users          |
                                  +-------------------+-------------------+
                                                      |
                                          HTTPS (443) | Caddy Proxy
                                                      v
                                  +---------------------------------------+
                                  |         Next.js Web Monolith          |
                                  |  - Marketing Site (App Router)        |
                                  |  - SaaS Dashboard & Demo Editor       |
                                  |  - Interactive Demo Runtime Player    |
                                  |  - REST API & SSE Progress Stream     |
                                  |  - Auth.js / NextAuth Session Mgmt    |
                                  +---------+-------------------+---------+
                                            |                   |
                        Postgres Connection |                   | BullMQ Jobs
                                            v                   v
                               +------------+----+     +--------+--------+
                               |   PostgreSQL    |     |  Redis Queue &  |
                               | (Multi-Tenant)  |     |  PubSub Server  |
                               +-----------------+     +--------+--------+
                                                                |
                                             +------------------+------------------+
                                             |                                     |
                                             v                                     v
                               +-----------------------------+       +-----------------------------+
                               |    Browser Worker Engine    |       |    Media & Render Worker    |
                               | - Playwright (Chromium)     |       | - Gemini TTS Audio Client   |
                               | - SSRF Sandbox Defense      |       | - Audio Alignment Engine    |
                               | - DOM & Element Extractor   |       | - FFmpeg 1080p MP4 Pipeline |
                               | - WebM Video Screencaster   |       | - Caption / WebVTT Builder  |
                               +--------------+--------------+       +--------------+--------------+
                                              |                                     |
                                              +------------------+------------------+
                                                                 |
                                                                 v
                                               +---------------------------------+
                                               | S3 / MinIO Object Storage Engine|
                                               | - Screenshots & DOM Snapshots   |
                                               | - Narration Audio Assets (.mp3) |
                                               | - Rendered Demo Videos (.mp4)   |
                                               +---------------------------------+
```

---

### 1. System Architecture
DemoPilot is designed as a **Modular Monolith with Dedicated Asynchronous Workers**.
- **Next.js 14+ (App Router)**: Serves the public marketing site, authenticated dashboard, scene editor, interactive demo runtime player, and HTTP/SSE APIs.
- **Dedicated Worker Node**: Separate Node.js process running BullMQ workers. Isolate heavy browser execution (Playwright/Chromium) and video rendering (FFmpeg) from the web server process to prevent memory leaks and event-loop starvation.
- **Shared Storage**: PostgreSQL for all structured relational data and audit logs; Redis for queue management, job state cache, and SSE pub/sub; S3-compatible Object Storage (MinIO on VPS or AWS S3/Cloudflare R2) for media binaries.

---

### 2. Repository Structure
A clean, modular monorepo-friendly project layout using standard npm/pnpm workspaces or a modular monolith layout:
```
demopilot/
├── apps/
│   ├── web/                         # Next.js Application (UI + API + Runtime)
│   │   ├── app/
│   │   │   ├── (marketing)/         # Public landing, pricing, examples, docs
│   │   │   ├── (auth)/              # Login, register, verify, invite
│   │   │   ├── (dashboard)/         # App dashboard, project manager, media library
│   │   │   │   └── [orgSlug]/
│   │   │   │       ├── projects/
│   │   │   │       ├── new/         # Step-by-step Create Demo flow
│   │   │   │       ├── [projectId]/ # Demo Editor & Scene Timeline
│   │   │   │       └── settings/
│   │   │   ├── demo/[slug]/         # Standalone Interactive Demo Runtime
│   │   │   └── api/                 # REST API endpoints & SSE streams
│   │   ├── components/              # UI Component Library (M3 + Frosted Glass)
│   │   ├── hooks/                   # Custom React hooks (useDemoPlayer, useJobProgress)
│   │   └── lib/                     # Frontend utilities & auth helpers
│   └── worker/                      # Dedicated Background Worker Process
│       ├── src/
│       │   ├── queues/              # Queue definitions & Redis connection
│       │   ├── processors/
│       │   │   ├── analysis.worker.ts    # Crawler & DOM element mapper
│       │   │   ├── browser.worker.ts     # Playwright execution & recording
│       │   │   ├── narration.worker.ts   # Gemini TTS voice generation
│       │   │   ├── render.worker.ts      # FFmpeg video compositor
│       │   │   └── verification.worker.ts# Grounding & critic validation
│       │   └── index.ts             # Worker process bootstrap
├── packages/
│   ├── database/                    # Prisma Schema, Migrations, DB Client
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/index.ts
│   ├── ai/                          # Gemini SDK wrapper, structured prompt schemas
│   │   ├── src/
│   │   │   ├── analyzer.ts          # Product analysis prompts & Zod schemas
│   │   │   ├── planner.ts           # Demo scene planning prompts & Zod schemas
│   │   │   ├── narrator.ts          # Script generation & Gemini TTS caller
│   │   │   └── critic.ts            # Evidence verification & claim check
│   ├── browser-core/                # Playwright automation engine & security sandbox
│   │   ├── src/
│   │   │   ├── sandbox.ts           # SSRF validator, proxy, network filter
│   │   │   ├── crawler.ts           # Page mapping & element discovery
│   │   │   ├── recorder.ts          # Video frame recorder & DOM capture
│   │   │   └── actions.ts           # Safe action dispatcher (CLICK, TYPE, HOVER)
│   ├── media/                       # FFmpeg wrappers, subtitle generation, audio sync
│   └── types/                       # Shared TypeScript interfaces & Zod schemas
├── docker/
│   ├── Dockerfile.web
│   ├── Dockerfile.worker
│   ├── docker-compose.yml
│   └── Caddyfile
├── .env.example
├── package.json
└── tsconfig.base.json
```

---

### 3. Database Schema (PostgreSQL + Prisma)
The schema guarantees strict multi-tenancy, complete auditability, and full evidence-grounding:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum OrgRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum ProjectStatus {
  DRAFT
  ANALYZING
  READY
  GENERATING
  REVIEW
  PUBLISHED
  FAILED
  ARCHIVED
}

enum JobType {
  WEBSITE_ANALYSIS
  DEMO_PLANNING
  BROWSER_RECORDING
  NARRATION_SYNTHESIS
  VIDEO_RENDERING
  VERIFICATION
}

enum JobStatus {
  PENDING
  ACTIVE
  COMPLETED
  FAILED
  CANCELLED
}

enum ActionType {
  OPEN_URL
  NAVIGATE
  CLICK
  HOVER
  TYPE
  SCROLL
  SELECT
  WAIT
  SCREENSHOT
}

model Organization {
  id           String        @id @default(uuid())
  slug         String        @unique
  name         String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  members      OrganizationMember[]
  projects     Project[]
  subscriptions Subscription[]
  apiKeys      ApiKey[]
  usageEvents  UsageEvent[]
  auditLogs    AuditLog[]
}

model User {
  id           String        @id @default(uuid())
  email        String        @unique
  name         String?
  avatarUrl    String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  memberships  OrganizationMember[]
  auditLogs    AuditLog[]
}

model OrganizationMember {
  id             String       @id @default(uuid())
  organizationId String
  userId         String
  role           OrgRole      @default(MEMBER)
  createdAt      DateTime     @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
}

model Project {
  id  