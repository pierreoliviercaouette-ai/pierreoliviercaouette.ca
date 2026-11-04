# [#03] Expert script marketing — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, tutoiement, éducatif, sans pression  
**CTA final :** RDV Bookings — 15 min  
**Périmètre V2 :** textes **différenciants** fold + process seulement — SoftClose / mid / dual CTA **déjà livrés** (ne pas réécrire sauf gap réel)

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Clarté sujet au fold | 6 | ~7.5 (H1 + promise OK) | ≥ 8.5 |
| Ancrage émotionnel chiffré | 4 | ~7 (mid + SoftClose) | ≥ 8 |
| Cohérence ads ↔ page | 5 | ~8 | ≥ 8.5 |

**Top 1 gap copy restant :** le fold n’a **aucun micro-signal** « solde → famille » hors H1 — les chips / kicker / process manquent. Soft close mid déjà bon (`On regarde ton écart solde → famille`) — **ne pas toucher**.

---

## 1. Hero — garder vs ajuster

| Slot | Statut post-P0 | Texte Vague 2 |
|------|----------------|---------------|
| Badge | OK | Assurance hypothécaire |
| H1 | OK — ne pas changer | Assurance de la banque ou protection pour la famille ? |
| Promesse | OK | D’abord, estime ce qu’il faudrait vraiment aux proches — au-delà du solde. Ensuite, compare banque vs perso. |
| CTA primaire | OK (interdit re-spec) | Voir mon écart solde → famille |
| CTA secondaire | OK | Réserver 15 minutes |
| Ligne confiance | OK | Conseiller en sécurité financière · Victoriaville · Contenu éducatif |

**Verdict :** H1/promise **assez sujets** — pas de réécriture. Ajouter seulement `heroExtras`.

---

## 2. `heroExtras` — micro-copy (coller data)

```js
heroExtras: {
  kicker: 'Solde du prêt ≠ besoin des proches',
  chips: [
    { label: 'Solde ≈ prêteur', tone: 'amber' },
    { label: 'Capital → famille', tone: 'emerald' },
  ],
},
```

| Slot | Texte final | Notes |
|------|-------------|-------|
| Kicker | Solde du prêt ≠ besoin des proches | 1 idée ; écho ads Option 1 / Option 2 |
| Chip ambre | Solde ≈ prêteur | Aligné tint atmosphere gauche |
| Chip émeraude | Capital → famille | Aligné tint droite + climax outil |

**Ne pas** mettre de montants dans les chips (le wow chiffre reste dans l’outil).  
**Ne pas** dire « il te manque 97 k$ » au fold (prescriptif — finance).

---

## 3. Process strip — 3 steps (libellés seuls divergent)

Même composant catalogue ; seuls titre + sub changent.

| # | Titre | Sub |
|---|-------|-----|
| 1 | Estime l’écart | Solde du prêt vs un montant pensé pour les proches. |
| 2 | Compare les deux logiques | Prêteur ≠ protection personnelle — qui est protégé, coût, flexibilité. |
| 3 | Clarifie en 15 min | On lit ta situation ensemble, sans pression. |

```js
processSteps: [
  {
    title: 'Estime l’écart',
    body: 'Solde du prêt vs un montant pensé pour les proches.',
  },
  {
    title: 'Compare les deux logiques',
    body: 'Prêteur ≠ protection personnelle — qui est protégé, coût, flexibilité.',
  },
  {
    title: 'Clarifie en 15 min',
    body: 'On lit ta situation ensemble, sans pression.',
  },
],
```

**Bullets « En bref »** (si conservés en data pour SEO / accessibilité) — inchangés post-P0 :

1. Banque / prêteur : couverture souvent liée au solde qui diminue ; le coût « par dollar » peut grimper — et la prime peut être revue aux renouvellements*
2. Personnel : bénéficiaires choisis, capital que tu contrôles, souvent portable après l’hypothèque
3. Estimateur : solde + dettes + revenu de transition + imprévus → montant illustratif pour la famille

UI V2 : préférer process strip visible ; bullets peuvent rester en source ou être dépréciés visuellement (décision PM / shell).

---

## 4. Soft close / mid — **ne pas réécrire**

| Slot | Texte actuel (garder) |
|------|------------------------|
| Mid headline | On regarde ton écart solde → famille |
| Mid subline | 15 minutes, éducatif — tu gardes ton PDF. Sans pression. |
| Mid CTA | Réserver 15 minutes |
| Mid secondaire | Lire la capsule assurance vie temporaire |
| ToolSoftClose headline | Ton illustration : {solde} vs {capitalFamille} |
| ToolSoftClose subline | On clarifie banque vs perso en 15 min. |
| ToolSoftClose RDV | Clarifier banque vs famille (15 min) |
| PDF | Télécharger mon résumé PDF |

**Gap réel post-P0 ?** Non — copy déjà ancrée sujet. Seul ajout **visuel** : portrait + libellé CSF (pas nouveau texte marketing).

Portrait libellé catalogue (identique partout) :  
`Conseiller en sécurité financière · Victoriaville`

---

## 5. Microcopy climax outil (ajustement typo seulement)

| Slot | Texte (inchangé sens) |
|------|------------------------|
| Bandeau gap | Écart illustratif : +{auDelaDuPret} au-delà du prêt |
| Micro sous bandeau | C’est souvent ça qu’on clarifie en 15 minutes — sans pression. |


Formulation finance : toujours **« écart illustratif »** — jamais « il te manque ».

---

## 6. Intro outil landing (optionnel polish)

Si `toolIntro` data ajouté pour #03 (sinon défaut landing) :

> Remplis l’outil — tu vois ton écart solde → famille, puis tu peux réserver 15 minutes si tu veux y voir clair.

---

## 7. FAQ / Ads — hors scope réécriture V2

FAQ×5 + renouvellement* + Ad3 adoucie = **déjà P0**. Ne pas rouvrir sauf dissonance nouvelle.  
Asterisk catalogue : `* Selon le contrat et le prêteur. Conditions variables.`

---

## 8. Spec Avant → Après (copy)

| Zone | Avant | Après Vague 2 | Fichier |
|------|-------|---------------|---------|
| heroExtras | absent | kicker + 2 chips | `campagneAdsLandings.js` |
| processSteps | absent (cards En bref) | 3 steps ci-dessus | data + shell |
| H1 / promise / mid / SoftClose | post-P0 OK | **aucun changement** | — |
| toolIntro | défaut générique léger | optionnel sujet « écart solde → famille » | data |

---

## 9. Backlog script

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| S-1 | Data `heroExtras` #03 | S | P0-v2 |
| S-2 | Data `processSteps` #03 | S | P0-v2 |
| S-3 | `toolIntro` optionnel sujet | S | P1 |
| S-4 | (interdit) réécrire SoftClose / mid / dual CTA | — | — |

---

## 10. Critères acceptation script

- [ ] En 5 s, kicker + chips + H1 racontent banque vs famille
- [ ] Process 3 steps collent au parcours estimateur → compare → RDV
- [ ] Aucun claim « manque 97 k$ » / « annule la banque » au fold
- [ ] Mid + ToolSoftClose textes **identiques** post-P0 (régression copy = fail)
