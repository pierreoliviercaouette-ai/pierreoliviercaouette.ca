# [#03] Expert finances & fiscalité — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Périmètre :** valider **nouveaux** claims / champs P1 (chrome + climax XXL) — pas re-auditer tout le P0  
**Titre professionnel :** conseiller en sécurité financière  
**Assureur mentionné :** iA Groupe financier (le cas échéant)

---

## Rescore conformité post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Alignement ads ↔ outil ↔ FAQ | 5 | ~8 | ≥ 8.5 |
| Risque claim prescriptif | Moyen | Faible | Faible |
| Clarté « illustratif » | Moyen | Bon | Excellent (XXL gap) |

**Top 1 risque V2 :** agrandir `+97 000 $` peut faire lire le chiffre comme **recommandation de capital** ou « trou garanti » dans la police banque. Mitiger par libellés + disclaimers déjà présents — **ne pas** durcir le claim pour le WOW.

---

## 1. Verdict conformité Vague 2 (1 paragraphe)

Le modèle éducatif reste **sain** : créancier ≠ vie perso ; `auDelaDuPret` = besoins illustratifs au-delà du solde ; mi-parcours = `×0.5` illustration. Vague 2 n’ajoute **aucun nouveau champ calcul** (pas de matching, SCEE, plafond fiscal). Les seuls vecteurs de risque sont **copy fold** (chips / kicker) et **dominance visuelle** du gap. Autoriser l’échelle `text-3xl+` **si** le label reste « Écart illustratif » / « au-delà du prêt ». Refuser toute formulation « il te manque 97 k$ d’assurance » ou « ta banque ne couvre pas ta famille de X $ ».

---

## 2. Nouveaux éléments V2 — validation

| Élément V2 | Statut | Note finance |
|------------|--------|--------------|
| Atmosphere CSS solde→famille | OK | Métaphore visuelle — aucun claim chiffré |
| Kicker « Solde du prêt ≠ besoin des proches » | OK | Éducatif ; ≠ « la banque te ment » |
| Chip « Solde ≈ prêteur » | OK avec ≈ | « ≈ » évite « toujours 100 % du solde » |
| Chip « Capital → famille » | OK | Direction narrative, pas garantie de versement |
| Process step 1 « montant pensé pour les proches » | OK | Pas « montant à souscrire » |
| Gap XXL `+formatCad(auDelaDuPret)` | OK **si** « illustratif » visible | Montant seul en XXL OK si label sm au-dessus |
| Defaults 97 k$ / 447 k$ | OK scénario | Exemple, pas moyenne QC |
| `balanceMid = solde × 0.5` | Fragile inchangé | Disclaimer amortissement **obligatoire** (déjà en outil) |
| Portrait + libellé CSF | OK | Identité réglementaire cohérente |

**Fiscalité :** aucun levier CELI/REER/SCEE. Ne pas introduire de claims fiscaux sur capital-décès.

---

## 3. Claims — OK / ajuster / interdit (V2)

### Claims OK (garder / autoriser)

- « Écart illustratif : +X $ au-delà du prêt »
- « Montant illustratif pour la famille »
- « Solde du prêt ≠ besoin des proches »
- « Prime peut rester semblable ou être revue au renouvellement* »
- « Clarifier banque vs famille (15 min) »
- Coût relatif ≈ ×N à mi-parcours (illustration)

### Claims à surveiller (formulation)

| Formulation risquée | Remplacer par |
|---------------------|---------------|
| « Il te manque 97 k$ » | « Écart illustratif de 97 k$ au-delà du prêt » |
| « Ta famille n’est pas protégée » | « Le premier protégé est souvent le prêteur » (déjà OK en outil) |
| « Solde = prêteur » (sans ≈) | « Solde ≈ prêteur » |
| « Capital famille garanti » | « Capital / montant illustratif » |

### Interdits (ne pas introduire en V2)

1. Annulation banque gratuite / immédiate / sans trou de couverture  
2. Individuelle **toujours** moins chère ou « meilleure »  
3. Souscription sans sélection / preuves d’assurabilité  
4. Montant outil = recommandation de capital à souscrire  
5. Amortissement réel = moitié du solde à mi-durée (comme fait)  
6. « La banque protège ta famille » comme une vie perso  
7. Gonfler defaults pour dramatiser le WOW  

---

## 4. Disclaimers — checklist V2

### Outil (déjà en place — ne pas retirer)

1. Illustration éducative seulement — pas un amortissement exact ni un conseil personnalisé.  
2. Créancier et vie personnelle non interchangeables automatiquement.  
3. Solde mi-parcours ≈ moitié — pas un calendrier d’amortissement exact.  
4. `* Selon le contrat et le prêteur. Conditions variables.`  
5. iA le cas échéant — analyse au cas par cas.

### Fold / process

- Aucun disclaimer supplémentaire requis pour chips CSS.  
- Si kicker trop agressif en QA → adoucir vers « Solde du prêt et besoin des proches, ce n’est pas la même chose ».

### Landing footer site

Garder bloc éducatif global CSF.

---

## 5. Vocabulaire obligatoire (rappel)

| Préférer | Éviter |
|----------|--------|
| Écart / montant **illustratif** | « Ce qu’il te faut », « manque », « trou » |
| Assurance créancier / du prêteur | « L’assurance de la banque = assurance vie » |
| Souvent / selon le produit / ≈ | Toujours / jamais / garanti |
| Clarifier / regarder / comparer | « On change ta police aujourd’hui » |
| Renouvellement* | « La prime monte toujours » |

---

## 6. Spec Avant → Après (finance)

| Zone | Avant | Après Vague 2 | Gate |
|------|-------|---------------|------|
| Gap bandeau | Illustratif, taille moyenne | Même claim, taille XXL | Label « illustratif » visible |
| heroExtras | — | Kicker + chips | Pas de montants / pas « manque » |
| Calc | Inchangé | Inchangé | Aucune nouvelle formule |
| Ads / FAQ | P0 alignés | Pas de reouverture | Régression = fail merge |

---

## 7. Backlog finance

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| F-1 | Revue copy `heroExtras` + process avant merge | S | P0-v2 |
| F-2 | QA visuelle : label « illustratif » lisible à côté du XXL | S | P0-v2 |
| F-3 | Amortissement réel (remplace ×0.5) | L | P2 — hors WOW |
| F-4 | SoftClose montants dynamiques mid (si un jour) | L | P2 — reformuler « illustration » |

---

## 8. Unique #03 — note

Seul funnel **double-job** (comparatif créancier vs perso **+** estimateur besoins). Le **97 k$** est un **besoin au-delà du prêt illustratif**, pas un manque garanti dans la police banque. Agrandir le chiffre **augmente** le devoir de clarté du label — pas le droit de promettre.

---

## 9. Critères acceptation conformité

- [ ] Gap XXL toujours préfixé / sous-titré « illustratif » / « au-delà du prêt »  
- [ ] Chips / kicker sans montant recommandé ni accusation prêteur  
- [ ] Aucun nouveau claim ads dans le pack V2  
- [ ] Disclaimers outil + `*` renouvellement toujours présents  
- [ ] Defaults non gonflés  
