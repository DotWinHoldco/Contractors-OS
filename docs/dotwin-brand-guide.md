# .win — Brand Guide

> **This is the master brand guide for the .win platform (Contractors OS).**
> All platform UI, marketing pages, admin dashboards, portals, and tenant templates
> must follow these guidelines. Tenant-specific branding (colors, fonts, logos)
> overrides ONLY the tenant-facing public site and client portal — never the
> platform admin or core .win identity.

---

## BRAND IDENTITY

| Field | Value |
|---|---|
| **Brand Name** | .win |
| **Legal Name** | Contractors OS |
| **Tagline** | The Operating System for Contractors |
| **Voice** | Confident, direct, premium. No fluff. Say less, mean more. |
| **Personality** | The sharpest tool in the shed. Professional authority meets modern tech. |

---

## LOGO SYSTEM

All logo files live in `/public/logos/` in the repository.

### Logo Variants

| File | Use Case | Dimensions | Background |
|---|---|---|---|
| `win_black_logo-horizontal-nobg.png` | Primary horizontal logo — light backgrounds | 1080×422 | Transparent |
| `win_white_logo-horizontal-blackbg.png` | Primary horizontal logo — dark backgrounds | 1080×422 | Black |
| `win_black_logo-square-white_bg.png` | Square logo — light contexts (favicon source, app icon) | 1080×1080 | White |
| `win_white_square_black_bg.png` | Square logo — dark contexts | 1080×1080 | Black |
| `win-black-circle-white-letters.png` | Circular badge — dark badge, white text | 1080×1080 | Transparent |
| `win_white_circle_black_letters.png` | Circular badge — white badge, black text | 1080×1080 | Transparent |
| `dot-win_circle_more_padding.png` | Circular icon with padding — profile pictures, small contexts | 1240×1240 | Varies |
| `dot-win-circle-most_padding.png` | Circular icon with max padding — smallest contexts | 1500×1500 | Varies |
| `dot-win-circular-logo-icon.psd` | Source file (Photoshop) — DO NOT use in production | N/A | N/A |

### Logo Usage Rules

1. **Horizontal logo** is the primary mark. Use it in headers, marketing, and anywhere the brand name needs to read clearly.
2. **Circular badge** is for compact contexts: favicons, app icons, social avatars, loading screens.
3. **Minimum clear space:** The dot (period) in `.win` is a distinctive brand element. Never crop it. Maintain at least the width of the dot as clear space around the logo on all sides.
4. **Never alter the logo.** No rotation, no color changes, no effects, no stretching.
5. **Dark on light, light on dark.** Always use the appropriate variant for the background.

### Logo Selection Logic (for code)

```
IF background is light (white, off-white, light gray):
  → Use black logo variant
IF background is dark (black, navy, dark gray):
  → Use white logo variant
IF context is circular/small (favicon, avatar, badge):
  → Use circular badge variant
IF context is wide/header:
  → Use horizontal variant
```

---

## TYPOGRAPHY

### Platform Typography (.win brand)

| Role | Font | Weight | Usage |
|---|---|---|---|
| **Display / Hero** | Yeseva One | 400 (Regular) | Brand name "Contractors", large hero text, section titles on marketing pages |
| **Headings** | Outfit | 600 (SemiBold) | H1-H3, navigation, buttons, labels, "OS" in the brand name |
| **Body** | Outfit | 400 (Regular) | Paragraph text, descriptions, form labels |
| **Body Emphasis** | Outfit | 500 (Medium) | Bold body text, table headers, highlighted content |
| **Mono / Code** | JetBrains Mono | 400 | Code blocks, invoice numbers, technical IDs |

### Brand Name Typography

The brand "Contractors OS" uses a split typography treatment:
- **"Contractor"** → Yeseva One (serif, elegant, authoritative)
- **"OS"** → Outfit (sans-serif, modern, technical)

This pairing communicates: *old-school craftsmanship meets modern technology.*

### Font Loading

```typescript
// app/layout.tsx
import { Outfit } from "next/font/google";
import localFont from "next/font/local";

// Yeseva One from Google Fonts
const yeseva = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Outfit for headings and body
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
```

### Tailwind Configuration

```javascript
// tailwind.config.ts
fontFamily: {
  display: ["var(--font-display)", "Georgia", "serif"],
  body: ["var(--font-body)", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "monospace"],
},
```

### Type Scale

| Element | Size | Weight | Font | Letter Spacing |
|---|---|---|---|---|
| Hero headline | 64px / 4rem | 400 | Yeseva One | -0.02em |
| H1 | 40px / 2.5rem | 600 | Outfit | -0.02em |
| H2 | 32px / 2rem | 600 | Outfit | -0.01em |
| H3 | 24px / 1.5rem | 600 | Outfit | 0 |
| H4 | 20px / 1.25rem | 500 | Outfit | 0 |
| Body | 16px / 1rem | 400 | Outfit | 0 |
| Body Large | 18px / 1.125rem | 400 | Outfit | 0 |
| Small | 14px / 0.875rem | 400 | Outfit | 0.01em |
| Caption | 12px / 0.75rem | 500 | Outfit | 0.02em |
| Button | 14px / 0.875rem | 600 | Outfit | 0.02em |

---

## COLOR SYSTEM

### Core Palette

| Name | Hex | RGB | Usage |
|---|---|---|---|
| **Black** | `#000000` | 0, 0, 0 | Primary brand color, text, dark backgrounds |
| **White** | `#FFFFFF` | 255, 255, 255 | Backgrounds, text on dark, cards |
| **Off-White** | `#FAFAFA` | 250, 250, 250 | Page backgrounds, subtle surfaces |
| **Warm Gray 50** | `#F9F7F5` | 249, 247, 245 | Warm background alternative |
| **Warm Gray 100** | `#F0EDEA` | 240, 237, 234 | Card backgrounds, borders |
| **Warm Gray 200** | `#E0DBD5` | 224, 219, 213 | Dividers, disabled states |
| **Warm Gray 400** | `#A39E97` | 163, 158, 151 | Secondary text, placeholders |
| **Warm Gray 600** | `#6B6560` | 107, 101, 96 | Body text secondary |
| **Warm Gray 800** | `#3D3834` | 61, 56, 52 | Body text primary |
| **Charcoal** | `#1A1A1A` | 26, 26, 26 | Near-black for UI elements |

### Functional Colors

| Name | Hex | Usage |
|---|---|---|
| **Success** | `#2D6A4F` | Confirmations, completed states, positive indicators |
| **Warning** | `#CC8A00` | Warnings, pending states, attention needed |
| **Error** | `#C1292E` | Errors, destructive actions, overdue |
| **Info** | `#1B4965` | Informational, links, active states |
| **Accent** | `#D4A84B` | Gold accent — premium feel, CTAs on dark backgrounds |

### CSS Variables

```css
:root {
  /* Core */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-off-white: #FAFAFA;
  --color-charcoal: #1A1A1A;

  /* Warm Grays */
  --color-gray-50: #F9F7F5;
  --color-gray-100: #F0EDEA;
  --color-gray-200: #E0DBD5;
  --color-gray-400: #A39E97;
  --color-gray-600: #6B6560;
  --color-gray-800: #3D3834;

  /* Functional */
  --color-success: #2D6A4F;
  --color-warning: #CC8A00;
  --color-error: #C1292E;
  --color-info: #1B4965;
  --color-accent: #D4A84B;

  /* Semantic (maps to functional) */
  --color-bg: var(--color-off-white);
  --color-surface: var(--color-white);
  --color-text: var(--color-charcoal);
  --color-text-secondary: var(--color-gray-600);
  --color-text-muted: var(--color-gray-400);
  --color-border: var(--color-gray-200);
  --color-border-subtle: var(--color-gray-100);
  --color-primary: var(--color-black);
  --color-primary-foreground: var(--color-white);
}
```

### Dark Mode

```css
.dark {
  --color-bg: #0A0A0A;
  --color-surface: var(--color-charcoal);
  --color-text: #E8E5E1;
  --color-text-secondary: var(--color-gray-400);
  --color-text-muted: var(--color-gray-600);
  --color-border: #2A2725;
  --color-border-subtle: #1F1D1B;
  --color-primary: var(--color-white);
  --color-primary-foreground: var(--color-black);
}
```

---

## DESIGN PRINCIPLES

### 1. Black & White First
The .win brand lives in black and white. Color is used sparingly and intentionally — only for functional meaning (success, error, warning) or the gold accent on premium moments.

### 2. Generous Space
Let content breathe. Large margins, generous padding, ample line height. Density is for the admin dashboard — the marketing site and portal should feel open and confident.

### 3. Sharp Contrast
High contrast between text and background. Bold typographic hierarchy. No ambiguity about what's important on the page.

### 4. Minimal Decoration
No gradients. No drop shadows on cards (use border or subtle elevation only). No rounded corners larger than 8px. Clean lines. The logo's serif elegance sets the tone — everything else stays out of the way.

### 5. Authority Through Restraint
The fewer elements on a page, the more each one matters. Every pixel earns its place.

---

## UI COMPONENT GUIDELINES

### Buttons

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | Black | White | None | Main CTA: "Book Now", "Send", "Save" |
| Secondary | White | Black | 1px Black | Secondary actions |
| Ghost | Transparent | Black | None | Tertiary actions, nav links |
| Danger | `#C1292E` | White | None | Delete, cancel, destructive |
| Accent | `#D4A84B` | Black | None | Premium CTAs on dark backgrounds |

```
Border radius: 6px (all buttons)
Padding: 12px 24px (default), 8px 16px (small), 16px 32px (large)
Font: Outfit 600, 14px, letter-spacing 0.02em, uppercase
Transition: all 150ms ease
Hover: opacity 0.85
```

### Cards

```
Background: var(--color-surface)
Border: 1px solid var(--color-border-subtle)
Border radius: 8px
Padding: 24px
Hover (if interactive): border-color var(--color-border)
No box-shadow. Elevation through border only.
```

### Forms

```
Input background: var(--color-white)
Input border: 1px solid var(--color-border)
Input border-radius: 6px
Input padding: 12px 16px
Input font: Outfit 400, 16px
Focus: border-color var(--color-black), ring 2px var(--color-black) / 10%
Label: Outfit 500, 14px, color var(--color-gray-800), margin-bottom 6px
```

### Tables (Admin Dashboard)

```
Header: background var(--color-gray-50), font Outfit 500, 12px, uppercase, letter-spacing 0.05em
Row: border-bottom 1px solid var(--color-border-subtle)
Row hover: background var(--color-gray-50)
Cell padding: 12px 16px
```

### Sidebar (Admin)

```
Background: var(--color-black)
Text: var(--color-white)
Active item: background rgba(255,255,255,0.1), text white, left border 2px white
Hover: background rgba(255,255,255,0.05)
Logo: white horizontal variant, top of sidebar
Width: 260px (expanded), 64px (collapsed)
```

---

## TENANT BRANDING SYSTEM

When a tenant (e.g., Grand Traverse Home Co.) is active, their branding overrides ONLY the following:

### What Tenants Can Override

| Property | Source | Affects |
|---|---|---|
| Logo | `tenant_themes.logo_url` | Marketing site header, portal header, invoices |
| Logo (dark) | `tenant_themes.logo_dark_url` | Footer on dark backgrounds |
| Favicon | `tenant_themes.favicon_url` | Browser tab |
| Primary Color | `tenant_themes.color_primary` | CTAs, links, active states on tenant pages |
| Secondary Color | `tenant_themes.color_secondary` | Accent elements |
| Accent Color | `tenant_themes.color_accent` | Highlights |
| Heading Font | `tenant_themes.font_heading` | H1-H4 on tenant pages |
| Body Font | `tenant_themes.font_body` | Body text on tenant pages |

### What Tenants CANNOT Override

- The .win logo or branding in the admin dashboard
- The platform admin UI
- The core color system (gray scale, functional colors)
- The admin sidebar design
- "Powered by .win" footer badge on all tenant sites

### Tenant CSS Variable Injection

```typescript
// When tenant is resolved, inject their colors as CSS variables
const tenantVars = {
  "--tenant-primary": tenant.theme.color_primary,
  "--tenant-secondary": tenant.theme.color_secondary,
  "--tenant-accent": tenant.theme.color_accent,
};

// In tenant-facing pages, primary maps to tenant color
// --color-primary: var(--tenant-primary, var(--color-black));
```

---

## PAGE LAYOUT PATTERNS

### Marketing Site (Public)

```
┌─────────────────────────────────────────────────────┐
│  [Logo]          Services  Portfolio  About    [CTA] │  ← Sticky header
├─────────────────────────────────────────────────────┤
│                                                      │
│                    HERO SECTION                       │  ← Full width, large type
│               Yeseva One headline                    │
│            Outfit subheadline + CTA                  │
│                                                      │
├─────────────────────────────────────────────────────┤
│                   CONTENT SECTIONS                   │  ← Max-width 1200px, centered
│                                                      │
├─────────────────────────────────────────────────────┤
│  [Logo]   Links    Links    Contact    [Social]     │  ← Footer
│                  Powered by .win                     │
└─────────────────────────────────────────────────────┘
```

### Admin Dashboard

```
┌────────┬────────────────────────────────────────────┐
│        │  Search                    🔔  [Avatar]    │
│  .win  ├────────────────────────────────────────────┤
│  logo  │                                            │
│        │    MAIN CONTENT AREA                       │
│  Nav   │    Cards, Tables, Forms                    │
│  items │                                            │
│        │                                            │
│        │                                            │
│        │                                            │
└────────┴────────────────────────────────────────────┘
```

### Client Portal

```
┌─────────────────────────────────────────────────────┐
│  [Tenant Logo]       Dashboard  Projects  Pay   [U] │
├─────────────────────────────────────────────────────┤
│                                                      │
│    CLEAN, SIMPLE CONTENT                             │
│    Optimized for mobile                              │
│    Large touch targets                               │
│                                                      │
├─────────────────────────────────────────────────────┤
│                  Powered by .win                     │
└─────────────────────────────────────────────────────┘
```

---

## IMAGE GUIDELINES

- **Marketing hero images:** Full-bleed, high contrast, desaturated slightly to let text stand out. Overlay with semi-transparent black gradient if text overlays image.
- **Portfolio photos:** Sharp, well-lit, professional. Before/after pairs aligned. No filters.
- **Icons:** Lucide icon set. Stroke width 1.5px. Color: `var(--color-text)` or white on dark.
- **Illustrations:** None. The brand is photographic and typographic. No cartoons, no illustrations, no clip art.

---

## ANIMATION GUIDELINES

- **Page transitions:** Subtle fade (150ms ease)
- **Scroll reveals:** Fade up, 20px translate, staggered 50ms per element
- **Hover states:** 150ms ease transition on opacity, background, border
- **Loading states:** Skeleton screens with subtle pulse animation in `var(--color-gray-100)`
- **No bouncing, no spring physics, no playful animations.** The brand is composed and professional.

---

## "POWERED BY .WIN" BADGE

Every tenant site displays a "Powered by .win" badge in the footer:

```html
<a href="https://contractorsos.com" class="powered-by">
  Powered by <img src="/logos/win_black_logo-horizontal-nobg.png" alt=".win" height="16" />
</a>
```

Style: Outfit 400, 12px, `var(--color-gray-400)`. Logo height: 16px. Centered in footer. Subtle but always present.

---

## FILE NAMING CONVENTION FOR BRAND ASSETS

```
public/logos/
├── win_black_logo-horizontal-nobg.png        # Primary horizontal (light bg)
├── win_white_logo-horizontal-blackbg.png     # Primary horizontal (dark bg)
├── win_black_logo-square-white_bg.png        # Square (light bg)
├── win_white_square_black_bg.png             # Square (dark bg)
├── win-black-circle-white-letters.png        # Circle badge (dark)
├── win_white_circle_black_letters.png        # Circle badge (light)
├── dot-win_circle_more_padding.png           # Circle icon (medium padding)
├── dot-win-circle-most_padding.png           # Circle icon (max padding)
└── dot-win-circular-logo-icon.psd            # Source file (not served)
```
