# Contractors OS — Complete Technical Documentation

> Everything that exists in this codebase as of 2026-03-16, what it does, and how to use it.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [Multi-Tenancy System](#multi-tenancy-system)
6. [Authentication & Authorization](#authentication--authorization)
7. [Database Schema](#database-schema)
8. [Supabase Edge Functions](#supabase-edge-functions)
9. [Frontend Application](#frontend-application)
10. [AI Integration](#ai-integration)
11. [Payments (Stripe Connect)](#payments-stripe-connect)
12. [Notifications System](#notifications-system)
13. [State Management](#state-management)
14. [Brand Identity (.win)](#brand-identity-win)
15. [Environment Variables](#environment-variables)
16. [Local Development](#local-development)
17. [Deployment](#deployment)
18. [Known Issues & TODOs](#known-issues--todos)

---

## Project Overview

**Contractors OS** (branded as **.win**) is a multi-tenant SaaS platform for home services businesses. It combines a client acquisition engine (public website with booking flow) with a full business operating system (CRM, project management, invoicing, AI tools).

| Field | Value |
|---|---|
| Platform URL | `contractorsos.com` |
| First Tenant | Grand Traverse Home Co. (`grandtraverse.contractorsos.com`) |
| Build Status | All 17 phases complete |
| Total Pages | 71 routes |
| Total DB Tables | 82 |
| Total Edge Functions | 21 deployed |
| Total UI Components | 46 shadcn/ui + 4 custom |

---

## Architecture

```
┌───────────────────────────────────────────────────────┐
│                    BROWSER                             │
│   Next.js 16 (App Router) — React 19 — TypeScript     │
│   Route Groups: (marketing) (portal) (admin) (platform)│
└──────────────┬────────────────────────────────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────────────────────────────┐
│              VERCEL (Hosting)                          │
│   Static + SSR pages — NO /api routes                 │
│   middleware.ts → tenant resolution + auth             │
└──────────────┬────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│           SUPABASE                                    │
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Postgres    │  │ Edge Functions│  │   Auth      │ │
│  │  82 tables   │  │ 21 functions │  │  Email/Pass │ │
│  │  RLS on all  │  │ Deno runtime │  │  Google OAuth│ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌──────────────┐                   │
│  │  Storage     │  │  Realtime    │                   │
│  │  (planned)   │  │  (planned)   │                   │
│  └─────────────┘  └──────────────┘                   │
└──────────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│         EXTERNAL SERVICES                             │
│  Anthropic API · OpenAI API · Stripe Connect          │
│  Twilio · SendGrid/SES (placeholder)                  │
└──────────────────────────────────────────────────────┘
```

**Key architectural rule:** Next.js is frontend-only. Zero `/api` routes. All server logic lives in Supabase Edge Functions.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.x (strict mode) |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS | 4.x |
| Component Library | shadcn/ui | latest (uses @base-ui/react) |
| Database | Supabase (Postgres 15) | latest |
| Auth | Supabase Auth | latest |
| Edge Runtime | Supabase Edge Functions (Deno) | latest |
| AI (Primary) | Anthropic Claude | claude-sonnet-4-6 |
| AI (Secondary) | OpenAI | gpt-4o |
| Payments | Stripe Connect | latest |
| SMS | Twilio | latest |
| State (Server) | @tanstack/react-query | 5.90.21 |
| State (Client) | Zustand | 5.0.11 |
| Forms | react-hook-form + Zod | 7.71.2 / 4.3.6 |
| Icons | Lucide React | 0.577.0 |
| Dates | date-fns | 4.1.0 |
| Charts | Recharts | 2.15.4 |
| Animations | Framer Motion | 12.36.0 |
| Toast | Sonner | 2.0.7 |
| Package Manager | pnpm | latest |

### Full Dependencies (package.json)

```json
{
  "@base-ui/react": "^1.3.0",
  "@hookform/resolvers": "^5.2.2",
  "@stripe/stripe-js": "^8.9.0",
  "@supabase/ssr": "^0.9.0",
  "@supabase/supabase-js": "^2.99.1",
  "@tanstack/react-query": "^5.90.21",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "date-fns": "^4.1.0",
  "embla-carousel-react": "^8.6.0",
  "framer-motion": "^12.36.0",
  "input-otp": "^1.4.2",
  "lucide-react": "^0.577.0",
  "nanoid": "^5.1.6",
  "next": "16.1.6",
  "next-themes": "^0.4.6",
  "react": "19.2.3",
  "react-compare-slider": "^3.1.0",
  "react-day-picker": "^9.14.0",
  "react-dom": "19.2.3",
  "react-hook-form": "^7.71.2",
  "react-resizable-panels": "^4.7.3",
  "recharts": "2.15.4",
  "shadcn": "^4.0.8",
  "slugify": "^1.6.8",
  "sonner": "^2.0.7",
  "stripe": "^20.4.1",
  "tailwind-merge": "^3.5.0",
  "tw-animate-css": "^1.4.0",
  "vaul": "^1.1.2",
  "zod": "^4.3.6",
  "zustand": "^5.0.11"
}
```

---

## Repository Structure

```
Contractors-OS/
├── .mcp.json                          # MCP server config (Supabase + Vercel)
├── .prettierrc                        # Code formatting
├── CLAUDE.md                          # Build instructions (root copy)
├── package.json                       # Root monorepo
├── pnpm-workspace.yaml                # Workspace: apps/*
│
├── docs/
│   ├── OS_SINGLE_SOURCE_OF_TRUTH.md   # Living project state — READ FIRST
│   ├── BUILD_PHASES.md                # All 17 phase instructions
│   ├── CLAUDE.md                      # Build instructions (docs copy)
│   └── dotwin-brand-guide.md          # Brand identity guide
│
├── apps/web/                          # Next.js application
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── components.json                # shadcn/ui config
│   │
│   ├── public/
│   │   └── logos/                     # 8 .win logo variants
│   │
│   └── src/
│       ├── middleware.ts              # Tenant resolution + route protection
│       ├── app/
│       │   ├── layout.tsx             # Root layout (fonts, providers, toaster)
│       │   ├── globals.css            # Tailwind CSS + CSS variables
│       │   ├── page.tsx               # Root page (redirects)
│       │   │
│       │   ├── (marketing)/           # Public website (10 pages)
│       │   ├── (admin)/               # Contractor dashboard (35 pages)
│       │   ├── (portal)/              # Client portal (7 pages)
│       │   ├── (platform)/            # Platform admin (7 pages)
│       │   └── auth/                  # Auth pages (5 pages)
│       │
│       ├── components/
│       │   ├── ui/                    # 46 shadcn/ui components
│       │   ├── marketing/             # Header.tsx, Footer.tsx
│       │   ├── providers/             # QueryProvider, TenantThemeProvider
│       │   ├── admin/                 # (placeholder dir)
│       │   ├── portal/                # (placeholder dir)
│       │   └── shared/                # (placeholder dir)
│       │
│       ├── hooks/
│       │   └── use-mobile.ts          # Mobile detection hook
│       │
│       └── lib/
│           ├── utils.ts               # cn() classname utility
│           ├── supabase/
│           │   ├── client.ts          # Browser Supabase client
│           │   ├── server.ts          # Server Supabase client (SSR)
│           │   ├── middleware.ts       # Middleware Supabase client
│           │   ├── edge.ts            # callEdgeFunction() helper
│           │   └── types.ts           # DB types (placeholder — needs generation)
│           ├── tenant/
│           │   ├── context.tsx         # TenantProvider + useTenant()
│           │   ├── resolver.ts        # resolveTenant() — domain → tenant_id
│           │   └── theme.ts           # themeToCSS() + defaultTheme
│           ├── hooks/
│           │   ├── use-tenant.ts      # Re-export of useTenant()
│           │   └── use-user.ts        # useUser() — auth state hook
│           └── stores/
│               └── booking-store.ts   # Zustand store for booking flow
│
└── supabase/
    ├── seed.sql                       # Grand Traverse Home Co. seed data
    ├── migrations/
    │   └── .gitkeep                   # Migration deployed directly to Supabase
    └── functions/
        ├── _shared/
        │   ├── cors.ts                # CORS headers
        │   ├── auth.ts                # createSupabaseClient(), createServiceClient(), getAuthUser()
        │   ├── response.ts            # jsonResponse(), errorResponse(), corsResponse()
        │   └── tenant.ts              # getTenantForUser()
        ├── ai/
        │   ├── _shared/model-resolver.ts  # resolveModel()
        │   ├── generate/index.ts          # Unified AI generation
        │   └── chat/index.ts              # AI chat conversations
        ├── auth/
        │   ├── on-signup/index.ts         # Post-signup webhook
        │   └── invite/index.ts            # User invitations
        ├── leads/
        │   ├── capture/index.ts           # Public booking form → lead
        │   └── score/index.ts             # AI lead scoring
        ├── payments/
        │   ├── create-checkout/index.ts   # Stripe checkout session
        │   └── webhook/index.ts           # Stripe event handler
        ├── documents/
        │   ├── generate-proposal/index.ts # AI proposal generation
        │   └── generate-contract/index.ts # AI contract generation
        ├── notifications/
        │   ├── send/index.ts              # Unified dispatcher
        │   ├── email/index.ts             # Email sender
        │   └── sms/index.ts              # SMS via Twilio
        ├── tenants/
        │   ├── provision/index.ts         # New tenant setup
        │   └── resolve/index.ts           # Domain → tenant lookup
        └── webhooks/
            └── dispatch/index.ts          # Outbound webhook sender
```

---

## Multi-Tenancy System

### How It Works

Every request is resolved to a tenant context through the middleware:

```
Browser hits grandtraversehomeco.com
    ↓
middleware.ts extracts hostname
    ↓
Looks up tenant_domains table → finds tenant_id
    ↓
Sets x-tenant-id header + tenant-id cookie
    ↓
TenantProvider reads tenant_id, fetches theme config
    ↓
CSS variables injected → page renders with tenant branding
```

### Tenant Resolution Logic (`src/middleware.ts`)

1. **Custom domain** → Query `tenant_domains` where `domain = hostname` and `is_verified = true`
2. **Subdomain** (`*.contractorsos.com`) → Extract slug, query `tenants` where `slug = slug` and `status = active`
3. **Platform domain** (`contractorsos.com`, `localhost`, `*.vercel.app`) → No tenant context (platform admin mode)

### Tenant Context (`lib/tenant/context.tsx`)

```typescript
// In any client component:
import { useTenant } from "@/lib/hooks/use-tenant";

function MyComponent() {
  const { tenant, theme, tenantId, isPlatform } = useTenant();
  // tenant.name, tenant.slug, tenant.phone, etc.
  // theme.color_primary, theme.font_heading, etc.
}
```

### Theme System (`lib/tenant/theme.ts`)

The `themeToCSS()` function converts a tenant theme to CSS variables:

```typescript
const cssVars = themeToCSS(theme);
// Returns: { "--tenant-primary": "#1B3A2D", "--tenant-secondary": "#2E75B6", ... }
```

Default theme (when no tenant): black/white with Outfit font and gold accent (#D4A84B).

### Route Groups and Access Control

| Route Group | Path Prefix | Who | Auth Required | Tenant Required |
|---|---|---|---|---|
| `(marketing)` | `/`, `/services`, `/portfolio`, `/about`, `/contact`, `/book`, `/faq`, `/reviews` | Public visitors | No | Yes (for branding) |
| `(admin)` | `/admin/*` | Contractor staff | Yes | Yes |
| `(portal)` | `/portal/*` | Clients | Yes | Yes |
| `(platform)` | `/platform/*` | Platform super-admins | Yes | No |
| `auth` | `/auth/*` | Anyone | No | Optional |

---

## Authentication & Authorization

### Setup

Uses **Supabase Auth** with two providers:
- **Email/password** — standard signup + login
- **Google OAuth** — configured in Supabase dashboard

### Supabase Client Creation

| Context | File | Function |
|---|---|---|
| Browser components | `lib/supabase/client.ts` | `createClient()` → `createBrowserClient()` |
| Server components | `lib/supabase/server.ts` | `createServerSupabaseClient()` → `createServerClient()` |
| Middleware | `lib/supabase/middleware.ts` | `updateSession()` → handles cookie-based sessions |
| Edge functions (user auth) | `_shared/auth.ts` | `createSupabaseClient(req)` — uses user's Authorization header |
| Edge functions (admin) | `_shared/auth.ts` | `createServiceClient()` — uses service role key, bypasses RLS |

### Auth Hook (`lib/hooks/use-user.ts`)

```typescript
import { useUser } from "@/lib/hooks/use-user";

function MyComponent() {
  const { user, loading } = useUser();
  // user is Supabase User object or null
}
```

### Auth Pages

| Page | Path | Purpose |
|---|---|---|
| Login | `/auth/login` | Email/password + Google OAuth |
| Signup | `/auth/signup` | New account creation |
| Forgot Password | `/auth/forgot-password` | Password reset email |
| Callback | `/auth/callback` | OAuth redirect handler (route.ts) |
| Accept Invite | `/auth/accept-invite` | Team member invitation flow |

### Route Protection (middleware.ts)

- Public paths (`/`, `/services`, etc.) → always allowed
- Auth paths (`/auth/*`) → if already logged in, redirect to `/admin/dashboard`
- Everything else (`/admin/*`, `/portal/*`, `/platform/*`) → redirect to `/auth/login?redirect=...` if no user

### Demo Mode

When `NEXT_PUBLIC_SUPABASE_URL` is not set, middleware returns a no-op (all routes allowed). Pages render with hardcoded demo data.

---

## Database Schema

### Migration

The initial schema was deployed directly to Supabase (5,000+ line migration). It includes:

- **5 Postgres extensions:** `uuid-ossp`, `pgcrypto`, `pg_trgm`, `btree_gist`, `postgis`
- **98 enumerations** (541+ values)
- **82 tables** with RLS on all
- **283 indexes**
- **10 Postgres functions**
- **2 materialized views**
- `updated_at` triggers on all mutable tables

### Table Groups

| Group | Tables | Description |
|---|---|---|
| Platform | `tenants`, `tenant_themes`, `tenant_domains`, `platform_admins`, `feature_flags` | Multi-tenancy core |
| Auth | `users`, `invitations`, `user_sessions` | User management |
| CRM | `clients`, `contacts`, `properties`, `leads`, `notes` | Customer relationship management |
| Projects | `projects`, `project_phases`, `tasks`, `task_dependencies`, `daily_logs`, `project_photos` | Project management |
| Estimating | `service_catalog`, `material_library`, `estimates`, `estimate_line_items`, `proposals` | Estimates & proposals |
| Contracts | `contracts`, `contract_templates`, `change_orders`, `lien_waivers`, `permits`, `inspections` | Contract management |
| Financial | `invoices`, `invoice_line_items`, `payments`, `payment_logs`, `draw_schedules`, `expenses`, `purchase_orders` | Money in/out |
| Staffing | `employees`, `subcontractors`, `vendors`, `crews`, `crew_members`, `time_entries`, `certifications` | People management |
| Scheduling | `schedule_events` | Calendar events |
| Communications | `threads`, `messages`, `notifications`, `email_log`, `sms_log`, `communication_templates` | Messaging |
| Documents | `document_folders`, `documents` | File management |
| Reviews | `reviews` | Client testimonials |
| AI | `ai_generations`, `ai_conversations`, `ai_templates`, `ai_model_registry`, `ai_module_routing`, `ai_ab_tests`, `ai_ab_test_results`, `ai_api_keys`, `automation_rules` | AI system |
| Fleet | `vehicles`, `equipment`, `maintenance_log` | Vehicle/equipment tracking |
| Warranty | `warranties`, `warranty_claims` | Post-project warranties |
| Safety | `safety_incidents` | Safety tracking |
| CMS | `website_pages`, `portfolio_projects` | Content management |
| Activity | `activity_log`, `tags`, `tag_assignments` | Audit trail |
| Reporting | `saved_reports`, `analytics_events` | Report configs |
| Integrations | `integration_connections`, `integration_sync_log`, `webhooks`, `webhook_log` | Third-party connections |
| Sequences | `tenant_sequences` | Auto-incrementing IDs per tenant |

### Key Postgres Functions

| Function | Purpose |
|---|---|
| `resolve_ai_model(tenant_id, module)` | Returns the configured AI model for a tenant + module |
| `next_sequence(tenant_id, type)` | Returns next auto-increment value (e.g., `GTHC-INV-0001`) |
| `initialize_tenant_sequences(tenant_id)` | Creates default sequences for a new tenant |

### Materialized Views

| View | Purpose |
|---|---|
| `project_financials` | Aggregated financial data per project |
| `tenant_dashboard` | Aggregated metrics per tenant |

### Seed Data

`supabase/seed.sql` provisions the first tenant:

- **Tenant:** Grand Traverse Home Co. (ID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- **Theme:** Forest green (#1B3A2D) primary, blue secondary, gold accent, Playfair Display + Inter fonts
- **Domains:** `grandtraversehomeco.com` (primary) + `grandtraverse.contractorsos.com`
- **Services:** 6 services (Kitchen Remodeling, Bathroom Remodeling, Custom Home Building, General Contracting, Deck & Outdoor Living, Basement Finishing)
- **AI Routing:** 7 modules all routed to `claude-sonnet-4-6`
- **Sequences:** Invoice, estimate, proposal, contract, project (prefix `GTHC-`)

---

## Supabase Edge Functions

### Shared Utilities (`supabase/functions/_shared/`)

#### `cors.ts`
```typescript
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};
```

#### `auth.ts`
- `createSupabaseClient(req)` — Creates a Supabase client using the user's Authorization header
- `createServiceClient()` — Creates a Supabase client using the service role key (bypasses RLS)
- `getAuthUser(supabase)` — Returns the authenticated user or null

#### `response.ts`
- `jsonResponse(data, status)` — JSON response with CORS headers
- `errorResponse(message, status)` — Error JSON response with CORS headers
- `corsResponse()` — Empty "ok" response for OPTIONS preflight

#### `tenant.ts`
- `getTenantForUser(supabase, userId)` — Looks up tenant_id from users table

### Function Registry

| Function | Method | Auth | Description |
|---|---|---|---|
| **`ai/generate`** | POST | User token | Unified AI generation — resolves model from routing table, calls Anthropic or OpenAI, logs to `ai_generations` |
| **`ai/chat`** | POST | User token | AI chat with conversation history support |
| **`auth/on-signup`** | POST | Webhook | Creates user record in `users` table after Supabase Auth signup |
| **`auth/invite`** | POST | Admin token | Sends team member invitation email |
| **`leads/capture`** | POST | Public | Receives booking form submission, creates lead record |
| **`leads/score`** | POST | Internal | AI-powered lead scoring (0-100) |
| **`payments/create-checkout`** | POST | User token | Creates Stripe Checkout Session with `transfer_data` to tenant's connected account |
| **`payments/webhook`** | POST | Stripe signature | Handles `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`, `account.updated` |
| **`documents/generate-proposal`** | POST | Admin token | AI-generated proposal content (cover letter, scope, timeline, pricing, terms) |
| **`documents/generate-contract`** | POST | Admin token | AI-generated contract content |
| **`notifications/send`** | POST | Internal | Unified dispatcher — checks user preferences, routes to email/SMS/in-app |
| **`notifications/email`** | POST | Internal | Email sender (placeholder — needs SendGrid/SES integration) |
| **`notifications/sms`** | POST | Internal | SMS sender via Twilio |
| **`tenants/provision`** | POST | Platform admin | Creates new tenant + theme + subdomain + sequences + AI routing defaults |
| **`tenants/resolve`** | GET | Public | Returns tenant config for a given domain |
| **`webhooks/dispatch`** | POST | Internal | Sends outbound webhooks to configured URLs |

### Calling Edge Functions from Frontend

```typescript
import { callEdgeFunction } from "@/lib/supabase/edge";

// AI generation
const result = await callEdgeFunction("ai/generate", {
  module: "scope_generator",
  prompt: "Build a 500 sqft composite deck",
  tenant_id: "...",
  project_id: "...",
});

// Lead capture (public — no auth needed for this one)
await callEdgeFunction("leads/capture", {
  tenant_id: "...",
  project_type: "kitchen-remodeling",
  contact: { firstName: "John", email: "john@example.com" },
});
```

### AI Generate — Detailed Flow

```
1. Frontend calls: callEdgeFunction("ai/generate", { module, prompt, tenant_id })
2. Edge function authenticates user via Authorization header
3. Calls Postgres function: resolve_ai_model(tenant_id, module)
4. Gets back: { model_key, api_model_id, provider, temperature, max_tokens }
5. Routes to provider:
   - "anthropic" → POST https://api.anthropic.com/v1/messages
   - "openai" → POST https://api.openai.com/v1/chat/completions
6. Logs generation to ai_generations table (model, tokens, duration, cost)
7. Returns: { result, model, duration_ms }
```

### Stripe Webhook — Event Handling

| Event | Action |
|---|---|
| `checkout.session.completed` | Updates payment_logs with stripe_payment_intent_id |
| `payment_intent.succeeded` | Updates invoice paid_amount + status, creates payment record |
| `charge.refunded` | Updates payment to refunded, adjusts invoice paid_amount |
| `account.updated` | Updates tenant's Stripe account flags (charges/payouts enabled) |

---

## Frontend Application

### Root Layout (`app/layout.tsx`)

Provides:
- Google Fonts: Yeseva One, Outfit, Playfair Display, Dancing Script
- QueryProvider (React Query)
- TooltipProvider (shadcn/ui)
- Sonner Toaster (toast notifications)

### Route Group: Marketing (`(marketing)/`)

Public-facing website for client acquisition. Tenant-branded.

| Page | Path | Description |
|---|---|---|
| Homepage | `/` | Hero section, services overview, how it works, social proof, CTA |
| Services | `/services` | Grid of 9 service cards |
| Service Detail | `/services/[slug]` | Dynamic page per service with features, process, pricing range |
| Portfolio | `/portfolio` | Grid of 6 project cards with images |
| Project Detail | `/portfolio/[slug]` | Before/after gallery, project details, testimonial |
| About | `/about` | Team story, values, certifications, team photos |
| Contact | `/contact` | Contact form + company info (phone, email, address, hours) |
| Reviews | `/reviews` | 8 customer testimonials with star ratings |
| FAQ | `/faq` | 10 questions in accordion format |
| Book | `/book` | 6-step booking/project planner flow |

#### Booking Flow (`/book`) — 6 Steps

1. **Project Type** — 9 visual cards (Kitchen, Bathroom, Deck, Custom Home, Basement, Addition, Siding, Roofing, General)
2. **Smart Questions** — Dynamic follow-up questions based on selected project type
3. **Scope & Size** — Dimensions (L×W), complexity, timeline preference, budget range
4. **Instant Estimate** — Calculated locally (no AI required) using base prices × complexity × sqft multipliers
5. **Schedule** — Date picker + time slot selector for consultation
6. **Account** — Contact info collection, lead capture via `leads/capture` edge function

State managed by Zustand store (`lib/stores/booking-store.ts`).

### Route Group: Admin (`(admin)/`)

Contractor business dashboard. 35 pages across 13 sections.

| Section | Pages | Key Features |
|---|---|---|
| **Dashboard** | `/admin/dashboard` | 4 KPI cards, leads table, upcoming events, quick actions |
| **Leads** | `/admin/leads`, `/admin/leads/[id]` | Kanban (6 columns) + list view, lead detail with 5 tabs |
| **Clients** | `/admin/clients`, `/admin/clients/[id]` | Directory with search/filter, detail with 7 tabs |
| **Projects** | `/admin/projects`, `/admin/projects/[id]` | Grid/list views, detail with 8 tabs (phases, tasks, logs, photos, financials) |
| **Estimates** | `/admin/estimates`, `/admin/estimates/[id]` | List + builder with line items and sections |
| **Proposals** | `/admin/proposals`, `/admin/proposals/[id]` | List + builder (6 sections), Good/Better/Best tiers, AI generation |
| **Contracts** | `/admin/contracts`, `/admin/contracts/[id]` | List + detail with sections, timeline, e-sign placeholder |
| **Invoices** | `/admin/invoices`, `/admin/invoices/[id]` | List + builder with line items, tax, payment tracking |
| **Scheduling** | `/admin/scheduling` | Calendar with week/day views, event creation |
| **Staffing** | `/admin/staffing`, `staffing/employees`, `staffing/subcontractors`, `staffing/vendors` | Hub + directories for employees, subs, vendors |
| **Documents** | `/admin/documents` | Folder/file vault with upload |
| **Messages** | `/admin/messages` | Conversation threads, channel selector |
| **Reports** | `/admin/reports` | 4 tabs (Financial, Projects, Leads, Custom), charts, export |
| **AI** | `/admin/ai`, `/admin/ai/history` | Chat interface + generation history table |
| **Settings** | 8 sub-pages | Services, Materials, Payments, Templates, Contract Templates, AI Config, AI A/B Tests, Automations, Integrations, Webhooks |

#### Admin Layout

- Black sidebar (collapsible) with 13 navigation items + .win logo
- Top header bar with search, notifications bell, user avatar
- Content area fills remaining space

### Route Group: Portal (`(portal)/`)

Client-facing portal. 7 pages.

| Page | Path | Description |
|---|---|---|
| Dashboard | `/portal/dashboard` | Active projects, recent activity, outstanding balance |
| Projects | `/portal/projects` | Project list |
| Project Detail | `/portal/projects/[id]` | Phase timeline, progress tracking |
| Messages | `/portal/messages` | Conversation threads with contractor |
| Payments | `/portal/payments` | Invoice list, payment history, pay button |
| Documents | `/portal/documents` | Shared files organized by folder |

#### Portal Layout

- Top navigation bar with logo + mobile Sheet menu
- Clean, client-friendly interface

### Route Group: Platform (`(platform)/`)

Super-admin dashboard for managing the entire platform. 7 pages.

| Page | Path | Description |
|---|---|---|
| Dashboard | `/platform/dashboard` | Platform-wide metrics (tenants, revenue, AI usage) |
| Tenants | `/platform/tenants` | Tenant directory with status badges |
| Tenant Detail | `/platform/tenants/[id]` | 5 tabs: Overview, Settings, Branding, Domains, Users |
| New Tenant | `/platform/tenants/new` | 6-step provisioning wizard |
| AI Config | `/platform/ai-config` | Global model registry, module routing, A/B tests |
| Feature Flags | `/platform/feature-flags` | Toggle features per tenant or globally |
| Monitoring | `/platform/monitoring` | System health, error rates, API usage |

### Components

#### shadcn/ui (46 installed)

```
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb,
button, calendar, card, carousel, chart, checkbox, collapsible, command,
context-menu, dialog, drawer, dropdown-menu, hover-card, input, input-group,
input-otp, label, menubar, navigation-menu, pagination, popover, progress,
radio-group, resizable, scroll-area, select, separator, sheet, sidebar,
skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group,
tooltip
```

#### Custom Components

| Component | Path | Usage |
|---|---|---|
| Header | `components/marketing/Header.tsx` | Marketing pages — logo, nav, CTA button |
| Footer | `components/marketing/Footer.tsx` | Marketing pages — links, "Powered by .win" |
| QueryProvider | `components/providers/QueryProvider.tsx` | Root layout — React Query context |
| TenantThemeProvider | `components/providers/TenantThemeProvider.tsx` | Root layout — CSS variable injection |

---

## AI Integration

### Architecture

Every AI call follows the same pattern:

```
Frontend → callEdgeFunction("ai/generate", { module, prompt, context })
                    ↓
Edge Function (ai/generate/index.ts)
                    ↓
resolve_ai_model(tenant_id, module) — Postgres function
                    ↓
Returns: { model_key, api_model_id, provider, temperature, max_tokens }
                    ↓
Routes to Anthropic or OpenAI API
                    ↓
Logs to ai_generations table
                    ↓
Returns { result, model, duration_ms }
```

### AI Modules

| Module | Used In | Purpose |
|---|---|---|
| `scope_generator` | Booking flow | Generates project scope from user inputs |
| `estimate_builder` | Estimates | Generates estimate line items |
| `proposal_writer` | Proposals | Generates proposal sections |
| `contract_drafter` | Contracts | Generates contract content |
| `email_writer` | Communications | Drafts emails |
| `chat` | AI Chat | General-purpose assistant |
| `lead_scorer` | Lead management | Scores leads 0-100 |

### Model Registry

Seeded with 8 models:

| Model Key | Provider | API Model ID |
|---|---|---|
| `claude-sonnet-4-6` | anthropic | claude-sonnet-4-6 |
| `claude-opus-4-6` | anthropic | claude-opus-4-6 |
| `claude-haiku` | anthropic | claude-3-haiku-20240307 |
| `gpt-4o` | openai | gpt-4o |
| `gpt-4o-mini` | openai | gpt-4o-mini |
| `gpt-4-turbo` | openai | gpt-4-turbo |
| `gemini-pro` | google | gemini-1.5-pro |
| `gemini-flash` | google | gemini-1.5-flash |

Default fallback: `claude-sonnet-4-6` (temperature 0.7, max_tokens 4096).

### A/B Testing

The platform supports A/B testing different AI models per module:
- Configure via `/platform/ai-config` or `/admin/settings/ai/ab-tests`
- Tests split traffic between two models
- Results tracked in `ai_ab_test_results`

---

## Payments (Stripe Connect)

### Architecture

- **Platform account** owns the Stripe platform
- Each **tenant** has a **connected account** (Stripe Connect)
- Payments use `transfer_data` to route funds to the tenant's connected account
- Platform takes a configurable fee percentage

### Flow

```
Client clicks "Pay" on invoice
    ↓
Frontend calls: callEdgeFunction("payments/create-checkout", { invoice_id, tenant_id })
    ↓
Edge function creates Stripe Checkout Session:
  - line_items from invoice
  - transfer_data.destination = tenant's Stripe connected account ID
  - application_fee_amount = platform fee %
    ↓
Returns checkout URL → client redirected to Stripe
    ↓
After payment, Stripe sends webhook → payments/webhook edge function
    ↓
Webhook updates: invoice (paid_amount, status), payments table, payment_logs
```

### Settings

Configured at `/admin/settings/payments`:
- Stripe Connect account connection
- Platform fee percentage
- Payment method preferences

---

## Notifications System

### Architecture

```
Trigger (e.g., payment received, message sent)
    ↓
notifications/send edge function
    ↓
Checks user notification preferences
    ↓
Routes to channels:
  ├── In-app → inserts into notifications table
  ├── Email → notifications/email (placeholder — needs SendGrid/SES)
  └── SMS → notifications/sms (Twilio)
```

### Templates

8 communication templates with merge variables:
- New Lead, Appointment Confirmation, Proposal Sent, Contract Signed
- Invoice Sent, Payment Received, Project Update, Review Request

### Automation Rules

6 rules configured at `/admin/settings/automations`:
- trigger → action pairs (e.g., "new lead" → "send welcome email")
- Enable/disable toggle per rule

---

## State Management

| Type | Library | Usage |
|---|---|---|
| Server state | React Query (`@tanstack/react-query`) | Supabase data fetching with caching |
| Client UI state | Zustand | Sidebar state, modal state, booking flow |
| Form state | react-hook-form + Zod | All forms with validation |

### Booking Store (`lib/stores/booking-store.ts`)

Zustand store for the 6-step booking flow:

```typescript
import { useBookingStore } from "@/lib/stores/booking-store";

// In component:
const { step, projectType, answers, estimate, nextStep, setProjectType } = useBookingStore();
```

State includes: step, projectType, answers, dimensions, complexity, timeline, budgetRange, estimate, consultation date/time, contact info.

---

## Brand Identity (.win)

### Fonts

| Font | Role | Weight | Usage |
|---|---|---|---|
| Yeseva One | Display/hero | 400 | Marketing hero headlines, "Contractors" brand text |
| Outfit | Everything else | 300-900 | Headings (600), body (400), buttons (600 uppercase), labels (500) |
| Playfair Display | Tenant override | 400-800 | Used by Grand Traverse Home Co. for headings |

### Color Palette

| Color | Hex | Usage |
|---|---|---|
| Black | `#000000` | Primary brand, admin sidebar, buttons |
| White | `#FFFFFF` | Backgrounds, text on dark |
| Off-white | `#FAFAFA` | Page backgrounds |
| Charcoal | `#1A1A1A` | Body text |
| Gray-50 | `#F9F7F5` | Subtle backgrounds |
| Gray-100 | `#F0EDEA` | Card backgrounds |
| Gray-200 | `#E0DBD5` | Borders |
| Gray-400 | `#A39E97` | Muted text |
| Gray-600 | `#6B6560` | Secondary text |
| Gray-800 | `#3D3834` | Dark accents |
| Gold accent | `#D4A84B` | Premium moments, stars, highlights |
| Success | `#2D6A4F` | Positive states |
| Warning | `#CC8A00` | Warning states |
| Error | `#C1292E` | Error states |
| Info | `#1B4965` | Informational states |

### Logo Files (`public/logos/`)

| File | Context |
|---|---|
| `win black logo-horizontal-nobg.png` | Light backgrounds, headers |
| `win white logo-horizontal-blackbg.png` | Dark backgrounds, admin sidebar |
| `win black logo-square-white bg.png` | Square contexts, light |
| `win white square black bg.png` | Square contexts, dark |
| `win-black-circle-white-letters.png` | Circular badge, dark |
| `win white circle black letters.png` | Circular badge, light |
| `dot-win circle more padding.png` | Avatars, profiles |
| `dot-win-circle-most padding.png` | Smallest contexts |

### Design Rules

- No gradients
- Max border-radius: 8px
- No illustrations or cartoons
- Animations: fade up on scroll (20px, 150ms), hover transitions (150ms ease)
- Admin sidebar: black with white text
- Icons: Lucide only, stroke width 1.5px
- Every tenant page: "Powered by .win" in footer

---

## Environment Variables

```env
# ===== CRITICAL: Required for app to function =====

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jedtxxytfajeoqeqaegz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# ===== AI: Required for AI features =====
ANTHROPIC_API_KEY=<your-anthropic-key>
OPENAI_API_KEY=<your-openai-key>

# ===== Payments: Required for Stripe features =====
STRIPE_SECRET_KEY=<your-stripe-secret>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-publishable-key>

# ===== Notifications: Required for SMS =====
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>

# ===== E-Signatures: Not yet integrated =====
DOCUSIGN_INTEGRATION_KEY=
DOCUSIGN_SECRET_KEY=
DOCUSIGN_ACCOUNT_ID=

# ===== Platform Config =====
NEXT_PUBLIC_PLATFORM_URL=https://contractorsos.com
NEXT_PUBLIC_PLATFORM_DOMAIN=contractorsos.com
NEXT_PUBLIC_APP_NAME=Contractors OS
```

**Without Supabase env vars:** App runs in "demo mode" — middleware allows all routes, pages render with hardcoded demo data.

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm
- Supabase CLI (optional, for local Supabase)

### Commands

```bash
# Install dependencies
cd apps/web && pnpm install

# Start Next.js dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

### With Local Supabase (optional)

```bash
supabase start                    # Start local Supabase
supabase functions serve          # Serve edge functions locally
```

### Generate Types from Live Schema

```bash
npx supabase gen types typescript --project-id jedtxxytfajeoqeqaegz > apps/web/src/lib/supabase/types.ts
```

---

## Deployment

### Vercel

Not yet configured. The app builds successfully and is ready for Vercel deployment:

1. Link Vercel project to the `apps/web` directory
2. Set all environment variables in Vercel dashboard
3. Configure custom domains:
   - `contractorsos.com` (platform)
   - `*.contractorsos.com` (tenant subdomains — requires Vercel wildcard domain)
   - `grandtraversehomeco.com` (first tenant custom domain)

### Edge Function Deployment

```bash
supabase functions deploy ai-generate --project-ref jedtxxytfajeoqeqaegz
supabase functions deploy payments-webhook --project-ref jedtxxytfajeoqeqaegz
# ... etc for each function
```

### MCP Servers (.mcp.json)

Two MCP servers configured for Claude Code:
- **Supabase MCP** — requires `SUPABASE_SERVICE_ROLE_KEY` env var
- **Vercel MCP** — requires `VERCEL_API_TOKEN` env var

---

## Known Issues & TODOs

| Issue | Severity | Description |
|---|---|---|
| Supabase types placeholder | Medium | `lib/supabase/types.ts` is `Record<string, any>`. Generate real types from live schema. |
| Vercel not configured | Low | No Vercel project linked. Build works locally. |
| Email integration placeholder | Medium | `notifications/email` logs only. Needs SendGrid or SES integration. |
| E-signature not integrated | Medium | Contract UI has placeholder. Needs DocuSign or HelloSign API. |
| Token counting not implemented | Low | AI generation logs `tokens_in: 0, tokens_out: 0`. Parse from provider response. |
| Google provider not implemented | Low | Model registry has Gemini entries but `ai/generate` only handles `anthropic` and `openai`. |
| Charts use CSS divs | Low | Reports page uses Tailwind-based bars. Recharts is installed but not wired up. |
| Middleware deprecation warning | Info | Next.js 16 warns "middleware" convention deprecated in favor of "proxy". |

### Post-Launch Roadmap

1. Generate Supabase types from live schema
2. Configure Vercel deployment + custom domains
3. Integrate SendGrid/SES for email notifications
4. Integrate DocuSign/HelloSign for e-signatures
5. Wire up Recharts for real chart components
6. Add Google Gemini provider to AI generation
7. Implement token counting in AI logging
8. Add Supabase Realtime for live updates (messages, notifications)
9. Lighthouse performance audit + optimization
10. Second tenant provisioning
