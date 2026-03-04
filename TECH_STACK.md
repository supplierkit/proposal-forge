# ProposalForge — Tech Stack

## Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| Database | PostgreSQL | 15+ (via Supabase) |
| Auth | Supabase Auth | latest |
| Storage | Supabase Storage | latest |
| Realtime | Supabase Realtime | latest |
| AI | Claude API (Anthropic) | claude-sonnet-4-6 |
| Payments | Stripe | latest |
| Email | Resend | latest |
| Hosting | Vercel | latest |
| Validation | Zod | 3.x |
| Testing | Vitest + Playwright | latest |
| Linting | ESLint + Prettier | latest |
| PDF | @react-pdf/renderer | latest |

---

## Justifications

### Next.js 15 (App Router)
**Why:** Full-stack React framework with server components, API routes, and edge rendering in one package. Eliminates the need for a separate backend service during MVP.
**Alternatives considered:**
- Remix: Similar capabilities but smaller ecosystem and fewer deployment options.
- Separate frontend + Node.js API: More complexity to manage, slower to build.
**Decision:** Next.js App Router gives us SSR for the landing page (SEO), server components for the dashboard (performance), and API routes for the backend — all in one codebase.

### TypeScript (Strict Mode)
**Why:** Type safety prevents runtime errors, improves refactoring confidence, and serves as documentation. Strict mode catches null/undefined issues at compile time.
**Non-negotiable:** `strict: true` in tsconfig.json from day one.

### Tailwind CSS + shadcn/ui
**Why:** Tailwind provides utility-first styling with no CSS file management. shadcn/ui provides accessible, customizable components that we own (copied into our codebase, not a dependency).
**Alternatives considered:**
- Material UI: Heavier, harder to customize, opinionated design language.
- Chakra UI: Good but less flexible than shadcn/ui for custom designs.
**Decision:** shadcn/ui components are unstyled primitives built on Radix UI — fully accessible, fully customizable, zero runtime overhead from a component library.

### Supabase (PostgreSQL + Auth + Storage + Realtime)
**Why:** Supabase provides a managed PostgreSQL database with built-in auth, file storage, and realtime subscriptions — eliminating 4 separate services. Row-level security (RLS) enables multi-tenant isolation at the database level.
**Alternatives considered:**
- AWS RDS + Cognito + S3: More flexible but 10x more setup time and operational overhead.
- Firebase: NoSQL (Firestore) is a poor fit for relational hotel/proposal data.
- PlanetScale: MySQL-based, no built-in auth or storage.
**Decision:** Supabase gives us the most functionality with the least setup time. The Pro plan ($25/month) includes 8GB database, 100GB storage, and 500MB realtime bandwidth — more than sufficient for MVP.

### Claude API (Anthropic)
**Why:** Best-in-class for structured content generation. Hotel proposals require nuanced, professional writing with accurate details — Claude excels at following detailed instructions and producing polished output.
**Model choice:** `claude-sonnet-4-6` for the best balance of quality and cost. Upgrade to Opus for enterprise customers if needed.
**Alternatives considered:**
- GPT-4o: Comparable quality but higher cost per token for similar output.
- Open-source models: Lower quality for structured business writing, require hosting infrastructure.
**Decision:** Claude API with sonnet for most generation tasks. Pay-per-use pricing means costs scale with actual usage.

### Stripe
**Why:** Industry standard for SaaS billing. Handles subscriptions, trials, invoicing, tax calculation, and global payments. Well-documented, excellent developer experience.
**No alternatives considered.** Stripe is the clear choice for B2B SaaS billing.

### Resend
**Why:** Modern email API built for developers. Simple API, excellent deliverability, React Email support for templating.
**Alternatives considered:**
- SendGrid: More complex, enterprise-oriented pricing.
- Postmark: Good deliverability but less developer-friendly API.
**Decision:** Resend's React Email integration lets us build email templates with the same components we use in the app.

### Vercel
**Why:** Native hosting for Next.js with zero-config deployments. Preview deployments on every PR. Edge functions for low-latency API responses. Built-in analytics.
**Alternatives considered:**
- AWS Amplify: More complex setup, slower deployments.
- Railway: Good but less optimized for Next.js specifically.
**Decision:** Vercel + Next.js is the fastest path to production with the least DevOps overhead.

### Zod
**Why:** TypeScript-first schema validation. Validates API inputs, form data, and environment variables. Generates TypeScript types from schemas (single source of truth).
**No alternatives considered.** Zod is the standard for TypeScript validation.

### Vitest + Playwright
**Why:** Vitest for unit/integration tests (fast, Vite-native, Jest-compatible API). Playwright for E2E tests (cross-browser, reliable, auto-waiting).
**Alternatives considered:**
- Jest: Slower than Vitest, requires more configuration.
- Cypress: Slower E2E execution, more limited browser support.
**Decision:** Vitest for speed in unit tests; Playwright for reliable E2E coverage of critical flows.

### @react-pdf/renderer
**Why:** Generates PDFs from React components. Proposals can be rendered as both web pages and downloadable PDFs using shared component logic.
**Alternatives considered:**
- Puppeteer/Playwright PDF: Requires headless browser, heavier infrastructure.
- wkhtmltopdf: C dependency, harder to deploy serverlessly.
**Decision:** React-PDF runs in Node.js without a browser, works in serverless environments, and lets us reuse React components.

---

## Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code quality and error detection |
| Prettier | Code formatting (consistent style) |
| Husky | Git hooks (run lint/tests pre-commit) |
| lint-staged | Run linters on staged files only |
| dotenv | Environment variable management |
| npm | Package manager (pinned versions) |

---

## Package Version Policy

- All dependencies pinned to exact versions (no `^` or `~`).
- `npm audit` run after every install. Critical/high vulnerabilities fixed immediately.
- Dependencies documented in DEPENDENCIES.md with package name, version, purpose, and license.
