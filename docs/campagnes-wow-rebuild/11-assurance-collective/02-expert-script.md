# [#11] Expert script marketing — Assurance collective (employé)

**Slug :** `/campagnes/assurance-collective`  
**Ton :** québécois parlé, clair, zéro drama médical  
**CTA final :** RDV Bookings 15 min  
**Conformité :** éducatif · livret prime · pas « t’es couvert » · **pas MRa / PME / « ton équipe »**  
**Date :** 2026-11-04  
**Fichier data :** `frontend/src/data/campagneAdsLandings.js` (`assurance-collective` ~L329–362)  
**Ads source :** `emails/campagne-meta-catalog/assurance-collective.md`

---

## 1. Textes finaux — landing (prêts à coller)

### Hero

| Champ | Texte |
|-------|--------|
| `badge` | Assurance collective |
| `title` | Ton assurance collective te couvre… vraiment ? |
| `seoTitle` | Ton assurance collective te couvre vraiment ? \| Conseiller en sécurité financière |
| `seoDescription` | Checklist gratuite : invalidité (paliers), vie, départ. Mini résumé PDF. 15 min seulement si une case reste floue. Conseiller en sécurité financière à Victoriaville. |
| `promise` | Ouvre le PDF RH. Coche invalidité (un % ou plusieurs paliers), vie, départ. Mini résumé sans compte — 15 min seulement si une case reste floue. |
| Confiance (1 ligne, sous CTAs) | Conseiller en sécurité financière · Victoriaville · éducatif — le livret prime toujours. |

### Dual CTA labels (hero)

| Rôle | Label |
|------|--------|
| Primaire (scroll `#outil`) | Remplir la checklist |
| Secondaire (RDV) | Ou 15 min avec le livret |
| `ctaLabel` mid / Bookings | Réserver 15 minutes |

### Bullets (« En bref ») — max 3

1. Invalidité : un %… ou plusieurs paliers (court / long terme), délai avant le premier chèque, et la vraie définition dans ton livret  
2. Vie, dentaire, médicaments : les plafonds réels — pas « ça me couvre »  
3. Si tu quittes : ce qui reste, ce qui tombe, et les trous à clarifier de ton bord  

### Soft close outil (footer — si `missingCount` > 0)

**Phrase dynamique :**  
> T’as encore {n} case{s} floue{s} dans ton livret{ — dont l’invalidité si warn}. 15 min, on les démêle ensemble, livret ouvert. Clarifier, c’est pas acheter.

**CTA outil :** Démêler mes cases floues (15 min)  
**PDF (secondaire) :** Garder mon résumé PDF  

**Si tout complet (`missingCount` = 0) :**  
> Bon résumé. Range le PDF avec ton livret — et revalide si ton emploi ou ton salaire change.  
CTA soft optionnel : *Valider ensemble en 15 min* (secondaire).

### Mid CTA (data-driven)

| Champ | Texte |
|-------|--------|
| `ctaHeadline` | Des cases encore floues ? On ouvre le livret ensemble. |
| `ctaSubline` | 15 minutes, sans pression. Apporte ton PDF RH (ou ton résumé) — on clarifie, on ne te vend pas une collective PME. |
| Bouton | Réserver 15 minutes |
| Secondaire | Lire la capsule sur l’assurance collective |

### Intro outil (shell)

| Champ | Texte |
|-------|--------|
| Titre outil | Checklist — ton assurance collective |
| Intro | Idéal avec le PDF RH ouvert. Remplis case par case — ton mini résumé se construit en direct. |
| Gate livret (callout) | Pas juste la carte : ouvre le document avec les % et les délais. [Où est mon livret ?](#faq-livret) |
| Disclaimer outil | Contenu éducatif seulement — pas un conseil personnalisé. Grille simplifiée : ton livret peut prévoir plusieurs paliers, plafonds ou définitions plus fines. Le livret prime toujours. |

### Insights ResultCards (état vide / partiel)

| Card | État | Detail (émotionnel) |
|------|------|---------------------|
| Invalidité | À trouver | Sans % ni délai, tu découvres le filet le jour d’une réclamation. Ouvre la section invalidité — un % ou plusieurs paliers. |
| Invalidité | Partiel | Complète délai, définition et % (ou paliers). C’est écrit dans le livret — pas sur la carte. |
| Vie et santé | À trouver | Combien pour tes proches, et quel plafond dentaire / médicaments — vraiment ? |
| Si tu quittes | À clarifier | Quand tu changes d’emploi, la collective suit rarement. Note ce qui tombe avant d’en avoir besoin. |
| Livret | Pas encore | Sans le PDF RH, tu devines. Avec, tu sais ce que ton assurance collective t’offre vraiment. |

### Process bandeau (3 lignes)

1. Tu apportes ton livret (ou ton PDF résumé)  
2. On repère les cases encore floues  
3. 15 min pour démêler — éducatif, zéro pression  

---

## 2. FAQ (max 5) — coller dans `faq[]`

1. **Je dois vraiment ouvrir le livret de mon assurance collective ?**  
   Oui — au moins invalidité, vie, santé, départ. L’outil te guide case par case ; tu sors avec un mini résumé PDF. Ou on le fait ensemble en 15 minutes, livret sous les yeux.

2. **Où est mon livret ?** *(id ancre `faq-livret`)*  
   Souvent sur le portail RH ou chez l’assureur de ton employeur — pas seulement la petite carte. Cherche le PDF avec les montants et les délais. Sans ça, tu devines ; avec, tu sais.

3. **Court terme / long terme — pourquoi deux % ?**  
   Beaucoup de livrets ont des **paliers** : un % (et parfois une définition) pour les premiers mois, puis un autre plus tard. La checklist te force à noter *ce que dit ton contrat* — un seul % ou plusieurs paliers. Chaque régime est différent.

4. **Ajouter une assurance = doubler pour rien ?**  
   Non : l’idée c’est de combler les **trous** de ce que ton assurance collective t’offre déjà — pas d’empiler pour empiler. On regarde ce qui manque vraiment pour *toi* (employé), pas pour une PME.

5. **À quoi ressemblent les 15 minutes ?**  
   Tu arrives avec le livret (ou le PDF résumé). On ouvre les cases floues — surtout invalidité et départ. On clarifie. Pas de pitch produit obligatoire. Clarifier, c’est pas acheter.

---

## 3. Ads Meta — ajustements (alignement outil-first)

Garder la structure Ad1/Ad2/Ad3. Ajuster le pont page :

### Ad1 — Mythe (accroche OK)
- Garder ouverture *« me couvrait pour vrai »*.
- Dernière ligne CTA page : s’assurer que la landing ouvre sur **checklist**, pas RDV hero.
- Titre pub OK : *Checklist gratuite + résumé PDF*.

### Ad2 — Paliers
- Ajouter 1 phrase miroir step 1 outil : *« Sur la page, l’invalidité (paliers) est la première case — pas le nom d’employeur. »*
- Titre OK : *Un %… ou plusieurs paliers ?*

### Ad3 — Checklist avant RDV
- Renforcer : *« Bouton principal = remplir la checklist. Le RDV, c’est après — si une case te chicotte. »*
- Évite toute promesse « réserve tout de suite ».

**Disclaimer ads (inchangé, coller en bas pub si requis) :**  
Contenu éducatif. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. Ce que ton assurance collective t’offre varie d’un employeur à l’autre. Le livret prime toujours.

---

## 4. Microcopy conformité (à ne pas dire)

| Éviter | Préférer |
|--------|----------|
| T’es couvert / t’es bien protégé | Ce que ton livret dit vraiment / cases encore floues |
| On va te trouver le bon produit | On démêle les cases — clarifier ≠ acheter |
| Pour ton équipe / ta PME / MRa | Ton livret d’employé / ton contrat collectif |
| La collective (jargon froid seul) | Ton assurance collective (+ livret) |
| Conseil personnalisé implicite | Contenu éducatif · livret prime |

---

## 5. Mapping fichiers

| Texte | Où |
|-------|-----|
| Hero, bullets, FAQ, CTA mid, SEO | `campagneAdsLandings.js` → `assurance-collective` |
| Labels dual CTA / `ctaHeadline` | idem + shell `CampagneAdsLanding.jsx` |
| Soft close flous, insights cards, gate, intro | `CollectiveChecklistTool.jsx` |
| Ads | `emails/campagne-meta-catalog/assurance-collective.md` |

---

## 6. Critères script « je booke »

- [ ] Objection Ad1 (« ma carte me couvre ») répondue dans le H1
- [ ] Ad2 (paliers) visible en bullet 1 + FAQ 3 + step 1 outil
- [ ] Ad3 (checklist avant RDV) respectée : primaire = outil
- [ ] Soft close nomme *mes* cases floues + « clarifier ≠ acheter »
- [ ] Zéro copy PME / MRa / « ton équipe »
