"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { DEMO_LEADS } from "@/lib/demo-data";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lead, setLead] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleGenerateProposal() {
    if (!lead) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/ai/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          property_id: lead.property_id,
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

          <Button
            onClick={handleGenerateProposal}
            disabled={generating}
            className="w-full"
            size="lg"
          >
            <Sparkles className="h-5 w-5" />
            {generating ? "Generating AI Proposal..." : "Generate AI Proposal"}
          </Button>
        </div>

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
