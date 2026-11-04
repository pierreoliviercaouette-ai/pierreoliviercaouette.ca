# [#04] Assurance invalidité — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/assurance-invalidite`  
**Persona :** Salarié 28–45 ans, assurance collective RH cochée à l’embauche, livret jamais vraiment ouvert. Objection #1 : « Ma collective me suffit. »  
**CTA :** RDV Bookings  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 6  
**Score « effet WOW » outil (1–10) :** 7  
**Score envie de booker après la page (1–10) :** 5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta (Ad1 « mon assurance collective me suffit »). Le titre me parle tout de suite — c’est exactement mon mythe. En 3 secondes je vois « 500 $ » de trou et « 90 j d’attente » : ça chicotte. Je scrolle, j’ajuste les chiffres… le coussin à **9 600 $** me frappe plus fort que le 500 $/mois. Là je suis accroché. Puis le footer me dit « Télécharge le PDF et compare avec ton livret » — mon cerveau bascule en mode « je le ferai ce soir » (je le ferai pas). Le bandeau mid « Prêt à clarifier ta situation ? » sonne générique après un insight aussi perso. La note sur la définition d’invalidité (« ta job » vs « n’importe quelle job ») me laisse un doute utile… mais sans CTA collé dessus. FAQ : 2 questions, rien sur la durée ni la définition. Je bookerais **peut-être** — surtout si j’avais mon livret sous la main et un bouton « Clarifier mon trou en 15 min » juste sous le 9 600 $. Aujourd’hui : wow outil oui, bridge booker faible. Probabilité réelle ~35 %.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge Invalidité · H1 « Si le salaire s’arrête… » · promesse %, délai, trou · CTA blanc « Réserver 15 minutes » · fond `PageHero` navy/gradient générique | Reconnaissance (« c’est mon ad ») + légère méfiance (déjà booker avant d’avoir vu) | **Fuite Ad3** : ads disent « vois le trou avant le RDV » → hero pousse le calendrier. Opportunité : CTA secondaire « Voir mon trou » → `#outil`. Atmosphère = template, pas livret/paie. |
| 3–15 s En bref | 3 cards numérotées : % + délai / trou mensuel / coussin 30–90 j | Confiance légère — vocabulaire ads aligné | OK mais card soup. Opportunité : 1 ligne process « 4 chiffres → trou + coussin → livret 15 min ». |
| Première interaction outil | Snapshot déjà live : **500 $** trou, barre 84 %, « 2 700 $/mois via collective · 90 j ». Puis 4 champs (4500 / 60 % / 90 j / 3200). Pas de chips délai. | « Damn, déjà un chiffre » — aha rapide | Defaults dramatiques = WOW immédiat. Sans livret, 60 % / 90 j restent un guess → insight « générique ». **Manque presets 30/90/120.** |
| Climax résultat | Block 2 : collective 2 700 $ · trou 500 $ (ambre) · coussin **9 600 $** (ambre full-width) + note définition | Pic émotionnel sur le coussin ; doute sur « suis-je vraiment couvert ? » | Double climax Ad1+Ad2 présent. Snapshot ne met en hero que le trou — coussin sous-pondéré en haut. |
| Après le climax (PDF / CTA) | `statusDetail` : « Y’a un trou… Télécharge le PDF… » + bouton PDF only | Intention froide → souvenir PDF | **Fuite principale.** Moment booker = maintenant. Opportunité : RDV outline chiffré + PDF ghost + track `…_rdv_tool`. |
| Soft close mid / form | Bandeau navy hardcodé « Prêt à clarifier ta situation ? » / « 15 min… résumé » + CTA RDV + capsule Apprendre | Refroidissement — copy pas liée à mon 500 $ / 9 600 $ | Shell générique. Opportunité : `ctaHeadline`/`ctaSubline` invalidité (trou + livret + définition). |
| FAQ / fin | 2 FAQ (collective ailleurs ; ≠ MG) · disclaimer · contacts Victoriaville | Objections livret (définition, durée, individuelle) non ancrées | Bounce mental « j’ai compris le $ mais pas mon contrat ». +3 FAQ = leads plus chauds. |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évaluer **cette** landing, pas un conseil générique. Page live lue : https://www.pierreoliviercaouette.ca/campagnes/assurance-invalidite

### Hero
- Composition (brand, titre, promesse, CTA) : H1 **fort et aligné Ad1** — meilleur signal de la page. Brand = nav + badge « Invalidité » ; hors nav, ça pourrait être n’importe quel CSF (gradient orbs `PageHero`). CTA unique RDV blanc = trop tôt vs promesse outil.
- Atmosphère : ça ne « sent » pas le salaire qui coupe / le livret RH / le bureau. Pas d’image paie, envelope, ou mock trou. Ton sérieux OK, ancrage sujet faible.
- Motion / présence : hero statique ; dans l’outil, barre couverture `transition-all duration-500` (1 mouvement utile). Pas de 2ᵉ motion d’entrée sur le chiffre trou/coussin.
- Mobile : pouce OK sur CTA hero ; long scroll avant soft close mid ; footer PDF full-width = primaire visuel avant tout RDV outil.

### Corps de page
- Hiérarchie : En bref = 3 cards (soup légère). Outil = meilleure composition (snapshot → steps → cards). Une job / section globalement respectée.
- Confiance : téléphone / courriel / Victoriaville en bas seulement. Pas de photo conseiller, pas de ligne CSF sous hero, pas d’aperçu « à quoi ressemble le PDF / livret ».
- Densité : outil dense mais lisible ; Block 2 redondant avec snapshot (collective + trou répétés).
- Ce qui manque pour un rendu **pro / premium** (liste concrète) :
  1. Hero thématique (paie / livret / bureau — **pas** hôpital) full-bleed + overlay navy
  2. Process 3 steps 1 ligne sous En bref
  3. Duo snapshot Trou | Coussin (même poids typo)
  4. Soft close mid chiffré (pas le bandeau clone catalogue)
  5. Ligne confiance « Conseiller · Victoriaville · éducatif »

### Soft close / form
- Mid RDV digne d’un RDV payé en attention ? Non — microcopy générique, zéro citation de mon résultat. Réassurance « sans pression » OK mais interchangeable avec #05/#08/#14.

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. Hero orbs génériques → photo bureau/livret QC full-bleed + H1 gardé + CTA secondaire « Voir mon trou » `#outil`
2. Snapshot 1 chiffre (trou) → duo égal **Trou / mois** | **Coussin d’attente** (ambre si warn)
3. Mid navy « Prêt à clarifier… » → « Ton trou vs dépenses, c’est clair sur papier » + subline livret/définition

---

## 3. Audit OUTIL interactif (cœur du WOW)

Fichier : `frontend/src/components/campagne/tools/InvaliditeTool.jsx`  
Defaults L104–108 · calculs L115–123 · snapshot L193–230 · Block 2 L285–323 · PDF L131–178 · footer L186–191

Scénario mental defaults : revenu 4 500 $ · 60 % · 90 j · dépenses 3 200 $ → collective **2 700 $** · trou **500 $** · couverture **84 %** · coussin **9 600 $**.

### Première impression outil
- En <10 s : oui — titre shell « Le trou entre ton assurance collective et tes dépenses » + snapshot live = clair ce que je gagne.
- Defaults : aident l’aha (trou + coussin visibles sans geste). Risque : dramatize un peu (500 $ / 9 600 $) → scepticisme « c’est vos chiffres, pas les miens » si je n’ai pas le livret.

### Moment « wow »
- Chiffre qui devrait me faire dire « damn » : le **coussin 9 600 $** (Ad2) autant que le trou 500 $ (Ad1).
- Assez grand ? Coussin en `text-2xl` full-width — oui. Assez narré ? Detail « 90 jours sans chèque × dépenses » = bon. Assez personnel ? Seulement si j’ai touché *mes* champs.
- Manque pour désir de parler à quelqu’un : pont RDV qui cite **mes** deux chiffres + invitation livret (%, délai, définition) — aujourd’hui next step = PDF.

### Friction outil
- Champ carence libre sans chips 30/90/120 → Ad2 « Combien tient l’attente ? » sous-joué
- Hint livret faible (« souvent entre 50 et 70 % ») vs mode « Pas le livret ? »
- Block 2 répète snapshot → scroll fatigue mobile
- PDF ASCII (`Resume`, `entrees`, `Resultats`, `cheque`) = polish amateur
- Si `!gapWarn` (marge OK) : tone émeraude « t’es correct » + PDF — **ferme** l’objection Ad1 alors que la note définition dit le contraire

### Après le résultat
- Next step naturel ≠ booker. Next step codé = télécharger PDF. Mid page trop loin émotionnellement.

**Note outil WOW /10 :** 7  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. Footer PDF only → RDV outline « ~{trou} $/mois · ~{coussin} $ à tenir. On ouvre ton livret en 15 min. » + PDF ghost — `InvaliditeTool.jsx` footer L186–191 + `buildCampagneRdvPath` / `trackRendezVousClick('campagne_assurance-invalidite_rdv_tool')`
2. Input carence seul → chips **30 · 90 · 120** + hint « Pas le livret ? Pars de 60 % / 90 j » — sous `NumberField` `invalidite-carence` L261–271
3. `statusDetail` gapWarn → pousse PDF ; `!gapWarn` → « $ OK ; définition + durée = 15 min » + CTA soft — L125–129
4. Snapshot trou seul → duo Trou | Coussin même hiérarchie — L193–230
5. PDF accents + note « Prochaine étape : 15 min livret (%, délai, définition). Aucun % promis. » — `handleDownload` L131–178

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « Ma collective me suffit — RH l’a vendue comme ça. » (mythe Ad1 ; outil peut *confirmer* si marge ≥ 0)
2. « J’ai pas mon livret / je connais pas mon % ni mon délai. » → insight = guess → moins urgent de booker *mon* contrat
3. « Même si les $ passent, est-ce que je suis vraiment couvert ? » (définition / durée / exclusions) — note oui, FAQ/CTA non

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve / clarté / urgence douce / « on le fait ensemble » / peur de mal faire seul : peur de mal lire le livret + coussin chiffré + promesse « on ouvre le livret ensemble, zéro pitch »
- Phrase de soft close idéale (québécois) qui cite **mon** résultat :  
  « T’as ~500 $ de trou par mois et ~9 600 $ à tenir pendant l’attente. En 15 min on valide ça avec ton livret — le %, le délai, pis la définition d’invalidité. Sans pression. »

### Ce qui me fait fuir
- CTA RDV avant d’avoir joué (Ad3 dissonance)
- « Télécharge le PDF » comme seul next step (intention différée)
- Soft close mid clone catalogue
- Message émeraude « t’es correct » qui tue le doute définition
- PDF sans accents = vibe amateur après un insight sérieux

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Soft close RDV au climax trou/coussin (PDF secondaire)** · Je booke au pic émotionnel, pas « ce soir avec le PDF » · `InvaliditeTool.jsx` footer L186–191 + `statusDetail` L125–129 · Avant : status + PDF primary. Après (si `gapWarn \|\| coussin > 0`) : « ~{trou} $/mois · ~{coussin} $ à tenir. On ouvre ton livret en 15 min. » + bouton outline RDV `…_rdv_tool` ; PDF ghost · **H** · **S**

2. **Chips délai 30 / 90 / 120 + hint « Pas le livret ? »** · Je « joue » le scénario Ad2 → insight = *mon* attente → envie de valider le livret · `InvaliditeTool.jsx` sous `invalidite-carence` L261–271 (+ chip 60 % optionnel sur `pctCollective`) · Avant : input numérique opaque. Après : chips sélection visuelle + « Pars de 60 % / 90 j — on ajuste en RDV » · **H** · **S**

3. **État marge OK (`!gapWarn`) → objection définition/durée, pas « t’es correct »** · L’outil arrête de fermer mon mythe ; il ouvre la vraie peur contrat · `statusDetail` + bandeau sous note définition L317–322 · Avant : « Sur papier… couvre… Garde le PDF ». Après : « Les $ tiennent sur papier. Reste la définition et la durée dans ton livret — c’est souvent ça qu’on clarifie en 15 min. » + CTA soft · **H** · **S**

4. **Soft close mid landing spécifique invalidité** · Continuité émotionnelle post-outil → je clique sans sentir le template · `campagneAdsLandings.js` (`ctaHeadline`/`ctaSubline`) + brancher path RDV dans `CampagneAdsLanding.jsx` L181–187 *(shell — 1/2)* · Avant : « Prêt à clarifier ta situation ? ». Après : « Ton trou vs dépenses, c’est clair sur papier. » / « 15 min : %, délai, définition (“ta job” vs “n’importe quelle job”). » · **H** · **S–M**

5. **Snapshot duo Trou | Coussin (même poids Ad1+Ad2)** · Les deux moments ads deviennent impossibles à manquer → double raison de booker · `InvaliditeTool.jsx` L193–230 · Avant : 1 grand trou + barre. Après : split « Trou / mois » + « Coussin d’attente » ; barre couverture en 3ᵉ ligne · **M** · **S**

6. **FAQ +3 (définition, durée max, individuelle vs collective)** · Mes peurs livret ont une ancre → lead plus chaud au show · `campagneAdsLandings.js` `faq[]` slug `assurance-invalidite` L58–68 · Avant : 2 FAQ. Après : + « définition ta job vs any job » ; + « prestations jusqu’à ? » ; + « individuelle en plus de la collective » · **M** · **S**

7. **PDF FR + next-step livret/RDV** · Le souvenir hors page me rappelle de booker, pas juste d’archiver · `InvaliditeTool.jsx` `handleDownload` L131–178 · Avant : `Resume`/`entrees`/`cheque`. Après : accents FR + note « Prochaine étape : 15 min pour valider %, délai, définition. Aucun % promis comme garantie. » · **M** · **S**

8. **Hero outil-first (scroll `#outil`) + RDV secondaire** · Aligné Ad3 « vois le trou avant le RDV » → moins de bounce post-clic · `CampagneAdsLanding.jsx` `PageHero` CTA L79–88 *(shell — 2/2)* · Avant : seul CTA « Réserver 15 minutes ». Après : primary « Voir mon trou » → `#outil` ; secondary « Réserver 15 minutes » · **M** · **S**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Si le salaire s’arrête : le trou de ton assurance collective | **Garder** (meilleur hook Ad1) |
| Promesse | Voir ce que ton assurance collective t’offre vraiment — %, délai, et le trou vs tes dépenses qui continuent. | Quatre chiffres — tu vois le trou vs tes dépenses, et ce qu’il faut tenir pendant l’attente. Sans compte. |
| Soft close post-outil | Y’a un trou vs tes dépenses. Télécharge le PDF et compare avec ton livret. | ~{trou} $/mois à combler · ~{coussin} $ à tenir. On ouvre ton livret en 15 min — %, délai, définition. |
| CTA label | Réserver 15 minutes | Réserver 15 minutes *(outil : « Clarifier mon trou en 15 min »)* |
| 1 ligne confiance | *(absente sous hero)* | Conseiller en sécurité financière · Victoriaville · contenu éducatif — on lit ton livret ensemble |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer *(trou + coussin duo ; ambre si warn)*
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax *(footer outil, pas seulement mid page)*
- [ ] La page a une identité visuelle du **sujet** (pas template clone) *(paie/livret/bureau — pas orbs seuls)*
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book *(« son trou + son coussin → livret en 15 min »)*

---

## 8. Notes agent

**Sources (code + ads) :**
- Live : https://www.pierreoliviercaouette.ca/campagnes/assurance-invalidite (H1, En bref, outil defaults 500 $ / 9 600 $, footer PDF, mid générique, 2 FAQ — observé 2026-11-04)
- `frontend/src/components/campagne/tools/InvaliditeTool.jsx` (intégral)
- `frontend/src/data/campagneAdsLandings.js` entrée `assurance-invalidite` L45–73
- `frontend/src/pages/CampagneAdsLanding.jsx` (hero RDV, mid hardcodé L181–187)
- `emails/campagne-meta-catalog/assurance-invalidite.md` (Ad1 mythe / Ad2 délai / Ad3 avant RDV)
- Brief visuel ads : bureau / « Trou de revenu » — **éviter hôpital**

**Conformité :** aucun % de remplacement promis comme garantie ; illustration seulement ; définition / durée / exclusions = livret. Defaults dramatiques → toujours présenter comme exemple ajustable. Ne pas transformer « 90 jours » CBO en vérité universelle. Différencier de #11 (carte collective complète) et #06 (capital MG ≠ chèque de paie).

**Unique vs catalogue :** seul outil **revenu qui s’arrête** avec trio trou / délai / coussin + dépendance explicite au **livret** (définition d’invalidité).
