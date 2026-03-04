import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BarChart3,
  Building2,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { SupplierKitLogo, SupplierKitIcon } from "@/components/ui/supplierkit-logo";

export default function LandingPage() {
  const signInHref = AUTH_DISABLED ? "/dashboard" : "/login";
  const signUpHref = AUTH_DISABLED ? "/dashboard" : "/signup";
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-[#eee]">
        <div className="mx-auto max-w-[1120px] px-6 py-4 flex items-center justify-between">
          <SupplierKitLogo />
          <div className="flex items-center gap-4">
            <Link href="#pricing" className="text-[14px] text-[#666] hover:text-[#111]">
              Pricing
            </Link>
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
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="max-w-[720px]">
            <p className="text-[13px] font-medium uppercase tracking-widest text-primary mb-4">
              AI-Powered Proposal Generation
            </p>
            <h1 className="text-balance text-[28px] font-bold leading-[1.15] tracking-tight text-[#111] md:text-[40px] lg:text-[48px]">
              Create hotel group proposals in minutes, not hours
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#333] md:text-lg">
              SupplierKit helps hotel sales teams generate professional, interactive MICE proposals
              with AI — respond faster, win more group bookings, and track every engagement.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link href={signUpHref}>
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features" className="text-[15px] font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                See How It Works
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-[#888]">14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#FAFAFA] border-y border-[#eee]">
        <div className="mx-auto max-w-[1120px] px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {[
              { number: "75%", label: "Faster proposal creation" },
              { number: "2x", label: "Higher win rates" },
              { number: "45%", label: "Of hotel RFPs go unanswered" },
              { number: "30s", label: "Average generation time" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-[#111] md:text-3xl">{stat.number}</p>
                <p className="mt-1 text-[13px] leading-snug text-[#888]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-24">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">What you get</p>
            <h2 className="mx-auto mt-4 max-w-[680px] text-balance text-[22px] font-bold leading-[1.25] tracking-tight text-[#111] md:text-[28px]">
              Everything you need to win group business
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI Proposal Generation",
                description: "Input your lead details and let AI create a complete, personalized proposal with rooms, spaces, catering, and pricing in under 30 seconds.",
              },
              {
                icon: Clock,
                title: "Respond in Minutes",
                description: "First responders win 70% of group business. SupplierKit gets your proposals out before the competition even opens their email.",
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description: "Know exactly when prospects view your proposal, which sections they spend time on, and when they're ready to decide.",
              },
              {
                icon: Building2,
                title: "Multi-Property Support",
                description: "Manage proposals across your entire hotel portfolio. Share templates, track performance, and maintain brand consistency.",
              },
              {
                icon: Zap,
                title: "Interactive Proposals",
                description: "Replace static PDFs with beautiful, interactive web proposals. Prospects can accept or decline with one click.",
              },
              {
                icon: Shield,
                title: "Built-in CRM",
                description: "Track your entire pipeline from inquiry to booking. Kanban board, activity logging, and revenue forecasting included.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-md border border-[#eee] bg-white p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#059669]/10 mb-4">
                  <feature.icon className="h-5 w-5 text-[#059669]" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#111]">{feature.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#444]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-y border-[#eee] py-12 md:py-16">
        <div className="mx-auto max-w-[1120px] px-6">
          <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-widest text-[#888]">
            Works alongside your existing systems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-14">
            {["Opera PMS", "Mews", "Cloudbeds", "SiteMinder", "Amadeus", "Sabre"].map((name) => (
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
              Start free for 14 days. Upgrade when you&apos;re ready.
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
              <p className="mt-4 text-[15px] leading-relaxed text-[#444]">For individual hotels and small operators.</p>
              <div className="mt-5 border-t border-[#f0f0f0] pt-5">
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#888]">Includes</p>
                <ul className="space-y-2 text-[14px] text-[#444]">
                  {["Up to 3 properties", "3 team members", "50 proposals/month", "AI proposal generation", "Interactive proposals", "Basic analytics", "Email support"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />
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
            <div className="flex flex-col rounded-md border border-primary bg-white p-8 shadow-md">
              <p className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Professional</p>
              <h3 className="mt-3 text-[20px] font-bold text-[#111]">Hotel Group</h3>
              <p className="mt-2 text-[32px] font-bold text-primary">
                $1,499<span className="text-[16px] font-normal text-[#666]"> / month</span>
              </p>
              <p className="mt-1 text-[14px] text-[#666]">Billed annually at $17,988</p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#444]">For hotel groups with 5-20 properties.</p>
              <div className="mt-5 border-t border-[#f0f0f0] pt-5">
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#888]">Includes</p>
                <ul className="space-y-2 text-[14px] text-[#444]">
                  {["Everything in Starter", "Up to 20 properties", "10 team members", "Unlimited proposals", "Advanced analytics", "Priority support", "Custom branding", "PMS integrations"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />
                      {f}
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
              <p className="mt-4 text-[15px] leading-relaxed text-[#444]">For large chains with 20+ properties.</p>
              <div className="mt-5 border-t border-[#f0f0f0] pt-5">
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#888]">Includes</p>
                <ul className="space-y-2 text-[14px] text-[#444]">
                  {["Everything in Professional", "Unlimited properties", "Unlimited team members", "Custom integrations", "Dedicated support", "SLA guarantee", "SSO & SAML"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />
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
            Stop losing group bookings to slow proposals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#444]">
            Join hotels that are winning more group business with AI-powered proposals.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href={signUpHref}>
              <Button size="lg">Start Your Free Trial</Button>
            </Link>
            <p className="text-[13px] text-[#888]">14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eee] bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1120px] px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-semibold text-[#111]">SupplierKit</span>
            <SupplierKitIcon className="h-4 w-4 -mt-0.5" />
          </div>
          <p className="text-[12px] text-[#888]">
            &copy; {new Date().getFullYear()} SupplierKit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
