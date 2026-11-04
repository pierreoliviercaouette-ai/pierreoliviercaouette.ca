# [#07] REEE — Brief PM final (WOW → RDV)

**Slug :** `/campagnes/reee`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/reee  
**Date :** 2026-11-04  
**Équipe :** Visuel · Script · Outil · Finance → synthèse PM  
**Sources :** `docs/plan-modification-marketing/07-reee.md` + livrables `01`–`04` ce dossier  
**Commit :** non — brief seulement

---

## 1. Vision WOW (1 paragraphe)

Le parent arrive d’une ad « compte ouvert ≠ maximisé » / « laisse sur la table ». En &lt; 10 s il scroll l’outil (pas le calendrier). Sur le scénario par défaut, il voit non seulement ~36 k$ pour les études, mais surtout **~1 200 $ encore possibles** avant le plafond SCEE — chiffre impossible à manquer. S’il baisse à 1 000 $/an, un callout lui montre l’écart annuel. Dans les 2 secondes après ce climax, un soft-close québécois cite **son** X $ et propose **Relier ça à mon budget — 15 min** (PDF en secondaire). Le mid CTA dit la même chose, pas « clarifier ta situation ». FAQ tue « j’ai déjà un REEE à la banque ». Résultat : regret doux + cadre clair → Bookings, sans pitch.

---

## 2. Scores cibles

| Métrique | Audit | Cible post-refonte |
|----------|------:|-------------------:|
| Expérience globale | 6 | ≥ 8 |
| Effet WOW outil | 7 | ≥ 9 |
| Envie de booker | 4,5 | ≥ 7,5 |

**North star produit (#07) :** soft-close sur `laisseSurTable` $ exact (Ad2).

---

## 3. Backlog shippable

### P0 — ship cette vague (conversion)

| ID | Livrable | Rôle source | Où | Effort |
|----|----------|-------------|-----|--------|
| P0-1 | Soft-close RDV chiffré `laisseSurTable` ; PDF outline ; `trackRendezVousClick('campagne_reee_rdv_outil')` | Outil + Script | `ReeeTool.jsx` footer / statusDetail | **S** |
| P0-2 | Bandeau visuel « Encore possibles » dominant (pas 3e cellule égale) | Visuel + Outil | `ReeeTool.jsx` résultat | **S** |
| P0-3 | Callout `sousMaxAnnuel` (écart $/an × N) + highlight preset 2 500 | Outil + Script + Finance | `ReeeTool.jsx` + `buildLecture` | **S** |
| P0-4 | Hero copy mythe + dual CTA labels (outil primary / RDV secondary) | Script + Visuel | `campagneAdsLandings.js` | **S** |
| P0-5 | Shell : hero dual CTA scroll `#outil` + mid `ctaHeadline`/`ctaSubline` data-driven | Visuel + Script | `CampagneAdsLanding.jsx` (+ id outil) | **S** *(dette shell 15 campagnes)* |
| P0-6 | Mid copy REEE + FAQ « J’ai déjà un REEE » (+ FAQ mensuelle) | Script | `campagneAdsLandings.js` | **S** |
| P0-7 | Event climax `campagne_reee_laisse_sur_table` (value = $) | Outil | `ReeeTool.jsx` | **S** |
| P0-8 | Ligne confiance CSF Victoriaville au fold | Visuel + Script | data + hero children / prop | **S** |

### P1 — renforce persona « compte ouvert »

| ID | Livrable | Effort |
|----|----------|--------|
| P1-1 | Champ SCEE déjà reçues 0–7 200 + seed `projeterReee` + copy « Avec ce que t’as déjà… » | **M** |
| P1-2 | Toggle cotisation $/mois ↔ $/an | **S–M** |
| P1-3 | Process 3 steps entre En bref et outil | **S** |
| P1-4 | « À retenir » en `<details>` mobile ; PDF accents FR | **S** |
| P1-5 | Micro-align titres Ad1/Ad2 catalogue | **S** |

### P2 — polish / later

| ID | Livrable | Effort |
|----|----------|--------|
| P2-1 | Ligne IQEE illustration séparée (hors total principal) — après GO finance UI | **M** |
| P2-2 | Photo / créa parent·enfant hero (navy brief ads) | **M** |
| P2-3 | Teaser multi-enfants soft-close only (pas modèle complet) | **S** |
| P2-4 | Variant PageHero navy-subject sans orbes (shell design system) | **M** |

---

## 4. Ordre d’implémentation recommandé

```
1. Shell (P0-5)     — dual CTA + id="outil" + mid data-driven
                      ※ débloque 15 campagnes ; faire en premier si pas déjà shippé
2. Data copy (P0-4, P0-6, P0-8) — campagneAdsLandings.js entrée reee
3. Climax UI (P0-2) — bandeau laisseSurTable
4. Soft-close (P0-1) + event (P0-7)
5. Callout sous-max (P0-3)
6. QA defaults (1 200 $) + preset 1 000 $ + mobile thumb
7. P1-1 → P1-2 → P1-3/4
8. P2 selon créa / IQEE
```

**Dépendance critique :** P0-1/P0-4/P0-6 peuvent shipper **même si** shell dual CTA glisse — mais hero restera RDV-first jusqu’à P0-5 (fuite ads). Prioriser shell.

---

## 5. Shell vs spécifique campagne

| Levier | Shell partagé | Spécifique `#07` |
|--------|---------------|------------------|
| Hero dual CTA (outil / RDV) | `CampagneAdsLanding` + labels data | Labels reee |
| Mid `ctaHeadline` / `ctaSubline` | Brancher data (fini hardcode) | Copy laisse sur table |
| `id="outil"` | Oui | — |
| Soft-close post-outil | Pattern à standardiser plus tard | **Implémenter dans `ReeeTool`** maintenant |
| `laisseSurTable` bandeau | — | `ReeeTool` only |
| SCEE déjà reçues | — | `ReeeTool` |
| FAQ / bullets / hero title | — | `campagneAdsLandings` `reee` |

---

## 6. Critères d’acceptation « effet WOW + booker »

- [ ] **Climax :** sur defaults, « encore ~1 200 $ » est le chiffre émotionnel dominant (bandeau), pas seulement le total 36 k$  
- [ ] **Pont &lt; 2 s :** CTA `Relier ça à mon budget — 15 min` visible sous le climax, avant/à côté PDF secondary  
- [ ] **Ads match :** hero titre = mythe compte ouvert ; CTA primary = scroll outil  
- [ ] **Sous-max :** preset 1 000 $ → callout écart annuel lisible  
- [ ] **Objection #1 :** FAQ « J’ai déjà un REEE… » présente  
- [ ] **Conformité :** SCEE de base ; pas d’argent « dû » ; pas « études 100 % » ; disclaimer outil OK (finance §5)  
- [ ] **Analytics :** event `laisse_sur_table` + `_rdv_outil`  
- [ ] **Ami test 5 s :** voit encore ~X $ + raison de booker

---

## 7. Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| Shell dual CTA retardé | Ship soft-close outil + copy mid data dès que branchement mid est là ; hero labels prêts |
| Parent confond solde REEE et SCEE reçue (P1) | Microcopy finance §6 |
| Callout sous-max × années surestime si plafond tronque | Phrase « illustration · le plafond à vie peut limiter » |
| IQEE trop tôt dans total | Rester P2 + ligne séparée |

---

## 8. Livrables dossier (cette équipe)

| Fichier | Statut |
|---------|--------|
| `01-expert-visuel.md` | Done |
| `02-expert-script.md` | Done |
| `03-expert-outil.md` | Done |
| `04-expert-finance.md` | Done |
| `00-PM-brief-final.md` | Done (ce fichier) |

**Prochaine action dev :** implémenter P0 dans l’ordre §4 — **sans commit** jusqu’à demande explicite.
