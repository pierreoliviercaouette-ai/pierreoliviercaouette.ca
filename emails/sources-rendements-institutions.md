# Sources — moyennes institutions vs Portefeuilles Modèles iA

Horizon : rendement net annualisé **5 ans**, séries grand public (A / Investor / Conseiller), CAD.  
Compilation : juillet 2026. Les dates exactes des feuillets varient selon l’émetteur.

## Portefeuilles Modèles iA (référence)

Source : `frontend/src/data/modelPortfolios.js` — au **30 juin 2026**, série Classique 75/75.

| Profil | 5 ans |
|---|---|
| Prudent | 4,99 % → **5,0 %** |
| Modéré | 7,46 % → **7,5 %** |
| Équilibré | 9,71 % → **9,7 %** |
| Croissance | 12,30 % → **12,3 %** |
| Audacieux | 15,03 % → **15,0 %** |

## Échantillon institutions (succursale / wrap)

### Prudent (~conservateur)

| Produit | 5 ans | Date / note |
|---|---|---|
| BMO SelectTrust Conservative, série A | 3,94 % | Globe and Mail |
| Méritage Conservateur (BNI), NBC7711 | 3,17 % | 31 mai 2026 |
| RBC Select Conservative, série A | 5,0 % | 31 mai 2026 |
| **Moyenne utilisée** | **~4,0 %** | (3,94 + 3,17 + 5,0) / 3 |

### Modéré

Pas de série « Modéré » uniforme chez toutes les banques.  
**Moyenne utilisée : ~5,2 %** = milieu entre moyenne Prudent (4,0 %) et Équilibré (6,3 %).

### Équilibré

| Produit | 5 ans | Date / note |
|---|---|---|
| Desjardins Équilibré Québec, cat. A | 6,32 % | 30 juin 2026 (Fundata) |
| Portefeuille Équilibré BNI NBC6424 | 6,49 % | 31 mai 2026 |
| BMO SelectTrust Balanced, série A | 6,39 % | Globe and Mail |
| TD Comfort Balanced, Investor | 5,03 % | 30 juin 2026 (Fund Library) |
| RBC Select Balanced, série A | ~6,6 % | fiche RBC ~mai/juin 2026 |
| **Moyenne utilisée** | **~6,3 %** | arrondi de ~6,2–6,4 % selon inclusion TD |

### Croissance

| Produit | 5 ans | Date / note |
|---|---|---|
| BMO SelectTrust Growth, série A | 8,46 % | Globe and Mail |
| TD Comfort Growth, Investor | 8,82 % | Fund Library |
| RBC Select Growth, série A | ~8,7 % | fiche mensuelle RBC |
| Méritage Croissance (BNI) NBC7714 | 8,37 % | 30 juin 2026 |
| **Moyenne utilisée** | **~8,6 %** | (8,46 + 8,82 + 8,7 + 8,37) / 4 |

### Audacieux (~croissance agressive / actions)

| Produit | 5 ans | Date / note |
|---|---|---|
| BMO SelectTrust Equity Growth, série A | 11,34 % | Globe and Mail |
| TD Comfort Aggressive Growth, Investor | 11,06 % | 30 juin 2026 (Fund Library) |
| RBC Select Aggressive Growth, série A | 11,7 % | 31 mai 2026 |
| **Moyenne utilisée** | **~11,4 %** | (11,34 + 11,06 + 11,7) / 3 |

## Tableau final (courriel)

| Profil | Moyenne banques | Modèles iA |
|---|---|---|
| Prudent | ~4,0 % | 5,0 % |
| Modéré | ~5,2 % | 7,5 % |
| Équilibré | ~6,3 % | 9,7 % |
| Croissance | ~8,6 % | 12,3 % |
| Audacieux | ~11,4 % | 15,0 % |

## Limites (conformité)

- Comparaison **illustrative** entre familles de produits différentes (allocation, MER, style de gestion, garanties).
- Les séries F / conseil auraient souvent des frais plus bas → rendements nets plus élevés côté banques.
- Les dates ne sont pas toutes synchronisées au jour près.
- Les rendements passés ne garantissent pas les rendements futurs.
- Ne pas nommer une banque précise dans le courriel client si la conformité interne le déconseille ; « moyenne des grandes institutions » suffit.
