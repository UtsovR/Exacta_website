-- Feedback table + RLS policies for public insert and admin-only read/delete
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text null,
  email text null,
  tags text[] not null default '{}',
  message text null,
  rating int not null default 0,
  page_path text null,
  user_agent text null
);

alter table public.feedback add column if not exists name text null;
alter table public.feedback add column if not exists email text null;
alter table public.feedback add column if not exists tags text[] not null default '{}';
alter table public.feedback add column if not exists message text null;
alter table public.feedback add column if not exists rating int not null default 0;
alter table public.feedback add column if not exists page_path text null;
alter table public.feedback add column if not exists user_agent text null;

alter table public.feedback alter column tags set default '{}';
alter table public.feedback alter column rating set default 0;

alter table public.feedback drop constraint if exists feedback_rating_check;
alter table public.feedback add constraint feedback_rating_check check (rating between 0 and 5);

alter table public.feedback enable row level security;

grant insert on table public.feedback to anon, authenticated;
grant select, delete on table public.feedback to authenticated;

drop policy if exists feedback_insert_public on public.feedback;
create policy feedback_insert_public
  on public.feedback
  for insert
  to anon, authenticated
  with check (true);

create policy feedback_select_admin
  on public.feedback
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );

create policy feedback_delete_admin
  on public.feedback
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );
