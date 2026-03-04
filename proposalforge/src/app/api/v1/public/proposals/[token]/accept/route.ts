import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, lead_id")
    .eq("public_token", token)
    .single();

  if (!proposal) {
    return NextResponse.redirect(new URL("/", _request.url));
  }

  await supabase
    .from("proposals")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", proposal.id);

  // Update lead status to won
  await supabase
    .from("leads")
    .update({
      status: "won",
      won_at: new Date().toISOString(),
    })
    .eq("id", proposal.lead_id);

  return NextResponse.redirect(new URL(`/p/${token}?accepted=true`, _request.url));
}
