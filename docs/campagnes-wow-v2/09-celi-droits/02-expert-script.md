# [#09] CELI droits — Expert script marketing

**Slug :** `/campagnes/celi-droits`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Rôle :** Expert script marketing  
**Ton :** québécois parlé, éducatif — zéro pitch « maxe demain »  
**Interdit V2 :** réécrire SoftClose / mid `ctaHeadline` sauf gap réel (P0 déjà OK).

---

## Rescore post-P0 (copy)

| Surface | Post-P0 | Gap V2 |
|---------|---------|--------|
| H1 / promise | Place restante — OK | Aucun (garder) |
| Mid / SoftClose outil | Citent `$` + usage — OK | Ne pas retoucher |
| Fold micro-signaux | Absents | **Livrer** `heroExtras` + process |

**Top 1 gap copy :** le fold promet l’outil, mais **aucun micro-texte sujet** sous la promesse — le catalogue V2 demande `heroExtras` + process pour différencier sans casser le shell.

---

## 1. Fold — inchangé (référence)

| Champ | Texte (déjà en data) |
|-------|----------------------|
| `badge` | `CELI` |
| `title` | Des droits CELI qui dorment — t’as vraiment regardé ce qu’il te reste ? |
| `promise` | Estime ta place restante en 2 minutes. Ensuite, colle un usage (urgence, projet, long terme) — ou pas. |
| `heroToolLabel` | Estimer ma place |
| `ctaLabel` | Réserver 15 minutes |
| `ctaHeadline` | Ta place restante, c’est un chiffre. L’usage, c’est le plan. |
| `ctaSubline` | Clarifier ≠ cotiser demain. 15 minutes soft — CSF · Victoriaville. |

**Verdict :** fold **pas** générique → **pas** de retouche H1/promise en V2.

---

## 2. `heroExtras` — micro-copy

| Clé | Texte |
|-----|-------|
| `left.label` | Plafond année |
| `left.value` | 7 000 $ |
| `right.label` | Place restante |
| `right.value` | ? |
| `kicker` (optionnel) | Le plafond de l’année, c’est juste une tranche. |
| `trust` (si slot shell) | Sans compte · estimation |

**Note :** valeurs décoratives / non-live — le vrai chiffre vit dans l’outil. Ne pas écrire « 84 000 $ » au fold (spoil + faux claim perso).

---

## 3. Process steps (3 max)

| # | `label` | `hint` |
|---|---------|--------|
| 1 | Estime ta place | Naissance + déjà cotisé (pas le solde) |
| 2 | Colle un usage | Urgence, projet ou long terme — intention, pas engagement |
| 3 | Clarifie en 15 min | Soft. Clarifier ≠ cotiser demain |

**Data shape (catalogue) :**
```js
processSteps: [
  { label: 'Estime ta place', hint: 'Naissance + déjà cotisé (pas le solde)' },
  { label: 'Colle un usage', hint: 'Urgence, projet ou long terme — intention, pas engagement' },
  { label: 'Clarifie en 15 min', hint: 'Soft. Clarifier ≠ cotiser demain' },
]
```

---

## 4. Portrait / mid — libellé catalogue

| Surface | Texte |
|---------|-------|
| Sous portrait | `CSF · Victoriaville` |
| Mid headline / subline | **Garder** `ctaHeadline` / `ctaSubline` P0 |

Pas de nouvelle accroche mid.

---

## 5. Soft close outil — ne pas réécrire

Référence P0 (déjà branché) — conserver :

- Avec usage : `~{X} $ estimés · usage {…}.` / `Coller un usage — 15 min`
- Sans usage : `T’as ~{X} $ de place estimée.` / `Trancher l’usage — 15 min`
- Dépassement : `Chiffre à vérifier…` / `Vérifier avec quelqu’un — 15 min`

**V2 script :** aucun changement sauf si finance signale un claim dangereux (non).

---

## 6. Labels usage (rappel — déjà ship)

| id | Chip | Soft |
|----|------|------|
| `urgence` | Fonds d’urgence | fonds d’urgence |
| `projet` | Projet court terme | projet court terme |
| `long_terme` | Long terme / retraite | long terme / retraite |

---

## 7. Phrases interdites (toujours)

- Coût d’opportunité non chiffré (« ça coûte cher »)
- « Solde ARC = X $ » / « montant officiel »
- « Maxe maintenant » / rendement inventé
- Confondre solde du compte et droits de cotisation
- Afficher 84 k$ au fold comme chiffre du prospect

---

## 8. Critères acceptation SCRIPT V2

- [ ] `heroExtras` + `processSteps` collés en data, ton québécois
- [ ] H1 / promise / SoftClose / mid **non** regressés
- [ ] Process step 2 nomme les 3 usages (aligné chips P0)
- [ ] Kicker optionnel = mythe plafond, pas coût
