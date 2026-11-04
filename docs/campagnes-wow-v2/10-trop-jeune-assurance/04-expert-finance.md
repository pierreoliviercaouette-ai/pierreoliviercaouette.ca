# [#10] Trop jeune — Spec FINANCE (Vague 2 / P1)

**Slug :** `/campagnes/trop-jeune-assurance`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Cadre :** éducatif · CSF · QC · pas de soumission en ligne  
**Focus :** valider **nouveaux** claims dual capital XXL + microcopy process/chips — pas re-auditer tout P0

---

## Rescore conformité

| Dimension | Post-P0 | Risque V2 | Cible |
|-----------|---------|-----------|-------|
| Claims copy | OK (FAQ attendre/collective) | Dual XXL peut paraître « besoin réel » | OK si « illustratif » |
| Formules | OK ordres de grandeur | Aucun changement | Garder |
| Ads sync | OK score-first | Hint « mythe tombe » | OK éducatif |

**Top 1 risque V2 :** deux gros $ côte à côte = perception de **recommandation de couverture** si le wording « illustratif / ordre de grandeur » disparaît.

---

## 1. Nouveaux éléments P1 — verdict

| Élément V2 | Verdict | Wording obligatoire |
|------------|---------|---------------------|
| Colonne `Aujourd’hui` (XXL) | OK | Ordre de grandeur · somme blocs déjà disclaimés |
| Colonne `Projets connus` (XXL) | OK | « Projets » ≠ engagement · ≠ capacité d’emprunt |
| Hint `C’est souvent ici que le mythe tombe.` | OK éducatif | Ne pas ajouter « donc tu dois t’assurer pour Y $ » |
| `Total illustratif` | **Obligatoire** | Garder le qualificatif « illustratif » |
| Chip `Score gratuit · sans compte` | OK | Score ≠ prime |
| Process step 3 `Lis Aujourd’hui vs Projets` | OK | Pas « ton besoin d’assurance » |
| Atmosphere `score` (visuel) | N/A finance | — |

### Formules (inchangées — revalider)

| Bloc | Montant type | Statut |
|------|--------------|--------|
| Enfants / famille prévue | 100 000 $ | OK « ordre de grandeur » |
| Conjoint | 24 × paye nette | OK proxy |
| Maison / dettes / hypo prévue | Face value user | OK |
| Score /100 | Pondération | ≠ prime · ≠ admissibilité |
| Âge | Hors score | Garder hint |

**Pas de refonte actuarielle en Vague 2.**

---

## 2. Claims risqués — V2

| Tentation dual XXL | Statut | Remplacer / éviter |
|--------------------|--------|---------------------|
| « Tu as besoin de 450 k$ » | **Interdit** | « Total illustratif » / « montant à viser (illustration) » |
| Projets = couverture à acheter demain | **Risqué** | « besoins potentiels déjà anticipés — à réévaluer quand ils se concrétisent » (FAQ/soft OK) |
| « Plus jeune = moins cher » via hint mythe | **Interdit** | Hint porte sur **besoin présent/projets**, pas sur le prix |
| Score chips = « tu es mal assuré » | **Interdit** | Score gratuit = outil éducatif |

Claims P0 déjà interdits restent interdits (%, refus garanti, etc.).

---

## 3. Disclaimers

### Garder (outil)
> Illustration éducative seulement — pas une soumission ni un conseil personnalisé.

### Renforcer près du dual (1 ligne micro, option S)
> Ordres de grandeur — pas une soumission.

### SoftClose / PDF
Déjà « illustratifs » + clarifier ≠ acheter — **ne pas diluer** en V2.

### Collective
Score n’inclut toujours **pas** la collective ; case informative P2 hors score OK ; FAQ #4 garde le croisement RDV.

---

## 4. Ce qu’on ne promet pas (V2)

- Aucune prime, économie %, admissibilité future  
- Aucune équivalence dual = police recommandée  
- Aucun « achète maintenant avant que ça coûte »  
- Aucun dénigrement de la collective  

---

## Spec Avant → Après (finance)

| Zone | Avant | Après V2 | Fichiers |
|------|-------|----------|----------|
| Climax $ | Total + detail muted | Dual XXL + **Total illustratif** label | `TropJeuneTool.jsx` |
| Hint projets | — | Mythe-killer **besoin**, pas prix | tool |
| Disclaimer | Shell outil | + micro sous dual (option) | tool |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| F-1 | Label « Total illustratif » sous dual | S | P1 |
| F-2 | Micro-disclaimer sous dual (option) | S | P1 |
| F-3 | QA copy hint mythe ≠ claim prix | S | P0-v2 |
| F-4 | Case collective hors score | M | P2 |

---

## Finance / conformité

- **Claims OK :** score illustratif ; capital Aujourd’hui / Projets / Total illustratifs ; 100 k$ et 24× = ordres de grandeur ; âge hors score ; projets = anticipations  
- **Interdits :** prime, %, « moins cher jeune », besoin = police, refus si tu attends  
- **Disclaimer :** illustration éducative · pas soumission · pas conseil personnalisé · clarifier ≠ acheter  

---

## Checklist finance avant ship V2

- [ ] Dual XXL qualifié (labels + total illustratif)  
- [ ] Hint mythe sans angle prix  
- [ ] Formules inchangées  
- [ ] SoftClose / FAQ inchangés côté conformité  
- [ ] Aucune prime UI
