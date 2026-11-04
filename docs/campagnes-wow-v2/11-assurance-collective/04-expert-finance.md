# [#11] Expert finances & fiscalité — Assurance collective (employé) Vague 2

**Slug :** `/campagnes/assurance-collective`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Périmètre :** lecture livret RH employé Québec — **pas** conception régime PME / **zéro MRa `#15`**

---

## Rescore post-P0 (conformité)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Copy éducative | 7 | 8 | ≥ 8.5 |
| Claims nouveaux champs | n/a | n/a | Validés avant ship |
| Frontière vs autres campagnes | 7 | 8 | ≥ 9 |

**Top 1 risque V2 :** chips **plafond $/mois** et **maladie grave** mal libellés → claim implicite de couverture ou glissement vers vente `#06` / `#15`.

---

## Nouveaux claims / champs P1 à valider

### 1. Chip « Maladie grave dans ta collective ? »

| OK | Interdit |
|----|----------|
| Constater présence / absence / flou selon le livret | « Tu as besoin d’une MG » / prix / acceptation médicale |
| Renvoyer capsule `/apprendre` ou FAQ existante si curiosité | Lien soft close vers landing MRa ou `#06` comme upsell |

**Libellé safe :** *Maladie grave dans ta collective ?* — options Oui / Non / Je ne sais pas.  
Detail ResultCard si Non / Je ne sais pas : *À noter pour le RDV — pas un diagnostic de besoin.*

### 2. Chip « Plafond invalidité $/mois »

| OK | Interdit |
|----|----------|
| *Plafond mensuel noté dans le livret (si indiqué)* | « Ton vrai filet » / « tu recevras X $ nets » |
| Placeholder ex. `4000` clairement illustratif | Calcul trou $ vs dépenses (**ça reste `#04`**) |
| PDF row : *Plafond noté : 4 000 $/mois* | Prestation nette après impôt |

**Rappel fiscalité :** qui paie la prime → imposabilité des prestations = **capsule Apprendre seulement**, pas claim SoftClose.

### 3. Climax « n encore flous » + noms de milestones

| OK | Interdit |
|----|----------|
| Compter des cases non renseignées (outil grille) | Impliquer « tu n’es pas assuré » / « couverture insuffisante » |
| Noms : Invalidité, Vie-santé, Départ, Livret, Employeur | « Trou de X $ » / « risque critique » |

### 4. Atmosphere / chips hero « Livret ≠ carte »

| OK | Interdit |
|----|----------|
| Pédagogie : chiffres dans le document RH | « La carte ne te couvre pas » (trop absolu) |

Reformulation si besoin : *Les % et délais sont dans le livret — pas sur la carte.*

### 5. Process step 3 « 15 min si trou »

| OK | Interdit |
|----|----------|
| *Clarifier ≠ acheter* / éducatif | Analyse complète, conseil personnalisé, acceptation garantie |

---

## Claims OK (déjà en page — conserver)

- H1 question *…te couvre… vraiment ?*
- *Le livret prime toujours*
- *Clarifier, c’est pas acheter*
- Paliers : *souvent / beaucoup de livrets* (pas « tous »)
- Conversion départ : options livret (cesse / conversion / partielle) — pas garantie

---

## Interdits absolus (page `#11`)

1. Tout wording **MRa**, **PME**, **ton équipe**, présentation employeur, cotisation entreprise  
2. « T’es couvert » / « bien protégé avec ta carte »  
3. Calcul ou affichage d’un **trou $** (collision `#04`)  
4. Promesse de complément individuel nécessaire  
5. Délais 90/120 j présentés comme universels (exemples UI only)  
6. Conseil fiscal personnalisé sur prestations  
7. SoftClose / mid custom hors `ToolSoftClose` + mid catalogue

---

## Disclaimers

### Outil (garder — déjà en code)
> Contenu éducatif seulement — pas un conseil personnalisé. Grille simplifiée : ton livret peut prévoir plusieurs paliers, plafonds ou définitions plus fines. Le livret prime toujours.

### SoftClose (garder)
> … Clarifier, c’est pas acheter.

### Chip plafond (ajouter hint)
> Si ton livret indique un maximum mensuel en dollars, note-le. Le % seul peut tromper — ce n’est pas un calcul de besoin.

### Landing footer site
Bloc légal existant OK.

---

## Frontières campagnes

| # | Rôle | `#11` V2 doit… |
|---|------|----------------|
| 11 | Checklist livret employé → flous → RDV | Rester grille + chips lecture |
| 04 | Trou $ invalidité | Ne pas recalculer ici |
| 06 | MG produit | Chip présence collective only |
| 12 | Autonome sans collective | Ne pas dire « pas de collective » comme persona |
| 15 | MRa PME | **Exclu à 100 %** — zéro lien, zéro copy |

---

## Verdict finance Vague 2

**GO** chips MG + plafond + climax nommé **si** libellés ci-dessus.  
**NO-GO** si copy dérive vers vente produit, trou $, ou MRa.

**Note conformité V2 cible /10 :** 8.5 (sous réserve wording chips).
