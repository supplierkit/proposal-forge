import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { playbookSchema } from "@/lib/validations";
import { AUTH_DISABLED, DEMO_USER, DEMO_PROFILE } from "@/lib/auth-config";

export async function GET() {
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

    const { data: playbooks, error } = await supabase
      .from("playbooks")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) return apiError(error.message, 500);

    return apiSuccess(playbooks);
  } catch (err) {
    console.error("Playbooks fetch error:", err);
    return apiError("Failed to fetch playbooks", 500);
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const parsed = playbookSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { data: playbook, error } = await supabase
      .from("playbooks")
      .insert({ ...parsed.data, organization_id: orgId })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    return apiSuccess(playbook, 201);
  } catch (err) {
    console.error("Playbook create error:", err);
    return apiError("Failed to create playbook", 500);
  }
}
