# Synthèse WOW — Expérience client → RDV (15 campagnes)

**Date :** 2026-11-04  
**Angle :** « Je clique Meta → je scroll → je joue l’outil → est-ce que je booke ? »  
**Fiches détaillées :** `01`–`15` (verdict 1ʳᵉ personne, timeline, visuel, outil, TOP 8).

---

## Le constat client (cross-catalogue)

Les outils sont souvent **bons** (chiffres forts). L’envie de booker est **faible** (~4,5/10) parce que :

1. **Le climax meurt en PDF** — le « damn » existe, le next step = télécharger, pas parler à quelqu’un.
2. **Le hero ressemble à toutes les autres pages** (gradient/orbs) + pousse le RDV avant la valeur.
3. **Peu d’identité visuelle du sujet** — ça ne « sent » pas la maison / la famille / la PME.
4. **Zéro ancrage humain** au moment où je décide (photo CSF, Victoriaville, « on le lit ensemble »).

**Formule WOW→RDV :**  
`Insight chiffré impossible à manquer` → `CTA soft dans les 2 s` → `réassurance humaine` → `PDF en secondaire`.

---

## Scores expérience client

| # | Campagne | Exp. | WOW outil | Env. booker | Ce qui tue le booker |
|---|----------|-----:|----------:|------------:|----------------------|
| 01 | Comparateur | 5,5 | 6,5 | 4,5 | PDF + fuite mid `/outils` |
| 02 | CELIAPP | 5,5 | 5 | 4,5 | Headline non affiché ; PDF ; defaults faux max |
| 03 | Hypothèque | 5 | 6 | 4,5 | Tableau 5× avant le gap famille |
| 04 | Invalidité | 6 | 7 | 5 | Trou fort → PDF only |
| 05 | Retraite | 5,5 | 6 | 5 | Mixte warn dès l’ouverture |
| 06 | Maladie grave | 5,5 | 6,5 | 4,5 | Écart 90 k$ → PDF ; mythe peu visualisé |
| 07 | REEE | 6 | 7 | 4,5 | `laisseSurTable` dilué ; PDF |
| 08 | Fonds urgence | 6 | **7,5** | 4,5 | Meilleur WOW outil ; pire bridge RDV |
| 09 | CELI droits | 5,5 | 7 | 4,5 | ~84 k$ OK ; usage promis **absent** |
| 10 | Trop jeune | 5,5 | 6 | **4** | Defaults spoilent l’aha (455 k$) |
| 11 | Collective | 5,5 | 5,5 | 4,5 | Cases floues non monétisées |
| 12 | Autonome | 6 | 5,5 | 5 | Insight au-dessus des cases |
| 13 | Plan global | 5,5 | 6,5 | 4,5 | « Commence ici » → PDF |
| 14 | Succession | 5,5 | 6 | 4,5 | Trous → PDF / notaire, pas CSF |
| 15 | MRa PME | 5,5 | **4,5** | 5 | Climax mou ; PDF ; form lourd |

**Moyennes :** expérience ~5,6 · WOW outil ~6,2 · **envie de booker ~4,6** ← le vrai trou.

---

## Ce que le client veut voir (visuel)

Pour **toutes** les landings (1 sprint design) :

| Upgrade | Effet prospect |
|---------|----------------|
| Hero **outil-first** + atmosphère du sujet (pas orbs seuls) | « Je suis au bon endroit » |
| Ligne confiance : photo + CSF + Victoriaville | « C’est une vraie personne » |
| Soft close mid **chiffré** (cite mon résultat) | « Ils ont vu mon cas » |
| Sticky / CTA **immédiat** après le climax outil | « Book pendant que ça chicotte » |

Priorité polish bas : **CELIAPP, Hypothèque, MRa, Maladie grave** (atmosphère + hiérarchie).

---

## Ce qui crée le WOW dans l’outil (par campagne)

| # | Climax déjà là (ou à créer) | Upgrade WOW #1 |
|---|----------------------------|----------------|
| 01 | Écart ~14 k$ (live) | Soft close sous l’écart + preset mythe 50 k$/20 ans |
| 02 | Projection mise de fonds | Afficher `lecture.headline` + gap vs cible + soft RDV |
| 03 | +97 k$ au-delà du prêt | Estimateur **avant** tableau ; gap dominant |
| 04 | Trou 500 $/mois + coussin | RDV au duo Trou\|Coussin |
| 05 | Suggestion REER/CELI | Tone mixte→nuance ; RDV par `suggestion.key` |
| 06 | Écart ~90 k$ | CTA sous bandeau écart + Invalidité≠MG visible |
| 07 | `laisseSurTable` | Soft close sur **ce** $ (pas le total confortable) |
| 08 | 16 k$ / 4,5 ans / rythme | Soft close 3 états « En clair » |
| 09 | ~84 k$ de place | **Livrer** sélecteur Urgence/Projet/LT |
| 10 | Score + capital | Defaults **neutres** (pas 455 k$ au load) |
| 11 | Cases floues | Soft close « on lit ton livret » |
| 12 | Filet Mince / nextItem | Checklist puis insight ; RDV sur trou |
| 13 | Commence ici n°1 | Soft close sous le n°1 |
| 14 | Trous checklist | RDV CSF vs notaire selon le trou |
| 15 | Fit PME | Score + contrib ; CTA `#demande` (pas PDF) |

---

## Priorité d’implémentation « je booke demain »

### Sprint 1 — Bridge climax → RDV (toutes + shell)
1. Slot post-résultat dans `CampagneToolShell` (RDV primaire, PDF ghost)  
2. Hero dual CTA outil-first  
3. `ctaHeadline` / `ctaSubline` par slug  
4. Fix fuite #01 `/outils/comparateur-rendements`

### Sprint 2 — WOW outil (plus gros écart booker)
5. #10 defaults neutres · #09 sélecteur usage · #02 headline+cible · #08/#07/#04/#06 soft close chiffré  
6. #03 estimateur-first · #15 fit+form · #05 tone mixte

### Sprint 3 — Visuel premium
7. Atmosphères hero par thème · bande confiance · process 3 steps (surtout MRa / Hypo / CELIAPP)

---

## Critère de succès unique

Un ami à qui tu montres ton téléphone après l’outil doit pouvoir dire en 5 secondes :  
**« Ah ouais, book — y’a un trou / un écart / des subventions sur la table. »**  
Si le seul bouton visible = PDF → échec.
