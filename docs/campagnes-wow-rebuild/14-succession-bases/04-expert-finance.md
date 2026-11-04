# [#14] Succession — bases — Expert finances & fiscalité (QC)

**Slug :** `/campagnes/succession-bases`  
**Date :** 2026-11-04  
**Périmètre :** exactitude éducative, vocabulaire CSF vs notaire, risques conformité AMF / pratique QC  
**Sources :** outil, landing, ads, capsule Apprendre, audit WOW

---

## 1. Verdict conformité (1 paragraphe)

La campagne est **éducative** et globalement saine : elle ne chiffre pas de prestations, ne promet pas une succession « réglée », et répète que le notaire reste central. Le risque #1 n’est pas fiscal — c’est **la confusion de métiers** (CSF qui semblerait faire du juridique) et une sortie émotionnelle qui pousse « PDF + notaire » au détriment du vrai rôle CSF (liquidité, couverture, bénéficiaires de contrats). Toute refonte WOW→RDV doit **renforcer** la frontière CSF | notaire, pas l’effacer pour booker plus.

---

## 2. Ce qui est exact / à conserver

| Élément | Verdict |
|---------|---------|
| Liquidité ≠ actifs / patrimoine sur papier | **Exact et central** — maison, REER, CELI illiquides ≠ cash des premiers mois |
| Bénéficiaires (assurance, REER, CELI) | **Exact** — désignations contractuelles peuvent passer hors succession ; « se parler » avec testament = bon angle éducatif |
| Collective (vie / protections) | Mention OK en bullet / Ad2 — **ne pas** promettre un montant ni une continuité automatique |
| Dettes / hypothèque si revenu disparaît | Angle assurance / coussin / plan — OK tant que pas « tu dois acheter X » |
| Testament = notaire (QC) | **Correct** pour cadre notarié typique ; garder « ou RDV notaire pris » comme aujourd’hui |
| Disclaimer éducatif + titre CSF | **Obligatoire** — conserver outil + pied + ads |
| « Clarifier ≠ acheter » | Excellent pour conformité commerciale |

---

## 3. Claims risqués (copy / ads / outil)

| Claim / formulation | Risque | Correction |
|---------------------|--------|------------|
| Sortie `PDF + notaire` comme seule next step | Sous-entend que le job = juridique ; cannibalise RDV CSF **et** floute la valeur liquidité | Brancher : liquidité/bénéficiaires → 15 min CSF ; testament → notaire (+ prep) |
| H1 / soft close trop « urgences mort » | Perception alarmiste / non éducative | Garder Ad1 « plus tard » + « premiers mois » — pas de choc funéraire |
| « On règle ta succession en 15 min » | Faux + non conforme | Jamais. Copy : clarifier liquidité & bénéficiaires ; juridique = notaire |
| Impliquer que le CSF rédige / valide un testament | Exercice illégal / hors permis | Interdit. Split visuel + FAQ #1 |
| « Beneficiaires à jour = succession OK » | Incomplet (dettes, liquidité, légal) | Garder comme *une* case parmi six |
| Chiffres inventés (mois de liquidité, impôts successoraux) | Erreur / fausse précision | **Ne pas ajouter** de simulateur fiscal succession sans revue ; hors scope sprint |
| Collective « couvre ta famille » sans nuance | Sur-promesse | Garder « ce que ton assurance collective t’offre côté vie » (Ad2) — exploratoire |
| PDF présenté comme document officiel | Confusion | Titre « Résumé » + note « ne remplace pas notaire / avis juridique » |

---

## 4. Vocabulaire QC — préférer / éviter

| Préférer | Éviter |
|----------|--------|
| Conseiller en sécurité financière | « Planificateur successoral », « avocat », « on s’occupe du testament » |
| Liquidité / argent accessible | « Cash héritage garanti » |
| Bénéficiaires désignés (contrats) | « Héritiers » seul (amalgame légal) |
| Cadre légal / notaire | « On formalise chez nous » |
| Contenu éducatif | « Conseil personnalisé » sur la landing outil |
| Hypothèque / dettes | Minimiser « saisie » / peur bancaire gratuite |
| REER, CELI (droits, bénéficiaires) | Conseils de décaissement fiscal successoral détaillés sans contexte |

---

## 5. Disclaimers obligatoires (checklist ship)

- [ ] Shell outil : éducatif + **ne remplace pas un notaire ni un avis juridique**
- [ ] Bloc Scale « Rappel — vois un notaire » conservé
- [ ] Pied `CampagneAdsLanding` : titre CSF + pas conseil personnalisé
- [ ] Ads Meta : disclaimer catalogue inchangé
- [ ] PDF notes : même disclaimer notaire
- [ ] Soft close RDV : phrase explicite testament = notaire (script)
- [ ] FAQ #1 notaire conservée en tête

---

## 6. Ce qu’on ne doit **pas** promettre

1. Qu’une checklist ou un RDV CSF **remplace** un notaire.  
2. Qu’après 15 min la succession est « en ordre » ou « réglée ».  
3. Des montants d’impôt au décès, de droits successoraux, ou de liquidités minimales universelles.  
4. Qu’une collective ou une police précise paiera X $ / garantira le niveau de vie.  
5. Qu’ignorer le « plus tard » = catastrophe certaine (peur vs éducation).  
6. Un produit iA / assurance vie comme conclusion automatique des trous.

---

## 7. Rôle CSF vs notaire (référence pour script + UI)

| Sujet | CSF (15 min / suite) | Notaire |
|-------|----------------------|---------|
| Argent accessible / coussin / assurance | Oui (analyse besoins, produits si pertinents plus tard) | Non (sauf aspects légaux connexes) |
| Bénéficiaires contrats (vie, REER, CELI…) | Oui (revue, mise à jour via assureur/institution) | Peut coordonner avec succession, mais pas le seul acteur |
| Testament, mandats, cadre légal QC | Prep conversation seulement | **Oui** |
| Inventaire patrimonial simple | Aide à prioriser / clarifier | Peut s’inscrire dans dossier notarié |
| Famille informée | Coaching conversation | Hors cœur notarial |

Toute microcopy soft-close doit pouvoir se lire à voix haute devant un comité conformité sans rougir.

---

## 8. Impacts sur les 3 autres experts

| Expert | Contrainte finance |
|--------|-------------------|
| Visuel | Interdiction imagerie funéraire ; split CSF \| Notaire obligatoire avant mid |
| Script | FAQ 15 min + payant ; jamais « on remplace » ; Ad2 liquidité OK |
| Outil | Next-step branché ; disclaimer Scale ; PDF non officiel |

---

## 9. Go / No-go refonte

| Changement proposé | Go ? |
|--------------------|------|
| Soft-close RDV au climax trous avec mention notaire | **Go** |
| H1 Ad1 « Plus tard… » | **Go** |
| Portrait vide jusqu’à 1ʳᵉ coche | **Go** |
| Simulateur impôts décès / « besoin liquidité $ » | **No-go** sprint (revue dédiée) |
| CTA qui dit « Finaliser ta succession » | **No-go** |
| Retirer disclaimer notaire pour « alléger » | **No-go** |
