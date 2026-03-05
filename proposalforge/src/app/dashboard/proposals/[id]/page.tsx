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
import {
  ArrowLeft,
  Send,
  ExternalLink,
  Eye,
  Copy,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProposalStatus } from "@/types/database";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { DEMO_PROPOSALS, DEMO_PROPOSAL_VIEWS } from "@/lib/demo-data";
import { DEMO_PLAYBOOK } from "@/lib/demo-agents";

interface ComplianceResult {
  overall_score: number;
  status: "pass" | "warning" | "fail";
  issues: { severity: "error" | "warning" | "info"; category: string; message: string; suggestion: string }[];
  missing_sections: string[];
  pricing_analysis: { within_guardrails: boolean; notes: string };
  brand_compliance: { score: number; notes: string };
  approval_required: boolean;
  approval_reason?: string;
}

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

  // Compliance check state
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [compliance, setCompliance] = useState<ComplianceResult | null>(null);
  const [complianceError, setComplianceError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (AUTH_DISABLED && String(params.id).startsWith("demo-")) {
        const demoProposal = DEMO_PROPOSALS.find((p) => p.id === params.id);
        setProposal(demoProposal ?? null);
        setViews(DEMO_PROPOSAL_VIEWS.filter((v) => v.proposal_id === params.id));
        return;
      }
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

  async function handleComplianceCheck() {
    if (!proposal) return;
    setComplianceLoading(true);
    setComplianceError(null);

    try {
      const res = await fetch("/api/v1/agents/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal_id: proposal.id,
          playbook_id: DEMO_PLAYBOOK.id,
        }),
      });
      const data = await res.json();

      if (data.data?.compliance) {
        setCompliance(data.data.compliance);
      } else {
        setComplianceError("Could not run compliance check.");
      }
    } catch {
      setComplianceError("Failed to run compliance check.");
    }
    setComplianceLoading(false);
  }

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

  if (!proposal) return <div className="text-[#666]">Loading...</div>;

  const status = STATUS_BADGE[proposal.status as ProposalStatus];
  const sections = (proposal.proposal_sections ?? []).sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) => a.sort_order - b.sort_order
  );

  const complianceStatusConfig = {
    pass: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Compliant" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Warnings" },
    fail: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Issues Found" },
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[#888] hover:text-[#444] cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-[22px] font-bold tracking-tight text-[#111] flex-1">{proposal.title}</h1>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Proposal sections preview */}
          {sections.map((section: { id: string; title: string; type: string; content: Record<string, unknown> }) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#666]">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionContent section={section} />
              </CardContent>
            </Card>
          ))}

          {/* Compliance Check — Embedded before Send */}
          <Card className="border-amber-100">
            <CardHeader className="cursor-pointer" onClick={() => { setComplianceOpen(!complianceOpen); if (!compliance && !complianceLoading) handleComplianceCheck(); }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-[15px]">Compliance Check</CardTitle>
                    <p className="text-[12px] text-[#888]">Validate against your selling playbook before sending</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {compliance && (
                    <Badge
                      variant={compliance.status === "pass" ? "success" : compliance.status === "warning" ? "warning" : "destructive"}
                      className="text-[11px]"
                    >
                      {compliance.overall_score}/100
                    </Badge>
                  )}
                  {complianceOpen ? <ChevronUp className="h-4 w-4 text-[#888]" /> : <ChevronDown className="h-4 w-4 text-[#888]" />}
                </div>
              </div>
            </CardHeader>
            {complianceOpen && (
              <CardContent>
                {complianceLoading && (
                  <div className="flex items-center gap-2 py-4 text-[#666]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-[13px]">Checking pricing, sections, brand standards, and approval rules...</span>
                  </div>
                )}
                {complianceError && (
                  <div className="text-[13px] text-[#DC2626] py-2">{complianceError}</div>
                )}
                {compliance && (() => {
                  const cfg = complianceStatusConfig[compliance.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div className="space-y-4">
                      {/* Score summary */}
                      <div className={`flex items-center justify-between rounded-lg ${cfg.bg} p-4`}>
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-6 w-6 ${cfg.color}`} />
                          <div>
                            <p className={`text-[14px] font-semibold ${cfg.color}`}>{cfg.label}</p>
                            <p className="text-[12px] text-[#666]">
                              Score: {compliance.overall_score}/100
                              {compliance.approval_required && " — Manager approval required"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleComplianceCheck(); }}
                          disabled={complianceLoading}
                          className="text-[12px]"
                        >
                          Re-check
                        </Button>
                      </div>

                      {/* Issues list */}
                      {compliance.issues.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-[#888]">Issues</p>
                          {compliance.issues.map((issue, i) => (
                            <div key={i} className={`flex gap-2 rounded-md p-2.5 text-[13px] ${
                              issue.severity === "error" ? "bg-red-50 text-red-800" :
                              issue.severity === "warning" ? "bg-amber-50 text-amber-800" :
                              "bg-blue-50 text-blue-800"
                            }`}>
                              {issue.severity === "error" ? <XCircle className="h-4 w-4 shrink-0 mt-0.5" /> :
                               issue.severity === "warning" ? <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> :
                               <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />}
                              <div>
                                <p className="font-medium">{issue.message}</p>
                                <p className="text-[12px] opacity-80 mt-0.5">{issue.suggestion}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pricing & Brand */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-[#FAFAFA] p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1">Pricing</p>
                          <div className="flex items-center gap-1.5">
                            {compliance.pricing_analysis.within_guardrails ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            )}
                            <span className="text-[12px] text-[#555]">{compliance.pricing_analysis.notes}</span>
                          </div>
                        </div>
                        <div className="rounded-lg bg-[#FAFAFA] p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-[#888] mb-1">Brand</p>
                          <div className="flex items-center gap-1.5">
                            {compliance.brand_compliance.score >= 80 ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            )}
                            <span className="text-[12px] text-[#555]">{compliance.brand_compliance.notes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Approval notice */}
                      {compliance.approval_required && (
                        <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-[13px] text-amber-800">
                            <p className="font-medium">Manager approval required</p>
                            <p className="text-[12px] mt-0.5">{compliance.approval_reason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            )}
          </Card>
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
                {compliance && compliance.status === "pass" && (
                  <CheckCircle2 className="h-3.5 w-3.5 ml-1 text-emerald-300" />
                )}
              </Button>
              <a
                href={`/p/${proposal.public_token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-border bg-white text-sm font-medium text-[#444] hover:bg-[#FAFAFA] transition-colors"
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
                    <div className="text-[14px] text-[#DC2626]">{sendError}</div>
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
                <span className="text-[#666]">Property</span>
                <span>{proposal.properties?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Value</span>
                <span className="font-medium">{formatCurrency(proposal.total_value ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Created</span>
                <span>{formatDate(proposal.created_at)}</span>
              </div>
              {proposal.sent_at && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Sent</span>
                  <span>{formatDate(proposal.sent_at)}</span>
                </div>
              )}
              {proposal.viewed_at && (
                <div className="flex justify-between">
                  <span className="text-[#666]">First Viewed</span>
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
                  <div key={view.id} className="flex justify-between text-[#666]">
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

/* eslint-disable @typescript-eslint/no-explicit-any */
function SectionContent({ section }: { section: { type: string; content: Record<string, any> } }) {
  const c = section.content;

  if (section.type === "cover") {
    if (c.event_name) {
      return (
        <div className="text-sm space-y-1">
          <p className="font-medium text-[#111]">{c.event_name}</p>
          {c.property_name && <p className="text-[#666]">{c.property_name}</p>}
          {c.dates && <p className="text-[#666]">{c.dates}</p>}
          {c.prepared_for && <p className="text-[#888] text-xs">Prepared for {c.prepared_for}</p>}
        </div>
      );
    }
    return <p className="text-sm text-[#444]">Cover page</p>;
  }

  if (section.type === "introduction" && c.text) {
    return <p className="text-sm text-[#444] whitespace-pre-line">{c.text}</p>;
  }

  if ((section.type === "rooms" || section.type === "function_spaces" || section.type === "catering") && c.items) {
    return (
      <div className="text-sm space-y-3">
        {c.summary && <p className="text-[#666]">{c.summary}</p>}
        <div className="space-y-1.5">
          {(c.items as any[]).map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-[#444] py-1 border-b border-[#f4f4f5] last:border-0">
              <span>{item.type || item.space || item.item}{item.setup ? ` \u2014 ${item.setup}` : ""}</span>
              <span className="font-medium">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>
        {c.subtotal && (
          <div className="flex justify-between font-medium text-[#111] pt-1">
            <span>Subtotal</span>
            <span>{formatCurrency(c.subtotal)}</span>
          </div>
        )}
        {c.note && <p className="text-xs text-[#888] italic">{c.note}</p>}
      </div>
    );
  }

  if (section.type === "pricing_summary" && c.line_items) {
    return (
      <div className="text-sm space-y-3">
        <div className="space-y-1.5">
          {(c.line_items as any[]).map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-[#444] py-1 border-b border-[#f4f4f5] last:border-0">
              <span>{item.category}</span>
              <span className="font-medium">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-[#111] text-base pt-2 border-t border-[#e5e5e5]">
          <span>Total</span>
          <span className="text-[#059669]">{formatCurrency(c.grand_total)}</span>
        </div>
        {c.discount && <p className="text-xs text-[#888] italic">{c.discount}</p>}
        {c.note && <p className="text-xs text-[#888]">{c.note}</p>}
      </div>
    );
  }

  if (section.type === "terms" && c.items) {
    return (
      <ul className="text-sm text-[#444] space-y-1 list-disc list-inside">
        {(c.items as string[]).map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p className="text-sm text-[#444]">Content configured</p>;
}
