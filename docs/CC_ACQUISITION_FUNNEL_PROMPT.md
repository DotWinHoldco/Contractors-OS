# CONTRACTORS OS — CLIENT-FACING REFACTOR

## WHAT THIS IS

All 17 build phases are COMPLETE. The platform is built and deployed. This is a REFACTOR of the client-facing side — the marketing site, booking flow, and client portal. The admin dashboard, edge functions, database, and backend are already working. Do not rebuild what exists. Edit, replace, and enhance what's already there.

## REFERENCE

Read `GrandTraverseDemo.jsx` in the project root. This is the reference implementation for the new cinematic aesthetic and acquisition funnel. Match its look, feel, and flow.

Read `docs/dotwin-brand-guide.md` — it has been updated with the cinematic luxury aesthetic. This is now the visual source of truth.

Use `grep -rn` to find existing files before creating new ones. Use `grep` to read specific sections. Keep token usage sane.

## SCOPE OF THIS REFACTOR

You are editing/replacing these EXISTING files and creating new ones where needed:

- `app/(marketing)/page.tsx` — REPLACE with PASTOR framework cinematic homepage
- `app/(marketing)/layout.tsx` — EDIT header to transparent→solid scroll behavior, dark footer
- `app/(marketing)/book/page.tsx` — REPLACE with new 3-stage intake + AI chat
- `app/(marketing)/book/plan/page.tsx` — NEW: Solution Schedule report view
- `app/(marketing)/book/preview/page.tsx` — NEW: Guest dashboard preview (no login)
- `app/(marketing)/services/` — EDIT to match cinematic aesthetic
- `app/(marketing)/portfolio/` — EDIT to match cinematic aesthetic
- `app/(marketing)/about/` — EDIT to match cinematic aesthetic
- `app/(marketing)/contact/` — EDIT to match cinematic aesthetic
- `app/(portal)/dashboard/page.tsx` — EDIT: add gold progress bar, rep card, phase timeline, calendar
- `app/(portal)/projects/[id]/page.tsx` — EDIT: add CRUD calendar, task completion tracking, before/after photos
- `components/marketing/` — NEW section components for PASTOR framework
- `components/booking/` — NEW components for intake flow
- `components/portal/` — EDIT existing portal components
- `supabase/functions/ai/generate/index.ts` — EDIT: ensure booking_assistant module works
- `supabase/functions/leads/capture/index.ts` — EDIT: accept full booking payload, create all records
- `supabase/functions/notifications/email/index.ts` — EDIT: add booking_complete template
- `styles/globals.css` — EDIT: add cinematic CSS (grain, reveals, pulse, shimmer)

Do NOT touch: admin dashboard, platform admin, auth pages, staffing, estimates, contracts, invoices, scheduling, documents, reports, AI command center, settings, or any edge functions not listed above. Those are done.

---

## 1. MARKETING SITE — PASTOR FRAMEWORK

**REPLACE:** `app/(marketing)/page.tsx` and **EDIT:** `app/(marketing)/layout.tsx`

The current homepage is being replaced with the PASTOR psychological conversion framework. Each section is a full-viewport act with scroll-triggered reveal animations (Intersection Observer, fade-up 40px, staggered delays).

### Section Flow:

**HERO** — Cinematic full-screen. Background image with dark overlay + film grain texture. Yeseva One headline: "You're Not Looking for a Contractor. You're Looking for a Solution." Gold CTA button with subtle pulse animation: "Build Your Free Project Plan." Secondary outline button: "See How It Works." Scroll indicator at bottom.

**PROBLEM** — "Hiring a Contractor Shouldn't Feel Like a Gamble." Stats row: 1 in 4 negative experiences, 30% budget overruns, 67% cite communication as #1 frustration. Content about the terror of handing someone $15K–$150K with no visibility.

**AMPLIFY** — Dark section. Pull quote from a horror story. Two-column layout: the emotional toll (homes torn apart, contractors who ghost) and the systemic issue (no transparency, no plan, no accountability).

**STORY/SOLUTION** — "We Engineered a Better Way to Renovate Your Home." Three-step process cards with hover animations: (1) Tell Us Your Vision — AI advisor, (2) Get Your Solution Schedule — instant plan, (3) Track Every Detail — personal portal. Marketing copy: "Not only do we deliver, we help you plan every step of the way."

**TRANSFORMATION/TESTIMONIALS** — "From Anxiety to Confidence." Four testimonial cards with 5-star ratings, client names, project descriptions. Content speaks to the FEELING, not just the work.

**OFFER + RISK REVERSAL** — Dark section with gold accents. "Your Project Plan is Free. No Strings. No Sales Pitch." Bullet points: no obligation, no hidden fees, no surprise change orders, plan is yours to keep. "Even if you don't go with us, we want you to have the tools you need to get the job done right." Large gold CTA: "Build Your Free Project Plan →"

### Dynamic Content:
- Testimonials come from the `reviews` table
- Stats can be overridden per tenant in settings
- Service categories come from `service_catalog`
- Company name, phone, address from `tenants` table
- PASTOR copy sections stored in `tenants.settings` JSONB under a `marketing_copy` key so tenants can customize

---

## 2. BOOKING FLOW — REPLACE EXISTING

**REPLACE:** `app/(marketing)/book/page.tsx`
**NEW:** `app/(marketing)/book/plan/page.tsx`, `app/(marketing)/book/preview/page.tsx`
**NEW:** components under `components/booking/`

### The Intake (3 stages, then AI chat)

Full-screen dark experience. Progress bar at top. Smooth transitions between stages.

**Stage 1 — "Who's building?" (5 seconds max)**
- Three fields only: Full name, Email, Phone
- Micro-copy: "We'll send your project plan to this email"
- Auto-advance button enables when name + email filled
- No last name field. No address. No form fatigue.

**Stage 2 — "What are we building?" (10 seconds max)**
- Large visual pill cards from `service_catalog` with icons
- Click to select → gold highlight → single selection
- Categories loaded dynamically per tenant

**Stage 3 — "How big is this project?" (10 seconds max)**
- Scope pills: "Quick refresh" / "Full remodel" / "Down to the studs" / "Not sure yet"
- Timeline pills: "ASAP" / "1–3 months" / "3–6 months" / "Just planning"
- CTA: "Talk to Your Project Advisor →"

### The AI Chat (Stage 4)

Full-screen chat interface. Dark mode. Clean.

**Header:** Shows advisor name + "AI-Powered" badge + project type / scope context pill.

**CRITICAL — The AI must be FAST to the report.** The system prompt instructs the AI to:
1. Open warmly and reference what they selected
2. Ask ONE key question about the current state of the space
3. Ask ONE question about their dream outcome
4. Ask ONE question about budget comfort level or any concerns
5. After 3-4 exchanges MAX, say "I have a great picture — let me build your Solution Schedule" and generate the report
6. Do NOT ask more than 4 questions. The homeowner will lose attention. Get to the value fast.

**System prompt** is loaded from `ai_templates` for this tenant, and includes:
- Tenant's service catalog and trade categories
- Tenant's service area
- Tenant's company name and representative info
- Instructions to extract data conversationally but QUICKLY
- The `---SOLUTION_SCHEDULE---` JSON output format

**AI calls** go through `supabase/functions/ai/generate` with module `booking_assistant`. Model resolved via `resolve_ai_model()`.

**Chat features:**
- Streaming feel (messages appear with typing indicator)
- Send on Enter, Shift+Enter for newline
- Auto-scroll to latest message
- The AI's tone is warm, knowledgeable, and efficient

---

## 3. SOLUTION SCHEDULE — NEW PAGE

**NEW:** `app/(marketing)/book/plan/page.tsx`

When the AI generates the `---SOLUTION_SCHEDULE---` JSON, the chat view transitions to the Solution Schedule view. This is the money moment.

### The Report Display:
- **Header:** Project title, estimated cost range (large, gold), estimated duration
- **Phase Breakdown:** Numbered phases with name, duration, description, cost range per phase. Visual timeline aesthetic — numbered circles connected by a vertical line.
- **Key Decisions:** Gold-bordered cards listing decisions the homeowner needs to make (materials, fixtures, style choices)
- **Risk Flags:** Red-bordered cards for things to watch (lead paint, permits, structural concerns)
- **Your Representative:** Headshot photo, name, title, phone, email of the assigned team member (from `employees` table — the default rep is configured in tenant settings as `default_representative_id`). "This is who you'll be working with." This puts a face to the company immediately.
- **Next Steps:** Numbered list of what happens next

### The Report Must Be Printable:
- "Print Your Plan" button that triggers `window.print()` with a clean print stylesheet
- `@media print` styles: white background, no buttons, no navigation, clean typography, company logo + contact info in header, "Prepared for [Client Name]" and date

### What Happens in the Database When the Report Generates:
1. **Create `leads` record** — all intake data (name, email, phone, project type, scope, timeline) + full chat transcript in `project_details` JSONB + AI-generated summary in `ai_summary`
2. **Create `clients` record** — from name, email, phone. Set `portal_enrolled = true`, `portal_enrolled_at = now()`
3. **Create Supabase Auth user** — with email, send magic link for portal access
4. **Create `projects` record** — status `inquiry`, name from solution schedule title, all financial estimates populated
5. **Create `project_phases` records** — one per phase from the solution schedule, with names, descriptions, estimated durations, ordered correctly
6. **Create `schedule_events` record** — placeholder for consultation (status `tentative`)
7. **Log to `ai_generations`** — full prompt, output, tokens, model used, module `booking_assistant`
8. **Send email** (via `notifications/email` edge function) — "Your project plan is ready. Click here to access your full project management portal." Include magic link for passwordless login.

---

## 4. GUEST DASHBOARD PREVIEW — NEW PAGE

**NEW:** `app/(marketing)/book/preview/page.tsx`

After viewing the report, the user sees TWO CTAs:
1. **"Schedule a Consultation"** — calendar picker, creates a `schedule_events` record
2. **"Preview Your Portal"** — takes them to a GUEST preview of their portal

### The Guest Dashboard Preview:
This is a read-only preview of what their portal will look like. It shows:
- Their project name and status ("Research & Preparation Underway")
- A **gold progress bar** with animated fill — shows overall project progress
- Their phase breakdown as a vertical timeline (phase 1 highlighted as "current")
- A "Your Representative" card with headshot, name, phone, email
- Quick action cards (greyed out / locked): Messages, Documents, Payments, Calendar
- A prominent banner at top: **"Check your email to log in to your free project management portal. Plan and manage your project — even if you don't go with us, we want you to have the tools you need to get the job done right."**

This preview is accessible WITHOUT login — it uses a unique token in the URL (stored in `leads.metadata` or a dedicated `preview_token` column). The preview expires after 7 days.

The psychological effect: they see the portal, they see their project already loaded, they see the progress bar, the phases, their representative's face. They HAVE to log in. The switching cost is already real.

---

## 5. CLIENT PORTAL — EDIT EXISTING PAGES

**EDIT:** existing portal pages under `app/(portal)/`

The portal pages already exist and work. You are ENHANCING them — adding the gold progress bar, representative card, CRUD calendar, task completion tracking, and before/after photos. Do not rewrite the portal from scratch. Edit what's there.

### Portal Dashboard (`app/(portal)/dashboard/page.tsx`)
- **Project Status Banner:** Project name, status badge, gold progress bar with percentage and label ("Research & Preparation Underway" → "Demolition in Progress" → etc.)
- **Your Representative Card:** Headshot, name, title, direct phone, direct email. "Questions? Call [Name] directly."
- **Phase Timeline:** Visual vertical timeline showing all phases. Current phase highlighted with gold accent. Completed phases have checkmarks. Future phases are muted. Each phase shows: name, estimated duration, status.
- **Upcoming:** Next scheduled events (consultation, work dates)
- **Action Items:** Things the client needs to do (sign contract, make payment, choose materials)

### Project Manager / Task Calendar (`app/(portal)/projects/[id]/page.tsx`)
- **Calendar View:** Full month calendar. Client can:
  - See contractor-scheduled events (work days, inspections, deliveries) in gold
  - See their own tasks in a secondary color
  - **Double-click any day** to add a CRUD task (title, description, due date)
  - Mark their own tasks as complete (checkbox)
  - See when the contractor marks a task as complete (with timestamp)
- **Task List View:** Toggle between calendar and list. Sortable, filterable.
- **Phase Progress:** Each phase shows its tasks, completion status, before/after photos when available

### Progress Tracking
- **Gold progress bar** at the top of every project view — animated, fills based on completed phases / total phases
- Phase labels update as work progresses: "Planning" → "Permits" → "Demolition" → "Rough-In" → etc.
- **Before/After Photos:** Side-by-side display when available. Contractor uploads "before" photos tagged to a phase, then "after" photos when phase completes.

### Contract Signing
- Phases that require contracts show a "Contract to Sign" indicator
- Client can view and sign contracts directly in the portal (e-signature flow)
- Status: "Awaiting Your Signature" → "Signed" with date

### Payments
- Invoices appear at the appropriate phase milestones
- Client sees: invoice amount, due date, "Pay Now" button
- Payment history with receipts
- Draw schedule visibility if applicable

### Documents
- All project documents organized by phase
- Contracts, permits, plans, warranty docs
- Upload capability for the client (inspiration photos, existing surveys, etc.)

### Messages
- Threaded messaging with the contractor team
- Real-time via Supabase Realtime
- Photo/file sharing in messages

---

## 6. EDGE FUNCTION EDITS

These edge functions already exist. You are EDITING them to support the new booking flow. Do not rewrite them from scratch — add to what's there.

### `supabase/functions/ai/generate/index.ts`
- Ensure the `booking_assistant` module is fully supported
- System prompt must include tenant context (service catalog, company info, representative)
- Must handle the `---SOLUTION_SCHEDULE---` parsing on the backend as well (validate the JSON, log it)
- Rate limit: max 20 messages per booking session

### `supabase/functions/leads/capture/index.ts`
- Accept the full booking flow payload: contact info, intake selections, chat transcript, solution schedule JSON
- Create all records listed in Section 3 (lead, client, auth user, project, phases, schedule event)
- Send the portal invitation email with magic link
- Return: lead_id, client_id, project_id, preview_token

### `supabase/functions/notifications/email/index.ts`
- New template: `booking_complete` — "Your project plan is ready"
- Includes: project summary, representative info with photo, magic link to portal, link to print-friendly plan
- Branded per tenant (logo, colors from theme)

### `supabase/functions/auth/on-signup/index.ts`
- Handle the case where user was created during booking flow
- Link the auth user to the existing client record
- Set role to `client`, tenant_id from booking context

---

## 7. DATABASE — ALTER TABLE ONLY

The migration has already been run. Do NOT create a new migration file or modify the original. Use ALTER TABLE statements in a SEPARATE small SQL file (`supabase/migrations/20260316000000_booking_flow_columns.sql`) or run them via Supabase MCP.

### New columns to add via ALTER TABLE:
```sql
-- Only add if they don't already exist. Check first with Supabase MCP.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preview_token TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS chat_transcript JSONB DEFAULT '[]'::JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS solution_schedule JSONB DEFAULT '{}'::JSONB;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS created_by_client BOOLEAN DEFAULT FALSE;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS client_completed_at TIMESTAMPTZ;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS contractor_completed_at TIMESTAMPTZ;
```

### Use existing JSONB fields — no ALTER needed:
- `leads.project_details` — store intake selections (project type, scope, timeline)
- `leads.metadata` — store preview_token here as a fallback if ALTER fails
- `projects.metadata` — store the full solution schedule JSON
- `tenants.settings` — store `default_representative_id` and `marketing_copy` JSONB keys here (the column already exists)

---

## 8. BRAND COMPLIANCE — CINEMATIC LUXURY AESTHETIC

Read `docs/dotwin-brand-guide.md` BEFORE building. It has been updated to the cinematic luxury aesthetic. Here are the critical rules:

### The Aesthetic
The marketing site is a FILM, not a brochure. Dark-dominant with light punctuation. Every section is a full-viewport act. The feeling is editorial luxury — Architectural Digest meets premium SaaS. This is what separates us from every contractor website in existence.

### Typography
- **Yeseva One** at `clamp(40px, 6vw, 72px)` for hero headlines, section titles, project names. Letter-spacing: -0.02em. These headlines COMMAND the viewport.
- **Outfit** for everything else — body (300-400 weight, 16-18px), headings H1-H3 (600 weight), buttons (600 weight, 14px, uppercase, letter-spacing 0.08em), nav (500 weight, 13px, uppercase, letter-spacing 0.04em).

### Colors — Dark/Light Rhythm
- **Dark sections (#000000, #0A0A0A, #1A1A1A):** Hero, Amplify, Offer, Booking flow, AI Chat, Solution Schedule. Film grain texture overlay (CSS feTurbulence, 4% opacity, animated).
- **Light sections (#FAFAFA, #FFFFFF, #F9F7F5):** Problem, Story/Solution, Testimonials, Admin dashboard, Portal.
- **The rhythm matters:** DARK → light → DARK → light → light(warm) → DARK → dark(footer). This alternation creates cinematic pacing.
- **Gold (#D4A84B)** appears ONLY on: CTAs (with pulse animation), progress bars (with shimmer), active/selected states, section labels, step numbers, star ratings. Nowhere else.
- **Muted white text** on dark: rgba(255,255,255,0.6) for body, rgba(255,255,255,0.4) for secondary, rgba(255,255,255,0.3) for micro-copy.

### Buttons
- **Gold CTA (primary):** Background #D4A84B, black text, 0px border-radius on marketing (sharp/architectural), pulse animation `box-shadow: 0 0 0 0 rgba(212,168,75,0.4)`. Hover: #C49A3F, translateY(-1px). Active: ripple effect.
- **Outline (secondary on dark):** Transparent, white text, 1px border rgba(255,255,255,0.4). Hover: border white, bg rgba(255,255,255,0.05).
- **Admin buttons:** 6px border-radius, black/white. Admin is FUNCTIONAL, not cinematic.

### Cards
- **Marketing cards:** 0px border-radius (sharp). Border: rgba(255,255,255,0.08) on dark, #F0EDEA on light. Padding 40px. Hover: border-color #D4A84B, translateY(-4px). NO box-shadow ever.
- **Admin/Portal cards:** 8px border-radius. Softer. Functional.

### Animations (Marketing Only)
- **Scroll reveals:** opacity 0 → 1, translateY(40px → 0), 0.9s cubic-bezier(0.16, 1, 0.3, 1). Stagger children by 0.1s.
- **Gold pulse:** `@keyframes pulse-gold` on all primary CTAs. The button literally glows.
- **Film grain:** Animated noise texture on all dark sections via `::before` pseudo-element.
- **Scroll indicator:** Float animation at hero bottom. Vertical line fading downward.
- **Header:** Transparent at top → `rgba(0,0,0,0.95)` + `backdrop-filter: blur(20px)` on scroll past 80px.
- **Intake transitions:** Stage content fades up (0.5s cubic-bezier) on each step.
- **Admin/Portal:** NO cinematic animations. Subtle only: 150ms ease transitions, skeleton pulse loading states, progress bar shimmer.

### Layout
- **Full-viewport sections** (min-height 100vh) on marketing. One idea per screen.
- **Section padding:** 120-140px top/bottom on marketing. Generous. Luxury breathes.
- **Content max-width:** 800-900px for text sections, 1000-1100px for card grids.
- **Sticky header:** Transparent → solid black on scroll. Logo left, nav center, gold CTA right.
- **Section labels:** Outfit 600, 12px, letter-spacing 0.2em, uppercase, #D4A84B. Above every section heading.

### Images
- Hero: full-bleed photo + `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85))` overlay + grain
- No stock photos of handshakes or happy families. Real renovation work. Real team.
- Team headshots: professional, warm, dark/neutral backgrounds
- Portfolio: before/after pairs, same angle, high contrast

### Print Stylesheet
- White background, no navigation, no buttons, no grain
- Company logo + contact in header
- "Prepared for [Client Name]" + date
- Clean Outfit typography, black text
- Phase breakdown renders as a clean numbered list

### The Rule
**Marketing is cinematic. Admin is functional. Portal is clean. Never mix them.**

---

## 9. THE PHILOSOPHY — REMEMBER THIS

The client acquisition funnel is not a form. It's an EXPERIENCE. The homeowner should feel:

1. **Understood** — the intake asks smart questions, not generic ones
2. **Educated** — the AI tells them things they didn't know they needed to know
3. **Empowered** — they get a real plan, not a sales pitch
4. **Impressed** — the technology itself is the trust signal. "If they built THIS..."
5. **Committed** — their project is already in the portal. Switching means starting over.

The marketing copy drives home: "Not only do we deliver, we help you plan every step of the way. Even if you don't go with us, we want you to have the tools you need to get the job done right."

That last line is the risk reversal that makes the offer irresistible. It's so generous it feels impossible. And it works because the portal itself is the lock-in — once they're in, they're not leaving.

---

## 10. OTHER MARKETING PAGES — MATCH THE NEW AESTHETIC

The services, portfolio, about, and contact pages already exist. EDIT them to match the new cinematic look:

### Services (`app/(marketing)/services/`)
- Dark hero section with Yeseva One headline
- Service cards on light section with 0px radius, gold hover border
- Individual service pages: dark hero, light content, gold CTAs

### Portfolio (`app/(marketing)/portfolio/`)
- Dark gallery layout. Photos on black background — let the work speak.
- Before/after slider with gold accent handle
- Project detail pages: dark hero with project stats, light content below

### About (`app/(marketing)/about/`)
- Dark hero with Yeseva One headline: "Built Different."
- Team section with headshot cards on light background
- Company story in editorial two-column layout

### Contact (`app/(marketing)/contact/`)
- Dark section with contact form (gold focus states on inputs)
- Representative card with headshot
- Map embed on light section below

### Reviews (`app/(marketing)/reviews/`)
- Dark hero with aggregate rating in gold
- Review cards on warm (#F9F7F5) background with gold stars

**Every page follows the dark/light rhythm. Every page uses the cinematic scroll reveals. Every page has the gold CTA.**

---

## 11. CRM MARKETING ENGINE — RESEND / EMAIL / TWILIO / SMS

### Redundancy Check First
Before building ANY of this, run:
```bash
grep -rn "resend\|sendgrid\|email.*send\|twilio\|sms.*send" supabase/functions/ --include="*.ts" -l
grep -rn "campaign\|audience\|segment\|circle\|broadcast" apps/web/app/ --include="*.tsx" -l
grep -rn "notification.*push\|push.*notification\|web.*push\|service.*worker" apps/web/ --include="*.ts" --include="*.tsx" -l
```
If functionality exists, verify it meets the specs below. If it's partial, extend it. If it's missing, build it. Log what you find.

### Email System (Resend)

**Edge Function:** `supabase/functions/notifications/email/index.ts` — EDIT or BUILD

The email system must support both transactional AND marketing emails:

**Transactional Emails (already partially built — verify these work):**
- Booking confirmation with solution schedule summary
- Portal invitation with magic link
- Invoice sent / payment received
- Appointment reminders (24hr and 1hr before)
- Project status updates (phase completed, inspection passed)
- Contract ready for signature
- Password reset / magic link login

**Marketing Emails (NEW — CRM broadcast capability):**
- **Campaign Builder:** `app/(admin)/messages/campaigns/page.tsx`
  - Rich text email editor with merge variables (`{{client.first_name}}`, `{{project.name}}`, etc.)
  - Subject line with merge variables
  - Preview mode with real client data
  - Schedule send (now, specific date/time, or drip sequence)
  - Template library — save and reuse campaign templates
- **Audience / Circle Segmentation:** `app/(admin)/messages/audiences/page.tsx`
  - Create named audiences ("All Active Clients", "Leads from Google Ads", "Kitchen Remodel Clients", "Past Clients — No Activity 6mo+")
  - Segment by: client_type, lead_source, project_type, project_status, tags, location (city/zip), last_contact_date, total_revenue, portal_enrolled
  - Dynamic segments that auto-update as data changes vs static lists
  - Audience size preview before sending
- **Link Tracking:**
  - Every link in every email gets a unique tracking redirect through the edge function
  - Track: email_id, recipient, link_url, clicked_at, device, ip
  - Store in `email_link_clicks` table (create if not exists)
  - Dashboard shows: open rate, click rate, click-through by link, unsubscribes
- **Unsubscribe Management:**
  - One-click unsubscribe link in every marketing email (CAN-SPAM compliance)
  - Unsubscribe preferences: all marketing, specific categories, or transactional only
  - Respect `clients.is_do_not_contact` flag
  - Unsubscribe page branded per tenant

**Database tables needed (ALTER TABLE or CREATE if not exists):**
```sql
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  from_name TEXT,
  from_email TEXT,
  audience_id UUID,
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, sent, cancelled
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_audiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  segment_rules JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{field, operator, value}]
  is_dynamic BOOLEAN DEFAULT TRUE,
  member_count INTEGER DEFAULT 0,
  last_computed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_link_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES email_campaigns(id),
  email_log_id UUID REFERENCES email_log(id),
  recipient_email TEXT,
  client_id UUID REFERENCES clients(id),
  link_url TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  device_type TEXT,
  ip_address INET,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  category TEXT DEFAULT 'all', -- all, marketing, specific_campaign
  UNIQUE(tenant_id, email)
);
```

### SMS System (Twilio)

**Edge Function:** `supabase/functions/notifications/sms/index.ts` — EDIT or BUILD

- **Transactional SMS:** appointment reminders, "Your contractor is on the way", payment confirmations, portal login links
- **Marketing SMS:** campaign broadcasts to audience segments (same audience system as email)
- **Two-way SMS:** Incoming messages from clients create message thread entries
- **Opt-out management:** "Reply STOP to unsubscribe" — auto-process and flag client record
- **Delivery tracking:** Track sent, delivered, failed, undelivered per message via Twilio status callbacks

**Edge Function:** `supabase/functions/notifications/sms-webhook/index.ts` — NEW
- Receives Twilio status callbacks (delivered, failed, undelivered)
- Receives inbound SMS messages
- Routes inbound messages to the correct client's message thread
- Processes STOP/unsubscribe keywords

### Unified Notification Dispatch

**Edge Function:** `supabase/functions/notifications/send/index.ts` — EDIT or BUILD

Single entry point for ALL notifications. Accepts:
```typescript
{
  tenant_id: string,
  notification_type: string, // from notification_type enum
  entity_type: string,
  entity_id: string,
  recipient_user_ids: string[],
  data: Record<string, any> // merge variables
}
```

The dispatcher:
1. Looks up each recipient's `notification_preferences` from `users` table
2. Determines which channels to send on (in_app, email, sms, push)
3. Respects quiet hours (`quiet_hours_start`, `quiet_hours_end`)
4. Creates `notifications` record (in-app notification)
5. Sends email if preference allows (via Resend/SendGrid)
6. Sends SMS if preference allows (via Twilio)
7. Sends push notification if enabled
8. Fires outbound webhooks if configured

---

## 12. PUSH NOTIFICATIONS + REAL-TIME ALERTS

### Push Notifications (Web Push API)

**Files to create/edit:**
- `apps/web/public/sw.js` — Service worker for receiving push
- `apps/web/lib/push/subscribe.ts` — Push subscription logic
- `apps/web/lib/push/vapid.ts` — VAPID key management
- `apps/web/components/shared/push-prompt.tsx` — UI prompt to enable push
- `supabase/functions/notifications/push/index.ts` — Send push notifications

**How it works:**
1. When client logs into portal, prompt to enable push notifications (subtle, non-intrusive)
2. On accept: browser creates push subscription, sends endpoint + keys to server
3. Store subscription in `push_subscriptions` table (create if not exists)
4. When a notification fires, the dispatch function sends Web Push to all active subscriptions for that user
5. Push payload includes: title, body, icon (tenant logo), click_url (deep link to relevant page)

**Push Notification Triggers:**
- "Your contractor is on the way" (manually triggered by contractor from admin)
- "Phase [X] is complete — check your portal for photos"
- "Your invoice is ready — [amount] due by [date]"
- "Contract ready for your signature"
- "New message from [contractor name]"
- "Appointment reminder: [event] tomorrow at [time]"
- "Your project plan is ready" (after booking flow)

**Database:**
```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  device_type TEXT,
  browser TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  UNIQUE(user_id, endpoint)
);
```

### In-App Notification Center

**File:** `apps/web/components/shared/notification-center.tsx` — EDIT or BUILD

- Bell icon in top bar with unread count (red badge)
- Click opens dropdown panel with recent notifications
- Each notification: icon, title, body, timestamp, read/unread indicator
- Click notification → navigate to the relevant entity (project, invoice, message, etc.)
- "Mark all as read" action
- Real-time via Supabase Realtime subscription on `notifications` table
- Works in BOTH admin AND portal views

### "On the Way" Feature

**Admin action:** In the scheduling calendar or project view, contractor clicks "Notify Client — On My Way"
- Triggers push notification + SMS + in-app notification to the client
- SMS: "Hi [name], your contractor [rep_name] is heading to your property now. ETA approximately [X] minutes."
- Push: "🏠 [Rep Name] is on the way!"
- Creates an activity_log entry

---

## 13. PLATFORM AUDIT — VERIFY EVERYTHING WORKS

After completing sections 1-12, run a full audit. This is not optional.

### Step 1: Check for Redundancy
Before auditing, grep for everything you just built to make sure you didn't duplicate existing functionality:
```bash
echo "=== Checking for duplicate email systems ==="
grep -rn "resend\|sendgrid" supabase/functions/ --include="*.ts" -l | sort | uniq -c | sort -rn

echo "=== Checking for duplicate SMS systems ==="
grep -rn "twilio" supabase/functions/ --include="*.ts" -l | sort | uniq -c | sort -rn

echo "=== Checking for duplicate notification dispatchers ==="
grep -rn "notification.*send\|dispatch.*notification" supabase/functions/ --include="*.ts" -l

echo "=== Checking for duplicate campaign/audience tables ==="
grep -rn "email_campaigns\|email_audiences\|push_subscriptions" supabase/functions/ --include="*.ts" -l
```
If you find duplicates, consolidate. One system, one path, one source of truth.

### Step 2: Database Integrity Audit
Use Supabase MCP to run these checks:

```sql
-- Verify all expected tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Verify new tables were created
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_campaigns') as email_campaigns_exists;
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_audiences') as email_audiences_exists;
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_link_clicks') as email_link_clicks_exists;
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_unsubscribes') as email_unsubscribes_exists;
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'push_subscriptions') as push_subscriptions_exists;

-- Verify ALTER TABLE columns were added
SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' AND column_name IN ('preview_token', 'chat_transcript', 'solution_schedule');
SELECT column_name FROM information_schema.columns WHERE table_name = 'project_tasks' AND column_name IN ('created_by_client', 'client_completed_at', 'contractor_completed_at');

-- Verify RLS is enabled on new tables
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('email_campaigns', 'email_audiences', 'email_link_clicks', 'email_unsubscribes', 'push_subscriptions');

-- Verify AI model registry is seeded
SELECT model_key, display_name, provider, is_active FROM ai_model_registry;

-- Verify foreign key relationships are intact
SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### Step 3: Edge Function Audit
```bash
echo "=== All edge functions ==="
find supabase/functions -name "index.ts" | sort

echo "=== Verify each function has CORS handling ==="
for f in $(find supabase/functions -name "index.ts"); do
  if grep -q "corsHeaders\|cors" "$f"; then
    echo "✅ CORS: $f"
  else
    echo "❌ MISSING CORS: $f"
  fi
done

echo "=== Verify AI functions use model resolver ==="
for f in $(find supabase/functions/ai -name "index.ts"); do
  if grep -q "resolve_ai_model\|resolveModel\|model_key" "$f"; then
    echo "✅ Model resolver: $f"
  else
    echo "❌ HARDCODED MODEL: $f — FIX THIS"
  fi
done

echo "=== Verify notification functions exist ==="
for fn in "email" "sms" "send" "push"; do
  if [ -f "supabase/functions/notifications/$fn/index.ts" ]; then
    echo "✅ notifications/$fn"
  else
    echo "❌ MISSING: notifications/$fn — BUILD THIS"
  fi
done
```

### Step 4: Frontend Build Audit
```bash
echo "=== Running build ==="
cd apps/web && pnpm build 2>&1 | tail -30

echo "=== Check for TypeScript errors ==="
pnpm tsc --noEmit 2>&1 | tail -30

echo "=== Verify all marketing pages exist ==="
for page in "page.tsx" "services/page.tsx" "portfolio/page.tsx" "about/page.tsx" "contact/page.tsx" "book/page.tsx" "book/plan/page.tsx" "book/preview/page.tsx"; do
  if [ -f "app/(marketing)/$page" ]; then
    echo "✅ (marketing)/$page"
  else
    echo "❌ MISSING: (marketing)/$page"
  fi
done

echo "=== Verify portal enhancements ==="
grep -l "progress.*bar\|gold.*fill\|representative\|CRUD.*task\|double.*click.*calendar" app/\(portal\)/**/*.tsx 2>/dev/null
```

### Step 5: Data Flow Audit
Trace the complete booking flow data path and verify every write:
```bash
echo "=== Booking flow data writes ==="
grep -rn "leads.*insert\|clients.*insert\|projects.*insert\|project_phases.*insert\|schedule_events.*insert\|ai_generations.*insert" supabase/functions/leads/capture/ --include="*.ts"

echo "=== Notification triggers ==="
grep -rn "notifications/send\|notifications/email\|notifications/sms\|notifications/push" supabase/functions/ --include="*.ts" -l

echo "=== Verify email link tracking ==="
grep -rn "email_link_clicks\|link.*track\|track.*click" supabase/functions/ --include="*.ts" apps/web/ --include="*.ts" --include="*.tsx"
```

### Step 6: Fix Everything You Find
For every ❌ in the audit:
1. Fix it immediately
2. Re-run the specific check to verify it passes
3. Log what was wrong and what you fixed

Do NOT move on until every check passes.

---

## 14. VERIFICATION — EXPANDED

When complete, this full flow must work:

**Marketing Site:**
1. ✅ Homepage loads with all 6 PASTOR sections, full-viewport, scroll-triggered reveals
2. ✅ Dark/light rhythm is correct: DARK → light → DARK → light → warm → DARK
3. ✅ Film grain texture visible on dark sections
4. ✅ Header transitions from transparent to solid black on scroll
5. ✅ Gold pulse CTA button animates correctly
6. ✅ Services, portfolio, about, contact, reviews pages match cinematic aesthetic
7. ✅ Mobile responsive on all marketing pages
8. ✅ "Powered by .win" in footer

**Acquisition Funnel:**
9. ✅ "Build Your Free Project Plan" → intake flow opens (dark, full-screen)
10. ✅ 3-stage intake: contact → project pills → scope/timeline pills (gold selected states)
11. ✅ AI chat opens with tenant-context-aware system prompt
12. ✅ AI gets to the report in 3-4 exchanges max
13. ✅ Solution Schedule generates with phases, costs, decisions, risks
14. ✅ Representative headshot + info displays on the report
15. ✅ "Print Your Plan" generates a clean printable version
16. ✅ Database records created: lead, client, auth user, project, phases

**Post-Conversion:**
17. ✅ Email sent with magic link to portal
18. ✅ Guest preview dashboard accessible via token URL (no login required)
19. ✅ Guest preview shows project, gold progress bar, phases, representative, locked actions
20. ✅ "Check your email" banner with login CTA
21. ✅ Client logs in via magic link → full portal with project loaded

**Portal Enhancements:**
22. ✅ Portal dashboard shows gold progress bar with status label
23. ✅ Representative card with headshot, name, phone, email
24. ✅ Phase timeline with current/completed/future indicators
25. ✅ Client can double-click calendar days to add CRUD tasks
26. ✅ Client can mark tasks complete, see contractor completions
27. ✅ Before/after photos display when available
28. ✅ Contract signing, payment, documents, messages all accessible

**CRM Marketing:**
29. ✅ Email campaign builder works (compose, preview, schedule, send)
30. ✅ Audience segmentation creates dynamic segments from client/lead data
31. ✅ Link tracking records clicks with device/IP/timestamp
32. ✅ Unsubscribe flow works (one-click, preferences page, updates client record)
33. ✅ SMS sending works via Twilio (transactional + marketing)
34. ✅ Inbound SMS webhook receives messages and routes to threads
35. ✅ Campaign analytics show open rate, click rate, bounce rate

**Notifications:**
36. ✅ In-app notification center with bell icon and unread count
37. ✅ Real-time notifications via Supabase Realtime
38. ✅ Push notifications prompt and subscribe flow works
39. ✅ Push notifications fire on key events (message, invoice, phase complete)
40. ✅ "On the way" notification sends push + SMS + in-app to client
41. ✅ Notification preferences respected (channels, quiet hours)
42. ✅ Email alerts fire for high-priority notifications

**Platform Integrity:**
43. ✅ `pnpm build` passes with zero errors
44. ✅ `pnpm tsc --noEmit` passes with zero type errors
45. ✅ All new tables exist with RLS enabled
46. ✅ All ALTER TABLE columns present
47. ✅ All edge functions have CORS handling
48. ✅ All AI functions use model resolver (no hardcoded models)
49. ✅ All notification channels (email, SMS, push, in-app) dispatch correctly
50. ✅ Foreign key relationships intact across all tables
51. ✅ No duplicate systems — one email sender, one SMS sender, one notification dispatcher

**Commit:** `Refactor: Cinematic PASTOR acquisition funnel + AI project planner + CRM marketing engine + push notifications + enhanced portal`

Edit existing files. Create new files where needed. Do not touch admin, platform admin, or backend that isn't listed in the scope above — UNLESS the audit reveals it's broken, in which case fix it. This must work end-to-end when you're done. Run the audit. Fix what's broken. Keep going until everything passes. Do not stop.
