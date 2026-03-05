import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ShieldCheck,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { DEMO_PLAYBOOK } from "@/lib/demo-agents";

export default function PlaybooksPage() {
  const playbook = DEMO_PLAYBOOK;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-[22px] font-bold tracking-tight text-[#111] md:text-[28px]">
            Playbooks
          </h1>
        </div>
        <p className="text-[#666] mt-1">
          Define selling standards, pricing guardrails, and brand rules that AI agents enforce automatically.
        </p>
      </div>

      {/* Active Playbook */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-[16px]">{playbook.name}</CardTitle>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="text-[13px] text-[#666] mt-1">{playbook.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Pricing Guardrails */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[#888]">
                <DollarSign className="h-4 w-4" />
                Pricing Guardrails
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-[#FAFAFA] px-3 py-2">
                  <span className="text-[13px] text-[#666]">Minimum Group Discount</span>
                  <span className="text-[13px] font-medium text-[#111]">{playbook.min_group_discount_pct}%</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-[#FAFAFA] px-3 py-2">
                  <span className="text-[13px] text-[#666]">Maximum Group Discount</span>
                  <span className="text-[13px] font-medium text-[#111]">{playbook.max_group_discount_pct}%</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-[#FAFAFA] px-3 py-2">
                  <span className="text-[13px] text-[#666]">Minimum Room Block</span>
                  <span className="text-[13px] font-medium text-[#111]">{playbook.min_room_block_nights} nights</span>
                </div>
              </div>
            </div>

            {/* Approval Rules */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[#888]">
                <ShieldCheck className="h-4 w-4" />
                Approval Rules
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-[#FAFAFA] px-3 py-2">
                  <span className="text-[13px] text-[#666]">Auto-approve below</span>
                  <span className="text-[13px] font-medium text-[#111]">${playbook.auto_approve_below?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-[#FAFAFA] px-3 py-2">
                  <span className="text-[13px] text-[#666]">Manager approval above</span>
                  <span className="text-[13px] font-medium text-[#111]">${playbook.require_manager_above?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Required Sections */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[#888]">
                <FileText className="h-4 w-4" />
                Required Proposal Sections
              </h3>
              <div className="flex flex-wrap gap-2">
                {playbook.required_sections.map((section) => (
                  <Badge key={section} variant="secondary" className="text-[12px]">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                    {section.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tone & Terms */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[#888]">
                <AlertTriangle className="h-4 w-4" />
                Brand Standards
              </h3>
              <div className="space-y-2">
                <div className="rounded-md bg-[#FAFAFA] px-3 py-2">
                  <p className="text-[12px] text-[#888] mb-1">Tone Guidelines</p>
                  <p className="text-[13px] text-[#111]">{playbook.tone_guidelines}</p>
                </div>
                {playbook.prohibited_terms && playbook.prohibited_terms.length > 0 && (
                  <div className="rounded-md bg-red-50 px-3 py-2">
                    <p className="text-[12px] text-red-400 mb-1">Prohibited Terms</p>
                    <div className="flex flex-wrap gap-1">
                      {playbook.prohibited_terms.map((term) => (
                        <Badge key={term} variant="destructive" className="text-[11px]">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {playbook.required_terms && playbook.required_terms.length > 0 && (
                  <div className="rounded-md bg-emerald-50 px-3 py-2">
                    <p className="text-[12px] text-emerald-600 mb-1">Required Terms</p>
                    <div className="flex flex-wrap gap-1">
                      {playbook.required_terms.map((term) => (
                        <Badge key={term} variant="success" className="text-[11px]">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seasonal Rules */}
          {playbook.seasonal_rules.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[#888]">
                <Calendar className="h-4 w-4" />
                Seasonal Pricing Rules
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {playbook.seasonal_rules.map((rule) => (
                  <div key={rule.name} className="flex items-center justify-between rounded-md border border-[#eee] px-3 py-2">
                    <div>
                      <p className="text-[13px] font-medium text-[#111]">{rule.name}</p>
                      <p className="text-[11px] text-[#888]">{rule.start} to {rule.end}</p>
                    </div>
                    <Badge variant="warning" className="text-[11px]">
                      {rule.min_rate_multiplier}x min rate
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
