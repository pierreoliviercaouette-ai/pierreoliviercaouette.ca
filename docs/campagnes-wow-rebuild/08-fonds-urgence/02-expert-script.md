# [#08] Fonds d’urgence — Script marketing (textes finaux)

**Rôle :** Expert script marketing  
**Slug :** `/campagnes/fonds-urgence`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, calme, éducatif — zéro pitch produit  
**CTA :** RDV Bookings 15 min  
**Fichiers cibles :** `campagneAdsLandings.js` (`fonds-urgence`) · `FondsUrgenceTool.jsx` · `emails/campagne-meta-catalog/fonds-urgence.md`

---

## 1. Hero & En bref (prêts à coller)

| Élément | Texte final |
|---------|-------------|
| Badge | Fonds d’urgence |
| Titre | Le filet avant d’accélérer l’investissement |
| Promesse | En 2 minutes : ta cible, ce qui manque, et en combien de mois — avant d’accélérer CELI ou REER. |
| CTA primaire | Calculer mon filet |
| CTA secondaire | ou réserver 15 minutes |
| Ligne confiance | Conseiller en sécurité financière · Victoriaville · contenu éducatif, pas un pitch produit |

**Bullets (En bref) — remplacer les 3 actuels :**
1. Cible claire : dépenses essentielles × 3 à 12 mois selon la stabilité du revenu
2. Écart et délai : ce qu’il manque, et en combien de mois au rythme que tu indiques
3. Accessible d’abord : pas le REER, pas un portefeuille volatil — ensuite on regarde le surplus

*(Retirer le push « PDF à garder » du 3e bullet — le trophy n’est plus le download.)*

**Intro bloc outil (shell landing ~L133–135) :**  
« Remplis l’outil — tu vois ta cible, ton écart, ton délai. Ensuite, 15 min si tu veux fixer le palier. »

---

## 2. Soft close post-outil (3 tons — cite le résultat)

Variables : `{manquant}` · `{dureeLabel}` · `{surplus}` · `{rythme12}` (formatCad).

### A. Écart court (`manquant > 0` et `moisPourCombler ≤ 24` ou null avec épargne)
**Titre / status :** Ton écart : {manquant}.  
**Corps :** {dureeLabel} à ton rythme — 15 min pour fixer où garer le coussin et à quel rythme. Zéro pression.  
**CTA primary :** Réserver 15 minutes  
**CTA secondary :** Télécharger mon résumé PDF

### B. Écart large (`moisPourCombler > 24`)
**Titre / status :** Pas besoin de tout remplir d’un coup.  
**Corps :** Il te manque {manquant} (~{dureeLabel} à ton rythme). 15 min pour un premier palier — souvent un mois de dépenses — et où le garer.  
**CTA primary :** Réserver 15 minutes  
**CTA secondary :** Télécharger mon résumé PDF

### C. Filet atteint (`surplus > 0`)
**Titre / status :** Filet OK dans ce scénario.  
**Corps :** Environ {surplus} de surplus vs la cible illustrée. 15 min pour trancher le prochain dollar : dettes chères, CELI ou REER — selon ta situation.  
**CTA primary :** Trancher le prochain dollar — 15 min  
**CTA secondary :** Télécharger mon résumé PDF

**Phrase idéale (defaults 16 000 $ / 4 a 6 m) — référence QA :**  
« T’as **16 000 $** à combler — ~**4 ans et demi** à 300 $/mois. 15 min pour fixer un premier palier et où garer le coussin. Zéro pression. »

---

## 3. Mid CTA (bandeau navy)

| Champ data | Texte |
|------------|-------|
| `ctaHeadline` | Ton écart est clair — et après ? |
| `ctaSubline` | Où garer le coussin, quel rythme, quoi faire du surplus. 15 minutes, sans pression. |
| `ctaLabel` | Réserver 15 minutes |
| Preuve sous CTA | Conseiller en sécurité financière · Victoriaville / Centre-du-Québec · éducatif |

**Remplace :** « Prêt à clarifier ta situation ? » / « 15 minutes, sans pression. On regarde ton résumé ensemble si tu veux. »

---

## 4. Microcopy outil

| Slot | Texte |
|------|-------|
| Titre outil | Combien mettre de côté ? *(garder)* |
| Intro | Un fonds d’urgence, c’est de l’argent accessible si tu perds ton job ou qu’un gros imprévu arrive. On calcule la cible, l’écart, et en combien de temps tu peux y arriver. *(garder)* |
| Sous le gros manquant si `moisPourCombler > 12` | Soit ~{rythme12}/mois pour ~12 mois (illustration) |
| `statusDetail` warn | Délai vu — 15 min pour un palier, ou PDF à garder. |
| `statusDetail` atteint | Filet OK — 15 min pour trancher le surplus, ou PDF. |
| `statusDetail` sans épargne mensuelle | Ajoute un montant mensuel pour estimer le délai — puis 15 min ou PDF. |
| `buildLecture` atteint — detail | … Le prochain sujet, c’est souvent où oriente le surplus — pas d’ajouter encore au coussin. *(garder)* + CTA oriente vers RDV |
| Disclaimer outil | Illustration éducative seulement — pas un plan sur mesure. L’argent doit rester accessible : pas un conseil de placement. *(garder)* |

**PDF — accents FR (titres/labels) :**  
Résumé — fonds d’urgence · Tes entrées · Dépenses essentielles / mois · Mois à couvrir · Déjà de côté · Résultats · Délai au rythme actuel · À retenir · imprévu · éducative

---

## 5. FAQ (max 5) — coller dans `faq[]`

1. **Combien de mois viser ?**  
   Souvent 3 à 6 mois de dépenses essentielles. Plus (9–12) si le revenu est variable, autonome, contractuel, ou s’il n’y a qu’un salaire au ménage. L’outil ci-dessus reste une illustration — pas un plan sur mesure.

2. **La carte de crédit, c’est un fonds d’urgence ?** *(NOUVEAU — Ad2)*  
   Non. La carte, c’est un prêt cher déguisé en solution rapide. Un vrai filet, c’est de l’argent à toi, accessible, calé sur *tes* dépenses — pas une limite de crédit.

3. **Où garder cet argent ?**  
   L’objectif, c’est la disponibilité : compte d’épargne, CPG rachetable, ou CELI en liquidités. Évite d’immobiliser le coussin dans des placements qui peuvent baisser juste quand tu en as besoin. Les détails dépendent de ta situation.

4. **Je peux investir et construire le fonds en même temps ?**  
   Souvent oui, avec des priorités. Sans filet accessible, un imprévu pousse vers la carte ou la vente au mauvais moment. Le bon dosage dépend du revenu, des dettes et du stress — on le regarde ensemble si tu veux.

5. **C’est un conseil personnalisé ?**  
   Non. Contenu éducatif et général. Une recommandation adaptée se fait après analyse de ta situation.

---

## 6. Ads Meta — ajustements (outil-first déjà OK)

Les Ad1–Ad3 actuelles sont **alignées** (calculateur sans compte → soft close RDV). Changements mineurs seulement :

| Ad | Ajustement |
|----|------------|
| Ad1 | Garder. Renforcer 1 ligne de close : « Si le chiffre te chicotte, 15 min pour un palier + où garer — zéro pression. » |
| Ad2 | Garder le hook carte. Ajouter en close : « La page répond aussi : carte ≠ filet. » (match FAQ) |
| Ad3 | **Critique landing** : hero doit être outil-first sinon dissonance. Copy ad OK telle quelle. |
| Titres / descriptions | Inchangés (déjà « calculateur / sans compte ») |
| Disclaimer ads | Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. *(garder)* |

**Brief visuel ads :** inchangé — « Filet d’abord. » navy, sous-texte « Calculateur gratuit · Sans compte ».

---

## 7. Mots interdits / claims à éviter

- « Sérénité garantie », « sécurité absolue », « filet complet »
- « 6 mois = tu es protégé / en sécurité »
- « On te trouve le meilleur compte / produit »
- Promesse de rendement sur le coussin
- « Conseil personnalisé » sans analyse

---

## 8. Critères script « je booke »

- [ ] Soft-close cite **mon** manquant / délai / surplus
- [ ] Mid ne dit plus « clarifier ta situation »
- [ ] FAQ carte présente (lead Ad2)
- [ ] Hero promet l’outil, pas le RDV en premier
- [ ] Un ami comprend en 5 s : « il booke pour calmer l’écart / le palier »
