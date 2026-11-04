# [#13] Plan global — Brief final PM (WOW → RDV)

**Slug :** `/campagnes/plan-global`  
**Date :** 2026-11-04  
**CTA :** RDV Bookings  
**Scores audit :** exp. 5,5 · WOW outil 6,5 · envie booker **4,5**  
**Livrables experts :** `01` visuel · `02` script · `03` outil · `04` finance  
**Pas de commit** (demande explicite)

---

## Vision WOW (1 paragraphe)

Le prospect arrive de Meta avec le mythe « produits = plan ». Il coche 3–4 situations, voit **Commence ici · {n°1}**, et dans la même respiration on lui propose d’**ancrer ce n°1 en 15 minutes** (soft, zéro pitch) — PDF en secondaire, paliers Urgent / Important / Plus tard visibles comme promis par les ads. Le hub reste le seul carrefour cross-sujets : deep-links éducatifs vers les campagnes filles si pertinent. Succès = un ami qui regarde le téléphone dit « il a un rang #1, il booke pour l’attaquer », pas « checklist + PDF ».

---

## Synthèse des 4 experts

| Rôle | Message clé | Contrainte |
|------|-------------|------------|
| Visuel | Hero outil-first + motif chemin 1-2-3 ; soft-close collé au n°1 ; paliers visibles | Shell dual CTA + `id="outil"` (dette catalogue) |
| Script | H1 Ad1 gardé ; soft close cite `{order}` ; FAQ outil-seul / pas plan perso ; mid « Tu as un n°1… » | Zéro « plan sur mesure » |
| Outil | Soft-close + tiers + compteur « Ordre prêt » + deep-links + `tool_result` | Fichier principal `PlanGlobalTool.jsx` |
| Finance | Ordre pédagogique OK ; interdiction plan perso auto ; omettre deep-link CELIAPP sur `projetCourt` | Disclaimer + FAQ non négociables |

---

## Backlog shippable

### P0 — Bridge climax → RDV (ship cette vague)

| ID | Livrable | Fichier(s) | Effort | Impact |
|----|----------|------------|--------|--------|
| P0.1 | Soft-close sous « Commence ici » (cite `{order}` + CTA `…_rdv_outil`) | `PlanGlobalTool.jsx` | S | H |
| P0.2 | `statusDetail` + footer : RDV filled / PDF outline | `PlanGlobalTool.jsx` | S | H |
| P0.3 | Compteur `X cochée(s) · Ordre prêt` (plus de label `%` réussite) | `PlanGlobalTool.jsx` | S | M |
| P0.4 | Copy landing : promise, bullets outcomes, FAQ×5 | `campagneAdsLandings.js` | S | M |
| P0.5 | Disclaimers / formulations validées finance (soft close, PDF accents) | `PlanGlobalTool.jsx` | S | M |

### P1 — Promesse ads tenue + hub

| ID | Livrable | Fichier(s) | Effort | Impact |
|----|----------|------------|--------|--------|
| P1.1 | Buckets Urgent / Important / Plus tard (`TIER_BY_ID`) | `PlanGlobalTool.jsx` | M | H |
| P1.2 | Deep-links `id → /campagnes/…` (sans `projetCourt`→CELIAPP) | `PlanGlobalTool.jsx` | M | H |
| P1.3 | Event `select_content` `campagne_plan-global_result` (0→1) | `PlanGlobalTool.jsx` | S | M |
| P1.4 | Hints en `<details>` mobile | `PlanGlobalTool.jsx` | S | M |
| P1.5 | Mid CTA data-driven (`ctaHeadline` / `ctaSubline` / label) | `CampagneAdsLanding.jsx` + data | S | M |

### P2 — Shell / polish (partagé catalogue — max 2 slots locaux)

| ID | Livrable | Fichier(s) | Effort | Impact |
|----|----------|------------|--------|--------|
| P2.1 | Hero dual CTA : primaire `#outil` + secondaire RDV | `CampagneAdsLanding.jsx` (+ `id="outil"`) | S–M | M |
| P2.2 | Ligne confiance CSF · Victoriaville au fold | data + hero children | S | M |
| P2.3 | Motif pastilles 1-2-3 hero (atmosphère sujet) | `CampagneAdsLanding` / CSS local | M | M |
| P2.4 | Motion apparition bloc n°1 | `PlanGlobalTool.jsx` | S | B |

---

## Ordre d’implémentation recommandé

```
1. PlanGlobalTool — soft-close + statusDetail/footer + compteur     (P0.1–P0.3, P0.5)
2. campagneAdsLandings — promise, bullets, faq, cta*               (P0.4)
3. PlanGlobalTool — tiers U/I/P + deep-links + tool_result + hints (P1.1–P1.4)
4. CampagneAdsLanding — mid data-driven                            (P1.5)
5. CampagneAdsLanding — hero dual CTA + id=outil + confiance       (P2.1–P2.2)
6. Polish motif + motion                                           (P2.3–P2.4)
```

**Dépendances shell vs spécifique**

| Spécifique `#13` (faire sans attendre) | Shell catalogue (1× pour les 15) |
|----------------------------------------|----------------------------------|
| Soft-close n°1, tiers, deep-links, compteur, FAQ, copy data | Dual CTA hero, `id="outil"`, mid `ctaHeadline` sur branche RDV |

Si le shell dual CTA n’est pas prêt : **quand même shipper P0 outil** (le frein Ad2/Ad3 se corrige surtout post-climax).

---

## Critères d’acceptation « effet WOW + booker »

1. **Climax impossible à manquer** — dès 1 coche, « Commence ici · {order} » dominant  
2. **CTA RDV ≤ 2 s après climax** — soft-close immédiatement sous le n°1 (avant notes/PDF)  
3. **Identité sujet** — paliers U/I/P visibles ; hero n’est plus RDV-only si P2.1 livré  
4. **Test ami 5 s** — « il booke pour ancrer son n°1 », pas « il télécharge un PDF »  
5. **Conformité** — FAQ « outil seul » + « pas plan perso » ; aucun claim plan sur mesure ; pas de deep-link CELIAPP trompeur sur `projetCourt`  
6. **Mesure** — event `campagne_plan-global_result` + clics `…_rdv_outil` traçables  

### Definition of Done (QA manuelle)

- [ ] Desktop + mobile : 3 coches (filet + dettes + épargne) → n°1 = filet → soft-close cite le libellé → Bookings avec UTM  
- [ ] Paliers affichés (P1)  
- [ ] PDF secondaire, accents OK  
- [ ] Deep-link filet → `/campagnes/fonds-urgence`  
- [ ] Aucune régression disclaimer  

---

## Hors scope (cette vague)

- Recalcul / changement de `PRIORITY_IDS`  
- Montants $ ou estimateurs dans le hub  
- Refonte ads Meta (déjà outil-first)  
- Photo conseiller (nice P2+, assets)  
- Commit / deploy (sur demande)

---

## Owner next step

Implémenter **P0.1–P0.5** dans `PlanGlobalTool.jsx` + data landing, puis P1. Relire 1 phrase soft-close avec finance avant merge. Mesurer `…_rdv_outil` vs `…_rdv` / `…_pdf` après mise en ligne.
