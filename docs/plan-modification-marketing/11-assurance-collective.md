# [#11] Assurance collective (employé) — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/assurance-collective`  
**Persona :** Employé·e 28–50 ans (Québec), carte / portail RH en poche, livret PDF rarement ouvert. Objection #1 : *« Ma collective me couvre pour vrai — j’ai déjà la carte. »* (≠ PME, ≠ MRa `#15`)  
**CTA :** RDV Bookings 15 min  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5.5  
**Score « effet WOW » outil (1–10) :** 5.5  
**Score envie de booker après la page (1–10) :** 4.5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta (Ad1 « me couvre pour vrai » ou Ad2 paliers). Le hero dit *« Ce que ton assurance collective t’offre »* — correct, mais plat : pas le mythe qui m’a fait cliquer. Le bouton blanc hurle *« Réserver 15 minutes »* alors qu’Ad3 m’a promis *checklist avant le RDV* → je me braque une seconde. En bref est clair (invalidité / plafonds / départ). L’outil m’accroche : 0/5, quatre cartes « À trouver », ça a l’air utile… puis step 1 = *nom d’employeur*. Zéro insight. Sans livret ouvert, je tape dans le vide ; les ResultCards restent « À trouver / Partiel » sans me faire peur pour vrai. Le footer me dit *« 2 points encore flous »* — émotion juste — et le seul bouton = *Télécharger mon PDF*. Je prends le PDF (ou j’abandonne) ; je ne booke pas. Soft close mid *« Prêt à clarifier ta situation ? »* = générique catalogue. FAQ « où est mon livret » aide ; rien sur court/long terme alors qu’Ad2 m’a vendu ça. **Je bookerais seulement si une case floue me piquait et qu’un CTA 15 min + livret apparaissait tout de suite** — aujourd’hui, non.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge « Assurance collective », titre descriptif, promesse checklist+PDF, CTA RDV blanc sur navy orbs | Curiosité tiède ; légère trahison vs Ad3 | Fuite soft : CTA RDV trop tôt. WOW manqué = titre mythe Ad1 + CTA primaire « Remplir la checklist » |
| 3–15 s En bref | 3 cards numérotées : invalidité / vie-santé / départ | OK, pédagogique | Opportunité : nommer **paliers** dans bullet 1 (match Ad2) |
| Première interaction outil | Progress 0/5 · 4 ResultCards vides · step 1 Employeur | « Utile… mais ennuyeux » | Fuite : abandon avant Invalidité. WOW = gate livret + Invalidité (paliers) en step 1 |
| Climax résultat | Cards passent Partiel / ok ; `missingCount` dans progress + `statusDetail` | Légère tension si cases floues ; pas de « damn » $ | Climax = **nombre de flous**, pas % progress. Aujourd’hui sous-joué (texte taupe, PDF only) |
| Après le climax (PDF / CTA) | Double bouton PDF (haut mini-résumé + footer) ; zéro RDV dans l’outil | Soulagement « j’ai mon PDF » → sortie | Fuite intention. WOW = bandeau « {n} flous — 15 min, livret ouvert » |
| Soft close mid / form | Bloc navy « Prêt à clarifier… » + Réserver + capsule | Froid, déconnecté du livret | Opportunité : citer cases floues / paliers |
| FAQ / fin | Livret obligatoire · Où est mon livret · Doubler pour rien | Utile pour livret ; silence paliers | WOW FAQ court/long terme + process « 15 min avec ton livret » |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évalué sur live `https://www.pierreoliviercaouette.ca/campagnes/assurance-collective` (2026-11-04) + data/shell.

### Hero
- **Composition :** Brand nav OK ; badge pill OK ; titre H1 générique catalogue ; promesse checklist OK ; **un seul CTA = RDV** — trop générique pour une pub qui vend l’outil. Navy + orbs / grille = même PageHero que les 14 autres.
- **Atmosphère :** Ça ne « sent » pas le **livret RH / portail / carte d’employé**. Ça sent « landing campagne template ».
- **Motion :** Vague hero + fade standard ; dans l’outil, barre de progress `transition-all` OK (1 mouvement utile). Pas de 2e présence (ex. pulse ambre sur carte Invalidité warn).
- **Mobile :** Titre lisible ; CTA pouce OK mais **mauvais job** (booker avant checklist). En bref cards OK ; outil long (5 blocs) = scroll fatigue.

### Corps de page
- **Hiérarchie :** Une job / section à peu près (En bref → outil → CTA → FAQ). En bref = 3 mini-cards (acceptable). Outil dense mais une job.
- **Confiance :** Titre CSF + disclaimer éducatif. **Absent :** photo conseiller, Victoriaville hors footer, « à quoi ressemble 15 min avec un livret », aperçu PDF.
- **Densité :** Hero un peu vide émotionnellement ; outil chargé (OK pour checklist) ; mid CTA card-soup navy catalogue.
- **Manque pour pro / premium :** (1) texture / visuel livret-document en hero, (2) process 3 steps « Livret → Cases → 15 min si flou », (3) hiérarchie visuelle où **« X encore flous »** domine le % vanity, (4) dual CTA outil-first.

### Soft close / form
- Mid : copy générique, digne d’un catalogue, **pas** d’un RDV payé en attention après Meta. Aucune microcopy qui cite *mes* cases. Réassurance « sans pression » OK mais froide.

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. **Hero mythe + dual CTA** — Avant : titre descriptif + CTA RDV seul. Après : *« Ton assurance collective te couvre… vraiment ? »* + primaire « Remplir la checklist » (scroll `#outil`) + secondaire soft RDV.
2. **Climax flous en ambre** — Avant : `missingCount` en texte taupe sous progress. Après : chiffre hero interne *« 2 encore flous »* gros + ResultCard Invalidité en ambre affirmé quand warn.
3. **Bandeau process livret** — Avant : saut outil → mid CTA générique. Après : 3 lignes entre outil et mid — *Apporte livret ou PDF résumé → on repère les flous → options si trou (éducatif)*.

---

## 3. Audit OUTIL interactif (cœur du WOW)

JSX lu : `CollectiveChecklistTool.jsx` (~727 L). Scénario mental : employé avec livret PDF RH à côté (defaults vides).

### Première impression outil
- En &lt;10 s : oui — « checklist + mini résumé live + PDF ». Clair.
- Defaults : **vides** (bon — pas de faux climax). Mais step 1 Employeur **spoil** l’énergie Ad2 (paliers) et n’aide aucun aha.

### Moment « wow »
- **Devrait être :** (a) bascule *Plusieurs paliers* → deux % + délai, ou (b) carte Invalidité qui passe de « À trouver » à un % concret, ou (c) **`missingCount` / cases floues** qui me chicottent assez pour booker.
- Aujourd’hui : (a) existe mais **après** employeur ; (b) labels plats « À trouver / Partiel » ; (c) phrase `statusDetail` bonne mais **sans CTA**.
- Manque pour désir de parler à quelqu’un : pont émotionnel *« ces cases floues = 15 min, livret sous les yeux — clarifier ≠ acheter »*.

### Friction outil
- Champ employeur first ; livret checkbox **en dernier** alors que sans livret l’outil est creux.
- Jargon géré OK (définition en langage clair) ; scroll 5 jalons + double PDF = fatigue mobile.
- Gap vs ads : Ad1/3 « livret à côté » → checkbox last mile ; Ad2 paliers → UI présente mais enterrée ; Ad3 soft close cases vides → **absent**.
- Polish : PDF ASCII (`Resume`, `Invalidite`, `Non renseigne`, `Delai`) ; milestone `depart` = `depart || trousNotes` → on « complète » sans choisir ce qui arrive au départ.

### Après le résultat
- Next step naturel actuel = **PDF**, pas booker. Soft close mid trop loin / trop générique.

**Note outil WOW /10 :** 5.5  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Soft close cases floues** — `CollectiveChecklistTool.jsx` footer ~L308–316 + `statusDetail` ~L229–234. Avant : phrase flous + PDF only. Après : même phrase + CTA RDV `…_rdv_cases_floues` via `buildCampagneRdvPath`.
2. **Invalidité step 1** — Blocks ~L396–583 + `milestones` ~L145–168. Avant : Employeur → Invalidité. Après : Invalidité (paliers) first ; employeur optionnel / fin.
3. **Gate livret sticky** — Intro / au-dessus Progression ~L319. Avant : checkbox step 5. Après : callout *« Idéal avec le PDF RH ouvert »* + ancre FAQ « Où est mon livret ? ».
4. **Insights émotionnels ResultCard** — `invaliditeDetail` / `vieSanteDetail` / `departDetail` ~L192–222. Avant : « Ouvre ton livret… ». Après : *« Sans % ni délai, tu découvres le filet le jour d’une réclamation. »*
5. **Chips trous MG / plafond** — Block départ ~L628–667. Avant : textarea libre. Après : chips Maladie grave Oui/Non/Je ne sais pas (+ plafond $/mois si noté) → alimente flous / soft close. **Pas** de lien MRa `#15`.

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « J’ai déjà la carte / le portail — je suis couvert. »
2. « Court terme / long terme, c’est du jargon RH, pas pour moi. »
3. « Si j’ajoute quelque chose, je paie deux fois / on va me vendre. »

### Ce qui me ferait booker demain (leviers émotionnels)
- **Preuve / clarté :** voir *mes* cases encore floues nommées (invalidité paliers, départ, MG).
- **Peur de mal faire seul :** lire le livret calmement *avant* une réclamation.
- **On le fait ensemble :** 15 min = ouvrir le livret, pas pitcher un produit.
- **Phrase soft close idéale :** *« T’as encore 2 cases floues dans ton livret — dont l’invalidité. 15 min, on les démêle ensemble, livret ouvert. Clarifier, c’est pas acheter. »*

### Ce qui me fait fuir
- CTA RDV hero avant l’outil (Ad3 trahi) ; PDF comme seule récompense ; titre plat ; soft close générique ; sensation « landing clone » ; peur qu’on dérive vers une vente PME/MRa.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où** · **Avant → Après** · **Impact** · **Effort**

1. **Soft close RDV sur cases floues (`missingCount` / warn)** · L’émotion utile = *« 2 points flous »*, pas un PDF incomplet · `CollectiveChecklistTool.jsx` footer ~L308–316 + `trackRendezVousClick('campagne_assurance-collective_rdv_cases_floues')` · Avant : statusDetail + PDF. Après : + bandeau « 15 min, livret sous les yeux » + bouton RDV secondaire · **H** · **S**

2. **Invalidité (paliers) en step 1 — employeur optionnel** · Ad2 vend paliers en &lt;3 s ; employeur first = abandon avant le hook · Blocks + `milestones` dans `CollectiveChecklistTool.jsx` · Avant : 1 Employeur → 2 Invalidité. Après : 1 Invalidité → … → Employeur optionnel · **H** · **M**

3. **Gate doux « livret en main » en tête d’outil** · Sans PDF RH, insight creux → pas de RDV qualifié · Intro outil + ancre FAQ Q2 `campagneAdsLandings.js` · Avant : checkbox en bas. Après : callout sticky + lien « Où est mon livret ? » · **H** · **S**

4. **Titre / promesse hero = mythe Ad1 + paliers** · Drop émotionnel ads→page · `campagneAdsLandings.js` slug `assurance-collective` ~L329–341 · Avant : « Ce que… t’offre ». Après : « Ton assurance collective te couvre… vraiment ? » + promesse paliers / 15 min si flou · **H** · **S**

5. **Insights émotionnels sur ResultCards « À trouver »** · « À trouver » = statut tech ; phrase délai/réclamation = objection Ad1 *dans* l’outil · details ~L192–222 + accents `displayOrDash` · Avant : hint livret plat. Après : phrase concrète (délai / départ / dentaire) · **M** · **S**

6. **FAQ paliers + micro-process « 15 min + livret »** · Ad2 silencieux en FAQ ; anxiété RDV ↓ · `faq[]` + bandeau sous outil / `ctaHeadline` data · Avant : 3 FAQ. Après : + « Court vs long terme — pourquoi deux % ? » + 3 lignes déroulé RDV · **M** · **S**

7. ***(Shell)* Dual CTA hero : outil d’abord, RDV soft** · Ad3 « checklist avant RDV » cassé par CTA unique · `CampagneAdsLanding.jsx` ~L62–88 · Avant : seul « Réserver 15 minutes ». Après : primaire scroll `#outil` + secondaire RDV · **H** · **M**

8. ***(Shell)* Mid-CTA branché data (`ctaHeadline` / `ctaSubline`) mode RDV** · Soft close froid post-outil · `CampagneAdsLanding.jsx` ~L181–187 + props data · Avant : « Prêt à clarifier ta situation ? ». Après : « Des cases encore floues ? On ouvre le livret ensemble. » · **M** · **S**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Ce que ton assurance collective t’offre | Ton assurance collective te couvre… vraiment ? |
| Promesse | Ouvre ton livret. Remplis les cases. Tu repars avec un mini résumé clair… en PDF, à garder. | Ouvre le PDF RH. Coche invalidité (un % ou plusieurs paliers), vie, départ. Mini résumé sans compte — 15 min seulement si une case reste floue. |
| Soft close post-outil | Prêt à clarifier ta situation ? / 15 minutes… résumé | Des cases vides ou un % qui te chicotte ? 15 min, on ouvre le livret ensemble — zéro pression. |
| CTA label | Réserver 15 minutes *(hero primaire)* | Hero primaire : Remplir la checklist · secondaire : Ou 15 min · Outil : Démêler mes cases floues (15 min) |
| 1 ligne confiance | *(absente hors disclaimer)* | Conseiller en sécurité financière · Victoriaville · éducatif — le livret prime toujours. |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer (**`missingCount` / cards warn** + phrase émotionnelle)
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax (footer outil, pas seulement mid page)
- [ ] La page a une identité visuelle du **sujet** (livret / employé — pas template clone orbs)
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book (*cases floues + livret, pas vente PME*)

---

## 8. Notes agent

**Sources :**
- Live : https://www.pierreoliviercaouette.ca/campagnes/assurance-collective (snapshot + screenshot 2026-11-04) — hero navy générique, CTA RDV only, outil 0/5, ResultCards « À trouver », double PDF, mid « Prêt à clarifier… », 3 FAQ.
- `frontend/src/components/campagne/tools/CollectiveChecklistTool.jsx` (milestones, paliers, ResultCards, PDF, `hasLivret`, `statusDetail`)
- `frontend/src/data/campagneAdsLandings.js` entrée `assurance-collective` (~L329–362)
- `frontend/src/pages/CampagneAdsLanding.jsx` (hero RDV, mid hardcodé)
- `emails/campagne-meta-catalog/assurance-collective.md` (Ad1 mythe · Ad2 paliers · Ad3 checklist avant RDV)
- Capsule `frontend/src/data/apprendre/modules/assurance-collective.js` (trous / plafonds — pas fusionner avec MRa)

**Audience / conformité :** Employé + livret RH only. Interdit sémantique « ton équipe / ta PME / présentation MRa » (`#15`). Claims : pas « t’es couvert » ; livret prime ; éducatif ; titre CSF. Unique vs `#04` (trou $ revenu) / `#12` (pas de collective) / `#15` (form PME).

**Pas de commit** — rapport doc seulement.
