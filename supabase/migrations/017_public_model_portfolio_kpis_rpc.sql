-- 017: KPI portefeuilles modèles lisibles par anon (comparateur / jemcee)
-- Contourne un RLS admin-only (010) non remplacé par 012 en production.

create or replace function public.get_public_model_portfolio_kpis()
returns table (
  key text,
  name text,
  ytd_2026 numeric,
  year_2025 numeric,
  annualized_3y numeric,
  annualized_5y numeric,
  as_of_date date,
  href text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    m.key,
    m.name,
    m.ytd_2026,
    m.year_2025,
    m.annualized_3y,
    m.annualized_5y,
    m.as_of_date,
    m.href
  from public.model_portfolios m
  order by m.display_order;
$$;

revoke all on function public.get_public_model_portfolio_kpis() from public;
grant execute on function public.get_public_model_portfolio_kpis() to anon, authenticated;
