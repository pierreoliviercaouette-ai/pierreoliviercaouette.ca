# [#11] Expert marketing visuel — Assurance collective (employé)

**Slug :** `/campagnes/assurance-collective`  
**Persona :** Employé·e 28–50 ans (Québec) — carte / portail RH, livret PDF rarement ouvert. **≠ PME, ≠ MRa `#15`.**  
**Objectif visuel :** WOW → RDV (Bookings 15 min)  
**Date :** 2026-11-04  
**Sources :** live + audit `docs/plan-modification-marketing/11-assurance-collective.md` + `CampagneAdsLanding.jsx` / `PageHero` / `CollectiveChecklistTool.jsx`

---

## 1. Diagnostic (ce que le client voit)

- Hero navy + orbs + grille = **template campagne** (14 autres landings). Ça ne « sent » pas le **livret RH / carte employé / portail**.
- H1 descriptif catalogue ; **un seul CTA blanc** « Réserver 15 minutes » — trahit Ad3 (*checklist avant le RDV*).
- Outil : ResultCards « À trouver » correctes, mais climax émotionnel (`missingCount`) en **texte taupe** sous la progress — sous-joué.
- Mid CTA navy card-soup générique (« Prêt à clarifier… ») — zéro lien visuel avec les cases floues.
- Motion : vague hero + fade ; barre progress OK. Manque 2e présence (ambre sur warn Invalidité).

**Note visuelle actuelle /10 :** 6

---

## 2. Vision hero (1 viewport)

**Composition (une job) :** brand nav + badge + **titre mythe** + 1 promesse + **dual CTA** + atmosphère livret.

| Élément | Spec |
|---------|------|
| Badge | `Assurance collective` (pill existante OK) |
| Titre | *Ton assurance collective te couvre… vraiment ?* (voir `02-expert-script.md`) |
| Promesse | 1 phrase : livret → cases → PDF ; 15 min seulement si flou |
| CTA primaire | Bouton blanc plein → scroll `#outil` — label *Remplir la checklist* |
| CTA secondaire | Lien / bouton ghost blanc bordure — *Ou 15 min avec le livret* → RDV |
| Atmosphère | Texture document : paper grain léger **ou** silhouette livret/PDF + carte (pas orbs seuls). Accent ambre discret = « cases à vérifier » |
| Confiance 1 ligne | Sous CTAs : *Conseiller en sécurité financière · Victoriaville · éducatif* |

**Brand test :** sans la nav, la page doit encore crier *employé + livret RH*, pas « landing générique CSF ».

**Interdit hero :** stats, cards En bref, preview PDF, badges flottants, photo inset en card.

---

## 3. Palette / typo / motion

### Palette (variables existantes + accent)

| Token | Usage |
|-------|--------|
| `--primary` / navy PageHero | Fond hero (garder brand) |
| Ambre `amber-500/600` | Climax flous, ResultCard `tone=warn`, pulse Invalidité |
| Emerald existant | Cards `ok` |
| Beige / taupe | Secondaire — **pas** le climax |
| Blanc | CTA primaire hero + surfaces outil |

### Typo
- Garder `font-heading` pour H1 + chiffre « X encore flous ».
- Chiffre climax outil : **plus gros que** `doneCount / 5` (hiérarchie : flous > % vanity).

### Motion (2–3 utiles — pas de bruit)

1. **Hero :** fade-in titre + promesse (existant) ; CTA primaire apparaît 150 ms après.
2. **Progress / climax :** barre `transition-all duration-500` (OK) + quand `missingCount` change → **scale légère** du chiffre ambre (200 ms).
3. **ResultCard Invalidité warn :** pulse ambre bordure 1× au premier passage `partial` / `À trouver` (attention `prefers-reduced-motion`).

---

## 4. Modules manquants (preuve / process / confiance)

### A. Bandeau process livret (entre outil et mid CTA)

3 lignes horizontales (mobile : stack), **pas** de cards lourdes :

1. **Livret ou PDF résumé** — tu apportes le document  
2. **Cases floues** — on les repère ensemble  
3. **15 min si trou** — clarifier (éducatif), pas pitcher PME/MRa  

Ancre visuelle : icônes FileText / AlertTriangle / Calendar (lucide déjà dans l’outil).

### B. Climax flous dans l’outil (visuel)

- Zone Progression : si `missingCount > 0`, afficher en hero interne :
  - Gros : **`{n} encore flou(s)`** (`text-3xl` ambre / dark)
  - Petit : `doneCount / total` + % en taupe secondaire
- ResultCard Invalidité : border ambre plus affirmée (`border-amber-300`, icon plus visible) quand warn.

### C. Dual CTA shell

Fichiers :
- `CampagneAdsLanding.jsx` ~L62–88 — supporter `heroPrimaryCta: 'tool' | 'rdv'` + labels data
- `campagneAdsLandings.js` entrée `assurance-collective` — flags + `ctaHeadline` / `ctaSubline` pour mid

### D. Identité sujet (anti-clone)

Sans redesign global de `PageHero` : overlay CSS local sur cette landing via class optionnelle data (`heroTheme: 'livret'`) **ou** bandeau 40 px sous hero : *« Idéal avec ton PDF RH ouvert »* + lien ancre FAQ `#faq-livret`.

---

## 5. Mobile (thumb zones)

| Zone | Spec |
|------|------|
| Hero CTA primaire | Full-width, pouce bas — scroll outil (pas RDV) |
| CTA secondaire | Sous le primaire, hit ≥ 44 px |
| Outil | Gate livret sticky sous intro (pas checkbox en bas) |
| Footer outil | Stack : phrase flous → **bouton RDV** → PDF secondaire (outline) |
| Mid CTA | Même stack ; éviter 2 boutons côte à côte trop serrés |

Scroll fatigue : 5 blocs OK si step 1 = Invalidité (énergie Ad2) ; employeur optionnel en fin.

---

## 6. Avant → Après (composants / classes)

### 1. Hero mythe + dual CTA
- **Avant :** H1 descriptif + unique `Link` RDV blanc (`CampagneAdsLanding.jsx` L79–87).
- **Après :** H1 mythe ; primaire `button` `scrollIntoView('#outil')` + secondaire `Link` RDV ghost ; classes : primaire = blanc actuel ; secondaire = `border border-white/40 bg-transparent text-white`.

### 2. Climax flous ambre
- **Avant :** `{missingCount} à clarifier · {progress} %` en `text-sm text-prestige-taupe` (`CollectiveChecklistTool.jsx` ~L331–335).
- **Après :** bloc gauche = chiffre ambre `font-heading text-3xl` *« 2 encore flous »* ; droite = progress secondaire. ResultCard warn : `from-amber-50` + `ring-1 ring-amber-200/80`.

### 3. Bandeau process + mid data-driven
- **Avant :** saut outil → mid hardcodé « Prêt à clarifier… » (L181–187).
- **Après :** process 3 steps (section légère) ; mid lit `item.ctaHeadline` / `item.ctaSubline` (comme mode form).

---

## 7. Critères d’acceptation visuelle

- [ ] Premier viewport = mythe Ad1 + outil-first (pas RDV seul)
- [ ] Atmosphère livret / employé lisible sans la nav
- [ ] `missingCount` impossible à manquer (taille + ambre)
- [ ] ≥ 2 motions utiles (progress + pulse/scale flous)
- [ ] Mobile : CTA outil sous le pouce ; RDV après climax outil
- [ ] Zéro sémantique visuelle PME / équipe / MRa

---

## 8. Effort

| Upgrade | Effort | Dépendance |
|---------|--------|------------|
| Copy hero + data mid | S | Script |
| Dual CTA shell | M | Shell partagé (impact autres campagnes si générique) |
| Climax flous UI | S | Outil only |
| Process bandeau | S | Landing data ou JSX local |
| Theme livret hero | M | Optionnel P1 — texture / class theme |
