"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowLeft,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { DEMO_LEADS, DEMO_PROPERTY } from "@/lib/demo-data";

interface PricingRecommendation {
  recommended_total: number;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  win_probability: number;
  room_pricing: { item: string; recommended_rate: number; reasoning: string }[];
  space_pricing: { item: string; recommended_rate: number; reasoning: string }[];
  catering_pricing: { item: string; recommended_rate: number; reasoning: string }[];
  competitive_position: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lead, setLead] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pricing intelligence state
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingRecommendation | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLead() {
      if (AUTH_DISABLED && String(params.id).startsWith("demo-")) {
        const demoLead = DEMO_LEADS.find((l) => l.id === params.id);
        setLead(demoLead ?? null);
        return;
      }
      const { data } = await supabase
        .from("leads")
        .select("*, properties(name), contacts(first_name, last_name, email, company_name, phone)")
        .eq("id", params.id)
        .single();
      setLead(data);
    }
    fetchLead();
  }, [params.id, supabase]);

  async function handleGetPricing() {
    if (!lead) return;
    setPricingLoading(true);
    setPricingError(null);

    try {
      const res = await fetch("/api/v1/agents/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          property_id: lead.property_id,
        }),
      });
      const data = await res.json();

      if (data.data?.pricing) {
        setPricing(data.data.pricing);
      } else {
        setPricingError("Could not generate pricing recommendation.");
      }
    } catch {
      setPricingError("Failed to get pricing recommendation.");
    }
    setPricingLoading(false);
  }

  async function handleGenerateProposal() {
    if (!lead) return;
    setGenerating(true);
    setError(null);

    try {
      const customInstructions = pricing
        ? `Use the following recommended pricing: Total: $${pricing.recommended_total}. ${pricing.reasoning}`
        : undefined;

      const res = await fetch("/api/v1/ai/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          property_id: lead.property_id,
          custom_instructions: customInstructions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate proposal");
        setGenerating(false);
        return;
      }

      router.push(`/dashboard/proposals/${data.data.proposalId}`);
    } catch {
      setError("Failed to generate proposal. Please try again.");
      setGenerating(false);
    }
  }

  if (!lead) return <div className="text-[#666]">Loading...</div>;

  const statusColors: Record<string, "default" | "warning" | "success" | "destructive" | "secondary"> = {
    new: "default",
    qualified: "warning",
    proposal_sent: "secondary",
    negotiating: "warning",
    won: "success",
    lost: "destructive",
  };

  const confidenceColors = {
    high: "text-emerald-600",
    medium: "text-amber-600",
    low: "text-red-600",
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[#888] hover:text-[#444] cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-[22px] font-bold tracking-tight text-[#111]">{lead.event_name}</h1>
        <Badge variant={statusColors[lead.status] ?? "secondary"}>
          {lead.status.replace("_", " ")}
        </Badge>
      </div>

      {error && (
        <div className="rounded-md bg-[#DC2626]/10 p-3 text-sm text-[#DC2626] mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#666]">Property</span>
                <span>{lead.properties?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Type</span>
                <span className="capitalize">{lead.event_type}</span>
              </div>
              {lead.event_start_date && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Dates</span>
                  <span>
                    {formatDate(lead.event_start_date)}
                    {lead.event_end_date && ` - ${formatDate(lead.event_end_date)}`}
                  </span>
                </div>
              )}
              {lead.estimated_attendees && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Attendees</span>
                  <span>{lead.estimated_attendees}</span>
                </div>
              )}
              {lead.estimated_room_nights && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Room Nights</span>
                  <span>{lead.estimated_room_nights}</span>
                </div>
              )}
              {lead.estimated_value && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Estimated Value</span>
                  <span className="font-medium text-[#059669]">{formatCurrency(lead.estimated_value)}</span>
                </div>
              )}
              {lead.requirements && (
                <div className="pt-2 border-t border-[#f0f0f0]">
                  <span className="text-[#666] block mb-1">Requirements</span>
                  <p className="text-[#444] whitespace-pre-wrap">{lead.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Intelligence — Embedded in Workflow */}
          <Card className="border-emerald-100">
            <CardHeader className="cursor-pointer" onClick={() => { setPricingOpen(!pricingOpen); if (!pricing && !pricingLoading) handleGetPricing(); }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-[15px]">Pricing Recommendation</CardTitle>
                    <p className="text-[12px] text-[#888]">AI-powered optimal pricing for this deal</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pricing && (
                    <Badge variant="success" className="text-[11px]">
                      {pricing.win_probability}% win probability
                    </Badge>
                  )}
                  {pricingOpen ? <ChevronUp className="h-4 w-4 text-[#888]" /> : <ChevronDown className="h-4 w-4 text-[#888]" />}
                </div>
              </div>
            </CardHeader>
            {pricingOpen && (
              <CardContent>
                {pricingLoading && (
                  <div className="flex items-center gap-2 py-4 text-[#666]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-[13px]">Analyzing historical data and seasonal patterns...</span>
                  </div>
                )}
                {pricingError && (
                  <div className="text-[13px] text-[#DC2626] py-2">{pricingError}</div>
                )}
                {pricing && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">
                      <div>
                        <p className="text-[12px] text-emerald-600 font-medium">Recommended Total</p>
                        <p className="text-[24px] font-bold text-emerald-700">
                          {formatCurrency(pricing.recommended_total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] text-[#888]">Confidence</p>
                        <p className={`text-[14px] font-semibold capitalize ${confidenceColors[pricing.confidence]}`}>
                          {pricing.confidence}
                        </p>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="flex gap-2 rounded-lg bg-[#FAFAFA] p-3">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-[13px] text-[#555]">{pricing.reasoning}</p>
                    </div>

                    {/* Rate Breakdown */}
                    {pricing.room_pricing.length > 0 && (
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[#888] mb-2">Room Rates</p>
                        {pricing.room_pricing.map((r, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 text-[13px] border-b border-[#f4f4f5] last:border-0">
                            <span className="text-[#444]">{r.item}</span>
                            <span className="font-medium">{formatCurrency(r.recommended_rate)}/night</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Competitive Position */}
                    <p className="text-[12px] text-[#888]">{pricing.competitive_position}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Generate Proposal — Primary CTA */}
          <Button
            onClick={handleGenerateProposal}
            disabled={generating}
            className="w-full"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating AI Proposal...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate AI Proposal
                {pricing && (
                  <span className="ml-2 text-[12px] opacity-80">
                    (using recommended pricing)
                  </span>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {lead.contacts && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">
                  {lead.contacts.first_name} {lead.contacts.last_name}
                </p>
                {lead.contacts.company_name && (
                  <p className="text-[#666]">{lead.contacts.company_name}</p>
                )}
                {lead.contacts.email && (
                  <p>
                    <Link href={`mailto:${lead.contacts.email}`} className="text-primary hover:underline">
                      {lead.contacts.email}
                    </Link>
                  </p>
                )}
                {lead.contacts.phone && <p className="text-[#444]">{lead.contacts.phone}</p>}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#666]">
              <p>Created {formatDate(lead.created_at)}</p>
              {lead.won_at && <p className="text-[#059669]">Won {formatDate(lead.won_at)}</p>}
              {lead.lost_at && <p className="text-[#DC2626]">Lost {formatDate(lead.lost_at)}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
