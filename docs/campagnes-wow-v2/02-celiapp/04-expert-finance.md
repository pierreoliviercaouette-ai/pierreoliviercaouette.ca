# [#02] CELIAPP — Validation finances Vague 2 (gap cible)

**Rôle :** Expert finances & fiscalité  
**Slug :** `/campagnes/celiapp`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Focus :** nouveaux claims / champs P1 uniquement (Projection · Cible · Écart)

---

## Rescore post-P0 (conformité)

| Dimension | Après P0 | Risque V2 | Cible |
|-----------|----------|-----------|-------|
| Plafonds 8 k / 40 k illustratifs | OK | Stable | Garder |
| « Cotisations seulement » | Visible climax + SoftClose | Gap pourrait être lu comme « manque pour acheter » | Nuancer écart |
| Admissibilité | Pas de verdict outil | Ne pas réintroduire checklist verte en V2 ship | OK |

**Top 1 risque V2 :** l’**Écart** lu comme « il te manque X $ pour ta maison » (implique prix, rendement, admissibilité) — alors que c’est seulement cotisations vs souhait user.

---

## 1. Chiffres inchangés (référence)

| Concept | Montant | Note |
|---------|---------|------|
| Nouveaux droits / année | 8 000 $ | Illustratif 2026 |
| Plafond à vie | 40 000 $ | Illustratif 2026 |
| Reports | jusqu’à ~16 k$ / an possible | **Pas** dans le moteur V2 ; hint clamp déjà OK |

Defaults 4 000 × 4 = 16 000 $ : OK, sous plafond vie, scénario réaliste.

---

## 2. Nouveau champ — cible mise de fonds

| Aspect | Verdict |
|--------|---------|
| Champ optionnel saisi par l’usager | **OK** — souhait personnel, pas une norme AMF / prix marché |
| Afficher Projection \| Cible \| Écart | **OK éducatif** si copy = cotisations vs souhait |
| Calcul `ecart = cible - totalProjete` | **OK** arithmétique simple |
| Présenter l’écart comme « trou pour acheter » | **Interdit** |
| Dire « tu es à X % de ta mise » | **Interdit** (implique que la cible = mise réelle / suffisante) |
| Inclure rendement pour « combler » l’écart | **Interdit** |
| Suggérer un prix de propriété QC | **Interdit** |

---

## 3. Claims gap — table de verdict

| Claim / UI | Verdict | Action |
|------------|---------|--------|
| Labels Projection · Cible · Écart | OK | Garder |
| « ~X $ à combler » | OK **si** contexte cotisations | Toujours près de « cotisations seulement » |
| « Au-dessus de ta cible (cotisations seulement) » | OK | Obligatoire si écart < 0 |
| SoftClose « Projection · Cible · Écart… leviers rythme/horizon/autres comptes » | OK | Pas « on va te trouver ta mise » |
| Chip hero « Cotisations seulement » | OK — renforce | Garder |
| « Assez / pas assez pour une 1ʳᵉ propriété » | **Non** | Jamais |
| Deux conjoints = 80 k$ dans le gap | **Non** en V2 | Hors scope |

---

## 4. Disclaimers

**Sous la grille gap (micro, 1 ligne) :**  
L’écart, c’est cotisations vs ton souhait — pas une promesse d’achat ni un rendement.

**Disclaimer outil (shell — garder post-P0) :**  
Illustration éducative seulement — pas un conseil personnalisé. Chiffres 2026 illustratifs (8 000 $ de nouveaux droits / année, 40 000 $ à vie ; les reports peuvent changer le max d’une année). Qui a le droit, les retraits et l’impôt : à revalider selon ta situation. Aucun rendement inventé.

**Si PDF ajoute Cible / Écart :** reprendre « cotisations seulement » dans les notes.

---

## 5. Ce qu’on ne promet pas (V2)

1. Que la **cible** saisie est un montant de mise « réaliste » ou réglementaire  
2. Que combler l’écart = pouvoir acheter  
3. Qu’un RDV « garantit » de fermer l’écart  
4. Un rendement pour rattraper l’écart  
5. Admissibilité CELIAPP liée au fait d’avoir une cible  
6. Que 16 k$ / 25 k$ / 40 k$ « suffit » au Centre-du-Québec

---

## 6. Alignement code ↔ conformité

| Élément | OK ? | Note |
|---------|------|------|
| `PLAFOND_ANNUEL / VIE` | OK | Inchangé |
| `totalProjete` = cotisations | OK | Base Projection |
| `cible` user input | OK | Pas une donnée fiscale |
| `ecart` affiché | OK + micro-disclaimer | |
| SoftClose `ToolSoftClose` | OK | Pas de claim custom hors templates script |
| Atmosphere / heroExtras | N/A finance | Sauf chip « Cotisations seulement » = bienvenu |

---

## 7. Checklist revue avant ship V2

- [ ] Micro-ligne « cotisations vs souhait » sous la grille gap
- [ ] Aucun « assez pour ta maison » / « tu achèteras »
- [ ] Écart négatif = formulation « Au-dessus… (cotisations seulement) »
- [ ] Disclaimer outil inchangé (reports + pas de rendement)
- [ ] Titre professionnel : conseiller en sécurité financière uniquement
- [ ] Pas de checklist admissibilité « feu vert » dans ce ship V2
