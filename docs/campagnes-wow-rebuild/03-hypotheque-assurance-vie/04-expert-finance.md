# [#03] Expert finances & fiscalité — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Date :** 2026-11-04  
**Périmètre :** assurance créancier (prêteur) vs assurance vie / protection personnelle · illustration capital famille  
**Titre professionnel :** conseiller en sécurité financière  
**Assureur mentionné :** iA Groupe financier (le cas échéant)

---

## 1. Verdict conformité (1 paragraphe)

Le cœur éducatif est **sain** : distinguer créancier ≠ vie perso, montrer un coût relatif illustratif, et un capital famille = solde + besoins au-delà. Les risques sont surtout **claims ads** (annulation « généralement sans frais », promesse implicite de simplicité) et **précision technique** (solde mi-parcours = 50 % hardcodé, prime « stable » vs renouvellements*). La refonte WOW ne doit **pas** durcir les promesses pour booker ; elle doit aligner ads ↔ outil ↔ FAQ sur le renouvellement* et adoucir l’annulation.

---

## 2. Chiffres & modèle — validation

| Élément | Statut | Note |
|---------|--------|------|
| `capitalFamille = solde + dettes + (revenu×mois) + coussin` | OK éducatif | Ce n’est **pas** un besoin d’assurance calculé actuariellement ni un conseil de montant à souscrire |
| `auDelaDuPret` | OK | Bien nommé « illustratif » |
| `balanceMid = solde × 0.5` | Fragile | Pas un amortissement. Disclaimer obligatoire : « illustration mi-parcours, pas un calendrier d’amortissement exact » |
| Coût relatif `$ / 1 000 $` et ratio | OK si « illustration » | Ne pas dire « ta prime double » — dire « coût relatif ≈ ×N » |
| Defaults 350 k$ / 45 $ / 97 k$ | OK scénario | Exemple, pas moyenne marché QC |

**Fiscalité :** pas de levier CELI/REER/SCEE ici. Ne pas glisser de claims fiscaux sur le capital décès (généralités seulement si un jour ajoutées — hors scope).

---

## 3. Vocabulaire obligatoire / préféré

| Préférer | Éviter |
|----------|--------|
| Assurance créancier / du prêteur / de la banque (grand public OK) | « L’assurance de la banque = assurance vie » |
| Protection personnelle / assurance vie individuelle (selon produit) | « Remplace automatiquement la banque » |
| Bénéficiaires / proches | Garantie que « la famille touche tout » (dépend du contrat créancier) |
| Couverture souvent liée au solde | « Toujours 100 % du solde » |
| Prime peut rester semblable ou être revue au renouvellement* | « La prime monte toujours » / « ne bouge jamais » |
| Illustration éducative | « Voici le montant exact à assurer » |
| Portable après l’hypothèque (souvent / selon produit) | « Toujours portable sans conditions » |

---

## 4. Claims risqués — Ads & page

| Claim | Risque | Correction |
|-------|--------|------------|
| Ad3 : « l’annulation côté prêteur est généralement sans frais* » | Méfiance + faux selon prêteurs / produits ; dissonance FAQ « pas automatiquement » | « Revoir ou remplacer… souvent possible — dépend du prêteur et du contrat* » |
| Ad1/2 : « prime peut monter aux renouvellements* » | OK **avec \*** ; page outil dit surtout « peut rester semblable » → dissonance | Aligner outil + FAQ renouvellement* |
| « Sans frais » / « plus simple qu’on le croit » | Minimisation du friction réel (souscription, assurabilité, délai double couverture) | Garder prudence ; jamais « toujours sans frais » |
| « Toujours moins cher que la banque » | **Interdit** — non présent aujourd’hui, ne pas introduire | — |
| Capital famille présenté comme « ce qu’il te faut » | Conseil déguisé | Toujours « montant **illustratif** » |
| Mi-parcours moitié solde | Challenge client averti | Disclaimer amortissement |

---

## 5. Disclaimers obligatoires

### Ads (bloc existant — conserver)
> Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. L’assurance créancier et l’assurance vie personnelle ne sont pas interchangeables automatiquement. Primes et conditions illustratives — selon le contrat et le prêteur. Produits d’assurance de iA Groupe financier (Industrielle Alliance, Assurance et services financiers inc.).

### Outil (corps + PDF notes)
1. Illustration éducative seulement — pas un amortissement exact ni un conseil personnalisé.
2. L’assurance créancier et l’assurance vie personnelle ne sont pas interchangeables automatiquement.
3. Contrats varient ; lecture de la police + analyse au cas par cas.
4. Asterisk renouvellement / annulation : `* Selon le contrat et le prêteur. Conditions variables.`

### Landing footer site
Garder le bloc éducatif global existant (CSF, pas de conseil personnalisé).

---

## 6. Ce qu’on ne doit **pas** promettre

1. Qu’annuler la banque est gratuit, immédiat, ou sans risque de trou de couverture.
2. Qu’une individuelle est **toujours** moins chère ou « meilleure ».
3. Qu’on peut souscrire sans sélection / preuves d’assurabilité.
4. Qu’un montant d’outil = recommandation de capital.
5. Qu’un amortissement réel = moitié du solde à mi-durée.
6. Que le prêteur « protège la famille » comme une vie perso (bénéficiaire = souvent le créancier en premier).

---

## 7. Checklist revue copy refonte

- [ ] H1 / promesse : éducatif, pas « on te fait sauver X $ »
- [ ] Soft close : « clarifier / regarder » — pas « on change ta police aujourd’hui »
- [ ] FAQ renouvellement* ajoutée et cohérente ads
- [ ] FAQ annulation : « pas automatiquement » + dépend prêteur*
- [ ] Ad3 adoucie (plus de « généralement sans frais » comme hook principal)
- [ ] Tutoiement Ad3 titre : « Compare **tes** protections »
- [ ] PDF : accents FR + notes conformité
- [ ] Mention iA conservée là où produits peuvent être proposés

---

## 8. Unique #03 — note finance

Seul funnel **double-job** (comparatif créancier vs perso **+** estimateur besoins illustratifs). Le chiffre 97 k$ est un **besoin au-delà du prêt**, pas un « manque » garanti ni un trou dans la police banque. Formuler : « écart illustratif au-delà du solde » plutôt que « il te manque 97 k$ d’assurance » (trop prescriptif).
