-- 012: Lecture publique des donnees portefeuilles (deploiement public AMF)
-- Ecriture et journal d'import restent admin-only (010 / 011).

-- model_portfolios : KPI affichés au public
drop policy if exists "model_portfolios_admin_read" on public.model_portfolios;
drop policy if exists "model_portfolios_public_read" on public.model_portfolios;
create policy "model_portfolios_public_read"
on public.model_portfolios
for select
using (true);

-- portfolio_definitions
drop policy if exists "portfolio_definitions_admin_read" on public.portfolio_definitions;
drop policy if exists "portfolio_definitions_public_read" on public.portfolio_definitions;
create policy "portfolio_definitions_public_read"
on public.portfolio_definitions
for select
using (true);

-- funds : perf des fonds actifs (tables de detail / ponderation)
drop policy if exists "funds_admin_read" on public.funds;
drop policy if exists "funds_public_read" on public.funds;
create policy "funds_public_read"
on public.funds
for select
using (is_active = true or public.is_admin());

-- portfolio_holdings
drop policy if exists "portfolio_holdings_admin_read" on public.portfolio_holdings;
drop policy if exists "portfolio_holdings_public_read" on public.portfolio_holdings;
create policy "portfolio_holdings_public_read"
on public.portfolio_holdings
for select
using (true);

-- portfolio_snapshots
drop policy if exists "portfolio_snapshots_admin_read" on public.portfolio_snapshots;
drop policy if exists "portfolio_snapshots_public_read" on public.portfolio_snapshots;
create policy "portfolio_snapshots_public_read"
on public.portfolio_snapshots
for select
using (true);

-- fund_monthly_returns : reste admin (non affiché sur le site public)
-- portfolio_import_logs : reste admin (011)
