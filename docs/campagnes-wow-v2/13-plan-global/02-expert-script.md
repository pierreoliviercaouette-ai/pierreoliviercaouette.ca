# [#13] Plan global — Expert script marketing

**Slug :** `/campagnes/plan-global`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Persona :** 32–48 ans, Centre-du-Québec ; « j’ai des produits = j’ai un plan »  
**Ton :** québécois parlé, éducatif, zéro pitch

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | ~7 (promise + FAQ + SoftClose citent n°1) | 8 |
| WOW outil | 6,5 | ~7 | 8,5 (buckets nommés + process) |
| Env. booker | 4,5 | ~7 | 8 |

**Top 1 gap copy restant :** fold encore peu « scenic » hors H1 — manque micro-signaux + process qui matérialisent Urgent / Important / Plus tard (promis Ad2). Soft close / mid **déjà bons** — ne pas réécrire.

---

## Principe Vague 2

Ne pas toucher SoftClose / mid / FAQ sauf gap réel. Livrer **micro-copy différenciante** : `heroExtras`, `processSteps`, labels paliers buckets. H1 **gardé** (match Ad1).

---

## Spec Avant → Après

| Zone | Avant | Après (Vague 2) | Fichiers |
|------|-------|-----------------|----------|
| H1 / promise | OK post-P0 | **Garder** | — |
| SoftClose / mid / FAQ | OK post-P0 | **Garder** | — |
| `heroExtras` | Absent | Chip + kicker ci-dessous | `campagneAdsLandings.js` |
| `processSteps` | Absent | 3 steps | data + shell |
| Labels buckets | N/A (`<ol>`) | Urgent / Important / Plus tard + aides | `PlanGlobalTool.jsx` (avec outil) |

---

## 1. `heroExtras` (prêts à coller)

| Champ | Texte |
|-------|-------|
| Chip | `Urgent → Important → Plus tard` |
| Kicker (si 1 ligne supportée) | `Feuille de route, pas un tiroir` |

*Si le shell n’accepte qu’un seul extra : prioriser le chip U→I→P (alignement Ad2).*

Badge hero : garder `Vision globale` (ou `Vision globale · Ordre d’attaque` si place — optionnel, pas bloquant).

---

## 2. Process steps (3 max)

Même composant catalogue — libellés seuls changent :

| # | Titre court | Sous-ligne |
|---|-------------|------------|
| 1 | Tu coches | Ce qui est vrai chez toi — sans compte |
| 2 | Tu vois l’ordre | Urgent d’abord, ensuite important, plus tard sans culpabilité |
| 3 | Tu ancrés (optionnel) | 15 min soft pour coller le n°1 à ta vraie vie |

Alt plus punchy (si longueur shell limitée à titre seul) :

1. `Coche ta vraie vie`  
2. `Reçois l’ordre d’attaque`  
3. `Ancre le n°1 en 15 min`

---

## 3. Labels paliers (outil — avec climax P1)

| Palier | Titre UI | Aide 1 ligne |
|--------|----------|--------------|
| Urgent | Urgent | À traiter avant d’optimiser le reste |
| Important | Important | Protection et risques qui pèsent lourd |
| Plus tard | Plus tard | Utile — sans culpabilité de ne pas tout faire maintenant |

Badge sur l’item n°1 dans son bucket (si listé) : `Toi · n°1`

Caption deep-link (si P1 livré) — **garder** finance :  
`Approfondir ce point (éducatif) — pas un conseil personnalisé.`

---

## 4. Ajustements H1 / promise / SoftClose / mid

| Champ | Action Vague 2 |
|-------|----------------|
| `title` | **Aucun** — Ad1 recognition |
| `promise` | **Aucun** — déjà tiroir / U→I→P |
| SoftClose headlines | **Aucun** — cite déjà `{order}` |
| `ctaHeadline` / `ctaSubline` / `ctaLabel` | **Aucun** |
| FAQ ×5 | **Aucun** |
| Bullets En bref | **Aucun** (outcomes déjà bons) |

---

## 5. Ads Meta

Ad1–Ad3 déjà outil-first. **Pas de refonte.**  
Dissonance restante = UI sans paliers → se règle côté outil (buckets), pas côté ads.

---

## Phrases à ne pas réintroduire

| Éviter | Préférer |
|--------|----------|
| Plan personnalisé / sur mesure | Brouillon éducatif / ordre d’attaque |
| On te bâtit ton plan en 15 min | Ancrer ton n°1 — soft, zéro pitch |
| Score / % de réussite | X cochées · Ordre prêt *(déjà live)* |

---

## Backlog script

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| S1 | `heroExtras` chip (+ kicker) | S | P0-v2 |
| S2 | `processSteps` ×3 | S | P0-v2 |
| S3 | Labels + aides buckets | S | P1 |

---

## Critères acceptation script

- [ ] Chip fold lit « Urgent → Important → Plus tard » sans scroller
- [ ] Process 3 steps = coche → ordre → ancrage optionnel
- [ ] Aucune réécriture SoftClose / mid / FAQ
- [ ] Zéro claim « plan sur mesure »
