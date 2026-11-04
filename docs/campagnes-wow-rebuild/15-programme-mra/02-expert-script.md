# [#15] Programme MRa PME — Spec SCRIPT (textes finaux WOW → Lead)

**Rôle :** Expert script marketing  
**Slug :** `/campagnes/programme-mra`  
**CTA :** Lead form → rappel → présentation (**pas** Bookings)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, décideur PME, conformité éducative

> **≠ #11** : vocabulaire *employeur / équipe / présentation / contribution* — jamais *livret RH, carte, « ma collective me couvre »*.

---

## 1. Hero (coller dans `campagneAdsLandings.js`)

| Champ | Texte final |
|-------|-------------|
| `badge` | `Programme MRa` |
| Eyebrow (si slot UI) | `Pour propriétaires & décideurs PME` |
| `title` | `Offrir de l’assurance à ton équipe — sans usine à gaz` |
| `promise` | `Tu proposes l’accès. Tes employés choisissent avec un conseiller. Toi : peu de gestion, contribution optionnelle. Pensé pour les décideurs PME — pas une collective traditionnelle.` |
| `ctaLabel` | `Recevoir une présentation` |
| Micro sous CTA (UI) | `Je te rappelle — sans Bookings ni pression` |

---

## 2. En bref (`bullets`)

1. `Flexibilité : tu cotises ou non (%, plafond, catégories) — eux choisissent leurs protections`
2. `Simplicité : tu ne construis pas un régime complexe ; preuves d’assurabilité réduites*`
3. `Rapidité : ~2 rencontres entreprise + 30–45 min / personne intéressée`

\* renvoyer au disclaimer outil / FAQ.

---

## 3. Intro outil (copy UI `MraFitTool`)

| Élément | Texte |
|---------|-------|
| `title` | `MRa pour ta PME : est-ce que ça colle ?` |
| `intro` | `Alternative à la collective traditionnelle : tu offres l’accès, ils choisissent, on accompagne. Indique ta taille et ta situation — tu obtiens une lecture fit, puis tu peux demander une présentation.` |
| Label taille | `Combien de personnes dans l’équipe ? (approx.)` |
| Label contrib | `Contribution employeur (idée)` |
| Label situation | `Ta situation aujourd’hui` |
| Piliers H3 | `3 raisons souvent citées (coche ce qui te parle)` |
| Lecture rapide eyebrow | `Lecture fit` |
| Note bas outil | `MRa = contrats individuels via l’entreprise. Sélection médicale possible. Prochaine étape : je te rappelle pour une présentation — pas de calendrier imposé.` |

### Soft close post-climax (dynamique)

Template :

> Pour ~{n} employés ({situationCourte}), t’as un **{score}**. {accrocheContrib} Laisse ton entreprise + ton cell — je te rappelle pour une présentation MRa.

Exemples :

| Score | Accroche |
|-------|----------|
| Bon fit | `Surtout si tu veux offrir l’accès sans cotiser.` / `Surtout si tu veux un % ou un plafond sans gérer les plans.` |
| À explorer | `Ça vaut une présentation pour comparer avec ce que tu as aujourd’hui.` |
| Moins prioritaire | `On peut quand même clarifier si MRa (ou autre) a du sens pour ta taille.` |

Bouton primaire outil : `Recevoir une présentation`  
Micro : `Je te rappelle — sans Bookings`  
PDF secondaire : `Télécharger mon résumé PDF`

---

## 4. Section form (`ctaHeadline` / `ctaSubline` / form)

| Champ | Texte |
|-------|-------|
| `ctaHeadline` | `Demande une présentation MRa` |
| `ctaSubline` | `Présentation → ~2 rencontres entreprise → 30–45 min / personne. Infos médicales ≠ côté employeur.` |
| H3 form (remplacer « Laisse tes coordonnées ») | `Tes coordonnées pour le rappel` |
| Sous-titre form | `Je te recontacte pour une présentation adaptée à ta PME. Sans engagement.` |
| Label tel | `Téléphone` + hint `Idéal pour le rappel` |
| Label entreprise | `Nom de l’entreprise *` |
| Label taille (si champ séparé) | `Nombre d’employés (approx.) *` |
| Label message | `Message (optionnel)` |
| `leadMessagePlaceholder` | `Ex. : on est ~10, pas de collective / trop chère — je veux voir si MRa colle…` |
| `submitLabel` / `ctaLabel` | `Recevoir une présentation` |
| Success title | `Demande reçue` |
| Success body | `Merci. Je te rappelle rapidement pour caler une présentation MRa — sans Bookings.` |
| Ligne confiance sous submit | `Tes infos servent uniquement au rappel. Contenu éducatif — pas un conseil personnalisé. CSF · Victoriaville.` |
| `leadSubject` | `Campagne MRa — présentation PME` |

Lien secondaire (remplace Apprendre collective) :

- Label : `Employé avec un livret RH ?`  
- Path : `/campagnes/assurance-collective`  
- (Option) Apprendre PME : ancre FAQ `#faq` ou capsule employeur si elle existe — **pas** `/apprendre/assurance-collective` comme CTA principal post-Lead.

---

## 5. FAQ (max 5) — coller data

1. **C’est la même chose qu’une assurance collective ?**  
   Non. MRa repose sur des contrats individuels proposés via l’entreprise. L’employé choisit ses protections avec un conseiller ; ton rôle reste surtout l’offre (et éventuellement une contribution).

2. **Est-ce que je dois cotiser obligatoirement ?**  
   Non. La formule peut être offerte sans contribution. Tu peux aussi choisir un % ou un plafond par personne.

3. **Mes employés vont-ils me coller leurs infos médicales ?**  
   Non côté employeur : les dossiers et la sélection médicale se gèrent avec le conseiller / l’assureur, pas dans ton bureau RH. Tu offres l’accès ; eux discutent de leur situation en privé.

4. **C’est long à mettre en place ?**  
   Typiquement ~2 rencontres avec l’entreprise, puis 30 à 45 minutes par personne intéressée. Entrée en vigueur souvent le 1er du mois suivant — sous conditions et acceptation du dossier.

5. **Pour quelle taille d’équipe ?**  
   Pensé surtout pour les petites entreprises (souvent ~8–20, parfois plus petit ou un peu plus grand). L’outil te donne une lecture fit ; on valide ensemble à la présentation. Ce n’est pas un régime collectif traditionnel « usine ».

*(La Q sélection médicale reste couverte en FAQ 1 + disclaimer ; si on doit rester à 4, merger 4+5 et garder la Q confidentialité #3 — objection #1 audit.)*

---

## 6. Ads Meta — ajustements (alignement outil-first → Lead)

Fichier : `emails/campagne-meta-catalog/programme-mra.md`

### Ad1 — Sans usine à gaz (garder angle, resserrer CTA)

**Texte principal :**
> Je pensais que pour offrir de l’assurance à mon équipe, fallait absolument une grosse collective.
>
> Comme beaucoup de PME.
>
> Sauf que la collective traditionnelle, c’est souvent lourd : régimes à choisir, gestion, peu de flexibilité.
>
> Le programme MRa, c’est une autre logique : tu offres l’accès, ils choisissent leurs protections, on accompagne. Contrats individuels. Contribution facultative.
>
> Sur la page : un outil gratuit pour voir si ça colle à ta PME. Ensuite, un formulaire court — je te rappelle pour une présentation, sans Bookings ni pression.
>
> Contenu éducatif. Pas un conseil personnalisé.
> https://www.pierreoliviercaouette.ca/campagnes/programme-mra

**Titre :** `Assurance équipe — sans usine à gaz`  
**Description :** `Outil fit · je te rappelle`

### Ad2 — 3 piliers (discovery = piliers opt-in sur page)

**Texte principal :**
> Tu veux un avantage pour tes employés… sans devenir gestionnaire d’assurances à temps plein.
>
> Trois idées du programme MRa :
> 1) Flexibilité — cotise ou non ; eux choisissent.
> 2) Simplicité — pas de régime complexe à bâtir. Preuves d’assurabilité réduites*.
> 3) Rapidité — ~2 rencontres entreprise, 30–45 min / personne.
>
> Sur la page : coche ce qui te parle, vois ton fit, demande une présentation.
>
> *Selon conditions. Contrats individuels — sélection médicale possible.
> https://www.pierreoliviercaouette.ca/campagnes/programme-mra

**Titre :** `PME : 3 raisons de regarder MRa`  
**Description :** `Fit check · présentation sur rappel`

### Ad3 — Soft close formulaire (form court — aligner réalité page)

**Texte principal :**
> Alternative à l’assurance collective pour petite entreprise.
>
> Tu proposes le programme. Tes employés adhèrent librement et choisissent avec un conseiller. Toi : peu de gestion, contribution optionnelle, confidentialité médicale de ton côté.
>
> Sur la page : fit check en ~2 minutes, puis un formulaire court (entreprise + coordonnées). Je te rappelle pour une présentation.
>
> Contenu éducatif. Titre : conseiller en sécurité financière.
> https://www.pierreoliviercaouette.ca/campagnes/programme-mra

**Titre :** `Présentation MRa — laisse tes infos`  
**Description :** `Formulaire court · sans Bookings`

**Disclaimer ads (inchangé d’esprit) :** Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. MRa = contrats individuels, sélection médicale (refus, exclusions, surprimes possibles). Preuves d’assurabilité réduites sous conditions. Document non contractuel.

---

## 7. Strip comparatif (microcopy 5 critères)

| Critère | Collective trad. | MRa |
|---------|------------------|-----|
| Adhésion | Souvent régime d’entreprise | Volontaire / choix individuel |
| Protections | Plans choisis en lot | Chacun choisit avec un conseiller |
| Contribution | Souvent structurée | Optionnelle (0 / % / plafond) |
| Médical | Selon régime | Sélection médicale individuelle* |
| Portabilité | Souvent limitée au départ | Logique contrat individuel* |

\* nuances en disclaimer — ne pas overclaim « toujours portable ».

---

## 8. Process 3 pastilles

1. `Présentation` — `Je te rappelle, on voit si ça colle`
2. `Entreprise` — `~2 rencontres pour cadrer l’offre`
3. `Équipe` — `30–45 min / personne intéressée`

Ligne : `Infos médicales ≠ côté employeur · CSF · Victoriaville`

---

## 9. SEO (léger)

| Champ | Texte |
|-------|-------|
| `seoTitle` | `Programme MRa \| Alternative collective pour PME — Victoriaville` |
| `seoDescription` | `Fit check gratuit pour décideurs PME. Offre l’accès à des protections individuelles au choix, peu de gestion. Demande une présentation — conseiller en sécurité financière.` |

---

## 10. Mots interdits / vigilance

- ❌ « Réserver 15 minutes », « Bookings », « Prendre rendez-vous » comme CTA principal page
- ❌ « Ma collective me couvre », « livret », « checklist employé » (sémantique #11)
- ❌ Garanties fiscales / « zéro sélection médicale » / « acceptation garantie »
- ✅ « Je te rappelle », « présentation », « sans engagement », « contrats individuels »
