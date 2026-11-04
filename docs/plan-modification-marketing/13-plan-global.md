# [#13] Plan global — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/plan-global`  
**Persona :** 32–48 ans, Centre-du-Québec / QC ; a déjà « des affaires » (REER + CELI + une assurance) et croit être organisé — objection #1 : « j’ai des produits, donc j’ai un plan » / « je sais plus quoi attaquer en premier ». Perdu dans l’**ordre des priorités $**, pas dans le jargon.  
**CTA :** RDV Bookings  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 6,5  
**Score envie de booker après la page (1–10) :** 4,5

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta Ad1 (« produits ≠ plan ») : le titre « Arrêter d’empiler des produits sans plan » me parle tout de suite — je me reconnais. Le hero navy est propre, mais le gros bouton blanc dit « Réserver 15 minutes » alors que l’ad me promettait un outil gratuit sans formulaire : je freine. Je scrolle, les 3 cartes « En bref » me vendent surtout des features (coche / ordre / PDF), pas le soulagement « arrêter de tout faire un peu ». Je coche 3–4 situations : boom — « Commence ici · 1. Mettre de l’argent de côté » avec le why. Là j’accroche vraiment : quelqu’un range mon chaos. Puis… rien. Pas de « on ancre ce n°1 ». La barre me dit 43 % comme si j’avais « progressé » alors que j’ai juste révélé plus de trous. Le reste tombe en liste plate 2–3–4, alors qu’on m’avait promis urgent → important → plus tard. Le footer me pousse le PDF. Je télécharge peut‑être, je booke rarement — le soft close mid « Prêt à clarifier ta situation ? » est trop générique après un n°1 aussi personnel. Verdict : insight fort, désir de RDV faible parce que le climax n’est pas monétisé.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge « Vision globale », H1 empiler≠plan, promesse feuille de route, CTA blanc RDV | Reconnaissance Ad1 + doute (« déjà un RDV ? ») | Fuite Ad2/Ad3 outil-first ; WOW manqué = CTA primaire `#outil` |
| 3–15 s En bref | 3 cartes blanches : coche / ordre / PDF | « OK mode mode d’emploi » | Opportunité : outcomes anti-tout-à-la-fois ; atmosphère « chemin 1→2→3 » absente |
| Première interaction outil | 0/7 + 0 % + 7 SoftCheck avec hints ; résultat vide en bas | Curiosité, un peu de scroll fatigue mobile | Opportunité : pastille « Ordre prêt » dès 1ʳᵉ coche ; hints en `<details>` mobile |
| Climax résultat | Bloc « Commence ici » + `1. {order}` + why ; `rest` en `<ol>` plate | Relief / « damn, c’est ça mon n°1 » | **Meilleur WOW de la page** — non monétisé (pas de RDV, pas de paliers U/I/P) |
| Après le climax (PDF / CTA) | Notes optionnelles → `statusDetail` « Télécharge le PDF… » → bouton PDF | Habitude « j’ai fini = fichier » | Fuite PDF-first ; WOW = soft close « Ton n°1 : {order} — 15 min » immédiat |
| Soft close mid / form | « Prêt à clarifier ta situation ? » + RDV + Apprendre | Refroidissement — copy générique catalogue | Fuite ; WOW = « Tu as un n°1 — on l’attaque ensemble ? » + cite l’ordre |
| FAQ / fin | 3 Q (durée / pourquoi ordre / produits) ; disclaimer ; contact Victoriaville en footer | Neutre, un peu froid | Opportunité FAQ « Je peux juste l’outil ? » + « C’est un plan perso ? » (Non — brouillon) |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évaluer **cette** landing, pas un conseil générique. Live : https://www.pierreoliviercaouette.ca/campagnes/plan-global (2026-11-04).

### Hero
- Composition : badge + H1 fort (match Ad1) + promesse OK + **un seul** CTA RDV. Brand « Pierre-Olivier » dans la nav, pas en signal hero — composition catalogue standard. Gradient navy + grille + vague = template shell, pas « feuille de route / ordre d’attaque ».
- Atmosphère : ça sent le **conseiller pro** (navy prestige), pas assez le sujet « perdu dans les priorités $ » (tiroir de produits, chemin numéroté, chaos→ordre). Brief ads « Vision globale · Ordre d’attaque » non matérialisé hors badge.
- Motion / présence : vague/transition hero ; barre % outil `duration-500` ; **0 micro-motion** sur l’apparition « Commence ici ». Budget motion utile ≈ 1.
- Mobile : H1 lisible ; CTA pouce OK ; ensuite 7 cases + hints = long scroll avant le climax.

### Corps de page
- Hiérarchie : En bref = 3 cards features (card soup légère) ; outil = job claire ; mid = bandeau navy générique. Une job/section globalement OK.
- Confiance : photo conseiller / titre CSF / Victoriaville **absents** au-dessus du fold (Victoriaville seulement SEO + footer contact). Process « Coche → Ordre → 15 min optionnel » non visualisé hors bullets.
- Densité : hero aéré ; outil un peu dense (barre + 7 items + résultat + notes + PDF) ; entre climax et mid, notes + PDF freinent.
- Ce qui manque pour un rendu **pro / premium** :
  1. Motif / strip « chemin 1 → 2 → 3 » (feuille de route) dans ou sous le hero
  2. Paliers Urgent / Important / Plus tard **visibles** dans le résultat (pas une `<ol>` plate)
  3. Soft-close strip collé sous « Commence ici » (n°1 hero typographique + CTA)
  4. Ligne confiance « CSF · Victoriaville · 15 min exploratoire »
  5. Process strip landing (3 étapes outcomes, pas features outil)

### Soft close / form
- Mid « Prêt à clarifier… » : digne d’un catalogue, **pas** d’un RDV payé en attention après un n°1 nommé. Microcopy ne cite jamais mon ordre. Réassurance soft ads (« soft, zéro pitch ») diluée.

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. Hero : CTA blanc RDV seul → primaire « Voir mon ordre d’attaque » (`#outil`) + secondaire texte RDV ; option motif étapes 1-2-3 en fond.
2. Résultat outil : liste plate `rest` → n°1 dominant + badges sections Urgent / Important / Plus tard.
3. Sous « Commence ici » : vide → bandeau soft « Ton n°1 : {order}. 15 min pour l’ancrer — soft, zéro pitch. » + bouton RDV.

---

## 3. Audit OUTIL interactif (cœur du WOW)

Fichier : `frontend/src/components/campagne/tools/PlanGlobalTool.jsx`  
(`ITEMS` L10–60 · `PRIORITY_IDS` L63–71 · `statusDetail` L81–92 · barre % L131–216 · « Commence ici » L260–268 · `rest` L270–291 · footer PDF L187–195)

### Première impression outil
- En <10 s : oui — « coche → ordre urgent→important→plus tard » (intro L185). Clair.
- Defaults : tout décoché = bon (pas de spoiler). Aha dépend du geste user — correct pour un hub.

### Moment « wow »
- Chiffre / état : pas un $, un **rang** — « Commence ici · 1. {first.order} » + `why`. Ex. « Mettre de l’argent de côté — Filet d’abord… ».
- Assez grand ? `text-xl/2xl` — correct. Assez narré ? why 1 ligne — OK. Assez personnel ? oui (mes coches → mon n°1).
- Manque pour désir de parler : (1) CTA RDV collé au n°1, (2) paliers U/I/P promis, (3) pont « approfondir » vers campagne fille, (4) copie qui dit « on colle ça à ta vraie vie » au lieu de « télécharge le PDF ».

### Friction outil
- Barre `progress = doneCount/7` : plus de problèmes cochés = % plus haut → lit comme score de réussite (sémantique inversée).
- 7 hints toujours visibles = scroll fatigue mobile avant climax.
- Ordre UI des cases (`ITEMS`) ≠ `PRIORITY_IDS` (hypo avant revenu à l’écran) — correct en code, opaque pour l’user.
- PDF ASCII (`Resume`, `educative`, `coche`) = polish pro ↓ au trophy moment.
- Gaps vs ads : Ad2/Ad3 vendent « urgent / important / plus tard » + « essaie avant de booker » — UI = liste plate + hero RDV-first + PDF-first.

### Après le résultat
- Next step naturel aujourd’hui = **PDF** (`statusDetail` 1 coche : « Télécharge le PDF et commence par le n°1 »).  
- Devrait être = ancrer le n°1 (RDV soft) ; PDF = « garder l’ordre ».

**Note outil WOW /10 :** 6,5  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. Soft-close sous L260–268 — Avant : n°1 orphelin → Après : CTA « Ton n°1 : {first.order} — 15 min » + `trackRendezVousClick('campagne_plan-global_rdv_outil')` · `PlanGlobalTool.jsx`
2. Paliers U/I/P — Avant : `rest` `<ol>` plate L270–291 → Après : buckets Urgent / Important / Plus tard (map près de `PRIORITY_IDS`) · même fichier
3. Barre % → compteur — Avant : `3/7` + `43 %` L198–216 → Après : `3 cochées · Ordre prêt` · même fichier
4. `statusDetail` PDF-first → n°1/RDV — Avant L85–86 « Télécharge le PDF… » → Après « Ton n°1 est clair. PDF pour garder — ou 15 min pour coller ça à ta vie. » · L81–92
5. Deep-link hub → fille — Avant : texte seul → Après : map id→slug (ex. `fondsUrgenceFaible` → `/campagnes/fonds-urgence`) « Approfondir ce point → » sous n°1 · `PlanGlobalTool.jsx` (unique vs catalogue)

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « J’ai déjà REER + CELI + assurance = je suis organisé » (mythe Ad1 — titre OK, peu rejoué après).
2. « Faut un RDV pour avoir une vision globale » / inverse Ad3 : « pourquoi me demander un RDV dès le hero si l’outil suffit ? »
3. « C’est un plan personnalisé / vente déguisée » — disclaimer OK ; FAQ n’a pas « outil seul suffit » ni « pas un plan sur mesure » en Q dédiée.

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve / clarté / urgence douce / « on le fait ensemble » / peur de mal faire seul : mon n°1 nommé + phrase « sans toi je vais encore tout faire un peu » + 15 min pour ancrer (pas vendre une pile).
- Phrase de soft close idéale (québécois) qui cite **mon** résultat :  
  « Ton n°1, c’est *Mettre de l’argent de côté*. 15 minutes, soft — on le colle à ta vraie vie. Zéro pitch, zéro pile de produits. »

### Ce qui me fait fuir
- Hero RDV avant l’outil (dissonance ads) ; PDF comme trophée final ; mid générique ; % qui « récompense » mes problèmes ; liste plate après la promesse U/I/P ; aucun visage / preuve locale au fold.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Soft-close RDV collé sous « Commence ici » (n°1)** · Le pic émotionnel (« damn, c’est mon n°1 ») devient un désir de parler, pas un PDF · `PlanGlobalTool.jsx` après L260–268 · Avant : climax → liste → notes → PDF · Après : même bloc + « Ton n°1 : {first.order}. 15 min pour l’ancrer — soft, zéro pitch. » + `buildCampagneRdvPath` / `…_rdv_outil` · **H** · **S**

2. **Visualiser Urgent / Important / Plus tard** · Je *vois* la pédagogie vendue par l’ad — l’ordre devient un insight, pas une todo list · `PlanGlobalTool.jsx` L270–291 + buckets près de `PRIORITY_IDS` · Avant : `<ol>` plate · Après : n°1 hero + 3 paliers · **H** · **M**

3. **Inverser `statusDetail` + footer (PDF secondaire)** · Le next step mental = ancrer le n°1, pas « j’ai mon fichier » · L81–92 + footer L187–195 · Avant : « Télécharge le PDF et commence par le n°1 » · Après : « Ton n°1 est clair… 15 min ou PDF pour garder » ; dual bouton RDV filled / PDF outline · **H** · **S**

4. **Hub → deep-link campagne fille selon le n°1** · Si je ne booke pas, je reste dans le funnel (filet, invalidité, hypo…) au lieu de rebondir · sous L260–268 map `id → slug` · Avant : n°1 orphelin · Après : « Calculer mon filet → » `/campagnes/fonds-urgence` (éducatif) · **H** · **M**

5. **Corriger la barre « X % » (sémantique inversée)** · Je sens l’*ordre*, pas un faux score de progression · L131–133, L198–217 · Avant : `3/7` + `43 %` + barre · Après : `3 cochées · Ordre prêt` + microcopy « Urgent d’abord — pas un score » · **M** · **S**

6. **Mid-CTA + En bref = outcomes « ordre », pas features** · Après l’outil, le bandeau rejoue *mon* n°1 / anti-tout-à-la-fois · `campagneAdsLandings.js` `plan-global` + props `ctaHeadline`/`ctaSubline` shell RDV · Avant : « Prêt à clarifier ta situation ? » + bullets coche/ordre/PDF · Après : « Tu as un n°1 — on l’attaque ensemble ? » / bullets soulagement · **M** · **S** *(shell générique #1 — pattern catalogue)*

7. **Hero outil-first (match Ad2/Ad3) + ligne confiance** · Je ne freine plus au premier viewport ; confiance CSF/Victoriaville · data landing + `CampagneAdsLanding` / `PageHero` · Avant : CTA unique RDV · Après : primaire « Voir mon ordre d’attaque » `#outil` ; secondaire RDV ; « CSF · Victoriaville · 15 min exploratoire » · **M** · **S** *(shell générique #2 — max 2)*

8. **Event `tool_result` 0→1 + FAQ conversion** · Mesurer qui a vu le n°1 ; tuer objections « outil seul / plan perso » · `PlanGlobalTool.jsx` (`useEffect` `doneCount`) + `faq[]` · Avant : silence post-coche ; 3 FAQ · Après : `select_content` `campagne_plan-global_result` ; FAQ « Je peux juste l’outil ? » / « C’est un plan personnalisé ? » → Non, brouillon · **M** · **S**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Arrêter d’empiler des produits sans plan | **Garder** (match Ad1 — recognition immédiate) |
| Promesse | Des produits côte à côte ≠ une feuille de route. Coche ce qui est vrai — on te propose un ordre d’attaque. | Des produits côte à côte, c’est un tiroir — pas une feuille de route. Coche : on range urgent → important → plus tard. |
| Soft close post-outil | *(absent sous n°1)* / mid : Prêt à clarifier ta situation ? | Ton n°1 : {order}. 15 min pour l’ancrer à ta vraie vie — soft, zéro pitch. Tu peux apporter ton PDF. |
| CTA label | Réserver 15 minutes | Hero primaire : « Voir mon ordre d’attaque » ; post-n°1 / mid : « Ancrer mon n°1 — 15 min » |
| 1 ligne confiance | *(absente au fold)* | Conseiller en sécurité financière · Victoriaville · 15 min exploratoire, pas une vente de pile |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax
- [ ] La page a une identité visuelle du **sujet** (pas template clone)
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book

*(Aujourd’hui : climax OK si on a scrollé ; CTA post-climax = PDF ; identité = shell navy générique ; ami comprendrait « checklist + PDF », pas « je booke pour ancrer mon n°1 ».)*

---

## 8. Notes agent

**Sources :** `PlanGlobalTool.jsx` (~326 L) ; `campagneAdsLandings.js` slug `plan-global` (~L394–428) ; `CampagneAdsLanding.jsx` mid hardcodé « Prêt à clarifier… » ; `emails/campagne-meta-catalog/plan-global.md` (Ad1–Ad3 + brief) ; live https://www.pierreoliviercaouette.ca/campagnes/plan-global (hero navy, En bref 3 cards, outil 0/7, mid générique, FAQ×3 — observé 2026-11-04).

**Persona $ :** perdu dans l’**ordre des priorités**, pas dans un écart chiffré — le WOW est un **rang** (« Commence ici »), pas un montant. Vs `#08` fonds urgence / calculateurs : ici monétiser le n°1, pas un $.

**Unique catalogue :** seul hub cross-sujets ; `PRIORITY_IDS` encode déjà filet→dettes→salaire→hypo→épargne→projet→succession — l’UI ne montre pas les paliers. Aucun autre `*Tool.jsx` ne deep-link `/campagnes/…`.

**Conformité :** garder disclaimers éducatif / pas plan sur mesure (outil + PDF). Ne jamais claim « ton plan personnalisé en 2 clics ». Deep-links filles = libellés éducatifs seulement. Soft close = exploratoire, pas vente de pile.

**Pas de commit** (demande explicite).
