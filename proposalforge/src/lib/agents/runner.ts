// Agent runner: orchestrates AI agent execution for SupplierKit
// Mirrors Sirion's agentOS pattern: each agent is a purpose-built specialist

import Anthropic from "@anthropic-ai/sdk";
import type {
  AgentType,
  RfpIntakeInput,
  RfpIntakeOutput,
  PricingInput,
  PricingOutput,
  ComplianceInput,
  ComplianceOutput,
  AskInput,
  AskOutput,
} from "@/types/agents";

function getAnthropic() {
  return new Anthropic();
}

// ============================================
// RFP INTAKE AGENT
// ============================================

export async function runRfpIntakeAgent(input: RfpIntakeInput): Promise<RfpIntakeOutput> {
  const prompt = `You are an expert hotel RFP analyst. Extract structured event requirements from the following RFP text. Be precise and conservative — only extract what is explicitly stated or clearly implied.

## RFP TEXT
${input.raw_text}

## SOURCE
${input.source ?? "unknown"}

## OUTPUT FORMAT
Return ONLY valid JSON matching this exact structure:
{
  "event_name": "string",
  "event_type": "conference|meeting|wedding|incentive|exhibition|other",
  "organization_name": "string or null",
  "contact_name": "string or null",
  "contact_email": "string or null",
  "contact_phone": "string or null",
  "contact_title": "string or null",
  "event_start_date": "YYYY-MM-DD or null",
  "event_end_date": "YYYY-MM-DD or null",
  "estimated_attendees": "number or null",
  "estimated_room_nights": "number or null",
  "room_requirements": [{"type": "room type", "quantity": number, "nights": number, "notes": "string or null"}],
  "space_requirements": [{"purpose": "string", "setup": "theater|classroom|banquet|reception|boardroom", "capacity": number, "days": number, "av_needs": ["string"]}],
  "catering_requirements": [{"meal_type": "breakfast|lunch|dinner|coffee_break|reception", "guests": number, "occasions": number, "dietary_notes": "string or null"}],
  "special_requests": ["string"],
  "budget_indication": "string or null",
  "decision_timeline": "string or null",
  "competing_venues": ["string"],
  "confidence_score": number
}

The confidence_score should reflect how complete and clear the RFP is (0-100).
Return ONLY valid JSON. No markdown, no code fences.`;

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned) as RfpIntakeOutput;
  } catch {
    return {
      event_name: "Unable to parse RFP",
      event_type: "other",
      organization_name: null,
      contact_name: null,
      contact_email: null,
      contact_phone: null,
      contact_title: null,
      event_start_date: null,
      event_end_date: null,
      estimated_attendees: null,
      estimated_room_nights: null,
      room_requirements: [],
      space_requirements: [],
      catering_requirements: [],
      special_requests: [],
      budget_indication: null,
      decision_timeline: null,
      competing_venues: [],
      confidence_score: 0,
    };
  }
}

// ============================================
// PRICING INTELLIGENCE AGENT
// ============================================

export async function runPricingAgent(
  input: PricingInput,
  context: {
    lead: Record<string, unknown>;
    property: Record<string, unknown>;
    roomTypes: Record<string, unknown>[];
    functionSpaces: Record<string, unknown>[];
    cateringPackages: Record<string, unknown>[];
    historicalLeads: Record<string, unknown>[];
    playbook: Record<string, unknown> | null;
  }
): Promise<PricingOutput> {
  const prompt = `You are a hotel revenue management AI specialist. Analyze historical data and current market context to recommend optimal pricing for this group sales proposal.

## CURRENT LEAD
${JSON.stringify(context.lead, null, 2)}

## PROPERTY
${JSON.stringify(context.property, null, 2)}

## AVAILABLE ROOM TYPES
${JSON.stringify(context.roomTypes, null, 2)}

## AVAILABLE FUNCTION SPACES
${JSON.stringify(context.functionSpaces, null, 2)}

## CATERING PACKAGES
${JSON.stringify(context.cateringPackages, null, 2)}

## HISTORICAL LEADS (won and lost)
${JSON.stringify(context.historicalLeads, null, 2)}

## PLAYBOOK RULES
${context.playbook ? JSON.stringify(context.playbook, null, 2) : "No playbook configured"}

## INSTRUCTIONS
1. Analyze won vs lost deals to identify pricing sweet spots
2. Consider event size, type, and seasonality
3. Stay within playbook guardrails if configured
4. Recommend rates that maximize win probability while protecting margin
5. Flag if competing venues were mentioned

## OUTPUT FORMAT
Return ONLY valid JSON:
{
  "recommended_total": number,
  "confidence": "high|medium|low",
  "reasoning": "2-3 sentences explaining the pricing strategy",
  "room_pricing": [{"item": "room type name", "recommended_rate": number, "min_rate": number, "max_rate": number, "reasoning": "brief"}],
  "space_pricing": [{"item": "space name", "recommended_rate": number, "min_rate": number, "max_rate": number, "reasoning": "brief"}],
  "catering_pricing": [{"item": "package name", "recommended_rate": number, "min_rate": number, "max_rate": number, "reasoning": "brief"}],
  "seasonal_adjustment": number_or_null,
  "competitive_position": "brief assessment of how this pricing compares to market",
  "win_probability": number_0_to_100,
  "similar_won_deals": [{"lead_id": "id", "event_name": "name", "value": number, "attendees": number, "outcome": "won"}],
  "similar_lost_deals": [{"lead_id": "id", "event_name": "name", "value": number, "attendees": number, "outcome": "lost"}]
}

Return ONLY valid JSON. No markdown, no code fences.`;

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned) as PricingOutput;
  } catch {
    return {
      recommended_total: 0,
      confidence: "low",
      reasoning: "Unable to generate pricing recommendation. Please review manually.",
      room_pricing: [],
      space_pricing: [],
      catering_pricing: [],
      seasonal_adjustment: null,
      competitive_position: "Unknown",
      win_probability: 50,
      similar_won_deals: [],
      similar_lost_deals: [],
    };
  }
}

// ============================================
// COMPLIANCE AGENT
// ============================================

export async function runComplianceAgent(
  input: ComplianceInput,
  context: {
    proposal: Record<string, unknown>;
    sections: Record<string, unknown>[];
    playbook: Record<string, unknown>;
    property: Record<string, unknown>;
  }
): Promise<ComplianceOutput> {
  const prompt = `You are a hotel brand compliance auditor. Review this proposal against the organization's selling playbook and flag any issues.

## PROPOSAL
${JSON.stringify(context.proposal, null, 2)}

## PROPOSAL SECTIONS
${JSON.stringify(context.sections, null, 2)}

## PLAYBOOK / BRAND STANDARDS
${JSON.stringify(context.playbook, null, 2)}

## PROPERTY
${JSON.stringify(context.property, null, 2)}

## CHECKS TO PERFORM
1. All required sections present (from playbook.required_sections)
2. Pricing within allowed discount range (playbook.min/max_group_discount_pct)
3. No prohibited terms used in proposal text
4. All required terms/clauses included
5. Tone aligns with guidelines
6. Approval thresholds respected (auto_approve_below, require_manager_above)
7. Seasonal pricing rules applied correctly
8. Room block meets minimum nights

## OUTPUT FORMAT
Return ONLY valid JSON:
{
  "is_compliant": boolean,
  "overall_score": number_0_to_100,
  "issues": [{"severity": "critical|warning|info", "category": "pricing|sections|terms|tone|approval", "message": "description", "section": "section_type or null", "suggestion": "how to fix or null"}],
  "warnings": [same structure as issues],
  "passed_checks": ["description of each check that passed"]
}

Return ONLY valid JSON. No markdown, no code fences.`;

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned) as ComplianceOutput;
  } catch {
    return {
      is_compliant: false,
      overall_score: 0,
      issues: [{ severity: "critical", category: "system", message: "Unable to complete compliance check", section: null, suggestion: "Please try again" }],
      warnings: [],
      passed_checks: [],
    };
  }
}

// ============================================
// ASK SUPPLIERKIT AGENT
// ============================================

export async function runAskAgent(
  input: AskInput,
  context: {
    proposals: Record<string, unknown>[];
    leads: Record<string, unknown>[];
    properties: Record<string, unknown>[];
    obligations: Record<string, unknown>[];
    chatHistory: { role: string; content: string }[];
  }
): Promise<AskOutput> {
  const systemPrompt = `You are AskSupplierKit, an AI assistant for hotel group sales teams. You have access to the organization's proposal data, lead pipeline, property information, and obligation tracking.

Your capabilities:
- Answer questions about proposal performance, pipeline status, and revenue
- Provide insights on win/loss patterns and pricing trends
- Help identify at-risk obligations and upcoming deadlines
- Suggest actions to improve conversion rates
- Draft quick proposal sections or email responses

Always be specific and data-driven. Reference actual proposals, leads, and numbers when available.
When you reference data, include the source in your response so the user can navigate to it.

## AVAILABLE DATA
### Properties
${JSON.stringify(context.properties, null, 2)}

### Leads (Pipeline)
${JSON.stringify(context.leads, null, 2)}

### Proposals
${JSON.stringify(context.proposals, null, 2)}

### Obligations
${JSON.stringify(context.obligations, null, 2)}`;

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...context.chatHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: `${input.question}

Respond with a JSON object:
{
  "answer": "Your detailed answer in markdown format",
  "sources": [{"type": "proposal|lead|property|analytics", "id": "entity_id", "label": "display label"}],
  "suggested_actions": [{"label": "action label", "action": "route_path", "params": {}}]
}

Return ONLY valid JSON. No markdown fences.` },
  ];

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned) as AskOutput;
  } catch {
    // If the AI returns plain text instead of JSON, wrap it
    return {
      answer: text,
      sources: [],
      suggested_actions: [],
    };
  }
}
