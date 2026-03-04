"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, ExternalLink, Eye, Copy } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProposalStatus } from "@/types/database";

const STATUS_BADGE: Record<ProposalStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  viewed: { label: "Viewed", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "destructive" },
  expired: { label: "Expired", variant: "secondary" },
};

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [proposal, setProposal] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [views, setViews] = useState<any[]>([]);
  const [showSendForm, setShowSendForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [{ data: proposalData }, { data: viewData }] = await Promise.all([
        supabase
          .from("proposals")
          .select("*, properties(name), leads(event_name, contacts(first_name, last_name, email)), proposal_sections(*)")
          .eq("id", params.id)
          .single(),
        supabase
          .from("proposal_views")
          .select("*")
          .eq("proposal_id", params.id as string)
          .order("created_at", { ascending: false }),
      ]);
      setProposal(proposalData);
      setViews(viewData ?? []);
    }
    fetchData();
  }, [params.id, supabase]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSendError(null);

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/v1/proposals/${proposal.id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient_email: formData.get("recipient_email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setSendError(data.error || "Failed to send");
      setSending(false);
      return;
    }

    setShowSendForm(false);
    setSending(false);
    // Refresh proposal data
    const { data } = await supabase
      .from("proposals")
      .select("*, properties(name), leads(event_name, contacts(first_name, last_name, email)), proposal_sections(*)")
      .eq("id", params.id)
      .single();
    setProposal(data);
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/p/${proposal.public_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!proposal) return <div className="text-gray-500">Loading...</div>;

  const status = STATUS_BADGE[proposal.status as ProposalStatus];
  const sections = (proposal.proposal_sections ?? []).sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) => a.sort_order - b.sort_order
  );

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{proposal.title}</h1>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Proposal sections preview */}
          {sections.map((section: { id: string; title: string; type: string }) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {section.type === "cover" ? "Cover page" : "Content configured"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => setShowSendForm(!showSendForm)} className="w-full">
                <Send className="h-4 w-4" />
                Send Proposal
              </Button>
              <a
                href={`/p/${proposal.public_token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Preview
              </a>
              <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </CardContent>
          </Card>

          {/* Send Form */}
          {showSendForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Send Proposal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSend} className="space-y-3">
                  {sendError && (
                    <div className="text-sm text-red-600">{sendError}</div>
                  )}
                  <div className="space-y-1">
                    <Label htmlFor="recipient_email">To</Label>
                    <Input
                      id="recipient_email"
                      name="recipient_email"
                      type="email"
                      defaultValue={proposal.leads?.contacts?.email ?? ""}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      defaultValue={`Proposal: ${proposal.leads?.event_name ?? proposal.title}`}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="message">Message (optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={3}
                      placeholder="Add a personal note..."
                    />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full">
                    {sending ? "Sending..." : "Send"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Property</span>
                <span>{proposal.properties?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Value</span>
                <span className="font-medium">{formatCurrency(proposal.total_value ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>{formatDate(proposal.created_at)}</span>
              </div>
              {proposal.sent_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Sent</span>
                  <span>{formatDate(proposal.sent_at)}</span>
                </div>
              )}
              {proposal.viewed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">First Viewed</span>
                  <span>{formatDate(proposal.viewed_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Views */}
          {views.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Views ({views.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {views.slice(0, 5).map((view) => (
                  <div key={view.id} className="flex justify-between text-gray-500">
                    <span>{formatDate(view.created_at)}</span>
                    {view.total_duration_seconds > 0 && (
                      <span>{view.total_duration_seconds}s</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
