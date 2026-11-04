# [#13] Plan global — Expert finances & fiscalité (QC)

**Slug :** `/campagnes/plan-global`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Périmètre :** hub éducatif d’ordre de priorités — **pas** de plafonds / estimateurs $  
**Focus Vague 2 :** valider claims **nouveaux** (buckets, process, deep-links, chip fold)

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Risque conformité | Moyen (plan perso implicite) | Faible–moyen (FAQ + SoftClose soft) | Faible si buckets = « illustration » |
| WOW outil (finance) | N/A $ | Rang OK | Buckets OK si non présentés comme diagnostic perso |

**Top 1 risque restant :** labels de paliers + deep-links lus comme **conseil d’allocation personnalisé** ; `projetCourt` → CELIAPP = faux positif 1ʳᵉ propriété.

---

## Spec Avant → Après (conformité)

| Zone | Avant | Après Vague 2 | Garde-fou |
|------|-------|---------------|-----------|
| Buckets U/I/P | Absents (dissonance Ad2) | Afficher = **OK / recommandé** | Cadre « brouillon éducatif » déjà dans intro |
| Chip fold | — | `Urgent → Important → Plus tard` | OK — pédagogie, pas conseil |
| Process step 3 | — | Ancrage 15 min optionnel | « soft / optionnel » — pas « on livre ton plan » |
| Deep-links | — | Éducatifs only | Omettre `projetCourt`→CELIAPP |
| SoftClose / mid | Livrés P0 | **Ne pas durcir** | Garder exploratoire |

---

## 1. Claims nouveaux — validation

| Claim / UI | Statut | Note |
|------------|--------|------|
| Sections Urgent / Important / Plus tard | **OK** | Aligne Ad2 ; toujours « illustration » |
| Aide « À traiter avant d’optimiser le reste » | **OK** | « Souvent » implicite via contexte outil ; éviter « toujours » |
| Chip `Urgent → Important → Plus tard` | **OK** | |
| Process « Tu ancrés (optionnel) » | **OK** | Garder « optionnel » |
| Badge `Toi · n°1` | **OK** | Rang dans la grille, pas « ta stratégie optimale » |
| Deep-link labels « Calculer / Estimer / Comparer / Voir » | **OK** | Verbes éducatifs |
| `projetCourt` → CELIAPP | **Interdit** (sauf sous-Q 1ʳᵉ prop.) | Recommandation inchangée vs rebuild |
| « Ton plan est prêt » / « plan sur mesure » | **Interdit** | |
| Montants $, % rendement, plafonds 2026 dans hub | **Hors scope / interdit** | WOW = rang |

### Modèle `PRIORITY_IDS` / `TIER_BY_ID`

Logique filet + dettes → urgent ; salaire + hypo/vie → important ; épargne + projet + succession → plus tard : **pédagogie classique acceptable** si disclaimer conservé. Ne pas présenter comme règle absolue pour tous les ménages QC.

`why` dettes : conserver **« souvent »** (`bat souvent un placement « moyen »`).

---

## 2. Disclaimers (garder — pas réécrire)

**Outil :**  
> Illustration éducative seulement — pas un conseil personnalisé. Des produits côte à côte ≠ une feuille de route.

**Deep-link caption :**  
> Approfondir ce point (éducatif) — pas un conseil personnalisé.

**Page / PDF :** patterns catalogue existants — OK.

**SoftClose :** exploratoire / soft / zéro pitch — **ne pas** passer à « on te recommande ce produit ».

---

## 3. Ce qu’on ne promet pas (Vague 2 inclus)

1. Plan financier personnalisé généré par l’outil / les buckets  
2. Allocation REER/CELI définitive  
3. Rendement, intérêt évité chiffré, gain $  
4. Souscription depuis le hub  
5. RDV 15 min = plan complet livré  
6. CSF = notaire (succession)  
7. Que l’ordre affiché est **le** bon ordre pour ce prospect  
8. Que « gros projet < 5 ans » = éligibilité CELIAPP

---

## 4. Vocabulaire

| Terme | Usage V2 |
|-------|----------|
| Ordre d’attaque / brouillon / illustration | Obligatoire autour de « plan » |
| Conseiller en sécurité financière · Victoriaville | Portrait mid — OK |
| CELIAPP | Seulement si 1ʳᵉ prop. explicite — sinon pas de lien |
| Plafonds CELI/REER/SCEE 2026 | Hors hub #13 |

---

## Backlog finance

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| F1 | Review wording aides buckets + chip | S | P0-v2 (review) |
| F2 | Bloquer deep-link `projetCourt`→CELIAPP | S | P1 |
| F3 | Caption deep-link + disclaimer inchangés | S | P1 |

---

## Finance / conformité (synthèse)

- **Claims OK :** U/I/P pédagogique ; chip fold ; process optionnel ; deep-links éducatifs listés  
- **Interdits :** plan sur mesure ; CELIAPP sur projetCourt ; $ / rendements dans hub ; SoftClose « vente »  
- **Disclaimer :** conserver texte outil actuel + caption deep-link  

---

## Checklist avant ship Vague 2

- [ ] Buckets + chip ne disent pas « ton plan personnalisé »  
- [ ] FAQ « pas un plan perso » toujours en place (P0)  
- [ ] Pas de lien CELIAPP sur `projetCourt`  
- [ ] `why` dettes garde « souvent »  
- [ ] SoftClose reste soft  

**Risque résiduel :** faible si disclaimers + omettre CELIAPP ; moyen si deep-links libellés « ta solution ».
