import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DEMO_OBLIGATIONS } from "@/lib/demo-agents";

const statusConfig: Record<string, { variant: "default" | "warning" | "success" | "destructive" | "secondary"; icon: typeof Clock; label: string }> = {
  pending: { variant: "secondary", icon: Clock, label: "Pending" },
  in_progress: { variant: "default", icon: Clock, label: "In Progress" },
  fulfilled: { variant: "success", icon: CheckCircle2, label: "Fulfilled" },
  at_risk: { variant: "warning", icon: AlertTriangle, label: "At Risk" },
  overdue: { variant: "destructive", icon: XCircle, label: "Overdue" },
  waived: { variant: "secondary", icon: XCircle, label: "Waived" },
};

const categoryLabels: Record<string, string> = {
  room_block: "Room Block",
  function_space: "Function Space",
  catering: "Catering",
  av_equipment: "AV Equipment",
  transportation: "Transportation",
  special_request: "Special Request",
  billing: "Billing",
  other: "Other",
};

export default function ObligationsPage() {
  const obligations = DEMO_OBLIGATIONS;

  const stats = {
    total: obligations.length,
    fulfilled: obligations.filter((o) => o.status === "fulfilled").length,
    atRisk: obligations.filter((o) => o.status === "at_risk" || o.status === "overdue").length,
    pending: obligations.filter((o) => o.status === "pending" || o.status === "in_progress").length,
  };

  const avgFulfillment = obligations.length > 0
    ? Math.round(obligations.reduce((sum, o) => sum + o.fulfillment_pct, 0) / obligations.length)
    : 0;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-primary" />
          <h1 className="text-[22px] font-bold tracking-tight text-[#111] md:text-[28px]">
            Obligations
          </h1>
        </div>
        <p className="text-[#666] mt-1">
          Track what was promised in accepted proposals and monitor delivery.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">Total Obligations</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-[#888]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111]">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">Fulfilled</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.fulfilled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">At Risk / Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.atRisk}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">Avg Fulfillment</CardTitle>
            <CalendarDays className="h-4 w-4 text-[#888]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111]">{avgFulfillment}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Obligation List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">
            All Obligations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {obligations.map((obligation) => {
              const config = statusConfig[obligation.status] ?? statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div
                  key={obligation.id}
                  className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-[#FAFAFA] border-b border-[#f0f0f0] last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <StatusIcon className={`h-4 w-4 flex-shrink-0 ${
                      obligation.status === "fulfilled" ? "text-emerald-500" :
                      obligation.status === "at_risk" ? "text-amber-500" :
                      obligation.status === "overdue" ? "text-red-500" :
                      "text-[#888]"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111] truncate">{obligation.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#888]">{obligation.event_name}</span>
                        <span className="text-xs text-[#ccc]">|</span>
                        <span className="text-xs text-[#888]">{categoryLabels[obligation.category] ?? obligation.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Progress bar */}
                    <div className="w-24 hidden sm:block">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              obligation.fulfillment_pct >= 100 ? "bg-emerald-500" :
                              obligation.fulfillment_pct >= 50 ? "bg-amber-500" :
                              "bg-red-400"
                            }`}
                            style={{ width: `${Math.min(obligation.fulfillment_pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#888] w-8 text-right">{obligation.fulfillment_pct}%</span>
                      </div>
                    </div>
                    {obligation.due_date && (
                      <span className="text-xs text-[#888] hidden md:block">
                        {formatDate(obligation.due_date)}
                      </span>
                    )}
                    <Badge variant={config.variant}>{config.label}</Badge>
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
