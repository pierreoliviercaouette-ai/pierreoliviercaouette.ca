-- 009: enrich portfolio definitions + fund performance snapshot columns + seed holdings
-- Requires: 006_portfolio_funds_engine.sql

alter table public.portfolio_definitions
  add column if not exists philosophy jsonb default '{}'::jsonb,
  add column if not exists asset_allocation jsonb default '[]'::jsonb,
  add column if not exists mer_pct numeric(8,4);

alter table public.funds
  add column if not exists ytd_pct numeric(12,6),
  add column if not exists prev_year_pct numeric(12,6),
  add column if not exists one_year_pct numeric(12,6),
  add column if not exists three_year_pct numeric(12,6),
  add column if not exists five_year_pct numeric(12,6),
  add column if not exists ten_year_pct numeric(12,6),
  add column if not exists nav numeric(14,6),
  add column if not exists perf_as_of date;

-- Seed / refresh fund catalogue
insert into public.funds (external_code, name, category, source, is_active, metadata)
select v.external_code, v.name, v.category, 'seed_009', true, v.metadata
from (values
  ('FU021', 'Obligations de sociétés canadiennes (iA)', 'Fonds de revenu', '{"fiche":"/fiches-fonds/FU021.pdf"}'::jsonb),
  ('FU762', 'Stratégie d''obligations de sociétés (iA) - SPÉCIALISÉ', 'Fonds de revenu', '{"fiche":"/fiches-fonds/FU762.pdf"}'::jsonb),
  ('FU920', 'Fidelity Revenu mensuel mondial', 'Fonds diversifiés', '{"fiche":"/fiches-fonds/FU920.pdf"}'::jsonb),
  ('FU870', 'Actions canadiennes à petite capitalisation (iA)', 'Fonds d''actions canadiennes', '{"fiche":"/fiches-fonds/FU870.pdf"}'::jsonb),
  ('FU707', 'Actions mondiales (iA)', 'Fonds d''actions américaines et internationales', '{"fiche":"/fiches-fonds/FU707.pdf"}'::jsonb),
  ('FU705', 'Actions américaines (iA)', 'Fonds d''actions américaines et internationales', '{"fiche":"/fiches-fonds/FU705.pdf"}'::jsonb),
  ('FU607', 'Fidelity Innovations mondiales', 'Fonds spécialisés', '{"fiche":"/fiches-fonds/FU607.pdf"}'::jsonb),
  ('FU280', 'Potentiel Canada Fidelity', 'Fonds d''actions canadiennes', '{"fiche":"/fiches-fonds/FU280.pdf"}'::jsonb),
  ('FU505', 'Asie pacifique (iA)', 'Fonds spécialisés', '{}'::jsonb),
  ('FU530', 'Diversifié mondial (Loomis Sayles)', 'Fonds diversifiés', '{"fiche":"/fiches-fonds/FU530.pdf"}'::jsonb)
) as v(external_code, name, category, metadata)
where not exists (
  select 1 from public.funds f where f.external_code = v.external_code
);

update public.funds f set
  name = v.name,
  category = v.category,
  metadata = coalesce(f.metadata, '{}'::jsonb) || v.metadata,
  updated_at = now()
from (values
  ('FU021', 'Obligations de sociétés canadiennes (iA)', 'Fonds de revenu', '{"fiche":"/fiches-fonds/FU021.pdf"}'::jsonb),
  ('FU762', 'Stratégie d''obligations de sociétés (iA) - SPÉCIALISÉ', 'Fonds de revenu', '{"fiche":"/fiches-fonds/FU762.pdf"}'::jsonb),
  ('FU920', 'Fidelity Revenu mensuel mondial', 'Fonds diversifiés', '{"fiche":"/fiches-fonds/FU920.pdf"}'::jsonb),
  ('FU870', 'Actions canadiennes à petite capitalisation (iA)', 'Fonds d''actions canadiennes', '{"fiche":"/fiches-fonds/FU870.pdf"}'::jsonb),
  ('FU707', 'Actions mondiales (iA)', 'Fonds d''actions américaines et internationales', '{"fiche":"/fiches-fonds/FU707.pdf"}'::jsonb),
  ('FU705', 'Actions américaines (iA)', 'Fonds d''actions américaines et internationales', '{"fiche":"/fiches-fonds/FU705.pdf"}'::jsonb),
  ('FU607', 'Fidelity Innovations mondiales', 'Fonds spécialisés', '{"fiche":"/fiches-fonds/FU607.pdf"}'::jsonb),
  ('FU280', 'Potentiel Canada Fidelity', 'Fonds d''actions canadiennes', '{"fiche":"/fiches-fonds/FU280.pdf"}'::jsonb),
  ('FU505', 'Asie pacifique (iA)', 'Fonds spécialisés', '{}'::jsonb),
  ('FU530', 'Diversifié mondial (Loomis Sayles)', 'Fonds diversifiés', '{"fiche":"/fiches-fonds/FU530.pdf"}'::jsonb)
) as v(external_code, name, category, metadata)
where f.external_code = v.external_code;

-- Enrich definitions (philosophy + allocation + MER)
update public.portfolio_definitions set
  mer_pct = 2.50,
  philosophy = '{"summary":"Prioriser la préservation du capital et un revenu plus stable, avec une exposition limitée aux actions.","bullets":["Horizon typique plus court ou tolérance au risque faible","Accent sur le revenu fixe et la diversification prudente","Convient si la stabilité prime sur la croissance maximale"]}'::jsonb,
  asset_allocation = '[{"key":"revenu_fixe","label":"Revenu fixe","pct":69},{"key":"actions_ca","label":"Actions canadiennes","pct":6},{"key":"actions_us","label":"Actions américaines","pct":14},{"key":"actions_intl","label":"Actions internationales","pct":8},{"key":"liquidites","label":"Liquidités","pct":3}]'::jsonb
where key = 'prudent';

update public.portfolio_definitions set
  mer_pct = 2.65,
  name = 'Modéré',
  philosophy = '{"summary":"Équilibrer protection et croissance modérée : une majorité de revenu fixe, avec une part d''actions pour participer aux marchés.","bullets":["Tolérance au risque faible à moyenne","Revenu fixe dominant, actions en soutien","Objectif : progression progressive du capital sans trop de volatilité"]}'::jsonb,
  asset_allocation = '[{"key":"revenu_fixe","label":"Revenu fixe","pct":52},{"key":"actions_ca","label":"Actions canadiennes","pct":11},{"key":"actions_us","label":"Actions américaines","pct":21},{"key":"actions_intl","label":"Actions internationales","pct":13},{"key":"liquidites","label":"Liquidités","pct":3}]'::jsonb
where key = 'modere';

update public.portfolio_definitions set
  mer_pct = 2.77,
  name = 'Équilibré',
  philosophy = '{"summary":"Chercher un équilibre entre croissance et protection, avec une plus grande part en actions tout en conservant une base de revenu fixe.","bullets":["Tolérance au risque moyenne","Mix actions / revenu fixe pour lisser les cycles","Horizon de placement moyen à long terme"]}'::jsonb,
  asset_allocation = '[{"key":"revenu_fixe","label":"Revenu fixe","pct":34},{"key":"actions_ca","label":"Actions canadiennes","pct":20},{"key":"actions_us","label":"Actions américaines","pct":27},{"key":"actions_intl","label":"Actions internationales","pct":18},{"key":"liquidites","label":"Liquidités","pct":1}]'::jsonb
where key = 'equilibre';

update public.portfolio_definitions set
  mer_pct = 2.81,
  philosophy = '{"summary":"Viser la croissance du capital sur le long terme, avec une forte composante actions et une part moindre de revenu fixe.","bullets":["Tolérance au risque moyenne à élevée","Acceptation de la volatilité en échange d''un potentiel de rendement plus élevé","Horizon long terme recommandé"]}'::jsonb,
  asset_allocation = '[{"key":"revenu_fixe","label":"Revenu fixe","pct":24},{"key":"actions_ca","label":"Actions canadiennes","pct":26},{"key":"actions_us","label":"Actions américaines","pct":36},{"key":"actions_intl","label":"Actions internationales","pct":12},{"key":"liquidites","label":"Liquidités","pct":2}]'::jsonb
where key = 'croissance';

update public.portfolio_definitions set
  mer_pct = 2.95,
  philosophy = '{"summary":"Maximiser le potentiel de croissance à long terme avec un portefeuille quasi entièrement en actions.","bullets":["Tolérance au risque élevée","Peu ou pas de revenu fixe — forte exposition actions","Convient à un horizon long et à une capacité d''absorber les baisses de marché"]}'::jsonb,
  asset_allocation = '[{"key":"revenu_fixe","label":"Revenu fixe","pct":0},{"key":"actions_ca","label":"Actions canadiennes","pct":31},{"key":"actions_us","label":"Actions américaines","pct":45},{"key":"actions_intl","label":"Actions internationales","pct":24},{"key":"liquidites","label":"Liquidités","pct":0}]'::jsonb
where key = 'audacieux';

-- Seed holdings for effective_from = 2026-06-30 (replace prior seed for that date)
delete from public.portfolio_holdings
where effective_from = date '2026-06-30';

insert into public.portfolio_holdings (portfolio_definition_id, fund_id, weight_pct, sort_order, effective_from)
select d.id, f.id, h.weight_pct, h.sort_order, date '2026-06-30'
from (values
  ('prudent', 'FU021', 30.0, 1),
  ('prudent', 'FU762', 30.0, 2),
  ('prudent', 'FU920', 25.0, 3),
  ('prudent', 'FU870', 5.0, 4),
  ('prudent', 'FU707', 5.0, 5),
  ('prudent', 'FU607', 5.0, 6),
  ('modere', 'FU021', 20.0, 1),
  ('modere', 'FU762', 20.0, 2),
  ('modere', 'FU920', 30.0, 3),
  ('modere', 'FU870', 10.0, 4),
  ('modere', 'FU707', 10.0, 5),
  ('modere', 'FU607', 10.0, 6),
  ('equilibre', 'FU021', 20.0, 1),
  ('equilibre', 'FU920', 30.0, 2),
  ('equilibre', 'FU870', 20.0, 3),
  ('equilibre', 'FU707', 20.0, 4),
  ('equilibre', 'FU607', 10.0, 5),
  ('croissance', 'FU021', 10.0, 1),
  ('croissance', 'FU762', 10.0, 2),
  ('croissance', 'FU920', 10.0, 3),
  ('croissance', 'FU870', 15.0, 4),
  ('croissance', 'FU280', 10.0, 5),
  ('croissance', 'FU707', 10.0, 6),
  ('croissance', 'FU705', 10.0, 7),
  ('croissance', 'FU607', 25.0, 8),
  ('audacieux', 'FU870', 20.0, 1),
  ('audacieux', 'FU280', 10.0, 2),
  ('audacieux', 'FU707', 15.0, 3),
  ('audacieux', 'FU705', 15.0, 4),
  ('audacieux', 'FU607', 30.0, 5),
  ('audacieux', 'FU505', 10.0, 6)
) as h(portfolio_key, fund_code, weight_pct, sort_order)
join public.portfolio_definitions d on d.key = h.portfolio_key
join public.funds f on f.external_code = h.fund_code;

-- Sync legacy model_portfolios KPI defaults (illustration 30 juin 2026)
update public.model_portfolios set
  name = 'Prudent', ytd_2026 = 6.69, year_2025 = 8.13, annualized_3y = 10.77, annualized_5y = 4.99, as_of_date = date '2026-06-30'
where key = 'prudent';
update public.model_portfolios set
  name = 'Modéré', ytd_2026 = 10.33, year_2025 = 11.56, annualized_3y = 14.96, annualized_5y = 7.46, as_of_date = date '2026-06-30'
where key = 'modere';
update public.model_portfolios set
  name = 'Équilibré', ytd_2026 = 12.66, year_2025 = 16.10, annualized_3y = 18.62, annualized_5y = 9.71, as_of_date = date '2026-06-30'
where key = 'equilibre';
update public.model_portfolios set
  name = 'Croissance', ytd_2026 = 17.98, year_2025 = 16.61, annualized_3y = 23.09, annualized_5y = 12.30, as_of_date = date '2026-06-30'
where key = 'croissance';
update public.model_portfolios set
  name = 'Audacieux', ytd_2026 = 23.79, year_2025 = 20.93, annualized_3y = 28.83, annualized_5y = 15.03, as_of_date = date '2026-06-30'
where key = 'audacieux';
