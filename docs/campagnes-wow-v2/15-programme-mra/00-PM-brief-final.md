# [#15] Programme MRa — Brief PM final (Vague 2 post-P0)

**Rôle :** Gestionnaire de projet  
**Slug :** `/campagnes/programme-mra`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/programme-mra  
**CTA :** Lead form (`CampagneLeadForm` → rappel → présentation) — **pas** Bookings  
**Vague :** 2 (post-P0) · **PILOTE** atmosphère PME/atelier  
**Date :** 2026-11-04  
**Livrables :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Commit / code :** non (spec seulement)

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | ~7 | ≥ 8,5 |
| WOW outil | 4,5 | ~8 (climax XL + SoftClose form) | ≥ 8,5 (motion) |
| Env. booker (= submit Lead) | 5 | ~7,5 | ≥ 8 |

**Top 1 gap WOW restant :** chrome page encore clone catalogue (orbs) — manque atmosphere PME CSS + `heroExtras` ≠ #11 + process 3 steps + portrait mid. Outil : climax déjà XL → polish motion seulement.

**P0 déjà livré (ne pas re-spéc) :** SoftClose `formMode`, dual CTA hero outil-first, `ctaHeadline`/`ctaSubline`, score+contrib, piliers off, bridge form, PDF ghost.

---

## Vision Vague 2 (1 paragraphe)

Un décideur PME Ad1 (« pas besoin d’une grosse collective ») arrive sur un hero qui **sent l’atelier** (tint/texture CSS, pas photo) avec kicker décideur + chips « Pas une usine RH / Contribution optionnelle » — impossible de confondre avec #11 livret. Process 3 pastilles (Présentation → Entreprise → Équipe) avant l’outil. Fit climax XL déjà là ; motion keyed + SoftClose fade catalogue. Mid = même SoftClose form / Lead (`ctaType:'form'`), portrait `/seo/portrait.jpg` + CSF · Victoriaville. Objectif session : `generate_lead`.

---

## Spec Avant → Après (synthèse)

| Zone | Avant | Après Vague 2 | Fichiers |
|------|-------|---------------|----------|
| Atmosphere | Orbs génériques | `atmosphere: 'pme-atelier'` CSS | `PageHero` + data |
| heroExtras | — | Kicker + 2 chips PME | data + landing |
| Process | — | 3 steps présentation | shell + data |
| Portrait | — | `/seo/portrait.jpg` mid | landing mid form |
| Climax | XL statique | Motion keyed + fade SoftClose | `MraFitTool` + helpers |
| SoftClose / Lead | `formMode` OK | **Inchangé** — variante catalogue | `ToolSoftClose` |

---

## Uniformité catalogue

Le rendu #15 doit rester **dans le système** des 14 autres campagnes. On différencie le **sujet** (PME/atelier, chips, climax fit) sans reinventer le chrome.

| Contrat shell | OK ? | Note #15 |
|---------------|------|----------|
| Ordre sections Hero → En bref → Process → Outil → Mid → FAQ | ✅ à ship | Process manquant aujourd’hui — ajouter **sans** réordonner le reste |
| Hero CTAs primaire outil / secondaire form | ✅ | Déjà `ctaType:'form'` — mêmes variantes boutons catalogue |
| SoftClose = `ToolSoftClose` uniquement ; primary + PDF ghost | ✅ | `formMode` = **même composant** que RDV, variante Lead — **pas** de bandeau custom MRa |
| Portrait `/seo/portrait.jpg` + libellé CSF · Victoriaville | ✅ à ship | Placement mid SoftClose form (pattern catalogue) |
| Process strip même composant / classes | ✅ à ship | Seuls les 3 libellés MRa changent |
| Typo climax `font-heading` text-3xl/4xl (ou 5xl fit) | ✅ | Déjà `text-4xl md:text-5xl` — ne pas inventer échelle orpheline |
| Spacing / cards tokens prestige | ✅ | Teinte atmosphere seulement — pas palette solo |
| Motion helpers shell partagés | ✅ à ship | Fade SoftClose + keyed reveal — pas lib motion #15 |

**Autorisé à diverger :** `atmosphere` pme-atelier, `heroExtras`, chiffres/badge fit, copy PME.  
**Interdit :** SoftClose one-off, mid CTA reinventé, FAQ layout custom, footer outil parallèle Bookings.

**Lead form = variante catalogue :** `ctaType: 'form'` + `ToolSoftClose formMode` + `CampagneLeadForm` `#demande` — même système SoftClose que les campagnes Bookings, branche form au lieu de RDV.

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V2-15-1 | `PageHero` atmosphere `pme-atelier` (tint/texture/grain CSS) | M | **P0-v2** (shell + data) |
| V2-15-2 | `heroExtras` kicker + 2 chips (script) | S | **P0-v2** |
| V2-15-3 | `processSteps` 3 pastilles + ligne confiance | S | **P0-v2** (shell) |
| V2-15-4 | Portrait mid SoftClose form `/seo/portrait.jpg` | S | **P0-v2** (shell) |
| V2-15-5 | Motion climax keyed + fade SoftClose (helpers) | S | **P0-v2** |
| V2-15-6 | Strip comparatif Collective vs MRa 5 critères | M | P1 |
| V2-15-7 | Sticky CTA mobile post-outil → `#demande` | M | P1 (shell `ctaType form`) |
| V2-15-8 | Pulse CTA Lead une fois post-premier score | S | P2 |
| V2-15-9 | Affiner seuils fit terrain | S | P2 |

---

## Dépendances shell vs spécifique

| Shell (partagé catalogue) | Spécifique #15 |
|---------------------------|----------------|
| `PageHero` prop `atmosphere` | Valeur `pme-atelier` + teintes |
| Slot `heroExtras` / `processSteps` | Copy PME (≠ chips #11) |
| Portrait mid + libellé CSF | — |
| Helpers motion SoftClose / keyed | Appel depuis `MraFitTool` |
| SoftClose `formMode` (déjà) | Labels présentation déjà OK |

**Décision PM :** P0-v2 = chrome shell + data #15 + motion outil. Strip comparatif / sticky = P1. Aucune photo nouvelle.

---

## Différenciation #11 (non négociable)

| | #11 Collective | #15 MRa |
|--|----------------|---------|
| Persona | Employé + livret | Propriétaire PME |
| Atmosphere | (autre teinte V2) | `pme-atelier` |
| heroExtras | Livret / cases floues | Usine RH / contrib optionnelle |
| Outil | Checklist | Fit score XL |
| SoftClose | RDV Bookings | **Même composant**, `formMode` Lead |
| CTA | 15 min | Présentation / rappel |

---

## Finance / conformité (synthèse)

- **Claims OK :** chips contribution optionnelle ; process timings typiques ; infos médicales ≠ côté employeur (prudent)
- **Interdits :** sélection médicale niée, fiscal, acceptation garantie, Bookings, fit = admissibilité
- **Disclaimer :** garder outil / form / ads P0 — process n’ajoute pas de claim portabilité

---

## Critères d’acceptation « ami en 5 s »

- [ ] Ami dit « c’est pour mon PME / pas le livret RH » sans lire le badge seul
- [ ] Ordre page = catalogue (Process présent)
- [ ] SoftClose = `ToolSoftClose formMode` (pas custom)
- [ ] Portrait + CSF · Victoriaville identiques catalogue
- [ ] Climax fit XL + motion ; CTA → `#demande` ; zéro Bookings conversion
- [ ] Atmosphere CSS only — pas de nouvelles photos

---

## Definition of Done (spec Vague 2)

- [x] Dossier `docs/campagnes-wow-v2/15-programme-mra/` avec 5 md
- [x] Section **Uniformité catalogue** dans ce brief
- [x] Lead = variante `formMode` du SoftClose catalogue
- [ ] Implémentation code (hors mandat)
- [ ] Commit (non demandé)
