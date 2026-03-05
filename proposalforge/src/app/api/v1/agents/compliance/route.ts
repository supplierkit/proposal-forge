import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { complianceAgentSchema } from "@/lib/validations";
import { runComplianceAgent } from "@/lib/agents/runner";
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
    const parsed = complianceAgentSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { proposal_id, playbook_id } = parsed.data;

    // Fetch context
    const [
      { data: proposal },
      { data: sections },
      { data: playbook },
    ] = await Promise.all([
      supabase.from("proposals").select("*, leads(*)").eq("id", proposal_id).single(),
      supabase.from("proposal_sections").select("*").eq("proposal_id", proposal_id).order("sort_order"),
      supabase.from("playbooks").select("*").eq("id", playbook_id).single(),
    ]);

    if (!proposal) return apiError("Proposal not found", 404);
    if (!playbook) return apiError("Playbook not found", 404);

    const { data: property } = await supabase
      .from("properties")
      .select("*")
      .eq("id", proposal.property_id)
      .single();

    // Create agent run
    const { data: agentRun, error: runError } = await supabase
      .from("agent_runs")
      .insert({
        organization_id: orgId,
        agent_type: "compliance",
        status: "running",
        triggered_by: userId,
        proposal_id,
        playbook_id,
        input: { proposal_id, playbook_id },
      })
      .select()
      .single();

    if (runError) return apiError(runError.message, 500);

    // Run compliance agent
    const startTime = Date.now();
    const result = await runComplianceAgent(
      { proposal_id, playbook_id },
      {
        proposal: proposal as Record<string, unknown>,
        sections: (sections ?? []) as Record<string, unknown>[],
        playbook: playbook as Record<string, unknown>,
        property: (property ?? {}) as Record<string, unknown>,
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
      compliance: result,
    });
  } catch (err) {
    console.error("Compliance agent error:", err);
    return apiError("Failed to run compliance check", 500);
  }
}
