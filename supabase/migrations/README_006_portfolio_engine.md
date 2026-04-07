# Migration 006 — moteur portefeuilles / fonds

Exécuter `006_portfolio_funds_engine.sql` dans le SQL Editor Supabase (après `005_model_portfolios.sql`).

## Contenu

- `portfolio_definitions` : les 5 profils (clé, nom, lien).
- `funds`, `fund_monthly_returns` : fonds importés et séries mensuelles reconstruites.
- `portfolio_holdings` : pondérations par portefeuille (`effective_from` pour versionner).
- `portfolio_snapshots` : résultats calculés (KPI + séries JSON).

## Données existantes

- Les lignes `model_portfolios` sont copiées en instantanés initiaux si aucun snapshot n’existe pour un profil.
- Le site continue de synchroniser `model_portfolios` après chaque recalcul (bannière / compat).

## Exploitation admin

1. Importer des PDF **fiches de fonds** (section Fonds) puis confirmer.
2. Définir la **composition** (somme = 100 %) par profil.
3. Utiliser **Recalculer tout** si besoin.

Les rendements mensuels sont dérivés des totaux annuels + AAJ (répartition géométrique), puis le portefeuille est mélangé mensuellement par pondération.
