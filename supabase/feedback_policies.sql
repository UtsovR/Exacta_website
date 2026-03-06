-- Feedback RLS policies for public submission and admin-only read/write.
-- Apply in Supabase SQL Editor.

alter table public.feedback enable row level security;

grant insert on table public.feedback to anon, authenticated;
grant select, update, delete on table public.feedback to authenticated;

drop policy if exists feedback_insert_public on public.feedback;
drop policy if exists feedback_select_admin on public.feedback;
drop policy if exists feedback_update_admin on public.feedback;
drop policy if exists feedback_delete_admin on public.feedback;

do $$
declare
  policy_name text;
begin
  for policy_name in
    select pol.polname
    from pg_policy pol
    join pg_class cls on cls.oid = pol.polrelid
    join pg_namespace nsp on nsp.oid = cls.relnamespace
    where nsp.nspname = 'public'
      and cls.relname = 'feedback'
      and pol.polcmd = 'r'
      and (
        0 = any(pol.polroles)
        or 'anon'::regrole::oid = any(pol.polroles)
      )
  loop
    execute format('drop policy if exists %I on public.feedback', policy_name);
  end loop;
end
$$;

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

create policy feedback_update_admin
  on public.feedback
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  )
  with check (
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
