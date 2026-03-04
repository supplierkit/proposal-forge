import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Target, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { AUTH_DISABLED, DEMO_PROFILE } from "@/lib/auth-config";
import { DEMO_STATS, DEMO_LEADS, DEMO_PROPOSALS } from "@/lib/demo-data";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  let profile = DEMO_PROFILE as typeof DEMO_PROFILE & { full_name: string };
  let pCount = 0;
  let lCount = 0;
  let prCount = 0;
  let totalRevenue = 0;

  if (AUTH_DISABLED) {
    pCount = DEMO_STATS.propertyCount;
    lCount = DEMO_STATS.leadCount;
    prCount = DEMO_STATS.proposalCount;
    totalRevenue = DEMO_STATS.totalRevenue;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: realProfile } = await supabase
      .from("users")
      .select("*, organizations(*)")
      .eq("id", user.id)
      .single();

    if (!realProfile) redirect("/login");
    profile = realProfile as typeof profile;
    const orgId = realProfile.organization_id;

    const [
      { count: propertyCount },
      { count: leadCount },
      { count: proposalCount },
      { data: wonLeads },
    ] = await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("property_id", orgId),
      supabase.from("proposals").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("estimated_value").eq("status", "won"),
    ]);

    pCount = propertyCount ?? 0;
    lCount = leadCount ?? 0;
    prCount = proposalCount ?? 0;
    totalRevenue = wonLeads?.reduce((sum, l) => sum + (Number(l.estimated_value) || 0), 0) ?? 0;
  }

  const stats = [
    { name: "Properties", value: pCount, icon: Building2 },
    { name: "Active Leads", value: lCount, icon: Target },
    { name: "Proposals Sent", value: prCount, icon: FileText },
    { name: "Revenue Won", value: formatCurrency(totalRevenue), icon: TrendingUp },
  ];

  const recentLeads = AUTH_DISABLED ? DEMO_LEADS.slice(0, 3) : [];
  const recentProposals = AUTH_DISABLED ? DEMO_PROPOSALS.slice(0, 3) : [];

  const statusColors: Record<string, "default" | "warning" | "success" | "destructive" | "secondary"> = {
    new: "default",
    qualified: "warning",
    proposal_sent: "secondary",
    negotiating: "warning",
    won: "success",
    lost: "destructive",
    draft: "secondary",
    sent: "default",
    viewed: "warning",
    accepted: "success",
    declined: "destructive",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-[#111] md:text-[28px]">
          Welcome back, {profile.full_name.split(" ")[0]}
        </h1>
        <p className="text-[#666] mt-1">
          Here&apos;s an overview of your group sales pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">
                {stat.name}
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#111]">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-[#666]">
                No leads yet. Create your first property and start adding leads.
              </p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#111]">{lead.event_name}</p>
                      <p className="text-xs text-[#666]">
                        {lead.contacts?.company_name ?? `${lead.contacts?.first_name} ${lead.contacts?.last_name}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#059669]">
                        {formatCurrency(lead.estimated_value ?? 0)}
                      </span>
                      <Badge variant={statusColors[lead.status] ?? "secondary"}>
                        {lead.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Recent Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProposals.length === 0 ? (
              <p className="text-sm text-[#666]">
                No proposals yet. Generate your first AI-powered proposal from a lead.
              </p>
            ) : (
              <div className="space-y-3">
                {recentProposals.map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/dashboard/proposals/${proposal.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#111]">{proposal.title}</p>
                      <p className="text-xs text-[#666]">
                        {proposal.leads?.contacts?.first_name} {proposal.leads?.contacts?.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#111]">
                        {formatCurrency(proposal.total_value)}
                      </span>
                      <Badge variant={statusColors[proposal.status] ?? "secondary"}>
                        {proposal.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
