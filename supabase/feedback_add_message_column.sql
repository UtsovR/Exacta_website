-- Run this in Supabase SQL Editor to align feedback table with frontend insert payload.
alter table public.feedback add column if not exists message text;
alter table public.feedback add column if not exists page_path text;
alter table public.feedback add column if not exists rating smallint;
alter table public.feedback add column if not exists tags text[];
alter table public.feedback add column if not exists created_at timestamptz default now();
