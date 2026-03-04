import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

const PRICE_IDS: Record<string, string> = {
  starter_monthly: process.env.STRIPE_STARTER_PRICE_ID ?? "price_starter",
  professional_monthly: process.env.STRIPE_PROFESSIONAL_PRICE_ID ?? "price_professional",
  enterprise_monthly: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "price_enterprise",
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    let userId: string | undefined;
    let userEmail: string | undefined;
    if (process.env.NEXT_PUBLIC_AUTH_DISABLED === "true") {
      return apiError("Billing is disabled in demo mode", 403);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("Unauthorized", 401);
    userId = user.id;
    userEmail = user.email;

    const { priceKey } = await request.json();
    const priceId = PRICE_IDS[priceKey];
    if (!priceId) return apiError("Invalid price", 400);

    const { data: profile } = await supabase
      .from("users")
      .select("organization_id, organizations(stripe_customer_id, name, slug)")
      .eq("id", userId!)
      .single();

    if (!profile) return apiError("Profile not found", 404);

    const orgs = profile.organizations as unknown as { stripe_customer_id: string | null; name: string; slug: string }[] | null;
    const org = orgs?.[0] ?? null;
    let customerId = org?.stripe_customer_id;

    const stripe = getStripe();

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: org?.name,
        metadata: { organization_id: profile.organization_id },
      });
      customerId = customer.id;

      await supabase
        .from("organizations")
        .update({ stripe_customer_id: customerId })
        .eq("id", profile.organization_id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?billing=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?billing=canceled`,
      metadata: { organization_id: profile.organization_id },
    });

    return apiSuccess({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return apiError("Failed to create checkout session", 500);
  }
}
