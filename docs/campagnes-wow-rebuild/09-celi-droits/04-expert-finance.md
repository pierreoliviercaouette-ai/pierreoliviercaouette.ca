# [#09] CELI droits — Spec FINANCE & fiscalité QC

**Slug :** `/campagnes/celi-droits`  
**Rôle :** Expert finances & fiscalité  
**Date :** 2026-11-04  
**Périmètre :** exactitude plafonds, vocabulaire, claims copy/ads, disclaimers, non-promesses

---

## 1. Verdict finance (1 paragraphe)

Le moteur d’estimation (année de 18 ans → somme des plafonds → moins cotisations à vie → min avec plafond annuel pour la cotisation « cette année ») est **pédagogiquement correct comme ordre de grandeur**, et les plafonds 2009–2026 dans `PLAFONDS_ANNUELS` **matchent l’ARC** (7 000 $ en 2026 ; cumul max depuis 2009 = **109 000 $**). Deux trous importants à assumer clairement en UI/PDF : (1) **retraits** (droits souvent rétablis le 1er janvier suivant — non saisis) ; (2) le champ « déjà cotisé à vie » ≠ solde Mon Dossier ARC si retraits / timing / multi-émetteurs. Le claim hero « ça coûte cher en silence » est **non quantifié → retirer** (conformité + crédibilité). Le sélecteur d’usage est **intentionnel / éducatif**, pas une allocation recommandée.

---

## 2. Plafonds — validation `PLAFONDS_ANNUELS`

| Année | Code | ARC / sources 2026 | Statut |
|-------|------|--------------------|--------|
| 2009–2012 | 5 000 | 5 000 | OK |
| 2013–2014 | 5 500 | 5 500 | OK |
| 2015 | 10 000 | 10 000 | OK |
| 2016–2018 | 5 500 | 5 500 | OK |
| 2019–2022 | 6 000 | 6 000 | OK |
| 2023 | 6 500 | 6 500 | OK |
| 2024–2026 | 7 000 | 7 000 | OK |

**Cumul 2009→2026 (admissible depuis le jour 1, 0 cotisé) :** 109 000 $.  
**Scénario default 1992 → droits depuis 2010 :** 104 000 $ (exclut 2009 = 5 000 $) — cohérent.

Commentaire code « À revalider » : **revalidé 2026-11-04** via table ARC plafonds CELI. Mettre à jour le commentaire JSX → `Validé ARC 2026-11 — revalider à chaque nouvel indice annuel`.

**Fallback `plafondPourAnnee` :** `year >= 2024 ? 7000 : 5500` — OK pour trous ; ne pas inventer 2027+ sans source.

---

## 3. Ce que l’outil calcule vs la réalité ARC

### Formule outil (actuelle)
```
cumules = Σ plafonds[max(2009, année_18) … année_courante]
placeRestante = max(0, cumules − deja_cotise_vie)
cotisationEffective = min(prevu, placeRestante, plafond_annuel)
```

### Formule ARC (droits disponibles — simplifié)
```
plafond année en cours
+ droits inutilisés années antérieures
+ retraits de l’année civile précédente
− cotisations déjà versées cette année
```

### Écarts à divulguer (disclaimer / FAQ / PDF)
1. **Retraits** non saisis → sous-estimation possible de la place si retraits N−1.  
2. **Cotisations cette année** déjà faites : le champ « prévu » n’est pas un « déjà versé 2026 » séparé — OK pour illustration ; ne pas dire « droits ARC exacts ».  
3. **Résidence / admissibilité** (18 ans + résident aux fins de l’impôt) non modélisées.  
4. **Cotisation excédentaire** = imposable ; l’outil warn si `deja > cumules` mais ne calcule pas la pénalité.  
5. Données ARC CELI souvent à jour **au printemps** pour l’année précédente — mention FAQ utile.

---

## 4. Vocabulaire obligatoire

| Dire | Ne pas dire |
|------|-------------|
| Droits de cotisation / place restante **estimée** | « Ton solde ARC est X $ » |
| Cotisations à vie (somme des versements) | Confondre avec **valeur / solde du compte** |
| Plafond **annuel** vs droits **cumulés** | « Le max CELI = 7 000 $ » sans nuance |
| Illustration / ordre de grandeur | Conseil personnalisé / recommandation d’achat |
| Usage (urgence / projet / LT) = **intention** | « Tu dois mettre X % en urgence » |
| Clarifier ≠ cotiser demain | « Maxe maintenant » / rendement promis |

**CELI vs REER :** garder FAQ neutre (horizon, liquidité, tranche) — pas de règle unique « toujours CELI ».

---

## 5. Claims copy / ads — verdict conformité

| Claim | Verdict | Action |
|-------|---------|--------|
| Hero « ça coûte cher en silence » | Risqué (coût d’opportunité non prouvé) | **Retirer** → copy script place restante |
| « Les droits ne disparaissent pas au 31 déc. » | Exact en général | Garder + « en général » |
| « Sans compte / sans formulaire » | Exact pour l’outil | Garder — **tenir** la pastille sur la page |
| Estimation illustrée / pas conseil perso | Obligatoire | Garder partout |
| Ad « coller urgence / projet / long terme » | OK si chips livrées | Livrer sélecteur ; sinon claim pubs ≠ produit |
| Soft « Clarifier ≠ cotiser demain » | Excellent cadre | Reprendre sous chiffre + mid |

---

## 6. Disclaimers obligatoires (textes finaux)

### Outil (footer court)
> Illustration seulement. Plafonds approximatifs (table ARC). Le solde officiel est dans Mon Dossier ARC. Les retraits et le détail multi-émetteurs ne sont pas tous modélisés. Pas un conseil personnalisé.

### PDF notes (min.)
1. Estimation illustrative — plafonds selon table publique ARC.  
2. Le solde officiel est dans Mon Dossier ARC (et relevés d’émetteur).  
3. Cotisations à vie ≠ valeur du compte (les gains ne consomment pas de droits).  
4. Les retraits d’une année s’ajoutent généralement aux droits le 1er janvier suivant — non saisis dans cet outil.  
5. Contenu éducatif — conseiller en sécurité financière ; pas une recommandation personnalisée.

### Ads
Conserver le bloc disclaimer existant du catalog Meta (éducatif + estimation + titre CSF).

---

## 7. Lien officiel ARC

**Mon Dossier (particuliers) :**  
https://www.canada.ca/fr/agence-revenu/services/services-electroniques/services-electroniques-particuliers/dossier-particuliers.html

**Calcul droits CELI (réf. éducative) :**  
https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot/cotiser/calculer-droits.html

Ouvrir en nouvel onglet ; ne pas scraper ; ne pas promettre sync temps réel.

---

## 8. Sélecteur usage — garde-fous finance

- Trois intentions **mutuellement exclusives** (chips) = OK pédagogie.  
- Ne **pas** afficher de montants cibles inventés (« mets 6 mois de dépenses ») dans cet outil (autre campagne fonds d’urgence).  
- Ne **pas** diverger vers assurance / produits dans la lecture usage.  
- Soft close = « coller au plan » / vérifier ordre de grandeur — **pas** « ouvre un CELI chez nous ».

---

## 9. Ce qu’on ne doit **pas** promettre

- Montant exact des droits ARC  
- Absence de pénalité si l’user cotise selon l’outil  
- Rendement, « argent qui dort = perte de X % »  
- Que maxer le CELI est toujours optimal  
- Que le RDV = transaction / souscription  
- Cumul 109 k$ comme chiffre **personnel** du default 1992 (son cas = 104 k$ depuis 2010)

---

## 10. Checklist pre-Ads scale

- [ ] `PLAFONDS_ANNUELS` = table ARC année courante  
- [ ] Hero / ads sans claim coût non chiffré  
- [ ] Disclaimer retraits visible (outil ou PDF+FAQ)  
- [ ] Lien ARC cliquable  
- [ ] Chips usage = intention, wording soft  
- [ ] Titre professionnel CSF cohérent SEO / ads / mid

**Note conformité cible :** 9/10 si disclaimer retraits + retrait claim « coûte cher » + pastille sans compte tenue.
