-- Phase 1: House Cleaning Admin CRM + Scheduling
-- Run this in the Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.job_status as enum (
  'scheduled',
  'in_progress',
  'completed',
  'cancelled'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  address text,
  access_notes text,
  private_notes text,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  scheduled_date timestamptz not null,
  duration_hours numeric(4, 2) not null default 2,
  status public.job_status not null default 'scheduled',
  estimated_price numeric(10, 2),
  job_notes text,
  created_at timestamptz not null default now()
);

create index clients_full_name_idx on public.clients (full_name);
create index jobs_client_id_idx on public.jobs (client_id);
create index jobs_scheduled_date_idx on public.jobs (scheduled_date);
create index jobs_status_idx on public.jobs (status);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Admin is the only authenticated user for Phase 1.
-- Authenticated users get full access; anonymous users have none.
-- ---------------------------------------------------------------------------
alter table public.clients enable row level security;
alter table public.jobs enable row level security;

create policy "Authenticated users can select clients"
  on public.clients
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert clients"
  on public.clients
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update clients"
  on public.clients
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete clients"
  on public.clients
  for delete
  to authenticated
  using (true);

create policy "Authenticated users can select jobs"
  on public.jobs
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert jobs"
  on public.jobs
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update jobs"
  on public.jobs
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete jobs"
  on public.jobs
  for delete
  to authenticated
  using (true);
