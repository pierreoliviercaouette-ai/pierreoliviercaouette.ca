# [#09] CELI droits — Spec VISUEL (refonte WOW)

**Slug :** `/campagnes/celi-droits`  
**URL live :** https://www.pierreoliviercaouette.ca/campagnes/celi-droits  
**Rôle :** Expert marketing visuel  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/09-celi-droits.md` · `CeliDroitsTool.jsx` · `CampagneAdsLanding.jsx` · ads `emails/campagne-meta-catalog/celi-droits.md`

---

## 1. Direction visuelle (1 phrase)

**Mythe bancaire → place restante :** navy iA, contraste plafond annuel vs place totale, pastille « sans compte », climax chiffre + chips d’usage — pas un clone PageHero orbes seules.

---

## 2. Hero — composition 1 viewport

### Avant (live)
- Badge CELI OK · H1 « ça coûte cher en silence » (angle coût ≠ Meta) · promesse Ad3 OK · **1 seul CTA blanc = RDV** · fond PageHero navy/orbes génériques · bandeau portefeuilles modèles au-dessus = distraction.

### Après (ship)
| Élément | Spec |
|---------|------|
| **Brand** | Nav iA + Pierre-Olivier inchangés (déjà au fold) |
| **Badge** | `CELI` (existant) |
| **H1** | Voir `02-expert-script.md` — angle place restante / mythe plafond, **pas** « coûte cher » |
| **Promesse** | 1 phrase · outil 2 min + usage optionnel |
| **Trust fold** | Pastille pill sous promesse : `Sans compte · sans formulaire · estimation` (classes : `inline-flex rounded-full bg-white/15 px-3 py-1 text-xs text-white/90`) |
| **CTA primaire** | Bouton blanc « Estimer ma place » → `scrollIntoView` `#outil` (même style que CTA RDV actuel) |
| **CTA secondaire** | Lien texte blanc/80 « Ou réserver 15 minutes » → `/rendez-vous/campagne` + `trackRendezVousClick('campagne_celi-droits_rdv')` |
| **Atmosphère** | Garder PageHero ; ajouter **1 ancre visuelle CELI** sous la promesse : micro-split 2 labels `Plafond année` vs `Place restante` (chiffres décoratifs / non-live : « 7 000 $ » vs « ? ») en `text-white/70` — hint Ad1, pas un second outil |

### Fichiers
- Copy : `frontend/src/data/campagneAdsLandings.js` (`celi-droits`)
- Shell dual CTA : `frontend/src/pages/CampagneAdsLanding.jsx` — pattern `heroPrimary: 'outil' | 'rdv'` **ou** branche slug `celi-droits` seulement si catalogue dual CTA pas encore prêt
- Ancre : wrapper outil `id="outil"` sur le bloc « À toi de jouer » (~L117–137)

---

## 3. Palette / typo / motion

| Token | Usage |
|-------|--------|
| `primary` / `dark` | Navy climax, soft-close bandeau, CTA filled |
| `secondary` | Labels uppercase, accents or |
| `prestige-beige` / taupe | Fond blocs secondaires, hints |
| `amber-*` | Tone warn (dépassement) — déjà en place |
| Typo | `font-heading` pour gros $ ; tabular-nums pour montants |

### 3 motions utiles (pas de bruit)
1. **Barre place utilisée** — déjà `transition-all duration-500` : garder.
2. **Reveal climax** — au mount/update de `placeRestante` : `animate-in fade-in zoom-in-95 duration-300` (ou `transition` opacity/scale) sur le gros chiffre.
3. **Chip usage** — `transition-colors` + scale légère au select (`ring-2 ring-primary`) ; lecture points fade-in quand `usage` change.

Éviter : nouveaux orbes, glow purple, pills multi-couches hors pastille trust.

---

## 4. Modules manquants (corps + outil)

### A. Contraste plafond vs place (climax)
Sous le label « Place restante », **avant** le gros $ **ou** juste au-dessus :

```
[ Plafond 2026 ]     [ Place restante estimée ]
  7 000 $                  84 000 $   ← dominant (text-3xl/4xl)
  text-sm                  font-heading bold
```

Grid `sm:grid-cols-2` ; colonne place = fond `from-primary/[0.06]` ; colonne plafond = `bg-white/60` + border soft.  
Implémentation : `CeliDroitsTool.jsx` zone ~L515–532.

### B. Chips usage (dette produit #1 — visuel)
3 chips exclusives sous le gros $ / avant « Ce que ça veut dire » points :
- Fonds d’urgence · Projet court terme · Long terme / retraite
- Style : `rounded-full border` idle ; selected `bg-primary text-white border-primary`
- Mobile : wrap 2+1 ou stack full-width tap targets ≥44px

### C. Soft-close bandeau navy **dans** l’outil (≤2 s post-climax)
Bloc `rounded-2xl bg-gradient-to-br from-primary to-dark text-white` sous ResultCards (ou dans `footer` shell) :
- Ligne 1 : `~{X} $ estimés · usage {label}`
- CTA filled blanc « Coller un usage — 15 min »
- PDF outline / ghost (`border-white/35`) — **secondaire**

### D. Confiance près mid CTA
Sous mid navy (landing) : ligne `CSF · Victoriaville · Clarifier ≠ cotiser demain` en `text-white/70 text-xs`.

### E. Lien ARC cliquable
Remplacer plain « Mon Dossier ARC » (intro + disclaimer + points) par `<a>` nouvel onglet — URL officielle (voir `04-expert-finance.md`). Style `underline underline-offset-2 text-primary`.

---

## 5. Mobile (thumb zones)

| Zone | Spec |
|------|------|
| Hero | CTA primaire plein largeur ; secondaire sous, centrés |
| Outil inputs | déjà full-width — OK |
| Chips | min-h-11, gap-2, pas de 3 colonnes serrées |
| Soft close outil | stack CTA puis PDF ; CTA RDV en premier (ordre DOM = pouce) |
| Mid landing | garder stack `flex-col` existant |
| Scroll mort | compresser « À retenir » (4 bullets → 3 ou collapsible) **ou** le pousser sous soft close RDV |

---

## 6. Avant → Après (composants)

| # | Avant | Après | Où |
|---|-------|-------|-----|
| 1 | Hero H1 coût + CTA RDV only | H1 place restante + primaire `#outil` + secondaire RDV + pastille sans compte | `campagneAdsLandings.js` + `CampagneAdsLanding.jsx` |
| 2 | 84k seul ; 7k noyé dans `lecture.detail` | Split 2 col plafond vs place | `CeliDroitsTool.jsx` |
| 3 | Footer PDF only | Bandeau navy soft close + PDF ghost | `CeliDroitsTool.jsx` footer |
| 4 | Usage = string lecture | 3 chips interactives | `CeliDroitsTool.jsx` |
| 5 | Defaults sans marquage | Badge « Exemple » amber/soft jusqu’au 1er edit | Blocks 1–2 |

---

## 7. Critères acceptation VISUEL

- [ ] Fold = brand + H1 place + 1 promesse + pastille sans compte + CTA outil-first (pas RDV-only)
- [ ] Climax : contraste 7k vs place restante impossible à manquer en &lt;2 s
- [ ] Chips usage visibles et tappables mobile
- [ ] Soft close RDV navy apparaît **avant** que le PDF soit le seul call-to-action
- [ ] Test ami 5 s : « Ah — t’as de la place, t’as choisi un usage »

**Note cible post-refonte :** 8,5/10 (baseline audit 6/10)
