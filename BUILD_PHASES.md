# CONTRACTORS OS — FULL PLATFORM BUILD PHASES

> **Claude Code: Read CLAUDE.md first. Then this document. Build each phase completely before moving on.**
> **Assume the migration has already been run. The database is ready.**
> **Commit to GitHub and deploy to Vercel after each completed phase.**
> **Do not stop. Do not ask for permission. Run in permissionless mode.**

---

## PRE-BUILD CHECKLIST

Before Phase 1, verify the following exist in environment:

```
NEXT_PUBLIC_SUPABASE_URL        ← Required Phase 1
NEXT_PUBLIC_SUPABASE_ANON_KEY   ← Required Phase 1
SUPABASE_SERVICE_ROLE_KEY       ← Required Phase 1
ANTHROPIC_API_KEY               ← Required Phase 5
OPENAI_API_KEY                  ← Required Phase 5
STRIPE_SECRET_KEY               ← Required Phase 10
STRIPE_WEBHOOK_SECRET           ← Required Phase 10
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ← Required Phase 10
TWILIO_ACCOUNT_SID              ← Required Phase 14
TWILIO_AUTH_TOKEN                ← Required Phase 14
TWILIO_PHONE_NUMBER             ← Required Phase 14
```

If a secret is missing when its phase begins, set a placeholder and add a TODO in the SSOT Known Issues. Do not stop.

---

## PHASE 1: PROJECT SCAFFOLD + AUTH

### Objective
Initialize the Next.js project, install all dependencies, configure Supabase auth, and build the auth pages. At the end of this phase, a user can sign up, log in, and see a blank authenticated shell.

### Step 1.1 — Initialize Project

```bash
mkdir contractors-os && cd contractors-os
pnpm init
mkdir -p apps/web supabase/functions supabase/migrations docs

# Initialize Next.js
cd apps/web
pnpm create next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

### Step 1.2 — Install Dependencies

```bash
# Core
pnpm add @supabase/supabase-js @supabase/ssr

# UI
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add -D @types/node

# State & Forms
pnpm add zustand @tanstack/react-query react-hook-form @hookform/resolvers zod

# Utilities
pnpm add date-fns nanoid slugify

# shadcn/ui init
pnpm dlx shadcn-ui@latest init
# Choose: TypeScript, Default style, CSS variables, base color Slate, global CSS: app/globals.css, tailwind.config.ts, components: @/components, utils: @/lib/utils

# Install shadcn components (all at once)
pnpm dlx shadcn-ui@latest add button input label card dialog sheet dropdown-menu select textarea badge avatar separator tabs table toast tooltip popover command calendar accordion alert alert-dialog aspect-ratio checkbox collapsible context-menu form hover-card menubar navigation-menu progress radio-group scroll-area skeleton slider switch toggle toggle-group
```

### Step 1.3 — Project Configuration

**`tsconfig.json`** — Ensure strict mode:
```json
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

**`next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### Step 1.4 — Supabase Client Setup

Create `lib/supabase/client.ts` — browser client:
```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `lib/supabase/server.ts` — server component client:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — can't set cookies
          }
        },
      },
    }
  );
}
```

Create `lib/supabase/middleware.ts` — middleware client:
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user, response: supabaseResponse };
}
```

Create `lib/supabase/types.ts` — placeholder until types are generated:
```typescript
export type Database = any; // TODO: Generate from Supabase after Phase 1 deploy
```

### Step 1.5 — Auth Pages

Build the following pages under `app/auth/`:

**`app/auth/login/page.tsx`:**
- Email + password form
- Google OAuth button
- "Forgot password?" link
- "Don't have an account? Sign up" link
- Clean, centered card layout
- Tenant-branded if tenant context exists (logo, colors)

**`app/auth/signup/page.tsx`:**
- First name, last name, email, password, confirm password
- Google OAuth button
- Terms acceptance checkbox
- "Already have an account? Log in" link

**`app/auth/forgot-password/page.tsx`:**
- Email input
- Submit sends password reset email via Supabase
- Success confirmation message

**`app/auth/callback/route.ts`:**
- Handles OAuth callback and code exchange
- Redirects to appropriate dashboard based on user role

**`app/auth/accept-invite/page.tsx`:**
- Reads invitation token from URL
- Shows invitation details (who invited, role, company)
- Set password form
- On submit: accepts invitation, creates account, redirects to dashboard

### Step 1.6 — Middleware

Create `middleware.ts` in app root:
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Public routes — no auth required
  const publicPaths = ["/", "/services", "/portfolio", "/about", "/contact", "/book", "/faq", "/reviews"];
  const isPublicPath = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuthPath = pathname.startsWith("/auth");
  const isStaticPath = pathname.startsWith("/_next") || pathname.startsWith("/favicon");

  if (isStaticPath) return response;
  if (isAuthPath) {
    // If already logged in, redirect to dashboard
    if (user) {
      return Response.redirect(new URL("/admin/dashboard", request.url));
    }
    return response;
  }
  if (isPublicPath) return response;

  // Protected routes — redirect to login if no user
  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }

  // TODO Phase 2: Add tenant resolution here
  // TODO Phase 2: Add role-based route protection here

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

### Step 1.7 — Root Layout

Create `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Contractors OS",
  description: "The operating system for contractor businesses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-body antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
```

Create `components/providers/query-provider.tsx`:
```typescript
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### Step 1.8 — Edge Function: Auth Webhook

Create `supabase/functions/auth/on-signup/index.ts`:
- Triggered after Supabase Auth signup
- Creates a row in `public.users` linked to `auth.users`
- If invitation token exists, processes the invitation (sets role, tenant_id, marks accepted)
- If the signup came from the booking flow, creates the client record and sets role to 'client'

### Step 1.9 — Verify + Commit

- [ ] `pnpm build` succeeds
- [ ] Auth pages render correctly
- [ ] Sign up creates a user in Supabase Auth + public.users
- [ ] Login works (email + password)
- [ ] OAuth flow works (Google)
- [ ] Protected routes redirect to login
- [ ] Edge function deploys

**Commit:** `Phase 1: Project Scaffold + Auth — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 2.**

---

## PHASE 2: MULTI-TENANCY ENGINE

### Objective
Implement tenant resolution from hostname, dynamic theme loading, and the TenantProvider. At the end of this phase, hitting `grandtraverse.contractorsos.com` loads Grand Traverse Home Co. branding.

### Step 2.1 — Tenant Resolution in Middleware

Update `middleware.ts` to resolve tenant:
1. Extract hostname from `request.headers.get("host")`
2. If hostname is the platform domain (`contractorsos.com`), set `x-tenant-id` to null (platform admin context)
3. If hostname is a subdomain (`*.contractorsos.com`), extract slug, query `tenants` table by slug
4. If hostname is a custom domain, query `tenant_domains` table
5. Set `x-tenant-id` and `x-tenant-slug` as response headers/cookies

Create `lib/tenant/resolver.ts`:
```typescript
export async function resolveTenant(hostname: string, supabase: any) {
  // Check for custom domain first
  const { data: domainMatch } = await supabase
    .from("tenant_domains")
    .select("tenant_id")
    .eq("domain", hostname)
    .eq("is_verified", true)
    .single();

  if (domainMatch) return domainMatch.tenant_id;

  // Check for subdomain
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "contractorsos.com";
  if (hostname.endsWith(`.${platformDomain}`)) {
    const slug = hostname.replace(`.${platformDomain}`, "");
    const { data: tenantMatch } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (tenantMatch) return tenantMatch.id;
  }

  return null; // Platform context (no tenant)
}
```

### Step 2.2 — TenantProvider

Create `lib/tenant/context.tsx`:
- React context that holds: `tenant_id`, `tenant` (full tenant record), `theme` (from tenant_themes)
- Server component wrapper that fetches tenant + theme data
- Client context provider that makes it available to all child components
- Exposes `useTenant()` hook

### Step 2.3 — Dynamic Theme Loader

Create `lib/tenant/theme.ts`:
- Reads `tenant_themes` record for the current tenant
- Converts theme fields to CSS custom properties
- Injects into `<style>` tag in the layout

Create `components/providers/tenant-theme-provider.tsx`:
```typescript
"use client";
import { useTenant } from "@/lib/hooks/use-tenant";

export function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTenant();

  if (!theme) return <>{children}</>;

  const cssVars = {
    "--color-primary": theme.color_primary,
    "--color-secondary": theme.color_secondary,
    "--color-accent": theme.color_accent,
    "--color-background": theme.color_background,
    "--color-surface": theme.color_surface,
    "--color-text": theme.color_text,
    "--color-text-secondary": theme.color_text_secondary,
    "--color-success": theme.color_success,
    "--color-warning": theme.color_warning,
    "--color-error": theme.color_error,
    "--border-radius": theme.border_radius,
  } as React.CSSProperties;

  return <div style={cssVars}>{children}</div>;
}
```

### Step 2.4 — Edge Function: Tenant Resolution

Create `supabase/functions/tenants/resolve/index.ts`:
- Public endpoint (no auth required)
- Accepts hostname, returns tenant_id + basic public config (name, logo, theme colors)
- Cached aggressively (CDN headers)

### Step 2.5 — Seed Grand Traverse Home Co.

Create a seed file or edge function that inserts:
- A tenant record for Grand Traverse Home Co. (slug: `grandtraverse`)
- A tenant_themes record with initial branding
- A tenant_domains record for the subdomain
- Initial service catalog entries
- Initial tenant_sequences

### Step 2.6 — Verify + Commit

- [ ] Subdomain resolves to correct tenant
- [ ] Theme colors load dynamically
- [ ] Logo displays from tenant config
- [ ] Platform domain shows platform context (no tenant)
- [ ] Tenant data is isolated (RLS verified)

**Commit:** `Phase 2: Multi-Tenancy Engine — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 3.**

---

## PHASE 3: PLATFORM ADMIN DASHBOARD

### Objective
Build the super admin dashboard where platform owners manage tenants, spin up new sites, configure AI models, and monitor the platform.

### Step 3.1 — Platform Admin Layout

Create `app/(platform)/layout.tsx`:
- Sidebar navigation: Dashboard, Tenants, AI Config, Feature Flags, Templates, Monitoring
- Top bar: Platform admin name, notifications, logout
- Guard: Only `platform_superadmin`, `platform_admin`, `platform_support` roles
- Dark sidebar with light content area aesthetic

### Step 3.2 — Platform Dashboard

Create `app/(platform)/dashboard/page.tsx`:
- Total tenants (active, trial, paused)
- Platform MRR (sum of all tenant subscriptions)
- Total active projects across all tenants
- Recent signups
- System health indicators
- Quick actions: New Tenant, View Issues

### Step 3.3 — Tenant Directory

Create `app/(platform)/tenants/page.tsx`:
- Searchable, filterable table of all tenants
- Columns: Name, Status, Plan, Domain, Active Projects, MRR, Last Active
- Status badges with colors
- Click to open tenant detail

Create `app/(platform)/tenants/[id]/page.tsx`:
- Tabbed view: Overview, Settings, Branding, Domains, Services, Users, Revenue, Logs
- Overview: key metrics, quick actions
- Settings: edit tenant config
- Branding: live theme editor with preview
- Domains: manage custom domains
- Services: manage service catalog
- Users: manage tenant users
- Revenue: Stripe revenue charts
- Logs: activity log for this tenant
- "Login as Tenant" impersonation button

### Step 3.4 — Tenant Provisioning Wizard

Create `app/(platform)/tenants/new/page.tsx`:
- 6-step wizard (matches the scope document):
  1. **Business Profile:** Company name, contact info, service area, trade categories
  2. **Branding Kit:** Logo upload, color pickers, font selectors. Live preview panel.
  3. **Domain Configuration:** Subdomain auto-generated from name. Optional custom domain. SSL info.
  4. **Service Catalog:** Select from master catalog or add custom services. Set pricing models.
  5. **Stripe Connect:** Start Stripe Connect onboarding flow. Skip if not ready.
  6. **Review + Launch:** Summary of all settings. "Go Live" button.
- On submit: calls `tenants/provision` edge function

### Step 3.5 — Edge Function: Tenant Provisioning

Create `supabase/functions/tenants/provision/index.ts`:
1. Validate all inputs
2. Insert `tenants` record
3. Insert `tenant_themes` record
4. Insert `tenant_domains` record (subdomain)
5. Insert default `service_catalog` entries
6. Call `initialize_tenant_sequences()`
7. Insert default `ai_module_routing` entries (claude-sonnet-4-6 for all modules)
8. Create Supabase Storage bucket for tenant
9. Return tenant_id and URLs

### Step 3.6 — AI Configuration Dashboard

Create `app/(platform)/ai-config/page.tsx`:
- **Model Registry:** Table of all models from `ai_model_registry`. Add, edit, toggle active/available.
- **Module Routing (per-tenant):** Select tenant, see routing config for each AI module. Change primary model, fallback, strategy.
- **A/B Tests:** Create new test, monitor running tests, view completed test results.
- **API Keys:** Manage platform-level API keys. View usage. Rotate.
- **Usage Analytics:** Total tokens, cost by model, cost by tenant, cost by module. Charts.

### Step 3.7 — Feature Flags

Create `app/(platform)/feature-flags/page.tsx`:
- List all feature flags
- Toggle enabled/disabled/beta
- Set which plans have access
- Rollout percentage slider

### Step 3.8 — Verify + Commit

- [ ] Platform admin layout renders with sidebar nav
- [ ] Dashboard shows live metrics
- [ ] Tenant directory loads and is searchable
- [ ] Provisioning wizard creates a tenant end-to-end
- [ ] New tenant's subdomain loads with branding
- [ ] AI config pages are functional
- [ ] Feature flags are toggleable

**Commit:** `Phase 3: Platform Admin Dashboard — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 4.**

---

## PHASE 4: PUBLIC WEBSITE (CLIENT ACQUISITION ENGINE)

### Objective
Build the tenant-branded public website. This is the money-maker. It must look so premium that homeowners instantly trust the contractor. Every page must be responsive, fast, and conversion-optimized.

### Design Direction
- **Aesthetic:** Refined modern. Think Restoration Hardware meets Stripe. Clean lines, generous whitespace, confident typography, subtle shadows.
- **Color:** Tenant's primary + secondary colors with neutral grays. High contrast text.
- **Typography:** Heading font from tenant config (default: Plus Jakarta Sans). Body: Inter. Large, bold headings.
- **Photography:** Full-width hero sections. Large project photos. Before/after sliders.
- **Animations:** Subtle fade-up on scroll. Smooth hover transitions. No jarring effects.

### Step 4.1 — Marketing Layout

Create `app/(marketing)/layout.tsx`:
- Sticky header: Logo (left), nav links (center), phone + "Book Now" button (right)
- Mobile: hamburger menu with slide-out drawer
- Footer: 4-column layout — company info, services, quick links, contact
- Breadcrumbs on inner pages
- Schema.org LocalBusiness structured data

### Step 4.2 — Homepage

Create `app/(marketing)/page.tsx`:
- **Hero Section:** Full-width background image (from tenant config or default). Large headline (e.g., "Building & Remodeling Done Right"). Subheadline. Two CTAs: "Get a Free Quote" + "View Our Work". Trust badges row (licensed, insured, years in business).
- **Services Grid:** 6-8 service cards from `service_catalog`. Icon, name, brief description, "Learn More" link. Responsive grid.
- **How It Works:** 3-step visual process: "Tell Us About Your Project → Get Your Estimate → We Build It". Numbered circles with connecting lines.
- **Social Proof Section:** Star rating aggregate, review count, "See All Reviews" link. 3 featured testimonials.
- **Portfolio Preview:** 4-6 featured project photos in a masonry grid. "View All Projects" link.
- **Service Area Map:** Embedded map showing coverage area. List of cities/zip codes served.
- **CTA Banner:** Full-width colored band. "Ready to Start Your Project?" + "Book a Free Consultation" button.
- **FAQ Accordion:** 6-8 common questions with expandable answers.

### Step 4.3 — Services Pages

Create `app/(marketing)/services/page.tsx`:
- Grid of all active services from `service_catalog`
- Filterable by trade category
- Each card: image, name, description, pricing hint, CTA

Create `app/(marketing)/services/[slug]/page.tsx`:
- Dynamic page per service
- Hero with service name and image
- Detailed description
- Common project types within this service
- Pricing information (from service_catalog pricing model)
- Photo gallery for this service category
- "Get a Quote for This Service" CTA → links to booking flow with service pre-selected
- Related services sidebar

### Step 4.4 — Portfolio

Create `app/(marketing)/portfolio/page.tsx`:
- Masonry grid of portfolio projects from `portfolio_projects` table
- Filterable by category
- Each card: featured image, title, category badge, location

Create `app/(marketing)/portfolio/[slug]/page.tsx`:
- Project detail: title, description, before/after images, gallery
- Project stats: duration, cost range, square footage
- Client testimonial if available
- "Start a Similar Project" CTA

### Step 4.5 — About Page

Create `app/(marketing)/about/page.tsx`:
- Company story section
- Mission statement
- Team members grid (photos, names, roles) — from settings or a team table
- Certifications and badges
- Service area details

### Step 4.6 — Contact Page

Create `app/(marketing)/contact/page.tsx`:
- Contact form (name, email, phone, message, service interest)
- Company contact info (phone, email, address)
- Embedded Google Map
- Business hours
- Form submits via edge function (creates a lead)

### Step 4.7 — Reviews Page

Create `app/(marketing)/reviews/page.tsx`:
- All published reviews from `reviews` table
- Average rating at top
- Filterable by rating, service category
- Google Reviews integration display

### Step 4.8 — SEO

For every page:
- `generateMetadata()` with dynamic titles and descriptions
- Open Graph tags with images
- Canonical URLs
- `robots.txt` and `sitemap.xml` generation
- Schema.org structured data (LocalBusiness, Service, Review, FAQPage)

### Step 4.9 — Verify + Commit

- [ ] Homepage renders with all sections
- [ ] All pages responsive on mobile
- [ ] Service pages load dynamically from database
- [ ] Portfolio gallery works with before/after
- [ ] Contact form submits and creates a lead
- [ ] SEO meta tags present on all pages
- [ ] Lighthouse performance 90+
- [ ] Tenant branding applies correctly

**Commit:** `Phase 4: Public Website — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 5.**

---

## PHASE 5: BOOKING / PROJECT PLANNER

### Objective
Build the guided multi-step booking flow that walks homeowners through their project, provides an AI-generated price range, schedules a consultation, and auto-enrolls them into the client portal. This is the conversion engine.

### Step 5.1 — Booking Flow Layout

Create `app/(marketing)/book/page.tsx`:
- Full-page booking experience (no sidebar, minimal header)
- Progress bar at top showing current step (1 of 6)
- Step transitions with smooth animation
- Mobile-optimized (this is where most conversions happen)
- "Back" button on each step. "Exit" link to return to homepage.
- State managed with zustand store

### Step 5.2 — Step 1: Project Type Selector

- Visual card grid of project types from `service_catalog`
- Each card: icon/image, service name, brief description
- Click to select → highlights with checkmark → auto-advances
- Search/filter bar for tenants with many services
- "Other / Not Sure" option at bottom

### Step 5.3 — Step 2: Smart Follow-Up Questions

- **Dynamic questions based on selected service**
- Questions defined in `service_catalog.booking_questions` JSONB
- Question types: text, select, multi-select, range slider, photo upload, yes/no
- AI generates follow-up questions if `booking_questions` is empty
- Examples:
  - Bathroom remodel: "What would you like to update?" (Shower, Tub, Vanity, Flooring, Everything)
  - Deck build: "What material do you prefer?" (Pressure-treated lumber, Composite, Cedar, Hardwood)
  - Handyman: "Describe what you need done" (free text)
- Photo upload option: "Have photos of the space? Drop them here."
- All answers stored in structured JSONB

### Step 5.4 — Step 3: Scope and Size

- Room/area dimensions (if applicable): length × width inputs
- Complexity selector with visual aids: Simple, Moderate, Complex
- Timeline preference: "When would you like this done?" (ASAP, 1-3 months, 3-6 months, Flexible)
- Budget range selector (optional): slide between ranges
- Visual references: "Which style resonates with you?" (image options if applicable)

### Step 5.5 — Step 4: Instant Range Estimate

- **This is the trust-building moment.**
- Display a loading animation: "Our AI is analyzing your project..."
- Call edge function `ai/generate` with module `estimate_builder`:
  - Pass all booking flow data as context
  - AI generates: estimated price range (low-high), estimated duration, key factors
- Display beautifully:
  - Price range in large font: "$12,000 — $18,000"
  - "Based on your project details"
  - Estimated duration: "2-3 weeks"
  - Key factors that affect price (bullet list)
  - Disclaimer: "This is a preliminary range. Your final quote will be provided after an on-site consultation."
- CTA: "Schedule Your Free Consultation"
- This step alone closes deals. It demonstrates competence and transparency.

### Step 5.6 — Step 5: Schedule Consultation

- Calendar date picker showing available dates
- Time slot selector (from tenant's `working_hours_start` to `working_hours_end`)
- Checks availability via edge function `scheduling/check-availability`
- Selected date/time confirmed with visual indicator
- "We'll confirm within 24 hours" if no live availability check

### Step 5.7 — Step 6: Account Creation + Enrollment

- Form: first name, last name, email, phone, set password (optional — can use magic link)
- Address (pre-filled from earlier steps if provided)
- "By creating an account, you agree to our Terms of Service"
- On submit:
  1. Create Supabase Auth user
  2. Create `clients` record
  3. Create `properties` record (if address provided)
  4. Create `leads` record with all booking data in `project_details` JSONB
  5. Create `schedule_events` record for the consultation
  6. Set user role to 'client', tenant_id to current tenant
  7. Set `portal_enrolled = true` on client record
  8. Send confirmation email (edge function: notifications/email)
  9. Send SMS confirmation if phone provided (edge function: notifications/sms)
- Redirect to confirmation page: "You're all set! Check your email for details."
- Show: next steps, what to expect, portal login link

### Step 5.8 — Edge Functions

Create `supabase/functions/leads/capture/index.ts`:
- Validates all inputs
- Creates lead with full booking data
- Triggers lead scoring
- Sends notification to assigned team member
- Returns lead_id

Create `supabase/functions/leads/score/index.ts`:
- AI-powered lead scoring (0-100)
- Factors: project value, timeline urgency, completeness of info, location
- Updates lead.score and lead.score_factors

Create `supabase/functions/ai/generate/index.ts`:
- **THE unified AI generation endpoint**
- Accepts: `{ module, prompt, context, project_id?, client_id? }`
- Calls `resolve_ai_model(tenant_id, module)` to get model config
- Routes to correct provider (Anthropic, OpenAI, Google)
- Logs everything to `ai_generations`
- Returns generated content

### Step 5.9 — Verify + Commit

- [ ] Booking flow works end-to-end (all 6 steps)
- [ ] AI generates realistic price range estimate
- [ ] Calendar shows available dates
- [ ] Account creation + portal enrollment works
- [ ] Lead is created with full project details
- [ ] Lead scoring runs
- [ ] Confirmation email sends
- [ ] Flow works perfectly on mobile
- [ ] Smooth step transitions

**Commit:** `Phase 5: Booking / Project Planner — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 6.**

---

## PHASE 6: CRM + LEAD MANAGEMENT

### Objective
Build the contractor's CRM. Lead pipeline, client directory, contact management, property management. This is the first section of the "operating system" the contractor uses daily.

### Step 6.1 — Admin Layout

Create `app/(admin)/layout.tsx`:
- **Sidebar navigation** (collapsible):
  - Dashboard
  - Leads (with unread count badge)
  - Clients
  - Projects
  - Estimates & Proposals
  - Contracts
  - Invoices & Payments
  - Scheduling
  - Staffing
  - Documents
  - Reports
  - AI Assistant
  - Settings
- **Top bar:** Tenant logo, search (global), notifications bell, user avatar + dropdown
- **Guard:** Tenant admin roles only
- **Responsive:** Sidebar collapses to icons on medium screens, hamburger on mobile

### Step 6.2 — Admin Dashboard

Create `app/(admin)/dashboard/page.tsx`:
- Key metrics cards: Active Leads, Active Projects, Outstanding Invoices, Revenue This Month
- Recent leads (last 5)
- Upcoming schedule (next 3 events)
- Overdue invoices (action required)
- Quick actions: New Lead, New Project, Create Invoice
- Revenue chart (last 12 months)

### Step 6.3 — Lead Pipeline

Create `app/(admin)/leads/page.tsx`:
- **Kanban board view** (default): columns for each lead status
  - Drag and drop to change status
  - Cards show: name, source badge, temperature dot, value, days since created
- **List view** (toggle): sortable, filterable table
- **Filters:** status, source, temperature, assigned to, date range
- **Search:** fuzzy search on name, email, phone, description
- **Bulk actions:** assign, change status, export
- "New Lead" button → slide-out form

Create `app/(admin)/leads/[id]/page.tsx`:
- **Tabbed detail view:**
  - Overview: all lead fields, editable inline
  - Activity: timeline of all interactions (calls, emails, status changes)
  - Notes: add/view notes
  - Documents: uploaded files from booking flow
  - AI Summary: AI-generated lead summary and recommended next steps
- **Actions panel (right side):**
  - Change status
  - Assign to team member
  - Schedule follow-up
  - Send email/SMS
  - Convert to Client + Project
- **Convert to Client** flow:
  1. Creates client record (pre-filled from lead)
  2. Creates property record (if address exists)
  3. Optionally creates project record
  4. Links lead to client (converted_to_client_id)
  5. Changes lead status to 'won'

### Step 6.4 — Client Directory

Create `app/(admin)/clients/page.tsx`:
- Searchable table: name, type, phone, email, total projects, total revenue, last contact
- Filters: client type, tags, assigned to
- Click to open detail

Create `app/(admin)/clients/[id]/page.tsx`:
- **Tabbed view:**
  - Overview: contact info, editable
  - Properties: list of properties, add/edit
  - Projects: all projects for this client
  - Invoices: all invoices
  - Payments: payment history
  - Documents: associated documents
  - Notes: notes timeline
  - Portal: portal enrollment status, last login, send invitation
  - Activity: full activity log
- **Quick actions:** New Project, New Invoice, Send Message, Edit

### Step 6.5 — Verify + Commit

- [ ] Admin layout with sidebar renders correctly
- [ ] Dashboard shows live metrics from database
- [ ] Lead pipeline Kanban works with drag-and-drop
- [ ] Lead detail view loads all data
- [ ] Lead → Client conversion works
- [ ] Client directory is searchable and filterable
- [ ] Client detail shows all tabs with data
- [ ] Notes system works
- [ ] All views responsive on mobile

**Commit:** `Phase 6: CRM + Lead Management — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 7.**

---

## PHASE 7: PROJECT MANAGEMENT

### Objective
Build the full project management suite. Project list, detail view with phases and tasks, daily logs, photo documentation, and the project timeline.

### Step 7.1 — Project List

Create `app/(admin)/projects/page.tsx`:
- **Card grid view** (default): project cards with status badge, client name, progress bar, dates, value
- **List view** (toggle): sortable table
- **Filters:** status, type, priority, project manager, date range
- **Search:** by name, project number, client name
- "New Project" button → creation form (pre-fill from client/lead if navigated from CRM)

### Step 7.2 — Project Detail

Create `app/(admin)/projects/[id]/page.tsx`:
- **Header:** Project name, number, status badge, priority, client name link, property address
- **Progress bar:** visual completion percentage
- **Tabbed content:**

**Overview Tab:**
- Key dates (estimated start/end, actual start/end)
- Financial summary (contract amount, change orders, invoiced, paid, outstanding)
- Phase summary with status indicators
- Assigned team members
- Insurance claim details (if applicable)
- AI project summary

**Phases Tab:**
- Ordered list of phases with status, dates, completion %
- Add/edit/reorder phases
- Expand phase to see tasks within it
- Phase status quick-toggle

**Tasks Tab:**
- Kanban board within project (backlog, todo, in progress, in review, done)
- Drag and drop
- Task cards: title, assignee avatar, priority dot, due date
- Click to expand: full detail, subtask checklist, time entries, notes
- "Add Task" inline

**Daily Logs Tab:**
- Chronological list of daily log entries
- Each entry: date, weather, summary, crew count, hours, photos
- "Add Log" form: rich text, photo upload, weather auto-fill
- AI summary generation button

**Photos Tab:**
- Gallery grid of all project photos
- Filter by category (before, progress, after, inspection)
- Upload new photos with category tagging
- Click to enlarge with detail overlay

**Documents Tab:**
- File list with type icons, upload date, size
- Upload new documents
- Link to contracts, permits, invoices

**Financials Tab:**
- Budget vs actuals breakdown
- Line-item cost tracking
- Change order impact
- Profitability analysis
- Expense list for this project
- Invoice list for this project

**Activity Tab:**
- Full audit trail of every action on this project

### Step 7.3 — Project Timeline (Gantt)

Create a Gantt chart component:
- Horizontal timeline with phases as bars
- Tasks within phases as sub-bars
- Dependencies shown as connecting arrows
- Draggable to adjust dates
- Today marker line
- Use a lightweight library or custom SVG implementation

### Step 7.4 — Verify + Commit

- [ ] Project list loads with filters and search
- [ ] Project detail shows all tabs with data
- [ ] Phases can be created, reordered, status-changed
- [ ] Tasks work with Kanban drag-and-drop
- [ ] Daily logs can be created with photos
- [ ] Photo gallery uploads and displays correctly
- [ ] Gantt chart renders phases and tasks
- [ ] Financial tab shows accurate numbers

**Commit:** `Phase 7: Project Management — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 8.**

---

## PHASE 8: ESTIMATING + PROPOSALS

### Objective
Build the estimate builder, AI scope generation, proposal builder, and e-signature integration. Contractors create professional estimates and proposals that clients can view, accept, and sign.

### Step 8.1 — Service Catalog Management

Create `app/(admin)/settings/services/page.tsx`:
- CRUD for service catalog entries
- Name, description, trade category, pricing model, base price, difficulty
- Booking questions editor (JSONB — dynamic form builder)
- Toggle active/featured/booking-enabled
- Reorder services

### Step 8.2 — Material Library

Create `app/(admin)/settings/materials/page.tsx`:
- CRUD for material library entries
- Name, category, unit cost, unit, markup, supplier
- Search by name, SKU, category
- Import from CSV
- Price history tracking

### Step 8.3 — Estimate Builder

Create `app/(admin)/estimates/page.tsx`:
- List of all estimates with status badges
- Filter by status, client, project

Create `app/(admin)/estimates/[id]/page.tsx`:
- **Estimate builder interface:**
  - Client and project selector at top
  - Sections (collapsible groups of line items)
  - Line items within sections:
    - Type selector (labor, material, equipment, sub, etc.)
    - Name, description, quantity, unit, unit cost, markup, unit price, total
    - Material library search to auto-fill
    - Service catalog search to auto-fill
  - Add line item / add section buttons
  - Running totals: subtotal, tax, discount, total
  - Cost breakdown sidebar: labor %, material %, equipment %, sub %, overhead %, profit %
- **AI Scope Generation:**
  - "Generate with AI" button
  - Sends project description to `ai/generate` with module `scope_generator`
  - AI returns structured scope with phases and line items
  - Auto-populates the estimate builder
  - User reviews and adjusts
- **Actions:**
  - Save draft
  - Send to client (email + portal)
  - Generate PDF
  - Duplicate estimate
  - Create proposal from estimate

### Step 8.4 — Proposal Builder

Create `app/(admin)/proposals/page.tsx` and `app/(admin)/proposals/[id]/page.tsx`:
- **Section-based builder:**
  - Cover letter (rich text)
  - Executive summary
  - Scope of work
  - Timeline
  - Pricing (linked from estimate, Good/Better/Best tiers)
  - Qualifications
  - Terms and conditions
  - Signature block
- **Drag and drop** section reordering
- **AI generation** for each section individually
- **Preview mode:** see how it looks to the client
- **Send:** email with link to view in portal
- **E-signature:** DocuSign/HelloSign integration for acceptance

### Step 8.5 — Edge Functions

Create `supabase/functions/documents/generate-proposal/index.ts`:
- AI generates proposal content based on estimate + project details
- Returns structured sections

### Step 8.6 — Verify + Commit

- [ ] Service catalog CRUD works
- [ ] Material library CRUD works
- [ ] Estimate builder creates line items correctly
- [ ] Math (subtotals, tax, discounts) is accurate
- [ ] AI scope generation produces realistic output
- [ ] Proposal builder renders with sections
- [ ] Good/Better/Best tiers work
- [ ] PDF generation works
- [ ] Send via email works

**Commit:** `Phase 8: Estimating + Proposals — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 9.**

---

## PHASE 9: CONTRACTS + DOCUMENTS

### Objective
Build the contract system with AI-powered generation, change orders, lien waivers, permit tracking, and the document vault.

### Step 9.1 — Contract Template Management

Create `app/(admin)/settings/contract-templates/page.tsx`:
- List of templates with name, type, trade categories
- Template editor with `{{variable}}` placeholder support
- Clause library (reusable clauses)
- Preview with sample data

### Step 9.2 — Contract Builder

Create `app/(admin)/contracts/[id]/page.tsx`:
- **Two modes:**
  - **From template:** Select template, auto-fill variables from project/client/estimate data
  - **AI generation:** Call `ai/generate` with module `contract_drafter`, generate full contract from project context
- Full contract editor (rich text)
- Clause insertion from library
- Variable replacement preview
- Financial terms section (amount, payment terms, retainage)
- Schedule section (start, completion, milestones)
- **E-signature flow:**
  1. Contractor signs first
  2. Sends to client
  3. Client signs in portal
  4. Both parties receive executed copy
  5. Status updates to `fully_executed`

### Step 9.3 — Change Orders

Create change order management within project detail:
- "New Change Order" button
- Form: title, description, reason (from enum), scope additions/deletions
- Line items with cost impact
- Schedule impact (days)
- Approval workflow: internal review → client approval → signed
- AI impact analysis: "How does this change affect the project?"

### Step 9.4 — Lien Waivers

Create lien waiver management:
- Generate from template (4 types)
- Track by project and subcontractor
- Signature and notarization tracking

### Step 9.5 — Permits + Inspections

Create permit and inspection tracking within project detail:
- Add permits by type
- Track application → approval → issued → final
- Inspection scheduling
- Pass/fail tracking with notes and corrections
- Expiration alerts

### Step 9.6 — Document Vault

Create `app/(admin)/documents/page.tsx`:
- Folder tree (left sidebar)
- File grid/list (main area)
- Upload with drag-and-drop
- File preview (images, PDFs)
- Search by name, type, tags
- Version history
- Sharing (generate link, set expiry)
- AI document summary on upload

### Step 9.7 — Verify + Commit

- [ ] Contract templates CRUD works
- [ ] AI contract generation produces usable contracts
- [ ] Contract editor renders correctly
- [ ] Change orders calculate cost/schedule impact
- [ ] Lien waivers generate from templates
- [ ] Permits track through lifecycle
- [ ] Document vault uploads and organizes files
- [ ] E-signature flow works end-to-end

**Commit:** `Phase 9: Contracts + Documents — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 10.**

---

## PHASE 10: INVOICING + PAYMENTS

### Objective
Build the full invoicing system with Stripe Connect, online payments, progress billing, draw schedules, expense tracking, and purchase orders.

### Step 10.1 — Stripe Connect Onboarding

Create `app/(admin)/settings/payments/page.tsx`:
- Stripe Connect status indicator
- "Connect Stripe" button → initiates onboarding flow
- Account details once connected
- Payout schedule display
- Platform fee configuration

### Step 10.2 — Invoice Builder

Create `app/(admin)/invoices/[id]/page.tsx`:
- Client and project selector
- Invoice type selector (standard, progress, draw, final, recurring)
- Line items: name, description, quantity, unit price, tax, total
- Auto-populate from estimate/contract
- **Progress billing mode:**
  - Scheduled value per line item
  - Previous billed column
  - Current billed column
  - Stored materials column
  - Retainage column
  - AIA G702/G703 style
- Running totals with tax and discounts
- Payment terms selector
- Notes and footer text
- "Preview" mode
- "Send" → email with payment link + update in client portal

### Step 10.3 — Payment Recording

Create payment management:
- Online payments via Stripe (automatic recording)
- Manual payment entry: check, cash, wire, etc.
- Apply payment to invoice(s)
- Partial payment support
- Refund processing
- Payment receipt generation

### Step 10.4 — Draw Schedules

Create draw schedule management within project:
- Milestone-based payment schedule
- Each draw: amount, milestone description, completion % required
- Request → approve → pay workflow
- Linked to invoices

### Step 10.5 — Expenses

Create `app/(admin)/expenses/page.tsx`:
- Expense entry: category (from exhaustive enum), amount, vendor, date, receipt photo
- Assign to project
- Approval workflow
- Receipt photo capture (mobile camera)

### Step 10.6 — Purchase Orders

Create purchase order management:
- Create PO with line items from material library
- Send to vendor
- Receiving: mark items as received
- Match to invoices/expenses

### Step 10.7 — Edge Functions

Create `supabase/functions/payments/create-checkout/index.ts`:
- Creates Stripe Checkout Session or PaymentIntent
- Sets `transfer_data` to tenant's connected account
- Calculates platform fee
- Returns checkout URL

Create `supabase/functions/payments/webhook/index.ts`:
- Handles all Stripe events:
  - `payment_intent.succeeded` → update payment status, update invoice
  - `checkout.session.completed` → same
  - `charge.refunded` → create refund record
  - `account.updated` → update tenant Stripe status
- Routes by connected account

### Step 10.8 — Verify + Commit

- [ ] Stripe Connect onboarding works
- [ ] Invoice builder creates correct line items
- [ ] Progress billing calculates correctly
- [ ] Online payment via Stripe processes
- [ ] Manual payment recording works
- [ ] Payment applies to invoice and updates balance
- [ ] Expense entry with receipt upload works
- [ ] Draw schedule workflow functions
- [ ] Purchase orders create and track receiving
- [ ] Webhook handles all Stripe events

**Commit:** `Phase 10: Invoicing + Payments — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 11.**

---

## PHASE 11: CLIENT PORTAL

### Objective
Build the client-facing portal. This is where homeowners log in to track their project, view invoices, make payments, sign documents, and communicate with their contractor. It must be clean, simple, and reassuring.

### Step 11.1 — Portal Layout

Create `app/(portal)/layout.tsx`:
- Clean, simple navigation: Dashboard, My Projects, Messages, Payments, Documents
- Tenant-branded header with logo
- User name + avatar in top right
- Mobile-first design (most clients use phones)
- No complexity — this is for homeowners, not power users

### Step 11.2 — Portal Dashboard

Create `app/(portal)/dashboard/page.tsx`:
- Active project card with progress bar and current phase
- Next scheduled work date
- Outstanding invoices with "Pay Now" button
- Unread messages count with link
- Recent activity feed
- Weather note if outdoor work is scheduled

### Step 11.3 — Project Tracker

Create `app/(portal)/projects/[id]/page.tsx`:
- Visual progress bar showing phases
- Current phase highlighted with description
- Phase history (completed phases with dates)
- Daily log entries (client-visible only)
- Photo gallery (client-visible only)
- Change order status
- Documents (contracts, permits, plans)
- "Ask a Question" button → opens message thread

### Step 11.4 — Messaging

Create `app/(portal)/messages/page.tsx`:
- Thread list (left panel)
- Message view (right panel)
- Real-time via Supabase Realtime subscriptions
- File/photo sharing in messages
- Read receipts
- Push notifications for new messages

### Step 11.5 — Payments

Create `app/(portal)/payments/page.tsx`:
- Outstanding invoices with detail and "Pay Now"
- Payment history with receipt downloads
- Stripe Checkout integration for online payment
- ACH option if enabled

### Step 11.6 — Documents

Create `app/(portal)/documents/page.tsx`:
- Client-visible documents organized by type
- E-signature actions (sign contracts, change orders)
- Download capability
- Warranty documents

### Step 11.7 — Verify + Commit

- [ ] Portal layout is clean and mobile-first
- [ ] Dashboard shows accurate project status
- [ ] Project tracker displays phases and progress
- [ ] Messaging works in real-time
- [ ] Invoice viewing and online payment works
- [ ] Documents display and e-signature works
- [ ] Push notifications fire for new messages

**Commit:** `Phase 11: Client Portal — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 12.**

---

## PHASE 12: STAFFING + SCHEDULING

### Objective
Employee management, subcontractor management, vendor directory, time tracking, crew scheduling, certification tracking, and Google Calendar sync.

### Step 12.1 — People Management

Create directories for employees, subcontractors, and vendors:
- **Employees:** `app/(admin)/staffing/employees/` — list + detail with all HR fields, pay config, certifications, assigned equipment
- **Subcontractors:** `app/(admin)/staffing/subcontractors/` — list + detail with insurance tracking, W9 status, performance ratings, trade specialties
- **Vendors:** `app/(admin)/staffing/vendors/` — list + detail with account info, order history, ratings

### Step 12.2 — Crew Management

- Create/edit crews with name, foreman, members
- Assign crew to projects/tasks
- View crew availability

### Step 12.3 — Time Tracking

- Clock in/out with GPS location capture
- Break tracking
- Overtime calculation
- Timesheet view by employee by week
- Approval workflow: submitted → approved → locked
- Export for payroll

### Step 12.4 — Scheduling Calendar

Create `app/(admin)/scheduling/page.tsx`:
- Full calendar view (month, week, day)
- Drag-and-drop event creation
- Event types from `schedule_event_type` enum
- Color-coded by type
- Multiple views: by person, by project, by crew
- Conflict detection (double-booking warning)

### Step 12.5 — Google Calendar Sync

Create `supabase/functions/scheduling/sync-calendar/index.ts`:
- Two-way sync between `schedule_events` and Google Calendar
- Uses `google_event_id` for linkage
- Handles creates, updates, deletes in both directions

### Step 12.6 — Certification Tracking

- List all certifications with expiry dates
- Expiring soon highlighted
- Automated reminder notifications (60 days before expiry)

### Step 12.7 — Verify + Commit

- [ ] Employee CRUD with all fields
- [ ] Subcontractor CRUD with insurance tracking
- [ ] Vendor directory works
- [ ] Crew management works
- [ ] Time clock in/out with GPS
- [ ] Timesheet approval workflow
- [ ] Calendar renders with drag-and-drop
- [ ] Certification expiry alerts work

**Commit:** `Phase 12: Staffing + Scheduling — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 13.**

---

## PHASE 13: AI COMMAND CENTER

### Objective
Build the AI chat interface, generation history, module routing dashboard (tenant-level), A/B test monitoring, and ensure all AI edge functions work end-to-end.

### Step 13.1 — AI Chat Interface

Create `app/(admin)/ai/page.tsx`:
- Persistent AI chat sidebar (available everywhere via floating button)
- Full-page chat view with conversation history
- Context-aware: if on a project page, AI knows the project context
- Conversation persistence via `ai_conversations` table
- Commands: `/scope`, `/estimate`, `/contract`, `/email`, `/summary`
- Streaming responses (SSE from edge function)

### Step 13.2 — Generation History

Create `app/(admin)/ai/history/page.tsx`:
- List of all AI generations with type, model used, date, feedback
- Filter by module, model, date range
- Click to see full prompt/output
- Feedback buttons (thumbs up/down, used as-is, edited)

### Step 13.3 — AI Module Routing (Tenant Admin)

Create `app/(admin)/settings/ai/page.tsx`:
- Table of all AI modules
- For each: current model, routing strategy, status
- Edit: change model, temperature, max_tokens, system prompt override
- Cost tracking per module this month

### Step 13.4 — A/B Test Dashboard (Tenant Admin)

Create `app/(admin)/settings/ai/ab-tests/page.tsx`:
- Create new test: select module, variant A model, variant B model, traffic split
- Running tests: live metrics (requests, latency, cost, quality scores, feedback)
- Completed tests: winner determination, apply winner button

### Step 13.5 — Edge Function: AI Chat

Create `supabase/functions/ai/chat/index.ts`:
- Manages multi-turn conversation
- Loads conversation history from `ai_conversations`
- Resolves model via `resolve_ai_model()`
- Streams response back to client
- Saves updated conversation history
- Logs to `ai_generations`

### Step 13.6 — Verify + Commit

- [ ] AI chat works with streaming responses
- [ ] Conversation persistence works
- [ ] Context-awareness works (project context)
- [ ] Generation history displays correctly
- [ ] Module routing config is editable
- [ ] A/B test creation and monitoring works
- [ ] All AI modules generate correctly

**Commit:** `Phase 13: AI Command Center — complete`
**Deploy to Vercel.**
**Update SSOT.**
**Continue to Phase 14.**

---

## PHASE 14: COMMUNICATIONS + NOTIFICATIONS

### Objective
Build the unified inbox, email/SMS sending, automated notifications, and the notification center.

### Step 14.1 — Unified Inbox

Create `app/(admin)/messages/page.tsx`:
- All message threads in one place
- Filter by: client, project, channel (in-app, email, SMS)
- Thread view with full conversation history
- Reply with channel selector
- Mark read/unread
- Archive

### Step 14.2 — Email + SMS Templates

Create `app/(admin)/settings/templates/page.tsx`:
- Template editor with merge variables (`{{client.first_name}}`, `{{project.name}}`, etc.)
- Channel: email or SMS
- Trigger: manual or automated (linked to notification_type)
- Preview with sample data
- Test send

### Step 14.3 — Notification Engine

Create `supabase/functions/notifications/send/index.ts`:
- Accepts: notification_type, entity_type, entity_id, user_ids
- Determines channels based on user notification preferences
- Sends via in-app + email + SMS as configured
- Creates notification record
- Fires webhooks if configured

Create `supabase/functions/notifications/email/index.ts`:
- Renders email template with merge data
- Sends via SendGrid/SES
- Logs to email_log

Create `supabase/functions/notifications/sms/index.ts`:
- Renders SMS template with merge data
- Sends via Twilio
- Logs to sms_log

### Step 14.4 — Notification Center (In-App)

- Bell icon in top bar with unread count
- Dropdown panel with recent notifications
- Click to navigate to relevant entity
- Mark as read / dismiss
- "View All" link to full notifications page

### Step 14.5 — Automation Rules

Create `app/(admin)/settings/automations/page.tsx`:
- Rule builder: When [trigger_event] → Do [action]
- Actions: send email, send SMS, create task, update status, AI generate, webhook
- Delay configuration
- Enable/disable toggle
- Run history

### Step 14.6 — Verify + Commit

**Commit:** `Phase 14: Communications + Notifications — complete`
**Deploy.** **Update SSOT.** **Continue.**

---

## PHASE 15: REPORTING + ANALYTICS

### Objective
Financial dashboards, project reports, lead analytics, saved report builder.

### Step 15.1 — Financial Dashboards

Create `app/(admin)/reports/page.tsx`:
- Revenue chart (monthly, quarterly, annual)
- Expenses by category
- Profit margin by project
- Accounts receivable aging
- Cash flow projection
- Top clients by revenue

### Step 15.2 — Project Reports

- Projects by status
- Average project duration
- On-time completion rate
- Budget variance analysis

### Step 15.3 — Lead Analytics

- Lead conversion funnel
- Lead source performance
- Response time metrics
- Revenue by lead source

### Step 15.4 — Saved Reports

- Custom report builder (select columns, filters, grouping)
- Save report configuration
- Schedule email delivery
- Export CSV/PDF

### Step 15.5 — Materialized View Refresh

Set up a Supabase cron job (pg_cron or Edge Function scheduled) to refresh materialized views every 15 minutes.

### Step 15.6 — Verify + Commit

**Commit:** `Phase 15: Reporting + Analytics — complete`
**Deploy.** **Update SSOT.** **Continue.**

---

## PHASE 16: INTEGRATIONS

### Objective
QuickBooks sync, Google Calendar sync, Zapier webhooks, outbound webhook management.

### Step 16.1 — Integration Management

Create `app/(admin)/settings/integrations/page.tsx`:
- Available integrations with connect/disconnect
- Status indicators
- Last sync time
- Sync log viewer
- Error alerts

### Step 16.2 — QuickBooks Online

- OAuth2 connection flow
- Sync invoices, payments, expenses
- Account mapping configuration
- Bidirectional sync with conflict resolution

### Step 16.3 — Outbound Webhooks

Create `app/(admin)/settings/webhooks/page.tsx`:
- Create webhook: URL, events to subscribe, secret
- Test webhook
- Delivery log with retry

Create `supabase/functions/webhooks/dispatch/index.ts`:
- Fires webhooks for subscribed events
- Retry logic (3 attempts with backoff)
- Logs all deliveries

### Step 16.4 — Verify + Commit

**Commit:** `Phase 16: Integrations — complete`
**Deploy.** **Update SSOT.** **Continue.**

---

## PHASE 17: GRAND TRAVERSE HOME CO. LAUNCH

### Objective
Final validation. Provision Grand Traverse Home Co. as the first tenant with full branding. End-to-end testing of every feature.

### Step 17.1 — Provision Tenant

Using the Platform Admin Dashboard:
1. Create Grand Traverse Home Co. tenant
2. Upload logo and set branding colors
3. Configure subdomain: `grandtraverse.contractorsos.com`
4. Set up service catalog (general contracting, handyman, remodeling, custom builds)
5. Configure AI module routing (default models)
6. Initialize sequences

### Step 17.2 — End-to-End Testing

Test every flow:
1. **Public Website:** Homepage loads with branding. All pages render. Mobile works.
2. **Booking Flow:** Complete booking → lead created → client enrolled → confirmation sent.
3. **CRM:** Lead appears in pipeline. Convert to client. Create project.
4. **Project Management:** Create phases and tasks. Add daily log. Upload photos.
5. **Estimating:** Generate AI estimate. Create proposal. Send to client.
6. **Contracts:** Generate AI contract. Send for signature.
7. **Invoicing:** Create invoice. Send to client. Process payment.
8. **Client Portal:** Log in as client. View project. Pay invoice. Send message.
9. **Messaging:** Real-time message between admin and client.
10. **Scheduling:** Create events. Verify calendar.
11. **AI:** Chat with AI. Generate scope. Test A/B routing.
12. **Reports:** Financial dashboard shows accurate data.

### Step 17.3 — Performance Audit

- Lighthouse scores on all public pages (target: 90+)
- Mobile usability audit
- SEO validation (meta tags, structured data, sitemap)
- Load time under 2 seconds

### Step 17.4 — Final Commit

**Commit:** `Phase 17: Grand Traverse Home Co. Launch — complete`
**Deploy.** **Update SSOT with final status.**

---

## POST-LAUNCH

After Phase 17, the platform is live. Future work:
- Custom domain setup for Grand Traverse Home Co.
- Stripe Connect onboarding for real payments
- Content population (portfolio, reviews, team)
- Second tenant onboarding
- Mobile PWA optimization
- Advanced reporting features
- Additional integrations

---

## REMEMBER

- **Read CLAUDE.md** for all technical rules and patterns.
- **Read OS_SINGLE_SOURCE_OF_TRUTH.md** for current state.
- **Do not stop between phases.** Build, commit, deploy, continue.
- **Update the SSOT** after every phase completion.
- **If something breaks, fix it and keep going.**
- **The public website must be stunning.** It is the acquisition engine.
- **The AI must be switchable.** Every call goes through the model resolver.
- **No Vercel API routes.** Everything server-side is an Edge Function.

**Now build it.**
