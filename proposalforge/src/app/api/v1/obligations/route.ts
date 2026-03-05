import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { obligationSchema, obligationUpdateSchema } from "@/lib/validations";
import { AUTH_DISABLED, DEMO_USER, DEMO_PROFILE } from "@/lib/auth-config";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    if (!AUTH_DISABLED) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return apiError("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get("proposal_id");
    const status = searchParams.get("status");

    let query = supabase
      .from("obligations")
      .select("*, proposals(title), leads(event_name), properties(name)")
      .order("due_date", { ascending: true });

    if (proposalId) query = query.eq("proposal_id", proposalId);
    if (status) query = query.eq("status", status);

    const { data: obligations, error } = await query;

    if (error) return apiError(error.message, 500);

    return apiSuccess(obligations);
  } catch (err) {
    console.error("Obligations fetch error:", err);
    return apiError("Failed to fetch obligations", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    let userId = DEMO_USER.id;
    if (!AUTH_DISABLED) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return apiError("Unauthorized", 401);
      userId = user.id;
    }

    const body = await request.json();
    const parsed = obligationSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { data: obligation, error } = await supabase
      .from("obligations")
      .insert({ ...parsed.data, assigned_to: parsed.data.assigned_to ?? userId })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    return apiSuccess(obligation, 201);
  } catch (err) {
    console.error("Obligation create error:", err);
    return apiError("Failed to create obligation", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    if (!AUTH_DISABLED) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return apiError("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const obligationId = searchParams.get("id");
    if (!obligationId) return apiError("Obligation ID is required", 400);

    const body = await request.json();
    const parsed = obligationUpdateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === "fulfilled" && !parsed.data.fulfilled_at) {
      updateData.fulfilled_at = new Date().toISOString();
      updateData.fulfillment_pct = 100;
    }

    const { data: obligation, error } = await supabase
      .from("obligations")
      .update(updateData)
      .eq("id", obligationId)
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    return apiSuccess(obligation);
  } catch (err) {
    console.error("Obligation update error:", err);
    return apiError("Failed to update obligation", 500);
  }
}
