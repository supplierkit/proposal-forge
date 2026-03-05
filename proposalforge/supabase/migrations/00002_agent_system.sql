-- SupplierKit Agent System Migration
-- Inspired by Sirion's AgentOS: purpose-built AI agents for proposal lifecycle management
-- Adapted for hotel group sales: RFP intake, pricing intelligence, compliance, obligations

-- ============================================
-- NEW ENUMS
-- ============================================

create type agent_type as enum (
  'rfp_intake',        -- Extracts structured requirements from RFPs/emails
  'pricing',           -- Recommends optimal pricing from historical data
  'compliance',        -- Checks proposals against brand standards/playbooks
  'ask'                -- Conversational proposal intelligence (AskSupplierKit)
);

create type agent_run_status as enum ('running', 'completed', 'failed');

create type obligation_status as enum (
  'pending',           -- Not yet due
  'in_progress',       -- Being fulfilled
  'fulfilled',         -- Delivered as promised
  'at_risk',           -- Due soon, not started
  'overdue',           -- Past due date
  'waived'             -- Client agreed to waive
);

create type obligation_category as enum (
  'room_block',        -- Reserved room inventory
  'function_space',    -- Meeting room / ballroom holds
  'catering',          -- F&B commitments
  'av_equipment',      -- Audio-visual / technical setup
  'transportation',    -- Airport shuttles, transfers
  'special_request',   -- Custom client requests
  'billing',           -- Payment milestones
  'other'
);

create type chat_role as enum ('user', 'assistant');

-- ============================================
-- PLAYBOOKS (Sirion's Playbook Agent → Hotel Selling Standards)
-- ============================================

create table playbooks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,

  -- Pricing guardrails
  min_group_discount_pct numeric default 10,
  max_group_discount_pct numeric default 40,
  min_room_block_nights integer default 10,

  -- Brand standards
  required_sections text[] default array['cover', 'introduction', 'rooms', 'function_spaces', 'catering', 'pricing_summary', 'terms']::text[],
  tone_guidelines text,              -- e.g. "Formal but warm, always address by name"
  prohibited_terms text[],           -- e.g. terms that violate brand guidelines
  required_terms text[],             -- e.g. must include cancellation policy

  -- Approval rules
  auto_approve_below numeric,        -- Auto-approve proposals under this value
  require_manager_above numeric,     -- Require manager sign-off above this value

  -- Seasonal pricing rules (JSONB for flexibility)
  seasonal_rules jsonb default '[]'::jsonb,
  -- e.g. [{"name":"High Season","start":"06-01","end":"09-30","min_rate_multiplier":1.2}]

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- AGENT RUNS (Execution log for all AI agents)
-- ============================================

create table agent_runs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_type agent_type not null,
  status agent_run_status not null default 'running',
  triggered_by uuid references users(id) on delete set null,

  -- Context references (nullable - different agents use different contexts)
  lead_id uuid references leads(id) on delete set null,
  proposal_id uuid references proposals(id) on delete set null,
  playbook_id uuid references playbooks(id) on delete set null,

  -- Input/Output
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error_message text,

  -- Timing
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer,

  created_at timestamptz not null default now()
);

-- ============================================
-- OBLIGATIONS (Sirion's Obligation Tracking → Proposal Delivery Monitoring)
-- ============================================

create table obligations (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  lead_id uuid not null references leads(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,

  category obligation_category not null,
  title text not null,
  description text,
  status obligation_status not null default 'pending',

  -- What was promised
  promised_value jsonb,
  -- e.g. {"rooms": 200, "rate": 195, "room_type": "Superior Double"}
  -- e.g. {"space": "Grand Ballroom", "setup": "theater", "days": 3}

  -- What has been delivered/tracked
  actual_value jsonb,
  fulfillment_pct numeric default 0,

  -- Dates
  due_date date,
  fulfilled_at timestamptz,

  -- Ownership
  assigned_to uuid references users(id) on delete set null,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- CHAT MESSAGES (AskSupplierKit Conversational Interface)
-- ============================================

create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  session_id uuid not null default uuid_generate_v4(),

  role chat_role not null,
  content text not null,

  -- Agent context (what data the AI referenced)
  context_refs jsonb,
  -- e.g. {"proposals": ["id1","id2"], "leads": ["id3"], "properties": ["id4"]}

  -- If this message triggered an agent run
  agent_run_id uuid references agent_runs(id) on delete set null,

  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_playbooks_organization on playbooks(organization_id);
create index idx_agent_runs_organization on agent_runs(organization_id);
create index idx_agent_runs_type on agent_runs(agent_type);
create index idx_agent_runs_status on agent_runs(status);
create index idx_agent_runs_lead on agent_runs(lead_id);
create index idx_agent_runs_proposal on agent_runs(proposal_id);
create index idx_obligations_proposal on obligations(proposal_id);
create index idx_obligations_lead on obligations(lead_id);
create index idx_obligations_property on obligations(property_id);
create index idx_obligations_status on obligations(status);
create index idx_obligations_due_date on obligations(due_date);
create index idx_chat_messages_organization on chat_messages(organization_id);
create index idx_chat_messages_session on chat_messages(session_id);
create index idx_chat_messages_user on chat_messages(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table playbooks enable row level security;
alter table agent_runs enable row level security;
alter table obligations enable row level security;
alter table chat_messages enable row level security;

-- Playbooks: org-scoped
create policy "Users can view org playbooks"
  on playbooks for select
  using (organization_id = get_user_org_id());

create policy "Admins can manage playbooks"
  on playbooks for all
  using (organization_id = get_user_org_id())
  with check (organization_id = get_user_org_id());

-- Agent Runs: org-scoped
create policy "Users can view org agent runs"
  on agent_runs for select
  using (organization_id = get_user_org_id());

create policy "Users can create agent runs"
  on agent_runs for insert
  with check (organization_id = get_user_org_id());

create policy "Users can update own agent runs"
  on agent_runs for update
  using (organization_id = get_user_org_id());

-- Obligations: via proposal → property org scope
create policy "Users can view obligations"
  on obligations for select
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

create policy "Users can manage obligations"
  on obligations for all
  using (property_id in (select id from properties where organization_id = get_user_org_id()));

-- Chat Messages: org-scoped
create policy "Users can view org chat messages"
  on chat_messages for select
  using (organization_id = get_user_org_id());

create policy "Users can insert chat messages"
  on chat_messages for insert
  with check (organization_id = get_user_org_id());

-- ============================================
-- TRIGGERS
-- ============================================

create trigger set_updated_at before update on playbooks for each row execute function update_updated_at();
create trigger set_updated_at before update on obligations for each row execute function update_updated_at();
