-- FreshPath: Admin CRM, Scheduling, Client Portal, Invoicing
-- Run this in the Supabase SQL Editor (can re-run after dropping objects if needed)

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.job_status as enum (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.user_role as enum ('admin', 'client');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.invoice_status as enum (
    'draft',
    'sent',
    'paid',
    'void'
  );
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  address text,
  access_notes text,
  private_notes text,
  user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text,
  client_id uuid references public.clients (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  scheduled_date timestamptz not null,
  duration_hours numeric(4, 2) not null default 2,
  status public.job_status not null default 'scheduled',
  estimated_price numeric(10, 2),
  job_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  job_id uuid references public.jobs (id) on delete set null,
  amount numeric(10, 2) not null,
  status public.invoice_status not null default 'sent',
  due_date date,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists clients_full_name_idx on public.clients (full_name);
create index if not exists clients_user_id_idx on public.clients (user_id);
create index if not exists jobs_client_id_idx on public.jobs (client_id);
create index if not exists jobs_scheduled_date_idx on public.jobs (scheduled_date);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists invoices_client_id_idx on public.invoices (client_id);
create index if not exists invoices_status_idx on public.invoices (status);
create index if not exists profiles_client_id_idx on public.profiles (client_id);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.my_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.client_id from public.profiles p where p.id = auth.uid();
$$;

-- Auto-create a client profile when a new auth user signs up (defaults to client).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    'client',
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.clients enable row level security;
alter table public.jobs enable row level security;
alter table public.invoices enable row level security;
alter table public.profiles enable row level security;

-- Profiles
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can insert profiles" on public.profiles;
create policy "Admins can insert profiles"
  on public.profiles for insert to authenticated
  with check (public.is_admin() or id = auth.uid());

-- Clients
drop policy if exists "Admin full access clients" on public.clients;
drop policy if exists "Authenticated users can select clients" on public.clients;
drop policy if exists "Authenticated users can insert clients" on public.clients;
drop policy if exists "Authenticated users can update clients" on public.clients;
drop policy if exists "Authenticated users can delete clients" on public.clients;

create policy "Admin full access clients"
  on public.clients for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Clients can read own client row"
  on public.clients for select to authenticated
  using (id = public.my_client_id() or user_id = auth.uid());

create policy "Clients can update own contact fields"
  on public.clients for update to authenticated
  using (id = public.my_client_id() or user_id = auth.uid())
  with check (id = public.my_client_id() or user_id = auth.uid());

-- Jobs
drop policy if exists "Authenticated users can select jobs" on public.jobs;
drop policy if exists "Authenticated users can insert jobs" on public.jobs;
drop policy if exists "Authenticated users can update jobs" on public.jobs;
drop policy if exists "Authenticated users can delete jobs" on public.jobs;

create policy "Admin full access jobs"
  on public.jobs for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Clients can read own jobs"
  on public.jobs for select to authenticated
  using (client_id = public.my_client_id());

create policy "Clients can book jobs"
  on public.jobs for insert to authenticated
  with check (client_id = public.my_client_id());

-- Invoices
create policy "Admin full access invoices"
  on public.invoices for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Clients can read own invoices"
  on public.invoices for select to authenticated
  using (client_id = public.my_client_id());
