# [#05] Retraite REER / CELI — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/retraite-reer-celi`  
**Persona :** 35–55, salarié·e / couple Québec, épargne déjà un peu ; objection #1 « On me dit toujours REER d’abord — mais j’hésite avec le CELI (et mon employeur matche peut‑être). »  
**CTA :** RDV Bookings  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 6  
**Score envie de booker après la page (1–10) :** 5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta (Ad2 « cotiser au feeling » ou Ad3 « essaie le prioriseur »). Le titre « où va le prochain dollar ? » me parle tout de suite — j’accroche. En bref est clair, pédagogique, sans bullshit. Je scrolle à l’outil… et dès l’ouverture je vois **Mixte** en gros + une carte **ambre avec triangle d’alerte**. Ressenti : « j’ai mal répondu » alors que j’ai rien touché (defaults moyenne / moyen / non / 500 $). Les 250 $ / 250 $ sont intéressants, mais le mot Mixte + le warn tuent le « damn ». Ensuite le seul bouton c’est **Télécharger mon résumé PDF** — pas de calendrier au moment où j’ai mon ordre. Le soft close mid dit « Prêt à clarifier ta situation ? » : générique, ça casse le fil. FAQ = mythe REER OK, mais rien sur le matching employeur ni CELI vs CELIAPP — mon objection #1 reste ouverte. Visuellement, la page sent le template campagne, pas la « retraite / enveloppes ». Est-ce que je booke ? **Pas encore.** Je télécharge peut‑être le PDF, je repars « je verrai ». Pour booker, j’aurais besoin que le mixte me rassure (pas m’alarme), que mon prochain dollar en $ domine l’écran, et qu’on me dise clairement « 15 min pour coller ça à ton matching / tes plafonds » sans pitch.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge Retraite · H1 « REER ou CELI : où va le prochain dollar ? » · promesse 4 réponses · **seul CTA blanc « Réserver 15 minutes »** sur `PageHero` générique | Curiosité (titre = Ad2) + friction (Ad3 vendait l’outil d’abord) | **Fuite soft** : booker froid avant insight. **WOW manqué** : zéro signal typo « REER · CELI » / navy ads |
| 3–15 s En bref | 3 cards numérotées : jobs fiscaux · règle horizon/tranche · PDF → 15 min | Confiance pédagogique | Opportunité : process « 4 réponses → PDF → 15 min » plus narratif ; manque matching |
| Première interaction outil | Snapshot déjà **Mixte** + barre 50/50 + « Sur 500 $ → 250 / 250 » ; Block 1 pré-rempli ; ResultCards en **tone warn** + `AlertTriangle` | Léger malaise (« problème ») | **Anti-WOW structurel** : defaults → mixte warn. Flipper une réponse (liquidité Oui → CELI vert) = vrai aha — trop tard si j’ai déjà décroché |
| Climax résultat | `short` XXL « Mixte » ; partage $ en card secondaire ; 3 raisons dont « Pas de gagnant automatique » | Insight mou | **WOW réel** = les **$** (250/250), pas le label Mixte. Aujourd’hui le label gagne |
| Après le climax (PDF / CTA) | `statusDetail` « PDF sert de base à clarifier en 15 min » + **uniquement** `ToolDownloadPdf` | Soulagement PDF / pas d’urgence RDV | **Fuite #1** : PDF cannibalise le booker. Opportunité : CTA RDV branché sur `suggestion.key` |
| Soft close mid / form | H2 shell « Prêt à clarifier ta situation ? » + lien Bookings | Refroidissement narratif | Fuite émotionnelle ; copy devrait citer **ordre + PDF + matching** |
| FAQ / fin | 2 Q (mythe REER + PDF ≠ conseil) · capsule « REER / FERR » · disclaimer · footer contact Victoriaville | OK mais incomplet | Objections matching / CELIAPP non traitées → Google ou abandon |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évalué sur la landing live + code (`CampagneAdsLanding` + `RetraiteReerCeliTool`).

### Hero
- **Composition :** Brand = nav seulement. H1 fort et aligné Ad2 — meilleur asset copy de la page. Promesse nette. CTA unique RDV = **pas** la promesse Ad3 (« Essaie le prioriseur »). Après retrait de la nav, ça pourrait être n’importe quelle campagne du catalogue.
- **Atmosphère :** Ne « sent » pas la retraite / les enveloppes. `PageHero` gradient générique ; brief ads (navy, typo bold « REER · CELI ») **non repris**.
- **Motion / présence :** ~0 utile dans le hero. Dans l’outil : SplitBar `duration-500` (bien). Pas de crossfade tone, pas de count-up $.
- **Mobile :** Titre lisible ; CTA hero OK pouce ; ChoiceGroup déjà 1 col — bonne base. Friction = footer PDF seul sous le fold du Block 2.

### Corps de page
- **Hiérarchie :** En bref = 1 job OK mais **card soup** (3 cards blanches ombrées). Outil = 2 blocks clairs. Pas de section « à quoi ressemble le RDV ».
- **Confiance :** Photo conseiller / titre CSF / Victoriaville **absents** above-the-fold (Victoriaville seulement footer). Process humain invisible.
- **Densité :** Correcte, un peu template-vide entre En bref et outil (« À toi de jouer » générique).
- **Manque pour un rendu pro / premium :**
  1. Signal campagne « REER · CELI » (filigrane / ligne sous H1) repris du brief ads  
  2. Strip process 3 pas (répondre → PDF → 15 min)  
  3. Ligne autorité CSF · Victoriaville · éducatif près du CTA  
  4. Climax mixte : $ XXL dominant, label Mixte en taupe (pas l’inverse)  
  5. Tone mixte sans ambre / triangle  
  6. Dual CTA post-insight (RDV primaire + PDF outline)

### Soft close / form
- Mid = phrase catalogue, **pas digne** d’un RDV payé en attention Meta. Microcopy ne cite ni mon ordre ni mon $. Zéro réassurance « sans compte / sans harcèlement » au point de décision (pourtant martelé dans les ads).

**Note visuelle /10 :** 5,5  

**3 upgrades visuels WOW (Avant → Après) :**
1. **Hero identité sujet** — Avant : `PageHero` clone. Après : ligne / filigrane « REER · CELI », CTA primaire soft « Essayer le prioriseur » (`#outil`) + RDV secondaire texte.  
2. **Climax mixte $** — Avant : XXL « Mixte » + warn ambre. Après : XXL `250 $ / 250 $`, sous-ligne « Mixte illustratif — CELI / REER », pastille primary (nuance), SplitBar secondaire.  
3. **Footer outil dual** — Avant : PDF seul. Après : stack mobile RDV full-width au-dessus, PDF outline ; microcopy selon CELI / REER / Mixte.

---

## 3. Audit OUTIL interactif (cœur du WOW)

Fichier : `frontend/src/components/campagne/tools/RetraiteReerCeliTool.jsx`  
Règles : `buildSuggestion` L61–135 · defaults L275–278 · `ResultCard` tones L214–238 · footer PDF-only L370–378 · snapshot L382–400.

### Première impression outil
- En <10 s : oui, je comprends « ordre REER ou CELI + partage du prochain dollar ».  
- **Defaults** (`tranche: moyenne`, `horizon: moyen`, `liquidite: non`, `500`) → `key: 'mixte'`, `tone: 'warn'`, split 50/50. **Spoilent / dramatize** : le cas le plus fréquent s’ouvre en alerte. Les $ 250/250 aident l’aha — le warn le sabote.

### Moment « wow »
- **Devrait être :** « Sur *mon* 500 $, voici où part le prochain dollar — et pourquoi » (surtout en mixte : le split $). CELI/REER clairs → verdict `short` XXL vert.  
- **Aujourd’hui :** assez narré dans les `raisons`, pas assez **grand** ni **personnel** sur le mixte (label « Mixte » > $).  
- **Manque pour désir de parler à quelqu’un :** pont explicite « ton matching employeur / tes plafonds / ce que t’as déjà peuvent changer l’ordre — 15 min pour coller le PDF à ta vraie vie ». Sans ça, l’insight reste DIY + PDF.

### Friction outil
- Tone `warn` + `AlertTriangle` sur mixte = jargon émotionnel (« erreur »)  
- Matching employeur **absent** (décideur #1 salariés 35–55)  
- Capsule landing mono-REER alors que promesse = bi-compte  
- PDF sans accents (`Resume`, `reponses`, `liquidite`, …) → cheap au moment « garder mon résumé »  
- Scroll : snapshot en haut + ResultCards plus bas = climax dupliqué / dilué  
- Gap ads : Ad3 promet « essaie d’abord » ; outil livre insight puis PDF, **pas** le soft close 15 min branché

### Après le résultat
- Next step naturel actuel = **télécharger le PDF**, pas booker. Le copy footer mentionne « clarifier en 15 minutes » sans lien Bookings → promesse orpheline.

**Note outil WOW /10 :** 6  

**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Tone mixte → `nuance`** — `RetraiteReerCeliTool.jsx` `buildSuggestion` L127 + `ResultCard` : Avant `tone: 'warn'` + triangle ambre → Après `tone: 'nuance'` (primary/bleu, sans alerte) ; réserver `warn` aux vrais flags.  
2. **CTA RDV footer par `suggestion.key`** — footer L370–378 : Avant PDF only → Après PDF outline + « Réserver 15 min avec mon résumé » + `buildCampagneRdvPath` / `trackRendezVousClick('campagne_retraite-reer-celi_rdv_tool')` ; microcopy CELI / REER / Mixte.  
3. **Toggle matching employeur** — Block 1 + `buildSuggestion` + PDF rows : Avant 4 inputs → Après + Oui / Non / Je sais pas ; si Oui, raison « souvent le match avant le débat perso » + soft CTA quantifier en 15 min.  
4. **Snapshot $ si mixte** — L382–400 : Avant XXL `Mixte` → Après XXL `CELI $ / REER $` + sous-ligne Mixte (si `monthly > 0`).  
5. **Soft close post-PDF** — `handleDownload` / toast : Avant « PDF téléchargé » → Après « PDF prêt — 15 min pour le coller à ton dossier ? » + même lien RDV.

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « Mon employeur matche déjà mon REER — ton prioriseur 50/50 a l’air naïf. »  
2. « Mixte + triangle jaune = j’ai foiré / je suis plus perdu qu’avant. »  
3. « Si je booke, on va me vendre un compte / me harceler » (ads disent non ; page ne le répète pas au CTA).

### Ce qui me ferait booker demain (leviers émotionnels)
- **Peur de mal faire seul** (ordre du prochain dollar) + **clarté** (PDF + matching) + **urgence douce** (janvier / cotisation déjà en tête) + **« on le fait ensemble »** (15 min soft, zéro pitch).  
- **Phrase soft close idéale (québécois) citant mon résultat :**  
  > « Ton prioriseur dit Mixte — ~250 $ CELI / 250 $ REER sur ton prochain 500 $. En 15 minutes, on valide ça avec ton matching employeur, tes plafonds, et ce que t’as déjà. Zéro pitch — juste coller l’ordre à ta vraie vie. »

### Ce qui me fait fuir
- Alerte ambre au load · PDF-only au climax · mid générique · silence sur matching / CELIAPP · hero qui pousse le RDV avant l’essai promis par l’annonce.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Neutraliser tone `mixte` (warn → nuance)** · Le cas majoritaire cesse de sentir « problème » → j’ose aller au bout et booker pour *affiner*, pas pour me faire corriger · `RetraiteReerCeliTool.jsx` (`buildSuggestion` L127, `ResultCard` L214–238) · Avant : ambre + `AlertTriangle` sur « Mixte — ≈ 50 / 50 » → Après : `tone: 'nuance'` primary, label « Mixte — à affiner » · **H** · **S**

2. **CTA RDV in-tool branché sur `suggestion.key`** · Le climax (ordre + $) a enfin un calendrier ; Ad3 « essaie puis 15 min » se réalise · Footer `CampagneToolShell` L370–378 + `buildCampagneRdvPath` / `trackRendezVousClick('…_rdv_tool')` · Avant : PDF seul → Après : PDF outline + primaire « Réserver 15 min avec mon résumé » ; Mixte / CELI / REER microcopy distincte · **H** · **S**

3. **Toggle « Mon employeur matche / cotise au REER »** · Objection #1 salariés 35–55 traitée *dans* l’outil → le RDV sert à quantifier le match, pas à découvrir le sujet · `RetraiteReerCeliTool.jsx` Block 1 + `buildSuggestion` + rows PDF · Avant : 4 champs → Après : Oui / Non / Je sais pas ; si Oui → raison « match souvent d’abord » + pont 15 min · **H** · **M**

4. **Climax visuel $ quand `key === 'mixte'`** · Je « sens » mon prochain dollar fendu (Ad2) → désir de valider avec un humain · Snapshot L382–400 (+ ResultCard partage pleine largeur si mixte) · Avant : XXL « Mixte » → Après : XXL `250 $ / 250 $` + sous-ligne Mixte · **H** · **S**

5. **Mid-CTA landing « ordre + PDF » (pas le shell générique)** · Continuité émotionnelle post-outil → moins de bounce avant Bookings · `campagneAdsLandings.js` slug `retraite-reer-celi` (`ctaHeadline` / `ctaSubline`) + branchement `CampagneAdsLanding.jsx` (~L183) · Avant : « Prêt à clarifier ta situation ? » → Après : « Ton ordre REER / CELI, on le valide en 15 minutes » / sub « Apporte ton PDF — matching, plafonds, prochain dollar. Zéro pitch. » · **H** · **S** *(shell slot, copy 100 % campagne)*

6. **FAQ +2 : matching employeur + CELI vs CELIAPP** · Freins post-chiffre fermés sans Google → booker pour approfondir · `campagneAdsLandings.js` `faq[]` · Avant : 2 items → Après : + « Et si mon employeur matche ? » + « CELI et CELIAPP, c’est la même chose ? » (garder mythe + PDF) · **M** · **S**

7. **Capsule dual REER·CELI + réassurance « sans compte » au point de décision** · Audience Ad3 moins peur harcèlement ; CELI pas sous-représenté vs #02/#09 · `campagneAdsLandings.js` (`apprendreLabel` / 2e lien) + microcopy sous CTA outil · Avant : « Lire la capsule REER / FERR » → Après : « Capsules REER · CELI » + « Prioriseur sans compte · PDF gratuit · 15 min soft » · **M** · **S**

8. **Hero outil-first + ligne confiance CSF** *(dette shell — item #2/2)* · Match Ad3 above-the-fold + preuve humaine avant le cold book · `CampagneAdsLanding.jsx` / `PageHero` + data landing · Avant : CTA unique RDV, zéro CSF visible → Après : primaire scroll `#outil` « Essayer le prioriseur » + RDV texte ; sous hero ou pre-mid : « Conseiller en sécurité financière · Victoriaville · éducatif » · **M** · **S–M**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | REER ou CELI : où va le prochain dollar ? | **Garder** (aligné Ad2). Variante A/B : « Toujours le REER d’abord ? » (Ad1) |
| Promesse | Quatre réponses → un ordre illustratif (et un partage du montant mensuel). Pas de jargon, pas de pression. | Quatre réponses. Une piste d’ordre REER / CELI — et un PDF à apporter en 15 minutes. Sans compte. |
| Soft close post-outil | Répartition illustrative — le PDF sert de base à clarifier en 15 minutes. *(sans lien)* / mid « Prêt à clarifier ta situation ? » | Mixte : « Pas de gagnant automatique — on colle l’ordre (~X $ / Y $) à tes projets et ton matching en 15 min. » Mid : « Ton ordre REER / CELI, on le valide en 15 minutes. » |
| CTA label | Réserver 15 minutes *(hero seul)* / Télécharger mon résumé PDF *(outil)* | Hero soft : « Essayer le prioriseur » + RDV secondaire ; in-tool : « Réserver 15 min avec mon résumé » |
| 1 ligne confiance | *(absente above-the-fold)* | Conseiller en sécurité financière · Victoriaville · éducatif · sans harcèlement |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer *(pour mixte : $ XXL ; pour CELI/REER : short XXL vert — jamais warn ambre par défaut)*  
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax *(footer in-tool, pas seulement mid générique)*  
- [ ] La page a une identité visuelle du **sujet** (signal REER · CELI, pas template clone)  
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book *(« il valide mon ordre 250/250 + matching »)*  

---

## 8. Notes agent

**Sources :** `RetraiteReerCeliTool.jsx` (L1–516) ; `campagneAdsLandings.js` slug `retraite-reer-celi` (L75–105) ; `CampagneAdsLanding.jsx` (hero RDV L62–88, mid « Prêt à clarifier… » ~L183) ; `emails/campagne-meta-catalog/retraite-reer-celi.md` (Ad1 mythe / Ad2 feeling / Ad3 prioriseur) ; brief créa navy « REER · CELI ».

**Live :** https://www.pierreoliviercaouette.ca/campagnes/retraite-reer-celi — confirmé au load : snapshot **Mixte**, split 50/50, **250 $ / 250 $** sur 500 $, raisons « Pas de gagnant automatique », footer PDF + texte 15 min sans bouton Bookings, FAQ ×2 seulement, capsule REER/FERR.

**Unique vs catalogue :** seul outil dont le **default path = verdict mixte en `warn`** ; climax dual (ordre *ou* $) ; gap matching employeur critique persona 35–55 ; Ad3 explicitement outil-first vs hero RDV.

**Conformité :** répéter près de l’ordre + CTA RDV : « Illustration éducative. Pas un conseil personnalisé. Titre : conseiller en sécurité financière. » Matching = formulation éducative (« souvent… ») + RDV, jamais ordre produit. Aucun « meilleur compte », aucun % / rendement. PDF accents = polish, pas claim.
