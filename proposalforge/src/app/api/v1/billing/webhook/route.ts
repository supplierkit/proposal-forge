import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return apiError("Invalid webhook signature", 400);
  }

  const supabase = await createServerSupabaseClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.organization_id;
      if (!orgId) break;

      await supabase
        .from("subscriptions")
        .update({
          stripe_subscription_id: session.subscription as string,
          status: "active",
          plan: "professional", // Default upgrade plan
          property_limit: 20,
          user_limit: 10,
        })
        .eq("organization_id", orgId);

      await supabase
        .from("organizations")
        .update({ plan: "professional" })
        .eq("id", orgId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (sub) {
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          trialing: "trialing",
        };
        const updateData: Record<string, unknown> = {
          status: statusMap[subscription.status] ?? "canceled",
        };

        // Extract period dates from subscription items if available
        const item = subscription.items?.data?.[0];
        if (item) {
          updateData.current_period_start = new Date(item.current_period_start * 1000).toISOString();
          updateData.current_period_end = new Date(item.current_period_end * 1000).toISOString();
        }

        await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("id", sub.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return apiSuccess({ received: true });
}
