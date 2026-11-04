# [#02] CELIAPP — Spec visuelle (refonte WOW)

**Rôle :** Expert marketing visuel  
**Slug :** `/campagnes/celiapp`  
**Date :** 2026-11-04  
**Sources :** audit `02-celiapp.md`, live, `PageHero`, `CampagneAdsLanding`, `CeliappTool`, `ModelPortfoliosBanner`

---

## 1. Hero — composition 1 viewport

**Job unique :** promesse simulateur mise de fonds → scroll outil (pas Bookings).

| Élément | Spec |
|---------|------|
| Brand | Eyebrow sous badge : `Conseiller en sécurité financière · Victoriaville` (texte blanc/80, `text-xs` tracking) — signal Caouette hors nav |
| Badge | `CELIAPP` (existant `PageHero` badge) |
| Titre | `Ta mise de fonds, en clair avec le CELIAPP` — `font-heading`, ne pas surpasser le brand |
| Promesse | 1 phrase : rythme → projection cotisations (voir script) |
| CTA group | **Primary** blanc : « Projeter ma mise de fonds » → `scrollIntoView` `#outil` · **Secondary** outline blanc : « Clarifier mon CELIAPP (15 min) » → RDV |
| Atmosphère | Full-bleed photo/texture **1ʳᵉ propriété** (clés / foyer / porte Centre-du-Québec) + overlay navy `from-primary/90 via-dark/80` — **pas** orbes seules |

**Budget viewport :** brand + titre + promesse + dual CTA + atmosphère sujet. Interdit dans le fold : stats, FAQ, PDF, strip portefeuilles.

**Mobile thumb :** dual CTA empilés, primary en bas du hero (`min-h` touch 44px), secondary au-dessus du fold bas — pouce droit atteint primary sans scroll.

---

## 2. Palette / typo / motion

**Palette (tokens existants) :**
- Navy `primary` / `dark` — surfaces hero + soft close post-chiffre
- Or `secondary` — accents tracking, points checklist
- Beige `prestige-beige` — « À retenir » **seulement** (secondaire au navy conversion)
- Ambre `amber-500` — barre max à vie (garder, ne pas en faire le climax par défaut)

**Typo :** `font-heading` chiffres climax `text-3xl sm:text-4xl` ; labels uppercase `text-xs tracking-wide text-secondary`.

**Motions (3 max, utiles) :**
1. Barre « Vers le max à vie » : `transition-all duration-500` (déjà) — fill démarre ~40 % avec defaults réalistes, pas 100 %
2. Card résultat : léger `fade/slide-up` au premier `milestones[2].done` (opacity + translateY 8→0, 300 ms)
3. Bandeau RDV post-chiffre : `animate-in` dès que projection prête — attire l’œil dans les 2 s post-climax

Pas de glow orbs supplémentaires ; pas de pills flottantes sur le hero media.

---

## 3. Modules manquants (preuve / process / confiance)

| Module | Placement | Avant → Après |
|--------|-----------|---------------|
| Strip portefeuilles | `App.js` `ModelPortfoliosBanner` au-dessus hero | Visible sur `/campagnes/*` → **masquer** si `pathname.startsWith('/campagnes')` (ou ancre « placement = autre page ») |
| Process 3 steps | Sous En bref ou intro outil | Absent → ligne : `1. Projeter` → `2. Lire le chiffre` → `3. 15 min si doute` (pas de cards) |
| Confiance | Sous dual CTA hero **ou** au-dessus `#outil` | Absent → 1 ligne CSF · Victoriaville + logo iA déjà en nav |
| Contraste CELI ≠ CELIAPP | Sous « À retenir » ou En bref | Bullet seul → mini tableau 3 lignes (objectif / retrait / plafond) — pas une card soup |
| Soft close navy collé | Immédiatement sous total dans `CeliappTool` | Beige « À retenir » puis PDF primary → **bandeau navy** RDV primary + PDF outline, puis beige secondaire |

---

## 4. Corps de page — hiérarchie visuelle

```
[Nav]
[Hero full-bleed 1ʳᵉ propriété + dual CTA]     ← fold
[En bref — 3 bullets, moins « card » si possible]
[Process 3 steps — une ligne]
[À toi de jouer + CeliappTool]
  └ progress bar
  └ steps 1–2
  └ climax (headline + chiffre)
  └ BANDEAU NAVY RDV (2 s)          ← conversion
  └ À retenir beige
  └ footer PDF outline
[Mid soft close navy — copy CELIAPP]
[FAQ]
[Footer disclaimer]
```

**En bref :** garder 3 jobs ; alléger ombre `shadow-[…]` si trop « brochure » — `border border-prestige-beige` suffit.

---

## 5. Soft close / form

- Mid CTA (`CampagneAdsLanding` ~L181) : même langage navy que post-outil, **pas** clone « clarifier ta situation ».
- Visuellement : `rounded-3xl bg-gradient-to-br from-primary to-dark` OK — différencier par **copy chiffrée** (script) + label CTA distinct.
- PDF : `ToolDownloadPdf` en variante outline (bordure primary, fond blanc) — primary réservé RDV.

---

## 6. Avant → Après (composants / classes)

| # | Avant | Après | Fichier |
|---|-------|-------|---------|
| 1 | `PageHero` gradient + `glow-orb` only ; CTA unique blanc RDV | Prop optionnelle `backgroundImage` / `atmosphere="home"` + children dual CTA ; primary scroll `#outil` | `PageHero.jsx`, `CampagneAdsLanding.jsx` |
| 2 | `ModelPortfoliosBanner` sur campagnes | `hidePortfolioBanner \|\|= pathname.startsWith('/campagnes')` | `App.js` |
| 3 | Card résultat label « Total pour la mise de fonds » + beige À retenir avant tout RDV | Headline `lecture.headline` + bandeau `bg-primary` sous KPIs | `CeliappTool.jsx` ~L428–509 |
| 4 | `ToolDownloadPdf` `bg-primary` primary | Variante `variant="outline"` + RDV `Link` `bg-primary` à côté | `CampagneToolShell.jsx`, footer outil |
| 5 | Mid hardcodé générique | Props data `softCloseHeadline` / `softCloseSubline` (shell) | `CampagneAdsLanding.jsx`, `campagneAdsLandings.js` |

---

## 7. Assets à produire

| Asset | Spec |
|-------|------|
| Hero still | 2400×1350 min, foyer/clés QC, tonalité froide navy-compatible ; overlay CSS |
| (Option) Visuel Ad feed | Aligner brief ads : navy + « Simulateur mise de fonds · Gratuit » — déjà `emails/.../visuels/celiapp-feed.jpg` |

---

## 8. Critères acceptation visuelle

- [ ] Sans nav, un ami reconnaît « 1ʳᵉ propriété / CELIAPP », pas un template navy clone
- [ ] Fold = outil-first (primary scroll), pas Bookings-first
- [ ] Strip portefeuilles absent sur cette landing
- [ ] RDV navy visible sans scroller hors de la card résultat (desktop + mobile)
- [ ] Ambre « max » n’apparaît pas au load (defaults réalistes — dépend outil)
