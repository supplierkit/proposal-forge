// Agent system types for SupplierKit's AI-powered proposal lifecycle management
// Inspired by Sirion's AgentOS, adapted for hotel group sales

import type { Json } from "./database";

// ============================================
// ENUMS
// ============================================

export type AgentType = "rfp_intake" | "pricing" | "compliance" | "ask";
export type AgentRunStatus = "running" | "completed" | "failed";
export type ObligationStatus = "pending" | "in_progress" | "fulfilled" | "at_risk" | "overdue" | "waived";
export type ObligationCategory = "room_block" | "function_space" | "catering" | "av_equipment" | "transportation" | "special_request" | "billing" | "other";
export type ChatRole = "user" | "assistant";

// ============================================
// PLAYBOOKS
// ============================================

export interface SeasonalRule {
  name: string;
  start: string; // MM-DD
  end: string;   // MM-DD
  min_rate_multiplier: number;
}

export interface Playbook {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  min_group_discount_pct: number | null;
  max_group_discount_pct: number | null;
  min_room_block_nights: number | null;
  required_sections: string[];
  tone_guidelines: string | null;
  prohibited_terms: string[] | null;
  required_terms: string[] | null;
  auto_approve_below: number | null;
  require_manager_above: number | null;
  seasonal_rules: SeasonalRule[];
  created_at: string;
  updated_at: string;
}

// ============================================
// AGENT RUNS
// ============================================

export interface AgentRun {
  id: string;
  organization_id: string;
  agent_type: AgentType;
  status: AgentRunStatus;
  triggered_by: string | null;
  lead_id: string | null;
  proposal_id: string | null;
  playbook_id: string | null;
  input: Json;
  output: Json | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  created_at: string;
}

// ============================================
// OBLIGATIONS
// ============================================

export interface Obligation {
  id: string;
  proposal_id: string;
  lead_id: string;
  property_id: string;
  category: ObligationCategory;
  title: string;
  description: string | null;
  status: ObligationStatus;
  promised_value: Json | null;
  actual_value: Json | null;
  fulfillment_pct: number;
  due_date: string | null;
  fulfilled_at: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// CHAT MESSAGES
// ============================================

export interface ChatMessage {
  id: string;
  organization_id: string;
  user_id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  context_refs: Json | null;
  agent_run_id: string | null;
  created_at: string;
}

// ============================================
// AGENT-SPECIFIC INPUT/OUTPUT TYPES
// ============================================

// RFP Intake Agent
export interface RfpIntakeInput {
  raw_text: string;
  source?: string; // email, pdf, cvent, manual
}

export interface RfpIntakeOutput {
  event_name: string;
  event_type: string;
  organization_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_title: string | null;
  event_start_date: string | null;
  event_end_date: string | null;
  estimated_attendees: number | null;
  estimated_room_nights: number | null;
  room_requirements: RoomRequirement[];
  space_requirements: SpaceRequirement[];
  catering_requirements: CateringRequirement[];
  special_requests: string[];
  budget_indication: string | null;
  decision_timeline: string | null;
  competing_venues: string[];
  confidence_score: number; // 0-100
}

export interface RoomRequirement {
  type: string;
  quantity: number;
  nights: number;
  notes: string | null;
}

export interface SpaceRequirement {
  purpose: string;
  setup: string;
  capacity: number;
  days: number;
  av_needs: string[];
}

export interface CateringRequirement {
  meal_type: string;
  guests: number;
  occasions: number;
  dietary_notes: string | null;
}

// Pricing Intelligence Agent
export interface PricingInput {
  lead_id: string;
  property_id: string;
}

export interface PricingOutput {
  recommended_total: number;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  room_pricing: PricingRecommendation[];
  space_pricing: PricingRecommendation[];
  catering_pricing: PricingRecommendation[];
  seasonal_adjustment: number | null; // multiplier
  competitive_position: string;
  win_probability: number; // 0-100
  similar_won_deals: SimilarDeal[];
  similar_lost_deals: SimilarDeal[];
}

export interface PricingRecommendation {
  item: string;
  recommended_rate: number;
  min_rate: number;
  max_rate: number;
  reasoning: string;
}

export interface SimilarDeal {
  lead_id: string;
  event_name: string;
  value: number;
  attendees: number;
  outcome: "won" | "lost";
}

// Compliance Agent
export interface ComplianceInput {
  proposal_id: string;
  playbook_id: string;
}

export interface ComplianceOutput {
  is_compliant: boolean;
  overall_score: number; // 0-100
  issues: ComplianceIssue[];
  warnings: ComplianceIssue[];
  passed_checks: string[];
}

export interface ComplianceIssue {
  severity: "critical" | "warning" | "info";
  category: string;
  message: string;
  section: string | null;
  suggestion: string | null;
}

// AskSupplierKit
export interface AskInput {
  question: string;
  session_id: string;
  context?: {
    property_id?: string;
    lead_id?: string;
    proposal_id?: string;
  };
}

export interface AskOutput {
  answer: string;
  sources: AskSource[];
  suggested_actions: SuggestedAction[];
}

export interface AskSource {
  type: "proposal" | "lead" | "property" | "analytics";
  id: string;
  label: string;
}

export interface SuggestedAction {
  label: string;
  action: string; // route or action identifier
  params?: Record<string, string>;
}

// ============================================
// AGENT METADATA (for UI display)
// ============================================

export const AGENT_METADATA: Record<AgentType, {
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
}> = {
  rfp_intake: {
    name: "RFP Intake",
    description: "Extracts structured requirements from RFPs, emails, and documents",
    icon: "FileSearch",
    color: "#2563eb",
  },
  pricing: {
    name: "Pricing Intelligence",
    description: "Analyzes historical data to recommend optimal pricing strategies",
    icon: "TrendingUp",
    color: "#059669",
  },
  compliance: {
    name: "Compliance Check",
    description: "Validates proposals against your playbook and brand standards",
    icon: "ShieldCheck",
    color: "#d97706",
  },
  ask: {
    name: "AskSupplierKit",
    description: "Conversational AI for proposal intelligence and insights",
    icon: "MessageSquare",
    color: "#7c3aed",
  },
};
