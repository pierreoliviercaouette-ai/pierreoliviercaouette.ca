# [#13] Plan global — Expert marketing visuel

**Slug :** `/campagnes/plan-global`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** `PageHero.jsx` · `CampagneAdsLanding.jsx` · `PlanGlobalTool.jsx` · `campagneAdsLandings.js` (`plan-global`) · `CampagneToolShell.jsx` (`ToolSoftClose`)  
**Contrainte :** pas de nouvelles photos — CSS only + portrait `/seo/portrait.jpg`

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | ~7 | 8+ |
| WOW outil | 6,5 | ~7 (SoftClose + compteur) | 8,5 (buckets + n°1 scenic) |
| Env. booker | 4,5 | ~7 (SoftClose sous n°1) | 8 |

**Top 1 gap WOW restant :** le fold et le résultat restent **catalogue générique** — pas d’atmosphère « feuille de route », pas de process strip, pas de paliers U/I/P, n°1 encore trop plat (`text-xl/2xl` dans un card beige). SoftClose P0 OK : **ne pas re-spécifier**.

---

## Verdict visuel (1 paragraphe)

Post-P0, le pont RDV est collé au climax (`ToolSoftClose`) et le hero est outil-first — le frein Ad2/Ad3 est levé. Ce qui manque pour qu’un ami dise en 5 s « c’est l’ordre d’attaque, pas une landing CSF lambda » : (1) **atmosphere CSS** chemin 1→2→3, (2) **process strip** partagé, (3) **n°1 plus scenic** (échelle + ring + motion keyed), (4) **buckets Urgent / Important / Plus tard** à la place de la `<ol>` plate, (5) **portrait CSF** au mid. Zéro photo full-bleed.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero atmosphere | `PageHero` gradient navy + grille + orbs génériques | Prop `atmosphere="ordre-attaque"` (ou `plan-global`) : teinte secondary légère + **3 pastilles CSS** `1 · 2 · 3` opacity ~0.28 bas hero (`pointer-events-none`) + grain/noise ultra-léger — **pas** `backgroundImage` | `PageHero.jsx` (shell) + data `item.atmosphere` |
| Fold micro-signaux | Badge + H1 + promise + dual CTA + ligne CSF | + `heroExtras` : chip `Urgent → Important → Plus tard` + kicker `Ordre d’attaque` | `CampagneAdsLanding.jsx` + `campagneAdsLandings.js` |
| Process | Absent (En bref = 3 bullets outcomes OK) | Strip **même composant catalogue** 3 steps sous En bref | shell + `item.processSteps` |
| Climax n°1 | Card gradient, `text-xl sm:text-2xl` | **Scenic** : `font-heading text-3xl sm:text-4xl`, ring `ring-2 ring-secondary/30`, label `Commence ici` secondary tracking, `key={first.id}` + fade/slide-in | `PlanGlobalTool.jsx` |
| Buckets | `rest` en `<ol>` plate numérotée | 3 sections badge (Urgent / Important / Plus tard) — tokens prestige, pas nouvelle palette | `PlanGlobalTool.jsx` |
| SoftClose | `ToolSoftClose` déjà sous n°1 | **Garder** ; option fade-in partagé shell ; **pas** de bandeau custom | — |
| Portrait | Absent mid | Vignette 48–64px `/seo/portrait.jpg` + `CSF · Victoriaville` au **mid SoftClose** (même pattern 15 campagnes) | `CampagneAdsLanding.jsx` mid |
| Motion | Barre `duration-500` | (1) keyed reveal n°1 (2) fade SoftClose (3) stagger léger headers buckets | helpers shell + tool |

---

## 1. Atmosphere CSS — `ordre-attaque` / plan-global

**Intention sujet :** chaos de produits → chemin numéroté (pas foyer, pas atelier PME).

| Couche | Spec Tailwind / CSS |
|--------|---------------------|
| Tint | Overlay `bg-secondary/10` mixé au `gradient-hero` existant (pas remplacer navy brand) |
| Motif | 3 cercles `absolute` bas-centre : `1` `2` `3` en `text-white/25 font-heading text-5xl` espacés ; ou stroke path SVG `white/15` derrière le titre — **Option A pastilles préférée** (cohérent ads U/I/P) |
| Texture | Grain SVG data-URI opacity 0.04 (même helper shell que les autres atmospheres) |
| Interdit | Photos, collage produits, cards flottantes, purple glow, collage REER/CELI |

Shell : `PageHero` accepte `atmosphere` → map de classes ; data `plan-global.atmosphere = 'ordre-attaque'`.

---

## 2. Micro-signaux fold (`heroExtras`)

| Élément | Contenu | Style |
|---------|---------|-------|
| Chip | `Urgent → Important → Plus tard` | `rounded-full border border-white/25 bg-white/10 text-xs text-white/85` |
| Kicker (option) | `Feuille de route, pas un tiroir` | `text-white/70 text-sm` sous promise **ou** dans chip row |

Ne pas alourdir le budget hero : brand (nav) · H1 · promise · CTA group · atmosphere · **1** rangée extras max.

---

## 3. Process strip (composant partagé)

Même structure / classes que les 14 autres — **seuls les libellés changent** (voir script).

Placement : **sous En bref, avant « À toi de jouer »**.

Visuel : 3 colonnes (stack mobile) · numéros `font-heading` dans pastille `primary/10` · label + 1 ligne · **pas** de cards ombrées lourdes si le shell utilise un strip léger — suivre le composant unique.

---

## 4. N°1 plus scenic + buckets

### Bloc « Commence ici »
- Avant : plat, facilement confondu avec une card En bref.
- Après : dominant viewport outil — typo `text-3xl/4xl`, why en `text-base`, fond `from-primary/[0.06] to-secondary/[0.08]`, `border-secondary/20`, badge `Toi · n°1` si aussi listé dans bucket Urgent.
- Motion : `key={first.id}` + classe shell `animate-in fade-in slide-in-from-bottom-2 duration-300`.

### Buckets (identité ads Ad2)
| Palier | Couleur badge | Items |
|--------|---------------|-------|
| Urgent | `bg-secondary/15 text-secondary` | filet, dettes (cochés) |
| Important | `bg-primary/10 text-primary` | salaire, hypo/vie |
| Plus tard | `bg-prestige-beige text-prestige-taupe` | épargne, projet, succession |

Headers `text-xs uppercase tracking-wide`. Items : même row prestige-beige que live, **sans** inventer une 2ᵉ UI.

---

## 5. Portrait mid SoftClose

| Prop | Valeur |
|------|--------|
| Image | `/seo/portrait.jpg` (existant) |
| Taille | 48–64px `rounded-full` |
| Libellé | `Conseiller en sécurité financière · Victoriaville` |
| Placement | Mid bandeau navy — **même slot** que catalogue (pas dans le hero, pas one-off dans l’outil) |

---

## 6. Mobile

| Zone | Spec V2 |
|------|---------|
| Hero extras | Chip wrap OK ; pastilles atmosphere `hidden sm:flex` si clutter |
| Process | Stack 1 col ; thumb scroll court |
| N°1 scenic | `text-3xl` mobile mini ; SoftClose déjà sous — garder ordre DOM |
| Buckets | Sections empilées ; pas de tabs |

---

## 7. Trois upgrades visuels WOW (Avant → Après)

1. **Hero** — Avant : navy template → Après : atmosphere `ordre-attaque` + chip U→I→P + process strip.
2. **N°1** — Avant : `text-xl` card → Après : scenic `text-3xl/4xl` + keyed motion.
3. **Résultat** — Avant : `<ol>` plate → Après : buckets U/I/P + portrait mid catalogue.

---

## Backlog visuel

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V1 | `PageHero` atmosphere + data `ordre-attaque` | M | P0-v2 (shell) |
| V2 | `heroExtras` chip + kicker data | S | P0-v2 |
| V3 | Process strip shell + 3 labels | S | P0-v2 (shell) |
| V4 | Portrait mid SoftClose | S | P0-v2 (shell) |
| V5 | N°1 scenic + motion keyed | S | P1 |
| V6 | Styles badges buckets (avec outil P1) | S | P1 |

---

## Critères acceptation visuelle

- [ ] En 5 s sans lire le body : pastilles/chemin + chip U/I/P → « ordre d’attaque »
- [ ] Aucune photo new ; portrait = `/seo/portrait.jpg` only
- [ ] SoftClose reste `ToolSoftClose` partagé
- [ ] N°1 plus grand / plus « scenic » que le restant des buckets
- [ ] Process + mid + FAQ = même chrome que les autres campagnes
