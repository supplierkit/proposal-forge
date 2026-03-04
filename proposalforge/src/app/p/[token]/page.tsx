import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { ProposalViewTracker } from "./view-tracker";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicProposalPage({ params }: Props) {
  const { token } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch proposal by public token (no auth required)
  const { data: proposal } = await supabase
    .from("proposals")
    .select("*, properties(name, description, address, star_rating, images, amenities, contact_email, contact_phone), proposal_sections(*)")
    .eq("public_token", token)
    .single();

  if (!proposal) notFound();

  const sections = (proposal.proposal_sections as Array<{
    id: string;
    type: string;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
    sort_order: number;
  }>).sort((a, b) => a.sort_order - b.sort_order);

  const property = proposal.properties as {
    name: string;
    description: string | null;
    address: Record<string, string>;
    star_rating: number | null;
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <ProposalViewTracker proposalId={proposal.id} />

      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-white/70 text-sm mb-2">Proposal from</p>
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          {property.address?.city && (
            <p className="text-white/70">
              {[property.address.city, property.address.country].filter(Boolean).join(", ")}
            </p>
          )}
          <h2 className="text-xl mt-6 font-light">{proposal.title}</h2>
        </div>
      </header>

      {/* Sections */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {sections.map((section) => (
          <section key={section.id} className="bg-white rounded-lg shadow-sm border border-[#eee] p-8">
            <h3 className="text-xl font-semibold text-[#111] mb-4">{section.title}</h3>
            <SectionContent type={section.type} content={section.content} />
          </section>
        ))}

        {/* Accept / Decline */}
        <div className="bg-white rounded-lg shadow-sm border border-[#eee] p-8 text-center">
          <h3 className="text-xl font-semibold text-[#111] mb-4">Ready to proceed?</h3>
          <p className="text-[#666] mb-6">
            Accept this proposal to confirm your booking, or get in touch if you have questions.
          </p>
          <div className="flex gap-4 justify-center">
            <form action={`/api/v1/public/proposals/${token}/accept`} method="POST">
              <button
                type="submit"
                className="px-6 py-3 bg-[#059669] text-white font-medium rounded-md hover:bg-[#047857] transition-colors cursor-pointer"
              >
                Accept Proposal
              </button>
            </form>
            <form action={`/api/v1/public/proposals/${token}/decline`} method="POST">
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#444] font-medium rounded-md border border-[#eee] hover:bg-[#F6F7F8] transition-colors cursor-pointer"
              >
                Decline
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-[#888]">
        Powered by ProposalForge
      </footer>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionContent({ type, content }: { type: string; content: any }) {
  switch (type) {
    case "introduction":
      return <div className="prose prose-neutral max-w-none whitespace-pre-wrap">{content?.text}</div>;

    case "rooms":
      return (
        <div>
          <p className="text-[#444] mb-4">{content?.description}</p>
          {content?.recommended_rooms?.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#eee]">
                  <th className="text-left py-2 font-medium text-[#666]">Room Type</th>
                  <th className="text-right py-2 font-medium text-[#666]">Qty</th>
                  <th className="text-right py-2 font-medium text-[#666]">Rate/Night</th>
                  <th className="text-right py-2 font-medium text-[#666]">Nights</th>
                  <th className="text-right py-2 font-medium text-[#666]">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {content.recommended_rooms.map((room: any, i: number) => (
                  <tr key={i} className="border-b border-[#f0f0f0]">
                    <td className="py-2">{room.room_type}</td>
                    <td className="text-right py-2">{room.quantity}</td>
                    <td className="text-right py-2">{formatCurrency(room.rate)}</td>
                    <td className="text-right py-2">{room.nights}</td>
                    <td className="text-right py-2 font-medium">{formatCurrency(room.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );

    case "function_spaces":
      return (
        <div>
          <p className="text-[#444] mb-4">{content?.description}</p>
          {content?.recommended_spaces?.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#eee]">
                  <th className="text-left py-2 font-medium text-[#666]">Space</th>
                  <th className="text-right py-2 font-medium text-[#666]">Setup</th>
                  <th className="text-right py-2 font-medium text-[#666]">Days</th>
                  <th className="text-right py-2 font-medium text-[#666]">Rate</th>
                  <th className="text-right py-2 font-medium text-[#666]">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {content.recommended_spaces.map((space: any, i: number) => (
                  <tr key={i} className="border-b border-[#f0f0f0]">
                    <td className="py-2">{space.space_name}</td>
                    <td className="text-right py-2 capitalize">{space.setup}</td>
                    <td className="text-right py-2">{space.days}</td>
                    <td className="text-right py-2">{formatCurrency(space.rate)}</td>
                    <td className="text-right py-2 font-medium">{formatCurrency(space.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );

    case "catering":
      return (
        <div>
          <p className="text-[#444] mb-4">{content?.description}</p>
          {content?.recommended_packages?.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#eee]">
                  <th className="text-left py-2 font-medium text-[#666]">Package</th>
                  <th className="text-right py-2 font-medium text-[#666]">Guests</th>
                  <th className="text-right py-2 font-medium text-[#666]">Per Person</th>
                  <th className="text-right py-2 font-medium text-[#666]">Occasions</th>
                  <th className="text-right py-2 font-medium text-[#666]">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {content.recommended_packages.map((pkg: any, i: number) => (
                  <tr key={i} className="border-b border-[#f0f0f0]">
                    <td className="py-2">{pkg.package_name}</td>
                    <td className="text-right py-2">{pkg.guests}</td>
                    <td className="text-right py-2">{formatCurrency(pkg.price_per_person)}</td>
                    <td className="text-right py-2">{pkg.occasions}</td>
                    <td className="text-right py-2 font-medium">{formatCurrency(pkg.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );

    case "pricing_summary":
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#444]">Accommodation</span>
            <span>{formatCurrency(content?.accommodation_total ?? 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#444]">Meeting & Event Spaces</span>
            <span>{formatCurrency(content?.meeting_space_total ?? 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#444]">Catering</span>
            <span>{formatCurrency(content?.catering_total ?? 0)}</span>
          </div>
          {(content?.additional_services ?? 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#444]">Additional Services</span>
              <span>{formatCurrency(content.additional_services)}</span>
            </div>
          )}
          <div className="border-t border-[#eee] pt-3 flex justify-between text-lg font-semibold">
            <span>Total Investment</span>
            <span className="text-primary">{formatCurrency(content?.grand_total ?? 0)}</span>
          </div>
          {content?.notes && <p className="text-sm text-[#666] mt-2">{content.notes}</p>}
        </div>
      );

    case "terms":
      return <div className="prose prose-neutral prose-sm max-w-none whitespace-pre-wrap">{content?.text}</div>;

    case "cover":
      return null; // Cover is rendered in the header

    default:
      return <div className="text-[#444]">{JSON.stringify(content)}</div>;
  }
}
