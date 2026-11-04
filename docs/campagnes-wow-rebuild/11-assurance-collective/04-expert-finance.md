# [#11] Expert finances & fiscalité QC — Assurance collective (employé)

**Slug :** `/campagnes/assurance-collective`  
**Périmètre :** employé·e Québec, lecture de livret RH — **pas** conception de régime PME / MRa `#15`  
**Date :** 2026-11-04  
**Sources :** outil + ads + capsule `frontend/src/data/apprendre/modules/assurance-collective.js` + audit marketing

---

## 1. Verdict conformité

La page est **globalement éducative** et correctement cadrée (« livret prime », disclaimer outil). Risques principaux = **claims implicites de couverture**, jargon mal expliqué (paliers / définition), et **glissement sémantique** vers vente de produits ou offre PME.

**Note conformité copy+outil /10 :** 7.5 (contenu OK ; soft close et H1 à verrouiller)

---

## 2. Vocabulaire exact (québécois / industrie)

| Terme UI / copy | OK ? | Note |
|-----------------|------|------|
| Assurance collective | Oui | Préférer à « la collective » seul en hero |
| Livret / brochure / PDF RH | Oui | Document du régime ; prime sur la carte |
| Invalidité courte / longue durée (paliers) | Oui | Expliquer en langage clair (court terme / long terme) |
| Délai d’attente / carence | Oui | Hint outil OK (« délai d’attente » ou « carence ») |
| Définition « propre métier » vs « toute occupation » | Oui | Labels outil OK ; rester descriptif |
| Conversion à la fin d’emploi | Oui | Option fréquente, **pas garantie** — copy doit dire « parfois / selon le livret » |
| Maladie grave (dans collective) | Oui en chip | Présence variable ; « Je ne sais pas » = bon défaut |
| Plafond $/mois invalidité | Oui | Critique : % seul trompe si plafond bas |
| Prestations imposables / non | Sensible | Capsule Apprendre OK ; **ne pas** trancher dans l’outil sans qui paie la prime |
| « T’es couvert » | **Non** | Claim interdit |
| Complément individuel | Oui si prudent | « Combler un trou » ≠ « tu dois acheter » |

---

## 3. Claims risqués → reformulations

| Claim risqué (à éviter) | Reformulation safe |
|-------------------------|-------------------|
| Ton assurance collective te couvre pour vrai | *…te couvre… vraiment ?* (question) / *ce que ton livret dit vraiment* |
| Tu es bien protégé avec ta carte | *La carte donne accès ; les % et délais sont dans le livret* |
| On te trouve la bonne assurance | *On démêle les cases floues — clarifier ≠ acheter* |
| Tous les régimes ont des paliers | *Souvent / beaucoup de livrets* (Ad2 déjà prudent) |
| Si tu quittes, tout s’arrête toujours | *Suit rarement* / options du livret (cesse / conversion / partielle) |
| Doubler = inutile à 100 % | *On regarde les trous — pas empiler pour empiler* |
| 15 min = analyse complète / conseil | *15 min pour clarifier les cases — pas un conseil personnalisé* |
| Prestation nette garantie | Pas de chiffre net dans cet outil (renvoyer `#04` si trou $) |

---

## 4. Chiffres & plafonds — règles pour cet outil

Cet outil est une **grille de saisie**, pas un calculateur de trou.

- **Ne pas** inventer de % par défaut (60, 70…) comme vérité — placeholders UI OK s’ils sont clairement des exemples.
- **Ne pas** afficher un « filet net » ou un trou $ ici (évite collision avec `#04` Invalidité).
- Si chip **plafond $/mois** : libellé *« Plafond mensuel noté dans le livret (si indiqué) »* — pas « ton vrai filet ».
- Fiscalité (employeur paie la prime → prestations souvent imposables) : **FAQ ou capsule Apprendre seulement**, pas un claim absolu dans le soft close.
- Capital vie : multiple du salaire ou montant fixe — UI déjà en $ ; hint « ex. 100 000 $ ou 2× salaire » OK comme illustration.

**Exemple pédagogique (capsule) :** plafond 4 000 $ bruts / besoin ménage — rester sur `/apprendre/assurance-collective`, pas sur la landing ads.

---

## 5. Disclaimers obligatoires

### Outil (`CampagneToolShell` disclaimer)
> Contenu éducatif seulement — pas un conseil personnalisé. Cet outil est une grille simplifiée : ton livret peut prévoir plusieurs paliers d’invalidité, des plafonds ou des définitions plus fines. Le livret prime toujours.

### Landing (footer site existant)
Garder le bloc légal site. SEO description : mentionner éducatif + Victoriaville + titre CSF.

### Soft close RDV
Toujours appairer émotion + filet conformité :
> … Clarifier, c’est pas acheter.

### Ads
Disclaimer catalogue existant — conserver. Pas de promesse de remboursement, d’acceptation médicale, ou de maintien de garantie hors emploi.

---

## 6. Ce qu’on ne doit **pas** promettre

1. Qu’ouvrir le livret = être « correctement » assuré  
2. Qu’un complément individuel est nécessaire (seulement : repérer les trous)  
3. Des délais de carence « standards » présentés comme universels (90/120 = exemples)  
4. Conversion sans preuve médicale **garantie**  
5. Quoi que ce soit sur **régime PME, cotisations employeur, présentation MRa, « ton équipe »**  
6. Un conseil fiscal personnalisé sur l’imposabilité des prestations  
7. Remplacement du contrat / de l’assureur collectif  

---

## 7. Frontières entre campagnes (anti-cannibalisation)

| Campagne | Rôle | `#11` doit… |
|----------|------|-------------|
| `#11` Collective employé | Lire le livret, nommer les flous → RDV | Rester sur checklist + flous |
| `#04` Invalidité | Chiffre du **trou $** vs dépenses | Ne pas recalculer le trou ici |
| `#06` Maladie grave | Produit / besoin MG | Chip « présent dans collective ? » seulement |
| `#12` Autonome | Pas de collective fournie | Ne pas pivoter « si t’es ton boss » |
| `#15` MRa | Lead form PME | **Interdit** sémantique et CTA |

---

## 8. Checklist review avant ship

- [ ] H1 = question / mythe, pas affirmation de couverture  
- [ ] Soft close : flous + clarifier ≠ acheter + livret  
- [ ] Aucun « t’es couvert / bien protégé »  
- [ ] Paliers = « souvent / beaucoup », pas « toujours »  
- [ ] Départ = options livret, pas fatalisme absolu  
- [ ] Zéro MRa / PME / équipe  
- [ ] Disclaimer outil présent  
- [ ] PDF : mention livret prime + éducatif  
- [ ] Chips MG / plafond = faits livret, pas reco produit  

---

## 9. Validations script/outil (corrections ciblées)

| Élément proposé (autres rôles) | Statut finance |
|--------------------------------|----------------|
| H1 *te couvre… vraiment ?* | OK (interrogatif) |
| Promesse « 15 min seulement si case floue » | OK |
| Soft close *clarifier ≠ acheter* | OK — obligatoire |
| Mid *on ne te vend pas une collective PME* | OK (désambiguïsation `#15`) — garder court |
| FAQ paliers | OK si « beaucoup de livrets » |
| Chip MG Non → soft close | OK si wording *à clarifier dans ton livret / besoin éventuel*, pas *achète une MG* |
| Insights « jour d’une réclamation » | OK (urgence de lire, pas fear-sell produit) |
