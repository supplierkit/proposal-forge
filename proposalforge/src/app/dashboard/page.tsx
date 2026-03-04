import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Target, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { AUTH_DISABLED, DEMO_PROFILE } from "@/lib/auth-config";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  let profile = DEMO_PROFILE as typeof DEMO_PROFILE & { full_name: string };
  let orgId = DEMO_PROFILE.organization_id;

  if (!AUTH_DISABLED) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: realProfile } = await supabase
      .from("users")
      .select("*, organizations(*)")
      .eq("id", user.id)
      .single();

    if (!realProfile) redirect("/login");
    profile = realProfile as typeof profile;
    orgId = realProfile.organization_id;
  }

  // Fetch stats in parallel
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

  const totalRevenue = wonLeads?.reduce((sum, l) => sum + (Number(l.estimated_value) || 0), 0) ?? 0;

  const stats = [
    { name: "Properties", value: propertyCount ?? 0, icon: Building2 },
    { name: "Active Leads", value: leadCount ?? 0, icon: Target },
    { name: "Proposals Sent", value: proposalCount ?? 0, icon: FileText },
    { name: "Revenue Won", value: formatCurrency(totalRevenue), icon: TrendingUp },
  ];

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
            <p className="text-sm text-[#666]">
              No leads yet. Create your first property and start adding leads.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[13px] font-medium uppercase tracking-widest text-[#888]">Recent Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#666]">
              No proposals yet. Generate your first AI-powered proposal from a lead.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
