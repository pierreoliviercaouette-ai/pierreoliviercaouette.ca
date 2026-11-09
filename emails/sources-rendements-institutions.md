# Sources — moyennes institutions vs Portefeuilles Modèles iA

Horizon : rendement net annualisé **5 ans**, séries grand public (A / Investor / Conseiller), CAD.  
Compilation : **novembre 2026** (données principalement au **30 septembre 2026**). Les dates exactes des feuillets varient selon l’émetteur.

## Portefeuilles Modèles iA (référence)

- **Site `/portefeuilles` + comparateur** : KPI sync Supabase admin (live).
- **Landing `/jemcee` uniquement** : snapshot pondéré du CSV iA  
  `performance-fonds-2026_09_30` (Série Classique 75/75), pour coller à la même date
  que les moyennes banques ci-dessous.

| Profil | 5 ans jemcee (CSV 30 sept. 2026) |
|---|---|
| Prudent | **4,7 %** |
| Modéré | **7,3 %** |
| Équilibré | **9,6 %** |
| Croissance | **12,3 %** |
| Audacieux | **15,5 %** |

## Échantillon institutions (succursale / wrap)

### Prudent (~conservateur)

| Produit | 5 ans | Date / note |
|---|---|---|
| BMO SelectTrust Conservative, Advisor | 2,94 % | 31 oct. 2026 (BMO) |
| Méritage Conservateur (BNI), NBC7411 Advisor | 1,63 % | 30 sept. 2026 |
| RBC Select Conservative, série A | 4,51 % | 30 sept. 2026 (Fund Library) |
| **Moyenne utilisée** | **~3,0 %** | (2,94 + 1,63 + 4,51) / 3 |

### Modéré

Pas de série « Modéré » uniforme chez toutes les banques.  
**Moyenne utilisée : ~4,4 %** = milieu entre moyenne Prudent (3,0 %) et Équilibré (5,7 %).

### Équilibré

| Produit | 5 ans | Date / note |
|---|---|---|
| Desjardins Équilibré Québec, cat. A | 5,60 % | 30 sept. 2026 (Fund Library) |
| Portefeuille Équilibré BNI NBC6424 | 5,94 % | 30 sept. 2026 |
| BMO SelectTrust Balanced, série A | 5,90 % | 30 sept. 2026 (Fund Library) |
| TD Comfort Balanced, Investor | 4,57 % | 30 sept. 2026 (Fund Library) |
| RBC Select Balanced, série A | 6,61 % | 30 sept. 2026 (Fund Library) |
| **Moyenne utilisée** | **~5,7 %** | (5,60 + 5,94 + 5,90 + 4,57 + 6,61) / 5 |

### Croissance

| Produit | 5 ans | Date / note |
|---|---|---|
| BMO SelectTrust Growth, série A | 8,53 % | 30 sept. 2026 (Fund Library) |
| TD Comfort Growth, Investor | 8,68 % | 30 sept. 2026 (Fund Library) |
| RBC Select Growth, série A | 8,23 % | 30 sept. 2026 (Fund Library) |
| Méritage Croissance (BNI) NBC7414 Advisor | 6,83 % | 30 sept. 2026 |
| **Moyenne utilisée** | **~8,1 %** | (8,53 + 8,68 + 8,23 + 6,83) / 4 |

### Audacieux (~croissance agressive / actions)

| Produit | 5 ans | Date / note |
|---|---|---|
| BMO SelectTrust Equity Growth, série A | 10,60 % | 30 sept. 2026 (Fund Library) |
| TD Comfort Aggressive Growth, Investor | 10,79 % | 30 sept. 2026 (Fund Library) |
| RBC Select Aggressive Growth, série A | 11,44 % | 30 sept. 2026 (Fund Library) |
| **Moyenne utilisée** | **~10,9 %** | (10,60 + 10,79 + 11,44) / 3 |

## Tableau final (landing jemcee — même as-of)

| Profil | Moyenne banques | Modèles iA (CSV 30 sept.) |
|---|---|---|
| Prudent | ~3,0 % | 4,7 % |
| Modéré | ~4,4 % | 7,3 % |
| Équilibré | ~5,7 % | 9,6 % |
| Croissance | ~8,1 % | 12,3 % |
| Audacieux | ~10,9 % | 15,5 % |

## Limites (conformité)

- Comparaison **illustrative** entre familles de produits différentes (allocation, MER, style de gestion, garanties).
- Les séries F / conseil auraient souvent des frais plus bas → rendements nets plus élevés côté banques.
- Les dates ne sont pas toutes synchronisées au jour près.
- Les rendements passés ne garantissent pas les rendements futurs.
- Ne pas nommer une banque précise dans le courriel client si la conformité interne le déconseille ; « moyenne des grandes institutions » suffit.
