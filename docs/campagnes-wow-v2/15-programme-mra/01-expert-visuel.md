# [#15] Programme MRa — Expert marketing visuel

**Slug :** `/campagnes/programme-mra`  
**Vague :** 2 (post-P0)  
**CTA :** Lead form `#demande` — **pas** Bookings  
**Date :** 2026-11-04  
**Sources :** `PageHero.jsx` · `CampagneAdsLanding.jsx` · `MraFitTool.jsx` · rebuild `15-programme-mra`

> **≠ #11 Collective :** pas de sémantique livret / employé. Ici = **décideur PME**, atelier, contraste « usine RH vs formule simple ».  
> **Uniformité :** même chrome catalogue (structure, SoftClose, process strip, portrait, tokens). Divergence = `atmosphere` + `heroExtras` + climax déjà XL.

---

## Rescore post-P0 (visuel)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience chrome | 5,5 | ~7 (Lead + climax XL) | ≥ 8,5 |
| Identité sujet | Clone orbs | Clone orbs + copy PME | **PME atelier en 5 s** |
| WOW outil (visuel) | 4,5 | ~8 (chiffre XL + badge) | ≥ 8,5 (motion) |

**Top 1 gap WOW restant :** hero encore générique catalogue — pas d’atmosphère PME/atelier CSS ; micro-signaux fold absents ; process 3 steps et portrait mid absents.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero atmosphere | `PageHero` orbs + grille génériques | `atmosphere: 'pme-atelier'` — tint navy + texture CSS « plancher atelier / grille légère industrielle » + grain subtil ; **pas** `backgroundImage` photo | `PageHero.jsx` (prop shell) · data `item.atmosphere` |
| heroExtras | Absent | Kicker + 2 chips contraste (voir script) — **≠** chips livret #11 | `CampagneAdsLanding.jsx` · data |
| Process 3 steps | Absent | Strip catalogue **même composant** ; 3 pastilles Présentation → Entreprise → Équipe | shell + data `processSteps` |
| Portrait mid | Absent | Vignette `/seo/portrait.jpg` 48–64px + `CSF · Victoriaville` au mid SoftClose form (même pattern catalogue) | `CampagneAdsLanding.jsx` mid form |
| Climax outil | Déjà XL `~n` + badge + phrase | **Polish motion seulement** : keyed reveal chiffre + fade badge ; SoftClose fade-in (helpers shell) | `MraFitTool.jsx` + helpers motion shell |
| SoftClose | `ToolSoftClose formMode` déjà OK | **Ne pas reinventer** — garder primary Lead + PDF ghost | `CampagneToolShell.jsx` |

---

## Atmosphere `pme-atelier` (CSS-only)

**Intent :** atelier / petite boîte — décideur qui refuse l’usine RH. Pas foyer, pas livret, pas orbs « finance générique ».

| Couche | Spec Tailwind / CSS |
|--------|---------------------|
| Base | Garder `gradient-hero` navy existant |
| Tint | Overlay `from-primary/90 via-dark/85 to-primary/75` + teinte chaude très légère (`amber-900/10`) en bas-gauche — atelier, pas crème terracotta |
| Texture | SVG/CSS pattern « planches / grille 40–48px » opacity `0.04–0.06` (remplace ou complète `HERO_GRID_PATTERN` via prop) |
| Grain | `noise` 2–3 % opacity (pseudo-element partagé shell) |
| Orbs | Atténuer orbs génériques (`opacity-40`) **ou** les désactiver si `atmosphere` set — pas de glow purple |
| Interdit | Photo full-bleed, cream `#F4F1EA`, purple gradient, cards flottantes |

**Brand test :** sans le badge « Programme MRa », le fold doit encore dire « PME / atelier / décideur » via tint + kicker + chips.

---

## Micro-signaux fold (`heroExtras`)

Placement : sous `ctaMicro`, avant la ligne CSF — **même slot shell** que les autres campagnes.

| Signal | Contenu (visuel) | ≠ #11 |
|--------|------------------|-------|
| Kicker | Ligne uppercase secondaire : décideur PME | Pas « ouvre ton livret » |
| Chip A | Contraste « Pas une usine RH » | Pas « Cases floues » |
| Chip B | « Contribution optionnelle » | Pas « 15 min + livret » |

Style chips : `rounded-full border border-white/25 bg-white/10 text-white/90 text-xs` — tokens catalogue, pas nouvelle palette.

---

## Process strip 3 steps

Ordre page catalogue : **Hero → En bref → Process → Outil → Mid → FAQ**.

| # | Titre | Sous-ligne (visuel) |
|---|-------|---------------------|
| 1 | Présentation | Pastille numérotée `font-heading` |
| 2 | Entreprise | Même classes strip |
| 3 | Équipe | Même classes strip |

+ ligne confiance sous le strip (texte script) — pas une 4e pastille.

---

## Portrait CSF

- Asset : `/seo/portrait.jpg` uniquement (existant)
- Taille : 48–64px `rounded-full`
- Placement : mid SoftClose (au-dessus ou à côté du titre form) — **même libellé** `CSF · Victoriaville` que le catalogue
- Pas de photo atelier / équipe

---

## Motion climax (2–3 — polish)

Climax **déjà XL** (`text-4xl md:text-5xl`) — ne pas changer l’échelle.

1. **Keyed reveal** sur `~{n}` + badge quand `badge`/`nEmployes` change (`key={`${n}-${badge}`}`) — fade/scale 200–280 ms via helper shell
2. **Fade SoftClose** à l’apparition / update headline
3. **Option P2** : pulse CTA Lead **une fois** après premier score (helper partagé, pas lib dédiée)

Pas de confetti, pas de parallax, pas de Lottie one-off.

---

## Avant → Après (classes / composants)

1. **`PageHero`** — Avant : orbs fixes · Après : `atmosphere={item.atmosphere}` → classes `data-atmosphere="pme-atelier"`
2. **`CampagneAdsLanding`** — Avant : pas d’extras · Après : render `heroExtras` + `processSteps` + portrait mid
3. **`MraFitTool`** — Avant : climax XL statique · Après : motion keyed + SoftClose déjà sous climax (garder)

---

## Critères acceptation VISUEL

- [ ] Ami reconnaît « PME / MRa / pas livret » en ≤5 s (atmosphere + chips)
- [ ] Zéro nouvelle photo
- [ ] Process + portrait = composants catalogue (pas one-off)
- [ ] SoftClose = `ToolSoftClose formMode` uniquement
- [ ] Climax garde `font-heading` + échelle 4xl/5xl ; motion polish seulement
- [ ] Aucun CTA Bookings / bandeau navy mid custom
