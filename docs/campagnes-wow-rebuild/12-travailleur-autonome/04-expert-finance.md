# [#12] Travailleur autonome — Expert finances & fiscalité (QC)

**Slug :** `/campagnes/travailleur-autonome`  
**Date :** 2026-11-04  
**Cadre :** éducatif · conseiller en sécurité financière · pas un conseil personnalisé  
**Chevauchements :** `#4` invalidité · `#8` urgence · `#11` collective (inverse employé)

---

## 1. Ce que la page peut dire (exact / prudent)

| Sujet | Formulation OK | Pourquoi |
|-------|----------------|----------|
| Absence de collective | « Pas d’assurance collective **fournie** » (par un employeur) | Fait de structure ; pas un jugement de couverture |
| Ordre filet | Liquidité → protection du revenu → proches / hypo → structure | Pédagogie de priorisation, pas une norme légale |
| Fonds d’urgence | « 3 à 6 mois de dépenses » (essentiels) ; TA souvent **plus** (revenu variable) | Fourchette classique ; FAQ peut dire « souvent plus si revenu variable » sans chiffre magique |
| Factures 3 mois | Test de liquidité **illustratif** | Pas une règle AMF / fiscale |
| Invalidité | « Remplacer **une partie** du revenu » si tu ne peux plus travailler | Jamais « 100 % du revenu » / « comme un salaire » |
| Vie / proches | Lien hypo / conjoint / enfants — « qui assume » | Besoin de capital = analyse perso |
| Comptes séparés | Clarté cash-flow perso vs entreprise | Pas un conseil fiscal / juridique de structure |
| Épargne planifiée | Montant décidé d’avance | Pas de taux de rendement, pas de véhicule imposé |
| RC | « Si mon métier l’exige » | N/A fréquent — ne pas culpabiliser |

---

## 2. Claims interdits / à corriger

| Claim risqué | Pourquoi | Remplacement |
|--------------|----------|--------------|
| « Remplacer la collective » / « mêmes protections qu’un employé » | Faux ; régimes ≠ panier perso ; conformité pub | « Assurances de ton bord, adaptées à ta situation » |
| « Tu as besoin d’une invalidité » (absolu) | Conseil personnalisé déguisé | « Regarder une protection si… » / cocher la case |
| Garantie de tenue « 3 mois sans facturer » si on suit l’outil | Promesse de résultat | « Vérifier si… tiennent » (déjà OK dans `next`) |
| Pourcentage de remplacement revenu / délai de carence chiffré sans contexte | Trop précis → conseil | Rester qualitatif sur la landing |
| « Personne n’est payé si… » façon alarmiste faux | Peur non fondée selon contrats | « Rien ne tombe **automatiquement** » (employeur) — OK |
| Assimiler CELI/REER au filet d’urgence | Liquidité vs long terme | Ne pas pousser véhicule d’épargne enregistré comme urgence ici |

**Ads :** Ad2 « y’a pas de pourcentage qui tombe en attendant » = constat collective absente — **OK** si on ne promet pas un % alternatif sur la page.

---

## 3. Points de vigilance QC / CSF

1. **Revenu net vs brut (autonome)** — toute quantification future (hors scope checklist) doit parler revenu **disponible** / net après charges, pas salaire brut employé. La checklist actuelle ne chiffre pas : **bien**.
2. **TPS/TVQ, dividendes, salaire incorpo** — hors page ; FAQ ne doit pas improviser la fiscalité. Renvoyer au RDV / spécialiste au besoin.
3. **Invalidité travailleur autonome** — souscription, définition d’invalidité, délais, exclusions : **jamais** résumés en une ligne vendeuse. Capsule Apprendre = OK ; landing = case + soft RDV.
4. **Assurance hypothécaire créancier vs vie** — ne pas confondre dans le copy « vie / proches » ; rester sur « qui assume ».
5. **Responsabilité professionnelle** — obligation selon métier / ordre ; l’outil doit permettre N/A (P1 toggles).
6. **Titre** — « conseiller en sécurité financière » uniquement ; pas « planificateur financier » si non détenteur du titre.

---

## 4. Disclaimers obligatoires

### Outil (`CampagneToolShell` disclaimer)
> Contenu éducatif seulement — pas un conseil personnalisé.

### Footer landing (existant — garder)
> Contenu éducatif et général. Titre autorisé : conseiller en sécurité financière. Ne constitue pas un conseil personnalisé. Chaque situation est unique.

### Renforcement recommandé (1 phrase, footer ou intro outil)
> Les cases et l’ordre sont illustratifs. Montants, priorités et produits dépendent de ton revenu net et de ta situation personnelle.

### Ads — commentaire épinglé
> Contenu éducatif. Titre : conseiller en sécurité financière. Pas un conseil personnalisé.

### PDF notes
Garder éducatif + collective absente **une fois** ; ajouter :  
`Apporte ce résumé aux 15 min si tu veux — ce n’est pas une analyse sur mesure.`

---

## 5. Validation copy script / outil (checklist finance)

| Élément | Verdict | Note |
|---------|---------|------|
| H1 collective fournie | ✅ | Exact |
| Promise revenu variable + collective | ✅ | Pas de claim produit |
| Soft close « Clarifier ≠ acheter » | ✅ | Réduit pression vente |
| « Si un mois est mauvais, rien ne tombe automatiquement » | ✅ | Ancré absence filet employeur |
| « Remplacer une partie du revenu » (invalidité) | ✅ | Garder « une partie » |
| FAQ « mêmes protections » | ✅ si reformulé « pas remplacer la collective » | Script §3 FAQ1 |
| Capsule urgence en primaire | ✅ | Aligné trou liquidité #1 |
| 3–6 mois urgence | ✅ | Fourchette ; FAQ variable OK |
| Ordre liquidité→revenu | ✅ pédagogique | Pas une règle absolue — dire « souvent » en FAQ |

---

## 6. Risques conformité résiduels post-refonte

| Risque | Mitigation |
|--------|------------|
| Soft CTA « Clarifier : Protection du revenu » perçu comme pitch invalidité | Microcopy Clarifier ≠ acheter + disclaimer ; ne pas préremplir un produit |
| PDF « résumé filet » pris pour plan CSF | Notes PDF + « pas une analyse sur mesure » |
| Confusion avec campagne collective (#11) | Ancre « fournie » / « ton propre boss » ; ne pas parler « trous de la collective employeur » |
| Overclaim Ad vs page | Hero outil-first = cohérence Ad3 ; pas de nouveau claim chiffre |

---

## 7. Ce qu’on ne promet **pas**

- Un filet « complet » équivalent employé  
- Un montant d’urgence ou de capital vie calculé sur la page  
- Une admissibilité invalidité / RC  
- Un conseil fiscal (incorpo, dividendes, dépenses d’entreprise)  
- Qu’un RDV de 15 min = analyse complète ou recommandation de produit  

---

## 8. Verdict finance

La checklist TA est **saine** tant qu’elle reste qualitative (cases + ordre). La refonte WOW (mois mauvais, soft RDV nommé) **améliore** l’alignement émotionnel **sans** ajouter de claims chiffrés risqués — à condition de :

1. Garder « une partie du revenu » (invalidité)  
2. FAQ anti-« remplacer la collective »  
3. Disclaimer revenu net / situation perso  
4. Toggles N/A vie/RC (P1) pour ne pas inventer des trous  

**OK à shipper** avec les textes du script + disclaimers ci-dessus.
