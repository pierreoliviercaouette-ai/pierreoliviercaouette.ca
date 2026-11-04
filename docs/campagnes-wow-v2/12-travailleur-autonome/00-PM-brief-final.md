# [#12] Travailleur autonome — Brief PM final (Vague 2)

**Slug :** `/campagnes/travailleur-autonome`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/travailleur-autonome  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Équipe :** VISUEL → SCRIPT → OUTIL → FINANCE → PM  
**Livrables :** `01`–`04` + ce brief  
**Commit / code :** non — docs seulement

---

## 1. Vision WOW Vague 2 (1 paragraphe)

Post-P0, le pont Clarifier est en place : coche → `Mince` → SoftClose nommé. Il manque l’**identité** : la page doit sentir le desk solo / ledger (CSS), pas une 15ᵉ landing orbs. Process catalogue 3 steps ancre le geste ; le climax filet passe en typo `font-heading` XXL pour que « Mince » soit le punch, pas une card jumelle. Portrait CSF mid = même confiance que le reste du catalogue. Résultat : un ami reconnaît « autonome sans RH » en 5 s — sans photo, sans SoftClose one-off.

---

## 2. Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | ≥ 8,5 |
| WOW outil | 5,5 | 7 | ≥ 8,5 |
| Env. booker | 5 | 7,5 | ≥ 8,5 |
| Visuel / reconnaissance sujet | 6,5 | 6,5* | ≥ 8,5 |

\*P0 a fixé UX/copy/pont RDV ; chrome différenciant **pas** encore shippé.

**Top 1 gap WOW restant :** fold générique (pas d’atmosphere desk-ledger) **+** climax filet à poids égal (pas XXL `Mince`).

---

## 3. Spec Avant → Après (synthèse)

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero | Orbs + grille | `atmosphere="desk-ledger"` tint/texture CSS | `PageHero.jsx` + data |
| Fold | Dual CTA OK | + `heroExtras` kicker/chips | `CampagneAdsLanding` + data |
| Process | Absent | Strip **3** steps shell | shell + `processSteps` data |
| Mid | `ctaHeadline` OK | + portrait `/seo/portrait.jpg` CSF | shell mid |
| Climax | 2 cards égales | `Mince` text-3xl/4xl ; next secondaire ; hide si `doneCount===0` | `AutonomeChecklistTool.jsx` |
| SoftClose | `ToolSoftClose` sous Trous | **Inchangé** | — |
| Toggles | Tous items toujours | (P1) filtre vie/RC | outil |

---

## 4. Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V2-12-1 | `atmosphere="desk-ledger"` + data slug | S | P0-v2 |
| V2-12-2 | `heroExtras` kicker + 2 chips | S | P0-v2 |
| V2-12-3 | `processSteps` ×3 (libellés TA) | S | P0-v2 |
| V2-12-4 | Portrait mid CSF catalogue | S | P0-v2 (shell) |
| V2-12-5 | Climax filet XXL + keyed reveal + hide @0 | M | P0-v2 |
| V2-12-6 | `toolIntro` slug-aware | S | P0-v2 |
| V2-12-7 | Toggles hypo / RC → `relevantItems` | M | P1 |
| V2-12-8 | Event toggle + QA mobile climax | S | P1 |
| V2-12-9 | Grain atmosphere polish | S | P2 |

**Ordre d’implémentation :** shell atmosphere + process + portrait (une fois pour catalogue) → data slug TA → climax outil XXL → toggles P1.

---

## 5. Dépendances shell vs spécifique

| Changement | Scope |
|------------|-------|
| `PageHero` atmosphere / tint / grain | **Shell** (V2-S1) |
| `heroExtras` / `processSteps` / portrait mid | **Shell** (V2-S2–S4) |
| Motion helpers fade / keyed | **Shell** (V2-S5) |
| Data `atmosphere`, extras, steps, toolIntro | **Data** slug |
| Climax XXL / hasInteracted / toggles | **Campagne** `AutonomeChecklistTool.jsx` |
| SoftClose / dual CTA / mid copy | **Déjà ship — ne pas toucher** |

---

## 6. Uniformité catalogue

Même **système shell** que les 14 autres. Différencier le sujet (desk-ledger, chips, climax filet) sans casser le contrat.

| Contrat | OK ? | Note |
|---------|------|------|
| Ordre sections Hero → En bref → Process → Outil → Mid → FAQ | ✅ cible | Process **3** steps (pas 4 du rebuild) |
| SoftClose = `ToolSoftClose` partagé | ✅ déjà | Pas de bandeau custom TA |
| Portrait + libellé CSF identiques | ✅ cible | `/seo/portrait.jpg` · CSF · Victoriaville |
| Process strip même composant | ✅ cible | Seuls 3 libellés changent |
| Typo climax `font-heading` text-3xl/4xl | ✅ cible | `Mince` — pas d’échelle orpheline |
| Spacing / cards tokens prestige | ✅ | Teinte ledger = atmosphere only |
| Motion helpers shell partagés | ✅ | Pas de lib motion solo |
| Hero CTAs primaire outil / secondaire RDV | ✅ déjà | Mêmes variantes boutons |
| Divergence seulement atmosphere / heroExtras / climax | ✅ | Copy SoftClose/mid **gelée** |

**Autorisé :** `atmosphere="desk-ledger"`, chips/kicker, `filetValue` XXL, toggles.  
**Interdit :** SoftClose one-off, mid CTA reinventé, FAQ layout custom, 4ᵉ process step, photos.

---

## 7. Critères d’acceptation « ami reconnaît en 5 s »

1. Sans nav : tint ledger + kicker « Pas de RH · revenu variable » → sujet TA
2. Process 3 steps visibles sous En bref (même UI que #02/#08/…)
3. Coche 2× non liquidité → `Mince` XXL dans le viewport + SoftClose Clarifier (déjà P0)
4. Mid : portrait CSF catalogue, pas une photo desk
5. Aucune divergence SoftClose / FAQ / footer outil vs catalogue
6. Finance : pas de claim « remplacer collective » ; `Mince` ≠ diagnostic couverture

---

## 8. Hors scope

- SoftClose / dual CTA / `ctaHeadline` rewrite  
- Shoot photo desk  
- Calculatrice primes / %  
- Fusion avec #11 collective  
- Commit / deploy (sauf demande)

---

## 9. Synthèse exécutive

| Levier | Action |
|--------|--------|
| Reconnaissance | Atmosphere desk-ledger + heroExtras |
| Catalogue | Process 3 + portrait shell |
| WOW outil | `Mince` XXL + hide @0 + (P1) toggles |
| Booker | SoftClose P0 intact — ne pas retoucher |

**Done Vague 2 #12 :** P0-v2 V2-12-1…6 + Uniformité ✅ + QA §7.
