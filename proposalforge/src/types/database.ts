export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "owner" | "admin" | "manager" | "sales_rep";
export type LeadStatus = "new" | "qualified" | "proposal_sent" | "negotiating" | "won" | "lost";
export type EventType = "conference" | "meeting" | "wedding" | "incentive" | "exhibition" | "other";
export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";
export type ProposalSectionType = "cover" | "introduction" | "rooms" | "function_spaces" | "catering" | "av_equipment" | "pricing_summary" | "terms" | "custom";
export type LeadSource = "manual" | "email" | "web_form" | "cvent" | "other";
export type ActivityType = "note" | "email_sent" | "proposal_sent" | "proposal_viewed" | "status_change" | "call" | "meeting";
export type CateringType = "breakfast" | "lunch" | "dinner" | "coffee_break" | "reception" | "custom";
export type PlanTier = "starter" | "professional" | "enterprise";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          brand_colors: Json | null;
          domain: string | null;
          plan: PlanTier;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          brand_colors?: Json | null;
          domain?: string | null;
          plan?: PlanTier;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          brand_colors?: Json | null;
          domain?: string | null;
          plan?: PlanTier;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          organization_id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          address: Json;
          description: string | null;
          star_rating: number | null;
          total_rooms: number | null;
          total_meeting_space_sqm: number | null;
          images: Json[] | null;
          amenities: string[] | null;
          contact_email: string | null;
          contact_phone: string | null;
          timezone: string;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          address?: Json;
          description?: string | null;
          star_rating?: number | null;
          total_rooms?: number | null;
          total_meeting_space_sqm?: number | null;
          images?: Json[] | null;
          amenities?: string[] | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          timezone?: string;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          address?: Json;
          description?: string | null;
          star_rating?: number | null;
          total_rooms?: number | null;
          total_meeting_space_sqm?: number | null;
          images?: Json[] | null;
          amenities?: string[] | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          timezone?: string;
          currency?: string;
          updated_at?: string;
        };
      };
      room_types: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          description: string | null;
          max_occupancy: number;
          bed_configuration: string | null;
          size_sqm: number | null;
          rack_rate: number;
          group_rate: number;
          images: Json[] | null;
          amenities: string[] | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          description?: string | null;
          max_occupancy?: number;
          bed_configuration?: string | null;
          size_sqm?: number | null;
          rack_rate: number;
          group_rate: number;
          images?: Json[] | null;
          amenities?: string[] | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          max_occupancy?: number;
          bed_configuration?: string | null;
          size_sqm?: number | null;
          rack_rate?: number;
          group_rate?: number;
          images?: Json[] | null;
          amenities?: string[] | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      function_spaces: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          description: string | null;
          size_sqm: number | null;
          max_capacity_theater: number | null;
          max_capacity_classroom: number | null;
          max_capacity_banquet: number | null;
          max_capacity_reception: number | null;
          max_capacity_boardroom: number | null;
          half_day_rate: number | null;
          full_day_rate: number | null;
          images: Json[] | null;
          av_equipment: string[] | null;
          floor_plan_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          description?: string | null;
          size_sqm?: number | null;
          max_capacity_theater?: number | null;
          max_capacity_classroom?: number | null;
          max_capacity_banquet?: number | null;
          max_capacity_reception?: number | null;
          max_capacity_boardroom?: number | null;
          half_day_rate?: number | null;
          full_day_rate?: number | null;
          images?: Json[] | null;
          av_equipment?: string[] | null;
          floor_plan_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          size_sqm?: number | null;
          max_capacity_theater?: number | null;
          max_capacity_classroom?: number | null;
          max_capacity_banquet?: number | null;
          max_capacity_reception?: number | null;
          max_capacity_boardroom?: number | null;
          half_day_rate?: number | null;
          full_day_rate?: number | null;
          images?: Json[] | null;
          av_equipment?: string[] | null;
          floor_plan_url?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      catering_packages: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          description: string | null;
          type: CateringType;
          price_per_person: number;
          min_guests: number | null;
          menu_items: Json[] | null;
          dietary_options: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          description?: string | null;
          type?: CateringType;
          price_per_person: number;
          min_guests?: number | null;
          menu_items?: Json[] | null;
          dietary_options?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          type?: CateringType;
          price_per_person?: number;
          min_guests?: number | null;
          menu_items?: Json[] | null;
          dietary_options?: string[] | null;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          organization_id: string;
          company_name: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          title: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          company_name?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          title?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company_name?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          title?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          property_id: string;
          contact_id: string | null;
          assigned_to: string | null;
          source: LeadSource;
          status: LeadStatus;
          event_name: string;
          event_type: EventType;
          event_start_date: string | null;
          event_end_date: string | null;
          estimated_attendees: number | null;
          estimated_room_nights: number | null;
          estimated_value: number | null;
          requirements: string | null;
          notes: string | null;
          lost_reason: string | null;
          won_at: string | null;
          lost_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          contact_id?: string | null;
          assigned_to?: string | null;
          source?: LeadSource;
          status?: LeadStatus;
          event_name: string;
          event_type?: EventType;
          event_start_date?: string | null;
          event_end_date?: string | null;
          estimated_attendees?: number | null;
          estimated_room_nights?: number | null;
          estimated_value?: number | null;
          requirements?: string | null;
          notes?: string | null;
          lost_reason?: string | null;
          won_at?: string | null;
          lost_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          property_id?: string;
          contact_id?: string | null;
          assigned_to?: string | null;
          source?: LeadSource;
          status?: LeadStatus;
          event_name?: string;
          event_type?: EventType;
          event_start_date?: string | null;
          event_end_date?: string | null;
          estimated_attendees?: number | null;
          estimated_room_nights?: number | null;
          estimated_value?: number | null;
          requirements?: string | null;
          notes?: string | null;
          lost_reason?: string | null;
          won_at?: string | null;
          lost_at?: string | null;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          category: string;
          is_default: boolean;
          sections: Json[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          category?: string;
          is_default?: boolean;
          sections?: Json[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          category?: string;
          is_default?: boolean;
          sections?: Json[];
          updated_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          property_id: string;
          lead_id: string;
          created_by: string;
          template_id: string | null;
          title: string;
          status: ProposalStatus;
          public_token: string;
          sent_at: string | null;
          viewed_at: string | null;
          expires_at: string | null;
          accepted_at: string | null;
          declined_at: string | null;
          total_value: number | null;
          custom_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          lead_id: string;
          created_by: string;
          template_id?: string | null;
          title: string;
          status?: ProposalStatus;
          public_token?: string;
          sent_at?: string | null;
          viewed_at?: string | null;
          expires_at?: string | null;
          accepted_at?: string | null;
          declined_at?: string | null;
          total_value?: number | null;
          custom_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          status?: ProposalStatus;
          sent_at?: string | null;
          viewed_at?: string | null;
          expires_at?: string | null;
          accepted_at?: string | null;
          declined_at?: string | null;
          total_value?: number | null;
          custom_message?: string | null;
          updated_at?: string;
        };
      };
      proposal_sections: {
        Row: {
          id: string;
          proposal_id: string;
          type: ProposalSectionType;
          title: string;
          content: Json;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          type?: ProposalSectionType;
          title: string;
          content?: Json;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: ProposalSectionType;
          title?: string;
          content?: Json;
          sort_order?: number;
          updated_at?: string;
        };
      };
      proposal_views: {
        Row: {
          id: string;
          proposal_id: string;
          viewer_ip: string | null;
          viewer_user_agent: string | null;
          sections_viewed: Json[] | null;
          total_duration_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          viewer_ip?: string | null;
          viewer_user_agent?: string | null;
          sections_viewed?: Json[] | null;
          total_duration_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          sections_viewed?: Json[] | null;
          total_duration_seconds?: number | null;
        };
      };
      activities: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string | null;
          type: ActivityType;
          description: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id?: string | null;
          type: ActivityType;
          description: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          description?: string;
          metadata?: Json | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          stripe_subscription_id: string | null;
          plan: PlanTier;
          status: SubscriptionStatus;
          property_limit: number;
          user_limit: number;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          stripe_subscription_id?: string | null;
          plan?: PlanTier;
          status?: SubscriptionStatus;
          property_limit?: number;
          user_limit?: number;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stripe_subscription_id?: string | null;
          plan?: PlanTier;
          status?: SubscriptionStatus;
          property_limit?: number;
          user_limit?: number;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
