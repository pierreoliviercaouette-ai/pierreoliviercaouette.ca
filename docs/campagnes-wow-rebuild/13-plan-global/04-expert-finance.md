# [#13] Plan global — Expert finances & fiscalité (QC)

**Slug :** `/campagnes/plan-global`  
**Date :** 2026-11-04  
**Périmètre :** hub éducatif d’**ordre de priorités** (pas un calculateur de plafonds).  
**Titre professionnel affiché :** conseiller en sécurité financière

---

## Verdict conformité

Peu de chiffres fiscaux sur cette page — le risque n’est **pas** un plafond CELI/REER erroné, c’est le **claim implicite de plan personnalisé** et des formulations qui sonnent comme un conseil d’allocation. L’ordre `PRIORITY_IDS` (filet → dettes chères → revenu → hypo/vie → épargne → projet → succession) est une **pédagogie classique de priorisation**, acceptable si toujours cadré « illustration / brouillon éducatif ». Deep-links vers campagnes filles = OK **uniquement** avec libellés éducatifs (pas « souscris », pas « ta solution »).

---

## 1. Exactitude du modèle d’ordre (pédagogie)

| Étape `PRIORITY_IDS` | Lecture finance | OK si… |
|----------------------|-----------------|--------|
| Filet d’urgence | Liquidité avant optimisation | Pas présenté comme règle absolue pour tous |
| Dettes chères | Coût d’intérêt élevé vs rendement espéré | Garder formulations « souvent », pas « toujours bat le marché » |
| Protection revenu | Salaire = actif central | Pas de montant de rente / % de remplacement promis |
| Vie / hypo | Transmission + dette | Pas de comparaison tarifaire ici (renvoi éducatif hypo OK) |
| Épargne ordre | REER / CELI / cash selon contexte | Ne pas figer « toujours CELI avant REER » dans le hub |
| Projet < 5 ans | Horizon → liquidité / risque | OK pédagogique |
| Succession | Bénéficiaires / liquidité | CSF ≠ notaire — ne pas promettre règlement successoral |

**Verdict :** logique **retenable** pour un outil éducatif QC grand public. Ne pas ajouter de % d’intérêt, de taux de rendement, ni de montants $ dans ce hub (le WOW = rang, pas écart monétaire).

---

## 2. Claims copy / ads — validation

| Claim (source) | Statut | Correction si besoin |
|----------------|--------|----------------------|
| Des produits ≠ un plan / tiroir ≠ feuille de route | OK | — |
| Urgent / important / plus tard | OK si UI aligne | Livrer paliers (sinon pub trompeuse) |
| « Chaque dollar d’intérêt évité bat souvent un placement moyen » (`why` dettes) | OK avec **souvent** | Ne pas durcir en « bat toujours » |
| « Sans coussin, un imprévu force souvent la carte » | OK | — |
| Soft close « ancrer ton n°1 » / 15 min exploratoire | OK | Pas « on te bâtit ton plan en 15 min » |
| Ad3 « vision globale sans RDV d’abord » | OK | Landing doit rester outil-first |
| « Plan personnalisé », « plan sur mesure automatisé », « ta stratégie optimale » | **Interdit** | FAQ + disclaimer explicites |

### Ads (`emails/campagne-meta-catalog/plan-global.md`)
Disclaimer ads actuel : **conforme** (éducatif, CSF, pas conseil perso, pas plan sur mesure). Aucun chiffre fiscal à mettre à jour pour 2026 sur ce fichier.

---

## 3. Disclaimers obligatoires (garder / coller)

### Outil (`PlanGlobalTool` intro + disclaimer)
> Illustration éducative seulement — pas un conseil personnalisé. Des produits côte à côte ≠ une feuille de route.

### Landing (bas de page — pattern catalogue)
> Contenu éducatif et général. Titre autorisé : conseiller en sécurité financière. Ne constitue pas un conseil personnalisé. Chaque situation est unique.

### PDF notes
> Illustration éducative seulement — pas un conseil personnalisé. Des produits ouverts ne font pas un plan.

### Deep-link caption
> Approfondir ce point (éducatif) — pas un conseil personnalisé.

### Soft close
Toujours : **exploratoire / soft / zéro pitch** — jamais « je te recommande ce produit ».

---

## 4. Ce qu’on ne doit **pas** promettre

1. Un **plan financier personnalisé** généré par l’outil  
2. Une **allocation** REER/CELI/cash définitive sans analyse  
3. Un **rendement**, un taux d’intérêt évité chiffré, ou un « gain » $  
4. Une **souscription** assurance / placement depuis le hub  
5. Que le RDV de 15 min = livraison d’un plan complet  
6. Que le conseiller **remplace le notaire** (succession)  
7. Que l’ordre affiché est **le** bon ordre pour ce prospect (c’est une grille éducative)

---

## 5. Deep-links filles — cadre

| Cible | Risque | Garde-fou |
|-------|--------|-----------|
| `/campagnes/fonds-urgence` | Calculateur $ | Label « Calculer mon filet » + disclaimer fille |
| `/campagnes/assurance-invalidite` | Trou de revenu | « Estimer » / éducatif — pas « assurer mon salaire » |
| `/campagnes/hypotheque-assurance-vie` | Banque vs famille | « Comparer » éducatif |
| `/campagnes/retraite-reer-celi` | Ordre épargne | Pas « maximise ton REER maintenant » |
| `/campagnes/celiapp` | 1ʳᵉ propriété seulement | Label doit dire **1ʳᵉ prop.** — sinon retirer le lien si projetCourt ≠ housing |
| `/campagnes/succession-bases` | Notaire | CSF vs notaire déjà dans audit #14 — ne pas promettre actes |

**Note CELIAPP :** `projetCourt` = « gros projet < 5 ans » ≠ toujours première propriété. Si le lien CELIAPP reste, le label **doit** restreindre (« si 1ʳᵉ propriété ») ; sinon **omettre** le deep-link pour `projetCourt` (recommandation finance : omettre ou label conditionnel).

**Recommandation finale :** omettre deep-link `projetCourt` → CELIAPP (trop de faux positifs), ou n’afficher le lien que si on ajoute plus tard une sous-question « 1ʳᵉ propriété ? ». Pour le sprint P0 : **pas de lien** sur `projetCourt`.

---

## 6. Vocabulaire QC à respecter

| Terme | Usage |
|-------|-------|
| Conseiller en sécurité financière | Titre / confiance |
| REER, CELI | OK ; pas de plafonds 2026 sur cette page |
| CELIAPP | Seulement si contexte 1ʳᵉ prop. explicite |
| Collective | Mention ads OK ; pas de claim de couverture ici |
| Brouillon / illustration / éducatif | Obligatoire autour de « ordre » / « plan » |

Plafonds 2026 (CELI, REER, CELIAPP, SCEE) : **hors scope** de ce hub — valider sur les landings filles au besoin.

---

## 7. Checklist avant ship

- [ ] Aucun « plan personnalisé / sur mesure » dans UI, PDF, ads, soft close  
- [ ] Disclaimer outil + page + PDF présents  
- [ ] FAQ « pas un plan perso » + « outil seul suffit »  
- [ ] Soft close = exploratoire, pas vente de pile  
- [ ] Deep-links : libellés éducatifs ; `projetCourt` sans CELIAPP (ou label conditionnel)  
- [ ] `why` dettes conserve « souvent »  
- [ ] PDF accents FR (qualité / professionnalisme — pas un enjeu fiscal, mais signal confiance)

---

## Risque résiduel

**Moyen-faible** si les disclaimers et la FAQ sont livrés avec le soft-close. **Élevé** si on monétise le n°1 avec une formulation du type « ton plan est prêt — book pour souscrire ». Le PM doit faire relire le soft-close final (1 phrase) avant merge.
