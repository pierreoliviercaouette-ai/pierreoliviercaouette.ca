# [#06] Maladie grave — Spec VISUEL (refonte WOW)

**Slug :** `/campagnes/maladie-grave`  
**Fichier :** `01-expert-visuel.md`  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/06-maladie-grave.md` · live · `CampagneAdsLanding.jsx` · `MaladieGraveTool.jsx` · `PageHero`

**Verdict :** Note visuelle actuelle **5,5/10**. H1 mythe = fort ; composition = shell clone. L’identité « Invalidité ≠ capital » n’existe qu’en typo — pas en layout. Climax écart amber orphelin (PDF vole le next step).

---

## 1. Hero — 1 viewport, 1 composition

### Objectif émotionnel
Prospect Ad1 (« j’ai déjà l’invalidité ») : en 3 s, *voir* deux jobs différentes — pas seulement *lire* le H1.

### Composition (garder PageHero navy/grid existant)
| Slot | Contenu |
|------|---------|
| Badge | `Maladie grave` (garder) |
| H1 | **Garder** : `Maladie grave ≠ invalidité — un capital à part` |
| Promesse | 1 phrase (voir script) — max 2 lignes mobile |
| Signal sujet | **Nouveau** : 2 chips sous promesse |
| CTA | Dual (outil-first) |

### Chips dual (sous H1 / promesse)
```
[ Invalidité = revenu dans le temps ]   [ MG = capital forfaitaire ]
```
- Style : `rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/90`
- Mobile : stack vertical, pouce OK, pas de wrap cassé
- **Pas** de badge flottant / sticker overlay sur media (pas de hero image ici)

### CTA dual (shell — dette #2)
| Priorité | Label | Action | Style |
|----------|-------|--------|-------|
| Primaire | Estimer mon capital | `scrollIntoView` → `#outil` | blanc plein (actuel) |
| Secondaire | ou réserver 15 min | `Link` → `rdvPath` + `trackRendezVousClick('campagne_maladie-grave_rdv')` | texte / ghost `border-white/35` |

**Avant :** 1 bouton RDV froid above-the-fold.  
**Après :** outil primary (aligné Ad3) + RDV ghost.

### Atmosphère sujet (au-delà du badge)
- Garder navy mythe-bancaire (brief ads).
- Renforcer avec chips ≠ + éventuellement symbole typographique `≠` discret dans le badge ou chips (pas d’imagerie médicale).
- Sans le nav, la page doit encore *sentir* « capital vs chèque de paie » grâce aux chips — pas un hero CSF générique.

### Motion (2–3 utiles — pas décor)
1. **Reveal capital** : chiffre `formatCad(capital)` fade/slide-up 200–300 ms au mount + à chaque change (respect `prefers-reduced-motion`).
2. **Pulse écart** : bandeau amber — léger scale ou border flash 1× quand `ecart` change (pas loop infini).
3. **Scroll hint** (optionnel) : chevron soft sous CTA primaire hero → `#outil` (1 bounce, puis stop).

---

## 2. Module contraste Invalidité ≠ MG (post–En bref **ou** haut outil)

**Job unique de la section :** prouver Ad1 en 5 s sans FAQ.

### Layout 2 colonnes (pas cards soup)
```
┌─────────────────────┐  ┌─────────────────────┐
│ INVALIDITÉ          │  │ MALADIE GRAVE       │
│ Chèque de paie      │  │ Capital forfaitaire │
│ partiel · dans le   │  │ · une fois · si     │
│ temps               │  │ contrat OK          │
│                     │  │                     │
│ = revenu            │  │ = 3 blocs (conjoint │
│                     │  │   + soins + QV)     │
└─────────────────────┘  └─────────────────────┘
```
- Desktop : `grid sm:grid-cols-2 gap-3`
- Mobile : stack, MG en 2ᵉ (destination de la page)
- Fond : `bg-prestige-beige/40` ou split soft navy/amber très léger — **pas** 2 white cards clones En bref
- Remplace/complète la ligne taupe 12px `MaladieGraveTool.jsx` L310–313

**Où :**
- Idéal page : bloc dédié dans `CampagneAdsLanding` via flag data `contrastModule` **ou** section hardcodée slug-aware
- Fallback rapide : bandeau haut **dans** `MaladieGraveTool.jsx` (sous intro shell) — zéro dette shell

---

## 3. Corps — En bref + outil

### En bref
- Garder 3 jobs numérotées (conjoint / SCC / QV+couvert).
- Micro-ajustement copy (script) ; layout cards OK **si** le module contraste existe juste avant/après — sinon En bref reste clone #04.

### Zone outil (`#outil`)
- Ancre : `id="outil"` sur le wrapper Tool (`CampagneAdsLanding.jsx` ~L117–136).
- Intro « À toi de jouer » : remplacer « résumé clair et un PDF » → « un capital illustratif + l’écart vs ce que t’as déjà » (script).
- Snapshot gradient capital : **rester above-the-fold outil** (déjà le cas).

### Climax écart amber — asset #1 (viewport critique)
**Avant :** bandeau amber seul → footer PDF.  
**Après (même viewport) :**
```
[ bandeau Écart vs déjà couvert · formatCad(ecart) ]
[ CTA plein : Clarifier cet écart (~X $) en 15 min ]  ← primaire
[ Ghost : Télécharger mon résumé PDF ]
```
- Bouton RDV : `rounded-full bg-primary text-white` (contraste fort sur amber)
- PDF : `ToolDownloadPdf` ghost / text link
- Mobile thumb : CTA RDV full-width sous bandeau ; PDF en dessous

---

## 4. Soft close mid (navy)

**Avant :** titre hardcodé « Prêt à clarifier ta situation ? » (`CampagneAdsLanding.jsx` L181–187) — générique.  
**Après :** brancher `item.ctaHeadline` / `item.ctaSubline` aussi quand `!isFormCta` (dette shell #1).

### Confiance near-CTA (ligne humaine)
Sous le bloc navy mid :
```
Conseiller en sécurité financière · Victoriaville · éducatif, pas un pitch
```
- `text-xs text-prestige-taupe` ou `text-white/60` si dans le navy
- Option P1 : petite photo conseiller (pattern About) — pas obligatoire P0

---

## 5. Mobile thumb zones

| Zone | Action |
|------|--------|
| Hero bas | CTA « Estimer mon capital » (pouce) |
| Outil snapshot | Chiffre + écart lisibles sans zoom |
| Sous écart | Bouton RDV full-width |
| Champs | `MoneyInput` déjà OK ; raccourcir hint SCC (1 ligne + « détails ») |
| Mid navy | CTA RDV + capsule apprendre |

Éviter : promesse hero trop longue ; hint SCC qui pousse les champs hors premier scroll outil.

---

## 6. Avant → Après (composants / classes)

| # | Avant | Après | Fichier |
|---|-------|-------|---------|
| 1 | H1 seul + CTA RDV | Chips dual + CTA primaire `#outil` + ghost RDV | `CampagneAdsLanding.jsx` / `PageHero` children |
| 2 | Écart amber sans next step | Même bandeau + CTA RDV plein + PDF ghost | `MaladieGraveTool.jsx` L197–229, footer L164–172 |
| 3 | Mid « Prêt à clarifier… » | Headline/subline data + ligne CSF · Victoriaville | `campagneAdsLandings.js` + `CampagneAdsLanding.jsx` L181–210 |
| 4 | Phrase taupe Invalidité≠MG | Module 2 cols contraste | Tool haut **ou** landing post–En bref |
| 5 | 0 motion | Reveal capital + pulse écart | `MaladieGraveTool.jsx` |

---

## 7. Ce qu’on ne fait **pas**
- Imagerie hôpital / patient choc
- Cards supplémentaires dans le hero
- Overlay badges / stickers promo
- Purple glow / pills décoratives hors design system prestige
- Dashboard multi-stats dans le 1er viewport

---

## 8. Critères acceptation VISUEL
- [ ] En 5 s sans lire la FAQ, un ami comprend « invalidité ≠ capital » (chips ou module 2 cols)
- [ ] CTA RDV visible dans le **même viewport** que l’écart amber (desktop + mobile)
- [ ] Hero = outil-first (pas RDV seul)
- [ ] Mid navy cite capital / brochure / Clarifier ≠ acheter (pas clone shell)
- [ ] 2 motions utiles livrées (capital + écart)
