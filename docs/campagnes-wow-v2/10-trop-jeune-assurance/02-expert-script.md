# [#10] Trop jeune — Spec SCRIPT (Vague 2)

**Slug :** `/campagnes/trop-jeune-assurance`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé · mythe-killer · éducatif · clarifier ≠ acheter  
**Interdits :** réécrire SoftClose / mid `ctaHeadline`/`ctaSubline` (déjà P0 OK) · claims prime

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 7,5 | 8,5 |
| WOW outil | 6 | 7 | 9 |
| Env. booker | 4 | 7,5 | 8 |

**Top 1 gap copy restant :** fold encore sans micro-signaux « score / sans compte » ni process narratif — H1/promise déjà bons.

---

## 0. Intent émotionnel V2

Prospect 22–35 : « j’attends, je suis en santé ». P0 lui fait **posséder** le score (toggle). V2 lui fait **voir** le contraste Aujourd’hui vs Projets en gros — puis process 3 beats avant l’outil pour qu’il sache *quoi* cocher. Soft close / mid : **ne pas toucher** (déjà score-aware).

---

## 1. H1 / promise — verdict

| Champ | Post-P0 | Action V2 |
|-------|---------|-----------|
| `title` | `« Je suis trop jeune pour m’assurer » — vraiment ?` | **Garder** — fold pas générique |
| `promise` | Obligations + projets connus · score sans compte | **Garder** |
| `badge` | `Assurance vie` | Garder (chip mythe va dans `heroExtras`) |

Pas de rewrite H1/promise.

---

## 2. `heroExtras` — textes à coller

```js
heroExtras: {
  kicker: 'Mythe · 22–35',
  chips: [
    'Score gratuit · sans compte',
    'Présent + projets connus',
  ],
}
```

Variante courte mobile (si truncation) :
- Chip 1 : `Sans compte`
- Chip 2 : `Présent + projets`

---

## 3. Process steps (3 max) — coller dans `processSteps`

| # | Titre | Sous-ligne (optionnelle, 1 courte) |
|---|-------|-------------------------------------|
| 1 | `Coche ton aujourd’hui` | `Maison, proches, dettes — ce qui existe.` |
| 2 | `Ajoute tes projets connus` | `Hypothèque ou famille prévues — même pas encore là.` |
| 3 | `Lis Aujourd’hui vs Projets` | `Le split montre où ça pèse vraiment.` |

Labels **seuls** divergent ; composant process = shell catalogue.

---

## 4. Labels dual capital XXL (outil — microcopy)

| Emplacement | Texte |
|-------------|-------|
| Colonne gauche label | `Aujourd’hui` |
| Colonne droite label | `Projets connus` |
| Hint si projets > aujourd’hui | `C’est souvent ici que le mythe tombe.` |
| Total sous dual | `Total illustratif` |
| Label ResultCard (si gardé) | `Montant à viser (illustration)` — inchangé |

Ne pas dire « tu as besoin de X $ d’assurance ».

---

## 5. Soft close / mid — gap check

| Surface | Post-P0 | V2 |
|---------|---------|-----|
| SoftClose outil | Score + capital · clarifier ≠ acheter | **OK — ne pas réécrire** |
| Mid `ctaHeadline` | `Ton score te chicotte ?` | **OK** |
| Mid `ctaSubline` | Présent + projets · Clarifier ≠ acheter | **OK** |
| Portrait libellé | — | `Conseiller en sécurité financière · Victoriaville` (shell standard, pas de prénom obligatoire si catalogue uniformise sans) |

Si le shell mid affiche le portrait + nom :  
`Pierre-Olivier · CSF · Victoriaville` — aligné catalogue.

---

## 6. FAQ / ads

- FAQ P0 (attendre + collective) : **garder**.
- Ads catalog : pas de rewrite Vague 2 sauf sync 1 ligne Ad2 si dual XXL ship :  
  > Tu vois souvent : aujourd’hui léger · projets connus qui pèsent.  
  (déjà prévu rebuild — OK)

---

## Spec Avant → Après

| Zone | Avant (post-P0) | Après (Vague 2) | Fichiers |
|------|-----------------|-----------------|----------|
| Fold | Promise seule | + kicker + 2 chips | `campagneAdsLandings.js` |
| Process | Absent | 3 steps copy ci-dessus | data `processSteps` |
| Dual labels | Detail string muted | Labels colonnes + hint | `TropJeuneTool.jsx` |
| SoftClose / mid | Score-aware | Inchangé | — |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| S-1 | `heroExtras` kicker + chips | S | P0-v2 |
| S-2 | `processSteps` ×3 | S | P0-v2 |
| S-3 | Labels dual + hint mythe | S | P1 |
| S-4 | Sync Ad2 1 phrase (si pas déjà) | S | P2 |

---

## Checklist copy V2

- [ ] H1/promise non touchés (déjà différenciants)
- [ ] Chips « Score gratuit · sans compte »
- [ ] Process 3 beats mythe → split
- [ ] Dual : Aujourd’hui / Projets connus / Total illustratif
- [ ] Zéro claim prime / « plus cheap »
- [ ] SoftClose / mid non réécrits
