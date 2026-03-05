// Demo data for the Agent system (used when AUTH_DISABLED is true)
// Provides realistic AI agent activity, playbook, and obligation data

export const DEMO_PLAYBOOK = {
  id: "demo-playbook-001",
  organization_id: "00000000-0000-0000-0000-000000000001",
  name: "Grand Hotel Berlin — Standard Selling Playbook",
  description:
    "Default selling standards for all group proposals. Enforces pricing guardrails, required sections, brand tone, and approval workflows.",
  is_active: true,
  min_group_discount_pct: 15,
  max_group_discount_pct: 35,
  min_room_block_nights: 10,
  required_sections: [
    "cover",
    "introduction",
    "rooms",
    "function_spaces",
    "catering",
    "pricing_summary",
    "terms",
  ],
  tone_guidelines:
    "Warm and professional. Always address the contact by name. Emphasize the hotel's heritage and central Berlin location. Use 'we' not 'I'. Avoid overselling — let the property speak for itself.",
  prohibited_terms: ["cheap", "budget", "discount", "bargain", "no-frills"],
  required_terms: [
    "cancellation policy",
    "deposit terms",
    "force majeure",
    "room block release date",
  ],
  auto_approve_below: 25000,
  require_manager_above: 50000,
  seasonal_rules: [
    {
      name: "ITB Berlin Season",
      start: "03-01",
      end: "03-15",
      min_rate_multiplier: 1.4,
    },
    {
      name: "Summer High Season",
      start: "06-01",
      end: "09-30",
      min_rate_multiplier: 1.2,
    },
    {
      name: "Christmas Market Season",
      start: "11-20",
      end: "12-31",
      min_rate_multiplier: 1.3,
    },
  ],
  created_at: "2026-01-16T10:00:00Z",
  updated_at: "2026-02-20T14:00:00Z",
};

export const DEMO_AGENT_RUNS = [
  {
    id: "demo-run-001",
    agent_type: "rfp_intake",
    status: "completed",
    label: "RFP Intake — PharmaCon Europe",
    description: "Extracted 12 requirements from email RFP. Lead auto-created.",
    duration_ms: 3200,
    created_at: "2026-03-04T14:30:00Z",
  },
  {
    id: "demo-run-002",
    agent_type: "pricing",
    status: "completed",
    label: "Pricing — European Tech Summit 2026",
    description: "Recommended $68,400 (win probability: 78%). 3 similar won deals found.",
    duration_ms: 4100,
    created_at: "2026-03-04T11:15:00Z",
  },
  {
    id: "demo-run-003",
    agent_type: "compliance",
    status: "completed",
    label: "Compliance — Tech Summit Proposal",
    description: "Score: 92/100. 1 warning: missing force majeure clause.",
    duration_ms: 2800,
    created_at: "2026-03-04T10:00:00Z",
  },
  {
    id: "demo-run-004",
    agent_type: "ask",
    status: "completed",
    label: "AskSupplierKit — Pipeline Summary",
    description: "Answered: 'What is our current pipeline value?' — $222,000 across 5 leads.",
    duration_ms: 1900,
    created_at: "2026-03-03T16:00:00Z",
  },
  {
    id: "demo-run-005",
    agent_type: "rfp_intake",
    status: "completed",
    label: "RFP Intake — Berlin Fashion Events",
    description: "Extracted event details from web form submission. Confidence: 85%.",
    duration_ms: 2500,
    created_at: "2026-03-03T09:30:00Z",
  },
  {
    id: "demo-run-006",
    agent_type: "pricing",
    status: "completed",
    label: "Pricing — ACME Corp Conference",
    description: "Recommended $42,500. Matched to 2 similar won deals from 2025.",
    duration_ms: 3800,
    created_at: "2026-03-02T15:00:00Z",
  },
];

export const DEMO_OBLIGATIONS = [
  // ACME Corp Conference (accepted proposal)
  {
    id: "demo-obl-001",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "room_block",
    title: "450 room nights — Superior Double & Executive mix",
    description: "Block of 350 Superior Double rooms and 100 Executive rooms across 3 nights (Jun 15-18)",
    status: "in_progress",
    fulfillment_pct: 65,
    due_date: "2026-05-01",
    promised_value: { superior_double: 350, executive: 100, total_nights: 450 },
  },
  {
    id: "demo-obl-002",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "function_space",
    title: "Grand Ballroom — 3-day hold (theater setup, 200 pax)",
    description: "Theater configuration for plenary sessions, full AV package included",
    status: "fulfilled",
    fulfillment_pct: 100,
    due_date: "2026-06-15",
    promised_value: { space: "Grand Ballroom", setup: "theater", capacity: 200, days: 3 },
  },
  {
    id: "demo-obl-003",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "catering",
    title: "Gala Dinner for 200 guests (Day 2)",
    description: "Three-course gala dinner with premium wine pairing, dietary accommodations",
    status: "pending",
    fulfillment_pct: 0,
    due_date: "2026-06-16",
    promised_value: { meal: "Gala Dinner", guests: 200, rate_per_person: 95 },
  },
  {
    id: "demo-obl-004",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "catering",
    title: "Business Lunch x3 days (200 pax)",
    description: "Buffet lunch service in Boardroom Spree for all 3 conference days",
    status: "pending",
    fulfillment_pct: 0,
    due_date: "2026-06-15",
    promised_value: { meal: "Business Lunch", guests: 200, days: 3, rate_per_person: 55 },
  },
  {
    id: "demo-obl-005",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "transportation",
    title: "Airport shuttle for 20 VIP guests",
    description: "Mercedes V-Class transfers from BER airport on arrival and departure days",
    status: "at_risk",
    fulfillment_pct: 30,
    due_date: "2026-06-14",
    promised_value: { service: "Airport shuttle", guests: 20, vehicle: "Mercedes V-Class" },
  },
  {
    id: "demo-obl-006",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "billing",
    title: "25% deposit due upon confirmation",
    description: "Deposit of $11,250 (25% of $45,000 total)",
    status: "fulfilled",
    fulfillment_pct: 100,
    due_date: "2026-03-15",
    promised_value: { amount: 11250, currency: "USD", type: "deposit" },
  },
  {
    id: "demo-obl-007",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "av_equipment",
    title: "Full AV package — projectors, mics, staging",
    description: "2 projectors, 4 wireless microphones, main stage with lectern, recording equipment",
    status: "in_progress",
    fulfillment_pct: 50,
    due_date: "2026-06-14",
    promised_value: { projectors: 2, microphones: 4, stage: true, recording: true },
  },
  {
    id: "demo-obl-008",
    proposal_id: "demo-proposal-001",
    lead_id: "demo-lead-001",
    event_name: "ACME Corp Annual Conference",
    category: "special_request",
    title: "Complimentary suite upgrades for 10 VIP guests",
    description: "Upgrade from Superior Double to Deluxe Suite for keynote speakers",
    status: "pending",
    fulfillment_pct: 0,
    due_date: "2026-06-14",
    promised_value: { upgrades: 10, from: "Superior Double", to: "Deluxe Suite" },
  },
];

export const DEMO_RFP_TEXT = `Subject: RFP — Annual Medical Conference 2026

Dear Hotel Sales Team,

We are seeking proposals for our Annual Medical Conference to be held in Berlin in October 2026.

Event Details:
- Event Name: MedTech Innovation Summit 2026
- Organization: EuroMed Association
- Contact: Dr. Helena Krause, Director of Events
- Email: h.krause@euromed.org
- Phone: +49 162 555 0199

- Dates: October 14-16, 2026 (3 days, 2 nights for most attendees)
- Expected Attendees: 180 delegates
- Room Nights: Approximately 300 (some attendees arrive early)

Requirements:
1. Plenary hall for 180 in theater setup with stage and full AV
2. 3 breakout rooms for 40-50 people each (classroom setup)
3. Exhibition space of at least 150 sqm for 20 medical device exhibitors
4. Welcome reception on evening of Oct 14 for 180 guests
5. Working lunch on Oct 15 and Oct 16
6. Conference dinner on Oct 15 evening for 180 guests
7. High-speed Wi-Fi throughout (critical for live-streaming sessions)
8. Accessibility requirements: wheelchair accessible main hall

Budget: Approximately EUR 60,000-75,000 all-inclusive
Decision Timeline: Shortlist by April 30, final decision by May 31
Competing Venues: Hotel Adlon, Intercontinental Berlin, Estrel Berlin

We look forward to receiving your proposal.

Best regards,
Dr. Helena Krause
Director of Events
EuroMed Association`;
