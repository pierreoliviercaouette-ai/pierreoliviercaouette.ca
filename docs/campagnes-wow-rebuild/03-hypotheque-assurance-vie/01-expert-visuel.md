# [#03] Expert marketing visuel — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/03-hypotheque-assurance-vie.md` · live · `PageHero` · `CampagneAdsLanding.jsx` · `AssuranceHypothecaireTool.jsx`  
**Note visuelle actuelle /10 :** 5 → **cible refonte :** 8+

---

## 1. Vision composition (1er viewport)

Une seule composition, sujet **maison / foyer / hypothèque**, pas un clone catalogue navy+orbs.

| Élément | Spec |
|---------|------|
| Brand | Nom / CSF déjà en nav — dans le hero, le **badge** « Assurance hypothécaire » + H1 sujet suffisent ; ne pas ajouter de 2e marque. |
| Titre | Garder H1 audit : *Assurance de la banque ou protection pour la famille ?* (hook fort, sujet-spécifique). |
| Promesse | 1 phrase courte (voir script) — job unique visible : **chiffrer l’écart solde → famille**. |
| CTA group | Dual : primaire = scroll outil « Voir mon écart solde → famille » (`#outil`) ; secondaire ghost = « Réserver 15 minutes » (RDV). |
| Atmosphère | Full-bleed photo foyer / clé / façade QC + overlay navy (~55–65 % opacity). **Pas** orbs seuls. Asset candidate : `emails/campagne-meta-catalog/visuels/hypotheque-vie-feed.jpg` (crop hero) ou photo maison/famille dédiée. |

**Brand test :** sans la nav, la page doit encore « sentir » l’hypothèque / la famille — pas une landing générique iA.

**Hero budget :** brand signal (badge) + H1 + 1 promesse + dual CTA + 1 image dominante. Rien d’autre (pas de stats, pas de strip portefeuilles au-dessus si évitable côté layout site).

---

## 2. Palette / typo / motion

### Palette (variables existantes)
- Navy `primary` / `dark` : overlay hero, soft close mid.
- Ambre : coût relatif prêteur + bandeau écart (warn).
- Émeraude : côté personnel / capital famille.
- Blanc / taupe : texte secondaire.
- **Accent sujet :** ambre chaud sur le gap dominant (pas purple, pas glow kitsch).

### Typo
- `font-heading` pour H1, gap climax (`text-3xl`–`text-4xl` sur l’écart), titres de section.
- Corps `text-sm`/`text-base` taupe — densifier le climax, alléger le tableau.

### Motion (2–3 utiles, pas décoratifs)
1. **Hero** : fade-up léger H1 + promesse (stagger 80–120 ms) ; image reste fixe (pas de ken burns agressif).
2. **Gap climax** : barre d’écart (`auDelaDuPret`) anime width 0→% au premier `IntersectionObserver` (une fois).
3. **Soft close inline post-outil** : léger pulse/opacity sur le CTA RDV outline au mount du footer résultat (1×).

---

## 3. Modules manquants (preuve / process / confiance)

Ordre page cible :

1. **Hero** sujet (ci-dessus)
2. **Strip confiance 1 ligne** (sous hero ou top corps) :  
   `Conseiller en sécurité financière · Victoriaville · contenu éducatif, sans pression`  
   — texte seul, pas de pills empilées.
3. **Process 3 steps** (remplace ou allège « En bref » cards) :  
   `1. Estime l’écart` → `2. Compare banque vs perso` → `3. Clarifie en 15 min`  
   — une ligne + numéros, **pas** 3 cards ombrées (réduire card soup).
4. **Outil** (estimateur first — voir expert outil) avec **gap dominant** visuel
5. **Soft close mid** navy (headline chiffrée — script) — garder le bloc `rounded-3xl from-primary to-dark` existant
6. FAQ

**Ne pas ajouter :** photo conseiller flottante overlay hero ; badges promo ; collage d’images.

---

## 4. Hiérarchie visuelle outil (cœur WOW)

### Avant → Après

| Zone | Avant | Après |
|------|-------|-------|
| Cards prêteur / perso | 2 cards égales dès l’entrée | Conserver en **secondaire** (après solde/prime) ; ambre ×2 = mini-aha, pas climax |
| Tableau 5× | Mur ouvert dominant | `<details>` collapsible « Approfondir banque vs perso » — 1 critère visible max sur mobile, reste en expand |
| ResultCards | 2× `text-2xl` égales ; écart en `detail` sm | **Capital famille** héros (`text-3xl`+) ; solde en secondaire ; bandeau pleine largeur ambre : `Écart illustratif : +97 000 $ au-delà du prêt` + barre |
| Footer outil | Compteur « points lus » + PDF primary | Texte chiffré solde vs capital + **RDV outline primary** ; PDF ghost secondary |

### Composants / classes
- Réutiliser `ResultCard` tone `warn` / `ok` ; ajouter wrapper gap :  
  `rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white px-4 py-4`
- Barre : `h-2 rounded-full bg-amber-200` + fill `bg-amber-600` width = `auDelaDuPret / capitalFamille`
- Soft close mid : déjà `CampagneAdsLanding.jsx` ~L181–210 — brancher `ctaHeadline` / `ctaSubline` data (comme MRa form)

---

## 5. Soft close mid & form

- Bloc navy existant = bon contenant ; **microcopy générique = problème**.
- Headline doit ancrer l’écart (montants dynamiques idéalement ; sinon copy fixe « solde → famille »).
- Pas de carte supplémentaire autour du CTA ; garder pills rounded-full site.

---

## 6. Mobile (thumb zones)

| Zone | Spec |
|------|------|
| Hero CTA primaire | Pleine largeur pouce, au-dessus du secondaire RDV |
| Inputs outil | Déjà OK ; garder `py-2.5` |
| Tableau | Ne jamais forcer 5 rangées ouvertes ; expand = thumb target ≥44 px |
| Gap bandeau | Sticky-ish optionnel **non** (évite clutter) — juste scroll naturel vers climax tôt |
| Footer RDV | Bouton outline pleine largeur avant PDF ghost |

---

## 7. Fichiers à toucher (visuel)

| Fichier | Changement |
|---------|------------|
| `frontend/src/components/layout/PageHero.jsx` **ou** props landing | Support optionnel `backgroundImage` / `atmosphere="hypotheque"` (shell #2) |
| `frontend/src/pages/CampagneAdsLanding.jsx` | Dual CTA hero ; strip confiance ; process 3 steps ; mid headline depuis data ; `id="outil"` sur wrapper outil |
| `frontend/src/data/campagneAdsLandings.js` | `promise`, bullets allégés, `ctaHeadline`/`ctaSubline`, évent. `heroImage` |
| `frontend/src/components/campagne/tools/AssuranceHypothecaireTool.jsx` | Gap dominant + barre ; collapsible tableau ; footer layout RDV/PDF |
| Asset | Hero foyer — `public/` ou reuse feed JPG crop |

---

## 8. 3 upgrades WOW (priorité visuelle)

1. **Hero orbs → full-bleed foyer + dual CTA** (identité sujet)
2. **Gap 350 k$ → 447 k$ dominant + barre +97 k$** (climax illisible → impossible à manquer)
3. **Soft close mid chiffré** (navy générique → ancré résultat)

---

## 9. Critères acceptation visuelle

- [ ] Sans nav, on sait que c’est hypothèque / famille
- [ ] L’écart `auDelaDuPret` est le plus gros chiffre émotionnel de la page
- [ ] Sur mobile 390 px, le climax est atteignable sans lire les 5 critères
- [ ] PDF n’est plus le bouton le plus contrasté post-climax
