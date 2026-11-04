# [#07] REEE — Expert script marketing

**Slug :** `/campagnes/reee`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Persona :** Parent 28–45, Victoriaville / Centre-du-Québec — REEE « quelque part », cotisations au feeling  
**Ton :** québécois parlé, calme, zéro culpabilité, éducatif

---

## Rescore post-P0 (copy)

| Zone | Après P0 | Gap V2 |
|------|----------|--------|
| H1 / promise / bullets | Shipés (mythe compte ouvert) | Fold OK — **ne pas réécrire** |
| Soft close / mid | Shipés (`laisseSurTable` + ctaHeadline) | **Ne pas réécrire** |
| Process / heroExtras | Absents | **Livrer textes** |
| Champ SCEE déjà reçues | Absent | Labels + hints + headline seed |

---

## 1. H1 / promise — verdict

**Garder P0 tel quel** (fold déjà différenciant) :

| Champ | Texte (inchangé) |
|-------|------------------|
| title | `REEE ouvert ≠ subventions maximisées` |
| promise | `Âge + rythme → tu vois la SCEE, le reste avant ~7 200 $, et ce que tu laisses sur la table. PDF à garder ; 15 min si tu veux caler le cadre.` |

Pas de gap générique post-P0 → zéro rewrite hero.

---

## 2. `heroExtras` (prêt à coller)

```js
heroExtras: {
  kicker: 'Subventions · Outil · Sans compte',
  chips: [
    'Compte ouvert ≠ maximisé',
    'SCEE · max ~7 200 $',
  ],
},
```

---

## 3. Process 3 steps (prêt à coller)

```js
processSteps: [
  { label: 'Âge', detail: 'Où en est ton enfant' },
  { label: 'Rythme', detail: 'Combien tu mets (ou pourrais mettre)' },
  { label: 'Encore possibles', detail: 'Ce qui reste avant le max · 15 min pour le caler' },
],
processEyebrow: 'Trois gestes. Zéro jargon.',
```

---

## 4. Champ `sceeDejaRecues` — microcopy

| Élément | Copy |
|---------|------|
| Label | `SCEE déjà reçues (approx.)` |
| Hint | `Pas le solde du compte : le cumul de SCEE déjà versée. 0 si tu sais pas.` |
| Placeholder | `0` |
| Suffix | `$` |
| Range helper | `0 à ~7 200 $` |

### Headline / bandeau si seed > 0
`Avec ce que t’as déjà, il resterait encore ~{X} $`

*(Remplace / enrichit le headline regret quand `sceeDejaRecues > 0`.)*

### Soft-close — **ne pas réécrire**
Garder P0. Seule substitution autorisée : si seed > 0, le `{X}` reflète déjà le room seedé (mécanique outil).

---

## 5. Intro outil (optionnel — alignement persona)

**Garder** intro shell actuelle si OK. Alt V2 légère seulement si on expose le champ :

`Entre l’âge, ton rythme, et ce que t’as déjà reçu — subventions illustratives et ce qui resterait sur la table.`

---

## 6. Mid / SoftClose / FAQ

**Ne pas retoucher** — P0 livré et aligné Ad2.  
Portrait mid : libellé catalogue `Pierre-Olivier · CSF · Victoriaville` (pas de prose custom).

---

## 7. Ads — micro seulement

Pas de rewrite catalogue. Si créa cite un chiffre fixe « 1 200 $ » → préférer « ce qui resterait sur la table » (outil).  
Interdits inchangés : pas « dû », pas « études 100 % ».
