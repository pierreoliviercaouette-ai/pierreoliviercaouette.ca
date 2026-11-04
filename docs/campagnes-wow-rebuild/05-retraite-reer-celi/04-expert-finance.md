# [#05] Expert finances & fiscalité QC — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Date :** 2026-11-04  
**Périmètre :** validation copy / outil / ads — **pas** de conseil personnalisé  
**Sources :** audit · `RetraiteReerCeliTool.jsx` `buildSuggestion` · modules Apprendre CELI / REER-FERR · ads Meta

---

## 1. Verdict conformité

L’outil reste une **illustration éducative** de priorisation d’enveloppes (CELI vs REER) selon liquidité, horizon et ordre de grandeur de tranche. Les splits % (50/50, 70/30, etc.) sont des **heuristiques pédagogiques**, pas des pondérations fiscales optimales.  
**OK à shipper** si on (a) neutralise le tone « warn » sur le mixte, (b) formule le matching employeur en « souvent… » + RDV, (c) garde disclaimers près de l’ordre et du CTA, (d) ne promet aucun rendement ni « meilleur compte ».

---

## 2. Vocabulaire — exactitude

| Terme | Usage correct sur la page | À éviter |
|-------|---------------------------|----------|
| **REER** | Enveloppe : cotisation souvent déductible, retrait imposable ; report d’impôt | « Placement REER garantit X % » |
| **CELI** | Cotisation après impôt ; croissance / retraits non imposables (sous règles) | Confondre avec CELIAPP |
| **CELIAPP** | Compte distinct (1ʳᵉ propriété) — FAQ seulement, pas dans le prioriseur | « CELI maison » comme synonyme |
| **FERR** | Capsule liée REER — décumul ; pas dans l’algo outil | Promettre un FERR |
| **Tranche** | Ordre de grandeur (<30 / 30–40 / >40 %) — **pas** les paliers exacts fédéraux/QC | Afficher un taux marginal inventé |
| **Matching employeur** | Cotisation employeur souvent conditionnelle aux règles du régime ; pas toujours 1:1 | « Match = toujours maximiser REER d’abord » comme règle absolue |
| **Droits / plafonds** | Mention éducative ; l’outil **ne calcule pas** les droits REER/CELI | Afficher un plafond dollar inventé dans l’outil |

**Plafonds 2026 (contexte Apprendre / FAQ seulement — ne pas hardcoder dans l’outil prioriseur) :**  
CELI plafond annuel 2026 = **7 000 $** (ARC) — utile en capsule CELI, pas comme output du prioriseur.  
REER : plafond lié au revenu / facteur — **ne pas** simplifier en un seul chiffre sur cette landing.

---

## 3. Règles outil — validation

### Logique actuelle `buildSuggestion` (OK pédagogique)
1. `horizon === 'court'` **ou** `liquidite === 'oui'` → **CELI d’abord** — cohérent (accès / besoin court).  
2. `tranche === 'elevee'` **et** `horizon === 'long'` → **REER d’abord** — cohérent (report d’impôt + temps).  
3. Sinon **mixte** avec lean selon tranche/horizon — OK **si** labelé « illustratif ».

### Matching (nouveau) — contraintes
- **Ne pas** recalculer automatiquement un split 100 % REER si matching = Oui.  
- Raison autorisée : *« Un match employeur, c’est souvent de l’argent conditionnel sur la portion cotisée — ça se regarde souvent avant le débat perso ; on le quantifie en 15 min. »*  
- Interdit : « Tu dois maximiser le REER de ton employeur avant tout CELI » (trop directif / faux selon régimes, vestings, plafonds, liquidité).  
- Si l’utilisateur a **liquidité oui** + matching oui : la règle liquidité (CELI) **reste prioritaire** dans l’algo ; la raison matching s’ajoute comme nuance + pont RDV — pas de contradiction silencieuse : copy du type « même avec un match, ton besoin d’accès peut justifier du CELI — on démêle ça en 15 min ».

### Dollars `celiAmt` / `reerAmt`
- Arrondis `Math.round` sur % du mensuel = **illustration**, pas cotisation réelle.  
- Toujours suffixe / detail : « illustration seulement ».  
- Ne jamais présenter comme « ta cotisation optimale ».

---

## 4. Claims risqués — revue copy / ads

| Claim / zone | Risque | Correction |
|--------------|--------|------------|
| Tone `warn` + triangle sur Mixte | Implique erreur / alerte réglementaire | `nuance` + « à affiner » |
| « Pas de gagnant automatique » | OK | Garder |
| Ad2 « partage 250/250 » | OK si « illustratif / exemple » | Toujours « ex. » / « piste » |
| « Argent gratuit » pour matching | Acceptable en langage parlé **si** « souvent » + conditions régime | Préférer « match / cotisation employeur » |
| Jobs fiscaux REER vs CELI (bullets) | OK haut niveau | Ne pas dire « retire CELI toujours sans impact » sur prestations — hors scope ; ne pas ouvrir ce fil ici |
| PDF « base pour 15 min » | OK | Pas « plan de retraite » / « recommandation » |
| Mythe « toujours REER » | OK éducatif | Ne pas remplacer par « toujours CELI » |

---

## 5. Disclaimers obligatoires (emplacements)

1. **Sous l’outil** (`CampagneToolShell` disclaimer) :  
   `Illustration éducative seulement. Pas un conseil personnalisé.`
2. **Près de l’ordre + CTA RDV** (footer microcopy ou ligne xs) :  
   `Illustration éducative. Pas un conseil personnalisé. Titre : conseiller en sécurité financière.`
3. **Bas de landing** (déjà) : contenu éducatif + titre CSF + situation unique.  
4. **Ads** : disclaimer catalogue (pas de rendement, piste éducative).  
5. **PDF notes** : éducatif + valider avec vraie situation (projets, revenu, comptes déjà ouverts, **règles du régime employeur**).

---

## 6. Ce qu’on ne doit **pas** promettre

- Rendement, « battre le marché », comparaison de fonds.  
- Un ordre REER/CELI **personnalisé** ou « optimal ».  
- Un calcul de droits de cotisation / remboursement d’impôt.  
- Que le match employeur est toujours supérieur à toute cotisation CELI.  
- Ouverture de compte / souscription via la landing.  
- Équivalence CELI = CELIAPP.  
- Montants de cotisation employés/employeurs sans dossier.

---

## 7. FAQ finance — points de vigilance

- **Matching :** rester sur mécanisme général + RDV ; pas de % d’exemple inventé (ex. « 50 % de match ») sauf si un jour branché sur saisie utilisateur clairement illustrative.  
- **CELI vs CELIAPP :** renvoyer vers capsule / campagne #02 ; ne pas élargir l’algo #05.  
- **Mythe REER :** réponse actuelle OK.  
- **PDF ≠ conseil :** OK.

---

## 8. Checklist sign-off finance (avant merge)

- [ ] Aucun % de rendement dans landing / ads / PDF  
- [ ] Mixte = illustratif, pas alerte  
- [ ] Matching = éducatif + RDV, pas ordre produit  
- [ ] Liquidité court-terme ne se fait pas écraser silencieusement par matching  
- [ ] Disclaimers aux 3 emplacements (outil, CTA, bas de page)  
- [ ] CELIAPP confiné à la FAQ  
- [ ] Titre professionnel : conseiller en sécurité financière (jamais « planificateur » non autorisé si non applicable)  
