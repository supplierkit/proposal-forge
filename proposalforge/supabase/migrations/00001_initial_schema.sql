-- ProposalForge Initial Database Schema
-- Multi-tenant hotel group sales proposal platform

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

create type user_role as enum ('owner', 'admin', 'manager', 'sales_rep');
create type lead_status as enum ('new', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost');
create type event_type as enum ('conference', 'meeting', 'wedding', 'incentive', 'exhibition', 'other');
create type proposal_status as enum ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');
create type proposal_section_type as enum ('cover', 'introduction', 'rooms', 'function_spaces', 'catering', 'av_equipment', 'pricing_summary', 'terms', 'custom');
create type lead_source as enum ('manual', 'email', 'web_form', 'cvent', 'other');
create type activity_type as enum ('note', 'email_sent', 'proposal_sent', 'proposal_viewed', 'status_change', 'call', 'meeting');
create type catering_type as enum ('breakfast', 'lunch', 'dinner', 'coffee_break', 'reception', 'custom');
create type plan_tier as enum ('starter', 'professional', 'enterprise');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');

-- ============================================
-- TABLES
-- ============================================

-- Organizations (tenants)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  brand_colors jsonb default '{"primary": "#1e40af", "secondary": "#3b82f6", "accent": "#dbeafe"}'::jsonb,
  domain text,
  plan plan_tier not null default 'starter',
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Users (linked to Supabase Auth)
create table users (
  id uuid primary key, -- matches auth.users.id
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  full_name text not null,
  role user_role not null default 'sales_rep',
  avatar_url text,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Properties (hotels)
create table properties (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address jsonb not null default '{}'::jsonb,
  description text,
  star_rating smallint check (star_rating between 1 and 5),
  total_rooms integer,
  total_meeting_space_sqm numeric,
  images jsonb[] default array[]::jsonb[],
  amenities text[] default array[]::text[],
  contact_email text,
  contact_phone text,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Room Types
create table room_types (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  description text,
  max_occupancy smallint not null default 2,
  bed_configuration text,
  size_sqm numeric,
  rack_rate numeric not null,
  group_rate numeric not null,
  images jsonb[] default array[]::jsonb[],
  amenities text[] default array[]::text[],
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Function Spaces (meeting rooms, ballrooms, etc.)
create table function_spaces (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  description text,
  size_sqm numeric,
  max_capacity_theater integer,
  max_capacity_classroom integer,
  max_capacity_banquet integer,
  max_capacity_reception integer,
  max_capacity_boardroom integer,
  half_day_rate numeric,
  full_day_rate numeric,
  images jsonb[] default array[]::jsonb[],
  av_equipment text[] default array[]::text[],
  floor_plan_url text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Catering Packages
create table catering_packages (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  description text,
  type catering_type not null default 'custom',
  price_per_person numeric not null,
  min_guests integer,
  menu_items jsonb[] default array[]::jsonb[],
  dietary_options text[] default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contacts (external people: event planners, corporate clients)
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  company_name text,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  title text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Leads (RFPs / inquiries)
create table leads (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  assigned_to uuid references users(id) on delete set null,
  source lead_source not null default 'manual',
  status lead_status not null default 'new',
  event_name text not null,
  event_type event_type not null default 'other',
  event_start_date date,
  event_end_date date,
  estimated_attendees integer,
  estimated_room_nights integer,
  estimated_value numeric,
  requirements text,
  notes text,
  lost_reason text,
  won_at timestamptz,
  lost_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Templates
create table templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  category text not null default 'general',
  is_default boolean not null default false,
  sections jsonb[] not null default array[]::jsonb[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proposals
create table proposals (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  lead_id uuid not null references leads(id) on delete cascade,
  created_by uuid not null references users(id) on delete cascade,
  template_id uuid references templates(id) on delete set null,
  title text not null,
  status proposal_status not null default 'draft',
  public_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  sent_at timestamptz,
  viewed_at timestamptz,
  expires_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  total_value numeric,
  custom_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proposal Sections
create table proposal_sections (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  type proposal_section_type not null default 'custom',
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proposal Views (analytics)
create table proposal_views (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  viewer_ip inet,
  viewer_user_agent text,
  sections_viewed jsonb[] default array[]::jsonb[],
  total_duration_seconds integer,
  created_at timestamptz not null default now()
);

-- Activities (lead activity log)
create table activities (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  type activity_type not null,
  description text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  stripe_subscription_id text,
  plan plan_tier not null default 'starter',
  status subscription_status not null default 'trialing',
  property_limit integer not null default 3,
  user_limit integer not null default 3,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz default now() + interval '14 days',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_users_organization on users(organization_id);
create index idx_properties_organization on properties(organization_id);
create index idx_room_types_property on room_types(property_id);
create index idx_function_spaces_property on function_spaces(property_id);
create index idx_catering_packages_property on catering_packages(property_id);
create index idx_contacts_organization on contacts(organization_id);
create index idx_leads_property on leads(property_id);
create index idx_leads_status on leads(status);
create index idx_leads_assigned_to on leads(assigned_to);
create index idx_proposals_property on proposals(property_id);
create index idx_proposals_lead on proposals(lead_id);
create index idx_proposals_status on proposals(status);
create index idx_proposals_public_token on proposals(public_token);
create index idx_proposal_sections_proposal on proposal_sections(proposal_id);
create index idx_proposal_views_proposal on proposal_views(proposal_id);
create index idx_activities_lead on activities(lead_id);
create index idx_subscriptions_organization on subscriptions(organization_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table organizations enable row level security;
alter table users enable row level security;
alter table properties enable row level security;
alter table room_types enable row level security;
alter table function_spaces enable row level security;
alter table catering_packages enable row level security;
alter table contacts enable row level security;
alter table leads enable row level security;
alter table templates enable row level security;
alter table proposals enable row level security;
alter table proposal_sections enable row level security;
alter table proposal_views enable row level security;
alter table activities enable row level security;
alter table subscriptions enable row level security;

-- Helper function: get the current user's organization_id
create or replace function get_user_org_id()
returns uuid
language sql
stable
security definer
as $$
  select organization_id from users where id = auth.uid()
$$;

-- Organizations: users can only see their own org
create policy "Users can view own organization"
  on organizations for select
  using (id = get_user_org_id());

create policy "Owners can update own organization"
  on organizations for update
  using (id = get_user_org_id())
  with check (id = get_user_org_id());

-- Users: can see team members in same org
create policy "Users can view org members"
  on users for select
  using (organization_id = get_user_org_id());

create policy "Users can update own profile"
  on users for update
  using (id = auth.uid());

create policy "Admins can insert users"
  on users for insert
  with check (organization_id = get_user_org_id());

-- Properties: org-scoped
create policy "Users can view org properties"
  on properties for select
  using (organization_id = get_user_org_id());

create policy "Admins can manage properties"
  on properties for all
  using (organization_id = get_user_org_id())
  with check (organization_id = get_user_org_id());

-- Room Types: via property org scope
create policy "Users can view room types"
  on room_types for select
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

create policy "Admins can manage room types"
  on room_types for all
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

-- Function Spaces: via property org scope
create policy "Users can view function spaces"
  on function_spaces for select
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

create policy "Admins can manage function spaces"
  on function_spaces for all
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

-- Catering Packages: via property org scope
create policy "Users can view catering packages"
  on catering_packages for select
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

create policy "Admins can manage catering packages"
  on catering_packages for all
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

-- Contacts: org-scoped
create policy "Users can view org contacts"
  on contacts for select
  using (organization_id = get_user_org_id());

create policy "Users can manage org contacts"
  on contacts for all
  using (organization_id = get_user_org_id())
  with check (organization_id = get_user_org_id());

-- Leads: via property org scope
create policy "Users can view leads"
  on leads for select
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

create policy "Users can manage leads"
  on leads for all
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

-- Templates: org-scoped
create policy "Users can view org templates"
  on templates for select
  using (organization_id = get_user_org_id());

create policy "Users can manage org templates"
  on templates for all
  using (organization_id = get_user_org_id())
  with check (organization_id = get_user_org_id());

-- Proposals: via property org scope
create policy "Users can view proposals"
  on proposals for select
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

create policy "Users can manage proposals"
  on proposals for all
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

-- Proposal Sections: via proposal → property org scope
create policy "Users can view proposal sections"
  on proposal_sections for select
  using (proposal_id in (
    select id from proposals where property_id in (
      select id from properties where organization_id = get_user_org_id()
    )
  ));

create policy "Users can manage proposal sections"
  on proposal_sections for all
  using (proposal_id in (
    select id from proposals where property_id in (
      select id from properties where organization_id = get_user_org_id()
    )
  ));

-- Proposal Views: via proposal → property org scope
create policy "Users can view proposal analytics"
  on proposal_views for select
  using (proposal_id in (
    select id from proposals where property_id in (
      select id from properties where organization_id = get_user_org_id()
    )
  ));

-- Allow anonymous inserts for public proposal viewing (tracking)
create policy "Public can insert proposal views"
  on proposal_views for insert
  with check (true);

-- Activities: via lead → property org scope
create policy "Users can view activities"
  on activities for select
  using (lead_id in (
    select id from leads where property_id in (
      select id from properties where organization_id = get_user_org_id()
    )
  ));

create policy "Users can insert activities"
  on activities for insert
  with check (lead_id in (
    select id from leads where property_id in (
      select id from properties where organization_id = get_user_org_id()
    )
  ));

-- Subscriptions: org-scoped
create policy "Users can view own subscription"
  on subscriptions for select
  using (organization_id = get_user_org_id());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at trigger to all tables with updated_at column
create trigger set_updated_at before update on organizations for each row execute function update_updated_at();
create trigger set_updated_at before update on users for each row execute function update_updated_at();
create trigger set_updated_at before update on properties for each row execute function update_updated_at();
create trigger set_updated_at before update on room_types for each row execute function update_updated_at();
create trigger set_updated_at before update on function_spaces for each row execute function update_updated_at();
create trigger set_updated_at before update on catering_packages for each row execute function update_updated_at();
create trigger set_updated_at before update on contacts for each row execute function update_updated_at();
create trigger set_updated_at before update on leads for each row execute function update_updated_at();
create trigger set_updated_at before update on templates for each row execute function update_updated_at();
create trigger set_updated_at before update on proposals for each row execute function update_updated_at();
create trigger set_updated_at before update on proposal_sections for each row execute function update_updated_at();
create trigger set_updated_at before update on subscriptions for each row execute function update_updated_at();
