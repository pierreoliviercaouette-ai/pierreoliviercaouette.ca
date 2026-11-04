# [#10] Trop jeune — Spec FINANCE & conformité QC

**Rôle :** Expert finances & fiscalité  
**Slug :** `/campagnes/trop-jeune-assurance`  
**Date :** 2026-11-04  
**Cadre :** contenu éducatif · conseiller en sécurité financière (CSF) · Victoriaville / QC  
**CTA :** RDV clarification — pas soumission en ligne

---

## 0. Verdict conformité

L’outil est une **illustration de besoin** (score + capital ordres de grandeur), pas une cotation. Les formules actuelles (100 k$ famille, 24× revenu mensuel, solde maison, dettes, hypo prévue) sont acceptables **si** le wording reste « illustratif / ordre de grandeur / pas une soumission ».  
Risque #1 copy : glisser vers « plus jeune = moins cher » ou « assure-toi avant que ça coûte ». Risque #2 UX : capital 455 k$ pré-cuit = perception de pitch commercial. Risque #3 : silence sur la collective alors qu’Ad3 l’ouvre.

**Note conformité page actuelle :** OK sur disclaimers de base ; **faible** sur objection prix/âge et sur cadrage split présent/projets.

---

## 1. Chiffres & vocabulaire — valider / garder

| Élément | Usage actuel | Verdict | Wording obligatoire |
|---------|--------------|---------|---------------------|
| Score /100 | Pondération présent + futur | OK éducatif | « Score illustratif » — **≠ prime**, ≠ admissibilité |
| Capital total | Somme blocs | OK | « Montant à viser (illustration) » / « illustratif » |
| 100 000 $ enfants / famille prévue | Ordre de grandeur | OK | Toujours « ordre de grandeur » — pas besoin réel calculé |
| 24 × paye nette mensuelle | Proxy remplacement revenu | OK courant | Montrer la base (`24 mois × …`) comme maintenant |
| Solde maison / dettes | Face value | OK | Pas présenter comme couverture exacte |
| Hypothèque **prévue** | Montant user | OK | « Projet connu » ≠ engagement ; pas une analyse capacité d’emprunt |
| Âge | Affiché, hors score | **Correct** | Garder hint « contexte seulement — n’entre pas dans le score » |
| Temporaire vs permanente | Capsule apprendre | OK | Ne pas dire « prison » en bullet landing (ambigu + hors promesse ads) |

### Ce qu’on ne change **pas** dans les formules (P0)
Pas de refonte actuarielle. Le WOW vient du **révélateur présent/projets**, pas d’un faux pricing.

---

## 2. Claims risqués — interdit / reformuler

| Claim / tentation | Statut | Remplacer par |
|-------------------|--------|---------------|
| « Plus cheap / moins cher si tu prends ça jeune » | **Interdit** chiffré ou garanti | « L’âge et la santé pèsent souvent dans le coût et l’admissibilité — au cas par cas, en rencontre » |
| « Économise X % en t’assurant maintenant » | **Interdit** | — |
| « Tu vas être refusé si tu attends » | **Interdit** | « Attendre peut compliquer l’admissibilité selon la santé — on clarifie ta situation » |
| Score = « tu as besoin de 455 k$ d’assurance » | **Risqué** | « Montant illustratif à viser » + split + disclaimer |
| « Temporaire = pas une prison » (bullet) | Faible / hors message | Score + montant + sans compte (script) |
| Matrice CBO Ad3 « Prix vs risque » agressive | **Canaliser** | FAQ éducative #3 — pas ad pricing |

---

## 3. Disclaimers obligatoires (garder + renforcer)

### Sur l’outil (déjà)
> Illustration éducative seulement — pas une soumission ni un conseil personnalisé.

### À ajouter / renforcer
1. **Soft close / PDF** : rappeler que score + capital ≠ soumission.  
2. **FAQ âge/prix** : score ne calcule pas une prime.  
3. **Collective** : le score **n’inclut pas** la couverture employeur ; croisement en RDV.  
4. **Footer landing** (existant) : titre CSF + pas conseil personnalisé — garder.

### Phrase type soft close conforme
> Score {n}/100 · ~{capital} **illustratifs** (présent + projets connus). 15 min pour lire ça ensemble — clarifier ≠ acheter.

---

## 4. Objections financières du persona — cadrage expert

### « Trop jeune / en santé — j’attends »
- Vrai : âge/santé influencent souvent tarification et sélection.  
- Faux à promettre : un écart de prime précis sans dossier.  
- Angle page : **besoin déjà connu** (hypo, famille, qui dépend de toi) > mythe carte d’identité. Le « quand » se discute en RDV.

### « J’ai rien aujourd’hui (locataire, 0 enfant) »
- Le split Aujourd’hui ~5 k$ vs Projets ~450 k$ est le levier éducatif Ad2 — **pas** une recommandation d’acheter 450 k$ demain.  
- Clarifier : projets = besoins **potentiels déjà anticipés**, à réévaluer quand ils se concrétisent.

### « J’ai la collective au travail »
- Collective = souvent temporaire à l’emploi, montants/définitions variables, conversion parfois limitée.  
- Ne pas dénigrer la collective.  
- Message : « croiser collective + besoins perso pour éviter trous **ou** doublons » — FAQ #4.

### Temporaire
- Lien capsule `/apprendre/assurance-vie-temporaire` OK.  
- Éviter polarisation « permanente = piège » sur la landing score.

---

## 5. PDF & artefacts

| Contenu PDF | Exigence |
|-------------|----------|
| Titre / headings FR avec accents | Oui (crédibilité pro) |
| Score + capital split | Oui — même cadrage illustratif |
| Note « Apporte en RDV » | Oui — oriente vers clarification |
| Disclaimer éducatif | Obligatoire en notes |
| Aucune « prime estimée » | Interdit |

---

## 6. Sync ads / landing / outil

| Surface | OK si… |
|---------|--------|
| Ad1–Ad3 | Score-first, sans compte, soft close — **sans** claim prix |
| Landing FAQ | Porte « attendre » + collective de façon éducative |
| Outil | Defaults non spoilés ; capital splité ; pas de module prime |
| Mid / soft close | Cite illustration, pas « tu dois t’assurer » |

---

## 7. Checklist finance avant ship

- [ ] Aucune prime, %, « moins cher garanti » dans UI, FAQ, ads  
- [ ] Score et capital toujours qualifiés d’illustratifs  
- [ ] 100 k$ / 24× présentés comme ordres de grandeur  
- [ ] Âge hors score + expliqué  
- [ ] Collective : hors score + FAQ honnête  
- [ ] Soft close : clarifier ≠ acheter  
- [ ] Titre CSF visible dans chaîne confiance (proof strip / footer)
)
