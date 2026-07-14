-- 010: Restreindre la lecture des données de performance portefeuilles aux admins (AMF / pub).
-- UI déjà admin-only ; cette migration empêche l'accès anonyme via l'API Supabase.

-- model_portfolios
drop policy if exists "model_portfolios_public_read" on public.model_portfolios;
drop policy if exists "model_portfolios_admin_read" on public.model_portfolios;
create policy "model_portfolios_admin_read"
on public.model_portfolios
for select
using (public.is_admin());

-- portfolio_definitions
drop policy if exists "portfolio_definitions_public_read" on public.portfolio_definitions;
drop policy if exists "portfolio_definitions_admin_read" on public.portfolio_definitions;
create policy "portfolio_definitions_admin_read"
on public.portfolio_definitions
for select
using (public.is_admin());

-- funds
drop policy if exists "funds_public_read" on public.funds;
drop policy if exists "funds_admin_read" on public.funds;
create policy "funds_admin_read"
on public.funds
for select
using (public.is_admin());

-- fund_monthly_returns
drop policy if exists "fund_monthly_returns_public_read" on public.fund_monthly_returns;
drop policy if exists "fund_monthly_returns_admin_read" on public.fund_monthly_returns;
create policy "fund_monthly_returns_admin_read"
on public.fund_monthly_returns
for select
using (public.is_admin());

-- portfolio_holdings
drop policy if exists "portfolio_holdings_public_read" on public.portfolio_holdings;
drop policy if exists "portfolio_holdings_admin_read" on public.portfolio_holdings;
create policy "portfolio_holdings_admin_read"
on public.portfolio_holdings
for select
using (public.is_admin());

-- portfolio_snapshots
drop policy if exists "portfolio_snapshots_public_read" on public.portfolio_snapshots;
drop policy if exists "portfolio_snapshots_admin_read" on public.portfolio_snapshots;
create policy "portfolio_snapshots_admin_read"
on public.portfolio_snapshots
for select
using (public.is_admin());
