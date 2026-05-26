-- RingsAway internal backoffice (clients, ops, usage, workflows)

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  business_type text,
  package_name text,
  monthly_fee numeric(10, 2) default 0,
  setup_fee numeric(10, 2) default 0,
  included_minutes int default 0,
  overage_rate numeric(10, 4) default 0,
  status text not null default 'active',
  payment_status text default 'current',
  notes text,
  onboarding_checklist jsonb not null default '{}'::jsonb,
  voc_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_integrations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  elevenlabs_agent_id text,
  elevenlabs_agent_url text,
  elevenlabs_phone_number_id text,
  n8n_booking_workflow_url text,
  n8n_cancel_workflow_url text,
  n8n_voc_workflow_url text,
  google_calendar_id text,
  twilio_number text,
  zadarma_number text,
  whatsapp_status text,
  booking_platform text,
  booking_platform_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id)
);

create table if not exists public.client_credentials (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  platform_name text not null,
  login_url text,
  username text,
  encrypted_password text,
  encrypted_api_key text,
  notes text,
  owner text,
  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.client_payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  amount numeric(10, 2),
  status text not null default 'pending',
  invoice_url text,
  due_date date,
  paid_date date,
  setup_fee_paid boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  month text not null,
  elevenlabs_agent_id text,
  elevenlabs_minutes numeric(10, 2) default 0,
  included_minutes int default 0,
  overage_minutes numeric(10, 2) default 0,
  overage_cost numeric(10, 2) default 0,
  sms_sent int default 0,
  emails_sent int default 0,
  bookings_created int default 0,
  cancellations_created int default 0,
  failed_workflows int default 0,
  created_at timestamptz not null default now(),
  unique (client_id, month)
);

create table if not exists public.workflow_health (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  workflow_name text not null,
  workflow_type text,
  workflow_url text,
  last_run timestamptz,
  status text,
  error_message text,
  health_status text default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Separate from product voc_reports (business_id) — backoffice VoC tracking per client
create table if not exists public.client_voc_reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  month text not null,
  public_token text,
  public_url text,
  status text not null default 'draft',
  report_json jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.client_bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  customer_name text,
  customer_email text,
  customer_phone text,
  booking_date timestamptz,
  booking_type text,
  calendar_event_id text,
  status text default 'confirmed',
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_workflow_health_client on public.workflow_health(client_id);
create unique index if not exists idx_workflow_health_client_name
  on public.workflow_health(client_id, workflow_name);
create index if not exists idx_usage_logs_client_month on public.usage_logs(client_id, month);
create index if not exists idx_client_bookings_client on public.client_bookings(client_id, created_at desc);

alter table public.clients enable row level security;
alter table public.client_integrations enable row level security;
alter table public.client_credentials enable row level security;
alter table public.client_payments enable row level security;
alter table public.usage_logs enable row level security;
alter table public.workflow_health enable row level security;
alter table public.client_voc_reports enable row level security;
alter table public.client_bookings enable row level security;

-- Admin-only via is_admin() for authenticated dashboard; service role bypasses RLS
drop policy if exists "admins manage clients" on public.clients;
create policy "admins manage clients" on public.clients
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage client_integrations" on public.client_integrations;
create policy "admins manage client_integrations" on public.client_integrations
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage client_credentials" on public.client_credentials;
create policy "admins manage client_credentials" on public.client_credentials
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage client_payments" on public.client_payments;
create policy "admins manage client_payments" on public.client_payments
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage usage_logs" on public.usage_logs;
create policy "admins manage usage_logs" on public.usage_logs
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage workflow_health" on public.workflow_health;
create policy "admins manage workflow_health" on public.workflow_health
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage client_voc_reports" on public.client_voc_reports;
create policy "admins manage client_voc_reports" on public.client_voc_reports
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage client_bookings" on public.client_bookings;
create policy "admins manage client_bookings" on public.client_bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed: RingsAway demo client
insert into public.clients (
  business_name,
  contact_name,
  contact_email,
  business_type,
  package_name,
  monthly_fee,
  setup_fee,
  included_minutes,
  overage_rate,
  status,
  payment_status,
  voc_enabled,
  notes,
  onboarding_checklist
)
select
  'RingsAway Demo / Internal Test Client',
  'Christopher Hunt',
  'hello@ringsaway.com',
  'Restaurant demo',
  'Receptionist + Insight',
  249,
  499,
  500,
  0.30,
  'active',
  'current',
  true,
  'Internal test client for product demos and backoffice QA.',
  jsonb_build_object(
    'contract_signed', true,
    'setup_fee_paid', true,
    'agent_created', true,
    'knowledge_base_added', true,
    'elevenlabs_tool_configured', false,
    'n8n_workflow_created', false,
    'calendar_connected', false,
    'phone_forwarding_tested', false,
    'sms_tested', false,
    'email_tested', false,
    'voc_report_enabled', true,
    'client_live', false
  )
where not exists (
  select 1 from public.clients where business_name = 'RingsAway Demo / Internal Test Client'
);

-- Link integrations row for seed client (if not exists)
insert into public.client_integrations (client_id)
select c.id from public.clients c
where c.business_name = 'RingsAway Demo / Internal Test Client'
  and not exists (
    select 1 from public.client_integrations i where i.client_id = c.id
  );

insert into public.client_payments (client_id, amount, status, setup_fee_paid)
select c.id, c.monthly_fee, 'paid', true
from public.clients c
where c.business_name = 'RingsAway Demo / Internal Test Client'
  and not exists (
    select 1 from public.client_payments p where p.client_id = c.id
  );

-- Usage minutes: always zero until ElevenLabs API sync (see elevenlabs-usage.ts).
insert into public.usage_logs (client_id, month, included_minutes, elevenlabs_minutes)
select c.id, to_char(now(), 'YYYY-MM'), c.included_minutes, 0
from public.clients c
where c.business_name = 'RingsAway Demo / Internal Test Client'
on conflict (client_id, month) do nothing;
