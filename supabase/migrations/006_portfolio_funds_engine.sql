-- Portfolio engine: funds, monthly returns, holdings, computed snapshots
-- Requires: public.is_admin() from earlier migrations

-- 1) Portfolio definitions (5 profils modeles)
create table if not exists public.portfolio_definitions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  href text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_portfolio_definitions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_portfolio_definitions_updated on public.portfolio_definitions;
create trigger trg_portfolio_definitions_updated
before update on public.portfolio_definitions
for each row execute function public.touch_portfolio_definitions_updated_at();

-- 2) Fonds importes (fiches PDF)
create table if not exists public.funds (
  id uuid primary key default gen_random_uuid(),
  external_code text,
  name text not null,
  category text,
  source text default 'pdf_import',
  is_active boolean not null default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists funds_name_idx on public.funds (lower(name));
create unique index if not exists funds_external_code_unique
  on public.funds (external_code)
  where external_code is not null and length(trim(external_code)) > 0;

-- 3) Rendements mensuels par fonds (base du moteur time-series)
create table if not exists public.fund_monthly_returns (
  id uuid primary key default gen_random_uuid(),
  fund_id uuid not null references public.funds(id) on delete cascade,
  month_date date not null,
  return_pct numeric(12,6) not null,
  created_at timestamptz not null default now(),
  unique (fund_id, month_date)
);

create index if not exists fund_monthly_returns_fund_month on public.fund_monthly_returns (fund_id, month_date);

-- 4) Composition ponderee des portefeuilles modeles
create table if not exists public.portfolio_holdings (
  id uuid primary key default gen_random_uuid(),
  portfolio_definition_id uuid not null references public.portfolio_definitions(id) on delete cascade,
  fund_id uuid not null references public.funds(id) on delete restrict,
  weight_pct numeric(8,4) not null check (weight_pct > 0 and weight_pct <= 100),
  sort_order int not null default 0,
  effective_from date not null default current_date,
  created_at timestamptz not null default now(),
  unique (portfolio_definition_id, fund_id, effective_from)
);

create index if not exists portfolio_holdings_portfolio on public.portfolio_holdings (portfolio_definition_id);

-- 5) Snapshots calcules (KPI + serie pour graphiques)
create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  portfolio_definition_id uuid not null references public.portfolio_definitions(id) on delete cascade,
  computed_at timestamptz not null default now(),
  as_of_date date,
  ytd_pct numeric(12,6),
  prev_civil_year int,
  prev_civil_year_pct numeric(12,6),
  rolling_1y_pct numeric(12,6),
  rolling_3y_pct numeric(12,6),
  rolling_5y_pct numeric(12,6),
  rolling_10y_pct numeric(12,6),
  wealth_series jsonb default '[]'::jsonb,
  monthly_series jsonb default '[]'::jsonb,
  meta jsonb default '{}'::jsonb
);

create index if not exists portfolio_snapshots_portfolio_computed
  on public.portfolio_snapshots (portfolio_definition_id, computed_at desc);

-- Seed definitions + mirror existing model_portfolios if present
insert into public.portfolio_definitions (key, name, href, display_order)
values
  ('prudent', 'Prudent', '/portefeuilles/prudent', 1),
  ('modere', 'Modere', '/portefeuilles/modere', 2),
  ('equilibre', 'Equilibre', '/portefeuilles/equilibre', 3),
  ('croissance', 'Croissance', '/portefeuilles/croissance', 4),
  ('audacieux', 'Audacieux', '/portefeuilles/audacieux', 5)
on conflict (key) do update set
  name = excluded.name,
  href = excluded.href,
  display_order = excluded.display_order;

-- Initial snapshots from legacy model_portfolios (one row per definition if none yet)
insert into public.portfolio_snapshots (
  portfolio_definition_id,
  as_of_date,
  ytd_pct,
  prev_civil_year,
  prev_civil_year_pct
)
select
  d.id,
  coalesce(m.as_of_date, current_date),
  m.ytd_2026,
  extract(year from coalesce(m.as_of_date, current_date))::int - 1,
  m.year_2025
from public.model_portfolios m
join public.portfolio_definitions d on d.key = m.key
where not exists (
  select 1 from public.portfolio_snapshots s where s.portfolio_definition_id = d.id
);

-- If model_portfolios empty, insert placeholder zeros
insert into public.portfolio_snapshots (portfolio_definition_id, as_of_date, ytd_pct, prev_civil_year, prev_civil_year_pct)
select d.id, current_date, 0, extract(year from current_date)::int - 1, 0
from public.portfolio_definitions d
where not exists (
  select 1 from public.portfolio_snapshots s where s.portfolio_definition_id = d.id
);

-- RLS
alter table public.portfolio_definitions enable row level security;
alter table public.funds enable row level security;
alter table public.fund_monthly_returns enable row level security;
alter table public.portfolio_holdings enable row level security;
alter table public.portfolio_snapshots enable row level security;

drop policy if exists "portfolio_definitions_public_read" on public.portfolio_definitions;
create policy "portfolio_definitions_public_read"
on public.portfolio_definitions for select using (true);

drop policy if exists "portfolio_definitions_admin_write" on public.portfolio_definitions;
create policy "portfolio_definitions_admin_write"
on public.portfolio_definitions for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "funds_public_read" on public.funds;
create policy "funds_public_read"
on public.funds for select using (is_active = true or public.is_admin());

drop policy if exists "funds_admin_write" on public.funds;
create policy "funds_admin_write"
on public.funds for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "fund_monthly_returns_public_read" on public.fund_monthly_returns;
create policy "fund_monthly_returns_public_read"
on public.fund_monthly_returns for select using (
  exists (select 1 from public.funds f where f.id = fund_id and (f.is_active or public.is_admin()))
);

drop policy if exists "fund_monthly_returns_admin_write" on public.fund_monthly_returns;
create policy "fund_monthly_returns_admin_write"
on public.fund_monthly_returns for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "portfolio_holdings_public_read" on public.portfolio_holdings;
create policy "portfolio_holdings_public_read"
on public.portfolio_holdings for select using (true);

drop policy if exists "portfolio_holdings_admin_write" on public.portfolio_holdings;
create policy "portfolio_holdings_admin_write"
on public.portfolio_holdings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "portfolio_snapshots_public_read" on public.portfolio_snapshots;
create policy "portfolio_snapshots_public_read"
on public.portfolio_snapshots for select using (true);

drop policy if exists "portfolio_snapshots_admin_write" on public.portfolio_snapshots;
create policy "portfolio_snapshots_admin_write"
on public.portfolio_snapshots for all using (public.is_admin()) with check (public.is_admin());
