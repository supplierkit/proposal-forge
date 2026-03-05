import { z } from "zod";

// Auth
export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

// Property
export const propertySchema = z.object({
  name: z.string().min(2, "Property name is required"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
  }).default({}),
  description: z.string().optional(),
  star_rating: z.number().int().min(1).max(5).optional(),
  total_rooms: z.number().int().positive().optional(),
  total_meeting_space_sqm: z.number().positive().optional(),
  amenities: z.array(z.string()).default([]),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  timezone: z.string().default("UTC"),
  currency: z.string().default("USD"),
});

// Room Type
export const roomTypeSchema = z.object({
  name: z.string().min(1, "Room type name is required"),
  description: z.string().optional(),
  max_occupancy: z.number().int().positive().default(2),
  bed_configuration: z.string().optional(),
  size_sqm: z.number().positive().optional(),
  rack_rate: z.number().positive("Rack rate is required"),
  group_rate: z.number().positive("Group rate is required"),
  amenities: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
});

// Function Space
export const functionSpaceSchema = z.object({
  name: z.string().min(1, "Space name is required"),
  description: z.string().optional(),
  size_sqm: z.number().positive().optional(),
  max_capacity_theater: z.number().int().positive().optional(),
  max_capacity_classroom: z.number().int().positive().optional(),
  max_capacity_banquet: z.number().int().positive().optional(),
  max_capacity_reception: z.number().int().positive().optional(),
  max_capacity_boardroom: z.number().int().positive().optional(),
  half_day_rate: z.number().positive().optional(),
  full_day_rate: z.number().positive().optional(),
  av_equipment: z.array(z.string()).default([]),
  floor_plan_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.number().int().default(0),
});

// Catering Package
export const cateringPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  description: z.string().optional(),
  type: z.enum(["breakfast", "lunch", "dinner", "coffee_break", "reception", "custom"]).default("custom"),
  price_per_person: z.number().positive("Price per person is required"),
  min_guests: z.number().int().positive().optional(),
  menu_items: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).default([]),
  dietary_options: z.array(z.string()).default([]),
});

// Contact
export const contactSchema = z.object({
  company_name: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  title: z.string().optional(),
  notes: z.string().optional(),
});

// Lead
export const leadSchema = z.object({
  property_id: z.string().uuid("Property is required"),
  contact_id: z.string().uuid().optional(),
  source: z.enum(["manual", "email", "web_form", "cvent", "other"]).default("manual"),
  event_name: z.string().min(1, "Event name is required"),
  event_type: z.enum(["conference", "meeting", "wedding", "incentive", "exhibition", "other"]).default("other"),
  event_start_date: z.string().optional(),
  event_end_date: z.string().optional(),
  estimated_attendees: z.number().int().positive().optional(),
  estimated_room_nights: z.number().int().positive().optional(),
  estimated_value: z.number().positive().optional(),
  requirements: z.string().optional(),
  notes: z.string().optional(),
});

// AI Proposal Generation
export const generateProposalSchema = z.object({
  lead_id: z.string().uuid("Lead is required"),
  property_id: z.string().uuid("Property is required"),
  custom_instructions: z.string().optional(),
});

// Proposal
export const proposalSchema = z.object({
  title: z.string().min(1, "Proposal title is required"),
  custom_message: z.string().optional(),
  expires_at: z.string().optional(),
});

// Send Proposal
export const sendProposalSchema = z.object({
  recipient_email: z.string().email("Recipient email is required"),
  subject: z.string().min(1, "Email subject is required"),
  message: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type RoomTypeInput = z.infer<typeof roomTypeSchema>;
export type FunctionSpaceInput = z.infer<typeof functionSpaceSchema>;
export type CateringPackageInput = z.infer<typeof cateringPackageSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type GenerateProposalInput = z.infer<typeof generateProposalSchema>;
export type ProposalInput = z.infer<typeof proposalSchema>;
export type SendProposalInput = z.infer<typeof sendProposalSchema>;

// ============================================
// AGENT SYSTEM VALIDATIONS
// ============================================

// RFP Intake
export const rfpIntakeSchema = z.object({
  raw_text: z.string().min(10, "RFP text must be at least 10 characters"),
  source: z.enum(["email", "pdf", "cvent", "manual", "web_form"]).optional(),
  property_id: z.string().uuid("Property is required"),
});

// Pricing Intelligence
export const pricingAgentSchema = z.object({
  lead_id: z.string().uuid("Lead is required"),
  property_id: z.string().uuid("Property is required"),
});

// Compliance Check
export const complianceAgentSchema = z.object({
  proposal_id: z.string().uuid("Proposal is required"),
  playbook_id: z.string().uuid("Playbook is required"),
});

// AskSupplierKit
export const askAgentSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  session_id: z.string().uuid().optional(),
  context: z.object({
    property_id: z.string().uuid().optional(),
    lead_id: z.string().uuid().optional(),
    proposal_id: z.string().uuid().optional(),
  }).optional(),
});

// Playbook
export const playbookSchema = z.object({
  name: z.string().min(2, "Playbook name is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  min_group_discount_pct: z.number().min(0).max(100).optional(),
  max_group_discount_pct: z.number().min(0).max(100).optional(),
  min_room_block_nights: z.number().int().positive().optional(),
  required_sections: z.array(z.string()).default(["cover", "introduction", "rooms", "function_spaces", "catering", "pricing_summary", "terms"]),
  tone_guidelines: z.string().optional(),
  prohibited_terms: z.array(z.string()).default([]),
  required_terms: z.array(z.string()).default([]),
  auto_approve_below: z.number().positive().optional(),
  require_manager_above: z.number().positive().optional(),
  seasonal_rules: z.array(z.object({
    name: z.string(),
    start: z.string(),
    end: z.string(),
    min_rate_multiplier: z.number().positive(),
  })).default([]),
});

// Obligation
export const obligationSchema = z.object({
  proposal_id: z.string().uuid("Proposal is required"),
  lead_id: z.string().uuid("Lead is required"),
  property_id: z.string().uuid("Property is required"),
  category: z.enum(["room_block", "function_space", "catering", "av_equipment", "transportation", "special_request", "billing", "other"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "fulfilled", "at_risk", "overdue", "waived"]).default("pending"),
  promised_value: z.record(z.string(), z.unknown()).optional(),
  due_date: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const obligationUpdateSchema = z.object({
  status: z.enum(["pending", "in_progress", "fulfilled", "at_risk", "overdue", "waived"]).optional(),
  actual_value: z.record(z.string(), z.unknown()).optional(),
  fulfillment_pct: z.number().min(0).max(100).optional(),
  fulfilled_at: z.string().optional(),
  notes: z.string().optional(),
});

export type RfpIntakeInput = z.infer<typeof rfpIntakeSchema>;
export type PricingAgentInput = z.infer<typeof pricingAgentSchema>;
export type ComplianceAgentInput = z.infer<typeof complianceAgentSchema>;
export type AskAgentInput = z.infer<typeof askAgentSchema>;
export type PlaybookInput = z.infer<typeof playbookSchema>;
export type ObligationInput = z.infer<typeof obligationSchema>;
export type ObligationUpdateInput = z.infer<typeof obligationUpdateSchema>;
