# [#07] REEE — Expert finances & fiscalité (QC)

**Slug :** `/campagnes/reee`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Périmètre :** nouveaux claims / champs P1 (`sceeDejaRecues`, regret-first) — pas revalider tout le P0  
**Réf. :** `ReeeTool.jsx` · `fiscalConfig2026.js` (`REEE_2026`)

---

## Rescore conformité post-P0

P0 soft-close + bandeau + callout sous-max : **GO** sous formulation « room illustrative SCEE de base ».  
V2 ajoute seed SCEE déjà reçues → risque principal = **confusion solde compte vs subventions reçues**.

---

## 1. Chiffres (inchangés — base)

| Concept | Montant | OK outil/copy |
|---------|---------|---------------|
| SCEE taux base | 20 % | Oui « ~20 % » |
| Assiette annuelle | 2 500 $ | Oui |
| Max annuel base | 500 $ | Oui |
| Plafond vie | 7 200 $ | Oui « illustratif » |
| IQEE | 10 % / 250 / 3 600 | **Hors total** — P2 seulement |

Suppléments revenu / BEC / rattrapage : **non modélisés** — copy « SCEE fédérale de base ».

---

## 2. Champ `sceeDejaRecues` — règles métier

| Règle | Spec |
|-------|------|
| Bornes | **0 … 7 200** (clamp UI + calc) |
| Signification | Cumul **SCEE de base déjà créditées** (approx parent) |
| **Pas** | Solde du REEE (capital + intérêts + autres aides) |
| Seed | `totalSubventions` démarre à `sceeDeja` ; grants annuels = `min(sceeAnnuelle, room)` |
| `laisseSurTable` | `max(0, 7200 − totalSubventions_final)` — room illustratif, **pas** créance |
| IQEE déjà reçue | **Hors scope P1** (évite double plafond / confusion relevé) |

### Microcopy obligatoire (finance signe)
> Pas le solde du compte : le cumul de SCEE déjà versée (approx.).

Si le parent entre le solde par erreur → room sous-estimé → RDV pour corriger (soft-close « déjà en place » suffit, pas d’alerte légale).

---

## 3. Claims V2 — revue

| Claim | Verdict | Correction |
|-------|---------|------------|
| « Encore possibles ~X $ » (regret-first) | OK si room / place | Jamais « dû » / « perdu à coup sûr » |
| « Avec ce que t’as déjà, encore ~X $ » | OK | X = room post-seed ; pas un remboursement |
| Chip `SCEE · max ~7 200 $` | OK | Toujours plafond illustratif |
| Callout sous-max × N ans | OK illustration | Garder « le plafond à vie peut limiter » (déjà P0) |
| Defaults 1 200 $ | OK math | Ne pas figer en ads hors scénario |

---

## 4. Vocabulaire

| Autorisé | Interdit |
|----------|----------|
| Place / room / encore possibles avant le max | Subventions **dues**, **garanties** |
| « Tu laisses sur la table » (illustratif) | « Le gouvernement te doit X $ » |
| SCEE fédérale de base | « Toutes les subventions possibles » |
| IQEE « peut s’ajouter — à revalider » | IQEE dans `totalIllustratif` sans le dire |
| Approximation parent sur SCEE reçue | Présenter le seed comme relevé officiel certifié |

---

## 5. Disclaimers

### Outil (garder + 1 phrase seed si champ live)
> Illustration seulement — pas un conseil. Chiffre principal = SCEE fédérale de base (~20 % sur les premiers ~2 500 $/an, max ~500 $/an, plafond à vie illustratif ~7 200 $). « SCEE déjà reçues » = estimation parent, pas un solde de compte. Autres aides (IQEE, suppléments, BEC) : hors total — à revalider. Rendement 4 % optionnel, non garanti.

### Soft-close
Ne pas dire « récupère tes X $ ». Dire « caler un rythme / déjà en place ».

### Landing / ads
Footer éducatif existant OK. Revalidation ARC / RQ avant scale Ads.

---

## 6. Ce qu’on ne promet **pas** (V2)

1. Que le seed parent est exact / officiel  
2. Que tout room est rattrapable  
3. Maximisation garantie via RDV  
4. Études 100 % financées par SCEE  
5. Multi-enfants sans modèle per-child  
6. IQEE dans le climax principal

---

## 7. GO / NO-GO

**GO finance V2** pour regret-first + `sceeDejaRecues` **si** :
- bornes 0–7200  
- hint solde ≠ SCEE visible  
- `laisseSurTable` = room, jamais « dû »  
- IQEE hors total  

**NO-GO** si on fusionne solde REEE dans le seed ou si on promet récupération du room.
