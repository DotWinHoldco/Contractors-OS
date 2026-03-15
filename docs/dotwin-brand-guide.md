# .win Brand Guide

**Confidential — DotWin Internal**
Last updated: March 2026

---

## 1. Brand Foundation

DotWin (.win) is a founder-centric business accelerator and growth engine owned by Shelby and Skylar. The brand operates at the intersection of consulting, tools, community, and tangible growth systems — delivered as one ecosystem.

The visual identity reflects this: bold, precise, black-and-white at its core, with intentional color used only to signal which product or phase world you're in. Nothing decorative. Everything earned.

---

## 2. Logo

### The Mark

The logo is lowercase **`.win`** set in **Yeseva One**. The period before "win" is the distinctive brand element — it references the domain/digital world and creates instant visual recognition.

**Rules:**

- Always lowercase. Never ".Win" or ".WIN"
- Always Yeseva One. No substitutions
- The period is part of the logo, never removed
- Minimum clear space: the height of the period on all sides
- Never stretch, rotate, outline, or add effects

### Logo Variants

| File | Description | Use Case |
|------|-------------|----------|
| `win_black_logohorizontalnobg.png` | Horizontal, black text, transparent bg | Light backgrounds |
| `win_white_logohorizontalnobg.png` | Horizontal, white text, transparent bg | Dark backgrounds |
| `win_white_logohorizontalblackbg.png` | Horizontal, white text, black bg | Social, thumbnails, anywhere the bg can't be controlled |
| `dotwincircularlogoicon.png` | Circular icon mark | Avatars, favicons, app icons |
| `dotwincircularlogoiconwhite.png` | Circular icon mark (white variant) | Dark UI contexts |
| `dotwin_circle_more_padding.png` | Circular icon with extra padding | Smaller placements where breathing room is needed |
| `dotwincirclemost_padding.png` | Circular icon with maximum padding | Smallest placements (16px–32px) |
| `dotwinreports.png` | .win Reports logo (white on black) | Report headers, data/analytics contexts |

### Logo Don'ts

- Don't add drop shadows or glows to the logo itself
- Don't place the logo on busy or patterned backgrounds without a solid container
- Don't use any font other than Yeseva One for the wordmark
- Don't change the color of the logo to anything other than black or white
- Don't rearrange the period or add extra punctuation

---

## 3. Color System

### Core Palette

The foundation of every DotWin asset is black and white. Period. Color is never decorative — it's semantic. Each highlight color maps to a specific product or business phase.

| Color | Hex | Role |
|-------|-----|------|
| Black | `#000000` | Primary background, text on light sections |
| White | `#FFFFFF` | Primary text on dark sections, light section bg |
| Off-White | `#F8F8F8` | Alternate light section background |

### Product Highlight Colors

Each product inherits the full DotWin design system. The only variable is the highlight color, which cascades through every accent, button, hover state, border, badge, and glow.

| Product | Phase | Highlight Color | Hex | CSS Variable |
|---------|-------|-----------------|-----|-------------|
| Partner Readiness Guide (PRG) | Growth | Yellow / Gold | `#FFE134` | `--yellow` or `--hl` |
| Entrepreneur's Flame | First Client | Orange | `#FF6B2B` | `--hl` (flame context) |
| Affiliate Program | Scale | Neon Pink | `#FF2D78` | `--hl` (affiliate context) |
| Platform Builder | Infrastructure | White (Pure B&W) | `#FFFFFF` | `--hl` (builder context) |

**The rule:** Black and white is always the foundation. The highlight color tells you which product world you're in. Any DotWin asset is immediately recognizable as DotWin regardless of which product color it carries.

### Grayscale System

Used across all products for borders, subdued text, disabled states, and structural hierarchy.

| Token | Hex | Usage |
|-------|-----|-------|
| `--g1` | `#111111` | Deep section backgrounds (`.sec.deep`) |
| `--g2` | `#1A1A1A` | Input backgrounds, elevated dark surfaces |
| `--g3` | `#222222` | Disabled button backgrounds |
| `--g4` | `#333333` | Subtle borders on dark |
| `--g5` | `#555555` | Section tags on light, subdued labels |
| `--g6` | `#888888` | Placeholder text, secondary info |
| `--g7` | `#BBBBBB` | Light borders, strikethrough text |
| `--g8` | `#DDDDDD` | Lightest borders, dividers on light bg |

### Status / Functional Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Red | `#D62828` | Errors, "awaiting" status, urgency |
| Green | `#16A34A` | Success, "partner" status, confirmations |

---

## 4. Typography

All Google Fonts. Load via:

```
https://fonts.googleapis.com/css2?family=Yeseva+One&family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Dancing+Script:wght@400;500;600;700&display=swap
```

### Font Stack

| Font | Role | Weights Used | CSS |
|------|------|-------------|-----|
| **Yeseva One** | Logo only | 400 | `font-family: 'Yeseva One', serif` |
| **Playfair Display** | Headlines, section titles | 400, 600, 700, 800 (+ italic 400) | `font-family: 'Playfair Display', serif` |
| **Outfit** | Body text, UI, buttons, labels, inputs | 300–900 | `font-family: 'Outfit', sans-serif` |
| **Dancing Script** | Signatures only | 400–700 | `font-family: 'Dancing Script', cursive` |

### Type Scale

**Headlines (Playfair Display):**

- Page title / cover: `clamp(30px, 5.5vw, 44px)` — weight 800, line-height 1.18
- Section heading: `clamp(28px, 5vw, 42px)` — weight 800, line-height 1.18
- Card heading: `19px–22px` — weight 800

**Body (Outfit):**

- Standard paragraph: `17–17.5px` — weight 400, line-height 1.85
- Subdued paragraph: `15–16px` — weight 400, color at 55% opacity
- Small text / notes: `13–14px` — weight 400–500

**Labels & Tags (Outfit):**

- Section tag: `11–12px` — weight 900, letter-spacing 3–4px, uppercase
- Button text: `14–15px` — weight 800, letter-spacing 1–2px, uppercase
- Badge text: `10–11px` — weight 900, letter-spacing 2–3px, uppercase

**Signatures (Dancing Script):**

- Signature preview: `clamp(32px, 6vw, 48px)` — weight 500
- Used exclusively in the agreement signing flow

### Typography Rules

- Yeseva One is reserved for the `.win` logo mark only. Never use it for headings or body text
- Playfair Display is for headlines and major section titles only. Never for body copy
- Outfit handles everything else: paragraphs, buttons, labels, navigation, inputs, small text
- Dancing Script appears only in signature contexts. Never for decorative headlines
- Anti-aliasing is always on: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`

---

## 5. Layout & Section System

### Section Backgrounds

Pages alternate between three background states to create rhythm and prevent visual monotony. The pattern is: dark → light → off-white → dark (or variations).

| Class | Background | Text Color | Use |
|-------|-----------|------------|-----|
| `.sec.dark` | `#000000` | White | Primary, most sections |
| `.sec.light` | `#FFFFFF` | Black | Contrast breaks, featured content |
| `.sec.off` | `#F8F8F8` | Black | Softer contrast break |
| `.sec.deep` | `#111111` | White | Elevated dark, subtle distinction from pure black |

### Content Width

- `.wrap` — `max-width: 820px`, centered, `padding: 0 28px`
- Narrower editorial width: `max-width: 780px`
- Section padding: `110px 0` (desktop), scales down on mobile

### Responsive Breakpoints

| Breakpoint | Target |
|-----------|--------|
| `960px` | Tablet / small desktop — grid collapse, font scale adjustments |
| `768px` | Tablet portrait — modal, status bar, layout adaptations |
| `600px` | Mobile — single column, full-width buttons, reduced padding |

### Mobile-Specific Rules

- Full-width buttons on mobile (no side padding on CTAs)
- `-webkit-text-size-adjust: 100%` on iOS
- Minimum `16px` font size on form inputs (prevents iOS zoom)
- Touch targets minimum `44px` height

---

## 6. Components

### Section Tag

The section tag is the thin uppercase label that introduces each section, always with a trailing rule line.

```css
.sec-tag {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.sec-tag::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: .35;
}
```

On dark sections: `color: rgba(255,255,255,.3)`. On light sections: `color: var(--g5)`.

### Highlight Span (`.yhl`)

Inline text highlight using the active product color. Used for emphasis within paragraphs.

```css
.yhl {
  background: var(--yellow); /* or var(--hl) */
  padding: 2px 7px;
  color: var(--black);
  -webkit-text-fill-color: var(--black);
  font-weight: 700;
  display: inline;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
```

### Buttons

**Primary (highlight color):**

```css
.btn-primary {
  background: var(--hl);
  color: var(--black);
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 18px 44px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  transition: all .35s cubic-bezier(.34, 1.56, .64, 1);
}
.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(var(--hl-rgb), .25);
}
```

**Secondary (ghost):**

```css
.btn-secondary {
  background: rgba(255,255,255,.06);
  color: var(--white);
  border: 1px solid rgba(255,255,255,.1);
  /* same font/size/padding as primary */
}
.btn-secondary:hover {
  background: rgba(255,255,255,.1);
}
```

**Disabled state:** `background: var(--g3); color: var(--g5); cursor: not-allowed; no transform/shadow.`

### Callout Block

Used for key takeaways, pull quotes, and instructional emphasis.

```css
.callout {
  background: rgba(var(--hl-rgb), .03);
  border-left: 3px solid var(--hl);
  padding: 22px 26px;
  margin: 28px 0;
  border-radius: 0 14px 14px 0;
}
```

### Cards

**Dark card** (on dark sections): `background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); border-radius: 16px; padding: 28px;` — hover: border transitions to highlight color with subtle lift.

**Light card** (on light/off-white sections): `background: #fff; border: 2px solid #000; border-radius: 16px; padding: 28px; box-shadow: 6px 6px 0 #000;` — hover: shadow intensifies.

### Stat Strip

Horizontal row of key metrics. Numbers in highlight color, labels in subdued text.

```css
.stat-num {
  font-size: clamp(28px, 5vw, 36px);
  font-weight: 900;
  color: var(--hl);
}
.stat-lbl {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,.3);
}
```

### Badge

Small uppercase label, often used on cards or playbook blocks.

```css
.badge {
  display: inline-block;
  padding: 6px 14px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  background: var(--hl);
  color: var(--black);
  border-radius: 100px;
}
```

---

## 7. Motion & Animation

### Easing Curves

| Name | Value | Use |
|------|-------|-----|
| Expo (primary) | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll reveals, section transitions, smooth entries |
| Spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Buttons, hover lifts, interactive elements, checkboxes |

### Scroll Reveals

Elements enter the viewport with opacity and transform transitions.

```css
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity .9s var(--ease-expo), transform .9s var(--ease-expo);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Variants: `.from-left` (translateX -70px), `.from-right` (translateX 70px), `.from-scale` (scale 0.9).

Stagger delays: `.s1` through `.s8` (0.1s increments).

### Scroll Progress Bar

Fixed to top of page, 3px height, highlight color fill. Width tracks scroll percentage.

### Noise Texture Overlay

Subtle grain applied globally via `body::after`. Fixed position, pointer-events none, z-index 9999, opacity 0.02. Uses an inline SVG `feTurbulence` filter at base frequency 0.85.

### Radial Glow

Used on cover sections and key areas for atmospheric depth.

```css
background: radial-gradient(
  ellipse at 50% 30%,
  rgba(var(--hl-rgb), .06) 0%,
  transparent 55%
);
```

### Pulse Line

Vertical animated line on the left edge of long-scroll pages (PRG). Yellow pulse travels up and down. Appears after initial scroll.

---

## 8. Patterns & Textures

### Dark Section Patterns

- Noise overlay (always on, opacity 0.02)
- Radial glow behind cover headlines
- Subtle border separators: `1px solid rgba(255,255,255,.06)`

### Light Section Patterns

- Clean, no noise overlay
- Borders use: `1px solid rgba(0,0,0,.06)` or `2px solid #000` for cards
- Tags and labels at `color: var(--g5)`

---

## 9. CSS Variables Reference

The full set of CSS custom properties used across all DotWin properties:

```css
:root {
  /* Core */
  --black: #000;
  --white: #fff;
  --off-white: #f8f8f8;

  /* Product Highlights */
  --yellow: #ffe134;        /* PRG */
  --flame-orange: #ff6b2b;  /* Entrepreneur's Flame */
  --affiliate-pink: #ff2d78;/* Affiliates */
  /* Platform Builder uses --white as highlight */

  /* Active highlight (swap per product) */
  --hl: #ffe134;
  --hl-rgb: 255, 225, 52;

  /* Status */
  --red: #d62828;

  /* Grayscale */
  --g1: #111;
  --g2: #1a1a1a;
  --g3: #222;
  --g4: #333;
  --g5: #555;
  --g6: #888;
  --g7: #bbb;
  --g8: #ddd;

  /* Easing */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

To switch product themes, override `--hl` and `--hl-rgb`:

```css
[data-theme="flame"]     { --hl: #ff6b2b; --hl-rgb: 255, 107, 43; }
[data-theme="affiliate"] { --hl: #ff2d78; --hl-rgb: 255, 45, 120; }
[data-theme="builder"]   { --hl: #ffffff; --hl-rgb: 255, 255, 255; }
```

---

## 10. Brand Voice

### Tone

Bold, direct, founder-to-founder. DotWin speaks as operators who build, not consultants who advise from the sidelines. Confidence without arrogance. Results, systems, and removing excuses.

### Do

- Write like you're talking to a founder across the table
- Use short, punchy sentences when making a point
- Lead with outcomes and specifics
- Use "we build" not "we help you build"
- Scannability over density — stat cards, callout blocks, structured sections

### Don't

- Use filler phrases ("passionate about empowering entrepreneurs")
- Use em dashes excessively
- Write anything that reads as machine-generated or generic consulting language
- Use desperate or salesy phrasing — even follow-ups and access-denied pages should feel exclusive and intentional
- Write walls of text without visual structure

### Copy Hierarchy

1. **Headline:** Playfair Display, bold, short (under 10 words ideal)
2. **Subhead / tagline:** Outfit, lighter weight, provides context
3. **Body:** Outfit 400, natural reading rhythm, 17px
4. **CTA:** Outfit 800, uppercase, action-oriented ("Become a Partner Now" not "Learn More")

---

## 11. Platform-Specific Notes

### Simvoly (businesses.win)

- ID-scope all CSS wrappers (`#win-home-root`, `#win-portfolio-root`, etc.) with high-specificity selectors
- Use `!important` on all button properties and color overrides — Simvoly's dark theme fights every style
- Never host images on Simvoly (compresses to thumbnails). Use external CDN URLs (Imgur `i.imgur.com` direct links, Wix CDN for portfolio images)
- Inline styles as backup for critical properties
- 16px minimum on form inputs to prevent iOS zoom

### SuiteDash Portal (portal.businesses.win)

- Custom fields referenced by UUID
- Status-aware UI components (awaiting → signed → partner)
- Dancing Script only appears in the signature flow

### Cloudflare Worker (api.ceos.win)

- API proxy layer — all credentials stay server-side
- Deploy worker updates before pushing dependent frontend files

---

## 12. File & Asset Management

### Image Hosting

Never use Simvoly's native image hosting. Always use external CDN URLs:

- **Imgur:** `i.imgur.com` direct URLs for general assets
- **Wix CDN:** Portfolio mockup images displayed in scrollable 420px containers

### Logo Files

All logo variants are maintained in the project repository. See Section 2 for the complete variant table and use cases.

---

*This is a living document. As new products, phases, or brand elements are introduced, they should be added here with the same level of specificity.*

**.win**
