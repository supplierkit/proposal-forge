"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileSearch,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DEMO_LEADS, DEMO_PROPOSALS, DEMO_PROPERTY } from "@/lib/demo-data";
import {
  DEMO_AGENT_RUNS,
  DEMO_PLAYBOOK,
  DEMO_RFP_TEXT,
} from "@/lib/demo-agents";

type AgentTab = "overview" | "rfp_intake" | "pricing" | "compliance";

const agentCards = [
  {
    id: "rfp_intake" as const,
    name: "RFP Intake",
    description: "Paste or upload an RFP to extract structured requirements, auto-create leads, and identify key event details.",
    icon: FileSearch,
    color: "text-blue-600",
    bg: "bg-blue-50",
    stats: { label: "RFPs processed", value: "12" },
  },
  {
    id: "pricing" as const,
    name: "Pricing Intelligence",
    description: "Analyze historical win/loss data and seasonal patterns to recommend optimal pricing for any lead.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    stats: { label: "Avg win probability", value: "73%" },
  },
  {
    id: "compliance" as const,
    name: "Compliance Check",
    description: "Validate proposals against your playbook — pricing guardrails, required sections, brand standards, and approval rules.",
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
    stats: { label: "Compliance rate", value: "94%" },
  },
];

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState<AgentTab>("overview");
  const [rfpText, setRfpText] = useState(DEMO_RFP_TEXT);
  const [isRunning, setIsRunning] = useState(false);
  const [rfpResult, setRfpResult] = useState<Record<string, unknown> | null>(null);
  const [pricingResult, setPricingResult] = useState<Record<string, unknown> | null>(null);
  const [complianceResult, setComplianceResult] = useState<Record<string, unknown> | null>(null);

  async function handleRfpIntake() {
    setIsRunning(true);
    setRfpResult(null);
    try {
      const res = await fetch("/api/v1/agents/rfp-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: rfpText,
          source: "manual",
          property_id: DEMO_PROPERTY.id,
        }),
      });
      const data = await res.json();
      setRfpResult(data.data?.extraction ?? data.error);
    } catch {
      setRfpResult({ error: "Failed to process RFP" });
    }
    setIsRunning(false);
  }

  async function handlePricing() {
    setIsRunning(true);
    setPricingResult(null);
    try {
      const res = await fetch("/api/v1/agents/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: DEMO_LEADS[1].id,
          property_id: DEMO_PROPERTY.id,
        }),
      });
      const data = await res.json();
      setPricingResult(data.data?.pricing ?? data.error);
    } catch {
      setPricingResult({ error: "Failed to generate pricing" });
    }
    setIsRunning(false);
  }

  async function handleCompliance() {
    setIsRunning(true);
    setComplianceResult(null);
    try {
      const res = await fetch("/api/v1/agents/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal_id: DEMO_PROPOSALS[1].id,
          playbook_id: DEMO_PLAYBOOK.id,
        }),
      });
      const data = await res.json();
      setComplianceResult(data.data?.compliance ?? data.error);
    } catch {
      setComplianceResult({ error: "Failed to run compliance check" });
    }
    setIsRunning(false);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-[22px] font-bold tracking-tight text-[#111] md:text-[28px]">
              AI Agents
            </h1>
          </div>
          <p className="text-[#666] mt-1">
            Purpose-built AI specialists for every stage of the proposal lifecycle.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Powered by Claude
        </Badge>
      </div>

      {/* Agent Cards */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
            {agentCards.map((agent) => (
              <Card
                key={agent.id}
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setActiveTab(agent.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${agent.bg}`}>
                      <agent.icon className={`h-5 w-5 ${agent.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#999]" />
                  </div>
                  <CardTitle className="text-[15px] font-semibold text-[#111] mt-3">
                    {agent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[13px] text-[#666] mb-3">{agent.description}</p>
                  <div className="flex items-center gap-1 text-[12px] text-[#888]">
                    <span className="font-medium text-[#111]">{agent.stats.value}</span>
                    <span>{agent.stats.label}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Agent Runs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">
                Recent Agent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_AGENT_RUNS.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#FAFAFA]"
                  >
                    <div className="flex items-center gap-3">
                      {run.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : run.status === "failed" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#111]">{run.label}</p>
                        <p className="text-xs text-[#666]">{run.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {run.duration_ms && (
                        <span className="flex items-center gap-1 text-xs text-[#888]">
                          <Clock className="h-3 w-3" />
                          {(run.duration_ms / 1000).toFixed(1)}s
                        </span>
                      )}
                      <Badge
                        variant={
                          run.status === "completed" ? "success" : run.status === "failed" ? "destructive" : "default"
                        }
                      >
                        {run.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* RFP Intake Agent */}
      {activeTab === "rfp_intake" && (
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("overview")}>
            Back to Agents
          </Button>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <FileSearch className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-[16px]">RFP Intake Agent</CardTitle>
                  <p className="text-[13px] text-[#666]">Paste an RFP, email, or event inquiry to extract structured requirements</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={rfpText}
                onChange={(e) => setRfpText(e.target.value)}
                rows={10}
                placeholder="Paste your RFP text here..."
                className="font-mono text-[13px]"
              />
              <Button onClick={handleRfpIntake} disabled={isRunning || !rfpText.trim()}>
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
                {isRunning ? "Processing..." : "Extract Requirements"}
              </Button>
              {rfpResult && (
                <Card className="bg-[#FAFAFA]">
                  <CardHeader>
                    <CardTitle className="text-[14px]">Extraction Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-[12px] text-[#333] whitespace-pre-wrap overflow-auto max-h-[400px]">
                      {JSON.stringify(rfpResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pricing Intelligence Agent */}
      {activeTab === "pricing" && (
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("overview")}>
            Back to Agents
          </Button>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-[16px]">Pricing Intelligence Agent</CardTitle>
                  <p className="text-[13px] text-[#666]">
                    Analyzing: <span className="font-medium">{DEMO_LEADS[1].event_name}</span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg bg-[#FAFAFA] p-3">
                  <p className="text-[#888] text-xs">Attendees</p>
                  <p className="font-semibold text-[#111]">{DEMO_LEADS[1].estimated_attendees}</p>
                </div>
                <div className="rounded-lg bg-[#FAFAFA] p-3">
                  <p className="text-[#888] text-xs">Room Nights</p>
                  <p className="font-semibold text-[#111]">{DEMO_LEADS[1].estimated_room_nights}</p>
                </div>
                <div className="rounded-lg bg-[#FAFAFA] p-3">
                  <p className="text-[#888] text-xs">Current Estimate</p>
                  <p className="font-semibold text-[#111]">${DEMO_LEADS[1].estimated_value?.toLocaleString()}</p>
                </div>
              </div>
              <Button onClick={handlePricing} disabled={isRunning}>
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                {isRunning ? "Analyzing..." : "Get Pricing Recommendation"}
              </Button>
              {pricingResult && (
                <Card className="bg-[#FAFAFA]">
                  <CardHeader>
                    <CardTitle className="text-[14px]">Pricing Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-[12px] text-[#333] whitespace-pre-wrap overflow-auto max-h-[400px]">
                      {JSON.stringify(pricingResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Agent */}
      {activeTab === "compliance" && (
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("overview")}>
            Back to Agents
          </Button>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-[16px]">Compliance Agent</CardTitle>
                  <p className="text-[13px] text-[#666]">
                    Checking: <span className="font-medium">{DEMO_PROPOSALS[1].title}</span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-medium text-amber-800">Playbook: {DEMO_PLAYBOOK.name}</p>
                <p className="text-amber-700 text-xs mt-1">
                  Max discount: {DEMO_PLAYBOOK.max_group_discount_pct}% | Min room block: {DEMO_PLAYBOOK.min_room_block_nights} nights | Approval required above: ${DEMO_PLAYBOOK.require_manager_above?.toLocaleString()}
                </p>
              </div>
              <Button onClick={handleCompliance} disabled={isRunning}>
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                {isRunning ? "Checking..." : "Run Compliance Check"}
              </Button>
              {complianceResult && (
                <Card className="bg-[#FAFAFA]">
                  <CardHeader>
                    <CardTitle className="text-[14px]">Compliance Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-[12px] text-[#333] whitespace-pre-wrap overflow-auto max-h-[400px]">
                      {JSON.stringify(complianceResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
