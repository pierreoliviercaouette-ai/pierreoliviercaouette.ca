-- 011: Journal d'import CSV des performances (audit conformité)
create table if not exists public.portfolio_import_logs (
  id uuid primary key default gen_random_uuid(),
  imported_at timestamptz not null default now(),
  imported_by uuid references auth.users (id) on delete set null,
  filename text,
  as_of_date date,
  funds_parsed integer,
  funds_updated integer,
  portfolios_updated integer,
  missing_codes text[] default '{}',
  warnings jsonb default '[]'::jsonb,
  meta jsonb default '{}'::jsonb
);

create index if not exists portfolio_import_logs_imported_at_idx
  on public.portfolio_import_logs (imported_at desc);

alter table public.portfolio_import_logs enable row level security;

drop policy if exists "portfolio_import_logs_admin_all" on public.portfolio_import_logs;
create policy "portfolio_import_logs_admin_all"
on public.portfolio_import_logs
for all
using (public.is_admin())
with check (public.is_admin());
