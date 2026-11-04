# [#06] Maladie grave — Spec FINANCE & conformité

**Slug :** `/campagnes/maladie-grave`  
**Fichier :** `04-expert-finance.md`  
**Date :** 2026-11-04  
**Juridiction :** Québec / Canada · Titre : conseiller en sécurité financière  
**Sources :** `MaladieGraveTool.jsx` · ads `maladie-grave.md` · audit · capsule `/apprendre/assurance-maladie-grave`

---

## 1. Verdict chiffres

| Élément | Statut | Commentaire |
|---------|--------|-------------|
| Formule 3 blocs (conjoint + soins + QV) | ✅ OK | Pédagogique, pas une norme AMF / assureur |
| Défaut 3 500 $/mois × 12 | ✅ OK | Illustration ; prospect peut changer |
| Surplus QV 15 000 $ | ✅ OK | Arbitraire assumé — label clair |
| `dejaCouvert` défaut 0 | ⚠️ OK si disclaimer | Dramatise écart 90 k$ — ne jamais présenter comme « tu manques 90 k$ » |
| SCC ~33 000 $ (2024) | ⚠️ Encadrer | Voir §2 |
| Vocabulaire Invalidité ≠ MG | ✅ OK | À renforcer UI, déjà correct en copy |
| « Capital forfaitaire » | ✅ OK | Sous réserve contrat / diagnostic / survie |

**Rien à recalculer dans le code** — risque = framing & claims, pas la math.

---

## 2. Stat SCC — règles d’usage

**Source citée dans le code :** Société canadienne du cancer, rapport spécial 2024 — coûts à la charge du patient / proches ~33 000 $ sur la durée (ordre de grandeur **Canada**).

### Do
- Toujours : « moyenne illustrative », « ordre de grandeur », « Canada », « à ajuster »
- Champ éditable (déjà le cas)
- Note visible près du champ soins (`SOINS_STAT_NOTE`)

### Don’t
- « Au Québec, ça coûte 33 000 $ »
- « Tes soins non couverts seront de 33 000 $ »
- Présenter le 33 k$ comme prestation d’assurance
- Fusionner 33 k$ + capital MG comme si le contrat « paie les soins SCC »

### Formulation validée (outil + ads + PDF)
> Moyenne illustrative ~33 000 $ (Société canadienne du cancer, 2024 — coûts à la charge patient/proches sur la durée, Canada). À ajuster selon ta situation. Ce n’est pas un montant de prestation d’assurance.

---

## 3. Claims risqués → reformulations

| Claim risqué (à éviter) | Reformulation conforme |
|-------------------------|------------------------|
| Tu as besoin de 90 000 $ | Capital illustratif à viser selon tes hypothèses |
| Tu manques 90 000 $ | Écart illustratif vs ce que tu as indiqué comme déjà couvert |
| La MG paie X $ | Si le contrat s’applique, un capital forfaitaire peut être versé — montant = contrat |
| Ta collective ne couvre rien | Capital MG collectif souvent petit / conditionnel — on lit la brochure |
| Invalidité ne sert à rien en cas de cancer | Jobs différentes ; MG complète, ne remplace pas |
| Toutes les maladies graves sont couvertes | Maladies listées + critères + délai de survie = contrat |
| Tu recevras l’argent en 48 h | Délais / conditions de réclamation = assureur / contrat |
| C’est la même chose que l’invalidité | Explicitement faux — garder Ad1 / H1 / module contraste |

---

## 4. Disclaimers obligatoires (où)

| Surface | Texte minimal |
|---------|----------------|
| Outil `disclaimer` prop | Illustration éducative. Maladies, délais de survie, montants, exclusions = contrat. Pas un conseil personnalisé. |
| Soft close RDV | Clarifier ≠ acheter. |
| Ads / commentaire épinglé | Contenu éducatif. Titre CSF. Pas personnalisé. Invalidité ≠ MG. Aucun capital promis comme garantie. |
| PDF notes | SCC note + capital selon contrat + complète l’invalidité |
| Footer landing | Disclaimer site existant (éducatif / CSF / situation unique) — garder |
| Mid / in-tool | Ne pas laisser le chiffre sans « illustratif » dans le CTA long |

### Phrase interdite près du CTA
❌ « Réserve pour obtenir tes 90 000 $ »  
✅ « Clarifier cet écart illustratif en 15 min »

---

## 5. Distinction produits (vocabulaire finance)

| Produit | Job | Timing | Forme |
|---------|-----|--------|-------|
| Assurance invalidité | Remplacer une partie du revenu | Pendant incapacité de travail | Prestations périodiques (souvent %) |
| Assurance maladie grave | Liquidités / capital | Diagnostic + conditions (ex. survie) | Forfaitaire (souvent une fois) |
| Assurance vie | Protéger les proches | Décès | Capital décès |
| Collective (maladie grave) | Parfois petit capital MG | Selon contrat employeur | Souvent limité / conditionnel |

**Message unique campagne #06 :** MG ≠ invalidité (#04). Ne pas cannibaliser créa #04 avec les mêmes visuels « trou de revenu mensuel ».

**Solo :** le bloc conjoint est optionnel — besoins soins + QV restent valides financièrement (pas de conjoint à « remplacer »).

---

## 6. Fiscalité / impôts (ne pas sur-promettre)

- Prestations d’assurance maladie grave : traitement fiscal **selon le type de contrat et la situation** — **ne pas** affirmer « 100 % libre d’impôt » sur la landing sans nuance.
- Pour cette campagne WOW : **hors scope** d’expliquer le fiscal en hero/outil. Si mention FAQ un jour : « Ça dépend du contrat — on le clarifie en RDV. »
- Pas de conseil fiscal / pas de numéro d’impôt dans l’outil.

---

## 7. Risques conformité & mitigation

| Risque | Mitigation P0 |
|--------|----------------|
| Defaults 90 k$ perçus comme promesse | Labels « illustratif » + disclaimer outil + CTA « écart illustratif » |
| Confusion #04 invalidité | Module 2 cols + H1 + Ad1 + FAQ #1 |
| « Collective = réglé » | FAQ collective + chip 0 $ + soft close brochure |
| Liste de maladies implicite | FAQ « dépend du contrat » — pas de liste inventée |
| SCC mal citée | Note Canada + ajustable + non = prestation |
| PDF accents cassés (perception non-pro) | Fix chaînes (script) — pas conformité dure mais crédibilité |
| Pression vente | « Clarifier ≠ acheter » outil + mid + ads |

---

## 8. Ce qu’on ne doit **pas** promettre
- Un montant de capital garanti
- Qu’un diagnostic = paiement automatique
- Que l’outil remplace une analyse de besoins / lecture de contrat
- Une couverture pour « toutes » les maladies graves
- Un délai de survie universel
- Que la collective est insuffisante sans l’avoir lue
- Un résultat fiscal

---

## 9. Checklist acceptation FINANCE
- [ ] Aucun CTA / H2 qui affirme un montant « dû » au prospect
- [ ] SCC toujours Canada + illustrative + ajustable
- [ ] Maladies / délais / exclusions → contrat (FAQ + disclaimer)
- [ ] MG positionnée comme **complément** de l’invalidité
- [ ] Soft close = lecture brochure / contrat, pas closing produit
- [ ] Ads disclaimer épinglé aligné landing
