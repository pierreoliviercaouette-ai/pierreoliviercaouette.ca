# [#12] Travailleur autonome — Expert marketing visuel

**Slug :** `/campagnes/travailleur-autonome`  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/12-travailleur-autonome.md`, live page, `CampagneAdsLanding.jsx`, `PageHero.jsx`, `AutonomeChecklistTool.jsx`, ads navy brief  
**Objectif :** page **propre / pro / WOW** — identité TA (pas de RH, revenu variable) → climax filet collé → soft RDV visible

---

## 1. Diagnostic visuel (état actuel)

| Zone | Constat | Impact WOW |
|------|---------|------------|
| Hero | `PageHero` orbs + grille générique ; 1 CTA blanc RDV | Template catalogue ; Ad3 « essaie d’abord » cassé |
| En bref | 3 cards blanches ombrées, poids égal | Card soup légère ; pas d’ancre « mois mauvais » |
| Outil | Bloc « Ton filet » + PDF **au-dessus** des cases | Climax hors viewport mobile pendant les coches |
| Post-climax | Double PDF ; aucun strip RDV dans l’outil | Trophy download, pas conversation |
| Mid CTA | Navy « Prêt à clarifier… » générique | Zero lien avec `Mince` / trou #1 |
| Confiance | Disclaimer footer seulement | Pas de ligne CSF · Victoriaville au-dessus du fold |

**Note visuelle actuelle /10 :** 6,5

---

## 2. Vision visuelle WOW (1 composition)

**Première viewport = une seule composition sujet :**  
Badge Autonome · H1 « pas d’assurance collective fournie » (garder) · 1 promesse revenu variable · **CTA primaire outil** · atmosphère « desk solo / pas de badge RH » — pas dashboard, pas lifestyle coworking.

**Test brand :** en enlevant la nav, la page doit encore dire « autonome sans filet employeur », pas « une landing CSF de plus ».

---

## 3. Spec hero (Avant → Après)

### Composition 1 viewport
| Élément | Spec |
|---------|------|
| Brand | Shell `PageHero` conservé (gradient navy site) + **texture sujet** légère (voir §4) — pas de refonte globale orbs |
| Badge | `Autonome` (existant) |
| H1 | Garder : *Travailleur autonome : pas d’assurance collective fournie* |
| Promesse | 1 phrase (voir script) — max ~2 lignes mobile |
| CTA group | **Primaire** blanc pill → `#outil` · **Secondaire** texte blanc/70 « Ou 15 min si tu préfères » → RDV |
| Interdit hero | Stats, process 4 steps, cards, badges flottants sur media, second H2 |

### Dual CTA (composant)
Fichier : `CampagneAdsLanding.jsx` (+ champs data)

```text
[ Coche ton filet → ]     ← bg-white, track campagne_travailleur-autonome_outil_hero
  Ou 15 min si tu préfères ← text link / underline-offset, track …_rdv (existant soft)
```

Champs data proposés (slug only ou shell générique) :
- `ctaPrimaryLabel` / `ctaPrimaryHref: '#outil'`
- `ctaSecondaryLabel` / path RDV (ou `ctaLabel` reste le mid)

**Mobile thumb :** primaire pleine largeur `w-full sm:w-auto` ; secondaire sous le primaire, zone pouce bas-centre.

---

## 4. Atmosphère sujet (TA)

**Direction :** mythe-bancaire navy (ads) + signal « pas de RH / facturation » — **pas** photo lifestyle.

| Option | Effort | Recommandation |
|--------|--------|----------------|
| A. Texture SVG légère « facture / grille ledger » en opacity 4–6 % sur hero (en plus grille actuelle) | S | **Ship P0** — différencie sans casser le shell |
| B. Sous En bref : rangée 4 pictos outline liquidité→revenu→proches→structure (fade-in stagger) | S–M | **Ship P0** — remplace le besoin de photo |
| C. Photo desk solo full-bleed | L | P2 — hors scope si A+B tiennent le test brand |

**À éviter :** coworking, laptops lifestyle, claim visuel « comme un employé », stickers / chips flottants.

Implémentation A (campagne-only sans forker `PageHero`) :
- Wrapper section outil ou pseudo-élément CSS sur le bloc En bref / `#outil` : motif ledger en `opacity-[0.04]` `pointer-events-none`
- Ou prop optionnelle `PageHero` `atmosphere="autonome"` **seulement si** shell déjà ouvert pour dual CTA (max 2 touch shell — voir PM)

---

## 5. Corps de page — modules

### 5.1 En bref
- Garder 3 bullets numérotés (shell actuel) — **pas** plus de cards.
- Bullet #1 doit porter **revenu variable / mois mauvais** (script) pour matcher Ad2.
- Sous les 3 bullets : **bandeau process 4 steps** (une ligne, pas cards) :

```text
① Coche  →  ② Ordre liquidité→revenu  →  ③ PDF optionnel  →  ④ 15 min si ça chicotte
```

Classes : `flex flex-wrap justify-center gap-2 text-xs text-prestige-taupe` + flèches `→` ; mobile wrap 2×2.

### 5.2 Zone outil (layout)
Ordre DOM obligatoire (détail UX = expert outil) :

1. Progression (barre)
2. Checklist 4 piliers + notes
3. **Ton filet** (insight + Trous) ← climax
4. Soft-close strip RDV (ambre / navy soft)
5. PDF **une seule fois** (footer shell)

Retirer le PDF du header « Ton filet ».

### 5.3 Soft-close strip **dans** l’outil (visuel)
Sous la liste Trous, quand `missingCount ≥ 1` :

| Propriété | Spec |
|-----------|------|
| Conteneur | `rounded-2xl` bordure ambre légère **ou** `from-primary/95 to-dark` compact — **1 strip**, pas une 2e card soup |
| Hiérarchie | 1 phrase résultat (`Ton filet est mince — prochaine case : {short}`) · 1 CTA blanc · 1 micro « Clarifier ≠ acheter » |
| PDF | Pas dans ce strip ; reste footer outline / secondaire |
| Motion | Fade/slide-up 300–400 ms quand `doneCount` passe 0→1 ou `filetValue` change vers `Mince` |

### 5.4 Mid CTA (bandeau navy existant)
- Remplacer copy hardcodée par `ctaHeadline` / `ctaSubline` **data-driven** (shell déjà lit ces champs pour form ; étendre branche RDV L181–187).
- Visuel : garder gradient `from-primary to-dark` — pas de redesign.
- Capsule Apprendre : **2 liens** textuels (urgence primaire + invalidité) ou primaire dynamique selon `nextItem.pillar` (outil peut exposer hint ; sinon data fixe urgence + invalidité).

### 5.5 Confiance locale
Sous mid (ou juste au-dessus FAQ), 1 ligne :

> Conseiller en sécurité financière · Victoriaville — 15 min pour prioriser ton filet, pas pour te vendre une pile de produits.

Classes : `text-center text-xs text-prestige-taupe` — pas de card, pas de photo obligatoire en P0.

---

## 6. Motion (2–3 utiles — pas de bruit)

| # | Motion | Où | Pourquoi |
|---|--------|-----|----------|
| 1 | Progress bar `width` 500 ms (existant) | Outil | Feedback coche |
| 2 | Insight cards + soft strip : `animate-in fade/slide` quand état filet change | Post-checklist | Climax « damn » visible |
| 3 | Pictos ordre En bref : stagger opacity 80 ms | Sous bullets | Atmosphère TA sans image lourde |

**Pas :** parallax hero, glow pulses, confetti PDF.

---

## 7. Mobile

| Zone | Spec |
|------|------|
| Hero | H1 `text-4xl` OK ; dual CTA empilé ; secondaire ≥ 44 px tap |
| Outil | Cases full-bleed thumb ; insight **sous** cases = pas de yo-yo |
| Soft strip | CTA full-width ; microcopy ≤ 2 lignes |
| Mid | Stack vertical déjà OK |
| PDF | Un seul bouton footer — pas de sticky double |

---

## 8. Avant → Après (composants)

| # | Avant | Après | Fichier / classes |
|---|-------|-------|-------------------|
| 1 | CTA hero = RDV only | Primaire `#outil` + secondaire RDV texte | `CampagneAdsLanding.jsx` + data slug |
| 2 | Ton filet + PDF au-dessus cases | Cases → Ton filet → soft RDV → PDF footer | `AutonomeChecklistTool.jsx` |
| 3 | En bref cards seules | + process 4 steps + pictos ordre | `CampagneAdsLanding` section En bref **ou** bloc intro outil |
| 4 | Mid hardcodé | `ctaHeadline` / `ctaSubline` data | `CampagneAdsLanding.jsx` L181–187 |
| 5 | Zéro confiance locale mid | 1 ligne CSF · Victoriaville | data ou JSX slug-aware |

---

## 9. Critères acceptation visuel

- [ ] Hero lit outil-first en <3 s (primaire ≠ Bookings)
- [ ] Sur iPhone SE, après 2 coches « non », `Mince` + prochaine étape sont **dans le viewport** sans remonter
- [ ] Un seul bouton PDF visible à la fois
- [ ] Mid ou soft strip cite un résultat TA (filet / case), pas « clarifier ta situation » générique
- [ ] Test brand : sans nav, sujet = autonome sans collective / revenu variable

**Note cible post-refonte /10 :** ≥ 8,5
