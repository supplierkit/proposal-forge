import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Clock,
  BarChart3,
  Building2,
  Zap,
  Shield,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">ProposalForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <Zap className="h-3.5 w-3.5" />
          AI-Powered Proposal Generation
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Create hotel group proposals<br />in minutes, not hours
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
          ProposalForge helps hotel sales teams generate professional, interactive MICE proposals
          with AI — respond faster, win more group bookings, and track every engagement.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="text-base px-8">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-base px-8">
              See How It Works
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">14-day free trial. No credit card required.</p>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">75%</div>
            <div className="text-sm text-gray-500 mt-1">Faster proposal creation</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">2x</div>
            <div className="text-sm text-gray-500 mt-1">Higher win rates</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">45%</div>
            <div className="text-sm text-gray-500 mt-1">Of hotel RFPs go unanswered</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to win group business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: "AI Proposal Generation",
              description: "Input your lead details and let AI create a complete, personalized proposal with rooms, spaces, catering, and pricing in under 30 seconds.",
            },
            {
              icon: Clock,
              title: "Respond in Minutes",
              description: "First responders win 70% of group business. ProposalForge gets your proposals out before the competition even opens their email.",
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
            <Card key={feature.title} className="border-gray-200">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Start free for 14 days. Upgrade when you&apos;re ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Starter</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$299</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500">For individual properties</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {["Up to 3 properties", "3 team members", "50 proposals/month", "AI proposal generation", "Interactive proposals", "Basic analytics", "Email support"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button variant="outline" className="w-full">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Professional</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$499</span>
                  <span className="text-gray-500">/property/mo</span>
                </div>
                <p className="text-sm text-gray-500">For hotel groups</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {["Up to 20 properties", "10 team members per property", "Unlimited proposals", "AI proposal generation", "Interactive proposals", "Advanced analytics", "Priority support", "Custom branding"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Enterprise</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
                <p className="text-sm text-gray-500">For large chains</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {["Unlimited properties", "Unlimited team members", "Unlimited proposals", "AI proposal generation", "Interactive proposals", "Custom integrations", "SLA guarantee", "Dedicated success manager", "SSO / SAML"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stop losing group bookings to slow proposals
        </h2>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
          Join hotels that are winning more group business with AI-powered proposals.
        </p>
        <Link href="/signup">
          <Button size="lg" className="text-base px-8">Start Your Free Trial</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">ProposalForge</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ProposalForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
