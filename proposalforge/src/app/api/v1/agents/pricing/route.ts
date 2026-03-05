import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { pricingAgentSchema } from "@/lib/validations";
import { runPricingAgent } from "@/lib/agents/runner";
import { AUTH_DISABLED, DEMO_USER, DEMO_PROFILE } from "@/lib/auth-config";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    let userId = DEMO_USER.id;
    let orgId = DEMO_PROFILE.organization_id;
    if (!AUTH_DISABLED) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return apiError("Unauthorized", 401);
      userId = user.id;
      const { data: profile } = await supabase.from("users").select("organization_id").eq("id", user.id).single();
      if (!profile) return apiError("User profile not found", 404);
      orgId = profile.organization_id;
    }

    const body = await request.json();
    const parsed = pricingAgentSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { lead_id, property_id } = parsed.data;

    // Fetch all context data
    const [
      { data: lead },
      { data: property },
      { data: roomTypes },
      { data: functionSpaces },
      { data: cateringPackages },
      { data: historicalLeads },
      { data: playbooks },
    ] = await Promise.all([
      supabase.from("leads").select("*, contacts(*)").eq("id", lead_id).single(),
      supabase.from("properties").select("*").eq("id", property_id).single(),
      supabase.from("room_types").select("*").eq("property_id", property_id).order("sort_order"),
      supabase.from("function_spaces").select("*").eq("property_id", property_id).order("sort_order"),
      supabase.from("catering_packages").select("*").eq("property_id", property_id),
      supabase.from("leads").select("*").eq("property_id", property_id).in("status", ["won", "lost"]).limit(20),
      supabase.from("playbooks").select("*").eq("organization_id", orgId).eq("is_active", true).limit(1),
    ]);

    if (!lead) return apiError("Lead not found", 404);
    if (!property) return apiError("Property not found", 404);

    // Create agent run
    const { data: agentRun, error: runError } = await supabase
      .from("agent_runs")
      .insert({
        organization_id: orgId,
        agent_type: "pricing",
        status: "running",
        triggered_by: userId,
        lead_id,
        playbook_id: playbooks?.[0]?.id ?? null,
        input: { lead_id, property_id },
      })
      .select()
      .single();

    if (runError) return apiError(runError.message, 500);

    // Run pricing agent
    const startTime = Date.now();
    const result = await runPricingAgent(
      { lead_id, property_id },
      {
        lead: lead as Record<string, unknown>,
        property: property as Record<string, unknown>,
        roomTypes: (roomTypes ?? []) as Record<string, unknown>[],
        functionSpaces: (functionSpaces ?? []) as Record<string, unknown>[],
        cateringPackages: (cateringPackages ?? []) as Record<string, unknown>[],
        historicalLeads: (historicalLeads ?? []) as Record<string, unknown>[],
        playbook: (playbooks?.[0] ?? null) as Record<string, unknown> | null,
      }
    );
    const durationMs = Date.now() - startTime;

    // Update agent run
    await supabase
      .from("agent_runs")
      .update({
        status: "completed",
        output: result as unknown as Record<string, unknown>,
        completed_at: new Date().toISOString(),
        duration_ms: durationMs,
      })
      .eq("id", agentRun.id);

    return apiSuccess({
      agent_run_id: agentRun.id,
      pricing: result,
    });
  } catch (err) {
    console.error("Pricing agent error:", err);
    return apiError("Failed to generate pricing recommendation", 500);
  }
}
