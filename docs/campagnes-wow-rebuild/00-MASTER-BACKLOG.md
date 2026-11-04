# Master backlog — Refonte WOW (15 équipes)

**Date :** 2026-11-04  
**Statut :** 15/15 packs livrés · **Vague 0 + Vague 1 P0 ✅ en code** (pas encore commit)  
**But :** rendu propre / pro / WOW → booker (Lead pour MRa)

Chaque campagne : lire `docs/campagnes-wow-rebuild/{NN-slug}/00-PM-brief-final.md` pour le détail.

---

## Consensus des 15 PM

1. **Les outils ont souvent le WOW** (chiffre, trou, écart, subventions).
2. **Le booker casse** parce que le climax pousse le **PDF**, le hero pousse le **RDV trop tôt**, et la page est un **clone** gradient.
3. **Ship order :** shell partagé d’abord → soft close in-outil → specs uniques campagne → polish visuel.

---

## Vague 0 — Shell (1× pour les 15) — ✅ en code

| ID | Action | Statut |
|----|--------|--------|
| S1 | Hero dual CTA outil-first + RDV/form soft | ✅ `CampagneAdsLanding.jsx` |
| S2 | Mid CTA `ctaHeadline` / `ctaSubline` (défauts + data) | ✅ |
| S3 | `ToolSoftClose` + PDF `variant="ghost"` | ✅ `CampagneToolShell.jsx` |
| S4 | Ligne confiance CSF · Victoriaville sous hero | ✅ |
| S5 | Fuite #01 : mid scroll `#outil` si `secondaryIsTool` | ✅ |

---

## Vague 1 — P0 par campagne (spécifique)

| # | Campagne | P0 « WOW → booker » (une ligne) |
|---|----------|--------------------------------|
| 01 | Comparateur | ✅ Soft close sous l’écart $ + chip mythe 50 k$/20 ans + coupe fuite |
| 02 | CELIAPP | ✅ Afficher `lecture.headline` + RDV navy post-chiffre + defaults réalistes |
| 03 | Hypothèque | ✅ Estimateur + gap +97 k$ **avant** tableau + RDV post-gap |
| 04 | Invalidité | ✅ Duo trou\|coussin + chips 30/90/120 + RDV footer chiffré |
| 05 | Retraite | ✅ Tone mixte→nuance + climax $ + RDV in-tool |
| 06 | Maladie grave | ✅ CTA sous écart ~90 k$ + Invalidité≠MG visible |
| 07 | REEE | ✅ Soft close sur `laisseSurTable` + callout SCEE sous-max |
| 08 | Fonds urgence | ✅ Soft close 3 états « En clair » + mid écart/délai |
| 09 | CELI droits | ✅ **Chips** Urgence/Projet/LT + soft close `$`+usage |
| 10 | Trop jeune | ✅ Defaults futur `non` + split Aujourd’hui/Projets + RDV au score |
| 11 | Collective | ✅ Invalidité step 1 + soft close cases floues (≠ MRa) |
| 12 | Autonome | ✅ Checklist→insight + RDV « Clarifier : {case} » |
| 13 | Plan global | ✅ Soft close sous « Commence ici » n°1 |
| 14 | Succession | ✅ Soft close trous + H1 Ad1 « Plus tard… » + CSF vs notaire |
| 15 | MRa PME | ✅ CTA `#demande` post-outil + qualify entreprise + score fit |

---

## Vague 2 — Visuel premium (après bridge RDV)

Priorité atmosphère hero (sujet, pas orbs seuls) :

1. CELIAPP / Hypothèque / MRa / Maladie grave  
2. Puis le reste du catalogue  

+ process 3 steps (surtout MRa) + photo CSF.

---

## Ordre d’exécution recommandé

```
Semaine 1:  Vague 0 (S1–S5) + 01 fuite + 08/04/07 soft close (meilleurs WOW outil)
Semaine 2:  09 chips usage · 10 defaults · 02 headline · 03 estimateur-first · 15 form
Semaine 3:  05/06/11/12/13/14 P0 restants + Vague 2 visuel
```

---

## Definition of Done (catalogue)

- [ ] Après le climax outil, CTA RDV/form visible **sans scroll mid**
- [ ] PDF n’est plus le bouton primaire
- [ ] Hero = outil d’abord (sauf test A/B documenté)
- [ ] Aucune fuite mid hors funnel Meta (`/outils/...`)
- [ ] Finance : claims validés dans chaque `04-expert-finance.md`
- [ ] Envie de booker (audit) : cible **≥ 7/10** sur 3 campagnes pilotes (08, 04, 01)

---

## Index des packs

| # | Dossier |
|---|---------|
| 01 | [01-comparateur-rendements](./01-comparateur-rendements/) |
| 02 | [02-celiapp](./02-celiapp/) |
| 03 | [03-hypotheque-assurance-vie](./03-hypotheque-assurance-vie/) |
| 04 | [04-assurance-invalidite](./04-assurance-invalidite/) |
| 05 | [05-retraite-reer-celi](./05-retraite-reer-celi/) |
| 06 | [06-maladie-grave](./06-maladie-grave/) |
| 07 | [07-reee](./07-reee/) |
| 08 | [08-fonds-urgence](./08-fonds-urgence/) |
| 09 | [09-celi-droits](./09-celi-droits/) |
| 10 | [10-trop-jeune-assurance](./10-trop-jeune-assurance/) |
| 11 | [11-assurance-collective](./11-assurance-collective/) |
| 12 | [12-travailleur-autonome](./12-travailleur-autonome/) |
| 13 | [13-plan-global](./13-plan-global/) |
| 14 | [14-succession-bases](./14-succession-bases/) |
| 15 | [15-programme-mra](./15-programme-mra/) |
