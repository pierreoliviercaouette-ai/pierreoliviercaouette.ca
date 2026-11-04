# [#07] REEE — Expert marketing visuel

**Slug :** `/campagnes/reee`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** `ReeeTool.jsx` · `CampagneAdsLanding.jsx` · `PageHero.jsx` · rebuild `07-reee/01`  
**Choix :** CSS-only — **pas** de nouvelles photos / pas de `backgroundImage` requis

---

## Rescore post-P0 (visuel)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|---------:|---------:|---------:|
| Fold différenciant | 5,5 | 6,5 | ≥ 8,5 |
| Climax lisible | 5 | 7,5 | ≥ 9 |
| Confiance / booker | 4 | 7 | ≥ 8 |

**Top 1 gap WOW restant :** hero encore **template clone** (orbes + vague) — zéro atmosphère parent/SCEE ; process + portrait absents. Bandeau `laisseSurTable` existe mais **sous** le total → regret pas encore « first ».

**Interdits V2 :** ne pas re-spécifier SoftClose / dual CTA / mid `ctaHeadline` (déjà livrés).

---

## 1. Hero — atmosphere CSS parent / SCEE

### Prop data
```js
// campagneAdsLandings.js → reee
atmosphere: 'parent-scee', // ou tint: 'navy-warm' + texture: 'soft-grain'
```

### Spec CSS (`PageHero` via `atmosphere`)
| Couche | Classes / effet | Intention |
|--------|-----------------|-----------|
| Base | `gradient-hero` inchangé (navy) | Cohérence catalogue |
| Tint sujet | Overlay `bg-gradient-to-br from-secondary/[0.12] via-transparent to-primary/40` | Or / chaleur parent sans violet |
| Texture | Grain SVG opacity ~0.04 **ou** motif points très léger (pas photo) | « Cahier / relevé » — micro-signal SCEE |
| Orbes | **Réduire** à 1 halo soft secondary bas-droit ; couper orbes multi-couches clutter | Différencie du clone sans casser shell |
| Wave | Garder `showWave` catalogue | Uniformité |

**Brand test :** sans nav → REEE + teinte chaude parent + « laisse sur la table » (titre déjà P0).  
**Pas** de photo parent·enfant.

### Avant → Après
| Avant | Après | Fichiers |
|-------|-------|----------|
| `PageHero` orbes ×3 + grille générique | `atmosphere="parent-scee"` tint or + grain soft | `PageHero.jsx` + data `reee` |
| Fold = n’importe quelle campagne | Fold « sent » subventions / parent | `CampagneAdsLanding.jsx` |

---

## 2. Micro-signaux fold (`heroExtras`)

Sous promesse / au-dessus CTAs (déjà dual) — **chips shell partagés**, copy script :

| Chip | Rôle |
|------|------|
| `Compte ouvert ≠ maximisé` | Contraste Ad1 |
| `SCEE · max ~7 200 $` | Ancre plafond |
| Kicker optionnel | `Subventions · Outil · Sans compte` |

Placement : `item.heroExtras` rendu par shell (même composant chips que CELIAPP / Hypothèque).  
Confiance CSF Victoriaville : **déjà** sous CTAs — ne pas dupliquer.

---

## 3. Process strip 3 steps

**Placement catalogue :** entre En bref et `#outil` — même composant / classes shell.

| # | Label court | Sous-ligne |
|---|-------------|------------|
| 1 | Âge | Où en est ton enfant |
| 2 | Rythme | Combien tu mets |
| 3 | Encore possibles | Ce qui reste · 15 min |

Sous-ligne section : `Trois gestes. Zéro jargon.`  
Icônes : chiffre dans cercle `bg-primary/10 text-primary` — **pas** de cards lourdes.

---

## 4. Portrait CSF

| Spec | Valeur |
|------|--------|
| Asset | `/seo/portrait.jpg` **existant** |
| Taille | 48–64 px, `rounded-full`, ring `ring-2 ring-white` |
| Placement | Mid soft-close (bandeau primary→dark) **ou** slot `ToolSoftClose` portrait — **même pattern catalogue** |
| Libellé | `Pierre-Olivier · CSF · Victoriaville` |

Ne pas inventer un autre crop / autre photo.

---

## 5. Climax visuel — regret-first

### État P0 (code actuel ~L630–711)
- Gros `totalIllustratif` d’abord (`text-2xl/3xl` si regret, sinon `3xl/4xl`)
- Bandeau `laisseSurTable` **sous** le total
- Grille 3 cols répète « Encore possibles »

### Cible V2 (quand `laisseSurTable > 0` && !`plafondAtteint`)
```
[ BANDEAU REGRET — dominant, full width, keyed ]
  Label: Encore possibles avant le max à vie (SCEE)
  Chiffre: ~X $   ← font-heading text-3xl sm:text-4xl text-primary
  Sous: Ce n’est pas « dû » — place illustrée selon ce rythme.

[ Total estimé — secondary ]
  Environ YY $   ← text-xl/2xl text-dark, label uppercase secondary
```

Quand `plafondAtteint` : garder traitement amber catalogue (pas de bandeau regret).

**Motion (helpers shell partagés) :**
1. Keyed reveal bandeau regret (`key={laisseSurTable}`) — fade/slide 200–300 ms  
2. Barre plafond — garder `transition-all duration-500`  
3. Fade SoftClose (déjà composant) — ne pas custom

**Typo :** strictement `font-heading` + `text-3xl/4xl` climax — pas d’échelle orpheline.

---

## 6. Champ `sceeDejaRecues` — chrome UI

- Field dans Block « Déjà en place » (entre enfant et épargne **ou** sous cotisation)  
- Surface `prestige-beige/50` — tokens existants  
- Hint taupe : distinction solde ≠ SCEE (script + finance)  
- Si seed > 0 : micro-badge secondaire près du bandeau regret « Avec ce que t’as déjà »

---

## 7. Spec Avant → Après (synthèse)

| Zone | Avant (post-P0) | Après V2 | Fichiers |
|------|-----------------|----------|----------|
| Hero | Orbes clone | `atmosphere: parent-scee` + grain | `PageHero` · data |
| Fold | Pas de chips sujet | `heroExtras` 2 chips | data · landing |
| Process | Absent | Strip 3 steps shell | landing · data |
| Portrait | Absent | 48–64 px mid SoftClose | shell · mid |
| Climax | Total first + bandeau | Regret-first XXL | `ReeeTool.jsx` |
| SoftClose | `ToolSoftClose` OK | **Ne pas toucher** (placement sous climax OK) | — |

---

## 8. Critères acceptation visuelle

- [ ] Ami 5 s : « c’est la campagne REEE / laisse sur la table » (pas une landing générique)
- [ ] Aucune nouvelle photo
- [ ] Process + portrait = mêmes composants que le catalogue
- [ ] `laisseSurTable` = chiffre dominant si > 0
- [ ] Amber uniquement si max atteint
