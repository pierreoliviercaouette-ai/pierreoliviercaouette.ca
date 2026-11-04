# [#07] REEE — Expert finances & fiscalité (QC)

**Slug :** `/campagnes/reee`  
**Date :** 2026-11-04  
**Périmètre :** copy landing + ads + `ReeeTool.jsx` (illustration SCEE)  
**Réf. code plafonds :** `ReeeTool.jsx` + `fiscalConfig2026.js` (`REEE_2026`)  
**Rappel :** contenu éducatif — titre CSF — pas un conseil personnalisé

---

## 1. Verdict conformité

Chiffres **SCEE de base** utilisés dans l’outil campagne (20 % / 2 500 $ / 500 $ / an / 7 200 $ à vie) sont **alignés** avec la config 2026 du repo et le discours public habituel. Risques principaux = **vocabulaire** (argent « dû », études payées), **mélange IQEE dans le total**, **suppléments selon revenu** non modélisés (OK si on dit « de base »), **rattrapage** simplifié absent (OK en illustration courte si non promis).

**Statut :** GO refonte copy/UX **sous conditions** ci-dessous. Revalidation officielle (ARC / Revenu Québec) avant scale Ads Manager.

---

## 2. Chiffres validés (illustration « de base »)

| Concept | Montant / règle | Usage OK dans outil/copy ? |
|---------|-----------------|----------------------------|
| SCEE taux de base | 20 % | Oui — « ~20 % » / « ~20 ¢ /$ » |
| Assiette annuelle de base | Premiers **2 500 $** / enfant / an | Oui |
| SCEE max annuel de base | **500 $** / enfant / an | Oui |
| SCEE plafond à vie | **7 200 $** / enfant | Oui — toujours « illustratif / selon règles en vigueur » |
| IQEE taux de base | 10 % sur premiers 2 500 $ | Oui **en ligne séparée disclaimerée** seulement |
| IQEE max annuel de base | **250 $** | Idem |
| IQEE plafond à vie | **3 600 $** | Idem |
| Rendement outil | 4 % optionnel | Oui si « pas une garantie » |
| Horizon études | 17 ans (proxy) | OK éducatif — pas une règle fiscale |

### Suppléments (revenu familial) — **ne pas** promettre dans l’outil campagne P0
`REEE_2026` modélise SCEE/IQEE additionnels + BEC selon seuils. L’outil **campagne** actuel ignore volontairement ces couches → copy doit dire **« SCEE fédérale de base »**, pas « toutes les subventions possibles ».

### Rattrapage (droits inutilisés)
Non modélisé dans `ReeeTool` (boucle simple année par année jusqu’au plafond).  
**Interdit :** laisser croire qu’on peut « tout rattraper » d’un coup.  
**Autorisé :** « souvent en cotisant plus longtemps ou un peu plus tôt » (déjà dans points) + RDV pour droits accumulés.

---

## 3. Vocabulaire — autorisé / interdit

| Autorisé | Interdit / risqué |
|----------|-------------------|
| Subventions **illustratives** / possibles selon scénario | Subventions **dues**, **garanties**, **perdues à coup sûr** |
| « Tu laisses sur la table » (place / room illustrée) | « Le gouvernement te doit X $ » |
| « Encore possibles avant le max à vie » | « Études payées à 100 % » |
| « ~ » / ordres de grandeur | Montants ads hors outil sans disclaimer |
| « Pas un conseil » / « règles évoluent » | « On maximise ton REEE » comme promesse de résultat |
| IQEE « peut s’ajouter — à revalider » | Ajouter IQEE **dans** `totalIllustratif` sans le dire |
| Soft-close sur room restante | Urgence fake / countdown fiscal |

**`laisseSurTable` :** OK émotionnellement **si** formulé comme room / place avant plafond illustratif — **pas** comme créance.

---

## 4. Claims copy / ads — revue

| Claim | Verdict | Correction si besoin |
|-------|---------|----------------------|
| Hero « ~20 % » (ancien) | Imprécis seul | Remplacé par mythe compte ouvert ; 20 % reste en bullets avec assiette |
| « Max ~500 $/an » | OK base | Préciser « de base » si place |
| « Plafond ~7 200 $ » | OK | Toujours « illustratif » |
| Ad1 « aides… suit pas automatiquement un compte ouvert » | OK direction | Garder « selon les règles en vigueur » |
| Ad2 « se rattrape pas toujours comme on l’imagine » | OK prudent | Ne pas durcir en « impossible de rattraper » |
| Defaults 1 200 $ encore possibles | OK math 12×500=6000 ; 7200−6000=1200 | Ne pas figer « 1 200 $ » dans ads créatives hors scénario |
| Callout sous-max « ≈ 300 $/an × 12 ≈ 3 600 $ » | OK **illustration** si cotisation 1 000 $ (SCEE 200 → écart 300) | Disclaimer : plafond vie peut tronquer le cumul |

---

## 5. Disclaimers obligatoires

### Outil (`ReeeTool` disclaimer prop)
> Illustration seulement — pas un conseil. Chiffre principal = **SCEE fédérale de base** (~20 % sur les premiers ~2 500 $/an, max ~500 $/an, plafond à vie illustratif ~7 200 $). Autres aides (IQEE, suppléments selon revenu, BEC) : hors total ou ligne séparée — à revalider selon les règles en vigueur. Le rendement 4 % est optionnel et non garanti.

### Landing footer (existant + renforcement léger)
> Contenu éducatif et général. Titre autorisé : conseiller en sécurité financière. Ne constitue pas un conseil personnalisé. Subventions, plafonds et règles évoluent. Chaque situation est unique.

### Ads
Conserver footer catalogue. Avant diffusion : revalider 20 % / 500 / 7 200 / IQEE 10 % / 250 / 3 600 auprès sources officielles (année fiscale courante).

### Soft-close
Ne pas dire « récupère tes 1 200 $ ». Dire « caler un rythme / déjà en place ».

---

## 6. Champ « SCEE déjà reçues » (P1) — règles métier

- Borner input **0 … 7 200**  
- Seed = subventions **SCEE de base déjà créditées** (approx parent) — pas le solde du compte REEE (capital ≠ subventions)  
- Hint UX obligatoire : distinction **solde compte** vs **SCEE reçue**  
- Si parent entre le solde par erreur → risque sous-estimation du room — microcopy : `Pas le solde du compte : le cumul de SCEE déjà versée (approx.).`  
- IQEE déjà reçue : **hors scope P1** (sinon double plafond / confusion)

---

## 7. IQEE dans l’UI (P2 seulement)

Si ligne séparée :
- Calcul base simple : `min(cotisation, 2500) * 0.1` plafonné 250 $/an, plafond vie 3600, même boucle room  
- Label : `IQEE (illustration QC, base)`  
- **Ne pas** additionner dans le gros total études **ou** afficher deux totaux clairement étiquetés  
- Suppléments revenu : non

---

## 8. Ce qu’on ne doit **pas** promettre

1. Que le RDV « maximise » à coup sûr les subventions  
2. Que tout room non utilisé est récupérable plus tard  
3. Un rendement (4 % ou autre) comme scénario probable  
4. Des études financées entièrement par SCEE/IQEE  
5. Des montants multi-enfants sans modèle per-child explicite  
6. L’équivalence banque / promoteur / contrat collectif (droits, frais, BEC) sans analyse

---

## 9. Checklist revalidation pré-Ads

- [ ] SCEE 20 % / 2 500 / 500 / 7 200 toujours exacts année civile  
- [ ] IQEE 10 % / 250 / 3 600 si mentionnés  
- [ ] Seuils revenu (si un jour exposés) = `fiscalConfig2026` à jour  
- [ ] Aucune créa « 100 % études »  
- [ ] `laisseSurTable` jamais = « dû »  
- [ ] Disclaimer outil + ads présents  

**GO finance pour P0 soft-close `laisseSurTable` + callout sous-max + copy mythe** — sous formulation « room illustrative SCEE de base ».
