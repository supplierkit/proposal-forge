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

  if (!lead) return <div className="text-gray-500">Loading...</div>;

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
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{lead.event_name}</h1>
        <Badge variant={statusColors[lead.status] ?? "secondary"}>
          {lead.status.replace("_", " ")}
        </Badge>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Property</span>
                <span>{lead.properties?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="capitalize">{lead.event_type}</span>
              </div>
              {lead.event_start_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Dates</span>
                  <span>
                    {formatDate(lead.event_start_date)}
                    {lead.event_end_date && ` - ${formatDate(lead.event_end_date)}`}
                  </span>
                </div>
              )}
              {lead.estimated_attendees && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Attendees</span>
                  <span>{lead.estimated_attendees}</span>
                </div>
              )}
              {lead.estimated_room_nights && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Room Nights</span>
                  <span>{lead.estimated_room_nights}</span>
                </div>
              )}
              {lead.estimated_value && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Value</span>
                  <span className="font-medium text-green-700">{formatCurrency(lead.estimated_value)}</span>
                </div>
              )}
              {lead.requirements && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-500 block mb-1">Requirements</span>
                  <p className="text-gray-700 whitespace-pre-wrap">{lead.requirements}</p>
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
                  <p className="text-gray-500">{lead.contacts.company_name}</p>
                )}
                {lead.contacts.email && (
                  <p>
                    <Link href={`mailto:${lead.contacts.email}`} className="text-blue-600 hover:underline">
                      {lead.contacts.email}
                    </Link>
                  </p>
                )}
                {lead.contacts.phone && <p className="text-gray-600">{lead.contacts.phone}</p>}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-500">
              <p>Created {formatDate(lead.created_at)}</p>
              {lead.won_at && <p className="text-green-600">Won {formatDate(lead.won_at)}</p>}
              {lead.lost_at && <p className="text-red-600">Lost {formatDate(lead.lost_at)}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
