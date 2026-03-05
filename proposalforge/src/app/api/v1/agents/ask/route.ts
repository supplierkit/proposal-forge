import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { askAgentSchema } from "@/lib/validations";
import { runAskAgent } from "@/lib/agents/runner";
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
    const parsed = askAgentSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { question, session_id, context } = parsed.data;
    const sessionId = session_id ?? crypto.randomUUID();

    // Fetch org data for context
    const [
      { data: properties },
      { data: leads },
      { data: proposals },
      { data: obligations },
      { data: chatHistory },
    ] = await Promise.all([
      supabase.from("properties").select("id, name, star_rating, total_rooms, currency").eq("organization_id", orgId).limit(10),
      supabase.from("leads").select("id, event_name, event_type, status, estimated_attendees, estimated_value, event_start_date, event_end_date").limit(20),
      supabase.from("proposals").select("id, title, status, total_value, sent_at, viewed_at, accepted_at, created_at").limit(20),
      supabase.from("obligations").select("id, title, category, status, due_date, fulfillment_pct").limit(20),
      supabase.from("chat_messages").select("role, content").eq("session_id", sessionId).order("created_at", { ascending: true }).limit(20),
    ]);

    // Save user message
    await supabase.from("chat_messages").insert({
      organization_id: orgId,
      user_id: userId,
      session_id: sessionId,
      role: "user",
      content: question,
      context_refs: context ?? null,
    });

    // Create agent run
    const { data: agentRun, error: runError } = await supabase
      .from("agent_runs")
      .insert({
        organization_id: orgId,
        agent_type: "ask",
        status: "running",
        triggered_by: userId,
        lead_id: context?.lead_id ?? null,
        proposal_id: context?.proposal_id ?? null,
        input: { question, session_id: sessionId },
      })
      .select()
      .single();

    if (runError) return apiError(runError.message, 500);

    // Run ask agent
    const startTime = Date.now();
    const result = await runAskAgent(
      { question, session_id: sessionId, context },
      {
        proposals: (proposals ?? []) as Record<string, unknown>[],
        leads: (leads ?? []) as Record<string, unknown>[],
        properties: (properties ?? []) as Record<string, unknown>[],
        obligations: (obligations ?? []) as Record<string, unknown>[],
        chatHistory: (chatHistory ?? []) as { role: string; content: string }[],
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

    // Save assistant response
    await supabase.from("chat_messages").insert({
      organization_id: orgId,
      user_id: userId,
      session_id: sessionId,
      role: "assistant",
      content: result.answer,
      agent_run_id: agentRun.id,
      context_refs: result.sources.length > 0 ? { sources: result.sources } : null,
    });

    return apiSuccess({
      agent_run_id: agentRun.id,
      session_id: sessionId,
      answer: result.answer,
      sources: result.sources,
      suggested_actions: result.suggested_actions,
    });
  } catch (err) {
    console.error("Ask agent error:", err);
    return apiError("Failed to process question", 500);
  }
}
