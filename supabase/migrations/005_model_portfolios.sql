-- Model portfolios performance banner
create table if not exists public.model_portfolios (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  ytd_2026 numeric(6,2) not null default 0,
  year_2025 numeric(6,2) not null default 0,
  href text not null,
  display_order int not null default 0,
  as_of_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_model_portfolios_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_model_portfolios_updated_at on public.model_portfolios;
create trigger trg_model_portfolios_updated_at
before update on public.model_portfolios
for each row
execute function public.touch_model_portfolios_updated_at();

insert into public.model_portfolios (key, name, ytd_2026, year_2025, href, display_order, as_of_date)
values
  ('prudent', 'Prudent', 4.2, 6.1, '/portefeuilles/prudent', 1, current_date),
  ('modere', 'Modere', 5.8, 8.4, '/portefeuilles/modere', 2, current_date),
  ('equilibre', 'Equilibre', 7.1, 10.2, '/portefeuilles/equilibre', 3, current_date),
  ('croissance', 'Croissance', 8.9, 12.7, '/portefeuilles/croissance', 4, current_date),
  ('audacieux', 'Audacieux', 10.4, 14.9, '/portefeuilles/audacieux', 5, current_date)
on conflict (key) do update set
  name = excluded.name,
  ytd_2026 = excluded.ytd_2026,
  year_2025 = excluded.year_2025,
  href = excluded.href,
  display_order = excluded.display_order;

alter table public.model_portfolios enable row level security;

drop policy if exists "model_portfolios_public_read" on public.model_portfolios;
create policy "model_portfolios_public_read"
on public.model_portfolios
for select
using (true);

drop policy if exists "model_portfolios_admin_write" on public.model_portfolios;
create policy "model_portfolios_admin_write"
on public.model_portfolios
for all
using (public.is_admin())
with check (public.is_admin());
