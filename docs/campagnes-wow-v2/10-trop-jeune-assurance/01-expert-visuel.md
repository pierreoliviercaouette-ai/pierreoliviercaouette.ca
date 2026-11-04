# [#10] Trop jeune — Spec VISUEL (Vague 2 CSS-only)

**Slug :** `/campagnes/trop-jeune-assurance`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** `PageHero.jsx` · `CampagneAdsLanding.jsx` · `TropJeuneTool.jsx` · data entry · rebuild P0  
**Verrouillé :** pas de nouvelles photos · portrait existant `/seo/portrait.jpg`  
**Interdits :** re-spec SoftClose / dual CTA hero / mid `ctaHeadline`

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 7 | 8,5 |
| WOW outil | 6 | 7 | 9 |
| Env. booker | 4 | 7 | 8 |

**Top 1 gap WOW restant :** hero encore **template navy catalogue** + climax $ encore **1 total + sous-ligne muted** — pas dual capital XXL, pas atmosphère « score / mythe âge ».

---

## 0. Diagnostic post-P0 (1 paragraphe)

P0 a réparé soft-close Meta (outil-first), defaults anti-spoiler, SoftClose sous Lecture, split en `detail` ResultCard. Visuellement, la page reste interchangeable : `PageHero` sans `atmosphere`, pas de `heroExtras`, pas de process strip, mid SoftClose sans portrait CSF. Dans l’outil, le mythe-killer Ad2 (Aujourd’hui léger vs Projets qui pèsent) est **lisable** mais pas **spectaculaire** — `text-sm text-prestige-taupe` sous un seul `text-2xl`. Vague 2 = chrome sujet CSS + dual colonnes XXL, sans reinventer le système.

**Note visuelle post-P0 /10 :** 6,5 → cible V2 : 8,5

---

## 1. Hero — atmosphère CSS `score` (pas photo)

### Prop data
```js
atmosphere: 'score' // alias sujet : mythe-âge / jauge
```

### Spec `PageHero` (shell — teinte réutilisable)

| Couche | Avant | Après Vague 2 |
|--------|-------|---------------|
| Base | `gradient-hero` générique | Même base + overlay teinte **ambre/secondary** bas-droite (jauge score) |
| Texture | Grille SVG opacity 0.03 | + grain léger `opacity-[0.04]` (CSS noise data-URI ou `bg-[radial-gradient…]`) — **pas** `backgroundImage` photo |
| Tint | Orbs catalogue | Orbe secondary un cran plus chaud ; halo blanc réduit — contrast « mythe bancaire » sans palette solo |
| Badge | `Assurance vie` | Garder + chip `heroExtras` (script) |

Classes cibles (indicatif shell) :
- Wrapper : `data-atmosphere="score"`
- Overlay : `absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-500/10`
- Grain : `mix-blend-overlay opacity-[0.04]`

**Éviter :** cards hero · photo full-bleed · purple glow · collage.

---

## 2. Micro-signaux fold (`heroExtras`)

Rendu sous promesse / au-dessus CTAs (enfants de `PageHero` ou slot `CampagneAdsLanding`) :

| Chip | Style |
|------|-------|
| `Score gratuit · sans compte` | `rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/90` |
| `Présent + projets connus` | idem, accent `border-secondary/40` |
| Kicker optionnel | `text-[11px] uppercase tracking-[0.14em] text-secondary` : `Mythe · 22–35` |

Même composant chips que les autres campagnes V2 — seuls les libellés changent.

---

## 3. Process strip 3 steps (sous En bref)

**Composant shell unique** (pas un one-off trop-jeune). Placement : après bullets, avant `#outil`.

| # | Libellé (voir script) | Visuel |
|---|----------------------|--------|
| 1 | Coche aujourd’hui | Numéro `font-heading` dans cercle `bg-primary/10` |
| 2 | Ajoute projets connus | Idem |
| 3 | Lis le split $ | Idem |

Classes : `grid gap-3 sm:grid-cols-3` · pas de cards ombrées lourdes · tokens prestige. Mobile : stack vertical, thumb-friendly.

---

## 4. Climax visuel outil — dual capital XXL

### Avant (code actuel ~L586–590)
```
ResultCard total text-2xl
  detail muted : Aujourd’hui ~X · Projets ~Y
```

### Après Vague 2
```
[ Score /100 reste header tool — inchangé ]

[ Dual grid 2 cols ]
  AUJOURD’HUI          PROJETS CONNUS
  text-3xl/4xl         text-3xl/4xl (ou 5xl si fit mobile 1 col)
  font-heading bold    font-heading bold
  tabular-nums         tabular-nums + subtle secondary tint si projets > aujourd’hui

[ Total illustratif ]  text-lg/xl sous la grille — pas le seul hero
[ Breakdown existant ] garder Présent / Projets groups
```

- Si `capitalProjets > capitalAujourdhui` : colonne Projets reçoit `text-secondary` ou pastille « c’est ici que ça pèse ».
- Motion : keyed reveal colonnes quand `aDuFutur` passe false→true (`key={aDuFutur}` + fade helper shell).
- SoftClose **reste** `ToolSoftClose` sous dual — pas de bandeau custom (déjà P0).

---

## 5. Portrait CSF mid SoftClose

| Élément | Spec |
|---------|------|
| Asset | `/seo/portrait.jpg` **uniquement** |
| Taille | 48–64px `rounded-full object-cover` |
| Placement | Mid soft-close landing (`CampagneAdsLanding` section mid) **et/ou** slot optionnel au-dessus de `ToolSoftClose` — même pattern catalogue |
| Libellé | `Pierre-Olivier · Conseiller en sécurité financière · Victoriaville` |
| Interdit | autre photo · shoot · avatar générique |

---

## 6. Motion (2–3 utiles, helpers shell)

1. **Keyed bar reveal** — segments score déjà `transition-all duration-500` : s’assurer helper partagé `campagne-reveal` si extrait.
2. **Dual capital fade** — 1ère fois `aDuFutur` : opacity 0→1 300 ms (helper shell).
3. **SoftClose fade** — entrée légère quand scoreMoyen (helper déjà prévu V2-S5) — ne pas customiser trop-jeune.

Pas de parallax hero · pas de lib Framer one-off.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero chrome | `PageHero` générique | `atmosphere: 'score'` + overlays CSS | `PageHero.jsx` + data |
| Fold confiance | Ligne CSF footer hero seule | + `heroExtras` chips | `CampagneAdsLanding.jsx` + data |
| Process | Absent | Strip 3 steps shell | `CampagneAdsLanding.jsx` + `processSteps` |
| Climax $ | 1 total + detail muted | Dual XXL Aujourd’hui \| Projets | `TropJeuneTool.jsx` |
| Mid confiance | Texte seul | Portrait 48–64 + libellé CSF | `CampagneAdsLanding.jsx` / SoftClose slot |
| Motion | Barre seule | + fade dual + SoftClose | shell helpers |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V-1 | `atmosphere: 'score'` + overlays PageHero | M | P0-v2 (shell) |
| V-2 | `heroExtras` chips fold | S | P0-v2 |
| V-3 | Process strip 3 steps | S | P0-v2 (shell) |
| V-4 | Dual capital XXL layout | M | P1 |
| V-5 | Portrait mid SoftClose | S | P0-v2 (shell) |
| V-6 | Motion fade dual + SoftClose | S | P1 |

---

## Critères acceptation visuel

- [ ] Ami en 5 s : « mythe trop jeune + score » (pas landing assurance générique)
- [ ] Dual capital lisible sans ouvrir breakdown
- [ ] Même squelette page que les 14 autres (ordre + SoftClose + portrait)
- [ ] Zéro nouvelle photo
