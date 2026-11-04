# [#12] Travailleur autonome — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/travailleur-autonome`  
**Persona :** Autonome 28–45 ans, revenu variable (facturation / contrats). Objection #1 : « Les bons mois font oublier les mauvais — je me débrouillerai, j’ai pas de RH. »  
**CTA :** RDV Bookings  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 6  
**Score « effet WOW » outil (1–10) :** 5,5  
**Score envie de booker après la page (1–10) :** 5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta (Ad1 « pas de collective fournie » ou Ad2 « revenu variable »). Le titre me parle tout de suite — « pas d’assurance collective fournie » = exact. La promesse est un peu molle (« Voir ce qui est en place… ») vs mon clic « les bons mois font oublier les mauvais ». Le bouton hero me pousse à booker avant d’avoir touché la checklist — Ad3 m’avait dit « Essaie d’abord ». En bref est clair (ordre liquidité → revenu). Dans l’outil, je vois d’abord « À construire / Fonds d’urgence » et un PDF, **avant** les cases — sur mobile je scrolle pour cocher, l’insight « Mince » est hors écran pendant que je coche. Je coche urgence = non, factures = non → peur mois mauvais réelle, mais le texte répète « pas de collective » plus que « si un mois tombe à zéro ». Soft close mid = « Prêt à clarifier ta situation ? » générique — zéro lien avec mon trou #1. Je downloadrais le PDF. Je bookerais **seulement** si une case me chicotte vraiment et que quelqu’un m’offre « Clarifier : Fonds d’urgence en 15 min » — aujourd’hui ce pont n’existe pas. Verdict : page honnête, outil utile, WOW émotionnel dilué, bridge RDV cassé.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge Autonome + H1 « pas d’assurance collective fournie » + promesse « prochaines étapes » + CTA blanc « Réserver 15 minutes » | Reconnu (Ad1) ; légère pression RDV trop tôt | **Opportunité :** primaire = « Coche ton filet » `#outil` ; garder H1. **Fuite :** Ad3 « sans RDV » → bounce |
| 3–15 s En bref | 3 cartes : collective / ordre liquidité→revenu / checklist+PDF | Confiance structure | Ordre = bon. Manque « revenu variable / mois mauvais » en #1 émotionnel |
| Première interaction outil | Progression 0/7 → bloc « Ton filet : À construire » + PDF → **puis** 4 piliers / 7 cases plus bas | Curiosité → confusion scroll | **Fuite UX :** insight au-dessus des cases (yo-yo mobile). WOW latent = cocher → voir trous |
| Climax résultat | Après 1–2 non : État `Mince`, Prochaine étape ambre « Fonds d’urgence », liste Trous (si doneCount>0) | « Damn, mon filet est mince » — **si** je remonte voir le bloc | Climax mécanique fort, **mal placé** + copy collective > mois mauvais |
| Après le climax (PDF / CTA) | Double « Télécharger mon PDF » (haut + footer) ; footer = statusDetail + PDF ; **aucun RDV dans l’outil** | Trophy PDF, pas conversation | Fuite trophée. Soft RDV sur `nextItem.short` manquant |
| Soft close mid / form | Navy « Prêt à clarifier ta situation ? » + Réserver 15 min + capsule invalidité | Froid / générique | Rupture vs trou liquidité. Capsule invalidité = tunnel revenu alors que trou #1 = urgence |
| FAQ / fin | 2 FAQ (collective vs perso ; par où commencer) + disclaimer CSF | OK mais court | Absents : sans compte ? / tu vends ici ? (Ad3) |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

### Hero
- Composition : Badge + H1 fort (distincteur « pas de collective ») + promesse + 1 CTA. Brand = shell PageHero (navy gradient orbs) — **template catalogue**, pas atmosphère « autonome sans RH / facturation ».
- Atmosphère : sent le message match Ad1 en **texte**, pas en image (pas de desk solo, factures, absence de badge employeur). Brief créa navy ads non porté sur la page.
- Motion : progress bar outil OK ; hero = quasi 0 mouvement utile (fade bullets générique shell).
- Mobile : H1 lisible ; CTA pouce OK ; mais CTA = RDV froid ≠ geste ads.

### Corps de page
- Hiérarchie : En bref 3 jobs claires → outil dense (résultats + 4 piliers + notes) → mid → FAQ. Un peu de **card soup** dans En bref + ResultCards + mini-piliers (même poids).
- Confiance : titre CSF / disclaimer footer OK ; **pas** de photo conseiller, pas de ligne Victoriaville au-dessus du fold, pas de « déroulement 15 min ».
- Densité : outil chargé (bon pour checklist) ; entre climax et mid = PDF + notes + footer = zone morte émotionnelle.
- Manque pour **pro / premium** :
  1. Identité visuelle TA (revenu irrégulier / pas de RH) hors texte
  2. Bandeau process 4 steps (Coche → ordre → PDF → 15 min si chicotte)
  3. Soft-close strip **dans** l’outil sous Trous
  4. Une seule CTA PDF (footer) ; insight sans bouton égal
  5. Ligne confiance locale sous mid

### Soft close / form
- Mid navy générique = pas digne d’un RDV payé en attention Meta. Microcopy n’cite ni filet `Mince` ni case #1. Pas de « Clarifier ≠ acheter » (pourtant dans Ad1).

**Note visuelle /10 :** 6,5  
**3 upgrades visuels WOW (Avant → Après) :**
1. **Hero CTA** — Avant : seul « Réserver 15 minutes ». Après : primaire blanc « Coche ton filet » → `#outil` ; secondaire texte « Ou 15 min si tu préfères ».
2. **Ordre outil** — Avant : « Ton filet » + PDF au-dessus des cases. Après : Progression → checklist piliers → insight « Ton filet » collé sous la dernière case (+ soft RDV).
3. **Atmosphère TA** — Avant : gradient orbs générique. Après : texture / motif léger « pas de badge RH » ou pictos liquidité→revenu en motion sous En bref (pas lifestyle coworking).

---

## 3. Audit OUTIL interactif (cœur du WOW)

Fichier : `frontend/src/components/campagne/tools/AutonomeChecklistTool.jsx`  
(`ITEMS` L13–70, `statusDetail` L130–142, bloc « Ton filet » L304–405 **avant** checklist L407–511)

### Première impression outil
- En <10 s : « Coche ton filet — ordre d’attaque en direct » = clair. Mais le 1er viewport outil montre **résultats vides** (« À construire ») + PDF, pas une case à cocher → gain flou jusqu’au scroll.
- Defaults : tout décoché = honnête (pas de spoiler). Bon pour ownership. Mauvais : warn « À construire » + prochaine étape déjà affichée **avant** geste.

### Moment « wow »
- Chiffre / état qui devrait faire « damn » : **`filetValue = Mince`** + **`nextItem.short`** ambre (ex. Fonds d’urgence) + trou #1 « en premier ».
- Aujourd’hui : assez narré mécaniquement, **pas assez personnel** (pas de « si ton prochain mois est mauvais ») et **pas assez collé** à l’action de cocher (position UX).
- Manque pour désir de parler : CTA « Clarifier : {nextItem.short} en 15 min » + « Clarifier ≠ acheter » + phrase mois mauvais dans `statusDetail` / `filetDetail`.

### Friction outil
- Scroll yo-yo résultats ↔ cases (surtout mobile)
- « Pas d’assurance collective fournie » ×4 (intro, barre, statusDetail, filetDetail) → fatigue ; Ad2 revenu variable sous-joué
- Cases `vie` / `rc` toujours dans `missingOrdered` → faux trous pour solo sans hypo / métier sans RC
- Double PDF ; accents PDF cassés (`Resume`, `Etat`, `etape`)
- PDF vole la vedette dès `doneCount ≥ 6` (`statusDetail` pousse téléchargement)

### Après le résultat
- Next step naturel actuel = **PDF**, pas booker. Contredit soft close ads (« si une case te chicotte → 15 min »).

**Note outil WOW /10 :** 5,5  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Ordre checklist → insight** — Avant : L304–405 au-dessus. Après : sous L407–511. · `AutonomeChecklistTool.jsx`
2. **Soft RDV sur `nextItem`** — Avant : footer PDF only. Après : si `missingCount ≥ 1` → « Clarifier : {short} en 15 min » + track `campagne_travailleur-autonome_rdv_tool`. · même fichier + `buildCampagneRdvPath`
3. **Copy climax mois mauvais** — Avant : collective en boucle. Après : « Si un mois (ou trois) est mauvais, rien ne tombe automatiquement. Prochaine case : {next}. » · `statusDetail` / `filetDetail` / hints
4. **Toggles hypo/charges (+ RC)** — Avant : 7 cases fixes. Après : N/A ou repriorisation `vie`/`rc`. · state + `missingOrdered`
5. **1 PDF + accents FR** — Avant : double bouton + ASCII. Après : footer seul ; `Résumé` / `État` / `Prochaine étape` ; note « Apporte ce résumé aux 15 min ».

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « Les bons mois paient tout — je regarderai le filet plus tard. »
2. « Je me débrouillerai / j’ai pas besoin d’un conseiller, j’ai pas de RH donc je gère seul. »
3. « Clarifier = on va me vendre une assurance (invalidité / vie). »

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve : mon trou #1 nommé à l’écran ; urgence douce = « hypo / factures qui, elles, s’arrêtent pas » ; « on le fait ensemble » = prioriser liquidité puis revenu **sans** pitch produit ; peur de mal faire seul = pas de collective, personne n’envoie le PDF annuel.
- Phrase soft close idéale (québécois) citant **mon** résultat :  
  « Ton filet est mince — prochaine case : Fonds d’urgence. 15 min pour décider si tu commences par la liquidité ou le revenu qui stoppe. Clarifier ≠ acheter. »

### Ce qui me fait fuir
- Hero RDV avant outil ; mid générique ; PDF comme seule sortie ; capsule Apprendre = invalidité only alors que j’ai peur du mois sans facture ; jargon « collective » répété sans ancrer mon rythme de facturation.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Inverser checklist → « Ton filet »** · Je vois `Mince` + trou #1 **au moment** où je viens de cocher (émotion chaude) · `AutonomeChecklistTool.jsx` (déplacer L304–405 sous L407–511 ; Progression reste en tête) · Avant = insight hors viewport pendant les coches → Après = coche → climax collé · **H** · **M**

2. **Soft CTA RDV sur `nextItem.short` + `filetTone`** · Le RDV répond à **ma** case (urgence / revenu), pas à un pitch · Outil après Trous + footer ; `trackRendezVousClick('campagne_travailleur-autonome_rdv_tool')` · Avant = PDF seul → Après = « Clarifier : Fonds d’urgence en 15 min » + Clarifier ≠ acheter ; PDF secondaire · **H** · **M**

3. **Nommer la peur « mois mauvais / revenu variable » dans le climax** · Match Ad2 — mon clic Meta est validé · `statusDetail`, `filetDetail`, hints `urgence`/`factures`/`invalidite` · Avant = « Pas d’assurance collective… » ×N → Après = 1× intro + « si un mois est mauvais, rien ne tombe auto » · **H** · **S**

4. **Mid CTA copy autonome (data)** · Après l’outil, le bandeau rejoue ma peur TA · `campagneAdsLandings.js` slug + branche RDV `CampagneAdsLanding.jsx` (`ctaHeadline`/`ctaSubline`) · Avant = « Prêt à clarifier ta situation ? » → Après = « Une case te chicotte — revenu qui stoppe, hypo qui continue ? » / « 15 min pour prioriser liquidité puis protection du revenu. Clarifier ≠ acheter. » · **H** · **S–M** *(shell — compte dans le max 2)*

5. **Hero outil-first (dual CTA)** · Ad3 tenu → plus de confiance → booker **après** aha · Shell `CampagneAdsLanding` + `ctaLabel` data · Avant = « Réserver 15 minutes » only → Après = « Coche ton filet » `#outil` + RDV soft · **H** · **S** *(shell — 2/2)*

6. **Toggles contexte hypo/charges (+ RC métier)** · Trous = vraies peurs TA (liquidité→revenu), pas faux négatifs · state + filtre `missingOrdered` / PDF N/A · Avant = `vie`/`rc` toujours dans trous → Après = N/A ou descendus · **M** · **M**

7. **FAQ +2 + Apprendre dual urgence/invalidité** · Tue objections compte / vente ; liquidité pas oubliée · `campagneAdsLandings.js` faq + `apprendrePath`/`apprendreLabel` · Avant = 2 FAQ + capsule invalidité only → Après = « C’est gratuit / sans compte ? », « Tu vends une assurance ici ? » ; Apprendre urgence en primaire ou 2 liens · **M** · **S**

8. **Events progress `doneCount` 1 & 3 / filet `Mince`** · Retarget ceux qui ont **vu** leurs trous (vrai intent) · `AutonomeChecklistTool.jsx` + analytics · Avant = focus outil bruyant + PDF only → Après = `campagne_travailleur-autonome_progress` (throttle) séparable de `_rdv_tool` · **M** · **S**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Travailleur autonome : pas d’assurance collective fournie | **Garder** (match Ad1) |
| Promesse | Voir ce qui est en place — et la prochaine étape — quand tu es ton propre boss. | Coche ton filet : liquidité, revenu, proches — quand le revenu varie et qu’il n’y a pas d’assurance collective fournie. |
| Soft close post-outil | (absent — PDF only) / mid : Prêt à clarifier ta situation ? | Une case te chicotte — revenu qui stoppe, hypo qui continue ? 15 min pour prioriser. Clarifier ≠ acheter. |
| CTA label | Réserver 15 minutes | Hero : « Coche ton filet » ; outil/mid : « Clarifier ces trous en 15 min » |
| 1 ligne confiance | (footer seulement) | Conseiller en sécurité financière · Victoriaville — 15 min pour prioriser ton filet, pas pour te vendre une pile de produits. |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil (`Mince` / `nextItem`) est impossible à manquer (sous les cases, viewport post-coche)
- [ ] Le CTA RDV apparaît **dans les 2 secondes** après le climax (soft strip outil, pas seulement mid plus bas)
- [ ] La page a une identité visuelle du **sujet** (autonome / pas de RH / revenu variable) — pas template clone orbs
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book (« son filet est mince → Fonds d’urgence »)

---

## 8. Notes agent

**Sources :**  
- Live : https://www.pierreoliviercaouette.ca/campagnes/travailleur-autonome (hero navy, En bref 3, outil Progression + Ton filet avant cases, mid « Prêt à clarifier… », 2 FAQ, Apprendre invalidité)  
- `AutonomeChecklistTool.jsx` (515 lignes)  
- `campagneAdsLandings.js` L364–392  
- `CampagneAdsLanding.jsx` (hero RDV ; mid hardcodé L181+ ; `ctaHeadline` surtout form)  
- Ads : `emails/campagne-meta-catalog/travailleur-autonome.md` (Ad1–Ad3 + brief navy)

**Unique vs autres campagnes :** seul ensemble **filet complet TA** (4 piliers) avec distincteur « pas d’assurance collective fournie ». Chevauche `#4` invalidité, `#8` urgence, `#11` collective (inverse employé) — ne pas diluer l’ancre autonome.

**Conformité :** pas de claim « remplacer la collective » / « mêmes protections qu’un employé ». Disclaimer outil + footer OK ; renforcer revenu net / situation personnelle. Ads : disclaimer commentaire épinglé (brief).

**Pas de commit** — rapport doc seulement.
