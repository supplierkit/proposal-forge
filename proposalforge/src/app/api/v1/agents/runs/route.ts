import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AUTH_DISABLED, DEMO_PROFILE } from "@/lib/auth-config";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    let orgId = DEMO_PROFILE.organization_id;
    if (!AUTH_DISABLED) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return apiError("Unauthorized", 401);
      const { data: profile } = await supabase.from("users").select("organization_id").eq("id", user.id).single();
      if (!profile) return apiError("User profile not found", 404);
      orgId = profile.organization_id;
    }

    const { searchParams } = new URL(request.url);
    const agentType = searchParams.get("agent_type");
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);

    let query = supabase
      .from("agent_runs")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (agentType) query = query.eq("agent_type", agentType);

    const { data: runs, error } = await query;

    if (error) return apiError(error.message, 500);

    return apiSuccess(runs);
  } catch (err) {
    console.error("Agent runs fetch error:", err);
    return apiError("Failed to fetch agent runs", 500);
  }
}
