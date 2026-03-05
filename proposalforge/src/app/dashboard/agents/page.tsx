"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
} from "lucide-react";
import { DEMO_AGENT_RUNS } from "@/lib/demo-agents";
import Link from "next/link";

const agentTypeIcons: Record<string, { icon: typeof Bot; color: string; bg: string }> = {
  rfp_intake: { icon: FileSearch, color: "text-blue-600", bg: "bg-blue-50" },
  pricing: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  compliance: { icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
  ask: { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
};

const quickLinks = [
  {
    label: "New Lead from RFP",
    description: "Paste an RFP to auto-create a lead",
    href: "/dashboard/leads/new",
    icon: FileSearch,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "View Proposals",
    description: "Check compliance before sending",
    href: "/dashboard/proposals",
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "View Leads",
    description: "Get pricing recommendations on any lead",
    href: "/dashboard/leads",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export default function AgentsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-[22px] font-bold tracking-tight text-[#111] md:text-[28px]">
              AI Activity
            </h1>
          </div>
          <p className="text-[#666] mt-1">
            All AI agent runs across your workflow. Agents run automatically as you work.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Powered by Claude
        </Badge>
      </div>

      {/* Quick links to where agents live */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="cursor-pointer hover:border-primary/30 transition-colors h-full">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${link.bg}`}>
                    <link.icon className={`h-4 w-4 ${link.color}`} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#111]">{link.label}</p>
                    <p className="text-[12px] text-[#888]">{link.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Agent Run History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {DEMO_AGENT_RUNS.map((run) => {
              const typeConfig = agentTypeIcons[run.agent_type] ?? agentTypeIcons.ask;
              const TypeIcon = typeConfig.icon;
              return (
                <div
                  key={run.id}
                  className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-[#FAFAFA]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${typeConfig.bg}`}>
                      <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#111]">{run.label}</p>
                      <p className="text-[12px] text-[#666]">{run.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {run.duration_ms && (
                      <span className="flex items-center gap-1 text-[11px] text-[#888]">
                        <Clock className="h-3 w-3" />
                        {(run.duration_ms / 1000).toFixed(1)}s
                      </span>
                    )}
                    {run.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : run.status === "failed" ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    )}
                    <Badge
                      variant={
                        run.status === "completed" ? "success" : run.status === "failed" ? "destructive" : "default"
                      }
                      className="text-[11px]"
                    >
                      {run.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
