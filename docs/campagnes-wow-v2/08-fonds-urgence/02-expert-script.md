# [#08] Fonds d’urgence — Script différenciant (Vague 2)

**Rôle :** Expert script marketing  
**Slug :** `/campagnes/fonds-urgence`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, calme, éducatif  
**Interdits V2 :** ne pas réécrire SoftClose / mid sauf gap réel · pas de claims « filet complet / sécurité garantie »

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | 8,5 |
| WOW outil | 7,5 | 8 | 8 |
| Env. booker | 4,5 | 6,5 | 7,5 |

**Top 1 gap WOW restant :** fold + process **génériques** — H1/promise déjà bons ; manque micro-copy sujet (chips + 3 steps) pour que l’ami lise « filet » avant l’outil.

**Verdict copy P0 :** SoftClose 3 tons + mid `ctaHeadline` / `ctaSubline` + FAQ carte = **garder tels quels**. Pas de réécriture.

---

## Spec Avant → Après (textes à coller)

| Zone | Avant | Après (Vague 2) | Fichiers |
|------|-------|-----------------|----------|
| H1 / promise | Déjà OK post-P0 | **Inchangés** | — |
| SoftClose / mid | Déjà OK | **Inchangés** | — |
| `heroExtras` | Absent | Chips + kicker ci-dessous | `campagneAdsLandings.js` |
| `processSteps` | Absent | 3 steps ci-dessous | `campagneAdsLandings.js` |
| Intro outil | Fallback générique shell | `toolIntro` sujet (optionnel) | data |
| FAQ | Carte déjà live | Garder ; `id` ancre chip « Carte ≠ filet » si utile | data |

---

## 1. `heroExtras` — micro-copy fold

| Slot | Texte final |
|------|-------------|
| Kicker | Calculateur gratuit · Sans compte |
| Chip 1 | Cible × mois |
| Chip 2 | Écart + délai |
| Chip 3 | Carte ≠ filet |
| Aria / title chip 3 (opt.) | La carte n’est pas un fonds d’urgence |

**Ne pas** mettre sous le fold : « 6 mois = tu es protégé », « sérénité », montants defaults.

---

## 2. Process steps (3 max)

Même composant shell — libellés #08 seulement :

| # | Titre court | Sous-ligne (1 phrase max) |
|---|-------------|---------------------------|
| 1 | Cible | Dépenses essentielles × mois à couvrir |
| 2 | Écart | Ce qui manque, et en combien de mois |
| 3 | Palier | Où garer · rythme · surplus éventuel |

**Variant ultra-court** (si le shell n’affiche que le titre) : `Cible` · `Écart` · `Palier`

---

## 3. Ajustements H1 / promise

| Élément | Texte | Action V2 |
|---------|-------|-----------|
| Badge | Fonds d’urgence | Garder |
| Titre | Le filet avant d’accélérer l’investissement | Garder (match Ad1) |
| Promesse | En 2 minutes : ta cible, ce qui manque, et en combien de mois — avant d’accélérer CELI ou REER. | Garder |
| CTA primaire | Calculer mon filet | Garder |
| CTA secondaire | (hero RDV label existant) | Garder |

Fold **n’est plus générique** une fois chips + atmosphere ; pas besoin de toucher H1.

---

## 4. Soft close / mid — gap check post-P0

| Slot | Texte actuel | Verdict |
|------|--------------|---------|
| SoftClose warn court | Ton écart : {manquant}. + durée + où garer | **OK — ne pas réécrire** |
| SoftClose warn >24 m | Pas besoin de tout remplir… premier palier | **OK** |
| SoftClose ok | Filet OK… prochain dollar dettes/CELI/REER selon ta situation | **OK** |
| `ctaHeadline` | Ton écart est clair — et après ? | **OK** |
| `ctaSubline` | Où garer le coussin, quel rythme, quoi faire du surplus… | **OK** |

**Seul ajout portrait mid (libellé shell, pas copy marketing) :**  
`Pierre-Olivier · CSF · Victoriaville` — texte catalogue uniforme.

---

## 5. `toolIntro` (optionnel P0-v2)

Si le fallback shell reste trop générique (« résumé clair ») :

> Remplis l’outil — tu vois ta cible, ton écart, ton délai. Ensuite, 15 min si tu veux fixer le palier.

---

## 6. Ligne process ↔ Ad2 (optionnel P1)

Entre En bref et Process **ou** en sous-ligne chip 3 — **1 phrase max**, pas une card :

> La carte, c’est un prêt. Le filet, c’est de l’argent à toi.

FAQ complète déjà en place — ne pas dupliquer un paragraphe.

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| S-08.1 | Coller `heroExtras` + kicker | S | P0-v2 |
| S-08.2 | Coller `processSteps` ×3 | S | P0-v2 |
| S-08.3 | `toolIntro` sujet | S | P0-v2 |
| S-08.4 | Ancre FAQ carte depuis chip (opt.) | S | P1 |
| S-08.5 | Micro-ligne « carte ≠ filet » hors FAQ | S | P2 |

---

## Mots interdits (rappel)

- Sérénité garantie / sécurité absolue / filet complet  
- 6 mois = protégé  
- On te trouve le meilleur compte  
- Conseil personnalisé sans analyse  

---

## Critères script « ami en 5 s »

- [ ] Chips + process disent filet / écart / palier sans scroller l’outil  
- [ ] SoftClose et mid **inchangés** (déjà chiffrés)  
- [ ] Aucun claim sécurité / produit  
- [ ] Ton québécois, pas corporate  
