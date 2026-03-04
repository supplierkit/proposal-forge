/**
 * SupplierKit Design System — Component Library
 *
 * Drop this file into any React/Next.js project to get the complete
 * SupplierKit visual system as ready-to-use components.
 *
 * Dependencies: tailwindcss, lucide-react
 * Font stack: Inter (font-sans), Source Serif 4 (font-serif), Geist Mono (font-mono)
 *
 * Usage:
 *   import { Hero, SectionTitle, Card, StatusBadge, ... } from "./supplierkit-design-system";
 */

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

/* ============================================================
   TOKENS — CSS custom property configuration for tailwind.config
   Paste this into your tailwind.config.ts `theme.extend.colors`
   ============================================================ */
export const supplierKitTokens = {
  background: { DEFAULT: "#F6F7F8", dark: "#101418" },
  foreground: { DEFAULT: "#101418", dark: "#F6F7F8" },
  card: { DEFAULT: "#FFFFFF", dark: "#1A1F25" },
  primary: { DEFAULT: "#215C46", dark: "#3D8B6B", foreground: "#FFFFFF" },
  secondary: {
    DEFAULT: "#DDEBE5",
    dark: "#1A2E25",
    foreground: "#174433",
  },
  muted: { DEFAULT: "#F6F7F8", foreground: "#3A4752" },
  accent: { DEFAULT: "#F3E9CF", foreground: "#A98943" },
  destructive: { DEFAULT: "#A33B3B", dark: "#C45050" },
  border: { DEFAULT: "#E4E8EC", dark: "#2A3038" },
  ring: { DEFAULT: "#215C46", dark: "#3D8B6B" },
  success: "#215C46",
  warning: "#B98A2D",
  info: "#2E5870",
  gold: { DEFAULT: "#C6A75E", hover: "#A98943", tint: "#F3E9CF" },
  evergreen: { DEFAULT: "#215C46", dark: "#174433", light: "#DDEBE5" },
  "dark-panel": { DEFAULT: "#101418", foreground: "#F6F7F8" },
  chart: {
    1: "#215C46",
    2: "#2E5870",
    3: "#C6A75E",
    4: "#B98A2D",
    5: "#3A4752",
  },
};

/* ============================================================
   ANALYTICS HELPER
   Replace with your real analytics implementation.
   ============================================================ */
export function getCtaDataAttributes(name) {
  return {
    "data-cta": name,
    "data-track": "click",
  };
}

/* ============================================================
   LAYOUT COMPONENTS
   ============================================================ */

/** Standard page container — always 1120px max with 24px padding */
export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto max-w-[1120px] px-6 ${className}`}>
      {children}
    </div>
  );
}

/** White section */
export function Section({ children, className = "", spacing = "default" }) {
  const spacingClasses = {
    hero: "py-24 md:py-32",
    "sub-hero": "py-20 md:py-28",
    default: "py-20 md:py-24",
    compact: "py-16 md:py-20",
    strip: "py-6 md:py-8",
  };
  return (
    <section className={`${spacingClasses[spacing] || spacingClasses.default} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Gray alternating section (bg-[#FAFAFA]) */
export function SectionGray({ children, className = "", spacing = "default" }) {
  return (
    <Section spacing={spacing} className={`bg-[#FAFAFA] ${className}`}>
      {children}
    </Section>
  );
}

/* ============================================================
   TYPOGRAPHY COMPONENTS
   ============================================================ */

/** H1 — Page hero headline */
export function H1({ children, className = "" }) {
  return (
    <h1
      className={`text-balance text-[28px] font-bold leading-[1.15] tracking-tight text-[#111] md:text-[40px] lg:text-[48px] ${className}`}
    >
      {children}
    </h1>
  );
}

/** H2 — Section title */
export function H2({ children, className = "", variant = "section" }) {
  const variants = {
    section:
      "text-[22px] font-bold leading-[1.25] tracking-tight text-[#111] md:text-[28px]",
    cta: "text-[22px] font-bold tracking-tight text-[#111] md:text-[28px] lg:text-[32px]",
  };
  return <h2 className={`${variants[variant]} ${className}`}>{children}</h2>;
}

/** H3 — Subsection or card title */
export function H3({ children, className = "", variant = "subsection" }) {
  const variants = {
    subsection: "text-[16px] font-semibold text-[#111]",
    card: "text-[18px] font-semibold leading-snug text-[#111]",
  };
  return <h3 className={`${variants[variant]} ${className}`}>{children}</h3>;
}

/** Eyebrow label */
export function Eyebrow({ children, primary = false, className = "" }) {
  return (
    <p
      className={`text-[13px] font-medium uppercase tracking-widest ${
        primary ? "text-primary" : "text-[#888]"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/** Lead paragraph */
export function Lead({ children, className = "" }) {
  return (
    <p className={`text-base leading-relaxed text-[#333] md:text-lg ${className}`}>
      {children}
    </p>
  );
}

/** Body text */
export function Body({ children, className = "", size = "default" }) {
  const sizes = {
    default: "text-[14px] leading-relaxed text-[#444]",
    medium: "text-[15px] leading-relaxed text-[#444]",
    large: "text-lg leading-relaxed text-muted-foreground md:text-xl",
  };
  return <p className={`${sizes[size]} ${className}`}>{children}</p>;
}

/** Small / meta text */
export function Meta({ children, className = "" }) {
  return <p className={`text-[13px] text-[#888] ${className}`}>{children}</p>;
}

/** Fine print */
export function FinePrint({ children, className = "" }) {
  return <p className={`text-[12px] text-[#999] ${className}`}>{children}</p>;
}

/* ============================================================
   BUTTON COMPONENTS
   ============================================================ */

/** Primary CTA button */
export function ButtonPrimary({ children, href, ctaName, className = "", onClick }) {
  const classes = `inline-flex items-center justify-center w-full sm:w-auto rounded-md bg-primary px-8 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...(ctaName ? getCtaDataAttributes(ctaName) : {})}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...(ctaName ? getCtaDataAttributes(ctaName) : {})}>
      {children}
    </button>
  );
}

/** Outline CTA button */
export function ButtonOutline({ children, href, ctaName, className = "", onClick }) {
  const classes = `inline-flex items-center justify-center w-full sm:w-auto rounded-md border border-border bg-transparent px-8 py-3 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...(ctaName ? getCtaDataAttributes(ctaName) : {})}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...(ctaName ? getCtaDataAttributes(ctaName) : {})}>
      {children}
    </button>
  );
}

/** Small CTA button */
export function ButtonSmall({ children, href, ctaName, className = "", onClick }) {
  const classes = `inline-flex items-center justify-center rounded-md bg-primary px-5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary/90 ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...(ctaName ? getCtaDataAttributes(ctaName) : {})}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...(ctaName ? getCtaDataAttributes(ctaName) : {})}>
      {children}
    </button>
  );
}

/** Text link CTA */
export function TextLink({ children, href, ctaName, className = "" }) {
  return (
    <a
      href={href}
      className={`text-[15px] font-medium text-primary underline underline-offset-4 hover:text-primary/80 ${className}`}
      {...(ctaName ? getCtaDataAttributes(ctaName) : {})}
    >
      {children}
    </a>
  );
}

/** CTA group — stacks vertically on mobile, row on desktop */
export function CtaGroup({ children, className = "" }) {
  return (
    <div className={`mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 ${className}`}>
      {children}
    </div>
  );
}

/* ============================================================
   CARD COMPONENTS
   ============================================================ */

/** Marketing card */
export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-md border border-[#eee] bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

/** Feature / router card (with hover lift) */
export function FeatureCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[20px] border border-border bg-card p-7 transition-shadow hover:shadow-sm md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

/** Coming soon card (dashed border) */
export function ComingSoonCard({ title, description, className = "" }) {
  return (
    <div className={`rounded-md border border-dashed border-[#ddd] bg-[#FAFAFA] p-5 ${className}`}>
      <p className="text-[15px] font-semibold text-[#111]">{title}</p>
      <p className="mt-2 text-[14px] leading-relaxed text-[#444]">{description}</p>
    </div>
  );
}

/** Pricing card */
export function PricingCard({
  tier,
  planName,
  price,
  priceDetail,
  description,
  features = [],
  ctaLabel,
  ctaHref,
  ctaName,
  highlighted = false,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col rounded-md border ${
        highlighted ? "border-primary shadow-md" : "border-[#eee]"
      } bg-white p-8 ${className}`}
    >
      <Eyebrow>{tier}</Eyebrow>
      <h3 className="mt-3 text-[20px] font-bold text-[#111]">{planName}</h3>
      <p className="mt-2 text-[32px] font-bold text-primary">
        {price}
        <span className="text-[16px] font-normal text-[#666]"> / month</span>
      </p>
      {priceDetail && <p className="mt-1 text-[14px] text-[#666]">{priceDetail}</p>}
      <p className="mt-4 text-[15px] leading-relaxed text-[#444]">{description}</p>
      <div className="mt-5 border-t border-[#f0f0f0] pt-5">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#888]">
          Includes
        </p>
        <ul className="space-y-2 text-[14px] text-[#444]">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {ctaLabel && (
        <div className="mt-auto pt-6">
          <ButtonPrimary href={ctaHref} ctaName={ctaName} className="w-full">
            {ctaLabel}
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   BADGE COMPONENTS
   ============================================================ */

/** Status badge */
export function StatusBadge({ children, variant = "success" }) {
  const variants = {
    success: "bg-[#059669]/10 text-[#059669]",
    warning: "bg-[#D97706]/10 text-[#D97706]",
    error: "bg-[#DC2626]/10 text-[#DC2626]",
  };
  return (
    <span className={`rounded px-2.5 py-1 text-[12px] font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

/** Count pill badge */
export function CountBadge({ count, className = "" }) {
  return (
    <span
      className={`inline-flex h-6 min-w-[28px] items-center justify-center rounded-full bg-[#DC2626] px-2 text-[12px] font-semibold text-white ${className}`}
    >
      {count}
    </span>
  );
}

/* ============================================================
   LIST COMPONENTS
   ============================================================ */

/** Dot bullet list */
export function DotList({ items, variant = "primary", className = "" }) {
  const dotColor = variant === "green" ? "bg-[#059669]" : "bg-primary";
  return (
    <ul className={`space-y-2 text-[15px] text-[#444] ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Check icon list */
export function CheckList({ items, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" />
          <div>
            {typeof item === "string" ? (
              <p className="text-[14px] leading-relaxed text-[#444]">{item}</p>
            ) : (
              <>
                <p className="text-[14px] font-semibold text-[#222]">{item.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[#444]">
                  {item.description}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SECTION PATTERN COMPONENTS
   ============================================================ */

/** Hero section */
export function Hero({
  eyebrow,
  headline,
  lead,
  primaryCta,
  primaryCtaHref,
  primaryCtaName,
  secondaryCta,
  secondaryCtaHref,
  secondaryCtaName,
  isHomepage = false,
}) {
  return (
    <section className={isHomepage ? "py-24 md:py-32" : "py-20 md:py-28"}>
      <Container>
        <div className="max-w-[720px]">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <H1>{headline}</H1>
          {lead && <Lead className="mt-6 max-w-xl">{lead}</Lead>}
          {(primaryCta || secondaryCta) && (
            <CtaGroup>
              {primaryCta && (
                <ButtonPrimary href={primaryCtaHref} ctaName={primaryCtaName}>
                  {primaryCta}
                </ButtonPrimary>
              )}
              {secondaryCta && (
                <TextLink href={secondaryCtaHref} ctaName={secondaryCtaName}>
                  {secondaryCta}
                </TextLink>
              )}
            </CtaGroup>
          )}
        </div>
      </Container>
    </section>
  );
}

/** Problem section — 3-column card grid */
export function ProblemSection({ eyebrow = "The problem", headline, items }) {
  return (
    <SectionGray>
      <div className="text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <H2 className="mx-auto mt-4 max-w-[680px] text-balance">{headline}</H2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Card key={i} className="text-center">
              <p className="text-[16px] font-semibold text-[#222]">{item.title}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#444]">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </SectionGray>
  );
}

/** Icon + text feature block */
export function FeatureBlock({ icon: Icon, title, description, className = "" }) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#059669]/10">
        <Icon className="h-5 w-5 text-[#059669]" />
      </div>
      <div>
        <H3>{title}</H3>
        <p className="mt-1 text-[14px] leading-relaxed text-[#444]">{description}</p>
      </div>
    </div>
  );
}

/** Metrics bar — stats in a row */
export function MetricsBar({ stats, className = "" }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[#eee] pt-12 md:grid-cols-4 ${className}`}
    >
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl font-bold text-[#111] md:text-3xl">{stat.number}</p>
          <p className="mt-1 text-[13px] leading-snug text-[#888]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

/** Integration logos bar */
export function IntegrationsBar({ names, className = "" }) {
  return (
    <section className={`border-y border-[#eee] py-12 md:py-16 ${className}`}>
      <Container>
        <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-widest text-[#888]">
          Works alongside your existing systems
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-14">
          {names.map((name) => (
            <span key={name} className="whitespace-nowrap text-base font-semibold text-[#bbb]">
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Vertical timeline (numbered steps) */
export function Timeline({ steps, className = "" }) {
  return (
    <div className={`flex gap-5 ${className}`}>
      <div className="flex flex-col items-center">
        {steps.map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {i > 0 && <div className="w-px flex-1 bg-[#ddd]" />}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
              {i + 1}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between py-0.5">
        {steps.map((step, i) => (
          <div key={i}>
            <p className="text-[16px] font-semibold text-[#111]">{step.title}</p>
            <p className="mt-0.5 text-[14px] leading-relaxed text-[#444]">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mockup panel — data preview rows */
export function MockupPanel({ title, rows, className = "" }) {
  return (
    <Card className={className}>
      <p className="mb-5 text-[13px] font-medium text-[#888]">{title}</p>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-[#f0f0f0] pb-2 last:border-0 last:pb-0"
          >
            <span className="text-[14px] text-[#222]">{row.name}</span>
            <StatusBadge variant={row.variant}>{row.status}</StatusBadge>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Highlighted banner / promo strip */
export function HighlightBanner({
  label,
  headline,
  description,
  ctaLabel,
  ctaHref,
  ctaName,
  className = "",
}) {
  return (
    <div className={`rounded-md border border-primary/20 bg-primary/5 p-6 md:p-8 ${className}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-[600px]">
          <p className="text-[12px] font-bold uppercase tracking-widest text-primary">{label}</p>
          <p className="mt-2 text-[18px] font-bold text-[#111] md:text-[20px]">{headline}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#333]">{description}</p>
        </div>
        {ctaLabel && (
          <div className="shrink-0">
            <ButtonPrimary href={ctaHref} ctaName={ctaName}>
              {ctaLabel}
            </ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  );
}

/** FAQ accordion */
export function FAQSection({ headline = "Common questions", items }) {
  return (
    <SectionGray>
      <H2 className="mb-10">{headline}</H2>
      <div className="max-w-3xl">
        <FAQAccordion items={items} />
      </div>
    </SectionGray>
  );
}

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="divide-y divide-[#eee]">
      {items.map((item, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-[15px] font-semibold text-[#111]">{item.question}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#888] transition-transform ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && (
            <p className="mt-3 text-[14px] leading-relaxed text-[#444]">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/** Final CTA section */
export function FinalCta({
  headline,
  description,
  primaryCta,
  primaryCtaHref,
  primaryCtaName,
  secondaryCta,
  secondaryCtaHref,
  secondaryCtaName,
}) {
  return (
    <Section>
      <div className="text-center">
        <H2 variant="cta" className="mx-auto max-w-[720px] text-balance">
          {headline}
        </H2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-base text-[#444]">{description}</p>
        )}
        <div className="mt-8 flex flex-col items-center gap-4">
          {primaryCta && (
            <ButtonPrimary href={primaryCtaHref} ctaName={primaryCtaName}>
              {primaryCta}
            </ButtonPrimary>
          )}
          {secondaryCta && (
            <TextLink href={secondaryCtaHref} ctaName={secondaryCtaName}>
              {secondaryCta}
            </TextLink>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   DEMO — Complete page showing all components in action
   ============================================================ */

export default function SupplierKitDesignSystemDemo() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <Hero
        eyebrow="Design System Preview"
        headline="The SupplierKit Visual Language"
        lead="Every component, color, and typographic decision in one interactive reference. Use this to build consistent, professional interfaces."
        primaryCta="Get Started"
        primaryCtaHref="#"
        primaryCtaName="demo-hero-primary"
        secondaryCta="View Documentation"
        secondaryCtaHref="#"
        secondaryCtaName="demo-hero-secondary"
      />

      {/* Problem Section */}
      <ProblemSection
        headline="Inconsistent design slows teams down"
        items={[
          {
            title: "Color Drift",
            description:
              "Without a system, every developer picks slightly different shades. The product looks fragmented.",
          },
          {
            title: "Typography Chaos",
            description:
              "Font sizes, weights, and line heights vary by page. Nothing feels cohesive.",
          },
          {
            title: "Component Duplication",
            description:
              "The same card gets rebuilt 5 different ways. Maintenance becomes a nightmare.",
          },
        ]}
      />

      {/* Feature Blocks */}
      <Section>
        <Eyebrow className="mb-4">What you get</Eyebrow>
        <H2>A complete component system</H2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <FeatureBlock
            icon={Shield}
            title="Color tokens"
            description="Semantic tokens for light and dark mode, plus hardcoded hex values for marketing pages."
          />
          <FeatureBlock
            icon={CheckCircle}
            title="Type scale"
            description="9-level type hierarchy from H1 hero to fine print, all with precise Tailwind classes."
          />
        </div>
      </Section>

      {/* Metrics */}
      <SectionGray>
        <MetricsBar
          stats={[
            { number: "17", label: "Color tokens" },
            { number: "9", label: "Type levels" },
            { number: "20+", label: "Components" },
            { number: "5", label: "Chart colors" },
          ]}
        />
      </SectionGray>

      {/* Badges & Status */}
      <Section>
        <H2 className="mb-8">Status indicators</H2>
        <div className="flex flex-wrap gap-3">
          <StatusBadge variant="success">Verified</StatusBadge>
          <StatusBadge variant="warning">Expiring soon</StatusBadge>
          <StatusBadge variant="error">Missing docs</StatusBadge>
          <CountBadge count={3} />
        </div>
      </Section>

      {/* Mockup Panel */}
      <SectionGray>
        <H2 className="mb-8">Data preview</H2>
        <div className="max-w-lg">
          <MockupPanel
            title="Compliance status"
            rows={[
              { name: "Business license", status: "Current", variant: "success" },
              { name: "Insurance certificate", status: "Expiring", variant: "warning" },
              { name: "Safety audit", status: "Missing", variant: "error" },
            ]}
          />
        </div>
      </SectionGray>

      {/* Timeline */}
      <Section>
        <H2 className="mb-8">How it works</H2>
        <Timeline
          steps={[
            { title: "Install the package", description: "Add the design system to your project." },
            { title: "Import components", description: "Use named imports for exactly what you need." },
            { title: "Build consistently", description: "Every page matches the SupplierKit standard." },
          ]}
        />
      </Section>

      {/* Highlight Banner */}
      <SectionGray>
        <HighlightBanner
          label="Quick start"
          headline="Copy, paste, ship"
          description="Every component is self-contained. No complex setup required."
          ctaLabel="View source"
          ctaHref="#"
          ctaName="demo-banner-cta"
        />
      </SectionGray>

      {/* Pricing */}
      <Section>
        <div className="text-center">
          <Eyebrow className="mb-4">Pricing</Eyebrow>
          <H2>Simple, transparent pricing</H2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <PricingCard
            tier="Starter"
            planName="Single Property"
            price="$499"
            priceDetail="Billed annually at $5,988"
            description="For individual hotels and small operators."
            features={["Core workflow", "Email support", "Basic analytics"]}
            ctaLabel="Start free trial"
            ctaHref="#"
            ctaName="pricing-starter"
          />
          <PricingCard
            tier="Professional"
            planName="Hotel Group"
            price="$1,499"
            priceDetail="Billed annually at $17,988"
            description="For hotel groups with 5-20 properties."
            features={[
              "Everything in Starter",
              "Multi-property dashboard",
              "PMS integrations",
              "Priority support",
            ]}
            ctaLabel="Start free trial"
            ctaHref="#"
            ctaName="pricing-professional"
            highlighted
          />
          <PricingCard
            tier="Enterprise"
            planName="Chain & Portfolio"
            price="$3,999"
            priceDetail="Billed annually at $47,988"
            description="For large chains with 20+ properties."
            features={[
              "Everything in Professional",
              "Custom integrations",
              "Dedicated support",
              "SLA guarantee",
              "SSO & SAML",
            ]}
            ctaLabel="Contact sales"
            ctaHref="#"
            ctaName="pricing-enterprise"
          />
        </div>
      </Section>

      {/* Integrations */}
      <IntegrationsBar
        names={["Opera PMS", "Mews", "Cloudbeds", "SiteMinder", "Amadeus", "Sabre"]}
      />

      {/* FAQ */}
      <FAQSection
        items={[
          {
            question: "Can I customize the colors?",
            answer:
              "Yes. Override the CSS custom properties in your tailwind.config.ts to match your brand while preserving the design ratios.",
          },
          {
            question: "Does it support dark mode?",
            answer:
              "The semantic token system includes dark mode values for all app components. Marketing pages are light-only by design.",
          },
          {
            question: "What about accessibility?",
            answer:
              "All color combinations meet WCAG AA contrast ratios. Focus rings use the primary color for visibility.",
          },
        ]}
      />

      {/* Final CTA */}
      <FinalCta
        headline="Start building with SupplierKit"
        description="Import the components. Follow the system. Ship faster."
        primaryCta="Get started"
        primaryCtaHref="#"
        primaryCtaName="demo-final-cta"
        secondaryCta="Read the docs"
        secondaryCtaHref="#"
        secondaryCtaName="demo-final-secondary"
      />
    </div>
  );
}
