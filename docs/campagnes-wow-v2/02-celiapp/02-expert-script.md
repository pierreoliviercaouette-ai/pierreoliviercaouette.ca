# [#02] CELIAPP — Script marketing Vague 2

**Rôle :** Expert script marketing  
**Slug :** `/campagnes/celiapp`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, zéro pression

---

## Rescore post-P0 (script / message)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Alignement ads → fold | 4/10 | **7/10** (outil-first + promise OK) | 8/10 (+ heroExtras sujet) |
| Tension personnelle | 3/10 | 4/10 (chiffre clair, pas de cible) | **8/10** (écart vs ma mise) |
| Env. booker (copy) | 4/10 | **7/10** (SoftClose chiffré) | 8/10 (gap → pont déjà là) |

**Top 1 gap WOW restant (script) :** le fold nomme le CELIAPP, mais sans micro-signaux « 1ʳᵉ propriété / ≠ CELI » sous les yeux ; le climax ne parle pas encore *à ma* cible de mise.

---

## Interdits (ne pas réécrire)

- Soft close outil / mid `ctaHeadline` / `ctaSubline` / labels RDV-PDF — **déjà livrés**, gap réel = non
- Dual CTA hero labels — déjà bons (`Projeter ma mise de fonds` / `Clarifier mon CELIAPP (15 min)`)
- FAQ / En bref bullets — garder sauf si conflit conformité (finance)

---

## 1. Hero — ajustement minimal

| Champ | Statut post-P0 | Vague 2 |
|-------|----------------|---------|
| `badge` | CELIAPP | Inchangé |
| `title` | Ta mise de fonds, en clair avec le CELIAPP | **Inchangé** (déjà sujet) |
| `promise` | Projette ce que ton rythme donne… | **Inchangé** |
| `heroToolLabel` / `ctaLabel` | OK | Inchangé |

Fold déjà assez spécifique — **pas** de rewrite H1. Différenciation = `heroExtras` + atmosphere (visuel).

---

## 2. `heroExtras` — micro-copy à coller

```js
heroExtras: {
  kicker: '1ʳᵉ propriété · plafonds illustratifs 2026',
  chips: ['CELIAPP ≠ CELI', 'Cotisations seulement'],
}
```

| Extra | Texte final |
|-------|-------------|
| Kicker | 1ʳᵉ propriété · plafonds illustratifs 2026 |
| Chip 1 | CELIAPP ≠ CELI |
| Chip 2 | Cotisations seulement |

Max 2 chips + 1 kicker. Pas de chip « Gratuit » / « Sans compte » (déjà dans l’ad).

---

## 3. Process strip — 3 libellés

Même composant catalogue ; seuls les labels changent :

| Step | Label |
|------|-------|
| 1 | Projeter ton rythme |
| 2 | Lire le chiffre (et l’écart) |
| 3 | 15 min si ça chicotte |

**Option data :**

```js
processSteps: [
  'Projeter ton rythme',
  'Lire le chiffre (et l’écart)',
  '15 min si ça chicotte',
]
```

---

## 4. Champ cible + gap 3 cols (copy UI)

| Élément | Texte |
|---------|-------|
| Label field (step 2) | Mise de fonds que tu vises (optionnel) |
| Hint | Ex. : 20 000 $, 35 000 $ — ce que *toi* tu as en tête. Cotisations seulement en face. |
| Placeholder | 25000 |
| Colonne 1 label | Projection |
| Colonne 2 label | Cible |
| Colonne 3 label | Écart |
| Si écart > 0 | `~{ecart} $ à combler` (sous le montant) **ou** montant seul + detail |
| Si écart = 0 | Dans la cible (cotisations) |
| Si écart < 0 | Au-dessus de ta cible (cotisations seulement) |
| Note sous grille | L’écart, c’est cotisations vs ton souhait — pas une promesse d’achat. |

**Soft close quand cible remplie** — *seulement* si on touche le template existant (écart réel post-P0) :

> Projection ~{totalProjete} $ · cible {cible} $ · écart ~{ecart} $. En 15 min, on démêle les leviers (rythme, horizon, autres comptes) — sans promesse magique.

Sinon garder les templates SoftClose déjà en code (plafond / place restante).

---

## 5. Portrait — libellé (contrat catalogue)

**Exact, cross-campagnes :**  
`Conseiller en sécurité financière · Victoriaville`

Pas de variante « Pierre-Olivier » dans le libellé mid (le portrait parle). Pas « planificateur ».

---

## 6. Ce qu’on ne change pas (référence)

| Zone | Texte post-P0 (garder) |
|------|------------------------|
| Mid headline | T’as une projection. On valide le prochain vrai pas ? |
| Mid subline | Admissibilité, rythme, CELI vs CELIAPP — 15 min, zéro pression. |
| Mid CTA | Clarifier mon CELIAPP (15 min) |
| toolIntro | Entre ton rythme et ton horizon — tu vois la projection. Le PDF, c’est en bonus. |
| SoftClose RDV / PDF labels | Clarifier mon CELIAPP (15 min) / Télécharger ma projection PDF |

---

## 7. Ads Meta — Vague 2

Aucun rewrite obligatoire. Les ads sont déjà outil-first.  
Si un créatif Vague 2 : aligner un frame sur « Projection · Cible · Écart » **sans** promettre « tu auras ta mise ».

---

## 8. Critères acceptation script

- [ ] heroExtras collés, ton québécois, ≤ 2 chips
- [ ] Process 3 labels collés, pas de 4ᵉ step
- [ ] Copy gap jamais « tu auras ta maison » / « admissible »
- [ ] SoftClose / mid non réécrits sauf branche écart
- [ ] Libellé portrait = contrat catalogue exact
