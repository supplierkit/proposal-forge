"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, Send, FileText, Clock } from "lucide-react";

const stats = [
  { label: "Proposals Sent", value: "24", change: "+12%", icon: Send },
  { label: "Proposals Viewed", value: "18", change: "+8%", icon: Eye },
  { label: "Win Rate", value: "42%", change: "+5%", icon: TrendingUp },
  { label: "Avg. Response Time", value: "2.4h", change: "-18%", icon: Clock },
];

const recentActivity = [
  { event: "Proposal viewed", detail: "ACME Corp Conference 2026", time: "2 hours ago" },
  { event: "Proposal accepted", detail: "Global Tech Summit", time: "5 hours ago" },
  { event: "Proposal sent", detail: "Spring Wedding Package — Müller", time: "1 day ago" },
  { event: "Lead created", detail: "Berlin Fashion Week Afterparty", time: "1 day ago" },
  { event: "Proposal viewed", detail: "Annual Board Retreat — Siemens", time: "2 days ago" },
];

const monthlyData = [
  { month: "Oct", sent: 8, won: 3 },
  { month: "Nov", sent: 12, won: 5 },
  { month: "Dec", sent: 10, won: 4 },
  { month: "Jan", sent: 15, won: 7 },
  { month: "Feb", sent: 18, won: 8 },
  { month: "Mar", sent: 24, won: 10 },
];

export default function AnalyticsPage() {
  const maxSent = Math.max(...monthlyData.map((d) => d.sent));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-[#111]">Analytics</h1>
        <p className="text-[14px] leading-relaxed text-[#444] mt-1">
          Track your proposal performance and pipeline metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">{stat.label}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#111]">{stat.value}</div>
              <p className={`text-xs mt-1 ${stat.change.startsWith("+") || stat.change.startsWith("-") && stat.label === "Avg. Response Time" ? "text-[#059669]" : "text-[#059669]"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">
              Proposals Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="w-8 text-xs text-[#888] text-right">{d.month}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-6 bg-[#F6F7F8] rounded overflow-hidden flex">
                      <div
                        className="h-full bg-primary/20 rounded-l"
                        style={{ width: `${(d.sent / maxSent) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 h-6 bg-[#F6F7F8] rounded overflow-hidden flex">
                      <div
                        className="h-full bg-[#059669]/30 rounded-l"
                        style={{ width: `${(d.won / maxSent) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 w-24 text-xs">
                    <span className="text-[#666]">{d.sent} sent</span>
                    <span className="text-[#059669]">{d.won} won</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#f0f0f0]">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary/20" />
                <span className="text-xs text-[#666]">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[#059669]/30" />
                <span className="text-xs text-[#666]">Won</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111] truncate">{item.event}</p>
                    <p className="text-xs text-[#666] truncate">{item.detail}</p>
                    <p className="text-xs text-[#888] mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">
            Pipeline Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { stage: "New Leads", count: 12, color: "bg-blue-100 text-blue-700" },
              { stage: "Qualified", count: 8, color: "bg-amber-100 text-amber-700" },
              { stage: "Proposal Sent", count: 6, color: "bg-purple-100 text-purple-700" },
              { stage: "Negotiating", count: 3, color: "bg-orange-100 text-orange-700" },
              { stage: "Won", count: 10, color: "bg-emerald-100 text-emerald-700" },
            ].map((stage) => (
              <div key={stage.stage} className="text-center rounded-md border border-[#eee] p-4">
                <p className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${stage.color}`}>
                  {stage.stage}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#111]">{stage.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
