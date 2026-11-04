# [#07] REEE — Expert script marketing

**Slug :** `/campagnes/reee`  
**Date :** 2026-11-04  
**Persona :** Parent 28–45, Victoriaville / Centre-du-Québec — REEE « quelque part », cotisations au feeling  
**Objection #1 :** *« Le compte est ouvert → c’est déjà fait. »*  
**Ton :** québécois parlé, calme, zéro culpabilité, éducatif  
**CTA final :** RDV Bookings (WOW → booker)

---

## 1. Hero (prêt à coller)

| Champ | Texte final |
|-------|-------------|
| **badge** | `REEE` |
| **title** | `REEE ouvert ≠ subventions maximisées` |
| **promise** | `Âge + rythme → tu vois la SCEE, le reste avant ~7 200 $, et ce que tu laisses sur la table. PDF à garder ; 15 min si tu veux caler le cadre.` |
| **confidenceLine** *(nouveau)* | `Conseiller en sécurité financière — Victoriaville. Contenu éducatif, pas un pitch.` |
| **ctaPrimary** (scroll `#outil`) | `Voir ce que je laisse sur la table` |
| **ctaSecondary** (RDV) | `Ou réserver 15 min` |
| **seoTitle** | `REEE et subventions (SCEE) \| Outil gratuit \| Victoriaville` |
| **seoDescription** | `Compte ouvert ≠ maximisé. Entre l’âge et ton rythme : SCEE illustrative, reste avant le max à vie, PDF. Ensuite 15 min si tu veux. Pas un conseil personnalisé.` |

---

## 2. En bref (3 bullets)

1. `Compte ouvert ≠ subventions maximisées — le rythme compte autant que le compte.`
2. `SCEE illustratif : ~20 ¢ par dollar sur les premiers ~2 500 $ / an (souvent ~500 $ / an), plafond à vie ~7 200 $.`
3. `Tu repars avec un PDF clair — base pour 15 minutes si tu veux caler âge, budget, déjà en place.`

---

## 3. Process 3 steps (labels)

1. **Âge** — `Où en est ton enfant`  
2. **Rythme** — `Combien tu mets (ou pourrais mettre)`  
3. **Encore possibles** — `Ce qui reste avant le max · 15 min pour le caler`

Sous-ligne section : `Trois gestes. Zéro jargon.`

---

## 4. Intro outil (shell au-dessus du JSX)

**Eyebrow :** `À toi de jouer`  
**Intro :** `Entre l’âge et ce que tu mets — on te montre les subventions illustratives et ce qui resterait sur la table.`

*(Remplace « résumé clair et un PDF à garder » comme seul horizon.)*

---

## 5. Soft close post-outil (dans ReeeTool — climax)

### Si `laisseSurTable > 0`
**Titre / status :**  
`Il resterait encore ~{X} $ avant le max à vie (SCEE illustratif).`

**Corps :**  
`En 15 minutes, on regarde ce qui est déjà en place pis un rythme qui tient avec ton budget — calme, concret, zéro pression.`

**CTA primary :** `Relier ça à mon budget — 15 min`  
**CTA PDF (secondary) :** `Télécharger mon résumé PDF`

### Si plafond atteint
**Status :** `Tu touches le max de subventions dans ce scénario. 15 min pour valider le cadre (autres enfants, déjà en place) — zéro pression.`  
**CTA :** `Valider mon cadre — 15 min` + PDF secondary

### Si incomplete
Garder aide à remplir — pas de push RDV agressif.

---

## 6. Callout `sousMaxAnnuel` (preset < 2 500 $)

**Titre :** `Tu laisses une partie de la SCEE annuelle sur la table`

**Corps (template) :**  
`Avec {cotisation} $/an → ~{sceeParAn} $ de SCEE. Vers ~2 500 $/an, tu maximises souvent (~500 $/an). Écart ≈ {500 − sceeParAn} $/an · sur {N} ans ≈ {écart × N} $ (illustration).`

**Hint preset :** mettre en avant le chip `2 500 $ · max SCEE`

---

## 7. Mid CTA (data — remplacer hardcode)

| Champ | Texte |
|-------|-------|
| **ctaHeadline** | `Tu laisses encore des subventions sur la table ?` |
| **ctaSubline** | `15 min pour caler âge, budget, déjà en place. Calme. Concret. Zéro pression.` |
| **ctaLabel** | `Réserver 15 minutes` |
| **apprendreLabel** | `Lire la capsule REEE` *(garder secondary)* |

---

## 8. FAQ (max 5) — prêt à coller

```js
faq: [
  {
    question: 'J’ai déjà un REEE à la banque — pourquoi un outil / un RDV ?',
    answer:
      'Ouvrir le compte, c’est une étape. Maximiser les aides publiques (SCEE, et au Québec parfois l’IQEE), ça dépend souvent du rythme et de ce qui est déjà reçu. L’outil te donne une photo nette illustrative. En 15 minutes, on relie ça à ton vrai compte — sans te vendre quelque chose sous pression.',
  },
  {
    question: 'Est-ce trop tard si mon enfant a déjà 10 ans ?',
    answer:
      'Pas forcément. Il reste souvent des années avant les études : tu peux encore cotiser et recevoir des subventions selon les règles en vigueur. L’outil te montre un ordre de grandeur ; on affine ton cas en rencontre.',
  },
  {
    question: 'C’est quoi la différence entre REEE et SCEE ?',
    answer:
      'Le REEE, c’est le compte. La SCEE, c’est la subvention fédérale (~20 % sur ce que tu mets, jusqu’à ~500 $ / an, plafond à vie illustratif ~7 200 $). Au Québec, d’autres aides (ex. IQEE) peuvent s’ajouter — à revalider.',
  },
  {
    question: 'Je mets plutôt 100–200 $ / mois — ça marche ?',
    answer:
      'Oui. L’outil peut raisonner en annuel (ex. 200 $/mois ≈ 2 400 $/an). L’idée, c’est de voir si tu t’approches du rythme qui maximise souvent la SCEE de base — pas de te culpabiliser.',
  },
  {
    question: 'Les chiffres de l’outil sont-ils un conseil ?',
    answer:
      'Non. C’est une illustration éducative (SCEE fédérale de base). Les programmes et montants évoluent ; une recommandation adaptée se fait après analyse de ta situation.',
  },
],
```

---

## 9. Ads Meta — ajustements (alignement outil-first)

Garder Ad1–Ad3 de `emails/campagne-meta-catalog/reee.md`. Micro-tweaks :

### Ad1 — Compte ouvert ≠ maximisé
- **Titre :** `Compte ouvert ≠ subventions max` *(plus proche du hero)*  
- Conserver CTA « En savoir plus » → landing outil-first  
- Aucun montant inventé hors outil disclaimeré

### Ad2 — Laisse sur la table
- Garder promesse outil âge + cotisation → subventions / max  
- Soft close : *« Si les chiffres te chicottent — surtout ce qui resterait sur la table — 15 min. »*
- **Titre :** `Combien tu laisses sur la table ?`

### Ad3 — Essaie l’outil
- Aligné dual CTA hero : outil d’abord, RDV si tu veux  
- **Titre :** inchangé `Essaie l’outil. RDV si tu veux.`

### Interdits ads (rappel)
- Pas « études payées à 100 % »
- Pas présenter `laisseSurTable` comme argent « dû » ou garanti
- Pas de rendement promis ; 4 % = hors ads ou disclaimer fort

**Disclaimer ads (footer inchangé) :**  
`Contenu éducatif. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. Subventions / plafonds à revalider.`

---

## 10. Microcopy UI outil (labels)

| Élément | Copy |
|---------|------|
| Shell title | `Combien pour les études ?` *(OK)* ou `Ce que tu laisses sur la table` *(alt P1)* |
| Shell intro | `REEE = compte. SCEE = ~20 ¢ / $. Entre l’âge et ton rythme — subventions, total, et ce qui reste avant ~7 200 $.` |
| Champ SCEE déjà reçues | `SCEE déjà reçues (approx.)` · hint `Sur ton relevé / dossier — 0 si tu sais pas.` |
| Toggle | `Par mois` / `Par année` · helper `200 $/mois = 2 400 $/an` |
| Headline si seed SCEE | `Avec ce que t’as déjà, il resterait encore ~{X} $` |
| Disclaimer tool | `Illustration seulement — pas un conseil. Chiffre principal = SCEE fédérale de base (~20 %, max ~500 $/an, plafond vie ~7 200 $). IQEE et autres aides : hors total ou ligne séparée, à revalider.` |

---

## 11. Phrase soft-close idéale (référence émotionnelle)

> Il te resterait encore ~1 200 $ de subventions possibles dans ce scénario. En 15 minutes, on regarde ce qui est déjà en place pis un rythme qui tient avec ton budget — calme, concret, zéro pression.

*(Defaults audit : 5 ans / 2 500 $ / 12 ans → laisseSurTable = 1 200 $ — bon ancrage Ad2.)*
