import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { generateProposalSchema } from "@/lib/validations";
import { generateToken } from "@/lib/utils";

function getAnthropic() {
  return new Anthropic();
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = generateProposalSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const { lead_id, property_id, custom_instructions } = parsed.data;

    // Fetch all data needed for the proposal
    const [
      { data: lead },
      { data: property },
      { data: roomTypes },
      { data: functionSpaces },
      { data: cateringPackages },
      { data: contact },
    ] = await Promise.all([
      supabase.from("leads").select("*, contacts(*)").eq("id", lead_id).single(),
      supabase.from("properties").select("*").eq("id", property_id).single(),
      supabase.from("room_types").select("*").eq("property_id", property_id).order("sort_order"),
      supabase.from("function_spaces").select("*").eq("property_id", property_id).order("sort_order"),
      supabase.from("catering_packages").select("*").eq("property_id", property_id),
      supabase.from("leads").select("contacts(*)").eq("id", lead_id).single(),
    ]);

    if (!lead) return apiError("Lead not found", 404);
    if (!property) return apiError("Property not found", 404);

    // Build AI prompt
    const prompt = buildProposalPrompt({
      lead,
      property,
      roomTypes: roomTypes ?? [],
      functionSpaces: functionSpaces ?? [],
      cateringPackages: cateringPackages ?? [],
      contact: (contact as unknown as Record<string, unknown>)?.contacts,
      customInstructions: custom_instructions,
    });

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const aiContent = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse AI response into sections
    const sections = parseProposalSections(aiContent, {
      lead,
      property,
      roomTypes: roomTypes ?? [],
      functionSpaces: functionSpaces ?? [],
      cateringPackages: cateringPackages ?? [],
    });

    // Calculate total value
    const totalValue = calculateTotalValue(sections);

    // Create proposal
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .insert({
        property_id,
        lead_id,
        created_by: user.id,
        title: `Proposal for ${lead.event_name}`,
        status: "draft",
        public_token: generateToken(32),
        total_value: totalValue,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (proposalError) return apiError(proposalError.message, 500);

    // Insert sections
    const sectionInserts = sections.map((section, index) => ({
      proposal_id: proposal.id,
      type: section.type,
      title: section.title,
      content: section.content,
      sort_order: index,
    }));

    const { error: sectionsError } = await supabase
      .from("proposal_sections")
      .insert(sectionInserts);

    if (sectionsError) return apiError(sectionsError.message, 500);

    // Log activity
    await supabase.from("activities").insert({
      lead_id,
      user_id: user.id,
      type: "note",
      description: "AI proposal generated",
    });

    return apiSuccess({ proposalId: proposal.id }, 201);
  } catch (err) {
    console.error("AI generation error:", err);
    return apiError("Failed to generate proposal", 500);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildProposalPrompt(data: any): string {
  const { lead, property, roomTypes, functionSpaces, cateringPackages, contact, customInstructions } = data;
  const address = property.address as Record<string, string>;

  return `You are a professional hotel sales proposal writer. Generate a compelling group sales proposal based on the following information. Write in a warm, professional tone.

## PROPERTY INFORMATION
- Name: ${property.name}
- Location: ${[address?.city, address?.country].filter(Boolean).join(", ")}
- Star Rating: ${property.star_rating ?? "N/A"}
- Total Rooms: ${property.total_rooms ?? "N/A"}
- Description: ${property.description ?? "A premium hotel property"}

## ROOM TYPES AVAILABLE
${roomTypes.map((rt: { name: string; max_occupancy: number; group_rate: number; rack_rate: number; bed_configuration: string }) =>
  `- ${rt.name}: Max occupancy ${rt.max_occupancy}, Group rate $${rt.group_rate}/night (rack rate $${rt.rack_rate}), ${rt.bed_configuration ?? "standard"}`
).join("\n")}

## FUNCTION SPACES AVAILABLE
${functionSpaces.map((fs: { name: string; size_sqm: number; max_capacity_theater: number; max_capacity_banquet: number; full_day_rate: number }) =>
  `- ${fs.name}: ${fs.size_sqm ?? "N/A"} sqm, Theater: ${fs.max_capacity_theater ?? "N/A"}, Banquet: ${fs.max_capacity_banquet ?? "N/A"}, Full day: $${fs.full_day_rate ?? "N/A"}`
).join("\n")}

## CATERING PACKAGES
${cateringPackages.map((cp: { name: string; type: string; price_per_person: number }) =>
  `- ${cp.name} (${cp.type}): $${cp.price_per_person}/person`
).join("\n")}

## EVENT DETAILS
- Event Name: ${lead.event_name}
- Event Type: ${lead.event_type}
- Dates: ${lead.event_start_date ?? "TBD"} to ${lead.event_end_date ?? "TBD"}
- Estimated Attendees: ${lead.estimated_attendees ?? "TBD"}
- Estimated Room Nights: ${lead.estimated_room_nights ?? "TBD"}
- Requirements: ${lead.requirements ?? "None specified"}

## CONTACT
${contact ? `- Name: ${contact.first_name} ${contact.last_name}\n- Company: ${contact.company_name ?? "N/A"}\n- Title: ${contact.title ?? "N/A"}` : "No contact specified"}

${customInstructions ? `## ADDITIONAL INSTRUCTIONS\n${customInstructions}` : ""}

## OUTPUT FORMAT
Generate the proposal in the following JSON format. Each section should have compelling, personalized content:

{
  "introduction": "A warm, personalized welcome letter (2-3 paragraphs). Address the contact by name if available. Reference the event and why this hotel is the perfect venue.",
  "rooms": {
    "description": "1-2 paragraphs about the accommodation experience",
    "recommended_rooms": [
      {"room_type": "name", "quantity": number, "rate": number, "nights": number, "subtotal": number}
    ]
  },
  "function_spaces": {
    "description": "1-2 paragraphs about the meeting/event spaces",
    "recommended_spaces": [
      {"space_name": "name", "setup": "theater/classroom/banquet", "days": number, "rate": number, "subtotal": number}
    ]
  },
  "catering": {
    "description": "1-2 paragraphs about the dining experience",
    "recommended_packages": [
      {"package_name": "name", "guests": number, "price_per_person": number, "occasions": number, "subtotal": number}
    ]
  },
  "pricing_summary": {
    "accommodation_total": number,
    "meeting_space_total": number,
    "catering_total": number,
    "additional_services": number,
    "grand_total": number,
    "notes": "Any pricing notes or special offers"
  },
  "terms": "Standard terms and conditions (2-3 short paragraphs covering booking confirmation, cancellation policy, payment terms)"
}

Return ONLY valid JSON. No markdown, no code fences.`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseProposalSections(aiContent: string, data: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsed: any;
  try {
    // Remove potential markdown code fences
    const cleaned = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback if AI doesn't return valid JSON
    parsed = {
      introduction: aiContent,
      rooms: { description: "Please configure room details.", recommended_rooms: [] },
      function_spaces: { description: "Please configure function spaces.", recommended_spaces: [] },
      catering: { description: "Please configure catering.", recommended_packages: [] },
      pricing_summary: { grand_total: 0 },
      terms: "Standard terms and conditions apply.",
    };
  }

  const property = data.property;

  return [
    {
      type: "cover" as const,
      title: "Cover",
      content: {
        property_name: property.name,
        event_name: data.lead.event_name,
        date: new Date().toISOString().split("T")[0],
      },
    },
    {
      type: "introduction" as const,
      title: "Welcome",
      content: { text: parsed.introduction },
    },
    {
      type: "rooms" as const,
      title: "Accommodation",
      content: parsed.rooms,
    },
    {
      type: "function_spaces" as const,
      title: "Meeting & Event Spaces",
      content: parsed.function_spaces,
    },
    {
      type: "catering" as const,
      title: "Dining & Catering",
      content: parsed.catering,
    },
    {
      type: "pricing_summary" as const,
      title: "Investment Summary",
      content: parsed.pricing_summary,
    },
    {
      type: "terms" as const,
      title: "Terms & Conditions",
      content: { text: parsed.terms },
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateTotalValue(sections: any[]): number {
  const pricingSection = sections.find((s) => s.type === "pricing_summary");
  return pricingSection?.content?.grand_total ?? 0;
}
