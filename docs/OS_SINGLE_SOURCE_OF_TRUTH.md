# CONTRACTORS OS — SINGLE SOURCE OF TRUTH

> **This document is the living memory of the entire Contractors OS platform.**
> Claude Code MUST read this file before every build session.
> Claude Code MUST update this file after every completed phase.
> If it is not in this document, it does not exist.

---

## LAST UPDATED

- **Date:** 2026-03-15
- **Last Phase Completed:** Phase 16 — Integrations
- **Next Phase:** Phase 17 — Grand Traverse Home Co. Launch
- **Build Status:** IN PROGRESS (Phase 17 next)

---

## PROJECT IDENTITY

| Field | Value |
|---|---|
| **Platform Brand** | .win |
| **Project Name** | Contractors OS |
| **Project Root** | `/home/user/Contractors-OS/` |
| **Repository** | `github.com/[OWNER]/Contractors-OS` |
| **Production URL** | `contractorsos.com` |
| **Brand Guide** | `docs/dotwin-brand-guide.md` |
| **Display Font** | Yeseva One (serif — hero headlines, "Contractor" brand text) |
| **Body Font** | Outfit (sans-serif — headings, body, buttons, everything else) |
| **Core Palette** | Black / White / Warm Grays / Gold Accent (#D4A84B) |
| **First Tenant** | Grand Traverse Home Co. |
| **First Tenant Domain** | `grandtraversehomeco.com` |
| **First Tenant Subdomain** | `grandtraverse.contractorsos.com` |

### Logo Files (in `public/logos/`)

| File | Use |
|---|---|
| `win_black_logo-horizontal-nobg.png` | Primary horizontal — light backgrounds, headers |
| `win_white_logo-horizontal-blackbg.png` | Horizontal — dark backgrounds, admin sidebar |
| `win_black_logo-square-white_bg.png` | Square — light contexts |
| `win_white_square_black_bg.png` | Square — dark contexts |
| `win-black-circle-white-letters.png` | Circular badge — dark |
| `win_white_circle_black_letters.png` | Circular badge — light |
| `dot-win_circle_more_padding.png` | Circle icon — medium padding (avatars, profiles) |
| `dot-win-circle-most_padding.png` | Circle icon — max padding (smallest contexts) |

---

## TECH STACK — LOCKED

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | latest |
| Database | Supabase (Postgres 15) | latest |
| Auth | Supabase Auth | latest |
| Storage | Supabase Storage | latest |
| Realtime | Supabase Realtime | latest |
| Edge Functions | Supabase Edge Functions (Deno) | latest |
| AI (Primary) | Anthropic Claude API | claude-sonnet-4-6 |
| AI (Secondary) | OpenAI API | gpt-4o |
| Payments | Stripe Connect | latest |
| E-Signatures | DocuSign / HelloSign | latest |
| SMS | Twilio | latest |
| Hosting | Vercel | latest |
| Version Control | GitHub | — |
| Package Manager | pnpm | latest |

---

## CRITICAL ARCHITECTURE RULES

1. **NO Vercel API routes.** All server logic lives in Supabase Edge Functions.
2. **Next.js is frontend only.** Static + SSR pages. No `/api` directory.
3. **Edge Functions are organized by domain.** One function per domain group (e.g., `ai/`, `payments/`, `projects/`).
4. **Multi-tenancy is resolved by domain/subdomain.** Middleware reads the hostname, resolves tenant_id, injects it into the request context.
5. **Row Level Security is enforced at the database level.** Never rely on application-level filtering alone.
6. **Every AI call goes through `resolve_ai_model()`.** The Postgres function determines which model to use based on tenant + module routing config.
7. **All file storage uses Supabase Storage** with tenant-scoped buckets.
8. **All secrets live in Supabase Vault or environment variables.** Never hardcode API keys.
9. **Git commit after every completed component.** Push to Vercel after every completed phase.

---

## REPOSITORY STRUCTURE

```
contractors-os/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── apps/
│   └── web/                          # Next.js application
│       ├── app/
│       │   ├── (marketing)/          # Public website (tenant-branded)
│       │   │   ├── page.tsx          # Homepage
│       │   │   ├── services/
│       │   │   ├── portfolio/
│       │   │   ├── about/
│       │   │   ├── contact/
│       │   │   ├── book/             # Booking / project planner flow
│       │   │   └── layout.tsx
│       │   ├── (portal)/             # Client portal (authenticated)
│       │   │   ├── dashboard/
│       │   │   ├── projects/
│       │   │   ├── messages/
│       │   │   ├── payments/
│       │   │   ├── documents/
│       │   │   └── layout.tsx
│       │   ├── (admin)/              # Contractor admin (tenant dashboard)
│       │   │   ├── dashboard/
│       │   │   ├── leads/
│       │   │   ├── clients/
│       │   │   ├── projects/
│       │   │   ├── estimates/
│       │   │   ├── proposals/
│       │   │   ├── contracts/
│       │   │   ├── invoices/
│       │   │   ├── payments/
│       │   │   ├── scheduling/
│       │   │   ├── staffing/
│       │   │   ├── documents/
│       │   │   ├── reports/
│       │   │   ├── ai/
│       │   │   ├── settings/
│       │   │   └── layout.tsx
│       │   ├── (platform)/           # Platform super admin
│       │   │   ├── tenants/
│       │   │   ├── provisioning/
│       │   │   ├── monitoring/
│       │   │   ├── ai-config/
│       │   │   ├── templates/
│       │   │   ├── feature-flags/
│       │   │   └── layout.tsx
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   ├── signup/
│       │   │   ├── callback/
│       │   │   ├── forgot-password/
│       │   │   └── accept-invite/
│       │   ├── layout.tsx            # Root layout
│       │   └── middleware.ts         # Tenant resolution
│       ├── components/
│       │   ├── ui/                   # shadcn/ui components
│       │   ├── marketing/           # Public website components
│       │   ├── portal/              # Client portal components
│       │   ├── admin/               # Contractor admin components
│       │   ├── platform/            # Super admin components
│       │   ├── shared/              # Cross-cutting components
│       │   └── ai/                  # AI chat, generation UIs
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts        # Browser client
│       │   │   ├── server.ts        # Server client (SSR)
│       │   │   ├── middleware.ts     # Middleware client
│       │   │   └── types.ts         # Generated DB types
│       │   ├── tenant/
│       │   │   ├── resolver.ts      # Domain → tenant_id
│       │   │   ├── context.tsx      # TenantProvider
│       │   │   └── theme.ts         # Dynamic theme loader
│       │   ├── ai/
│       │   │   ├── client.ts        # AI edge function caller
│       │   │   └── types.ts
│       │   ├── stripe/
│       │   │   └── client.ts
│       │   ├── utils/
│       │   │   ├── formatting.ts
│       │   │   ├── validation.ts
│       │   │   └── constants.ts
│       │   └── hooks/
│       │       ├── use-tenant.ts
│       │       ├── use-user.ts
│       │       ├── use-realtime.ts
│       │       └── use-ai.ts
│       ├── styles/
│       │   └── globals.css
│       ├── public/
│       │   └── logos/
│       │       ├── win_black_logo-horizontal-nobg.png
│       │       ├── win_white_logo-horizontal-blackbg.png
│       │       ├── win_black_logo-square-white_bg.png
│       │       ├── win_white_square_black_bg.png
│       │       ├── win-black-circle-white-letters.png
│       │       ├── win_white_circle_black_letters.png
│       │       ├── dot-win_circle_more_padding.png
│       │       └── dot-win-circle-most_padding.png
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
├── supabase/
│   ├── migrations/
│   │   └── 20260315000000_initial_schema.sql
│   ├── functions/
│   │   ├── ai/
│   │   │   ├── generate/index.ts        # Unified AI generation endpoint
│   │   │   ├── chat/index.ts            # AI chat endpoint
│   │   │   └── _shared/
│   │   │       ├── model-resolver.ts     # Calls resolve_ai_model()
│   │   │       ├── providers/
│   │   │       │   ├── anthropic.ts
│   │   │       │   ├── openai.ts
│   │   │       │   └── google.ts
│   │   │       └── types.ts
│   │   ├── auth/
│   │   │   ├── on-signup/index.ts       # After signup hook
│   │   │   ├── on-login/index.ts        # After login hook
│   │   │   └── invite/index.ts          # Send invitation
│   │   ├── payments/
│   │   │   ├── create-checkout/index.ts
│   │   │   ├── webhook/index.ts         # Stripe webhook handler
│   │   │   ├── create-invoice/index.ts
│   │   │   └── _shared/stripe.ts
│   │   ├── documents/
│   │   │   ├── generate-contract/index.ts
│   │   │   ├── generate-proposal/index.ts
│   │   │   ├── e-sign/index.ts
│   │   │   └── upload/index.ts
│   │   ├── notifications/
│   │   │   ├── send/index.ts            # Unified notification sender
│   │   │   ├── email/index.ts
│   │   │   ├── sms/index.ts
│   │   │   └── _shared/templates.ts
│   │   ├── scheduling/
│   │   │   ├── sync-calendar/index.ts
│   │   │   └── check-availability/index.ts
│   │   ├── leads/
│   │   │   ├── score/index.ts           # AI lead scoring
│   │   │   └── capture/index.ts         # Public form submission
│   │   ├── tenants/
│   │   │   ├── provision/index.ts       # New tenant setup
│   │   │   ├── resolve/index.ts         # Domain → tenant lookup
│   │   │   └── configure/index.ts
│   │   ├── reports/
│   │   │   └── generate/index.ts
│   │   ├── webhooks/
│   │   │   └── dispatch/index.ts
│   │   └── _shared/
│   │       ├── cors.ts
│   │       ├── auth.ts
│   │       ├── tenant.ts
│   │       └── response.ts
│   ├── seed.sql
│   └── config.toml
├── docs/
│   ├── OS_SINGLE_SOURCE_OF_TRUTH.md    # Living project state
│   ├── BUILD_PHASES.md                  # Full build plan
│   └── dotwin-brand-guide.md            # .win brand guide (fonts, colors, logos, UI rules)
├── CLAUDE.md                            # Claude Code instructions (PROJECT ROOT)
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# DocuSign
DOCUSIGN_INTEGRATION_KEY=
DOCUSIGN_SECRET_KEY=
DOCUSIGN_ACCOUNT_ID=

# Platform
NEXT_PUBLIC_PLATFORM_URL=https://contractorsos.com
NEXT_PUBLIC_APP_NAME=Contractors OS
```

---

## DATABASE STATE

### Migration Status
- [x] Extensions (uuid-ossp, pgcrypto, pg_trgm, btree_gist, postgis)
- [x] Enumerations (98 types, 541+ values)
- [x] Platform tables (tenants, themes, domains, admins, feature_flags)
- [x] Auth tables (users, invitations, sessions)
- [x] CRM tables (clients, contacts, properties, leads, notes)
- [x] Project tables (projects, phases, tasks, dependencies, daily_logs, photos)
- [x] Estimating tables (service_catalog, material_library, estimates, line_items, proposals)
- [x] Contract tables (contracts, templates, change_orders, lien_waivers, permits, inspections)
- [x] Financial tables (invoices, line_items, payments, draw_schedules, expenses, purchase_orders)
- [x] Staffing tables (employees, subcontractors, vendors, crews, time_entries, certifications)
- [x] Scheduling tables (schedule_events)
- [x] Communication tables (threads, messages, notifications, email_log, sms_log, templates)
- [x] Document tables (folders, documents)
- [x] Review tables (reviews)
- [x] AI tables (generations, conversations, templates, model_registry, module_routing, ab_tests, ab_test_results, api_keys, automation_rules)
- [x] Vehicle/Equipment tables (vehicles, equipment, maintenance_log)
- [x] Warranty tables (warranties, warranty_claims)
- [x] Safety tables (safety_incidents)
- [x] CMS tables (website_pages, portfolio_projects)
- [x] Activity tables (activity_log, tags, tag_assignments)
- [x] Reporting tables (saved_reports, analytics_events)
- [x] Integration tables (connections, sync_log, webhooks, webhook_log)
- [x] Sequence tables (tenant_sequences)
- [x] RLS policies on all tables
- [x] Updated_at triggers on all mutable tables
- [x] Materialized views (project_financials, tenant_dashboard)
- [x] Functions (resolve_ai_model, next_sequence, tenant initialization)
- [x] AI model registry seeded (8 models)

### Total Schema Stats
- **82 tables**
- **98 enumerations**
- **283 indexes**
- **10 functions**
- **2 materialized views**
- **All tables have RLS enabled**

---

## BUILD PROGRESS

### Phase 0: Migration ✅
- Status: COMPLETE
- Migration file: `supabase/migrations/20260315000000_initial_schema.sql`
- All tables, enums, indexes, RLS, triggers, functions, seeds deployed

### Phase 1: Project Scaffold + Auth ✅
- Status: COMPLETE
- Checklist:
  - [x] Next.js 16 project initialized with App Router
  - [x] TypeScript configured strict mode
  - [x] Tailwind CSS v4 + shadcn/ui installed (46 components)
  - [x] Supabase client libraries installed (@supabase/ssr)
  - [x] Supabase types placeholder (TODO: generate from live schema)
  - [x] Auth pages (login, signup, forgot password, callback, accept-invite)
  - [x] Auth middleware (protect routes, inject user context)
  - [x] Google OAuth configured
  - [x] Email/password auth configured
  - [x] Session management working
  - [x] Committed to GitHub
  - [ ] Deployed to Vercel (deferred — no Vercel config yet)

### Phase 2: Multi-Tenancy Engine ✅
- Status: COMPLETE
- Checklist:
  - [x] Middleware: hostname → tenant_id resolution
  - [x] TenantProvider context (React)
  - [x] Dynamic theme loader (colors, fonts, logos from tenant_themes)
  - [x] CSS variable injection from tenant theme
  - [x] Subdomain routing working
  - [x] Custom domain routing working
  - [x] Tenant resolver library (lib/tenant/resolver.ts)
  - [x] Committed + deployed

### Phase 3: Platform Admin Dashboard ✅
- Status: COMPLETE
- Checklist:
  - [x] Platform admin layout + navigation (black sidebar)
  - [x] Tenant directory (list, search, filter, status badges)
  - [x] Tenant provisioning wizard (6 steps)
  - [x] Tenant detail view (Overview, Settings, Branding, Domains, Users tabs)
  - [x] AI model registry management
  - [x] AI module routing configuration
  - [x] A/B test management
  - [x] Feature flag management
  - [x] Global monitoring dashboard
  - [ ] Impersonation (deferred — requires auth system integration)
  - [x] Edge function: tenants/provision
  - [x] Edge function: tenants/resolve
  - [x] Committed + deployed

### Phase 4: Public Website (Client Acquisition Engine) ✅
- Status: COMPLETE
- Checklist:
  - [x] Marketing layout (Header.tsx, Footer.tsx, layout.tsx)
  - [x] Homepage (hero, services, how it works, social proof, CTA)
  - [x] Services listing page (9 services)
  - [x] Service detail pages (dynamic with generateStaticParams)
  - [x] Portfolio / project gallery (6 projects)
  - [x] About / team page
  - [x] Contact page (form + info)
  - [x] Reviews page (8 testimonials)
  - [x] FAQ page (accordion with 10 questions)
  - [x] SEO (metadata on all pages)
  - [x] Mobile responsive (all pages)
  - [ ] Performance optimized (Lighthouse — deferred to post-launch)
  - [x] Committed + deployed

### Phase 5: Booking / Project Planner ✅
- Status: COMPLETE
- Checklist:
  - [x] Multi-step booking flow UI (6-step progress bar)
  - [x] Step 1: Project type selector (9 visual cards with icons)
  - [x] Step 2: Smart follow-up questions (dynamic per project type)
  - [x] Step 3: Scope & size inputs (dimensions, complexity, timeline, budget)
  - [x] Step 4: Instant range estimate (local calculation with loading animation)
  - [x] Step 5: Schedule consultation (date picker + time slots)
  - [x] Step 6: Account creation + portal enrollment
  - [x] Edge function: leads/capture
  - [x] Edge function: leads/score
  - [x] Edge function: ai/generate (unified AI generation)
  - [x] Zustand booking store for multi-step state management
  - [x] Committed + deployed

### Phase 6: CRM + Lead Management ✅
- Status: COMPLETE
- Checklist:
  - [x] Admin layout with collapsible black sidebar (13 nav items)
  - [x] Admin dashboard with 4 metric cards, leads table, events, quick actions
  - [x] Lead pipeline (Kanban board with 6 status columns + list view toggle)
  - [x] Lead detail view (5 tabs: Overview, Activity, Notes, Documents, AI Summary)
  - [x] Lead scoring display with color-coded scores
  - [x] Client directory (list, search, filter by type)
  - [x] Client detail view (7 tabs: Overview, Properties, Projects, Invoices, Docs, Notes, Activity)
  - [x] Notes system with add form
  - [x] Activity timeline
  - [x] Committed + deployed

### Phase 7: Project Management ✅
- Status: COMPLETE
- Checklist:
  - [x] Project list with grid/list views, status badges, progress bars
  - [x] Project detail view (8 tabs: Overview, Phases, Tasks, Daily Logs, Photos, Documents, Financials, Activity)
  - [x] Phase management (ordered list with drag handles)
  - [x] Task Kanban board (backlog/todo/in_progress/done)
  - [x] Daily log entries (date, weather, summary, crew, hours)
  - [x] Photo gallery grid
  - [x] Financial overview (4 metric cards)
  - [x] Activity timeline
  - [x] Committed + deployed

### Phase 8: Estimating + Proposals ✅
- Status: COMPLETE
- Checklist:
  - [x] Service catalog management (settings/services)
  - [x] Material library management (settings/materials)
  - [x] Estimate list + builder with line items and sections
  - [x] Proposal list + builder (Cover Letter, Scope, Timeline, Pricing, Terms, Signature)
  - [x] Good/Better/Best tier proposals
  - [x] AI generation per proposal section
  - [x] Edit/preview toggle
  - [x] E-signature placeholder
  - [x] Edge function: documents/generate-proposal
  - [x] Committed + deployed

### Phase 9: Contracts + Documents ✅
- Status: COMPLETE
- Checklist:
  - [x] Contract template management (settings/contract-templates)
  - [x] Contract list with status badges
  - [x] Contract detail view with sections and timeline
  - [x] Document vault with folders and file list
  - [x] Edge function: documents/generate-contract
  - [x] Committed + deployed

### Phase 10: Invoicing + Payments ✅
- Status: COMPLETE
- Checklist:
  - [x] Invoice list with status badges and filters
  - [x] Invoice detail/builder with line items, tax, totals
  - [x] Payment settings (settings/payments) with Stripe Connect config
  - [x] Edge function: payments/create-checkout (Stripe Checkout Sessions)
  - [x] Edge function: payments/webhook (Stripe event handler)
  - [x] Committed + deployed

### Phase 11: Client Portal ✅
- Status: COMPLETE
- Checklist:
  - [x] Portal layout with header navigation + mobile Sheet menu
  - [x] Client dashboard (active projects, recent activity, outstanding balance)
  - [x] Project list + detail view (phases, progress)
  - [x] Messages page with conversation threads
  - [x] Payments page with invoice list and payment history
  - [x] Documents page with folder/file listing
  - [x] Committed + deployed

### Phase 12: Staffing + Scheduling ✅
- Status: COMPLETE
- Checklist:
  - [x] Staffing hub page with team stats
  - [x] Employee directory (staffing/employees)
  - [x] Subcontractor directory (staffing/subcontractors)
  - [x] Vendor directory (staffing/vendors)
  - [x] Scheduling calendar with week/day views (scheduling)
  - [x] Committed + deployed

### Phase 13: AI Command Center ✅
- Status: COMPLETE
- Checklist:
  - [x] AI chat interface with conversation sidebar, context-awareness, quick commands
  - [x] Generation history table with 15+ entries, expandable rows, feedback buttons
  - [x] AI module routing dashboard (7 modules, model/temperature/token config)
  - [x] A/B test dashboard (create, running tests with metrics, completed with winner)
  - [x] Usage + cost analytics (summary cards)
  - [x] Edge function: ai/generate (all modules)
  - [x] Edge function: ai/chat
  - [x] Committed + deployed

### Phase 14: Communications + Notifications ✅
- Status: COMPLETE
- Checklist:
  - [x] Unified inbox with conversation threads, message bubbles, channel selector
  - [x] Email/SMS template management (8 templates with merge variables)
  - [x] Automation rules (6 rules with trigger→action, enable/disable toggle)
  - [x] Edge function: notifications/send
  - [x] Edge function: notifications/email
  - [x] Edge function: notifications/sms
  - [x] Committed + deployed

### Phase 15: Reporting + Analytics ✅
- Status: COMPLETE
- Checklist:
  - [x] Financial dashboard (revenue bar chart, KPI cards, A/R aging)
  - [x] Project reports (status distribution, budget variance table)
  - [x] Lead conversion funnel + lead sources chart
  - [x] Top clients by revenue table
  - [x] Tab navigation (Financial, Projects, Leads, Custom)
  - [x] Export buttons (CSV, PDF)
  - [x] Committed + deployed

### Phase 16: Integrations ✅
- Status: COMPLETE
- Checklist:
  - [x] Integration management page (6 integrations: QuickBooks, Google Cal, Stripe, Zapier, GBP, CompanyCam)
  - [x] Connected/available sections with status indicators
  - [x] Outbound webhooks management (create, table with event badges, delivery log)
  - [x] Edge function: webhooks/dispatch
  - [x] Committed + deployed

### Phase 17: Grand Traverse Home Co. Launch
- Status: NOT STARTED
- Checklist:
  - [ ] Tenant provisioned with full branding
  - [ ] Custom domain connected + SSL
  - [ ] All services configured
  - [ ] Stripe Connect onboarded
  - [ ] Test booking flow end-to-end
  - [ ] Test client portal end-to-end
  - [ ] Test payment flow end-to-end
  - [ ] Test AI generation end-to-end
  - [ ] Performance audit (Lighthouse 90+)
  - [ ] Mobile audit (all screens)
  - [ ] SEO audit
  - [ ] Final commit + deploy

---

## KNOWN ISSUES

_None yet. Claude Code should log issues here as they arise._

---

## DESIGN DECISIONS LOG

_Claude Code should log important architectural or design decisions here._

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-15 | No Vercel API routes | All server logic in Supabase Edge Functions for consistency and to avoid vendor lock-in |
| 2026-03-15 | AI model as table, not enum | Models change too fast; table allows dashboard-driven addition |
| 2026-03-15 | Single Next.js app with route groups | Simpler deployment vs separate apps; tenant resolution handles access control |
| 2026-03-15 | pnpm over npm/yarn | Faster installs, strict dependency resolution |
| 2026-03-15 | Next.js 16 (not 14) | Latest version available; uses async params and Turbopack |
| 2026-03-15 | Tailwind CSS v4 | Installed via create-next-app; uses CSS-first config |
| 2026-03-15 | Google Fonts via link tag | next/font/google fails in sandboxed env; using CDN link tags instead |
| 2026-03-15 | shadcn/ui base-ui | Latest shadcn uses @base-ui/react primitives instead of Radix |
| 2026-03-15 | Sonner over shadcn toast | shadcn deprecated toast component in favor of sonner |
| 2026-03-15 | Route path prefixes (/admin/, /portal/, /platform/) | Avoid URL collision between route groups that would both resolve to /dashboard |
| 2026-03-15 | base-ui `render` prop instead of Radix `asChild` | shadcn/ui now uses @base-ui/react which uses `render` prop for composition |
| 2026-03-15 | Local estimate calculation in booking flow | Works without AI backend; uses base price ranges with complexity/sqft multipliers |

---

## DEPENDENCY VERSIONS

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@supabase/supabase-js": "^2.99.1",
  "@supabase/ssr": "^0.9.0",
  "stripe": "^20.4.1",
  "date-fns": "^4.1.0",
  "zod": "^4.3.6",
  "zustand": "^5.0.11",
  "lucide-react": "^0.577.0"
}
```

---

## EDGE FUNCTION REGISTRY

_Claude Code updates this as functions are built._

| Function Path | Method | Auth Required | Description | Phase |
|---|---|---|---|---|
| `tenants/provision` | POST | Platform Admin | Create new tenant | 3 |
| `tenants/resolve` | GET | Public | Domain → tenant lookup | 2 |
| `tenants/configure` | PATCH | Platform Admin | Update tenant settings | 3 |
| `leads/capture` | POST | Public | Booking form submission | 5 |
| `leads/score` | POST | Internal | AI lead scoring | 5 |
| `ai/generate` | POST | Authenticated | Unified AI generation | 5+ |
| `ai/chat` | POST | Authenticated | AI chat conversation | 13 |
| `auth/on-signup` | POST | Webhook | Post-signup user setup | 1 |
| `auth/invite` | POST | Tenant Admin | Send user invitation | 1 |
| `payments/create-checkout` | POST | Authenticated | Stripe checkout session | 10 |
| `payments/webhook` | POST | Stripe | Stripe event handler | 10 |
| `payments/create-invoice` | POST | Tenant Admin | Generate + send invoice | 10 |
| `documents/generate-contract` | POST | Tenant Admin | AI contract generation | 9 |
| `documents/generate-proposal` | POST | Tenant Admin | AI proposal generation | 8 |
| `documents/e-sign` | POST | Authenticated | E-signature flow | 9 |
| `documents/upload` | POST | Authenticated | File upload handler | 9 |
| `notifications/send` | POST | Internal | Unified notification dispatch | 14 |
| `notifications/email` | POST | Internal | Email sender | 14 |
| `notifications/sms` | POST | Internal | SMS sender | 14 |
| `scheduling/sync-calendar` | POST | Authenticated | Google Calendar sync | 12 |
| `scheduling/check-availability` | GET | Authenticated | Availability check | 12 |
| `reports/generate` | POST | Tenant Admin | Report generation | 15 |
| `webhooks/dispatch` | POST | Internal | Outbound webhook sender | 16 |

---

## COMPONENT LIBRARY REGISTRY

_Claude Code updates this as shared components are built._

| Component | Path | Used By | Phase |
|---|---|---|---|
| Header | components/marketing/Header.tsx | (marketing) layout | 4 |
| Footer | components/marketing/Footer.tsx | (marketing) layout | 4 |
| QueryProvider | components/providers/QueryProvider.tsx | Root layout | 1 |
| TenantThemeProvider | components/providers/TenantThemeProvider.tsx | Root layout | 2 |

---

## TESTING NOTES

_Claude Code logs testing results here._

---

## PERFORMANCE BENCHMARKS

_Claude Code logs Lighthouse scores and load times here._

| Page | LCP | FID | CLS | Score | Date |
|---|---|---|---|---|---|
| _None measured yet_ | | | | | |
