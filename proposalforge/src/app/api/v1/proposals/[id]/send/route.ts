import { NextRequest } from "next/server";
import { Resend } from "resend";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendProposalSchema } from "@/lib/validations";
import { AUTH_DISABLED, DEMO_USER } from "@/lib/auth-config";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    let userId = DEMO_USER.id;
    if (!AUTH_DISABLED) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return apiError("Unauthorized", 401);
      userId = user.id;
    }

    const body = await request.json();
    const parsed = sendProposalSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { recipient_email, subject, message } = parsed.data;

    // Fetch proposal
    const { data: proposal } = await supabase
      .from("proposals")
      .select("*, properties(name)")
      .eq("id", id)
      .single();

    if (!proposal) return apiError("Proposal not found", 404);

    const proposalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${proposal.public_token}`;
    const propertyName = (proposal.properties as { name: string })?.name ?? "Our Hotel";

    // Send email
    try {
      const resend = getResend();
      await resend.emails.send({
        from: `ProposalForge <proposals@${process.env.RESEND_DOMAIN ?? "proposalforge.com"}>`,
        to: recipient_email,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e3a5f; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 20px;">${propertyName}</h1>
              <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Group Sales Proposal</p>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #1f2937;">${proposal.title}</h2>
              ${message ? `<p style="color: #4b5563; line-height: 1.6;">${message}</p>` : ""}
              <p style="color: #4b5563; line-height: 1.6;">
                We&apos;ve prepared a personalized proposal for your upcoming event. Click below to view all the details.
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${proposalUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                  View Proposal
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                This proposal will expire in 30 days.
              </p>
            </div>
          </div>
        `,
      });
    } catch {
      // If email fails, still update the proposal status but note the failure
      console.error("Email send failed - continuing with status update");
    }

    // Update proposal status
    await supabase
      .from("proposals")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Update lead status
    await supabase
      .from("leads")
      .update({ status: "proposal_sent" })
      .eq("id", proposal.lead_id);

    // Log activity
    await supabase.from("activities").insert({
      lead_id: proposal.lead_id,
      user_id: userId,
      type: "proposal_sent",
      description: `Proposal sent to ${recipient_email}`,
    });

    return apiSuccess({ sent: true });
  } catch {
    return apiError("Failed to send proposal", 500);
  }
}
