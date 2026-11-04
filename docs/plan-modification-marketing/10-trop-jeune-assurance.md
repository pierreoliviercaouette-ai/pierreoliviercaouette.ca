# [#10] Trop jeune pour m’assurer — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/trop-jeune-assurance`  
**Persona :** 22–35 ans, locataire ou pré-maison, 0–1 enfant, objection #1 « trop jeune / trop tôt pour m’assurer » (souvent « j’attends, je suis en santé »)  
**CTA :** RDV Bookings (`buildCampagneRdvPath` → `/rendez-vous/campagne`)  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 6  
**Score envie de booker après la page (1–10) :** 4  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta avec Ad1/Ad3 dans la tête : « essaie le score d’abord, sans compte ». Le hero me jette tout de suite un **Réserver 15 minutes** blanc sur navy — je me braque un peu, comme si le pitch RDV gagnait déjà. Titre mythe entre guillemets : ça accroche, c’est mon langage. En bref, bullets 1–2 = pile Ad2 ; bullet 3 dérive « temporaire / prison » alors que l’ad m’a vendu score + montant. Je scrolle à l’outil… et **boom** : score **33/100**, pastilles Hypothèque prévue · 17 + Famille prévue · 15, capital **455 000 $** — sans que j’aie rien coché. Sensation de démo pré-cuite, pas de « damn, c’est *moi* ». Le climax est là (gros $ + score live), mais opaque : un seul total, pas « aujourd’hui 5 k$ vs projets 450 k$ ». Ensuite on me pousse le PDF (« Garde le PDF ») — pas un RDV qui cite mon score. Soft close mid = « Prêt à clarifier ta situation ? » générique : je décroche. FAQ traite enfants + âge hors score, **pas** « c’est plus cher si j’attends ». Bookerais-je ? Rarement — l’insight a déjà été spoilé et le next step n’est pas collé à mon chiffre.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge Assurance vie · titre « trop jeune… vraiment ? » · promesse score présent+projets · CTA **Réserver 15 minutes** | Curieux + méfiant (Meta = outil d’abord) | Fuite soft-close ads ; opp. = CTA primaire « Voir mon score » |
| 3–15 s En bref | 3 cards numérotées ; #3 « temporaire / prison » | OK puis dissonance produit | Opp. : bullet #3 = score/100 + présent/futur + sans compte |
| Première interaction outil | Load : âge 28, dettes 5 k$, **hypo oui 350 k$ / 3 ans**, **famille oui / 5 ans** → score 33 déjà | « C’est déjà rempli pour moi » | **Defaults spoiler** = #1 friction unique |
| Climax résultat | Score barre + Lecture **455 000 $** ; breakdown lignes mais 1 total dominant | Impressionné un instant, puis « pitch » | Opp. WOW = split Aujourd’hui / Projets connus + aha au *toggle* |
| Après le climax (PDF / CTA) | Footer : statusDetail + **Télécharger mon résumé PDF** seul | Plateau ; émotion meurt | Fuite conversion ; opp. soft close score-aware sous ResultCard |
| Soft close mid / form | « Prêt à clarifier… » + RDV + capsule temporaire | Générique, hors mon 33/100 | Opp. : « Ton score te chicotte ? » citant score + capital |
| FAQ / fin | 3 Q : enfants / âge hors score / disclaimer | Demi-réponse ; objection prix/âge absente | Fuite « je verrai plus tard » ; opp. FAQ attendre + collective |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

### Hero
- Composition : brand = logo nav iA + nom ; titre mythe **fort** (bonne accroche persona) ; promesse claire ; CTA unique RDV = trop « vente », pas assez « outil ». Après retrait de la nav, ça pourrait être n’importe quelle landing assurance shell.
- Atmosphère : navy `PageHero` + orbs/gradient catalogue — **pas** le brief ads « mythe-bancaire » (contraste fort « Trop jeune ? »). Sent le template campagne, pas 22–35 / mythe âge.
- Motion : quasi 0 utile au hero ; dans l’outil, barre score `transition-all duration-500` = seul vrai mouvement.
- Mobile : CTA hero lisible ; pouce OK ; dissonance ads→RDV encore plus nette sur petit écran.

### Corps de page
- Hiérarchie : En bref = 3 cards (léger card soup) ; outil = 3 steps checkmarks propres ; une job/section plutôt respectée.
- Confiance : pas de photo conseiller, pas de pastille « Victoriaville / CSF » au-dessus du fold, pas de « sans compte / sans formulaire » on-page alors que les 3 ads le martèlent.
- Densité : correcte desktop ; mobile = long scroll Présent → Futur → Lecture avant tout CTA RDV contextuel.
- Manque pour rendu **pro / premium** :
  1. Identité visuelle mythe-âge (navy contrast / typo titre « Trop jeune ? ») distincte des autres landings.
  2. Pastille confiance « Score gratuit · sans compte » sous hero ou intro outil.
  3. Split capital présent/futur en typographie dominante (pas seulement lignes muted).
  4. Soft-close bandeau collé sous Lecture (pas card mid générique 2 écrans plus bas).
  5. Proof strip local 1 ligne (CSF · Victoriaville · clarifier ≠ acheter).

### Soft close / form
- Mid : gradient primary→dark, copy shell « Prêt à clarifier ta situation ? » — digne d’un template, **pas** d’un RDV payé en attention Meta après un score 33 / 455 k$.
- Microcopy : zéro citation du résultat outil ; capsule secondaire OK pour conformité temporaire, pas pour booker.
- Réassurance : « 15 min sans pression » OK ; manque « on lit *ton* score ensemble ».

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. Hero CTA : Avant « Réserver 15 minutes » seul → Après primaire « Voir mon score » (`#outil`) + secondaire texte « ou 15 min ».
2. Climax $ : Avant un `ResultCard` 455 k$ opaque → Après total gros + sous-ligne « Aujourd’hui ~X $ · Projets connus ~Y $ ».
3. Post-Lecture : Avant vide puis mid générique → Après bandeau soft-close score-aware collé sous breakdown (thumb zone).

---

## 3. Audit OUTIL interactif (cœur du WOW)

Lis le JSX. Scénario mental + **live** (2026-11-04) : load = score **33/100**, capital **455 000 $**.

### Première impression outil
- En <10 s : oui — titre « Trop jeune pour t’assurer ? », intro présent+futur, score live en haut = clair ce que je gagne.
- Defaults : **spoilent**. `projetHypotheque='oui'` + `350000` + `projetFamille='oui'` (+ dettes 5 k$) → aha pré-cuit. L’âge 28 « contexte seulement » est bien narré ; le futur Oui/Oui ne l’est pas.

### Moment « wow »
- Devrait être : je coche hypo/famille → score saute → capital projets connus domine → « damn, même locataire sans enfants, le futur déjà connu change la donne » (promesse Ad2).
- Aujourd’hui : chiffre assez grand (455 k$) mais **pas personnel** (pas mon geste) et **pas assez narré** (pas de split présent/futur dans le ResultCard).
- Manque pour désir de parler : CTA RDV dans les 2 s post-climax qui cite `score` + `capital` + « clarifier ≠ acheter » ; label contrib « Salaire » trompeur quand on active conjoint (confiance ↓ au climax).

### Friction outil
- Defaults futur pré-pitchés ; jalons 1–3 quasi always `done` au load ; PDF ASCII (`Age`, `Hypotheque`, `deja`, `Resultats`) ; footer PDF cannibalise RDV ; scroll 3 blocks avant Lecture ; pas de case « couverture déjà en place / collective ».
- Gaps vs ads : « sans compte / essaie d’abord » OK en intention outil ; soft close Ad3 **absent** au climax ; angle prix/âge pas dans l’outil (OK si FAQ).

### Après le résultat
- Next step naturel actuel = **PDF**, pas booker. `statusDetail` score élevé : « Garde le PDF. » Mid CTA trop loin + générique.

**Note outil WOW /10 :** 6  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. Defaults futurs `non`/`non` — `TropJeuneTool.jsx` ~L163–167 → aha au toggle.
2. Soft close RDV sous Lecture (`scoreEleve`/`scoreMoyen`) — ~L500–544 + footer ~L307–311 ; `buildCampagneRdvPath('trop-jeune-assurance')` + `trackRendezVousClick('…_rdv_outil')`.
3. Split capital aujourd’hui / projets connus / total — capital ~L200–205 + ResultCard ~L506–542.
4. Label contrib `Salaire` → `Proche dépend de toi` — `contribs` ~L242.
5. Jalons dirty + PDF accents FR + note « Apporte en RDV » — milestones ~L221–234 ; `handleDownload` ~L252–299.

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « J’attends — je suis jeune et en santé ; plus tard ça ira. »
2. « J’ai rien de gros aujourd’hui (locataire, 0 enfant) — 455 k$ c’est pour d’autres. »
3. « J’ai déjà de la vie via mon job / collective » (Ad3 l’ouvre ; page silencieuse).

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve : voir **mon** score bouger quand je coche hypo/famille (ownership).
- Clarté : split présent vs projets connus = le mythe meurt sans pitch.
- Urgence douce : « projets déjà connus » (pas « tu vas mourir »).
- « On le fait ensemble » : 15 min pour lire le score, pas pour signer.
- Peur de mal faire seul : collective vs perso, temporaire vs besoins futurs.
- Phrase soft close idéale : « Score 33/100 · ~455 000 $ illustratifs (surtout tes projets connus). 15 min pour lire ça ensemble — clarifier ≠ acheter. »

### Ce qui me fait fuir
- Capital pré-cuit au load ; CTA RDV avant l’outil ; PDF comme trophée unique ; mid générique ; suspicion « outil vendeur » ; claim prix trop agressif (conformité).

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Neutraliser defaults futur (anti-spoiler)** · Ownership + aha au geste = désir de « valider » en RDV · `TropJeuneTool.jsx` ~L163–167 · Avant `projetHypotheque='oui'`, `350000`, `projetFamille='oui'` → score ~33 + 455 k$ immédiat ; Après `non`/`non` (+ coach « Coche tes projets connus — c’est souvent ça qui fait bouger le score ») · **H** · **S**

2. **Soft close RDV score-aware sous Lecture** · Capture le pic émotionnel avant PDF · `TropJeuneTool.jsx` Block Lecture + `footer` CampagneToolShell ; `buildCampagneRdvPath` + `trackRendezVousClick('campagne_trop-jeune-assurance_rdv_outil')` · Avant PDF seul (« Garde le PDF ») ; Après si `score≥40` : « Score {n}/100 · ~{capital}… 15 min pour lire ça ensemble » ; `15–39` soft ; `<15` PDF primaire + RDV texte · **H** · **M**

3. **Split capital Aujourd’hui / Projets connus / Total** · Rend visible le levier Ad2 (mythe-killer locataire) · capital + `ResultCard`/`BreakdownRow` · Avant 1 ligne « Montant à viser » 455 k$ ; Après « Aujourd’hui ~5 000 $ · Projets connus ~450 000 $ · Total illustratif 455 000 $ » · **H** · **S**

4. **Bullet #3 + mid copy data (score, pas « prison »)** · Aligne post-clic Meta → booker · `campagneAdsLandings.js` ~L302–306 + props `ctaHeadline`/`ctaSubline` lues en mode RDV · Avant bullet « temporaire / prison » + mid « Prêt à clarifier… » ; Après « Score /100 + montant (présent + projets) + PDF — sans compte » ; mid « Ton score te chicotte ? · 15 min pour lire présent + projets connus » · **H** · **S**

5. **Label contrib « Salaire » → « Proche dépend de toi »** · Confiance au climax score · `contribs` ~L242 · Avant « Salaire · 20 » ; Après « Proche dépend de toi · 20 » · **M** · **S**

6. **FAQ « C’est plus cher / plus difficile si j’attends ? » (+ sync Ad3 matrice)** · Tue objection #1 22–35 sans claim prime · `campagneAdsLandings.js` `faq[]` ; `emails/…/trop-jeune-assurance.md` vs `docs/campagne-meta-catalog-cbo.md` (Ad3 « Prix vs risque ») · Avant 3 FAQ, 0 sur attendre ; Après Q/R éducatif (âge/santé/coût relatif en rencontre ; score ≠ prime) + une vérité Ad3 · **M** · **S**

7. **Hero : primaire outil, secondaire RDV** *(shell)* · Répare soft close Meta ; ↑ scroll `#outil` → insight → book · `CampagneAdsLanding.jsx` ~L62–88 + data `ctaLabel` · Avant CTA unique « Réserver 15 minutes » ; Après « Voir mon score » + « Ou réserver 15 min » · **H** · **S**

8. **Jalons dirty + PDF FR + note « apporte en RDV »** · Progress honnête + artefact digne du book · milestones ~L221–234 ; `handleDownload` ~L252–299 · Avant jalons done au load + PDF sans accents ; Après dirty flags ; « Âge / Hypothèque prévue / déjà » ; note « Apporte ce PDF — 15 min » · **M** · **S**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | « Je suis trop jeune pour m’assurer » — vraiment ? | *(Garder — aligné Ad1)* |
| Promesse | Teste le mythe : score… l’âge n’entre pas… | L’âge sur la carte, c’est pas le filtre. Tes obligations — et ce que tu sais déjà qui s’en vient — oui. Score gratuit, sans compte. |
| Soft close post-outil | *(absent — PDF « Garde le PDF »)* | Score {n}/100 · ~{capital} illustratifs (présent + projets connus). 15 min pour lire ça ensemble — clarifier ≠ acheter. |
| CTA label | Réserver 15 minutes | Hero : « Voir mon score » (+ « Ou 15 min ») ; post-outil : « Lire mon score en 15 min » |
| 1 ligne confiance | *(absente au fold)* | Conseiller en sécurité financière · Victoriaville · score illustratif, pas une soumission |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax
- [ ] La page a une identité visuelle du **sujet** (pas template clone)
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book

*(État 2026-11-04 : climax $ visible mais spoilé ; CTA post-climax = PDF ≠ ; identité = shell ; ami comprendrait « assurance » pas « mon score me chicotte ».)*

---

## 8. Notes agent

**Sources :** `_TEMPLATE.md` ; `TropJeuneTool.jsx` (defaults L157–168, score L183–211, capital L200–205, lecture L213–219, milestones L221–234, contribs L239–246, PDF L252–299, UI L301–548) ; `campagneAdsLandings.js` (~L293–327) ; `CampagneAdsLanding.jsx` (hero CTA, mid hardcodé L181–210) ; `emails/campagne-meta-catalog/trop-jeune-assurance.md` ; `docs/campagne-meta-catalog-cbo.md` (audience 22–40, matrice Ad3 « Prix vs risque » ≠ copie score-first).

**Live :** https://www.pierreoliviercaouette.ca/campagnes/trop-jeune-assurance — observé score **33/100**, capital **455 000 $**, hypo Oui 350 k$ / famille Oui au load ; mid « Prêt à clarifier… » ; FAQ ×3 sans « attendre ».

**Unique vs catalogue :** Seul outil qui réfute un **mythe d’âge** via score présent **+ futur déjà connu**. Piège conversion = **defaults futur** + capital non splité + soft close ads cassé au hero/climax.

**Conformité :** Pas de « plus cheap garanti » / prime chiffrée. Score + capital = illustration. Titre CSF. 100 k$ famille / 24× revenu = ordres de grandeur.

**Pas de commit.**
