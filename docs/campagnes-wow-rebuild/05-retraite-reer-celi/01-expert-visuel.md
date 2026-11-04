# [#05] Expert marketing visuel — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/05-retraite-reer-celi.md` · `CampagneAdsLanding.jsx` · `PageHero.jsx` · `RetraiteReerCeliTool.jsx` · brief ads navy « REER · CELI »  
**Objectif :** identité sujet + climax $ + dual CTA → booker en 15 min.

---

## 1. Vision visuelle (1 paragraphe)

La page doit « sentir » les **deux enveloppes** dès le hero : navy / primary pour le REER, secondary / turquoise pour le CELI — pas un clone orbs générique. Le climax n’est pas le mot « Mixte » en ambre ; c’est le **partage en dollars** (ex. `250 $ / 250 $`) en typo XXL, SplitBar en secondaire, pastille « Mixte — à affiner » en taupe/primary. PDF en outline ; RDV full-width au pouce. Un ami qui regarde l’écran doit lire en 5 s : « il valide son ordre 250/250 + matching ».

---

## 2. Hero — composition 1 viewport

| Élément | Spec Après | Fichier / classe |
|---------|------------|------------------|
| Brand signal | Ligne sous badge ou filigrane léger **« REER · CELI »** (tracking large, `text-white/35`–`/50`, `font-heading`) | `CampagneAdsLanding.jsx` children / data `heroKicker` **ou** override local slot — dette shell si `PageHero` n’accepte pas de kicker |
| Badge | Garder `Retraite` | `campagneAdsLandings.js` |
| H1 | Garder « REER ou CELI : où va le prochain dollar ? » | data landing |
| Promesse | 1 phrase (voir script) — max ~2 lignes mobile | `promise` |
| CTA groupe | **Primaire soft** blanc/outline : « Essayer le prioriseur » → `#outil` · **Secondaire texte** : « Réserver 15 minutes » → `rdvPath` | `CampagneAdsLanding.jsx` L62–88 — besoin dual children |
| Atmosphère | Gradient hero existant OK ; ajouter **2 barres couleur** discrètes (secondary + primary, 3–4 px) sous le H1 ou en bas du hero avant la vague — signal bi-compte ads | CSS local landing ou `heroAccent: 'reer-celi'` |
| Confiance | Sous CTAs ou juste sous vague : `Conseiller en sécurité financière · Victoriaville · éducatif` en `text-xs text-white/70` ou bandeau taupe sur fond blanc | data + slot |

**Test brand :** après retrait de la nav, le filigrane « REER · CELI » + dual bars empêche le « n’importe quelle campagne ».

**Budget hero :** brand signal · H1 · 1 promesse · CTA group · atmosphère. Pas de stats, FAQ, cards.

---

## 3. Palette / typo / motion

### Palette campagne
- **REER** → `bg-primary` / navy (déjà SplitBar droite)
- **CELI** → `bg-secondary` (déjà SplitBar gauche)
- **Mixte nuance** → `border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05]` — **jamais** `amber-*` / `AlertTriangle`
- **CELI/REER ok** → garder emerald actuel
- Fond page : blanc + `via-gray-50/80` (shell) — OK
- Mid CTA : garder `from-primary to-dark` ; texte white

### Typo
- Climax $ : `font-heading text-3xl sm:text-4xl font-bold tracking-tight` (snapshot mixte)
- Label « Mixte — à affiner » : `text-sm text-prestige-taupe` sous le $
- Ordre CELI/REER clairs : garder XXL sur `short` vert

### Motion (3 utiles — pas décor)
1. **SplitBar** — déjà `duration-500 ease-out` → garder ; s’assurer qu’un changement de choix re-anime la largeur.
2. **Count-up soft** sur `celiAmt` / `reerAmt` au climax (300–400 ms) quand `monthly > 0` — présence du « prochain dollar ».
3. **Tone crossfade** ResultCard : transition `transition-colors duration-300` quand on passe warn→nuance / ok (évite flash ambre).

Pas de glow purple, pas de pills clusters, pas de stickers flottants sur le hero.

---

## 4. Corps de page — modules

### En bref (garder 3 items, alléger le « card soup »)
- **Avant :** 3 cards blanches ombrées numérotées.
- **Après (option S) :** même structure shell, mais copy process narratif (script) — pas de 4e card.
- **Après (option M, shell) :** strip process horizontal 3 pas hors cards : `Répondre` → `PDF` → `15 min` avec connectors `→` — au-dessus de « À toi de jouer ».

### Intro outil
- Remplacer le générique « À toi de jouer » / « Remplis l’outil… » par microcopy sujet (script) : « Prioriseur REER · CELI ».
- Wrapper outil : `id="outil"` pour le deep-link hero.

### Climax outil (hiérarchie visuelle)
| Cas | Dominant | Secondaire |
|-----|----------|------------|
| `key === 'mixte'` + `monthly > 0` | XXL `250 $ / 250 $` (CELI / REER) | Sous-ligne « Mixte illustratif » + SplitBar |
| `key === 'mixte'` + monthly 0 | XXL `% / %` ou leanLabel | Label Mixte taupe |
| `key === 'celi' \| 'reer'` | XXL `short` emerald | SplitBar 100/0 + $ si monthly |

ResultCards Block 2 : si mixte, **Partage** en pleine largeur (`sm:col-span-2`) au-dessus de l’ordre ; ordre en pastille nuance sans triangle.

### Footer outil
```
[ microcopy selon key ]
[ Réserver 15 min avec mon résumé ]  ← primary full-width mobile
[ Télécharger mon résumé PDF ]       ← outline / ghost (inverser styles vs ToolDownloadPdf actuel)
```
Stack `flex-col` mobile ; `sm:flex-row` desktop avec RDV à droite (ou gauche primaire). Zone pouce : RDV d’abord.

### Soft close mid
- Remplacer H2 hardcodé « Prêt à clarifier… » par `item.ctaHeadline` / `item.ctaSubline` (même branche RDV que form — shell L181–187).
- Ligne confiance sous boutons : « Sans compte · PDF gratuit · 15 min soft · zéro harcèlement ».

### FAQ / capsules
- FAQ 4 items (script) — layout existant OK.
- Capsules : label « Capsules REER · CELI » ; idéalement 2 liens (`/apprendre/reer-ferr` + `/apprendre/celi`) — si shell 1 seul `apprendrePath`, lien primaire REER/FERR + secondaire CELI en texte.

---

## 5. Mobile (thumb zones)

| Zone | Action |
|------|--------|
| Hero bas | Primaire « Essayer le prioriseur » full-width ≥44 px ; RDV texte dessous |
| ChoiceGroup | Déjà 1 col — garder ; matching employeur = 3 options 1 col |
| Footer outil | RDV stacked au-dessus du PDF ; PDF outline moins dominant |
| Mid CTA | Bouton blanc full-width puis capsule outline |

Éviter : climax dupliqué (snapshot haut + cards bas) trop dense — sur mobile, snapshot $ suffit ; cards peuvent compresser `detail`.

---

## 6. Avant → Après (composants concrets)

1. **Hero identité** — Avant : `PageHero` + seul Link RDV blanc. Après : kicker « REER · CELI » + Link/`a[href=#outil]` primaire + Link RDV secondaire `text-white/90 underline-offset`.
2. **Climax mixte $** — Avant : `suggestion.short` « Mixte » XXL + ResultCard `tone warn` + `AlertTriangle`. Après : si mixte & monthly : afficher `${formatCad(celiAmt)} / ${formatCad(reerAmt)}` en XXL ; `tone: 'nuance'` = branche default primary (sans icon warn).
3. **Footer dual** — Avant : `ToolDownloadPdf` primary seul. Après : `Link` RDV `rounded-full bg-primary…` + PDF avec classes outline (`border border-primary/30 bg-white text-primary`) — nouveau prop `variant="outline"` sur `ToolDownloadPdf` **ou** bouton local.
4. **Mid copy data-driven** — Avant : H2 hardcodé L183. Après : `{item.ctaHeadline \|\| '…'}` / `{item.ctaSubline \|\| '…'}`.
5. **Strip confiance** — Avant : Victoriaville footer seul. Après : ligne CSF sous hero ou pre-mid.

---

## 7. Dette shell vs spécifique #05

| Item | Scope |
|------|--------|
| Dual CTA hero + `#outil` | Shell `CampagneAdsLanding` (toutes campagnes) — flag data `heroPrimary: 'outil'` |
| `ctaHeadline` mid RDV | Shell L181–187 |
| `ToolDownloadPdf` variant outline | `CampagneToolShell.jsx` |
| Kicker / dual bars REER·CELI | Spécifique #05 (data ou classe) |
| Snapshot $ + tone nuance + footer RDV | `RetraiteReerCeliTool.jsx` only |

---

## 8. Critères acceptation visuel

- [ ] Sans nav, on identifie REER · CELI en <3 s  
- [ ] Defaults load : **aucun** ambre / triangle  
- [ ] Mixte + 500 $ : dollars dominent le snapshot  
- [ ] CTA RDV visible dans le footer outil sans scroller le mid  
- [ ] Mobile : RDV au-dessus du PDF, zone pouce  
