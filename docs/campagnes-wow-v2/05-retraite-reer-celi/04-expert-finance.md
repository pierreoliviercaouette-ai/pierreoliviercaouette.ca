# [#05] Expert finances & fiscalité — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Périmètre V2 :** valider **nouveaux** claims / champ matching P1 — pas re-auditer SoftClose / bullets P0 déjà signés.

---

## Rescore post-P0 (conformité)

| Zone | Après P0 | V2 |
|------|----------|-----|
| Mixte illustratif / nuance | OK | OK |
| Disclaimers outil + SoftClose + bas page | OK | Garder |
| Matching (nouveau champ) | N/A | **À signer** avant merge P1 |

**Top 1 risque V2 :** formuler le matching comme ordre produit (« maximise toujours le REER employeur ») — interdit.

---

## Validation champ matching (P1)

### Claims OK

| Claim | Formulation autorisée |
|-------|----------------------|
| Match = souvent argent conditionnel | « Ton employeur matche **souvent** le REER… on le chiffre en 15 minutes. » |
| Impact possible sur l’ordre | « ça **peut** changer l’ordre du prochain dollar » |
| Outil ne calcule pas le % | FAQ actuelle OK — garder |
| Liquidité prioritaire | Si liquidité oui + matching oui : CELI d’abord + nuance RDV |

### Interdits

- Forcer split 100 % REER si matching = Oui.  
- « Tu **dois** maximiser le REER employeur avant tout CELI. »  
- Afficher un % de match inventé (ex. « 50 % de match ») sans saisie utilisateur clairement illustrative.  
- Présenter `celiAmt` / `reerAmt` comme cotisation optimale.  
- Confondre CELI / CELIAPP dans le kicker ou le process (CELIAPP reste FAQ).  
- Hardcoder plafonds CELI/REER dans l’outil prioriseur (contexte Apprendre seulement : CELI 2026 = 7 000 $ ARC — hors output outil).

### Algo — contrainte finance

Règles `buildSuggestion` liquidité / horizon / tranche : **inchangées**.  
Matching = metadata pédagogique + raison + pont RDV — **pas** un 4ᵉ axe de split.

---

## Disclaimers (emplacements — rappel)

1. Sous outil : `Illustration éducative seulement. Pas un conseil personnalisé.`  
2. SoftClose xs (déjà) : titre CSF + éducatif.  
3. Bas landing : inchangé.  
4. PDF notes : + « règles du régime employeur » (déjà présent — garder).  
5. Chip « Match employeur noté » : pas de claim dollar / %.

---

## Ce qu’on ne promet pas

- Rendement, « meilleur compte », ordre personnalisé optimal.  
- Calcul de droits REER/CELI ou remboursement d’impôt.  
- Que le match est toujours supérieur à toute cotisation CELI.  
- Montants employé/employeur sans dossier.

---

## Spec Avant → Après (finance)

| Zone | Avant | Après V2 | Note |
|------|-------|----------|------|
| Matching | Absent | Chips + raison « souvent » | Sign-off requis |
| Split | Heuristiques OK | Inchangé si Oui | Critique |
| FAQ matching | Présente P0 | Garder | OK |
| SoftClose copy | Livré | Ne pas rouvrir | — |

---

## Backlog finance

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| F-1 | Sign-off copy matching + raisons | S | P1 |
| F-2 | Vérifier PDF row + notes régime | S | P1 |
| F-3 | Smoke : liquidité+matching Oui → CELI | S | P1 |

---

## Checklist sign-off avant merge P1

- [ ] Aucun % rendement / % match inventé  
- [ ] Matching = éducatif + RDV, pas ordre produit  
- [ ] Liquidité court-terme non écrasée silencieusement  
- [ ] Disclaimers 3 emplacements intacts  
- [ ] CELIAPP confiné FAQ  
- [ ] Titre : conseiller en sécurité financière  
