# ProposalForge — MVP Feature Scope

## The ONE Thing

**AI-powered interactive proposal creation and delivery for hotel group sales.**

A hotel sales manager receives an RFP, inputs the key details, and ProposalForge generates a professional, branded, interactive proposal in minutes — complete with room blocks, function spaces, catering options, and pricing. The proposal is delivered as a trackable web link with real-time analytics.

---

## MVP Features (Phase 3 — Weeks 1-3)

### 1. Landing Page
- Clear value proposition: "Create hotel group proposals in minutes, not hours"
- Product screenshots / demo GIF
- Pricing section (3 tiers)
- CTA: "Start Free Trial"
- SEO-optimized meta tags and Open Graph

### 2. Authentication & Multi-Tenancy
- Email/password sign-up and login
- Magic link login (passwordless)
- Password reset flow
- Organization creation on sign-up
- Invite team members (email invite flow)
- Role-based access (Owner, Admin, Manager, Sales Rep)
- Row-level security on all data

### 3. Property Setup
- Add/edit hotel properties (name, address, description, images)
- Configure room types (name, capacity, rates, photos)
- Configure function spaces (name, capacity, layouts, rates, floor plans)
- Configure catering packages (type, price per person, menu items)
- Brand settings (logo, colors) at organization level

### 4. Lead / Pipeline Management (Simple CRM)
- Create leads manually (contact info, event details, requirements)
- Pipeline board view (Kanban: New → Qualified → Proposal Sent → Negotiating → Won/Lost)
- Lead detail view with activity timeline
- Assign leads to team members
- Filter/search leads by status, property, date range

### 5. AI Proposal Generation (Core Feature)
- Input: Lead details (event type, dates, attendees, requirements)
- AI generates complete proposal with:
  - Professional cover page with hotel branding
  - Personalized introduction letter
  - Recommended room block (types, quantities, group rates)
  - Function space recommendations with layout options
  - Catering package suggestions
  - AV equipment and services
  - Pricing summary table
  - Terms and conditions
- Edit any section after generation (rich text editor)
- Add/remove/reorder sections
- Preview proposal as recipient will see it

### 6. Interactive Proposal Delivery
- Send proposal via email (branded email with CTA link)
- Public proposal viewer (no login required for recipient)
  - Responsive design (mobile + desktop)
  - Hotel branding (logo, colors)
  - Interactive sections with images and details
  - Pricing summary
  - Accept / Decline buttons
  - Optional: request changes via message
- PDF export for offline sharing

### 7. Proposal Analytics
- Track when proposals are opened
- Track time spent per section
- Track total views and unique viewers
- Notification to sales rep when proposal is viewed
- Dashboard: proposals sent, viewed, accepted, declined

### 8. Billing (Stripe)
- 14-day free trial (no credit card required)
- Three pricing tiers:
  - **Starter** ($299/mo): 1-3 properties, 3 users, 50 proposals/mo
  - **Professional** ($499/property/mo): Up to 20 properties, 10 users/property, unlimited proposals
  - **Enterprise** (custom): 20+ properties, unlimited users, SLA, dedicated support
- Stripe Checkout for payment
- Stripe Customer Portal for plan management
- Usage tracking (properties, users, proposals sent)

### 9. Admin Dashboard
- Organization overview: total proposals, win rate, pipeline value
- Per-property metrics
- User activity (proposals created, sent, response times)
- Subscription status and usage

### 10. Onboarding Flow
- Step 1: Create organization (name, logo)
- Step 2: Add first property (guided form with example data)
- Step 3: Add room types and function spaces (pre-filled templates for common setups)
- Step 4: Create first proposal (AI-assisted, using sample lead data)
- Step 5: Preview and send (to own email for testing)
- Target: "aha moment" in < 5 minutes

---

## Explicitly OUT of MVP Scope

| Feature | Reason | When |
|---------|--------|------|
| PMS integration (Opera, Mews, etc.) | Complex, not needed for core value | Phase 4+ |
| Cvent RFP ingestion | Requires partnership agreement | Phase 4+ |
| CRM integration (Salesforce, HubSpot) | Built-in CRM is sufficient for MVP | Phase 4+ |
| E-signatures (DocuSign) | Accept/decline buttons suffice for MVP | Phase 4+ |
| Multi-language proposals | English-first; localization later | Phase 4+ |
| Advanced reporting / BI | Basic analytics in MVP are sufficient | Phase 4+ |
| Custom domain for proposal links | Nice-to-have, not critical | Phase 4+ |
| Team collaboration (comments, @mentions) | Solo sales rep workflow first | Phase 4+ |
| Automated follow-up sequences | Manual follow-up is fine for MVP | Phase 4+ |
| Template marketplace | Customers create own templates first | Phase 5+ |

---

## Build Order (Weeks 1-3)

### Week 1: Foundation
1. Project setup (Next.js, Supabase, TypeScript, Tailwind, shadcn/ui)
2. Database schema and migrations
3. Authentication (sign-up, login, magic link, password reset)
4. Organization and user management
5. Property CRUD (with room types, function spaces, catering)

### Week 2: Core Product
6. Lead management (CRUD + pipeline board)
7. AI proposal generation engine
8. Proposal editor (sections, rich text, reordering)
9. Public proposal viewer (interactive web page)
10. Proposal delivery (email + tracking)

### Week 3: Business Layer
11. Proposal analytics (views, time per section, notifications)
12. Stripe billing integration (checkout, portal, webhooks)
13. Admin dashboard (metrics, usage)
14. Onboarding flow
15. Landing page

### Week 4: Polish & Launch Prep
16. Testing (unit, integration, E2E)
17. Security review
18. Performance optimization
19. Bug fixes
20. Deploy to staging

---

## Success Criteria for MVP

| Metric | Target |
|--------|--------|
| Time from sign-up to first proposal sent | < 10 minutes |
| AI proposal generation time | < 30 seconds |
| Proposal load time (public viewer) | < 2 seconds |
| Test coverage (business logic) | > 80% |
| Lighthouse score (landing page) | > 90 |
| Zero critical security vulnerabilities | Yes |
