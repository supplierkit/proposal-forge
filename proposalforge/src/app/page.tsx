import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BarChart3,
  Building2,
  Zap,
  Shield,
  Sparkles,
  FileSearch,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  ClipboardCheck,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Bot,
  ChevronRight,
} from "lucide-react";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { SupplierKitLogo, SupplierKitIcon } from "@/components/ui/supplierkit-logo";

export default function LandingPage() {
  const signInHref = AUTH_DISABLED ? "/dashboard" : "/login";
  const signUpHref = AUTH_DISABLED ? "/dashboard" : "/signup";
  const demoHref = AUTH_DISABLED ? "/dashboard/agents" : "/signup";

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-[#eee] sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="mx-auto max-w-[1120px] px-6 py-4 flex items-center justify-between">
          <SupplierKitLogo />
          <div className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-[14px] text-[#666] hover:text-[#111] transition-colors">
              How It Works
            </Link>
            <Link href="#agents" className="text-[14px] text-[#666] hover:text-[#111] transition-colors">
              AI Agents
            </Link>
            <Link href="#features" className="text-[14px] text-[#666] hover:text-[#111] transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-[14px] text-[#666] hover:text-[#111] transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href={signInHref}>
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href={signUpHref}>
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 mb-6">
              <Bot className="h-3.5 w-3.5 text-primary" />
              <span className="text-[13px] font-medium text-primary">AI-Powered Proposal Lifecycle Management</span>
            </div>
            <h1 className="text-balance text-[28px] font-bold leading-[1.12] tracking-tight text-[#111] md:text-[40px] lg:text-[52px]">
              From RFP to delivery.{" "}
              <span className="text-primary">Every step, automated.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#444] md:text-[18px]">
              SupplierKit gives hotel sales teams purpose-built AI agents that extract RFPs,
              recommend pricing, generate proposals, enforce brand standards, and track
              delivery obligations — so you close more group business, faster.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
              <Link href={signUpHref}>
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={demoHref}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <Bot className="h-4 w-4" />
                  See AI Agents in Action
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-[#888]">14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#FAFAFA] border-y border-[#eee]">
        <div className="mx-auto max-w-[1120px] px-6 py-10 md:py-14">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
            {[
              { number: "90%", label: "Faster RFP-to-proposal time" },
              { number: "2.3x", label: "Higher win rates with AI pricing" },
              { number: "45%", label: "Of hotel RFPs go unanswered" },
              { number: "99%", label: "Obligation compliance rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-[#111] md:text-3xl">{stat.number}</p>
                <p className="mt-1 text-[13px] leading-snug text-[#888]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — The Lifecycle */}
      <section id="how-it-works" className="py-20 md:py-24">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">How it works</p>
            <h2 className="mx-auto mt-4 max-w-[680px] text-balance text-[22px] font-bold leading-[1.25] tracking-tight text-[#111] md:text-[28px]">
              Four AI agents. One complete workflow.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] text-[#666]">
              From the moment an RFP arrives to the day you deliver the event — SupplierKit automates every step.
            </p>
          </div>
          <div className="mt-14 grid gap-0 md:grid-cols-4">
            {[
              {
                step: "01",
                icon: FileSearch,
                title: "Intake",
                description: "Paste an RFP, forward an email, or import from Cvent. Our AI agent extracts every requirement — event details, room blocks, catering needs, AV requests — and auto-creates your lead.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                step: "02",
                icon: TrendingUp,
                title: "Price",
                description: "The Pricing Agent analyzes your historical win/loss data, applies seasonal rules, and recommends the optimal rate — maximizing win probability while protecting margin.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Propose",
                description: "Generate a complete, branded proposal in seconds. The Compliance Agent validates it against your playbook — pricing guardrails, required sections, and approval rules — before it goes out.",
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
              {
                step: "04",
                icon: ClipboardCheck,
                title: "Deliver",
                description: "When the client accepts, every promise becomes a tracked obligation. Room blocks, catering, AV — all monitored with due dates, progress bars, and alerts so nothing falls through.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative p-6 md:p-8">
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 right-0 translate-x-1/2 z-10">
                    <ChevronRight className="h-5 w-5 text-[#ccc]" />
                  </div>
                )}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-[#ccc] uppercase tracking-wider">Step {item.step}</span>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg} mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="text-[17px] font-semibold text-[#111]">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#555]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Showcase */}
      <section id="agents" className="bg-[#FAFAFA] border-y border-[#eee] py-20 md:py-24">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 mb-4">
              <Bot className="h-3.5 w-3.5 text-primary" />
              <span className="text-[13px] font-medium text-primary">Purpose-Built AI Agents</span>
            </div>
            <h2 className="mx-auto mt-2 max-w-[680px] text-balance text-[22px] font-bold leading-[1.25] tracking-tight text-[#111] md:text-[28px]">
              Not a chatbot. Not a copilot.{" "}
              <span className="text-primary">Expert-grade agents.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] text-[#666]">
              Each agent is a specialist trained on hotel group sales workflows — processing RFPs, optimizing pricing, enforcing standards, and answering questions about your pipeline.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* RFP Intake Agent */}
            <div className="rounded-lg border border-[#eee] bg-white p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <FileSearch className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#111]">RFP Intake Agent</h3>
                  <p className="mt-1 text-[13px] text-[#888]">Document intelligence for hotel RFPs</p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[#555]">
                Paste any RFP — an email, a PDF, a Cvent export — and the Intake Agent extracts structured
                requirements in seconds. Event name, dates, attendees, room blocks, meeting space needs,
                catering requirements, competing venues, and budget signals. It auto-creates your lead and
                contact record, so your team can respond instantly.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Auto-create leads", "Extract 20+ fields", "85%+ accuracy", "Any format"].map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-medium text-blue-700">{tag}</span>
                ))}
              </div>
            </div>

            {/* Pricing Intelligence Agent */}
            <div className="rounded-lg border border-[#eee] bg-white p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#111]">Pricing Intelligence Agent</h3>
                  <p className="mt-1 text-[13px] text-[#888]">Revenue optimization for group sales</p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[#555]">
                Analyzes your historical wins and losses, seasonal patterns, and playbook guardrails to recommend
                the optimal pricing for every deal. Identifies similar past deals, calculates win probability,
                and flags when you&apos;re leaving money on the table — or pricing yourself out.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Win probability", "Historical analysis", "Seasonal rules", "Rate guardrails"].map((tag) => (
                  <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700">{tag}</span>
                ))}
              </div>
            </div>

            {/* Compliance Agent */}
            <div className="rounded-lg border border-[#eee] bg-white p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <ShieldCheck className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#111]">Compliance Agent</h3>
                  <p className="mt-1 text-[13px] text-[#888]">Brand standards enforcement</p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[#555]">
                Before any proposal goes out, the Compliance Agent validates it against your playbook.
                Checks pricing falls within approved discount bands, all required sections are present,
                brand tone guidelines are followed, prohibited terms are avoided, and approval thresholds
                are respected. Catches issues before your client does.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Playbook validation", "Pricing bands", "Brand tone", "Auto-approval rules"].map((tag) => (
                  <span key={tag} className="rounded-full bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-700">{tag}</span>
                ))}
              </div>
            </div>

            {/* AskSupplierKit */}
            <div className="rounded-lg border border-[#eee] bg-white p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <MessageSquare className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#111]">AskSupplierKit</h3>
                  <p className="mt-1 text-[13px] text-[#888]">Conversational proposal intelligence</p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[#555]">
                Ask anything about your pipeline in plain English. &quot;What&apos;s our win rate this quarter?&quot;
                &quot;Which deals are at risk?&quot; &quot;What pricing worked for similar conferences?&quot;
                AskSupplierKit has full context across your proposals, leads, properties, and obligations —
                giving your sales team instant, data-driven answers.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Natural language", "Pipeline insights", "Revenue analytics", "Action suggestions"].map((tag) => (
                  <span key={tag} className="rounded-full bg-violet-50 px-3 py-1 text-[12px] font-medium text-violet-700">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 md:py-24">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Platform features</p>
            <h2 className="mx-auto mt-4 max-w-[680px] text-balance text-[22px] font-bold leading-[1.25] tracking-tight text-[#111] md:text-[28px]">
              Everything you need to manage group sales
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI Proposal Generation",
                description: "Input lead details, get a complete branded proposal with rooms, spaces, catering, and pricing in under 30 seconds.",
              },
              {
                icon: Clock,
                title: "Respond in Minutes",
                description: "First responders win 70% of group business. Get proposals out before the competition opens their email.",
              },
              {
                icon: BarChart3,
                title: "Engagement Analytics",
                description: "Know when prospects view your proposal, which sections they spend time on, and when they're ready to decide.",
              },
              {
                icon: Building2,
                title: "Multi-Property Portfolio",
                description: "Manage proposals across your entire hotel group. Share playbooks, track performance, maintain brand consistency.",
              },
              {
                icon: Zap,
                title: "Interactive Proposals",
                description: "Replace static PDFs with beautiful, trackable web proposals. Clients can accept or decline with one click.",
              },
              {
                icon: BookOpen,
                title: "Playbook System",
                description: "Define selling standards, pricing guardrails, required sections, and seasonal rules. AI agents enforce them automatically.",
              },
              {
                icon: Shield,
                title: "Pipeline CRM",
                description: "Track your entire pipeline from RFP intake to booking. Kanban board, activity logging, and revenue forecasting.",
              },
              {
                icon: ClipboardCheck,
                title: "Obligation Tracking",
                description: "Every accepted proposal becomes tracked obligations — room blocks, catering, AV. Monitor delivery with alerts.",
              },
              {
                icon: Bot,
                title: "Agent Audit Trail",
                description: "Every AI agent action is logged with inputs, outputs, duration, and confidence scores. Full transparency.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-md border border-[#eee] bg-white p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#111]">{feature.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#444]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / ROI Section */}
      <section className="bg-[#111] text-white py-20 md:py-24">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Why SupplierKit</p>
            <h2 className="mx-auto mt-4 max-w-[680px] text-balance text-[22px] font-bold leading-[1.25] tracking-tight md:text-[28px]">
              The numbers speak for themselves
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-[48px] font-bold text-primary md:text-[56px]">75%</p>
              <p className="mt-2 text-[16px] font-medium">Faster proposal turnaround</p>
              <p className="mt-2 text-[14px] text-[#999] leading-relaxed">
                Hotels using AI proposal automation reduce response time from days to minutes.
                First responders win 70% of group business.
              </p>
            </div>
            <div className="text-center">
              <p className="text-[48px] font-bold text-primary md:text-[56px]">$2.1M</p>
              <p className="mt-2 text-[16px] font-medium">Average annual revenue impact</p>
              <p className="mt-2 text-[14px] text-[#999] leading-relaxed">
                Mid-market hotel groups (10-20 properties) capture an additional $2.1M in group revenue
                by responding to RFPs they previously couldn&apos;t resource.
              </p>
            </div>
            <div className="text-center">
              <p className="text-[48px] font-bold text-primary md:text-[56px]">45%</p>
              <p className="mt-2 text-[16px] font-medium">Of RFPs go unanswered</p>
              <p className="mt-2 text-[14px] text-[#999] leading-relaxed">
                Nearly half of hotel RFPs receive no response due to sales team capacity constraints.
                Every unanswered RFP is lost revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-b border-[#eee] py-12 md:py-16">
        <div className="mx-auto max-w-[1120px] px-6">
          <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-widest text-[#888]">
            Works alongside your existing systems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-14">
            {["Opera PMS", "Mews", "Cloudbeds", "SiteMinder", "Amadeus", "Sabre", "Cvent", "Salesforce"].map((name) => (
              <span key={name} className="whitespace-nowrap text-base font-semibold text-[#bbb]">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1120px] px-6 py-20 md:py-24">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Pricing</p>
            <h2 className="mt-4 text-[22px] font-bold leading-[1.25] tracking-tight text-[#111] md:text-[28px]">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-base text-[#444]">
              Start free for 14 days. Upgrade when you&apos;re ready. All plans include AI agents.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Starter */}
            <div className="flex flex-col rounded-md border border-[#eee] bg-white p-8">
              <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Starter</p>
              <h3 className="mt-3 text-[20px] font-bold text-[#111]">Single Property</h3>
              <p className="mt-2 text-[32px] font-bold text-primary">
                $499<span className="text-[16px] font-normal text-[#666]"> / month</span>
              </p>
              <p className="mt-1 text-[14px] text-[#666]">Billed annually at $5,988</p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#444]">For individual hotels and small operators getting started with AI.</p>
              <div className="mt-5 border-t border-[#f0f0f0] pt-5">
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#888]">Includes</p>
                <ul className="space-y-2 text-[14px] text-[#444]">
                  {[
                    "Up to 3 properties",
                    "3 team members",
                    "50 proposals / month",
                    "AI proposal generation",
                    "RFP Intake Agent",
                    "Interactive proposals",
                    "Basic analytics",
                    "Email support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Link href={signUpHref} className="block">
                  <Button variant="outline" className="w-full">Start Free Trial</Button>
                </Link>
              </div>
            </div>

            {/* Professional — highlighted */}
            <div className="flex flex-col rounded-md border-2 border-primary bg-white p-8 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1">
                <span className="text-[12px] font-semibold text-white">Most Popular</span>
              </div>
              <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Professional</p>
              <h3 className="mt-3 text-[20px] font-bold text-[#111]">Hotel Group</h3>
              <p className="mt-2 text-[32px] font-bold text-primary">
                $1,499<span className="text-[16px] font-normal text-[#666]"> / month</span>
              </p>
              <p className="mt-1 text-[14px] text-[#666]">Billed annually at $17,988</p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#444]">For hotel groups running a serious group sales operation.</p>
              <div className="mt-5 border-t border-[#f0f0f0] pt-5">
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#888]">Everything in Starter, plus</p>
                <ul className="space-y-2 text-[14px] text-[#444]">
                  {[
                    "Up to 20 properties",
                    "10 team members",
                    "Unlimited proposals",
                    "All 4 AI Agents",
                    "Pricing Intelligence Agent",
                    "Compliance Agent + Playbooks",
                    "Obligation Tracking",
                    "AskSupplierKit (chat AI)",
                    "Advanced analytics",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Link href={signUpHref} className="block">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </div>
            </div>

            {/* Enterprise */}
            <div className="flex flex-col rounded-md border border-[#eee] bg-white p-8">
              <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Enterprise</p>
              <h3 className="mt-3 text-[20px] font-bold text-[#111]">Chain &amp; Portfolio</h3>
              <p className="mt-2 text-[32px] font-bold text-primary">
                $3,999<span className="text-[16px] font-normal text-[#666]"> / month</span>
              </p>
              <p className="mt-1 text-[14px] text-[#666]">Billed annually at $47,988</p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#444]">For large chains with complex requirements and custom workflows.</p>
              <div className="mt-5 border-t border-[#f0f0f0] pt-5">
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#888]">Everything in Professional, plus</p>
                <ul className="space-y-2 text-[14px] text-[#444]">
                  {[
                    "Unlimited properties",
                    "Unlimited team members",
                    "Custom AI agent training",
                    "PMS / CRM integrations",
                    "Multi-playbook support",
                    "Custom branding",
                    "Dedicated support + SLA",
                    "SSO & SAML",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Link href={signUpHref} className="block">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1120px] px-6 text-center">
          <h2 className="mx-auto max-w-[720px] text-balance text-[22px] font-bold tracking-tight text-[#111] md:text-[28px] lg:text-[32px]">
            Stop losing group bookings to slow, manual processes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#444]">
            Join hotel sales teams automating their entire proposal lifecycle with AI agents — from RFP intake to delivery tracking.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4">
            <Link href={signUpHref}>
              <Button size="lg" className="gap-2">
                Start Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={demoHref}>
              <Button variant="outline" size="lg" className="gap-2">
                <Bot className="h-4 w-4" />
                See AI Agents Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-[#888]">14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eee] bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1120px] px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[15px] font-semibold text-[#111]">SupplierKit</span>
                <SupplierKitIcon className="h-4 w-4 -mt-0.5" />
              </div>
              <p className="text-[13px] text-[#888] leading-relaxed">
                AI-powered proposal lifecycle management for hotel group sales teams.
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#888] mb-3">Product</p>
              <ul className="space-y-2">
                {[
                  { label: "AI Agents", href: "#agents" },
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How It Works", href: "#how-it-works" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[14px] text-[#666] hover:text-[#111]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#888] mb-3">Agents</p>
              <ul className="space-y-2">
                {["RFP Intake", "Pricing Intelligence", "Compliance Check", "AskSupplierKit"].map((agent) => (
                  <li key={agent}>
                    <Link href="#agents" className="text-[14px] text-[#666] hover:text-[#111]">{agent}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#888] mb-3">Company</p>
              <ul className="space-y-2">
                {["About", "Blog", "Contact", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <span className="text-[14px] text-[#666]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[#eee] pt-6 flex items-center justify-between">
            <p className="text-[12px] text-[#888]">
              &copy; {new Date().getFullYear()} SupplierKit. All rights reserved.
            </p>
            <p className="text-[12px] text-[#888]">
              Built for hotels that exhibit at ITB Berlin
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
