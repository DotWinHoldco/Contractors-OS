# CONTRACTORS OS — SINGLE SOURCE OF TRUTH

> **This document is the living memory of the entire Contractors OS platform.**
> Claude Code MUST read this file before every build session.
> Claude Code MUST update this file after every completed phase.
> If it is not in this document, it does not exist.

---

## LAST UPDATED

- **Date:** 2026-03-15
- **Last Phase Completed:** Phase 4 — Public Website
- **Next Phase:** Phase 5 — Booking / Project Planner
- **Build Status:** IN PROGRESS

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
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| UI Library | React | 18.x |
| Styling | Tailwind CSS | 3.x |
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

### Phase 5: Booking / Project Planner
- Status: NOT STARTED
- Checklist:
  - [ ] Multi-step booking flow UI
  - [ ] Step 1: Project type selector (visual cards)
  - [ ] Step 2: Smart follow-up questions (AI-driven)
  - [ ] Step 3: Scope & size inputs
  - [ ] Step 4: Instant range estimate (AI-powered)
  - [ ] Step 5: Schedule consultation (calendar picker)
  - [ ] Step 6: Account creation + portal enrollment
  - [ ] Edge function: leads/capture
  - [ ] Edge function: leads/score
  - [ ] Edge function: ai/generate (scope estimation)
  - [ ] Lead created in DB with full project_details JSONB
  - [ ] Confirmation email sent (edge function: notifications/email)
  - [ ] Committed + deployed

### Phase 6: CRM + Lead Management
- Status: NOT STARTED
- Checklist:
  - [ ] Admin CRM layout
  - [ ] Lead pipeline (Kanban board)
  - [ ] Lead detail view
  - [ ] Lead scoring display
  - [ ] Lead→Client conversion flow
  - [ ] Client directory (list, search, filter)
  - [ ] Client detail view (tabs: info, projects, invoices, notes, portal)
  - [ ] Client contacts management
  - [ ] Property management per client
  - [ ] Notes system (pinnable, private)
  - [ ] Activity timeline
  - [ ] Committed + deployed

### Phase 7: Project Management
- Status: NOT STARTED
- Checklist:
  - [ ] Project list (filterable by status, type, client)
  - [ ] Project detail view (tabbed: overview, phases, tasks, logs, photos, docs, financials)
  - [ ] Phase management (create, reorder, status updates)
  - [ ] Task management (create, assign, subtasks, checklists)
  - [ ] Kanban board view
  - [ ] Daily log entry form
  - [ ] Photo upload + gallery
  - [ ] Project timeline / Gantt view
  - [ ] Client-visible progress bar
  - [ ] Weather integration
  - [ ] Committed + deployed

### Phase 8: Estimating + Proposals
- Status: NOT STARTED
- Checklist:
  - [ ] Service catalog management
  - [ ] Material library management
  - [ ] Estimate builder (line items, sections, pricing)
  - [ ] AI scope of work generation
  - [ ] Proposal builder (sections, cover letter, terms)
  - [ ] Good/Better/Best tier proposals
  - [ ] PDF generation
  - [ ] Send via email + portal
  - [ ] View/accept/decline tracking
  - [ ] E-signature integration
  - [ ] Edge function: ai/generate (scope, estimate)
  - [ ] Edge function: documents/generate-proposal
  - [ ] Committed + deployed

### Phase 9: Contracts + Documents
- Status: NOT STARTED
- Checklist:
  - [ ] Contract template management
  - [ ] AI contract generation
  - [ ] Contract builder / editor
  - [ ] Change order creation + approval workflow
  - [ ] Lien waiver management
  - [ ] Permit tracking
  - [ ] Inspection scheduling + tracking
  - [ ] Document vault (folders, upload, versioning)
  - [ ] E-signature flow
  - [ ] Edge function: documents/generate-contract
  - [ ] Edge function: documents/e-sign
  - [ ] Committed + deployed

### Phase 10: Invoicing + Payments
- Status: NOT STARTED
- Checklist:
  - [ ] Invoice builder (line items, tax, discounts)
  - [ ] Progress billing / draw schedule support
  - [ ] Retainage tracking
  - [ ] Stripe Connect onboarding per tenant
  - [ ] Online payment (card + ACH)
  - [ ] Payment recording (manual: check, cash)
  - [ ] Payment application to invoices
  - [ ] Invoice PDF generation
  - [ ] Send invoice (email + portal)
  - [ ] Payment reminders (automated)
  - [ ] Expense tracking
  - [ ] Purchase order management
  - [ ] Edge function: payments/create-checkout
  - [ ] Edge function: payments/webhook
  - [ ] Edge function: payments/create-invoice
  - [ ] Committed + deployed

### Phase 11: Client Portal
- Status: NOT STARTED
- Checklist:
  - [ ] Portal layout + navigation
  - [ ] Client dashboard (active projects, upcoming, outstanding)
  - [ ] Project tracker (phases, progress, daily logs)
  - [ ] Messaging (threaded, real-time)
  - [ ] Invoice viewing + online payment
  - [ ] Payment history
  - [ ] Document viewing + e-signature
  - [ ] Approval workflows (selections, change orders)
  - [ ] Photo gallery
  - [ ] Notification preferences
  - [ ] Committed + deployed

### Phase 12: Staffing + Scheduling
- Status: NOT STARTED
- Checklist:
  - [ ] Employee directory
  - [ ] Subcontractor directory
  - [ ] Vendor directory
  - [ ] Crew management
  - [ ] Time clock (GPS clock-in/out)
  - [ ] Timesheet approval workflow
  - [ ] Calendar / scheduling (drag & drop)
  - [ ] Google Calendar sync
  - [ ] Certification tracking + expiry alerts
  - [ ] Vehicle + equipment tracking
  - [ ] Edge function: scheduling/sync-calendar
  - [ ] Edge function: scheduling/check-availability
  - [ ] Committed + deployed

### Phase 13: AI Command Center
- Status: NOT STARTED
- Checklist:
  - [ ] AI chat interface (persistent, context-aware)
  - [ ] Generation history
  - [ ] AI module routing dashboard (tenant-level)
  - [ ] A/B test creation + monitoring
  - [ ] Prompt template management
  - [ ] Usage + cost analytics
  - [ ] All AI edge functions tested end-to-end
  - [ ] Edge function: ai/generate (all modules)
  - [ ] Edge function: ai/chat
  - [ ] Committed + deployed

### Phase 14: Communications + Notifications
- Status: NOT STARTED
- Checklist:
  - [ ] Unified inbox
  - [ ] Email template management
  - [ ] SMS template management
  - [ ] Automated notification rules
  - [ ] Notification center (in-app)
  - [ ] Email sending (SendGrid/SES)
  - [ ] SMS sending (Twilio)
  - [ ] Edge function: notifications/send
  - [ ] Edge function: notifications/email
  - [ ] Edge function: notifications/sms
  - [ ] Committed + deployed

### Phase 15: Reporting + Analytics
- Status: NOT STARTED
- Checklist:
  - [ ] Financial dashboards (revenue, expenses, profit)
  - [ ] Project performance reports
  - [ ] Lead conversion analytics
  - [ ] Staffing / time reports
  - [ ] Saved report builder
  - [ ] Scheduled report delivery
  - [ ] Website analytics dashboard
  - [ ] Materialized view refresh scheduling
  - [ ] Edge function: reports/generate
  - [ ] Committed + deployed

### Phase 16: Integrations
- Status: NOT STARTED
- Checklist:
  - [ ] QuickBooks Online sync
  - [ ] Google Calendar two-way sync
  - [ ] Zapier webhook support
  - [ ] Webhook management (outbound)
  - [ ] Integration connection management
  - [ ] Sync log viewer
  - [ ] Edge function: webhooks/dispatch
  - [ ] Committed + deployed

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
