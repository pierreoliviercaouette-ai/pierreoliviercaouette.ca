# [#04] Expert script marketing — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Persona :** Salarié 28–45 ans, collective RH cochée, livret jamais ouvert. Objection #1 : « Ma collective me suffit. »  
**Ton :** québécois parlé, calme, éducatif — zéro peur hôpital, zéro pitch produit  
**Règle V2 :** textes **différenciants** fold + process seulement ; soft close / mid **déjà P0** — ne pas réécrire sauf gap réel.

---

## 1. Verdict copy post-P0

H1, promise, bullets, SoftClose outil, mid `ctaHeadline`/`ctaSubline`, FAQ×5 = **déjà bons**. Gap restant = micro-signaux fold (la page ne **nomme** pas livret/paie/délai dans le hero hors H1) + process strip manquant sous En bref. Soft close mid : **garder**. Soft close outil : **garder** wording ; seul le **placement** change (spec outil).

---

## 2. Hero — ce qu’on garde (P0)

| Élément | Texte | Action V2 |
|---------|-------|-----------|
| Badge | Invalidité | Garder |
| H1 | Si le salaire s’arrête : le trou de ton assurance collective | Garder |
| Promesse | Quatre chiffres — tu vois le trou vs tes dépenses, et ce qu’il faut tenir pendant l’attente. Sans compte. | Garder |
| CTA primary | Voir mon trou | Garder (shell) |
| CTA secondary | Réserver 15 minutes | Garder (shell) |
| Ligne confiance hero | Conseiller en sécurité financière · Victoriaville · Contenu éducatif | Garder (déjà dans landing) |

---

## 3. `heroExtras` (nouveaux — différenciants)

| Slot | Texte figé |
|------|------------|
| Kicker | `Livret · paie · délai` |
| Chip A | `% remplacé` |
| Chip B | `Jours d’attente` |

**Ne pas** mettre de montants defaults (500 $ / 9 600 $) dans le hero — conformité + scepticisme.

---

## 4. Process strip (3 libellés max)

Même composant catalogue ; **seuls** les libellés changent :

| Step | Libellé |
|------|---------|
| 1 | `4 chiffres` |
| 2 | `Trou + coussin` |
| 3 | `Livret en 15 min` |

Variante micro-line (si le shell accepte une string unique) :  
`4 chiffres → trou + coussin → livret en 15 min`

Mapping data suggéré :
```js
processSteps: ['4 chiffres', 'Trou + coussin', 'Livret en 15 min'],
```

---

## 5. Soft close outil — **garder** (placement = outil)

| État | Headline | Subline | CTA |
|------|----------|---------|-----|
| `gapWarn` | `~{trou} /mois à combler · ~{coussin} à tenir.` | `On ouvre ton livret en 15 min — %, délai, définition.` | Clarifier mon trou en 15 min |
| `!gapWarn` | `Les $ tiennent sur papier.` | `Reste la définition et la durée dans ton livret — c’est souvent ça qu’on clarifie en 15 min.` | Clarifier mon trou en 15 min |
| PDF | — | — | Télécharger mon résumé PDF *(ghost)* |

Aucun rewrite P0 sauf si finance signale un gap — **pas le cas**.

---

## 6. Soft close mid — **garder**

| Champ | Texte |
|-------|-------|
| `ctaHeadline` | Ton trou vs dépenses, c’est clair sur papier. |
| `ctaSubline` | 15 min : on valide le %, le délai, et la définition (« ta job » vs « n’importe quelle job »). Sans pression. |
| `ctaLabel` | Réserver 15 minutes |
| Portrait libellé | Conseiller en sécurité financière · Victoriaville *(identique catalogue — pas de variante « ton expert invalidité »)* |
| Apprendre | Lire la capsule invalidité |

---

## 7. Labels snapshot (align typo climax — pas de nouveaux claims)

| Zone | Label |
|------|-------|
| Snapshot A | Trou vs dépenses / mois *(ou Marge vs dépenses / mois)* |
| Snapshot B | Coussin d’attente |
| Barre | `{X} % de tes dépenses couvertes… · {Y} j d’attente` |

---

## 8. FAQ / disclaimer — **garder** P0

FAQ×5 + disclaimers outil/PDF/ads = GO (voir finance). Aucun ajout obligatoire Vague 2.

Option P1 (si shell FAQ id) : ancre `#definition` déjà couverte par Q3 — pas de nouvelle question.

---

## 9. Mots à éviter / préférer (rappel)

| Éviter | Préférer |
|--------|----------|
| Salaire garanti / 100 % remplacé | Ce que ton assurance collective t’offre |
| T’es correct / t’es couvert | Les $ tiennent sur papier ; reste définition + durée |
| Hôpital, catastrophe | Livret, paie, délai, trou, coussin |
| SoftClose / mid rewrite « créatif » | Composant + copy P0 |

---

## 10. Mapping data Vague 2 (`campagneAdsLandings.js`)

```js
// assurance-invalidite — ajouts V2 seulement
atmosphere: 'livret-paie',
heroExtras: {
  kicker: 'Livret · paie · délai',
  chips: ['% remplacé', 'Jours d’attente'],
},
processSteps: ['4 chiffres', 'Trou + coussin', 'Livret en 15 min'],
// P0 inchangé : title, promise, bullets, ctaHeadline, ctaSubline, faq, heroToolLabel…
```

---

## 11. Critères acceptation script

- [ ] Fold reconnaissable en 5 s via kicker/chips (pas seulement H1)  
- [ ] Process 3 steps = libellés ci-dessus, composant catalogue  
- [ ] Aucune réécriture SoftClose / mid sans gap  
- [ ] Portrait mid = libellé CSF catalogue, pas slogan perso  
- [ ] Zéro montant « statistique » dans hero/ads
