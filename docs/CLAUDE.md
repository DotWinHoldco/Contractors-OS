# CLAUDE.md — Instructions for Building Contractors OS

> **This file tells Claude Code exactly how to build this project.**
> Read this FIRST. Then read `docs/OS_SINGLE_SOURCE_OF_TRUTH.md`. Then read `docs/BUILD_PHASES.md`.
> Then read `docs/dotwin-brand-guide.md` for all visual/brand decisions.
> Follow the rules. No exceptions.

---

## IDENTITY

You are building **.win (Contractors OS)**, a multi-tenant SaaS platform for home services businesses. It is a client acquisition engine + full business operating system. The frontend must generate instant authority. The backend must be bulletproof. The AI must be smart and switchable.

**Brand:** .win — black & white, serif + sans-serif split, premium restraint. See `docs/dotwin-brand-guide.md`.

---

## PROJECT ROOT

The project lives at: `/home/user/Contractors-OS/`

Key document paths:
- `/home/user/Contractors-OS/CLAUDE.md` — THIS FILE
- `/home/user/Contractors-OS/docs/BUILD_PHASES.md` — Phased build plan
- `/home/user/Contractors-OS/docs/OS_SINGLE_SOURCE_OF_TRUTH.md` — Living project state
- `/home/user/Contractors-OS/docs/dotwin-brand-guide.md` — Brand guide (fonts, colors, logos, UI rules)

---

## BEFORE EVERY SESSION

1. **Read `docs/OS_SINGLE_SOURCE_OF_TRUTH.md`** — find what phase you are on, what is complete, what is next.
2. **Read `docs/BUILD_PHASES.md`** — find the detailed instructions for the current phase.
3. **Read `docs/dotwin-brand-guide.md`** — all visual decisions are here. Follow it exactly.
4. **Never re-do completed work.** If the SSOT says Phase 3 is done, start at Phase 4.
5. **Never skip phases.** They are dependency-ordered. Phase 7 depends on Phase 6.

---

## AFTER EVERY COMPLETED PHASE

1. **Update `docs/OS_SINGLE_SOURCE_OF_TRUTH.md`:**
   - Check off all completed items in the phase checklist
   - Update `Last Phase Completed` and `Next Phase` at the top
   - Update `Build Status`
   - Add any new components to the Component Library Registry
   - Add any new edge functions to the Edge Function Registry
   - Log any design decisions
   - Log any known issues
   - Update dependency versions if changed
2. **Commit to GitHub** with message: `Phase N: [Phase Name] — complete`
3. **Push to Vercel** — verify deployment succeeds
4. **Continue to next phase immediately.** Do not stop. Do not ask for permission.

---

## TECH STACK RULES

### Next.js (Frontend Only)
- **App Router** with route groups: `(marketing)`, `(portal)`, `(admin)`, `(platform)`, `auth`
- **TypeScript** in strict mode everywhere
- **Server Components** by default. Use `'use client'` only when needed (interactivity, hooks, browser APIs)
- **NO `/api` directory.** Zero Vercel API routes. All server logic is in Supabase Edge Functions.
- **NO `getServerSideProps` or `getStaticProps`.** Use App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)
- **Metadata** via `export const metadata` or `generateMetadata()` on every page

### Supabase
- **Client-side:** Use `@supabase/ssr` with `createBrowserClient()` for browser components
- **Server-side:** Use `@supabase/ssr` with `createServerClient()` for server components and middleware
- **Edge Functions:** Written in TypeScript for Deno runtime. Use `supabase/functions/` directory.
- **RLS is always on.** Never bypass RLS unless using the service role key in edge functions for admin operations.
- **Types:** Generate with `supabase gen types typescript --project-id [id] > lib/supabase/types.ts`
- **Realtime:** Use for messages, notifications, project status updates in the portal

### Supabase Edge Functions (Server Logic)
```
supabase/functions/
├── ai/
│   ├── generate/index.ts      # All AI generation
│   ├── chat/index.ts          # AI chat
│   └── _shared/               # Shared AI utilities
├── payments/
│   ├── create-checkout/index.ts
│   ├── webhook/index.ts
│   └── _shared/
├── [domain]/
│   ├── [action]/index.ts
│   └── _shared/
└── _shared/                   # Global shared utilities
    ├── cors.ts
    ├── auth.ts
    ├── tenant.ts
    └── response.ts
```

**Edge Function Pattern:**
```typescript
// supabase/functions/[domain]/[action]/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with user's auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Your logic here...
    const body = await req.json();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

**Calling Edge Functions from Frontend:**
```typescript
// lib/supabase/edge.ts
import { supabase } from "./client";

export async function callEdgeFunction<T>(
  functionName: string,
  body?: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });
  if (error) throw error;
  return data as T;
}

// Usage:
const result = await callEdgeFunction("ai/generate", {
  module: "scope_generator",
  prompt: "Build a 500 sqft composite deck",
  project_id: "...",
});
```

### Styling
- **Tailwind CSS** for all styling. No CSS modules, no styled-components.
- **shadcn/ui** for all standard components (buttons, inputs, dialogs, tables, etc.)
- **Brand guide is the source of truth for all visual decisions.** See `docs/dotwin-brand-guide.md`.
- **CSS Variables** — use the full variable set from the brand guide. Core palette is black/white/warm grays. Tenant overrides only apply to tenant-facing pages.
```css
:root {
  /* Core .win palette — see dotwin-brand-guide.md for full list */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-off-white: #FAFAFA;
  --color-charcoal: #1A1A1A;
  --color-gray-50: #F9F7F5;
  --color-gray-100: #F0EDEA;
  --color-gray-200: #E0DBD5;
  --color-gray-400: #A39E97;
  --color-gray-600: #6B6560;
  --color-gray-800: #3D3834;
  --color-success: #2D6A4F;
  --color-warning: #CC8A00;
  --color-error: #C1292E;
  --color-info: #1B4965;
  --color-accent: #D4A84B;
  /* Semantic */
  --color-primary: var(--tenant-primary, var(--color-black));
  --color-primary-foreground: var(--color-white);
  --color-bg: var(--color-off-white);
  --color-surface: var(--color-white);
  --color-text: var(--color-charcoal);
  --color-text-secondary: var(--color-gray-600);
  --color-border: var(--color-gray-200);
}
```
- **Fonts:**
  - **Yeseva One** — Display/hero font. "Contractor" part of brand name. Large serif headings on marketing pages.
  - **Outfit** — Everything else. Headings (600 weight), body (400), buttons (600 uppercase), labels (500).
  - Load both via `next/font/google`.
  - Tailwind config: `font-display` for Yeseva One, `font-body` for Outfit.
- **Logo files** are in `public/logos/`. Use horizontal variant in headers, circular badge for favicons. Black on light, white on dark. See brand guide for full selection logic.
- **Dark mode:** Support via Tailwind `dark:` classes. Use the dark mode palette from brand guide.
- **No gradients. No large border-radius (max 8px). No illustrations. No playful animations.** The brand is black & white, sharp, and composed.

### AI Integration
- **Every AI call** goes through the `ai/generate` edge function
- **The edge function** calls `resolve_ai_model(tenant_id, module)` to get the correct model
- **The edge function** routes to the correct provider SDK (Anthropic, OpenAI, Google)
- **Every AI call** is logged to `ai_generations` with model_key, module, routing_strategy, tokens, cost, and ab_test info
- **Never hardcode model names** in frontend or edge functions. Always resolve from the routing table.

```typescript
// supabase/functions/ai/_shared/model-resolver.ts
export async function resolveModel(supabase: any, tenantId: string, module: string) {
  const { data, error } = await supabase.rpc("resolve_ai_model", {
    p_tenant_id: tenantId,
    p_module: module,
  });
  if (error || !data?.[0]) {
    // Fallback to claude-sonnet-4-6
    return {
      model_key: "claude-sonnet-4-6",
      api_model_id: "claude-sonnet-4-6",
      provider: "anthropic",
      temperature: 0.7,
      max_tokens: 4096,
    };
  }
  return data[0];
}
```

### Payments (Stripe Connect)
- **Platform account** owns the Stripe platform. Each tenant has a **connected account**.
- **Tenant onboarding:** Use Stripe Connect onboarding flow during provisioning.
- **Payments:** Create PaymentIntents with `transfer_data` to route funds to tenant's connected account.
- **Platform fee:** Configurable percentage taken from each payment.
- **Webhook:** Single webhook endpoint handles all Stripe events, routes by connected account.

### State Management
- **Server state:** Supabase queries via React Server Components or `@tanstack/react-query`
- **Client state:** `zustand` for UI state (sidebar open, modal state, etc.)
- **Form state:** `react-hook-form` + `zod` for validation
- **No Redux.** No MobX. No Context API for data fetching.

### Data Validation
- **Zod schemas** for all form inputs and API payloads
- **Schemas mirror database types** — generate from Supabase types where possible
- **Validate on client** (immediate feedback) **AND** on edge function (security)

---

## MULTI-TENANCY

### How Tenant Resolution Works

```
Browser Request
    ↓
Next.js Middleware (middleware.ts)
    ↓
Extract hostname from request
    ↓
Lookup tenant_id:
  - If hostname matches a custom domain → query tenant_domains table
  - If hostname is *.contractorsos.com → extract slug, query tenants table
  - If hostname is contractorsos.com → platform admin (no tenant context)
    ↓
Set tenant_id in cookie/header
    ↓
TenantProvider reads tenant_id, fetches theme + config
    ↓
CSS variables injected, logo loaded, ready to render
```

### Route Groups and Access

| Route Group | Who Accesses | Tenant Required | Auth Required |
|---|---|---|---|
| `(marketing)` | Public / anyone | Yes (for branding) | No |
| `(portal)` | Clients | Yes | Yes (client role) |
| `(admin)` | Contractor staff | Yes | Yes (tenant roles) |
| `(platform)` | Platform admins | No | Yes (platform roles) |
| `auth` | Anyone | Optional | No |

---

## CODE STANDARDS

### File Naming
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-currency.ts`)
- Hooks: `use-kebab-case.ts` (e.g., `use-tenant.ts`)
- Types: `kebab-case.ts` (e.g., `project-types.ts`)
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)

### Component Pattern
```typescript
// components/admin/ProjectCard.tsx
"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/supabase/types";

interface ProjectCardProps {
  project: Project;
  onSelect?: (id: string) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect?.(project.id)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{project.name}</h3>
          <Badge variant={getStatusVariant(project.status)}>
            {formatStatus(project.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* ... */}
      </CardContent>
    </Card>
  );
}
```

### Error Handling
- **Every Supabase query** must handle errors: `const { data, error } = await ...`
- **Every edge function** must have try/catch with proper HTTP status codes
- **Use `error.tsx`** boundary pages for each route group
- **Use `loading.tsx`** skeleton pages for each major page
- **Toast notifications** for user-facing errors (via shadcn/ui toast)

### Performance Rules
- **Images:** Use `next/image` with proper `width`, `height`, and `priority` on above-fold
- **Fonts:** Use `next/font/google` for optimized font loading
- **Dynamic imports:** Use `next/dynamic` for heavy components (charts, editors, calendars)
- **Pagination:** Server-side cursor pagination on all list views. Never load all records.
- **Caching:** Use `revalidate` on server components where appropriate. Cache tenant theme aggressively.

---

## GIT WORKFLOW

### Commit Messages
```
Phase N: [Phase Name] — complete
Phase N: [specific component or feature]
fix: [description]
chore: [description]
```

### Branch Strategy
- **`main`** — production, always deployable
- Build directly on `main` during initial build phases
- Branch for hotfixes after launch

### What Gets Committed
- All source code
- All edge functions
- Configuration files
- Documentation (SSOT, CLAUDE.md, BUILD_PHASES.md)
- **NOT:** `.env` files, `node_modules`, `.next`, Supabase secrets

---

## PERMISSIONLESS MODE

Claude Code operates in **permissionless mode** for this project. That means:

1. **Do not ask for confirmation** before building. Just build.
2. **Do not ask which framework** to use. The stack is locked (see above).
3. **Do not stop between phases.** Complete one, commit, deploy, continue to next.
4. **Do not ask about design choices.** Follow the patterns in this document.
5. **If something is ambiguous,** make the best decision, log it in the SSOT Design Decisions Log, and keep building.
6. **If something fails,** fix it, log the issue in the SSOT Known Issues, and keep building.
7. **If a dependency is needed,** install it with `pnpm add` and update the SSOT.
8. **The only reason to stop** is if a required secret/credential is missing from environment variables.

---

## DESIGN PRINCIPLES FOR THE PUBLIC WEBSITE

> **All visual details are defined in `docs/dotwin-brand-guide.md`. What follows are the strategic principles.**

The public website is the **client acquisition machine.** It must:

1. **Look premium.** Black & white foundation. Yeseva One serif headlines. Warm grays. Gold accent for premium moments. Not like a template. Not like every other contractor site.
2. **Load instantly.** Sub-2-second LCP on mobile. Edge-cached. Optimized images.
3. **Convert visitors.** Every page has a clear CTA (black button, white text, Outfit 600 uppercase). The booking flow is frictionless.
4. **Build trust.** Reviews, certifications, project gallery, team photos. Real, tangible proof.
5. **Work perfectly on mobile.** 70%+ of traffic is mobile. Touch-friendly. No horizontal scroll.
6. **Be dynamic per tenant.** Tenant colors override `--color-primary` on their pages. Tenant fonts override headings/body. Tenant logo replaces .win logo. Same code, different face.
7. **Show ".win" everywhere.** Every tenant site has "Powered by .win" in the footer with the horizontal logo at 16px height.

### Visual Rules (from brand guide)
- **Black & white first.** Color only for functional meaning or gold accent.
- **No gradients.** No drop shadows on cards (border or subtle elevation only). No border-radius > 8px.
- **No illustrations, no cartoons.** The brand is photographic and typographic.
- **Animations are composed.** Fade up on scroll (20px, 150ms). Hover transitions (150ms ease). No bounce, no spring, no playful motion.
- **Admin sidebar is black** with white text. White .win logo at top.
- **Lucide icons** only. Stroke width 1.5px.

---

## QUICK REFERENCE

### Supabase Types Generation
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/web/lib/supabase/types.ts
```

### Edge Function Deployment
```bash
supabase functions deploy [function-name] --project-ref YOUR_PROJECT_REF
```

### Local Development
```bash
pnpm dev                     # Start Next.js dev server
supabase start               # Start local Supabase
supabase functions serve     # Serve edge functions locally
```

### Key Files
| File | Purpose |
|---|---|
| `CLAUDE.md` | This file. Build instructions. READ FIRST. |
| `docs/OS_SINGLE_SOURCE_OF_TRUTH.md` | Living project state. READ SECOND. UPDATE AFTER EVERY PHASE. |
| `docs/BUILD_PHASES.md` | Detailed phase-by-phase build plan. READ THIRD. |
| `docs/dotwin-brand-guide.md` | Brand guide — fonts, colors, logos, UI component rules. FOLLOW EXACTLY. |
| `apps/web/middleware.ts` | Tenant resolution + auth |
| `apps/web/lib/supabase/types.ts` | Generated database types |
| `apps/web/lib/tenant/context.tsx` | TenantProvider |
| `supabase/functions/_shared/` | Shared edge function utilities |
| `public/logos/` | All .win logo variants (see brand guide for usage rules) |
