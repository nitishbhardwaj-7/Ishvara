-- ====================================================================
-- ISHVARA — Supabase schema
--
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: every statement is idempotent.
--
-- Model: the app is read-only for listeners. Only emails listed in
-- `admins` can create, edit, or delete videos and songs (via the admin page).
-- Content goes live when `is_published` is true AND `publish_at` has passed,
-- so you can upload a week's worth at once and schedule one per day.
-- ====================================================================

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------
-- Admins (who may upload). Add your email after running this file:
--   insert into public.admins (email) values ('you@example.com');
-- --------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- --------------------------------------------------------------------
-- Videos (9:16 reels, hosted on Bunny Stream)
-- --------------------------------------------------------------------
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  deity text not null default 'Universal'
    check (deity in ('Shiva', 'Hanuman', 'Krishna', 'Universal')),
  source_context text not null default '',       -- e.g. "Bhagavad Gita 2.47"
  quote_sanskrit text,
  quote_translation text,
  bunny_video_id text,                            -- Bunny Stream GUID
  video_url text not null,                        -- HLS playlist or MP4 URL
  thumbnail_url text not null default '',
  duration_sec integer not null default 0,
  publish_at timestamptz not null default now(),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists videos_publish_at_idx on public.videos (publish_at desc);

-- --------------------------------------------------------------------
-- Songs (audio, hosted on Bunny Storage)
-- --------------------------------------------------------------------
create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default '',
  deity text not null default 'Universal'
    check (deity in ('Shiva', 'Hanuman', 'Krishna', 'Universal')),
  category text not null default 'Bhajans'
    check (category in ('Bhajans', 'Mantras', 'Aartis', 'Chants', 'Meditation')),
  audio_url text not null,
  cover_url text not null default '',
  duration_sec integer not null default 0,
  lyrics text,
  meaning text,
  publish_at timestamptz not null default now(),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists songs_publish_at_idx on public.songs (publish_at desc);

-- --------------------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.videos enable row level security;
alter table public.songs  enable row level security;

-- Admins table: an admin can see the list (used by the admin page to check access)
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Public (anonymous app users) can read only live content
drop policy if exists "public read live videos" on public.videos;
create policy "public read live videos" on public.videos
  for select using (is_published and publish_at <= now());

drop policy if exists "public read live songs" on public.songs;
create policy "public read live songs" on public.songs
  for select using (is_published and publish_at <= now());

-- --------------------------------------------------------------------
-- Ask Divya rate limiting (written only by the edge function's service role;
-- RLS on with no policies = no public access)
-- --------------------------------------------------------------------
create table if not exists public.ai_requests (
  id bigint generated always as identity primary key,
  client_key text not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_requests_client_idx on public.ai_requests (client_key, created_at desc);
alter table public.ai_requests enable row level security;

-- Admins can read everything (including scheduled/drafts) and write
drop policy if exists "admins manage videos" on public.videos;
create policy "admins manage videos" on public.videos
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage songs" on public.songs;
create policy "admins manage songs" on public.songs
  for all using (public.is_admin()) with check (public.is_admin());
