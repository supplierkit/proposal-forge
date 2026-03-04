# SupplierKit Design System Reference

> Extracted from supplierkit.com. Use this document as the authoritative visual reference when building any interface for the business.

---

## 1. Design Principles

- **70-80% neutrals, 15-25% evergreen, <5% gold accent** — This is the color distribution rule for every page.
- **Clean, professional, corporate** — No flashy gradients, no dark mode on marketing pages, no rounded-xl cards.
- **Content-first responsive** — Text appears before visuals on mobile (`flex-col-reverse`).
- **Consistent rhythm** — Alternating white/gray section backgrounds create visual cadence.

---

## 2. Color System

### 2.1 Core Palette

| Name | Hex | Usage |
|---|---|---|
| **Evergreen** | `#215C46` | Primary brand color. Buttons, links, focus rings, verified badges. |
| **Evergreen Dark** | `#174433` | Dark text on secondary backgrounds. |
| **Evergreen Light** | `#DDEBE5` | Light tint backgrounds, secondary surfaces. |
| **Sand Gold** | `#C6A75E` | Premium accents, gold text highlights. |
| **Gold Hover** | `#A98943` | Gold interactive hover state. |
| **Gold Tint** | `#F3E9CF` | Premium highlight surfaces. |
| **Ink** | `#101418` | Darkest text, dark panel backgrounds. |
| **Mist** | `#F6F7F8` | Page background, muted surfaces. |
| **Slate** | `#3A4752` | Helper/secondary text. |
| **Steel Blue** | `#2E5870` | Charts, info states. |
| **Muted Amber** | `#B98A2D` | Warning states, chart color. |

### 2.2 Marketing Page Text Colors (Hardcoded Hex)

| Hex | Role |
|---|---|
| `#111` | Headings, bold text |
| `#222` | Semi-bold labels |
| `#333` | Lead paragraphs |
| `#444` | Standard body text |
| `#666` | Secondary/supporting text |
| `#888` | Eyebrows, meta, captions |
| `#999` | Footnotes, fine print |
| `#bbb` | Disabled/muted elements |

### 2.3 Background & Border Colors

| Hex | Role |
|---|---|
| `#FAFAFA` | Alternating section background (gray) |
| `#FFFFFF` | Card and panel surfaces |
| `#eee` | Card/section borders |
| `#f0f0f0` | Internal dividers |
| `#ddd` | Timeline connectors |

### 2.4 Status Colors

| State | Text Color | Badge Background |
|---|---|---|
| Verified / Current | `#059669` | `#059669` at 10% opacity |
| Warning / Expiring | `#D97706` | `#D97706` at 10% opacity |
| Missing / Error | `#DC2626` | `#DC2626` at 10% opacity |

### 2.5 Semantic Tokens (for reusable components)

| Token | Light | Dark | CSS Variable |
|---|---|---|---|
| Background | `#F6F7F8` | `#101418` | `--background` |
| Foreground | `#101418` | `#F6F7F8` | `--foreground` |
| Card | `#FFFFFF` | `#1A1F25` | `--card` |
| Primary | `#215C46` | `#3D8B6B` | `--primary` |
| Primary Foreground | `#FFFFFF` | `#FFFFFF` | `--primary-foreground` |
| Secondary | `#DDEBE5` | `#1A2E25` | `--secondary` |
| Secondary Foreground | `#174433` | `#DDEBE5` | `--secondary-foreground` |
| Muted | `#F6F7F8` | `#1A1F25` | `--muted` |
| Muted Foreground | `#3A4752` | `#8A949E` | `--muted-foreground` |
| Accent | `#F3E9CF` | `#2A2215` | `--accent` |
| Accent Foreground | `#A98943` | `#C6A75E` | `--accent-foreground` |
| Destructive | `#A33B3B` | `#C45050` | `--destructive` |
| Border | `#E4E8EC` | `#2A3038` | `--border` |
| Ring | `#215C46` | `#3D8B6B` | `--ring` |

### 2.6 Chart Palette

| Slot | Color | Hex |
|---|---|---|
| Chart 1 | Evergreen | `#215C46` |
| Chart 2 | Steel Blue | `#2E5870` |
| Chart 3 | Sand Gold | `#C6A75E` |
| Chart 4 | Muted Amber | `#B98A2D` |
| Chart 5 | Slate | `#3A4752` |

---

## 3. Typography

### 3.1 Font Families

| Family | Variable | Usage |
|---|---|---|
| **Inter** | `font-sans` | All body text, UI elements, headings |
| **Source Serif 4** | `font-serif` | Editorial emphasis only (sparingly) |
| **Geist Mono** | `font-mono` | Code snippets, technical data |

### 3.2 Type Scale

| Element | Classes |
|---|---|
| **H1 — Page Hero** | `text-balance text-[28px] font-bold leading-[1.15] tracking-tight text-[#111] md:text-[40px] lg:text-[48px]` |
| **H2 — Section Title** | `text-[22px] font-bold leading-[1.25] tracking-tight text-[#111] md:text-[28px]` |
| **H2 — CTA/Closing** | `text-[22px] font-bold tracking-tight text-[#111] md:text-[28px] lg:text-[32px]` |
| **H3 — Subsection** | `text-lg font-bold text-foreground` or `text-[16px] font-semibold text-[#111]` |
| **H3 — Card Title** | `text-[18px] font-semibold leading-snug text-[#111]` |
| **Eyebrow** | `text-[13px] font-medium uppercase tracking-widest text-[#888]` |
| **Eyebrow (Primary)** | `text-[13px] font-medium uppercase tracking-widest text-primary` |
| **Lead Paragraph** | `text-base leading-relaxed text-[#333] md:text-lg` |
| **Body** | `text-[14px] leading-relaxed text-[#444]` or `text-[15px] leading-relaxed text-[#444]` |
| **Body (Large)** | `text-lg leading-relaxed text-muted-foreground md:text-xl` |
| **Small / Meta** | `text-[13px] text-[#888]` |
| **Fine Print** | `text-[12px] text-[#888]` or `text-[12px] text-[#999]` |

### 3.3 Typography Rules

- Always use `text-balance` on headlines.
- Always use `leading-relaxed` on body text.
- Always use `tracking-tight` on headings.

---

## 4. Layout System

### 4.1 Container

**Always:** `mx-auto max-w-[1120px] px-6`

**Never** use `max-w-7xl` or other standard Tailwind containers.

### 4.2 Section Spacing

| Context | Classes |
|---|---|
| Hero (homepage) | `py-24 md:py-32` |
| Hero (sub-pages) | `py-20 md:py-28` |
| Content sections | `py-20 md:py-24` or `py-16 md:py-20` |
| Compact strips | `py-6 md:py-8` or `py-12 md:py-16` |

### 4.3 Background Alternation Pattern

```
White  → Hero
Gray   → Problem / Context
White  → How it works
Gray   → Features / What you get
...alternate...
Gray   → FAQ
White  → Final CTA
Gray   → Other Side Module
```

Gray = `bg-[#FAFAFA]`

### 4.4 Grid Patterns

| Pattern | Classes |
|---|---|
| 3-column cards | `grid gap-6 md:grid-cols-3` |
| 2-column split | `grid items-start gap-12 lg:grid-cols-2` |
| 2-column cards | `grid gap-8 md:grid-cols-2` |
| 4-column stats | `grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4` |

### 4.5 Text + Visual Layout

Text-first on mobile, side-by-side on desktop:

```
flex flex-col-reverse gap-12 md:flex-row md:items-start md:gap-16 lg:gap-20
```

---

## 5. Component Specifications

### 5.1 Buttons

| Variant | Classes |
|---|---|
| **Primary CTA** | `size="lg"` + `w-full sm:w-auto rounded-md px-8 py-3 text-[15px] font-semibold` |
| **Outline CTA** | Same as Primary + `variant="outline"` |
| **Small CTA** | `size="sm"` + `rounded-md px-5 text-[13px] font-semibold` |
| **Text Link** | `text-[15px] font-medium text-primary underline underline-offset-4 hover:text-primary/80` |

Always use shadcn `<Button>` with `asChild` when wrapping `<Link>`.

### 5.2 Cards

| Type | Classes |
|---|---|
| Marketing card | `rounded-md border border-[#eee] bg-white p-6` |
| Feature/router card | `rounded-[20px] border border-border bg-card p-7 transition-shadow hover:shadow-sm md:p-8` |

**Never** use `rounded-lg` or `rounded-xl` for cards.

### 5.3 Badges

| Type | Classes |
|---|---|
| Status (verified) | `rounded bg-[#059669]/10 px-2.5 py-1 text-[12px] font-medium text-[#059669]` |
| Status (warning) | `rounded bg-[#D97706]/10 px-2.5 py-1 text-[12px] font-medium text-[#D97706]` |
| Status (error) | `rounded bg-[#DC2626]/10 px-2.5 py-1 text-[12px] font-medium text-[#DC2626]` |
| Count pill | `inline-flex h-6 min-w-[28px] items-center justify-center rounded-full px-2 text-[12px] font-semibold text-white bg-[#DC2626]` |

### 5.4 Lists

| Style | Bullet Element |
|---|---|
| Dot (primary) | `<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />` |
| Dot (green) | `<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />` |
| Check icon | `<CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" />` |

### 5.5 Icons

Use **Lucide React** exclusively. Standard sizes: `h-4 w-4` or `h-5 w-5`.

### 5.6 Shadows & Elevation

| Level | Class | Usage |
|---|---|---|
| Subtle | `shadow-sm` | Base elevation |
| Default | `shadow-md` | Default elevation |
| Emphasized | `shadow-lg` | Emphasized panels |
| Hover lift | `hover:shadow-md hover:-translate-y-0.5` | Interactive cards |

### 5.7 Border Radius

| Element | Radius |
|---|---|
| Base (shadcn) | `0.5rem` (`--radius`) |
| Marketing cards | `rounded-md` |
| Feature cards | `rounded-[20px]` |
| Buttons | `rounded-md` |
| Status badges | `rounded` |
| Pills | `rounded-full` |

---

## 6. Responsive Patterns

| Pattern | Classes |
|---|---|
| Buttons | `w-full sm:w-auto` |
| CTA groups | `flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6` |
| Text + visual | `flex flex-col-reverse gap-12 md:flex-row` |
| Desktop nav | `hidden lg:flex` |
| Mobile menu | `lg:hidden` |

---

## 7. Analytics

Every CTA must include tracking attributes:

```tsx
import { getCtaDataAttributes } from "@/lib/analytics";
<Link href="/meet" {...getCtaDataAttributes("action-location")}>
```

Name format: `action-location` (e.g., `schedule-demo-header`, `get-started-hero`).

---

## 8. Forbidden Patterns

- Colors outside this palette
- Dark mode on marketing pages
- `rounded-lg` or `rounded-xl` for cards
- New font families
- Inline `style` attributes
- CSS modules
- `max-w-7xl` or other standard containers
- Skipping eyebrow labels when the pattern calls for them
- New Lucide icons without checking the existing set first
- Omitting `getCtaDataAttributes()` from any CTA
