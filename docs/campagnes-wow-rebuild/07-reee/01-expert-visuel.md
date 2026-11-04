# [#07] REEE — Expert marketing visuel

**Slug :** `/campagnes/reee`  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/07-reee.md` · live · `PageHero` · `CampagneAdsLanding.jsx` · `ReeeTool.jsx` · brief ads navy  
**Job :** refonte visuelle shippable — WOW sur `laisseSurTable` / SCEE → envie de booker

---

## 1. Verdict visuel (1 paragraphe)

Landing template-clone (gradient navy + orbes + vague) : sans la nav, ça pourrait être n’importe quelle campagne éducative. Le sujet REEE (parent / subventions / regret doux) n’existe pas au fold. L’outil est le seul vrai moment de design (barre plafond animée) — mais le climax émotionnel `laisseSurTable` est une 3e métrique `text-lg` égale aux deux autres. Soft-close mid = bandeau primary→dark générique. Objectif refonte : **1 composition sujet au fold**, **climax « Encore possibles » impossible à manquer**, **pont RDV digne post-outil**.

**Note actuelle /10 :** 5,5 → **cible /10 :** 8,5

---

## 2. Hero — composition 1 viewport

### Brand test
Sans nav, le premier viewport doit dire **REEE · Pierre-Olivier / Victoriaville**, pas « landing subventions générique ».

### Composition (desktop + mobile)
| Zone | Contenu | Règles |
|------|---------|--------|
| Atmosphère | Fond **navy plein cadre** (`bg-primary` / `gradient-hero` sans orbes parasites) ; option photo parent·enfant en overlay sombre 40–55 % | Pas d’orbes multi-couches ; pas de collage inset |
| Brand signal | Mot « REEE » en display blanc (badge secondaire ou eyebrow court `REEE · Subventions`) | Badge actuel OK mais titre doit porter le mythe |
| Titre (1) | Voir script : *REEE ouvert ≠ subventions maximisées* | Blanc, `font-heading`, max ~2 lignes mobile |
| Promesse (1) | Âge + rythme → SCEE, reste avant ~7 200 $, laisse sur la table | `text-white/80`, 1–2 phrases |
| Confiance (1 ligne) | `Conseiller en sécurité financière — Victoriaville` | Sous promesse, `text-sm text-white/70` — **nouveau** |
| CTA group | Primary : scroll `#outil` · Secondary : RDV outline blanc | Dual CTA — shell (voir PM) |

### Avant → Après
| Avant | Après |
|-------|-------|
| `PageHero` orbes + titre « Études… ~20 % » + seul CTA « Réserver 15 minutes » | Navy sujet + titre mythe + ligne CSF Victoriaville + CTA outil primary / RDV secondary |
| Brand = nav only | Mot REEE + conseiller local visibles sans nav |

### Fichiers / hooks
- Data : `campagneAdsLandings.js` → `reee` (title, promise, labels CTA)
- Shell : `CampagneAdsLanding.jsx` + éventuellement prop `PageHero` `variant="navy-subject"` **ou** classe override campagne (`heroTone: 'navy'`) — **dette shell partagée**
- Créa Meta : brief `emails/campagne-meta-catalog/reee.md` (navy, parent·enfant) — aligner hero live

---

## 3. Palette / typo / motion

### Palette (variables existantes — pas de violet)
| Token | Usage REEE |
|-------|------------|
| `primary` / navy | Hero fond, soft-close mid, barre SCEE |
| `secondary` (or / accent site) | Eyebrows, labels « Vers le max » |
| `dark` | Chiffres outil |
| `prestige-beige` / taupe | Surfaces outil, hints secondaires |
| **Nouveau accent regret** | `text-primary` fort ou `border-primary/30` + fond `from-primary/[0.06]` pour bandeau `laisseSurTable` — **ne pas** utiliser `amber` (réservé max atteint) |
| Amber | Uniquement `plafondAtteint` |

### Typo
- Display / headlines : `font-heading` (existant)
- Chiffre climax `laisseSurTable` : `text-2xl sm:text-3xl font-bold` — doit rivaliser le total études
- Total études : reste grand mais **sous-ordonné** quand `laisseSurTable > 0` (label « Total estimé » plus petit ; bandeau regret plus bas en typo dominante)

### Motion (2–3 utiles — pas de bruit)
1. **Barre plafond** — garder `transition-all duration-500` (déjà WOW)
2. **Bandeau « Encore possibles »** — `animate-in` / fade+slide 200–300 ms quand `laisseSurTable` change et > 0
3. **Soft-close post-outil** — apparition après milestone lecture (`done`) : léger scale/opacity, une seule fois

Pas de glow pills, pas de confetti, pas de countdown fake.

---

## 4. Corps de page — modules

### Ordre sections (1 job chacune)
1. Hero mythe (outil-first)  
2. En bref (3 bullets — bullet 1 = compte ouvert ≠ maximisé)  
3. **Process 3 steps** (nouveau, compact) : Âge → Rythme → Encore possibles → 15 min  
4. Outil `#outil`  
5. Soft-close mid data-driven (`ctaHeadline` / `ctaSubline`)  
6. FAQ (dont « J’ai déjà un REEE »)  
7. Disclaimer

### Process 3 steps (manquant)
- Rangée horizontale desktop / stack mobile
- Icônes simples (pas cards lourdes) : chiffre dans cercle primary
- Copy courte — voir script
- Placement : **entre En bref et outil**, `max-w-3xl`

### Confiance
| Manque | Spec |
|--------|------|
| Photo conseiller | Option P1 : vignette ronde 48–64 px près soft-close mid **ou** ligne confiance hero suffit en P0 |
| CSF + Victoriaville | Hero + footer déjà partiel → **hero obligatoire** |
| Microcopy ads | « Calme. Concret. Zéro pression. » sous CTA mid / post-outil |

### Densité outil
- « À retenir » → `<details>` mobile (fermé par défaut sous `md`), ouvert desktop optionnel
- Soft-close chiffré **immédiatement sous** grille / bandeau `laisseSurTable`, **avant** PDF
- PDF = outline secondary, pas trophée primary

---

## 5. Climax visuel `laisseSurTable` (cœur WOW)

### Avant
Grille 3 cols égales ; « Encore possibles » = 3e cellule `text-lg text-dark`.

### Après (quand `laisseSurTable > 0`)
```
[ Total estimé — secondary typography ]
  Environ XX XXX $

[ BANDEAU REGRET — full width sous le total ]
  Label: Encore possibles avant le max à vie (SCEE)
  Chiffre: ~1 200 $   ← text-2xl/3xl font-heading font-bold text-primary
  Sous-ligne: Ce n’est pas « dû » — c’est de la place illustrée selon ce rythme.
```

Quand `plafondAtteint` : garder traitement amber actuel (max atteint) — pas de bandeau regret.

### Callout `sousMaxAnnuel`
- Remplacer hint taupe sous carte SCEE/an par callout bordure primary, fond beige léger, **chiffre Y $/an** en bold
- Preset `2 500 $ · max SCEE` : ring / poids visuel légèrement plus fort que les autres presets

---

## 6. Soft close / mid CTA

### Mid (shell)
- Garder `rounded-3xl bg-gradient-to-br from-primary to-dark`
- Copy **data** (`ctaHeadline` / `ctaSubline`) — finir le hardcode « Prêt à clarifier… »
- Capsule Apprendre = poids **secondaire** (outline) ; RDV = primary blanc
- Microcopy sous boutons : Calme. Concret. Zéro pression.

### Post-outil (dans `ReeeTool` footer zone)
- Card / bandeau citant `~X $` + CTA `Relier ça à mon budget — 15 min`
- PDF à droite ou sous, style outline
- Mobile : CTA RDV full-width thumb zone bas de carte ; PDF lien texte

---

## 7. Mobile — thumb zones

| Zone | Action |
|------|--------|
| Fold bas | CTA primary « Voir ce que je laisse… » (scroll outil) — pouce |
| Outil Block 2 | Presets cotisation facilement tappables (≥ 44 px) |
| Post-climax | RDV full-width avant PDF |
| Mid | RDV primary ; capsule secondary |

Hero : ne **pas** voler le pouce avec RDV-only (ads = outil d’abord).

---

## 8. TOP 3 upgrades visuels (Priorité)

| # | Avant → Après | Impact | Effort | Fichier |
|---|----------------|--------|--------|---------|
| 1 | Hero orbes/mythe faible → navy sujet + dual CTA + confiance locale | H | S–M | `campagneAdsLandings.js` + shell `CampagneAdsLanding` / `PageHero` |
| 2 | `laisseSurTable` 3e métrique → bandeau regret dominant | H | S | `ReeeTool.jsx` bloc résultat ~L576–601 |
| 3 | Footer PDF-first → soft-close card + PDF outline ; À retenir en details mobile | H | S | `ReeeTool.jsx` footer + ~L604–623 |

---

## 9. Critères acceptation visuelle

- [ ] Brand test : sans nav, on sait que c’est REEE + conseiller Victoriaville  
- [ ] Ami en 5 s voit « encore ~X $ » comme chiffre dominant si > 0  
- [ ] Hero CTA primary = outil, pas calendrier  
- [ ] Amber uniquement pour max atteint  
- [ ] Aucune promesse visuelle « études payées à 100 % »
