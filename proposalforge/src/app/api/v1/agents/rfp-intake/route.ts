import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { rfpIntakeSchema } from "@/lib/validations";
import { runRfpIntakeAgent } from "@/lib/agents/runner";
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
    const parsed = rfpIntakeSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { raw_text, source, property_id } = parsed.data;

    // Create agent run record
    const { data: agentRun, error: runError } = await supabase
      .from("agent_runs")
      .insert({
        organization_id: orgId,
        agent_type: "rfp_intake",
        status: "running",
        triggered_by: userId,
        input: { raw_text: raw_text.substring(0, 500), source, property_id },
      })
      .select()
      .single();

    if (runError) return apiError(runError.message, 500);

    // Run the agent
    const startTime = Date.now();
    const result = await runRfpIntakeAgent({ raw_text, source });
    const durationMs = Date.now() - startTime;

    // Update agent run with result
    await supabase
      .from("agent_runs")
      .update({
        status: "completed",
        output: result as unknown as Record<string, unknown>,
        completed_at: new Date().toISOString(),
        duration_ms: durationMs,
      })
      .eq("id", agentRun.id);

    // Auto-create lead from extracted data if confidence is high enough
    let createdLeadId: string | null = null;
    if (result.confidence_score >= 60) {
      const { data: lead } = await supabase
        .from("leads")
        .insert({
          property_id,
          source: (source ?? "other") as "manual" | "email" | "web_form" | "cvent" | "other",
          status: "new",
          event_name: result.event_name,
          event_type: result.event_type as "conference" | "meeting" | "wedding" | "incentive" | "exhibition" | "other",
          event_start_date: result.event_start_date,
          event_end_date: result.event_end_date,
          estimated_attendees: result.estimated_attendees,
          estimated_room_nights: result.estimated_room_nights,
          requirements: [
            ...result.special_requests,
            ...(result.budget_indication ? [`Budget: ${result.budget_indication}`] : []),
            ...(result.decision_timeline ? [`Timeline: ${result.decision_timeline}`] : []),
            ...(result.competing_venues.length > 0 ? [`Competing venues: ${result.competing_venues.join(", ")}`] : []),
          ].join("\n"),
          assigned_to: userId,
        })
        .select("id")
        .single();

      createdLeadId = lead?.id ?? null;

      // Auto-create contact if extracted
      if (result.contact_name && createdLeadId) {
        const names = result.contact_name.split(" ");
        const firstName = names[0] ?? "";
        const lastName = names.slice(1).join(" ") || "Unknown";

        const { data: contact } = await supabase
          .from("contacts")
          .insert({
            organization_id: orgId,
            first_name: firstName,
            last_name: lastName,
            email: result.contact_email,
            phone: result.contact_phone,
            title: result.contact_title,
            company_name: result.organization_name,
          })
          .select("id")
          .single();

        if (contact) {
          await supabase.from("leads").update({ contact_id: contact.id }).eq("id", createdLeadId);
        }
      }

      // Link agent run to created lead
      await supabase
        .from("agent_runs")
        .update({ lead_id: createdLeadId })
        .eq("id", agentRun.id);
    }

    return apiSuccess({
      agent_run_id: agentRun.id,
      extraction: result,
      created_lead_id: createdLeadId,
    }, 201);
  } catch (err) {
    console.error("RFP Intake agent error:", err);
    return apiError("Failed to process RFP", 500);
  }
}
