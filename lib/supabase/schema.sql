-- Dartstudio Supabase schema
-- Run in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor → New query

create extension if not exists "uuid-ossp";

-- ============================================
-- Contact form submissions
-- ============================================
create table if not exists contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  collaboration_model text not null,
  message text not null,
  budget_range text,
  start_timeline text,
  locale text not null default 'id',
  ip_address text,
  user_agent text,
  resend_message_id text,
  status text not null default 'received'
    check (status in ('received', 'replied', 'declined', 'spam'))
);

create index contact_submissions_created_at_idx on contact_submissions(created_at desc);
create index contact_submissions_status_idx on contact_submissions(status);
create index contact_submissions_model_idx on contact_submissions(collaboration_model);

-- ============================================
-- Waitlist signups
-- ============================================
create table if not exists waitlist_signups (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  product_slug text not null,
  email text not null,
  name text,
  locale text not null default 'id',
  ip_address text,
  user_agent text,
  notified_at timestamptz,
  unique (product_slug, email)
);

create index waitlist_signups_product_idx on waitlist_signups(product_slug);
create index waitlist_signups_created_at_idx on waitlist_signups(created_at desc);

-- ============================================
-- Rate limit log
-- ============================================
create table if not exists rate_limit_events (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  ip_address text not null,
  endpoint text not null,
  blocked boolean not null default false
);

create index rate_limit_events_ip_created_idx on rate_limit_events(ip_address, created_at desc);

-- ============================================
-- Row Level Security
-- ============================================
alter table contact_submissions enable row level security;
alter table waitlist_signups enable row level security;
alter table rate_limit_events enable row level security;

-- Allow anon to insert (server routes use service_role which bypasses RLS)
create policy "anon can insert contact"
  on contact_submissions for insert to anon with check (true);

create policy "anon can insert waitlist"
  on waitlist_signups for insert to anon with check (true);
