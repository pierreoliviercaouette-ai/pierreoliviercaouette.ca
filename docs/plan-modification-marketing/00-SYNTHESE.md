# Synthèse V2 — Améliorations à prioriser (15 campagnes)

**Date :** 2026-11-04 · Audits VERSION 2 (TOP 7 spécifiques / fiche)  
**Objectif :** conversion RDV (Lead formulaire pour MRa) + rendu plus pro / complet.

Lire les fiches `01`–`15` pour le détail Avant→Après + fichiers. Ici = **quoi shipper**, différencié par campagne.

---

## Scores V2

| # | Campagne | Conv. | Polish | Diff. | Priorité produit #1 (spécifique) |
|---|----------|------:|-------:|------:|----------------------------------|
| 01 | Comparateur | 5 | 6,5 | 7 | Couper fuite mid → `/outils/comparateur-rendements` + preset mythe 50 k$ / 20 ans |
| 02 | CELIAPP | 5,5 | 5 | 4 | Soft close chiffré + débloquer plafond UI (`max=8000`) + gap cible mise de fonds |
| 03 | Hypothèque | 5,5 | 5 | 4 | Gap solde→famille dominant + estimateur **avant** tableau 5× |
| 04 | Invalidité | 5,5 | 6,5 | 7 | Pont trou/coussin→RDV + presets délai 30/90/120 + hint livret |
| 05 | Retraite | 5,5 | 6 | 5 | Neutraliser tone `mixte` (warn→nuance) — 1er écran trop « alerte » |
| 06 | Maladie grave | 5,5 | 5,5 | 7 | Monétiser bandeau écart capital + contraste UI Invalidité≠MG |
| 07 | REEE | 5,5 | 7 | 8 | Soft close sur `laisseSurTable` $ exact (Ad2) |
| 08 | Fonds urgence | 5,5 | 7 | 6,5 | Soft close branché sur les 3 états « En clair » (cible/écart/rythme) |
| 09 | CELI droits | 5,5 | 7 | 5 | **Livrer** sélecteur Urgence/Projet/LT promis ads (absent du JSX) |
| 10 | Trop jeune | 5,5 | 7 | 7,5 | Neutraliser defaults hypo/famille qui spoilent l’aha (~455 k$) |
| 11 | Collective | 5,5 | 7 | 6,5 | Soft close sur cases floues + gate « livret RH ouvert » |
| 12 | Autonome | 5,5 | 7 | 7,5 | Inverser checklist→insight + climax revenu variable |
| 13 | Plan global | 5,5 | 7 | 6 | Soft close sous « Commence ici » (n°1) |
| 14 | Succession | 5,5 | 7 | 7,5 | H1 = Ad1 « Plus tard… » + RDV dès trous (CSF vs notaire) |
| 15 | MRa PME | 5,5 | 6 | 5 | Outil→`#demande` + qualify entreprise/taille + score fit (`contrib`) |

Moyennes approx. : **conv. ~5,5** · **polish ~6,4** · **diff. ~6,2**.

---

## Dettes shell (1 fois pour les 15)

Ne plus rediscuter dans chaque fiche — industrialiser dans `CampagneAdsLanding` + `CampagneToolShell` :

1. Hero **outil-first** (scroll `#outil`) + RDV secondaire  
2. Slot **post-résultat → RDV / form** (PDF secondaire)  
3. `ctaHeadline` / `ctaSubline` data-driven (fini le mid générique)

---

## Backlog d’implémentation (par levier, pas par slug)

### Vague A — Gaps produit promis / bugs funnel (impact Haut)

| Campagne | Livrable |
|----------|----------|
| **01** | Brancher ou retirer `secondaryIsTool` ; plus de lien mid vers `/outils/...` |
| **09** | Chips Urgence / Projet / Long terme dans `CeliDroitsTool` + soft close `$`+usage |
| **02** | Retirer/relever `max={8000}` ; afficher clamp plafond ; gap cible |
| **10** | Defaults neutres (hypo/famille off ou 0) jusqu’au geste user |
| **05** | Tone `mixte` → nuance (pas warn ambre par défaut) |
| **15** | CTA `#demande` + entreprise requise + bridge taille depuis outil |

### Vague B — Climax monétisé (outil → RDV/Lead)

| Campagne | Climax à monétiser |
|----------|-------------------|
| 01 | Écart $ banque vs modèles |
| 03 | Écart solde vs capital famille |
| 04 | Trou mensuel + coussin |
| 06 | Écart vs déjà couvert |
| 07 | `laisseSurTable` |
| 08 | États En clair (manque / rythme / atteint) |
| 11 | `missingCount` cases floues |
| 12 | `nextItem` + filet « Mince » |
| 13 | « Commence ici » n°1 |
| 14 | `missingCount` trous liquidité |

### Vague C — Polish / complétude pro

| Priorité polish bas | Actions |
|---------------------|---------|
| 02 CELIAPP · 03 Hypo · 06 MG · 05 Retraite · 15 MRa | Atmosphère hero thématique ; process 3 steps ; confiance CSF Victoriaville ; PDF accents FR |
| 03 | Estimateur avant tableau ; alléger mobile |
| 06 | Module 2 cols Invalidité ≠ MG |
| 12 | Checklist avant insight |
| 14 | H1 Ad1 ; next-step CSF vs notaire |

---

## Critères de succès

- ↑ clics `…_rdv_outil` / `…_tool_to_form` vs hero seul  
- ↓ fuites hors funnel (`/outils/...`, Apprendre employé sur MRa)  
- Promesses ads tenues dans l’UI (usage CELI, mythe 50 k$, presets délai, etc.)  
- Show-rate / leads PME qualifiés (entreprise + taille)

---

## Fiches

Détail TOP 7 + Avant→Après + chemins de code : `docs/plan-modification-marketing/NN-*.md`.
