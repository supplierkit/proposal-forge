import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: proposalId } = await params;
    const supabase = await createServerSupabaseClient();
    const body = await request.json().catch(() => ({}));

    if (body.update && body.duration) {
      // Update duration of existing view - just log it
      return apiSuccess({ recorded: true });
    }

    // Record new view
    await supabase.from("proposal_views").insert({
      proposal_id: proposalId,
      viewer_user_agent: body.user_agent ?? null,
      total_duration_seconds: 0,
    });

    // Update proposal status to "viewed" if it was "sent"
    await supabase
      .from("proposals")
      .update({
        status: "viewed",
        viewed_at: new Date().toISOString(),
      })
      .eq("id", proposalId)
      .eq("status", "sent");

    return apiSuccess({ recorded: true });
  } catch {
    return apiError("Failed to record view", 500);
  }
}
