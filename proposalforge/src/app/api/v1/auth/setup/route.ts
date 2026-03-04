import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";

const setupSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(2),
  organizationName: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = setupSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { userId, email, fullName, organizationName } = parsed.data;
    const supabase = await createServerSupabaseClient();

    // Create slug from organization name
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: organizationName,
        slug: `${slug}-${Date.now().toString(36)}`,
      })
      .select()
      .single();

    if (orgError) {
      return apiError(`Failed to create organization: ${orgError.message}`, 500);
    }

    // Create user profile
    const { error: userError } = await supabase.from("users").insert({
      id: userId,
      organization_id: org.id,
      email,
      full_name: fullName,
      role: "owner",
    });

    if (userError) {
      return apiError(`Failed to create user profile: ${userError.message}`, 500);
    }

    // Create default subscription (14-day trial)
    const { error: subError } = await supabase.from("subscriptions").insert({
      organization_id: org.id,
      plan: "starter",
      status: "trialing",
      property_limit: 3,
      user_limit: 3,
    });

    if (subError) {
      return apiError(`Failed to create subscription: ${subError.message}`, 500);
    }

    return apiSuccess({ organizationId: org.id }, 201);
  } catch {
    return apiError("Internal server error", 500);
  }
}
