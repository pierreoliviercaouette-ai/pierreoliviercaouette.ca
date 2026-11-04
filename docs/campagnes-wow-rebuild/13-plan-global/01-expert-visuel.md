# [#13] Plan global — Expert marketing visuel

**Slug :** `/campagnes/plan-global`  
**Date :** 2026-11-04  
**Live :** https://www.pierreoliviercaouette.ca/campagnes/plan-global  
**Sources :** `CampagneAdsLanding.jsx` · `PageHero.jsx` · `PlanGlobalTool.jsx` · `campagneAdsLandings.js` (`plan-global`)  
**Note visuelle actuelle /10 :** 6

---

## Verdict visuel (1 paragraphe)

La page lit comme une **landing catalogue navy** : badge « Vision globale », H1 fort (match Ad1), un seul CTA blanc « Réserver 15 minutes », 3 cards En bref features, puis outil checklist. Rien dans le hero ne matérialise le brief ads « Ordre d’attaque » (chemin 1→2→3, chaos→ordre, tiroir de produits). Le climax « Commence ici » est typographiquement correct (`text-xl/2xl`) mais **orphelin** — pas de bandeau soft, pas de paliers Urgent/Important/Plus tard, PDF dominant en footer. Motion utile ≈ 1 (barre %). Objectif WOW : que l’ami qui regarde l’écran dise « il a un n°1 — il booke pour l’ancrer », pas « checklist + PDF ».

---

## 1. Hero — composition 1 viewport

### Cible (budget hero)
Brand signal (nav OK) · **1** H1 (garder Ad1) · **1** promesse · **1** groupe CTA (primaire outil + secondaire RDV) · atmosphère sujet — **pas** de stats, cards, ni RDV-only.

| Élément | Avant (live) | Après (spec) |
|---------|--------------|--------------|
| Badge | `Vision globale` | Garder **ou** `Vision globale · Ordre d’attaque` |
| H1 | Arrêter d’empiler des produits sans plan | **Garder** (recognition Meta Ad1) |
| Promesse | Des produits côte à côte ≠ une feuille de route… | Tiroir ≠ feuille de route + mention **urgent → important → plus tard** (voir script) |
| CTA primaire | Lien blanc → RDV | Bouton / ancre **« Voir mon ordre d’attaque »** → `#outil` |
| CTA secondaire | *(absent)* | Lien texte blanc/80 **« Ou réserver 15 min »** → `buildCampagneRdvPath` + `…_rdv` |
| Confiance fold | Absente | Ligne sous CTAs : `Conseiller en sécurité financière · Victoriaville · 15 min exploratoire` (`text-white/70 text-sm`) |
| Atmosphère | Gradient navy + grille + orbs (template) | Même shell **+** motif discret **chemin 1 → 2 → 3** (pas collage produit) |

### Motif « feuille de route » (identité sujet)
- Option A (préf.) : 3 pastilles numérotées semi-transparentes en bas du hero (desktop), alignées centre : `1 Urgent` · `2 Important` · `3 Plus tard` — opacity ~0.35, `pointer-events-none`.
- Option B : SVG stroke léger « chemin » derrière le H1 (stroke white/15).
- **Interdit :** cards flottantes, badges promo, catalogue de produits, collage REER/CELI/assurance.

### Fichiers
- Data : `frontend/src/data/campagneAdsLandings.js` (`plan-global` — promise, ctaLabel, évent. `ctaSecondaryLabel`)
- Shell (dette catalogue, max 2) : `CampagneAdsLanding.jsx` ~L62–88 — dual CTA + `id="outil"` sur le wrapper outil (~L117) ; ligne confiance optionnelle via props data
- `PageHero.jsx` : children déjà en flex — OK sans changer le composant si dual CTA passé en children

---

## 2. Palette / typo / motion

### Palette (existant — ne pas inventer purple/cream)
| Token | Usage plan-global |
|-------|-------------------|
| `primary` / `dark` / `gradient-hero` | Hero + bandeau mid |
| `secondary` | Accents pastilles, labels « Commence ici », badges paliers Urgent |
| `prestige-beige` / `prestige-taupe` | Fonds listes, hints |
| Gradient `from-primary/[0.04] to-secondary/[0.05]` | Bloc n°1 (garder, renforcer bordure) |

### Typo
- H1 / n°1 : `font-heading` bold — le **n°1** doit rester le plus gros signal post-outil (`sm:text-2xl` mini ; option `text-3xl` desktop si espace).
- Labels paliers : `text-xs uppercase tracking-wide` — Urgent (secondary), Important (primary/70), Plus tard (taupe).

### Motion (2–3 utiles — budget)
1. **Apparition « Commence ici »** — `animate-in fade-in slide-in-from-bottom-2 duration-300` (ou Tailwind + `key={first.id}`) à la 1ʳᵉ coche / changement de n°1.
2. **Pastille « Ordre prêt »** — fade dès `doneCount >= 1` à côté du compteur (remplace le % trompeur).
3. **Barre / compteur** — garder `duration-500` sur la largeur, mais largeur = signal « cases cochées », pas score de réussite (copy : voir outil).

Pas de glow excessif, pas de confetti, pas de bounce permanent.

---

## 3. Modules manquants (preuve, process, confiance)

| Module | Où | Spec visuelle |
|--------|-----|---------------|
| Process En bref outcomes | Cards 1–3 sous hero | Remplacer feature soup (coche/ordre/PDF) par **soulagement** numéroté 1→2→3 (copy = script). Garder pastilles numérotées existantes — déjà un début de « chemin ». |
| Soft-close strip sous n°1 | Dans `PlanGlobalTool` après bloc L260–268 | Bandeau plein largeur outil : fond `primary` léger ou `bg-primary text-white` compact ; titre cite `{order}` ; CTA filled RDV ; micro « soft, zéro pitch ». **Pas** de card flottante type sticker. |
| Paliers U / I / P | Sous n°1, avant notes | 3 sections empilées (pas `<ol>` plate) : headers badge + items. n°1 peut rester hors bucket ou répété en Urgent avec style hero. |
| Confiance mid | Sous soft outil **ou** dans bandeau mid | Photo conseiller optionnelle P1 ; au minimum CSF · Victoriaville · exploratoire (déjà au hero si fait). |
| PDF secondaire | Footer outil | Outline / ghost ; RDV filled à gauche (dual). |

---

## 4. Mobile (thumb zones)

| Zone | Problème live | Après |
|------|---------------|-------|
| Hero CTA | RDV seul — frein Ad2/Ad3 | Primaire `#outil` pouce-friendly (`py-3` full width sm) ; secondaire texte sous |
| 7 SoftCheck + hints | Scroll long avant climax | Hints en `<details>` / « Pourquoi ça compte » collapse par défaut mobile (`md:block`) |
| Climax → next | Notes + PDF avant désir RDV | Soft-close **immédiat** sous n°1 (thumb) ; notes + PDF **après** |
| Mid navy | Générique | Copy qui rejoue n°1 (si shell data-driven) — même hauteur tactile |

---

## 5. Corps de page — hiérarchie 1 job / section

1. **Hero** — recognition + entrée outil  
2. **En bref** — outcomes anti-tout-à-la-fois (pas features)  
3. **Outil** — coche → ordre (climax + soft RDV)  
4. **Mid CTA** — ancrer le n°1  
5. **FAQ** — objections outil-seul / pas plan perso  

Densité : retirer la sensation « j’ai fini = fichier » en descendant PDF sous le soft-close.

---

## 6. Soft close / form — digne d’un RDV payé

Le mid hardcodé « Prêt à clarifier ta situation ? » (`CampagneAdsLanding.jsx` ~L182–187) est **catalogue**. Visuellement : garder le bandeau navy (cohérent brand) mais :
- Headline data (`ctaHeadline`) qui mentionne le n°1 **ou** formulation « Tu as un n°1… »
- Subline soft ads (« soft, zéro pitch »)
- Bouton label « Ancrer mon n°1 — 15 min »

Le soft **dans** l’outil (sous Commence ici) est prioritaire visuellement — c’est le pic émotionnel.

---

## 7. Trois upgrades visuels WOW (Avant → Après)

1. **Hero CTA** — Avant : seul « Réserver 15 minutes » blanc → Après : primaire « Voir mon ordre d’attaque » `#outil` + secondaire RDV + ligne CSF/Victoriaville ; option pastilles 1-2-3.
2. **Résultat** — Avant : n°1 + `<ol>` plate → Après : n°1 dominant + badges **Urgent / Important / Plus tard** + motion d’apparition.
3. **Sous Commence ici** — Avant : vide → notes/PDF → Après : bandeau soft « Ton n°1 : {order}… » + CTA RDV filled (PDF outline plus bas).

---

## Critères acceptation visuelle

- [ ] 1ʳᵉ viewport sans CTA RDV unique (outil-first)
- [ ] Identité « ordre d’attaque / chemin » lisible sans lire le body
- [ ] CTA RDV visible ≤ 2 s après apparition du n°1 (même viewport mobile si possible)
- [ ] Ami comprend en 5 s : « il a un rang #1, pas juste un PDF »
