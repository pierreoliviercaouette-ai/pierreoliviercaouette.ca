# [#08] Fonds d’urgence — Validation finances & conformité

**Rôle :** Expert finances & fiscalité (QC)  
**Slug :** `/campagnes/fonds-urgence`  
**Date :** 2026-11-04  
**CTA :** RDV éducatif 15 min (CSF) — pas de souscription produit sur la page  
**Sources :** `FondsUrgenceTool.jsx` · ads · audit · FAQ landing

---

## 1. Verdict finance

**Calcul landing : exact et approprié pour une illustration éducative.**  
Formule : `cible = dépenses essentielles × mois` ; `manquant = max(0, cible − déjà)` ; `moisPourCombler = ceil(manquant / épargneMensuelle)` ; `rythme12 = ceil(manquant / 12)`.

Ce n’est **pas** un plan cash-flow, ni une recommandation de véhicule, ni un calcul d’impôt. Le disclaimer actuel est aligné. Aucun plafond fiscal (CELI/REER/SCEE) n’entre dans l’outil — **ne pas en ajouter** (confusion avec #02 / #09).

---

## 2. Chiffres & vocabulaire — OK / à corriger

| Élément | Statut | Note |
|---------|--------|------|
| Fourchette 3–12 mois | OK | Standard pédagogique ; libellés MOIS_OPTIONS cohérents (stable → autonome) |
| « Dépenses essentielles » | OK | Hints exclus sorties — correct |
| « Accessible » vs REER / portefeuille volatil | OK | Message prioritaire solide |
| CPG rachetable / CELI en liquidités (FAQ) | OK | Exemples éducatifs, pas une reco produit |
| Surplus → dettes chères, CELI, REER | OK **si** « selon ta situation » / « à clarifier » | Ne jamais ordonner une séquence unique (dette vs CELI) comme règle absolue |
| « Carte ≠ filet » | OK et **recommandé** | Exact : crédit = dette potentielle, pas actif liquide à soi |
| Defaults 3 500 × 6 / 5 000 / 300 | OK | Illustration ; ne pas présenter comme « moyenne québécoise » |
| Rythme12 | OK | Doit rester étiqueté **illustration** (déjà dans Metric detail) |

### PDF ASCII (polish + conformité perçue)
Corriger accents FR (`Résumé`, `Dépenses`, `Déjà`, `Délai`, `imprévu`, `éducative`) — pas un enjeu fiscal, mais un enjeu de crédibilité CSF.

---

## 3. Claims risqués dans copy / ads / soft-close

| Claim / formulation | Risque | Remplacer / garder |
|---------------------|--------|---------------------|
| « Sérénité », « sécurité garantie », « filet complet » | Élevé | **Interdit** |
| « 6 mois = tu es protégé » | Élevé | Garder « courant / typique » — jamais « suffisant / sécuritaire » |
| « On te dit où placer / quel compte ouvrir » | Moyen | Soft-close : « où garer » = **sujet de conversation**, pas promesse de reco produit dans l’outil |
| « Trancher le prochain dollar » (dettes / CELI / REER) | Faible–moyen | OK si cadre RDV + « selon ta situation » ; pas de classement figé dans l’UI |
| Ad « ce que tu pensais gagner en rendement, tu peux le perdre » | Acceptable | Reste narratif éducatif ; ne pas chiffrer un % de perte |
| « Sans conseil personnalisé » | Obligatoire | Garder ads + page + outil |

---

## 4. Disclaimers obligatoires (checklist)

- [x] Page / outil : illustration éducative, pas un plan sur mesure  
- [x] Ads : contenu éducatif · titre CSF · pas un conseil personnalisé  
- [ ] Soft-close RDV : ne pas sous-entendre qu’un RDV de 15 min = plan complet / mise en place produit  
- [ ] FAQ carte : rester factuel (prêt cher) — pas « jamais utiliser une carte » (situations d’urgence réelle existent ; le message = ce n’est pas un *fonds*)  
- [ ] Mentions CELI/REER dans surplus : pas de chiffres de plafond 2026 sur cette page (hors sujet)

**Disclaimer outil (garder) :**  
« Illustration éducative seulement — pas un plan sur mesure. L’argent doit rester accessible : pas un conseil de placement. »

**Ligne confiance (ajouter) :**  
« Conseiller en sécurité financière · Victoriaville · contenu éducatif, pas un pitch produit »

---

## 5. Ce qu’on ne doit **pas** promettre

1. Qu’un montant X ou Y mois = sécurité financière  
2. Un véhicule précis (compte, CPG, fonds) comme *la* solution  
3. Un ordre d’optimisation fiscal universel après le filet  
4. Des économies d’intérêts carte chiffrées sans données client  
5. Que le PDF ou l’outil remplace une analyse de situation  
6. Une « sérénité » ou un résultat émotionnel garanti post-RDV  

---

## 6. Validation des textes soft-close (finance sign-off)

| Ton | Copy proposée (script) | Verdict |
|-----|------------------------|---------|
| Warn court | « …15 min pour fixer où garer le coussin et à quel rythme » | **OK** — conversation, pas produit |
| Warn long | « …premier palier — souvent un mois de dépenses » | **OK** — palier pédagogique courant |
| Atteint | « …trancher le prochain dollar : dettes chères, CELI ou REER — selon ta situation » | **OK** avec la clause « selon ta situation » |

FAQ carte proposée : **OK** — « Non. … prêt cher déguisé… vrai filet = argent à toi, accessible… »

---

## 7. Écart outil landing vs calculateur Apprendre

`toolCalculators.calculateFondsUrgence` (logement + alim + … + stabilité + secteur) est **plus granulaire**.  
Pour la campagne Meta : **garder la formule simple**. Ne pas merger les deux sans redesign — risque de friction et de faux sentiment de précision.

Si un jour on aligne : afficher clairement « estimation » et ne pas présenter moisMin/moisMax comme norme AMF.

---

## 8. Critères acceptation conformité

- [ ] Aucun claim « garanti / sécurisé / filet complet » dans hero, outil, ads, PDF notes  
- [ ] Soft-close et mid restent éducatifs (palier, où garer, surplus = sujets)  
- [ ] FAQ carte live + disclaimer inchangé  
- [ ] PDF notes gardent « illustration éducative »  
- [ ] Pas de plafonds CELI/REER inventés sur cette landing
