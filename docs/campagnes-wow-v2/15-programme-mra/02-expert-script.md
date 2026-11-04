# [#15] Programme MRa — Expert script marketing

**Slug :** `/campagnes/programme-mra`  
**Vague :** 2 (post-P0)  
**CTA :** Lead form → rappel → présentation (**pas** Bookings)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, décideur PME, éducatif

> P0 copy hero / form / SoftClose / FAQ **déjà en place** — ne pas réécrire sauf gap fold générique.  
> Vague 2 = **micro-copy différenciante** : `heroExtras` + process 3 steps.  
> **≠ #11 :** employeur / équipe / présentation — jamais livret RH / « ma collective me couvre » / Réserver 15 min.

---

## Rescore post-P0 (script)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Clarté persona | 6 | 8 (H1 + FAQ + apprendre employé) | ≥ 8,5 |
| Fold différenciant | 5 | 6 (copy OK, chrome générique) | ≥ 8 via extras |
| Env. submit Lead | 5 | ~7,5 | ≥ 8 |

**Top 1 gap copy restant :** fold sans kicker/chips → ami lit encore « campagne assurance générique » avant de voir PME.

---

## Spec Avant → Après

| Zone | Avant | Après (Vague 2) | Fichiers |
|------|-------|-----------------|----------|
| H1 / promise / cta | Déjà OK post-P0 | **Garder** (pas de rewrite) | — |
| Soft close / mid | Déjà OK (`ctaHeadline`, SoftClose dynamique) | **Garder** | — |
| `heroExtras` | Absent | Kicker + 2 chips (ci-dessous) | `campagneAdsLandings.js` |
| `processSteps` | Absent | 3 libellés présentation B2B | data + shell |
| Portrait label | Absent | Même libellé catalogue | mid form |

---

## `heroExtras` — textes finaux

| Champ | Texte |
|-------|-------|
| `kicker` | `Pour propriétaires & décideurs PME` |
| Chip 1 | `Pas une usine RH` |
| Chip 2 | `Contribution optionnelle` |

**Contraste #11 (ne pas utiliser ici) :**  
`Ouvre ton livret` · `Cases floues` · `15 min avec le PDF RH` — réservés Collective.

Option chip 2 alt si trop long mobile : `Cotise ou non`.

---

## Process 3 steps — textes

| # | `title` | `detail` |
|---|---------|----------|
| 1 | `Présentation` | `Je te rappelle, on voit si ça colle` |
| 2 | `Entreprise` | `~2 rencontres pour cadrer l’offre` |
| 3 | `Équipe` | `30–45 min / personne intéressée` |

Ligne sous-strip : `Infos médicales ≠ côté employeur · CSF · Victoriaville`

---

## Fold — confirmation (pas de rewrite)

| Champ | Statut | Texte (référence) |
|-------|--------|-------------------|
| `badge` | OK | `Programme MRa` |
| `title` | OK | `Offrir de l’assurance à ton équipe — sans usine à gaz` |
| `promise` | OK | (déjà en data — décideur PME) |
| `ctaLabel` | OK | `Recevoir une présentation` |
| `ctaMicro` | OK | `Je te rappelle — sans Bookings ni pression` |
| `heroToolLabel` | OK | `Voir si MRa colle à ma PME` |

---

## Mid SoftClose / form — gaps réels seulement

Aucun rewrite requis post-P0. Vérifier que le portrait mid n’ajoute **pas** de CTA Bookings ni de sous-titre « Réserver 15 minutes ».

Micro optionnelle près du portrait (si slot catalogue) : `Je te rappelle pour une présentation — CSF · Victoriaville`  
(identique esprit aux autres landings form ; pas de phrase solo MRa inventée hors pattern).

---

## Strip comparatif (P1 optionnel — hors P0-v2 chrome)

Si ship plus tard, microcopy 5 critères (rebuild) — **pas** bloquant Vague 2 chrome. Astérisques portabilité / médical (finance).

---

## Mots interdits (rappel)

- ❌ Bookings / « Réserver 15 minutes » comme CTA conversion
- ❌ Livret / checklist employé / « ma collective me couvre »
- ❌ Acceptation garantie / sans sélection médicale / fiscalité
- ✅ Présentation · rappel · contrats individuels · contribution optionnelle

---

## Critères acceptation SCRIPT

- [ ] `heroExtras` + process collés data — ton PME
- [ ] H1/promise/mid **inchangés** sauf bug
- [ ] Ami différencie #15 de #11 via chips (pas via badge seul)
- [ ] Zéro Bookings dans les nouveaux strings
