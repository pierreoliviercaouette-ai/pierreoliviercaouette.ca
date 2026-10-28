# Rapport d’audit conformité — modules Apprendre

**Date :** 28 octobre 2026  
**Périmètre :** contenu éducatif `/apprendre` (28 modules)  
**Méthode :** grille `frontend/src/data/apprendre/COMPLIANCE_BRIEF.md` — **aucune correction appliquée**  
**Statut :** complet — 28 modules audités, **aucune correction appliquée**

Sévérités : `critique` | `majeur` | `mineur` | `à confirmer`

---

## Points transversaux (UI / site)

- `[mineur] Disclaimer page` — « Information générale à titre éducatif — pas un conseil personnalisé. » (`ApprendreDetail.jsx`, bas d’article, typo discrète) — Présence OK ; confirmer si la discrétion visuelle suffit pour modules avancés (PFI, gel, MG partagée, fiscalité SPCC).
- `[à confirmer] Graphiques / timelines` — Montants ($) sans bandeau « illustratif » collé au chart — Valider si le caractère pédagogique doit être répété près des chiffres.
- `[mineur] Liens services` — `relatedServiceIds` depuis modules stratégies avancées — Cohérence commerciale / divulgation (tunnel vers offre).

---

## Lot A — Comptes et enveloppes

### fonds-urgence

- `[mineur] Nature` — « Évitez d’immobiliser… », « Traitez-le comme une facture » — ton directif.
- `[mineur] Garanties` — CPG rachetable / compte accessible sans conditions ni SADC.
- `[à confirmer] Disclaimer` — surtout en commentaire de fichier ; confirmer couverture UI.

### celi

- `[majeur] Chiffres` — plafond 7 000 $ pour 2024–2026 — valider ARC année courante.
- `[mineur] Sources` — page iA plafonds — sur-reliance marketing possible.
- `[à confirmer] Fiscalité` — « n’augmente pas… plusieurs prestations fondées sur le revenu » — formulation large.
- `[mineur] Nature` — bullets « Ne recontribuez pas… », « Retirez tout surplus… » — prescription fiscale générique.

### celiapp

- `[majeur] Comparaisons` — « Le CELIAPP est plus puissant pour une mise de fonds si vous êtes admissible ».
- `[mineur] Nature` — « Pensez au CELIAPP si… Sinon, maximisez plutôt… » — recommandation générique.
- `[à confirmer] Chiffres` — 8 000 $ / 40 000 $ non indexés — reconfirmer ARC.
- `[à confirmer] Fiscalité` — conditions typiques de retrait admissible (1er octobre, 30 jours, etc.).

### reee

- `[majeur] Chiffres` — SCEE 20 % / 7 200 $, IQEE 10 % / 250–500 $ / 3 600 $ — montants sans millésime clair dans le corps.
- `[mineur] Nature` — « Ordre utile : d’abord viser les cotisations qui maximisent les subventions… ».
- `[mineur] Comparaisons` — « Surcotiser hors subvention a encore un intérêt fiscal ».
- `[à confirmer] Fiscalité` — issues si études n’ont pas lieu (PAE / RPE / transfert REER) condensées.

### reer-ferr

- `[majeur] Chiffres` — facteur FERR prescrit 5,28 % à 71 ans — valider tableau ARC.
- `[mineur] Fiscalité` — pénalité surplus sans mention marge 2 000 $ REER.
- `[mineur] Sources` — pages produit ia.ca REER/FERR.
- `[à confirmer] Nature` — « Choisissez l’année de déduction selon votre taux marginal ».

### retraite-publique

- `[majeur] Nature` — pas de disclaimer explicite « éducatif ≠ conseil » dans le corps.
- `[majeur] Chiffres` — facteurs 0,6 % / 0,7 % par mois → ≈ 36 % / ≈ 42 % — simplifiés, non datés.
- `[mineur] Sources` — SRG cité sans source dédiée.
- `[mineur] Nature` — « Demander tôt n’est pas une erreur si… » — ton de conseil.
- `[à confirmer] Fiscalité` — récupération SV + CELI « en principe non ».

### fonds-pensions

- `[majeur] Comparaisons` — Alex 42 000 $ vs Sam ≈ 21 260 $ ; « ~2× plus côté PD » — risque « RRPD bat toujours ».
- `[mineur] Rendements` — 5 % net et retrait 4 % — hypothèses fortes.
- `[mineur] Nature` — « Au départ : comparez… avant tout transfert hors RRPD ».
- `[à confirmer] Chiffres` — acquisition immédiate rente différée Qc depuis 2001.
- `[à confirmer] Fiscalité` — plafond de transfert REER/FERR pour RRPD — simplification.

---

## Lot B — Placements et véhicules

### non-enregistre

- `[majeur] Fiscalité` — « Inclusion de 50 % (en vigueur en 2026) » — confirmer exactitude pour toute la période de publication.
- `[majeur] Fiscalité` — intérêts « dès qu’ils sont gagnés » même sans feuillet — moment d’inclusion.
- `[mineur] Illustrations` — taux 37 % + libellé « avantage » — peut se lire comme recommandation.
- `[mineur] Nature` — « On utilise souvent d’abord les régimes enregistrés… » — soft-ordre.
- `[mineur] Sources` — Cabinet du PM (21 mars 2025) vs guides ARC/RQ.

### decaissement-retraite

- `[majeur] Comparaisons` — CELI 8 000 $ vs REER ≈ 11 430 $ ; « Si le CELI suffit… » — ordre de décaissement apparent.
- `[majeur] Nature` — « Des retraits REER ou FERR… seulement si une tranche… le justifie ».
- `[majeur] Chiffres` — récupération SV sans seuils / année / « vérifiez ».
- `[mineur] Fiscalité` — conversion REER→FERR sans contrainte d’âge (71 ans).
- `[mineur] Sources` — couverture documentaire mince pour un sujet large.

### actions-dividendes

- `[majeur] Fiscalité` — dividendes en CELI/REER « en général pas d’impôt courant » — omet retenue étrangère (ex. US) souvent non récupérable en CELI.
- `[mineur] Nature` — « Diversifier… limite l’effet » — conseil générique.
- `[mineur] Illustrations` — scénario Camille uniquement haussier.
- `[à confirmer] Fiscalité` — majoration + crédit sans taux (qualitatif).

### obligations

- `[mineur] Garanties` — CPG vs protection des dépôts — aligner avec `cpg-pglm` (SADC/AMF).
- `[mineur] Illustrations` — courbe qui revient au nominal — peut suggérer un retour « automatique ».
- `[à confirmer] Sources` — IQPF Guide des compétences en source grand public.

### fonds-communs

- `[majeur] Réglementation` — « votre représentant doit vous remettre l’aperçu du fonds » — valider libellé (qui, quand, exceptions).
- `[mineur] Comparaisons` — « Beaucoup de FNB… RFG plus bas ».
- `[mineur] Illustrations` — soustraction RFG sur 5 % brut — méthode pédagogique vs officielle.
- `[mineur] Nature` — « La gestion est souvent active » — généralisation marché.

### fnb

- `[majeur] Comparaisons` — « frais typiquement plus bas » + graphique 0,20 % vs 1,50 % — risque « FNB bat toujours sur les frais ».
- `[à confirmer] Produits` — levier / inverse « investisseurs avertis » — suffisant ?

### fonds-distincts

- `[majeur] Sources` — 2/4 = pages iA — sur-reliance fabricant.
- `[majeur] Succession` — prestation au bénéficiaire « peut simplifier le règlement » — nuances Qc (créanciers, fiscalité).
- `[majeur] Garanties` — 75/100 bien qualifié ; confirmer limites (dépôts, reset, retraits partiels).
- `[mineur] Assurance` — peu sur exclusions / âge.
- `[à confirmer] Distribution` — pas de rappel représentant autorisé / Assuris.

### cpg-pglm

- `[majeur] Chiffres` — plafond protection dépôts 100 000 $ (2026) — confirmer SADC **et** AMF Qc (catégories, intérêts).
- `[majeur] Garanties` — PGLM « capital souvent remboursé… à l’échéance » — « souvent » vs variantes.
- `[mineur] Ton` — « le rendement est connu à l’avance — c’est la force du produit ».
- `[à confirmer] Terminologie` — PGLM = CPG lié au marché.
- `[à confirmer] Billets à capital protégé` — solvabilité émetteur vs dépôt assurable.

---

## Lot D — Entreprise / stratégies avancées

### fiscalite-epargne-corpo

- `[majeur] Fiscalité` — « taux corporatif nettement plus élevé (environ 50 % combiné au Québec hors dividendes canadiens — à vérifier chaque année) » — Valider le % et la formulation.
- `[majeur] IMRTD` — « fardeau corporatif net se rapproche alors d’environ 19,5 % » — Valider source/année ; chiffre peut-être trop figé.
- `[majeur] Exemple` — intérêts 1 000 $ → ≈ 50 % (~502 $), dont ~307 $ crédités à l’IMRTD (+ quiz) — Valider le calcul.
- `[mineur] Ton` — « Remplir des droits sous-utilisés bat souvent… » ; « Un ordre utile… » — Proche d’un conseil de déploiement.
- `[à confirmer] KeyFacts` — « Société + particulier ≈ un seul fardeau » — Simplification de l’intégration.
- `[mineur] Disclaimer` — Peu de rappel « pas un conseil » hors intro d’exemple — Suffisant pour audience `prive` ?

### protections-corpo

- `[majeur] Fiscalité vie / CDC` — prestation « généralement non imposable » ; CDC ; exemple « 1 000 000 $ en franchise d’impôt » — Valider « franchise » et formulation absolue.
- `[majeur] Frais généraux` — primes déductibles / prestations imposables si remboursement limité aux frais — Règle sensible (bulletin RQ) ; valider le résumé.
- `[à confirmer] MG corporative` — « hors revenu mais sans CDC » — Confirmer « typiquement ».
- `[mineur] Sources` — 2 URLs iA + AMF/IQPF/RQ — Sur-reliance marketing iA.
- `[à confirmer] Exemple 50/50` — Rachat + CDC sans autres effets fiscaux du rachat — Risque de sous-estimer la complexité.

### convention-actionnaires

- `[majeur] Sources` — Une seule source AMF — Couverture documentaire mince pour enjeu CEA.
- `[mineur] Fiscalité CDC` — « facilit[er] une sortie plus efficace » — Implication d’avantage.
- `[mineur] Ton` — « souvent, obligation de maintenir une assurance » — Peut se lire comme règle universelle.
- `[à confirmer] Structures` — Cross-purchase vs corporatif sans risques fiscaux différentiels détaillés.

### gel-successoral

- `[critique] Illustration fiscale` — « financer l’impôt sur ~3 000 000 $ (votre gel) » / timeline — Peut laisser croire que l’impôt porte sur le montant figé entier (sans ACB/gain) — **priorité validation**.
- `[majeur] Sources` — Une URL ARC générique « sociétés » — Peu adaptée au gel / réorg.
- `[majeur] Complexité` — Exemple lisse vs risques (évaluation JVM, attribution, etc.).
- `[à confirmer] Mécanique` — Ordinaires → préférentielles — Valider qu’aucune méthode n’est présentée comme unique.

### vie-categorie-actif

- `[majeur] Illustrations` — VR ~65 k$ / ~330 k$ ; capital ~240 k$ / ~920 k$ + graphique — Valider si trop proche d’une cotation malgré libellés « non garanti ».
- `[mineur] Sources` — Cadre iA « assurance comme catégorie d’actif » — Pondération marketing.
- `[à confirmer] Garanties` — Distinction VR/capital garantis vs illustrés — Confirmer exhaustivité pour audience privée.

### mg-propriete-partagee

- `[majeur] Fiscalité JVM` — « Chaque partie doit … payer la JVM » — Valider par fiscaliste.
- `[majeur] Prestation MG / CDC` — « généralement non imposable » ; « n’alimente pas le CDC ».
- `[majeur] RP` — Alex 122 400 $ = primes cumulées « sans intérêts » — Montant et traitement fiscal du scénario.
- `[à confirmer] Qualification Qc` — « généralement classés comme assurance accident et maladie ».
- `[mineur] Sources` — iA + lettre ARC via taxinterpretations.com (tiers).

### pfi-participative

- `[critique] Levier illustré` — LTV 90 % × VR illustrée → ~378 k$ ; intérêts 6 %/9 % — Valider si crée une attente irréaliste côté prêteurs.
- `[majeur] Fiscalité` — Déductibilité conditionnelle / CDC « jamais automatiques » — Niveau de détail à valider.
- `[majeur] Sources` — Guides PFI iA — Contenu calé sur matériel promoteur.
- `[à confirmer] SEO / KeyFacts` — « Levier sur une assurance vie participative » vs ton défensif du corps.

---

## Lot C — Assurances personnelles + succession

### assurance-collective

- `[majeur] Disclaimer` — pas de « éducatif ≠ conseil » dans le contenu visible (hors exemple).
- `[majeur] Fiscalité invalidité` — employeur paie → prestations souvent imposables ; primes déjà imposées → souvent non — régimes mixtes à valider.
- `[majeur] Fiscalité vie collective` — capital-décès « en général libre d’impôt » — exceptions / créanciers.
- `[mineur] Sources` — une seule URL AMF générique.
- `[mineur] Exclusions` — peu sur exclusions / coordination.
- `[à confirmer] Ton` — « temporaire individuelle en complément » / diagramme « Compléter » — recommandation produit possible.
- `[mineur] Illustration` — net ≈ 3 000 $ sur 4 000 $ bruts — taux implicite.

### assurance-vie-temporaire

- `[majeur] Sources` — pages iA à côté AMF/IQPF — pondération marketing.
- `[mineur] Nature` — disclaimer surtout dans le `result` ; sections instructionnelles (« Alignez… », « Demandez-vous… »).
- `[mineur] Méthode capital` — 95 000 $ × 12 = 1 140 000 $ (brut, sans net/impôt).
- `[mineur] KeyFact` — « Aucun — protection pure » vs avenants possibles (ex. remboursement de primes).

### assurance-vie-permanente

- `[majeur] Sources` — pages iA (participation / vie clarifiée).
- `[majeur] Ton` — « Achetez sur les garanties écrites… » — incitation à l’achat.
- `[mineur] Garanties` — 5 500 $/an × 20 puis « plus de primes de base » — conditions de libération peu explicitées.
- `[à confirmer] Fiscalité` — prestation libre d’impôt / rachat imposable — silence propriété corporative.
- `[à confirmer] Public` — `particulier` + `prive` + liens PFI / catégorie d’actif.

### assurance-maladie-grave

- `[majeur] Sources` — pages iA maladie grave / critères.
- `[mineur] Fiscalité` — silence sur traitement fiscal du capital forfaitaire.
- `[à confirmer] Délais` — survie « souvent ~30 jours » — non daté dans le paragraphe.
- `[à confirmer] RP` — « option tarifée » vs attentes client sur remboursement de primes.

### assurance-invalidite

- `[majeur] Fiscalité` — primes employeur/syndicat → prestations imposables ; 100 % assuré → non — mixtes / T4 à valider.
- `[mineur] Disclaimer` — absent du corps (hors illustration).
- `[à confirmer] Ordres de grandeur` — ~2/3, 2 ans, âge 65, impôt d’exemple 25 %.
- `[mineur] Régimes publics` — AE, RRQ, CNESST, SAAQ — liste abrégée.
- `[mineur] Ton` — individuelle « viserait typiquement cet écart ».

### succession-bases

- `[critique] Fiscalité / bénéficiaires` — amalgame assurance vie + REER/FERR « hors succession » sans distinguer l’impôt au décès du rentier (sauf roulement) — **priorité validation**.
- `[majeur] Exemple` — impôts latents évoqués mais non chiffrés — sous-estimation possible du trou.
- `[majeur] Sources` — Éducaloi + AMF vie seulement — manque source fiscale / notariale.
- `[mineur] Nature` — « Pas un avis notarial ou fiscal » OK ; bullets orientés assurance vie.
- `[à confirmer] Actif-dette` — maison 450 k$ / hypothèque 180 k$ — risque de lecture en double comptage.

---

## Synthèse — points à valider en priorité

### Critique (3)

1. **`succession-bases`** — bénéficiaire REER/FERR présenté comme « hors succession » au même titre que l’assurance vie, sans l’impôt au décès.
2. **`gel-successoral`** — formulation « impôt sur ~3 000 000 $ (votre gel) » (confusion montant figé vs gain imposable).
3. **`pfi-participative`** — LTV 90 % sur VR illustrée (attente prêteur / levier).

### Majeur — chiffres réglementaires

- CELI plafond 7 000 $ (2024–2026) ; CELIAPP 8 000 $ / 40 000 $
- FERR facteur 5,28 % (71 ans)
- Inclusion des gains en capital 50 % (2026)
- SADC / AMF protection des dépôts 100 000 $ (2026)
- SCEE / IQEE (millésime)
- Facteurs RRQ 0,6 % / 0,7 % (non datés)
- IMRTD ~19,5 % et taux corpo ~50 % (`fiscalite-epargne-corpo`)

### Majeur — ton / comparaisons

- CELIAPP « plus puissant » ; décaissement CELI vs REER ; RRPD ~2× RRCD ; FNB frais « typiquement plus bas »
- Vie permanente : « Achetez sur les garanties… »
- Collective : complément temporaire individuelle

### Majeur — fiscalité / assurance / sources

- Dividendes en régime (retenue étrangère) ; CDC / « franchise d’impôt » ; JVM MG partagée ; RP 122 400 $
- Invalidité / collective : imposition selon payeur de prime
- Aperçu du fonds « doit » être remis
- Fonds distincts : effets successoraux + sources iA
- Sources souvent iA-heavy (vie, MG, distincts, PFI) ou trop minces (CEA, gel, succession)

### Transversal UI

- Disclaimer page présent mais discret — confirmer suffisance pour modules avancés
- Charts sans bandeau « illustratif » local
- Tunnel `relatedServiceIds` vers l’offre

---

---

## Décisions post-audit (corrections seulement si 100 % nécessaires)

Règle : `COMPLIANCE_FIX_BRIEF.md` — **CONFORME** / **NON_NECESSAIRE** = aucun changement ; **CORRECTION_REQUISE** = correctif minimal.

### pfi-participative

| Point | Verdict | Action |
|-------|---------|--------|
| LTV 90 % illustré | CONFORME | Aucune |
| Fiscalité déductibilité / CDC | CONFORME | Aucune |
| Sources iA | NON_NECESSAIRE | Aucune |
| SEO / KeyFacts « Levier… » | NON_NECESSAIRE | Aucune |

### gel-successoral

| Point | Verdict | Action |
|-------|---------|--------|
| Impôt sur ~3 M$ (confusion montant vs gain) | CORRECTION_REQUISE | Corrigé : impôt sur **gain = valeur figée − ACB** |
| Sources ARC génériques | NON_NECESSAIRE | Aucune |
| Complexité / exemple lisse | NON_NECESSAIRE | Aucune |
| Mécanique ordinaires → préf. | CONFORME | Aucune |

### succession-bases

| Point | Verdict | Action |
|-------|---------|--------|
| Amalgame AV + REER/FERR « hors succession » | CORRECTION_REQUISE | Corrigé : impôt au décès du rentier (sauf roulement) |
| Exemple impôts latents non chiffrés | NON_NECESSAIRE | Aucune |
| Sources fiscales / notariales | NON_NECESSAIRE | Aucune |
| Actif-dette maison / hypothèque | CONFORME | Aucune |

### assurance (lot)

| Module / point | Verdict | Action |
|----------------|---------|--------|
| collective — disclaimer corps | NON_NECESSAIRE | Aucune |
| collective — fiscalité invalidité / vie | CONFORME | Aucune |
| vie-temporaire — sources iA | NON_NECESSAIRE | Aucune |
| vie-permanente — sources iA | NON_NECESSAIRE | Aucune |
| vie-permanente — « Achetez sur… » | CORRECTION_REQUISE | → « Appuyez-vous sur les garanties… » |
| maladie-grave — sources iA | NON_NECESSAIRE | Aucune |
| invalidité — fiscalité payeur de prime | CONFORME | Aucune |

### corpo (lot)

| Module / point | Verdict | Action |
|----------------|---------|--------|
| fiscalite-epargne-corpo — ≈50 % / ≈19,5 % / IMRTD | CONFORME | Aucune |
| protections-corpo — CDC / franchise / frais généraux | CONFORME | Aucune |
| convention-actionnaires — sources | NON_NECESSAIRE | Aucune |
| vie-categorie-actif — illustrations | CONFORME | Aucune |
| mg-propriete-partagee — JVM / CDC / RP | CONFORME | Aucune |

### épargne — chiffres (lot)

| Module / point | Verdict | Action |
|----------------|---------|--------|
| celi — plafond 7 000 $ | CONFORME | Aucune |
| celiapp — 8 000 $ / 40 000 $ | CONFORME | Aucune |
| celiapp — « plus puissant » | CONFORME | Aucune |
| reee — SCEE/IQEE millésime | NON_NECESSAIRE | Aucune |
| reer-ferr — facteur 5,28 % | CONFORME | Aucune |
| retraite-publique — facteurs anticipé/report | CORRECTION_REQUISE | Anticipé : fourchette **0,5–0,6 %** (~30–36 %) |
| retraite-publique — disclaimer corps | NON_NECESSAIRE | Aucune |

### placements (lot)

| Module / point | Verdict | Action |
|----------------|---------|--------|
| non-enregistre — inclusion 50 % / intérêts | CONFORME | Aucune |
| decaissement — ordre CELI / « seulement si » / SV | CORRECTION_REQUISE | Reformulé illustration + seuils SV « vérifiez » |
| actions-dividendes — retenue étrangère | CORRECTION_REQUISE | Caveat CELI/REER (ex. US) |
| fonds-communs — aperçu « doit » | CONFORME | Aucune |
| fnb — frais « typiquement plus bas » | CORRECTION_REQUISE | Nuancé : souvent vs fonds actifs |
| fonds-distincts — sources / succession / garanties | NON_NECESSAIRE / CONFORME | Aucune |
| cpg-pglm — SADC 100 k$ / capital PGLM | CONFORME | Aucune |
| fonds-pensions — RRPD ~2× | CORRECTION_REQUISE | Borné à « dans l’exemple » |

---

## Bilan des corrections appliquées (minimales)

1. `gel-successoral` — impôt = gain − ACB  
2. `succession-bases` — REER/FERR ≠ AV au plan fiscal au décès  
3. `assurance-vie-permanente` — « Achetez » → « Appuyez-vous »  
4. `retraite-publique` — réduction anticipée 0,5–0,6 %  
5. `decaissement-retraite` — ordre CELI / « seulement si » / SV  
6. `actions-dividendes` — retenue étrangère  
7. `fnb` — frais non absolus  
8. `fonds-pensions` — écart RRPD borné à l’exemple  

**Non corrigé (volontairement) :** PFI LTV 90 %, sources iA, disclaimers corps, graphiques sans bandeau, la plupart des tons / « à confirmer ».

*Fin du cycle décisions conformité.*
