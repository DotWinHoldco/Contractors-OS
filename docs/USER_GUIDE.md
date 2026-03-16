# Contractors OS (.win) - Complete User Guide

> Step-by-step instructions for every feature in the platform.
> Last updated: March 16, 2026

---

## Table of Contents

1. [Getting Started & Accessing the Platform](#1-getting-started--accessing-the-platform)
2. [Authentication (Login / Signup)](#2-authentication-login--signup)
3. [Admin Dashboard Overview](#3-admin-dashboard-overview)
4. [Lead Management (CRM)](#4-lead-management-crm)
5. [Client Management](#5-client-management)
6. [Project Management](#6-project-management)
7. [Estimates](#7-estimates)
8. [Proposals](#8-proposals)
9. [Contracts](#9-contracts)
10. [Invoicing & Payments](#10-invoicing--payments)
11. [Scheduling (Calendar)](#11-scheduling-calendar)
12. [Staffing (Employees, Subs, Vendors)](#12-staffing-employees-subs-vendors)
13. [Messaging (Unified Inbox)](#13-messaging-unified-inbox)
14. [Document Vault](#14-document-vault)
15. [Reports & Analytics](#15-reports--analytics)
16. [AI Assistant (Command Center)](#16-ai-assistant-command-center)
17. [Settings — Complete Guide](#17-settings--complete-guide)
    - [Service Catalog](#171-service-catalog)
    - [Material Library](#172-material-library)
    - [Payment Settings (Stripe)](#173-payment-settings-stripe)
    - [Contract Templates](#174-contract-templates)
    - [Message Templates (Email/SMS)](#175-message-templates-emailsms)
    - [Automations](#176-automations)
    - [Integrations](#177-integrations)
    - [Webhooks](#178-webhooks)
    - [AI Routing & A/B Tests](#179-ai-routing--ab-tests)
18. [Client Portal (Your Customers' View)](#18-client-portal-your-customers-view)
19. [Public Website (Marketing Site)](#19-public-website-marketing-site)
20. [Booking Flow (How Clients Book)](#20-booking-flow-how-clients-book)
21. [Platform Admin (Super Admin)](#21-platform-admin-super-admin)
22. [Deployment & Domain Setup](#22-deployment--domain-setup)
23. [Environment Variables](#23-environment-variables)
24. [FAQ & Troubleshooting](#24-faq--troubleshooting)

---

## 1. Getting Started & Accessing the Platform

### Access URLs

The platform uses domain-based routing. Here's how access works:

| URL Pattern | What It Opens | Who Uses It |
|---|---|---|
| `https://your-app.vercel.app/admin/dashboard` | Admin Dashboard | Contractor staff |
| `https://your-app.vercel.app/portal/dashboard` | Client Portal | Your customers |
| `https://your-app.vercel.app/platform/dashboard` | Platform Super Admin | Platform owner |
| `https://your-app.vercel.app/` | Public Marketing Website | Anyone (public) |
| `https://your-app.vercel.app/book` | Booking Flow | Prospective clients |

**For local development:**
- `http://localhost:3000/admin/dashboard` — Admin panel
- `http://localhost:3000/portal/dashboard` — Client portal
- `http://localhost:3000/platform/dashboard` — Platform admin
- `http://localhost:3000/` — Public website

### Vercel Deployment

To deploy and get a live URL:

1. Connect the repo to Vercel at [vercel.com](https://vercel.com)
2. Set the **Root Directory** to `apps/web`
3. Set the **Framework** to Next.js
4. Add all required environment variables (see [Section 23](#23-environment-variables))
5. Deploy — your URL will be `https://your-project-name.vercel.app`

**Custom domains** (production):
- Tenant sites: `grandtraverse.contractorsos.com` or `grandtraversehomeco.com`
- The middleware resolves which tenant to show based on the hostname

### Multi-Tenant Domain Resolution

The platform automatically detects the tenant from the URL:

- `*.contractorsos.com` — extracts the subdomain slug, looks up the `tenants` table
- Any other domain — looks up the `tenant_domains` table for a verified custom domain match
- `localhost`, `vercel.app`, or the platform domain — treated as platform admin (no tenant context, all routes accessible)

**In demo mode** (no Supabase configured), all routes are accessible without authentication. This lets you explore the full UI immediately.

---

## 2. Authentication (Login / Signup)

### Accessing Auth Pages

| Page | URL | Purpose |
|---|---|---|
| Login | `/auth/login` | Sign in with email/password or OAuth |
| Signup | `/auth/signup` | Create a new account |
| Forgot Password | `/auth/forgot-password` | Request a password reset email |
| OAuth Callback | `/auth/callback` | Handles OAuth provider redirects |
| Accept Invite | `/auth/accept-invite` | Accept a team member invitation |

### How to Log In

1. Navigate to `/auth/login`
2. Enter your **email** and **password**
3. Click **Sign In**
4. Alternatively, click a social provider button (Google, etc.) for OAuth login

### How to Sign Up

1. Navigate to `/auth/signup`
2. Enter your **full name**, **email**, and **password**
3. Click **Create Account**
4. Check your email for a confirmation link
5. Click the link to verify your account

### Route Protection

- **Public pages** (`/`, `/services`, `/portfolio`, `/about`, `/contact`, `/book`, `/faq`, `/reviews`) — accessible to everyone, no login needed
- **Admin pages** (`/admin/*`) — requires login; redirects to `/auth/login` if not authenticated
- **Portal pages** (`/portal/*`) — requires login with client role
- **Platform pages** (`/platform/*`) — requires login with platform admin role
- If you're already logged in and visit `/auth/login`, you're redirected to `/admin/dashboard`

---

## 3. Admin Dashboard Overview

**URL:** `/admin/dashboard`

The dashboard is your command center. When you log in, this is the first thing you see.

### Layout

- **Left sidebar** (black background) — 13 navigation items, collapsible
- **Top bar** — search, notifications bell (with red dot for unread), user avatar
- **Main content area** — metrics, recent leads, upcoming events

### What's on the Dashboard

#### Metric Cards (top row, 4 cards)
| Card | Shows | Example |
|---|---|---|
| Active Leads | Number of current leads in your pipeline | 12 |
| Active Projects | Number of projects in progress | 5 |
| Outstanding Invoices | Number + total dollar amount of unpaid invoices | 3 ($8,400 pending) |
| Revenue This Month | Total revenue collected this month | $42,500 |

#### Recent Leads Table
Shows the 5 most recent leads with:
- Name and project type
- Estimated value
- Status badge (New / Contacted / Quoted)
- Time since creation
- Click any lead to open its detail page

#### Upcoming Schedule
Shows the next 3 calendar events:
- Consultations, meetings, site visits
- Date and time for each

### Quick Actions (top right)
- **+ New Lead** — creates a new lead
- **+ New Project** — creates a new project

### Sidebar Navigation

The sidebar has 13 items. Click any to navigate:

| Icon | Label | Goes To |
|---|---|---|
| Dashboard | Dashboard | `/admin/dashboard` |
| Users | Leads | `/admin/leads` |
| UserCheck | Clients | `/admin/clients` |
| FolderKanban | Projects | `/admin/projects` |
| FileText | Estimates | `/admin/estimates` |
| FileSignature | Contracts | `/admin/contracts` |
| Receipt | Invoices | `/admin/invoices` |
| Calendar | Scheduling | `/admin/scheduling` |
| HardHat | Staffing | `/admin/staffing` |
| FolderOpen | Documents | `/admin/documents` |
| BarChart3 | Reports | `/admin/reports` |
| Bot | AI Assistant | `/admin/ai` |
| Settings | Settings | `/admin/settings` |

The sidebar can be **collapsed** by clicking the chevron arrow at the top. In collapsed mode, only icons show. On mobile, the sidebar is a slide-out menu triggered by the hamburger icon.

---

## 4. Lead Management (CRM)

**URL:** `/admin/leads`

### Overview

The leads page manages your entire sales pipeline from first contact to won deal.

### Views

Toggle between two views using the icons in the toolbar:

#### Kanban View (default)
- 6 columns representing lead stages:
  1. **New** (blue) — fresh leads, just came in
  2. **Contacted** (amber) — you've reached out
  3. **Qualified** (purple) — confirmed as a real opportunity
  4. **Quoted** (indigo) — estimate/quote sent
  5. **Proposal Sent** (cyan) — formal proposal delivered
  6. **Won** (green) — deal closed!
- Each lead card shows: name, project type, estimated value, lead score, source, days old
- Click any card to open the lead detail page

#### List View
- Traditional table with columns: Name, Project, Value, Status, Score, Source
- Click any name to open the lead detail page

### How to Add a New Lead

1. Click the **+ New Lead** button (top right)
2. Fill in client name, email, phone, project type, estimated value, and source
3. Save — the lead appears in the "New" column of the Kanban board

### How to Search Leads

Use the search bar at the top to filter by name or project type. Results update in real time.

### Lead Detail Page

**URL:** `/admin/leads/[id]`

Each lead has 5 tabs:
1. **Overview** — contact info, project details, estimated value, source
2. **Activity** — timeline of all interactions
3. **Notes** — internal notes from your team
4. **Documents** — attached files (estimates, photos, etc.)
5. **AI Summary** — AI-generated summary of the lead

### Lead Scoring

Every lead gets an AI-generated score from 0-100:
- **80+** (green) — hot lead, high conversion probability
- **60-79** (amber) — warm lead, needs nurturing
- **Below 60** (red) — cold lead, low priority

---

## 5. Client Management

**URL:** `/admin/clients`

### Overview

The client directory stores all your customer information. Leads become clients when a project begins.

### Features

- **Client list** with search and filter
- Click any client to open their detail page

### Client Detail Page

**URL:** `/admin/clients/[id]`

7 tabs:
1. **Overview** — name, email, phone, address, status, total spent
2. **Properties** — addresses associated with this client
3. **Projects** — all projects for this client
4. **Invoices** — all invoices sent to this client
5. **Documents** — files shared with this client
6. **Notes** — internal notes
7. **Activity** — full activity timeline

---

## 6. Project Management

**URL:** `/admin/projects`

### Overview

Track every project from planning through completion with detailed phases, tasks, daily logs, and financials.

### Views

Toggle between:
- **Grid View** (default) — project cards with progress bars
- **List View** — table with columns: Project, Client, Status, Value, Progress, Dates

### Project Statuses

| Status | Color | Meaning |
|---|---|---|
| Planning | Purple | Not yet started, in preparation |
| In Progress | Blue | Active work happening |
| On Hold | Amber | Paused for some reason |
| Completed | Green | All work finished |

### How to Create a New Project

1. Click **+ New Project** (top right)
2. Fill in: project name, client, type, estimated value, start date, end date, project manager
3. Save — appears in the grid/list

### Project Detail Page

**URL:** `/admin/projects/[id]`

8 tabs:
1. **Overview** — summary, status, dates, value, assigned manager
2. **Phases** — ordered list of project phases (e.g., Demolition, Framing, Electrical, Finishing)
3. **Tasks** — task board with statuses: Backlog, To Do, In Progress, Done
4. **Daily Logs** — crew hours, weather, daily summary notes
5. **Photos** — project photo gallery (before/after, progress shots)
6. **Documents** — project-related files
7. **Financials** — budget vs. actual, expenses, change orders
8. **Activity** — full audit trail of project changes

### Managing Phases

1. Go to the **Phases** tab on a project
2. Click **+ Add Phase** to create a new phase
3. Set phase name, description, start/end dates
4. Phases are ordered — drag to reorder
5. Mark phases as complete as work progresses

### Daily Logs

1. Go to the **Daily Logs** tab
2. Click **+ New Log** for today's entry
3. Record: crew members on site, hours worked, weather conditions, work performed, any issues
4. Photos can be attached to daily logs

---

## 7. Estimates

**URL:** `/admin/estimates`

### Overview

Create detailed cost estimates for client projects. Estimates break down labor, materials, and markup.

### Estimate List

- Table showing: Number (EST-001), Client, Project, Amount, Status, Date
- Filter by status: All, Draft, Sent, Accepted, Declined
- Search by estimate number, client name, or project name

### Estimate Statuses

| Status | Color | Meaning |
|---|---|---|
| Draft | Gray | Still being prepared |
| Sent | Blue | Delivered to client |
| Accepted | Green | Client approved |
| Declined | Red | Client rejected |

### How to Create an Estimate

1. Click **+ New Estimate** (top right)
2. Select the client and project
3. Add line items with description, quantity, unit price
4. Group items into sections (e.g., "Demolition", "Materials", "Labor")
5. Set markup percentage
6. Save as Draft or Send directly to client

### Estimate Detail Page

**URL:** `/admin/estimates/[id]`

- Full line-item breakdown
- Section totals and grand total
- Send to client via email
- Convert to proposal or invoice
- AI can help generate estimates (see AI section)

---

## 8. Proposals

**URL:** `/admin/proposals`

### Overview

Proposals present your estimate in a professional, client-facing format with Good/Better/Best pricing tiers.

### How to Create a Proposal

1. Click **+ New Proposal** (top right)
2. Select client and project (or create from an existing estimate)
3. Configure three pricing tiers:
   - **Good** — base package, essential scope
   - **Better** — mid-range, recommended upgrades
   - **Best** — premium, everything included
4. Each tier shows: included items, price, timeline
5. Add cover letter and terms
6. Save or send to client

### Proposal Detail Page

**URL:** `/admin/proposals/[id]`

- Side-by-side comparison of Good / Better / Best tiers
- Client can approve their preferred tier
- AI can generate proposal content (see AI section)

---

## 9. Contracts

**URL:** `/admin/contracts`

### Overview

Manage construction contracts, service agreements, and subcontractor agreements.

### Contract Types

| Type | Use Case |
|---|---|
| Construction | New builds, major structural work |
| Remodel | Renovation projects |
| Service | Maintenance, handyman, smaller jobs |
| Subcontractor | Agreements with subs |

### Contract Statuses

| Status | Color | Meaning |
|---|---|---|
| Draft | Gray | Being prepared |
| Sent | Blue | Delivered to client for review |
| Signed | Amber | Client has signed |
| Executed | Green | Fully executed by both parties |

### How to Create a Contract

1. Click **+ New Contract** (top right)
2. Select a contract template (see [Settings > Contract Templates](#174-contract-templates))
3. Fill in client, project, and contract amount
4. Customize terms and clauses
5. Save as Draft or Send to client for signature

### Contract Detail Page

**URL:** `/admin/contracts/[id]`

- Full contract text with merge variables populated
- E-signature status (placeholder — requires DocuSign/HelloSign integration for production)
- Change order history
- Related documents

---

## 10. Invoicing & Payments

**URL:** `/admin/invoices`

### Overview

Create, send, and track invoices. Accept online payments via Stripe.

### Invoice Dashboard

Three summary cards at the top:
- **Total Paid** (green) — total collected
- **Outstanding** (blue) — total pending
- **Overdue** (red) — past due invoices

### Invoice Statuses

| Status | Color | Meaning |
|---|---|---|
| Draft | Gray | Not yet sent |
| Sent | Blue | Delivered to client |
| Viewed | Amber | Client has opened it |
| Paid | Green | Fully paid |
| Overdue | Red | Past due date |
| Partial | Purple | Partially paid |

### How to Create an Invoice

1. Click **+ New Invoice** (top right)
2. Select client and project
3. Add line items (description, quantity, unit price)
4. Set due date and payment terms
5. Save as Draft or Send to client
6. Client receives an email with a payment link

### How Clients Pay

1. Client receives invoice email with "Pay Now" link
2. Link opens Stripe Checkout (credit card, ACH, Apple Pay, Google Pay)
3. Payment is processed through your Stripe Connect account
4. Invoice status automatically updates to "Paid"
5. Confirmation email sent to both parties

### Filtering Invoices

- **Search** by invoice number, client name, or project name
- **Status filter** — click any status tab (All, Draft, Sent, Viewed, Paid, Overdue, Partial)
- **Date range filter** — click "Date Range" to set from/to dates

### Fee Breakdown

For every payment:
- **Platform fee** (2.9%) — deducted by Contractors OS
- **Stripe fee** (~2.9% + $0.30) — deducted by Stripe
- **You receive** — the remainder

Example: Client pays $1,000 → Platform fee $29, Stripe fee $29.30, **You receive $941.70**

---

## 11. Scheduling (Calendar)

**URL:** `/admin/scheduling`

### Overview

Visual calendar showing all appointments, site visits, inspections, and work days.

### Event Types

| Type | Color | Examples |
|---|---|---|
| Consultation | Blue | Client meetings, estimate walkthroughs |
| Site Visit | Amber | Property assessments, check-ins |
| Inspection | Red | Building inspections, code review |
| Work Day | Green | Scheduled crew work days |

### How to Use the Calendar

1. Navigate to `/admin/scheduling`
2. View events on a week-by-week basis
3. Use **< >** arrows to navigate between weeks
4. Click **+ New Event** to add an event
5. Each event shows: title, time, and type color

### Creating an Event

1. Click **+ New Event**
2. Set: title, date, time, event type, associated project, assigned crew/staff
3. Save — appears on the calendar

---

## 12. Staffing (Employees, Subs, Vendors)

**URL:** `/admin/staffing`

### Overview

The staffing hub manages your entire workforce — employees, subcontractors, vendors, and crews.

### Staffing Hub Dashboard

Shows quick stats:
- **Total Employees** — full-time/part-time staff count
- **Active Subcontractors** — subs currently working
- **Pending Timesheets** — timesheets awaiting approval

Four section cards link to sub-pages:
1. **Employees** → `/admin/staffing/employees`
2. **Subcontractors** → `/admin/staffing/subcontractors`
3. **Vendors** → `/admin/staffing/vendors`
4. **Crews** → `/admin/staffing/crews`

### Employees

**URL:** `/admin/staffing/employees`

- Directory of all employees
- Fields: name, role, phone, email, status (active/inactive), hire date
- Track certifications and skills

### Subcontractors

**URL:** `/admin/staffing/subcontractors`

- Directory of all subs
- Track: trade specialty, insurance status, W-9 on file, rating
- Associate subs with specific projects

### Vendors

**URL:** `/admin/staffing/vendors`

- Supplier directory
- Track: company name, contact, specialty, account number
- Link to purchase orders

### Pending Timesheets

At the bottom of the staffing hub, you'll see pending timesheets:
- Employee name, pay period, total hours
- Review and approve timesheets from here

### Note on Payroll

Contractors OS **does not process payroll directly**. The staffing module tracks:
- Employee records and contact info
- Hours worked (via timesheets and daily logs)
- Certifications and skills

**To run payroll**, export timesheet data and use a dedicated payroll provider:
- **QuickBooks Payroll** (syncs via the QuickBooks integration)
- **Gusto** — standalone payroll service
- **ADP** — enterprise payroll
- **Square Payroll** — simple contractor payroll

The recommended workflow:
1. Employees/subs log hours in Contractors OS (daily logs + timesheets)
2. Admin reviews and approves timesheets in the Staffing hub
3. Export approved hours to your payroll provider
4. If using the **QuickBooks integration**, timesheet data can sync automatically

---

## 13. Messaging (Unified Inbox)

**URL:** `/admin/messages`

### Overview

All client and team communication in one place. Supports in-app messages, email threads, and SMS.

### Layout

- **Left panel** — conversation list with search
- **Right panel** — active conversation thread

### Conversation List

Each conversation shows:
- Contact name and avatar/initials
- Last message preview
- Timestamp
- Unread badge (count)
- Channel icon (in-app, email, SMS)
- Role label (client vs. team)

### How to Send a Message

1. Click on a conversation in the left panel
2. Type your message in the input field at the bottom
3. Click the **Send** button (or press Enter)
4. Attach files using the paperclip icon

### Channel Types

| Channel | Icon | Description |
|---|---|---|
| In-App | MessageSquare | Messages within the platform |
| Email | Mail | Email threads (synced) |
| SMS | Phone | Text messages (via Twilio) |

### Searching Conversations

Use the search bar at the top of the conversation list to filter by contact name.

---

## 14. Document Vault

**URL:** `/admin/documents`

### Overview

Centralized file storage organized by folders. Store contracts, photos, permits, insurance docs, and more.

### Features

- Folder-based organization
- Upload files of any type
- Associate documents with projects, clients, or contracts
- Version tracking
- Share documents with clients (appears in their portal)

### How to Upload a Document

1. Navigate to a folder or the root
2. Click **+ Upload** or drag-and-drop files
3. Select the file from your device
4. Optionally tag the document (project, client, category)
5. Document appears in the vault

---

## 15. Reports & Analytics

**URL:** `/admin/reports`

### Overview

Four report tabs with visual dashboards:

### Tabs

#### Financial
- Monthly revenue chart (bar chart, 12 months)
- Key metrics: Total Revenue, Expenses, Net Profit, Profit Margin
- Revenue breakdown table by project

#### Projects
- Project status distribution
- Average project duration
- Completion rate
- Active vs. completed projects over time

#### Leads
- Lead funnel visualization (New → Contacted → Qualified → Quoted → Proposal Sent → Won)
- Conversion rates at each stage
- Lead sources breakdown (Website, Referral, Google, etc.)
- Average time to close

#### Custom
- Configurable reports
- Export to CSV/PDF using the **Download** button

### How to Use Reports

1. Navigate to `/admin/reports`
2. Click the tab for the report type you want
3. Review charts, tables, and metrics
4. Click **Export CSV** or **Download PDF** for external use

---

## 16. AI Assistant (Command Center)

**URL:** `/admin/ai`

### Overview

A built-in AI assistant that understands your projects, estimates, and contracts. Use it to generate scopes of work, draft estimates, review contracts, compose emails, and more.

### AI Chat

The main interface is a chat panel:
- **Left sidebar** — list of previous conversations
- **Right panel** — active chat thread
- Click **+** to start a new conversation

### How to Use AI Chat

1. Click **+** to start a new conversation (or continue an existing one)
2. Type your request in natural language
3. The AI responds with detailed, context-aware answers

### Example Prompts

| What You Want | What to Type |
|---|---|
| Generate a scope of work | "Generate a detailed scope of work for a 500 sqft composite deck with stairs and railing" |
| Estimate pricing | "What should I estimate for a 400 sqft composite deck with stairs and railing?" |
| Review a contract clause | "Review this change order clause and suggest improvements" |
| Draft a client email | "Draft a professional email to Sarah Mitchell about her kitchen remodel timeline" |
| Summarize a lead | "Summarize the Jennifer Torres lead and recommend next steps" |

### Quick Commands

At the bottom of the chat, you'll see quick command badges:
- `/scope` — generate a scope of work
- `/estimate` — create an estimate breakdown
- `/contract` — draft contract language
- `/email` — compose a client email
- `/summary` — summarize a project or lead

### Context Awareness

When chatting about a specific project, the AI shows a context bar at the top:
- "Project: Kitchen Renovation"
- This means the AI has access to that project's details, phases, and financials

### AI Generation History

**URL:** `/admin/ai/history`

- View all past AI generations
- Each entry shows: module used, prompt, result, model, token count, cost
- Expandable entries to see full input/output

### AI Model Routing

The platform routes AI requests to the best model for each task. This is configured in Settings (see [Section 17.9](#179-ai-routing--ab-tests)).

---

## 17. Settings — Complete Guide

**URL:** `/admin/settings`

The settings area has 9 sub-sections accessible from the settings page.

---

### 17.1 Service Catalog

**URL:** `/admin/settings/services`

Manage the services your business offers.

#### What You See

A table listing all services with columns:
- **Name** — service name (e.g., "Kitchen Remodeling")
- **Category** — Interior, Exterior, Construction, General
- **Base Price** — starting price for this service
- **Status** — Active (green dot) or Inactive (gray dot)
- **Featured** — gold star badge if featured on the website
- **Actions** — edit button (pencil icon)

#### How to Add a Service

1. Click **+ Add Service** (top right)
2. Fill in: name, slug, category, base price
3. Set active/inactive and featured status
4. Save — appears in the table and on the public website

#### How to Edit a Service

1. Click the pencil icon on any service row
2. Modify fields as needed
3. Save changes

#### Service Categories

Services are grouped by category:
- **Interior** — Kitchen, Bathroom, Basement
- **Exterior** — Deck, Roofing, Siding
- **Construction** — New Construction, Additions
- **General** — Handyman, misc services

---

### 17.2 Material Library

**URL:** `/admin/settings/materials`

Manage your materials database for accurate estimates.

#### Features

- Material name, unit of measure, cost per unit
- Category grouping
- Supplier information
- Link materials to estimate line items

---

### 17.3 Payment Settings (Stripe)

**URL:** `/admin/settings/payments`

This is where you connect and manage your Stripe payment processing.

#### Stripe Connect Setup

**If not connected:**
1. Navigate to `/admin/settings/payments`
2. Click **Connect Stripe Account**
3. You'll be redirected to Stripe's onboarding flow
4. Enter your business information (legal name, EIN, bank account)
5. Complete identity verification
6. Once approved, you'll see "Connected" status

**If already connected:**
- Shows your connected account name and ID
- Business type (e.g., "LLC — Home Improvement")
- Default currency (USD)
- Connection date

#### Payout Schedule

Shows how and when you receive funds:
- **Frequency** — Daily (Automatic)
- **Processing Time** — 2 Business Days
- **Payout Bank** — your linked bank account (last 4 digits shown)

#### Platform Fee

- Current rate: **2.9%**
- This is deducted from each payment before funds reach your account
- Set by the platform administrator (not editable by tenants)

**Fee breakdown example (for a $1,000 payment):**
| Line Item | Amount |
|---|---|
| Client pays | $1,000.00 |
| Platform fee (2.9%) | -$29.00 |
| Stripe fee (~2.9% + $0.30) | -$29.30 |
| **You receive** | **$941.70** |

#### Accepted Payment Methods

| Method | Default Status |
|---|---|
| Credit / Debit Cards | Enabled |
| ACH Bank Transfer | Enabled |
| Apple Pay / Google Pay | Enabled |
| Wire Transfer | Disabled |

#### Test Mode

A yellow banner indicates when payments are in **Test Mode** (no real charges). Switch to live mode in your Stripe dashboard when ready for production.

#### Disconnecting Stripe

1. Scroll to the bottom of the page
2. Click **Disconnect** in the red warning area
3. This will disable all payment processing — use with caution

---

### 17.4 Contract Templates

**URL:** `/admin/settings/contract-templates`

Pre-built contract templates that auto-fill with client and project data.

#### How to Create a Template

1. Click **+ New Template**
2. Give it a name (e.g., "Standard Remodel Agreement")
3. Write the contract body using merge variables
4. Available merge variables: `{{client.name}}`, `{{project.name}}`, `{{contract.amount}}`, `{{company.name}}`, etc.
5. Save the template

#### Using Templates

When creating a new contract (`/admin/contracts` → **+ New Contract**), select a template and it auto-fills with the client's data.

---

### 17.5 Message Templates (Email/SMS)

**URL:** `/admin/settings/templates`

Pre-built email and SMS templates for automated and manual communications.

#### Template Gallery

Templates are displayed as cards in a grid:
- Each card shows: name, channel (Email/SMS badge), body preview, trigger type (Automated/Manual), last modified date
- Click any card to open the template editor

#### Built-in Templates

| Template | Channel | Trigger | Purpose |
|---|---|---|---|
| Booking Confirmation | Email | Automated | Sent when client books |
| Estimate Ready | Email | Automated | Sent when estimate is complete |
| Invoice Sent | Email | Automated | Sent with every invoice |
| Payment Received | Email | Automated | Payment confirmation |
| Welcome Email | Email | Automated | New client onboarding |
| Project Update | SMS | Manual | Ad-hoc project status update |
| Review Request | SMS | Automated | Request a review after project completion |
| Appointment Reminder | SMS | Automated | Day-before appointment reminder |

#### How to Edit a Template

1. Click the template card
2. The editor opens showing:
   - **Channel** badge (Email or SMS)
   - **Trigger** badge (Automated or Manual)
   - **Subject** field (email only)
   - **Body** field (rich text with merge variables)
   - **Merge Variables** — clickable chips that insert `{{variable}}` into the body
   - **Preview** — live preview with merge variables highlighted
3. Modify the subject and body as needed
4. Click **Save Template**
5. Use **Test Send** to send a test to yourself

#### Merge Variables

Click any merge variable chip to insert it into your template body:
- `{{client.first_name}}` — client's first name
- `{{company.name}}` — your company name
- `{{company.phone}}` — your business phone
- `{{project.name}}` — project name
- `{{estimate.total}}` — estimate dollar amount
- `{{invoice.number}}` — invoice number
- `{{invoice.payment_link}}` — link for client to pay
- `{{appointment.date}}` — appointment date
- `{{appointment.time}}` — appointment time
- `{{portal.link}}` — link to client portal
- `{{review.link}}` — link to leave a review

---

### 17.6 Automations

**URL:** `/admin/settings/automations`

Set up trigger-action rules that run automatically.

#### Built-in Automation Rules

| Rule Name | Trigger | Action | Default |
|---|---|---|---|
| Welcome New Leads | New Lead Created | Send welcome email with company brochure | Enabled |
| Estimate Follow-up | Estimate Approved | Create project + notify team via SMS | Enabled |
| Overdue Invoice Reminder | Invoice Overdue 7 Days | Send payment reminder SMS | Enabled |
| Review Request | Project Marked Complete | Send review request email after 3 days | Enabled |
| Client Message Alert | New Message from Client | Notify assigned team member | Disabled |
| Hot Lead Assignment | Lead Score > 80 | Assign to sales manager + AI generate summary | Enabled |

#### How Automations Work

Each rule has:
- **Trigger** (left side) — the event that starts the automation
- **Arrow** — connects trigger to action
- **Action** (right side) — what happens when triggered
- **Toggle** — enable/disable the rule
- **Run Count** — how many times this rule has fired
- **Last Triggered** — when it last ran

#### How to Create an Automation

1. Click **+ Create Automation** (top right)
2. Select a trigger event (e.g., "New Lead Created", "Invoice Overdue")
3. Select an action (e.g., "Send email", "Send SMS", "Notify team", "AI generate")
4. Configure the details
5. Enable/disable with the toggle

#### Enabling/Disabling

Click the toggle icon on any rule to turn it on or off. Disabled rules appear dimmed.

---

### 17.7 Integrations

**URL:** `/admin/settings/integrations`

Connect third-party tools to your Contractors OS account.

#### Available Integrations

| Integration | What It Does | Status |
|---|---|---|
| **QuickBooks Online** | Sync invoices, expenses, and financial data | Configurable |
| **Google Calendar** | Sync appointments, deadlines, and schedules | Configurable |
| **Stripe** | Process payments, manage subscriptions | Configurable |
| **Zapier** | Connect to 5,000+ apps with automated workflows | Available |
| **Google Business Profile** | Manage reviews, posts, and business info | Available |
| **CompanyCam** | Capture, organize, and share project photos | Available |

#### How to Connect an Integration

1. Navigate to `/admin/settings/integrations`
2. Find the integration in the "Available" section
3. Click **Connect**
4. Follow the OAuth flow or enter API credentials
5. Once connected, it moves to the "Connected" section

#### Connected Integration Features

For each connected integration:
- **Last Sync** — when data was last synced
- **Sync Count** — total number of syncs performed
- **Settings** — configure sync options
- **View Logs** — see sync history and errors
- **Disconnect** — remove the connection

---

### 17.8 Webhooks

**URL:** `/admin/settings/webhooks`

Send real-time event notifications to external URLs.

#### How Webhooks Work

When events happen in Contractors OS (new lead, payment received, project completed), the system sends an HTTP POST to your configured URL with the event data.

#### Setting Up a Webhook

1. Click **+ Add Webhook**
2. Enter the destination URL
3. Select which events to subscribe to
4. Set any authentication headers
5. Save — the webhook is active

#### Delivery Log

View the history of webhook deliveries:
- Event type, timestamp, destination URL
- HTTP status code (200 = success, 4xx/5xx = failure)
- Response body
- Retry status

---

### 17.9 AI Routing & A/B Tests

**URL:** `/admin/settings/ai` and `/admin/settings/ai/ab-tests`

#### AI Model Routing

Configure which AI model handles each task module:

| Module | Purpose | Default Model |
|---|---|---|
| scope_generator | Generate scopes of work | claude-sonnet-4-6 |
| estimate_generator | Create cost estimates | claude-sonnet-4-6 |
| proposal_writer | Write proposals | claude-sonnet-4-6 |
| contract_drafter | Draft contracts | claude-sonnet-4-6 |
| email_composer | Compose emails | claude-sonnet-4-6 |
| lead_scorer | Score incoming leads | claude-sonnet-4-6 |
| chat | General AI chat | claude-sonnet-4-6 |

#### Routing Strategies

- **Fixed** — always use the specified model
- **A/B Test** — split traffic between two models and compare results

#### A/B Tests

**URL:** `/admin/settings/ai/ab-tests`

Set up experiments to compare AI models:
1. Create a test with two model variants
2. Set the traffic split (e.g., 50/50)
3. Run the test and collect results
4. Compare quality, speed, and cost
5. Pick the winner and set it as the default

---

## 18. Client Portal (Your Customers' View)

**URL:** `/portal/dashboard`

This is what your clients see when they log into their account.

### Portal Dashboard

Shows:
- **Active project** with progress bar and current phase
- **Outstanding invoices** with amounts and due dates
- **Unread messages** count
- **Recent activity** feed (new photos, phase updates, messages)

### Portal Pages

| Page | URL | What Clients Can Do |
|---|---|---|
| Dashboard | `/portal/dashboard` | See project overview, invoices, activity |
| Projects | `/portal/projects` | View project details, phases, progress |
| Project Detail | `/portal/projects/[id]` | See phases, documents, updates for a specific project |
| Messages | `/portal/messages` | Send/receive messages with your team |
| Payments | `/portal/payments` | View invoices, make payments, see payment history |
| Documents | `/portal/documents` | Access shared files (contracts, photos, permits) |

### What Clients Can See

- Project progress with visual progress bar
- Current phase and upcoming milestones
- Project photos
- Invoice details and payment links
- Shared documents
- Message history with your team

### What Clients Cannot See

- Other clients' data (RLS enforced)
- Your internal notes
- Cost breakdowns and margins
- Lead scores
- AI-generated content (unless shared)
- Other team members' data

---

## 19. Public Website (Marketing Site)

**URL:** `/` (root of any tenant domain)

The public-facing website that potential clients see. It's fully branded per tenant.

### Pages

| Page | URL | Content |
|---|---|---|
| Homepage | `/` | Hero image, services overview, how-it-works, social proof, CTA |
| Services | `/services` | Grid of all active services with descriptions and pricing |
| Service Detail | `/services/[slug]` | Individual service page with details |
| Portfolio | `/portfolio` | Project gallery with before/after photos |
| Project Detail | `/portfolio/[slug]` | Individual project showcase |
| About | `/about` | Team page, company story |
| Contact | `/contact` | Contact form + phone, email, address |
| Reviews | `/reviews` | Customer testimonials and ratings |
| FAQ | `/faq` | Frequently asked questions (accordion style) |
| Book | `/book` | 6-step booking flow (see next section) |

### Key Features

- **Tenant-branded** — colors, fonts, logo, and content all come from the tenant's configuration
- **Mobile-optimized** — responsive design, touch-friendly
- **SEO-ready** — metadata on every page
- **Fast** — server-rendered, optimized images

---

## 20. Booking Flow (How Clients Book)

**URL:** `/book`

A guided 6-step wizard for potential clients to request a project.

### The 6 Steps

#### Step 1: Project Type
- Client selects the type of project (Kitchen Remodel, Deck, Bathroom, etc.)
- Cards with icons for each service

#### Step 2: Details (Questions)
- Dynamic questions based on project type
- Example: "What is the approximate square footage?" or "What materials do you prefer?"

#### Step 3: Scope
- AI generates a preliminary scope based on answers
- Client can review and adjust

#### Step 4: Estimate
- AI generates a rough cost estimate
- Displayed as a range (e.g., "$25,000 - $35,000")

#### Step 5: Schedule
- Client selects preferred consultation date/time
- Calendar picker with available slots

#### Step 6: Account
- Client creates an account or logs in
- Provides: name, email, phone, address
- Submits the booking request

### What Happens After Booking

1. A new **lead** is created in your CRM with all the booking details
2. The **Welcome New Leads** automation fires (sends welcome email)
3. The lead appears on your admin dashboard under "Recent Leads"
4. AI scores the lead automatically
5. You can view the full booking details in the lead detail page

---

## 21. Platform Admin (Super Admin)

**URL:** `/platform/dashboard`

The platform-level admin panel for managing all tenants. Only accessible to platform administrators.

### Platform Dashboard

**URL:** `/platform/dashboard`

Global metrics across all tenants.

### Tenant Directory

**URL:** `/platform/tenants`

Table listing all tenants with:
- Name, slug, status, plan, creation date
- Search and filter
- Click to open tenant detail

### Tenant Detail

**URL:** `/platform/tenants/[id]`

5 tabs:
1. **Overview** — tenant summary
2. **Settings** — configure tenant options
3. **Branding** — colors, fonts, logo
4. **Domains** — manage custom domains
5. **Users** — manage tenant users

### Provisioning a New Tenant (Onboarding a New Contractor)

**URL:** `/platform/tenants/new`

A 6-step wizard to set up a new contractor on the platform:

#### Step 1: Business Profile
- Business name, slug (auto-generated from name)
- Phone, email
- Business type (general contractor, specialty, etc.)
- Service area description
- Tagline
- Address (line 1, city, state, zip)

#### Step 2: Branding
- Primary color (default: #1B2A4A)
- Secondary color (default: #2E75B6)
- Accent color (default: #D4A84B)
- Heading font (default: Outfit)
- Body font (default: Outfit)

#### Step 3: Domain
- Custom domain (e.g., `grandtraversehomeco.com`)
- Subdomain is auto-generated from slug (e.g., `grandtraverse.contractorsos.com`)

#### Step 4: Services
- Select which services this tenant offers
- Set base pricing for each

#### Step 5: Stripe Connect
- Connect the tenant's Stripe account
- Redirects to Stripe onboarding

#### Step 6: Review & Launch
- Review all entered information
- Click **Launch** to create the tenant
- Tenant is immediately active and accessible

### AI Configuration

**URL:** `/platform/ai-config`

- **Model Registry** — all available AI models (Claude, GPT-4, Gemini, etc.)
- **Routing Table** — which model handles which module for each tenant
- Global default settings

### Monitoring

**URL:** `/platform/monitoring`

Global monitoring dashboard:
- Active tenants count
- Total API calls
- Error rates
- Response times

### Feature Flags

**URL:** `/platform/feature-flags`

Toggle features on/off globally or per tenant:
- Enable/disable features for specific tenants
- Gradual rollout support
- Emergency kill switches

---

## 22. Deployment & Domain Setup

### Deploying to Vercel

1. **Fork/push** the repository to GitHub
2. **Go to** [vercel.com](https://vercel.com) → New Project
3. **Import** the repository
4. **Settings:**
   - Root Directory: `apps/web`
   - Framework Preset: Next.js
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
5. **Add environment variables** (see [Section 23](#23-environment-variables))
6. **Deploy**
7. Your app will be live at `https://your-project.vercel.app`

### Custom Domain Setup

#### For the platform domain:
1. In Vercel → Project Settings → Domains
2. Add `contractorsos.com` (or your platform domain)
3. Configure DNS: add the CNAME record Vercel provides

#### For tenant subdomains:
1. Add a wildcard domain `*.contractorsos.com` in Vercel
2. DNS: add a wildcard CNAME `*.contractorsos.com` → `cname.vercel-dns.com`
3. Now `grandtraverse.contractorsos.com` etc. all work automatically

#### For tenant custom domains:
1. Tenant adds their domain in settings (e.g., `grandtraversehomeco.com`)
2. They point their DNS to Vercel (`CNAME` → `cname.vercel-dns.com`)
3. Add the domain in Vercel project settings
4. The `tenant_domains` table stores the mapping
5. Middleware automatically resolves the tenant

### Local Development

```bash
# Install dependencies
pnpm install

# Start the Next.js dev server
pnpm dev

# Start local Supabase (optional, for database)
supabase start

# Serve edge functions locally (optional)
supabase functions serve
```

Access at `http://localhost:3000`

---

## 23. Environment Variables

These must be set in Vercel (and locally in `.env.local`) for the platform to work:

### Required

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGci...` |

### Payment Processing

| Variable | Description | Where to Get It |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe API secret key | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe Dashboard → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard → API Keys |

### AI Providers

| Variable | Description | Where to Get It |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API key | console.anthropic.com |
| `OPENAI_API_KEY` | OpenAI API key | platform.openai.com |

### Communication

| Variable | Description | Where to Get It |
|---|---|---|
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Twilio Console |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Twilio Console |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | Twilio Console |
| `SENDGRID_API_KEY` | SendGrid API key (for emails) | SendGrid Dashboard |

### Platform

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_PLATFORM_DOMAIN` | Platform base domain | `contractorsos.com` |

### Demo Mode

If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set, the platform runs in **demo mode**:
- All routes are accessible without authentication
- Mock data is displayed on all pages
- No database operations occur
- This lets you explore the full UI without any setup

---

## 24. FAQ & Troubleshooting

### Q: How do I access the admin panel?

Navigate to `/admin/dashboard` on your deployment URL. If not logged in, you'll be redirected to `/auth/login`.

### Q: I see "Demo Mode" — what does that mean?

Supabase environment variables are not configured. The app shows mock data and all routes are accessible. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to connect to a real database.

### Q: How do I set up payments?

1. Go to `/admin/settings/payments`
2. Click "Connect Stripe Account"
3. Complete Stripe's onboarding flow
4. Once connected, you can send invoices with payment links

### Q: How do I add a new contractor (tenant)?

1. Log in as platform admin
2. Go to `/platform/tenants/new`
3. Complete the 6-step provisioning wizard
4. The new tenant is immediately live

### Q: Can clients pay by check?

Yes, but you'd record it manually. Go to the invoice, mark it as paid, and note the payment method. Stripe handles online payments only.

### Q: How does the AI know about my projects?

The AI reads project data from your database. When you start a chat in the context of a project, it has access to that project's details, phases, estimates, and history. All AI calls go through the `ai/generate` edge function, which resolves the appropriate AI model for the task.

### Q: How do I process payroll?

Contractors OS tracks hours via timesheets and daily logs but does not process payroll directly. Export timesheet data to QuickBooks Payroll, Gusto, or your preferred payroll provider. The QuickBooks integration can sync this data automatically.

### Q: How do I brand the website for my business?

If you're a platform admin, go to `/platform/tenants/[id]` → Branding tab. Set your colors, fonts, and logo. The public website automatically uses your branding.

If you're a tenant admin, contact your platform administrator to update branding.

### Q: The sidebar is too narrow — can I expand it?

Click the chevron (>) icon at the top of the sidebar to toggle between collapsed (icons only) and expanded (icons + labels) modes.

### Q: Can I use the platform on mobile?

Yes. The entire platform is responsive:
- Public website is mobile-optimized (70%+ of traffic is mobile)
- Admin panel has a slide-out sidebar menu on mobile
- Client portal is fully mobile-friendly

### Q: How do I integrate with QuickBooks?

1. Go to `/admin/settings/integrations`
2. Find QuickBooks Online
3. Click **Connect**
4. Authorize access via OAuth
5. Invoice and expense data syncs automatically

### Q: What happens when a client submits a booking?

1. Client completes the 6-step booking flow at `/book`
2. A new lead is created in your CRM
3. The "Welcome New Leads" automation sends them a welcome email
4. The lead appears on your dashboard
5. AI automatically scores the lead
6. You can follow up through the leads page

---

*This guide covers the complete Contractors OS platform as of Phase 17. For developer documentation, see `CLAUDE.md`. For build phases, see `BUILD_PHASES.md`. For project state, see `OS_SINGLE_SOURCE_OF_TRUTH.md`.*
