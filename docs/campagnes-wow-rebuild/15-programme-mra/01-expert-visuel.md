# [#15] Programme MRa PME — Spec VISUEL (refonte WOW → Lead)

**Rôle :** Expert marketing visuel  
**Slug :** `/campagnes/programme-mra`  
**CTA :** formulaire Lead (`#demande`) — **pas** Bookings  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/15-programme-mra.md` · live · `CampagneAdsLanding.jsx` · `MraFitTool.jsx` · `PageHero`

> **≠ #11** : pas de sémantique livret RH / employé / carte collective. Ici = **décideur PME**, atelier / petite équipe, contraste « usine RH vs formule simple ».

---

## 1. Vision visuelle (1 paragraphe)

Le premier viewport doit sentir le **propriétaire d’une PME de ~8–20** qui refuse de devenir gestionnaire d’assurances : brand CSF + eyebrow « Pour propriétaires & décideurs PME », H1 court, une promesse, CTA blanc « Recevoir une présentation » → `#demande`, fond full-bleed *équipe / atelier vs simple* (pas orbs catalogue génériques). Après l’outil, le climax = **chiffre XL (~n employés) + badge fit** — le form Lead en dessous doit paraître la suite naturelle, pas un clone Bookings.

---

## 2. Hero — composition 1 viewport

| Élément | Spec Avant → Après |
|---------|-------------------|
| Brand | Garder nav / signature CSF. Brand doit survivre au test « sans badge, ça pourrait être n’importe quelle campagne » → **non**. |
| Eyebrow / badge | Avant : `Programme MRa` seul · Après : badge + ligne `Pour propriétaires & décideurs PME` (pas « employés ») |
| H1 | Voir `02-expert-script.md` — max 2 lignes mobile |
| Promesse | 1 phrase ; pas de stats / process dans le hero |
| CTA | 1 seul : scroll `#demande` (déjà `ctaType: 'form'`) — label script. Micro sous CTA optionnelle : `Je te rappelle — sans Bookings` |
| Atmosphère | Remplacer orbs/grille génériques par ancre **PME** : photo ou illustration full-bleed (équipe atelier / bureau petite boîte) + overlay navy léger. Si asset photo manquant en P0 : gradient navy + texture « plancher atelier / grille légère industrielle » + accent or secondaire — **pas** purple, **pas** cream terracotta |
| Interdit hero | Cards, stats, strip comparatif, badges flottants, dual CTA Bookings |

**Fichiers :** `campagneAdsLandings.js` (`title`, `promise`, `badge`) · `CampagneAdsLanding.jsx` / `PageHero` (slot atmosphère si extension shell) · asset éventuel `frontend/public/…`.

---

## 3. Palette / typo / motion

### Palette (variables existantes catalogue)
- Navy `primary` / `dark` — fond hero + accents
- Blanc / `prestige-beige` — corps
- `secondary` — eyebrow, badge fit « Bon fit »
- Ambre doux (warning existant) — badge « À explorer » seulement
- Taupe — secondary text ; **jamais** pour le climax

### Typo
- `font-heading` pour H1, score fit, process steps
- Corps : stack site existante (pas Inter/Roboto ajoutés)

### Motion (2–3 utiles — pas décoratifs)
1. **Hero** : fade-up léger titre + CTA (déjà shell) — garder
2. **Climax outil** : à l’apparition / changement de fit — scale-in court du **chiffre ~n** + fade badge (200–300 ms)
3. **CTA post-climax** : pulse/ombre une fois sur le bouton primaire Lead (une seule fois après premier score) pour guider le pouce mobile

Pas de glow purple, pas de confetti, pas de parallax lourd.

---

## 4. Modules manquants (corps)

Ordre après En bref → outil → **nouveaux modules** → `#demande` :

### A. Strip comparatif « Collective vs MRa » (5 critères)
- Emplacement : sous En bref **ou** collé sous Lecture rapide dans l’outil (préférence : **dans/juste sous l’outil** pour rester 1 job/section)
- Visuel : tableau 2 colonnes ou 5 paires icône — **pas** card soup 6 cartes
- Critères : volontaire / choix protections / contrib optionnelle / sélection médicale / portabilité*
- Style : fond `from-primary/[0.04]`, filets fins, labels courts

### B. Process 3 pastilles B2B (avant `#demande`)
1. Présentation (rappel)  
2. ~2 rencontres entreprise  
3. 30–45 min / personne  
+ 1 ligne confiance : `Infos médicales ≠ côté employeur · CSF · Victoriaville`

### C. Zone confiance près du form
- Photo conseiller (si asset dispo) **ou** ligne titre CSF + Victoriaville
- Pas de mid-CTA navy Bookings (pattern #11 / autres campagnes)

### D. Fuite #11 à couper visuellement
- Remplacer lien « Lire la capsule assurance collective » sous le form
- Secondaire discret : `Employé avec un livret ?` → `/campagnes/assurance-collective` (lien texte, pas bouton hero)

---

## 5. Climax outil (priorité visuelle)

| Avant | Après |
|-------|-------|
| Bloc « Lecture rapide » `text-sm` gris | Hero-number : `~{n}` XL (`text-4xl md:text-5xl font-heading`) + badge pilule **Bon fit / À explorer / Moins prioritaire** + 1 phrase sous le chiffre |
| Footer PDF primary plein | Bouton primaire plein = Lead `#demande` ; PDF = outline / ghost (`ToolDownloadPdf` variant ou classes `border border-primary bg-white text-primary`) |
| Piliers 3/3 `pressed` | Piliers opt-in (vide) — checkmarks deviennent discovery Ad2 |

---

## 6. Soft close / form (digne d’un Lead payé)

- Titre section data déjà OK (`ctaHeadline`) — aligner H3 interne form (aujourd’hui « Laisse tes coordonnées » générique)
- Carte form : garder `rounded-3xl` existant (c’est le **conteneur d’interaction** — exception cards OK)
- Champs : Entreprise * + taille équipe visible ; Message moins haut (`rows={2}`)
- Microcopy confiance sous submit : process 1→2→3 en une ligne (voir script)
- Sticky mobile (P1 shell) : barre basse post-scroll outil → `#demande`, label « Demander une présentation »

---

## 7. Mobile thumb zones

| Zone | Spec |
|------|------|
| Hero CTA | pouce bas-centre, déjà OK |
| Chips contrib / situation | wrap 2 lignes max ; pas de overflow horizontal |
| Climax | chiffre + badge + CTA Lead dans le même viewport après interaction |
| Piliers | après climax ; OK scroll mais CTA Lead déjà visible **avant** les 3 grosses cartes |
| Form | Message compact ; Entreprise au-dessus du fold form ; sticky P1 |

---

## 8. Avant → Après (composants / classes)

1. **Hero atmosphère** — Avant : `PageHero` orbs génériques · Après : full-bleed PME + eyebrow décideur · `PageHero` / data `badge`+`title`
2. **Lecture rapide** — Avant : `text-sm` · Après : `text-4xl` + badge `rounded-full bg-secondary/15 text-secondary` · `MraFitTool.jsx` ~L192–195
3. **Footer outil** — Avant : `ToolDownloadPdf` primary seul · Après : flex `Demander une présentation` primary + PDF outline · ~L146–152
4. **Process 3 steps** — Avant : absent · Après : strip 3 pastilles avant form · `CampagneAdsLanding.jsx` bloc form **ou** data + composant léger
5. **Apprendre** — Avant : capsule collective · Après : FAQ ancre / lien employé #11 discret · data `apprendrePath` / `apprendreLabel`

---

## 9. Note visuelle cible

| | Aujourd’hui | Cible |
|--|-------------|-------|
| Note /10 | 6 | **8+** |
| Identité vs catalogue | Clone | PME décideur |
| Confusion #11 | Lien Apprendre collective | Séparé clairement |

---

## 10. Critères acceptation VISUEL

- [ ] Hero survivrait au brand-test (sujet PME visible sans lire le badge seul)
- [ ] Climax outil impossible à manquer (chiffre + badge) sur mobile 375 px
- [ ] CTA Lead visible ≤2 s après climax (bouton in-tool)
- [ ] Aucun CTA Bookings sur la page
- [ ] Aucune sémantique « livret / carte employé » dominante
