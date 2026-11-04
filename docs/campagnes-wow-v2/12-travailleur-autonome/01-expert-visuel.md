# [#12] Travailleur autonome — Expert marketing visuel

**Slug :** `/campagnes/travailleur-autonome`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** rebuild `12`, `PageHero.jsx`, `CampagneAdsLanding.jsx`, `AutonomeChecklistTool.jsx`, `_ROLES` Uniformité  
**Verrouillé :** SoftClose / dual CTA / mid copy = déjà ship — **pas** re-spécifier. **Pas** de photos.

---

## Rescore post-P0 (visuel)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | ≥ 8,5 |
| WOW outil | 5,5 | 7 | ≥ 8,5 |
| Env. booker | 5 | 7,5 | ≥ 8,5 |

**Top 1 gap WOW restant :** le fold reste **catalogue générique** (orbs + grille) — zéro signal « desk solo / ledger / pas de RH ». Climax `Mince` est correct en copy mais **visuellement plat** (2 ResultCards même poids).

---

## Spec visuelle CSS-only

### 1. Hero — `atmosphere="desk-ledger"`

Prop shell `PageHero` `atmosphere` (même API que les 14 autres). **Pas** de `backgroundImage`.

| Couche | Spec | Classes / tokens |
|--------|------|------------------|
| Tint | Overlay warm-ink sur navy existant — papier ledger légèrement ambré | `after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_30%_20%,rgba(180,140,90,0.12),transparent_55%)]` + `after:mix-blend-soft-light` |
| Texture | Motif ledger (lignes horizontales + colonnes faibles) opacity 4–6 % | SVG data-URI `opacity-[0.05]` `pointer-events-none` — **en plus** de `HERO_GRID_PATTERN` existant |
| Grain | Grain CSS léger (noise 2 %) optionnel | Helper shell partagé `atmosphere-grain` |
| Interdit | Photo desk, coworking, laptop lifestyle, chips flottants sur media | — |

**Teinte sujet :** ink navy + amber ledger (pas nouvelle palette solo — amber déjà utilisé dans ResultCard warn).

### 2. Micro-signaux fold — `heroExtras`

| Type | Contenu | Rendu |
|------|---------|-------|
| Kicker | `Pas de RH · revenu variable` | `text-xs uppercase tracking-wide text-white/70` sous badge |
| Chips (max 2) | `Filet à cocher` · `Mois mauvais` | Pills outline blanc/25 — **même composant chip** que catalogue |

Pas de 3ᵉ chip. Pas de stats.

### 3. Process strip — **3 steps** (contrat catalogue)

Sous En bref, **même composant shell** `processSteps` — seuls les libellés changent :

| # | Libellé TA |
|---|------------|
| 1 | Coche ton filet |
| 2 | Vois les trous (liquidité → revenu) |
| 3 | 15 min si ça chicotte |

Classes shell partagées : `flex flex-wrap justify-center gap-2 md:gap-3 text-xs text-prestige-taupe` + séparateurs `→`. Mobile wrap OK. **Pas** de 4ᵉ step (rebuild P1-2 → converti en 3 pour Uniformité).

### 4. Portrait CSF

Mid soft-close (bandeau navy existant) : vignette **48–64px** `/seo/portrait.jpg` + libellé identique catalogue :

> Conseiller en sécurité financière · Victoriaville

Même composant / classes que les autres campagnes. **Pas** de photo produit / desk.

### 5. Motion (2–3 — helpers shell)

| # | Motion | Où | Helper |
|---|--------|-----|--------|
| 1 | Fade SoftClose 300–400 ms | Déjà `ToolSoftClose` — ne pas forker | shell fade |
| 2 | Keyed reveal État `Mince` | `ResultCard` filet quand `filetValue` change | `key={filetValue}` + shell keyed reveal |
| 3 | Stagger chips / process 80 ms | Fold + process | shell stagger optionnel |

**Pas :** parallax, glow pulse custom, confetti, lib motion one-off.

---

## Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero | `PageHero` orbs + grille générique | `atmosphere="desk-ledger"` tint + texture ledger | `PageHero.jsx` (shell) + data `item.atmosphere` |
| Fold | Badge + H1 + promise + dual CTA | + `heroExtras` kicker/chips | `CampagneAdsLanding.jsx` + `campagneAdsLandings.js` |
| En bref | 3 bullets seuls | + `processSteps` ×3 sous bullets | shell `processSteps` + data slug |
| Mid | Navy + copy data (OK) | + portrait 48–64px CSF | shell mid SoftClose |
| Climax outil | 2 ResultCards `text-xl/2xl` poids égal | État `Mince` en `font-heading text-3xl sm:text-4xl` ; prochaine étape ambre secondaire | `AutonomeChecklistTool.jsx` |
| SoftClose | `ToolSoftClose` sous Trous | **Inchangé** — portrait mid, pas dans strip outil | — |

---

## Mobile thumb

- Process 3 steps : wrap 1+2 / 3 ou ligne scroll soft — tap targets ≥ 44 px non requis (texte only).
- Climax : `Mince` lisible sans zoom ; SoftClose CTA déjà full-width.
- Portrait mid : ne pas empiler sous le fold outil — reste mid section.

---

## Critères acceptation visuel V2

- [ ] Sans nav, 5 s → « autonome / desk / pas de RH » (tint ledger), pas « landing CSF générique »
- [ ] Process = **3** steps, même composant que #02/#03/…
- [ ] Portrait `/seo/portrait.jpg` + libellé CSF identique
- [ ] Aucune photo nouvelle ; SoftClose = composant partagé
- [ ] Typo climax `font-heading` text-3xl/4xl — pas d’échelle orpheline
