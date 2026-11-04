# [#07] REEE — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/reee`  
**Persona :** Parent 28–45 ans, Victoriaville / Centre-du-Québec — REEE « quelque part » (banque / employeur), cotisations au feeling. Objection #1 : *« Le compte est ouvert → c’est déjà fait. »*  
**CTA :** RDV Bookings  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 6  
**Score « effet WOW » outil (1–10) :** 7  
**Score envie de booker après la page (1–10) :** 4,5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta Ad1 (« je pensais qu’ouvrir un REEE, c’était déjà fait »). Le hero me parle de « ~20 % » — scolaire, pas mon mythe. Je scroll : En bref OK, outil déjà rempli (5 ans, 2 500 $/an). La barre 6 000 / 7 200 $ accroche. Gros chiffre : **36 000 $ pour les études** — confortable, pas un coup de cœur. En bas à droite, **Encore possibles : 1 200 $** — *là* je sens le « laisse sur la table », mais c’est un petit chiffre dans une grille de 3. Le footer dit : *« Il resterait encore ~1 200 $… Télécharge ton résumé PDF. »* Je télécharge peut-être. Je ne booke pas : rien ne me dit « on calera ton vrai rythme / ce que t’as déjà » avec *mon* 1 200 $. Mid CTA générique (« Prêt à clarifier… »). FAQ ne parle pas de mon compte banque. Verdict : outil solide, climax dilué, pont vers le calendrier cassé.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge REEE · titre « Études… ~20 % » · promesse âge/rythme/PDF · CTA blanc « Réserver 15 minutes » sur gradient navy générique | Curiosité tiède / dissonance vs ad « compte ouvert » | **Fuite soft** : ads = outil d’abord ; hero = RDV. Opportunité = titre mythe + CTA scroll `#outil` |
| 3–15 s En bref | 3 bullets : SCEE 20 ¢ · rythme 2 500 $ · PDF pour 15 min | Orienté, un peu « cours » | Opportunité : bullet 1 = « compte ouvert ≠ maximisé » pour matcher Ad1 |
| Première interaction outil | Defaults déjà live : barre 83 %, SCEE/an 500 $, total 36 k$. Je clique **1 000 $** | Surprise légère si je change le preset | **WOW raté** : à 1 000 $, hint taupe « tu laisses une partie… » — pas un callout « ~300 $/an × 12 ans » |
| Climax résultat | Headline `Environ 36 000 $ pour les études` · points · grille « Encore possibles 1 200 $ » | Satisfait / un peu calme | **Climax vrai = `laisseSurTable`**, pas le total. Opportunité : remonter « encore ~X $ » en typo dominante |
| Après le climax (PDF / CTA) | « À retenir » (4 bullets) puis status → **PDF only** | Insight froid → souvenir fichier | **Fuite majeure** : émotion meurt en download. Soft-close RDV citant les 1 200 $ absent |
| Soft close mid / form | Bandeau navy « Prêt à clarifier ta situation ? » + Réserver + Lire la capsule | Générique, pas « mon » chiffre | Fuite : même copy que 14 autres landings. Capsule = même poids que RDV |
| FAQ / fin | Trop tard à 10 ans ? · REEE vs SCEE · Est-ce un conseil ? | Neutre | Fuite : pas de « J’ai déjà un REEE à la banque » — objection Ad1 non tuée |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évalué live : https://www.pierreoliviercaouette.ca/campagnes/reee (2026-11-04) + `CampagneAdsLanding.jsx` / `PageHero` / `ReeeTool.jsx`.

### Hero
- **Composition :** Badge + titre long + promesse + 1 CTA pill. Brand = nav seulement → **échec brand test** (sans nav = landing éducative générique).
- **Atmosphère :** Gradient navy + orbes / vague blanche = **template clone**, pas parent/enfant ni brief navy ads (« REEE · Subventions · Outil gratuit »). Ça ne « sent » pas le REEE.
- **Motion :** quasi 0 utile au fold (shell). Barre plafond outil = seul vrai mouvement (`transition-all duration-500`).
- **Mobile :** CTA hero lisible ; pouce OK. Mais premier job ads = outil → CTA RDV vole le pouce.

### Corps de page
- **Hiérarchie :** En bref (1 job) → outil (1 job) → mid → FAQ. Correct. Outil = cards arrondies / beige — dense mais lisible, pas « card soup » extrême.
- **Confiance :** photo conseiller, CSF explicite au fold, Victoriaville — **absents** (Victoriaville = footer seulement).
- **Densité :** outil un peu long (barre + 2 blocks + rendement + résultat + À retenir + PDF) avant tout RDV utile.
- **Manque pour un rendu pro / premium :**
  1. Visuel sujet (parent/enfant, navy plein cadre) vs orbes génériques  
  2. Ligne confiance locale au-dessus du fold  
  3. Process 3 steps visible (âge → rythme → encore possibles → 15 min)  
  4. Hiérarchie visuelle où « Encore possibles » peut rivaliser le total  
  5. Soft-close digne post-outil (pas mid clone)

### Soft close / form
- Mid = gradient primary→dark, copy hardcodée « Prêt à clarifier… » — **pas digne** d’un RDV payé en attention Meta. Zéro citation de `laisseSurTable`. Microcopy ads (« Calme. Concret. Zéro pression. ») **absente**.

**Note visuelle /10 :** 5,5  

**3 upgrades visuels WOW (Avant → Après) :**
1. **Hero sujet :** Avant = PageHero gradient orbes + titre « ~20 % ». Après = fond navy plein, titre blanc « REEE ouvert ≠ subventions maximisées », sous-ligne Subventions · Outil · Sans compte ; CTA primaire scroll outil.
2. **Climax « Encore possibles » :** Avant = 3e métrique `text-lg` égale aux deux autres. Après = bandeau regret doux sous le total, `text-2xl/3xl`, couleur distincte (pas amber réservé au max atteint).
3. **Post-outil :** Avant = À retenir ouvert + PDF. Après = soft-close card citant ~X $ + RDV primary ; « À retenir » en `<details>` mobile.

---

## 3. Audit OUTIL interactif (cœur du WOW)

JSX lu : `frontend/src/components/campagne/tools/ReeeTool.jsx`. Scénario defaults + preset 1 000 $.

### Première impression outil
- **&lt;10 s :** Oui — barre « Vers le max de subventions », âge, cotisation, SCEE/an. Clair que je gagne une projection SCEE + total.
- **Defaults (5 ans / 2 500 $ / 12 ans) :** Aident l’aha plafond (6 000 / 7 200, `laisseSurTable` = 1 200 $ immédiat) — **bon**. Spoilent un peu le regret annuel (`sousMaxAnnuel` false au load) ; le parent « au feeling » à 80–150 $/mois doit **changer** le preset pour vivre Ad2.

### Moment « wow »
- **Chiffre qui devrait faire dire « damn » :** `laisseSurTable` (et, si sous 2 500 $, l’écart annuel `500 − sceeParAn` × années).
- **Aujourd’hui :** headline dominante = `Environ {totalIllustratif} pour les études` (confort). `laisseSurTable` = 3e cellule + bullet + status PDF.
- **Assez narré / personnel ?** Partiellement — pas branché sur « ce que t’as déjà », pas sur un budget mensuel, pas sur multi-enfants (promis en soft close Ad2).
- **Manque pour désir de parler à quelqu’un :** pont explicite *« encore ~X $ + ton vrai rythme / déjà en place → 15 min »* au moment exact du climax.

### Friction outil
- Cotisation **annuelle only** alors que parents pensent $/paie  
- Pas de champ **SCEE déjà reçues** → persona compte ouvert invalide  
- Hint `sousMaxAnnuel` trop discret (taupe sous carte)  
- IQEE = phrase À retenir, pas chiffré → parent QC compare à un relevé banque  
- PDF ASCII (`Resume`, `Age`, `annee`, `A retenir`)  
- Scroll : À retenir **avant** tout CTA utile hors PDF  
- Gap ads : « ce que t’as déjà », « autres enfants » → RDV only, jamais teaser dans l’outil

### Après le résultat
- Next step naturel = **télécharger le PDF**, pas booker (`statusDetail` L232–239 + `ToolDownloadPdf` seul dans `footer`).

**Note outil WOW /10 :** 7  

**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Soft-close chiffré `laisseSurTable` :** Avant status « …Télécharge ton résumé PDF. » → Après « Il resterait encore ~X $ avant le max à vie. 15 min pour caler âge, budget, déjà en place — zéro pression. » + bouton `Relier ça à mon budget` → `buildCampagneRdvPath('reee')` + `trackRendezVousClick('campagne_reee_rdv_outil')`. PDF outline. · `ReeeTool.jsx` footer + sous grille « Encore possibles »
2. **Callout `sousMaxAnnuel` :** Avant hint taupe → Après callout bold « Tu laisses ~Y $/an de SCEE (500 − scee). Sur N ans ≈ … » + preset 2 500 mis en évidence. · carte Subvention/an + `buildLecture`
3. **Champ « SCEE déjà reçues (approx.) » 0–7 200 :** Avant projection from-zero → Après seed `totalSubventions` / `room` ; headline « Avec ce que t’as déjà, il resterait encore ~X $ ». · `projeterReee` + Block 2
4. **Toggle $/mois ↔ $/an :** Avant annuel only → Après 200 $/mois affiché comme 2 400 $/an pour SCEE. · input cotisation Block 2
5. **Ligne IQEE séparée (illustration) hors `totalIllustratif` :** Avant mention texte → Après 4e métrique disclaimerée + note « chiffre principal = SCEE fédérale ». · bloc résultat + disclaimer

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « J’ai déjà un REEE à la banque — pourquoi un RDV ? » (Ad1 — **non traité** en FAQ/outil)
2. « Les subventions rentrent toutes seules si le compte est ouvert » (Ad2 — calculé mais pas brandi en CTA)
3. « Je vais juste garder le PDF / me débrouiller » (friction post-climax PDF-first)
4. « 2 500 $/an c’est trop — je mets 100 $/mois » (pas de traduction mensuelle)
5. « Ton total ne match pas mon relevé (IQEE mélangé) » → défiance

### Ce qui me ferait booker demain (leviers émotionnels)
- **Peur de mal faire seul** + **clarté chiffrée** (« encore X $ ») + **« on le fait ensemble »** sans pitch  
- Urgence douce = années qui filent / plafond à vie, pas countdown fake  
- Phrase soft close idéale (québécois) :  
  *« Il te resterait encore ~1 200 $ de subventions possibles dans ce scénario. En 15 minutes, on regarde ce qui est déjà en place pis un rythme qui tient avec ton budget — calme, concret, zéro pression. »*

### Ce qui me fait fuir
- Hero qui me pousse le calendrier avant l’outil promis  
- Mid CTA clone « clarifier ta situation »  
- PDF comme trophée final  
- Aucune preuve humaine (photo / Victoriaville / CSF) au moment du doute

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Soft-close RDV sur `laisseSurTable` (PDF secondaire)** · Le seul chiffre Ad2 devient raison de booker, pas de download · `ReeeTool.jsx` (`statusDetail` ~L232–239, footer ~L314–322, grille ~L589–600) · Avant : « encore ~X $. Télécharge… » + PDF primary → Après : soft-close citant X $ + `Relier ça à mon budget` → `…_rdv_outil` · **H** · **S**

2. **Callout annuel `sousMaxAnnuel` (écart vs 2 500 $)** · Parent à 1 000 $/an vit le regret Ad2 en gros, pas en hint · `ReeeTool.jsx` `buildLecture` ~L133–138 + carte SCEE/an ~L456–474 · Avant : hint taupe → Après : « Tu laisses ~300 $/an… sur 12 ans ≈ 3 600 $ » + highlight preset max SCEE · **H** · **S**

3. **Titre / promesse hero = mythe « compte ouvert ≠ maximisé »** · Match Ad1/Ad3 dès 0–3 s → plus d’engagement outil chez persona chaude · `campagneAdsLandings.js` entrée `reee` (~L142–154) · Avant : « Études… ~20 % » → Après : « REEE ouvert ≠ subventions maximisées » + promesse rythme / reste avant ~7 200 $ / laisse sur la table · **H** · **S**

4. **Champ « SCEE déjà reçues » (0–7 200)** · Outil valide le vécu « j’ai déjà un compte » → questions chaudes en RDV · `ReeeTool.jsx` `projeterReee` + Block 2 + PDF « Tes entrées » · Avant : from-zero → Après : barre/reste ajustés ; « Avec ce que t’as déjà, encore ~X $ » · **H** · **M**

5. **Mid CTA copy REEE (pas « clarifier ta situation »)** · Continuity émotionnelle post-outil · `campagneAdsLandings.js` (`ctaHeadline`/`ctaSubline`) + branchement `CampagneAdsLanding.jsx` mid RDV · Avant : générique hardcodé → Après : « Tu laisses encore des subventions sur la table ? » / « 15 min pour caler âge, budget, déjà en place. » · **H** · **S** *(shell copy data — 1/2)*

6. **FAQ « J’ai déjà un REEE » + toggle cotisation mensuelle** · Tue objection #1 + baisse friction d’entrée · FAQ `campagneAdsLandings.js` ; toggle `ReeeTool.jsx` Block 2 · Avant : 3 FAQ éducatives / annuel only → Après : FAQ compte existant + « 200 $/mois = 2 400 $/an » · **M** · **S–M**

7. **Hero dual CTA : scroll outil primary / RDV secondaire** · Honore Ad3 « essaie l’outil, RDV si tu veux » · `CampagneAdsLanding.jsx` `PageHero` children + label data · Avant : seul « Réserver 15 minutes » → Après : « Voir ce que je laisse sur la table » → `#outil` ; texte « Ou réserver 15 min » · **M** · **S** *(shell dual CTA — 2/2)*

8. **Event climax `laisse_sur_table` + créa navy parent/enfant** · Meta optimise vers parents qui ont senti le regret ; CTR ↑ vs créa générique · Analytics dans `ReeeTool` quand `laisseSurTable > 0` + premier résultat ; brief `emails/campagne-meta-catalog/reee.md` · Avant : aucun signal climax / créa non validée → Après : `select_content` `campagne_reee_laisse_sur_table` (value = $) + brief navy « REEE · Subventions · Outil » (interdire « études payées à 100 % ») · **M** · **S** (event) / **M** (créa)

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Études des enfants : le gouvernement peut ajouter ~20 % | REEE ouvert ≠ subventions maximisées |
| Promesse | Entre l’âge et combien tu mets — vois les subventions, le total, et un PDF à garder. Sans jargon. | Âge + rythme → SCEE, reste avant ~7 200 $, ce que tu laisses sur la table. PDF à garder ; 15 min si tu veux caler le cadre. |
| Soft close post-outil | Il resterait encore ~X $ de subventions possibles. Télécharge ton résumé PDF. | Il resterait encore ~X $ avant le max à vie. 15 min pour caler un rythme réaliste (âge, budget, déjà en place) — zéro pression. |
| CTA label | Réserver 15 minutes (hero) | Hero : `Voir ce que je laisse sur la table` → `#outil` ; post-outil : `Relier ça à mon budget — 15 min` |
| 1 ligne confiance | (absente au fold) | Conseiller en sécurité financière — Victoriaville. Contenu éducatif, pas un pitch. |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer → **`laisseSurTable` / Encore possibles** dominant quand > 0 (pas seulement le total études)
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax → soft-close sous grille, avant ou à la place du PDF-first
- [ ] La page a une identité visuelle du **sujet** (pas template clone) → navy / parent-enfant / mythe compte ouvert
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book → voit « encore ~X $ » + « caler mon rythme »

---

## 8. Notes agent

**Sources :** `ReeeTool.jsx` (SCEE L10–17, `projeterReee` L82–106, `buildLecture`/`laisseSurTable` L108–178, UI L232–626), `campagneAdsLandings.js` (`reee` L142–175), `CampagneAdsLanding.jsx` (hero RDV-first, mid « Prêt à clarifier… » hardcodé ~L180–186), `emails/campagne-meta-catalog/reee.md` (Ad1–Ad3 + brief navy).

**Live :** https://www.pierreoliviercaouette.ca/campagnes/reee — defaults confirmés : 6 000 / 7 200 (83 %), total 36 000 $, Encore possibles 1 200 $, status PDF-first, mid générique, 3 FAQ sans « compte déjà ouvert ».

**Unique vs autres campagnes :** seul outil avec plafond à vie animé + `laisseSurTable` + `sousMaxAnnuel` — le regret est **déjà calculé** ; la conversion casse au bridge émotion → calendrier.

**Conformité :** garder « illustration / pas un conseil » ; total principal = **SCEE fédérale** explicite ; IQEE hors chiffre ou ligne séparée disclaimerée ; 4 % = optionnel non garanti ; revalider 20 % / 500 / 7 200 / IQEE avant Ads Manager ; ads : aucun « études payées à 100 % » ; ne pas présenter `laisseSurTable` comme argent « dû ».

**Pas de commit** — rapport expérience seulement.
