# [#01] Comparateur / mythe bancaire — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/comparateur-rendements`  
**Persona :** Québécois·e 32–48 ans, REER/CELI « à la banque », conviction que « tout le monde a à peu près les mêmes rendements » — objection #1 : « 2–3 % de plus, c’est du détail »  
**CTA :** RDV Bookings (`buildCampagneRdvPath('comparateur-rendements')`)  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 6,5  
**Score envie de booker après la page (1–10) :** 4,5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta : Ad1 m’a vendu « outil gratuit, zéro compte ». Sur mobile, je tombe d’abord sur le bandeau site « Portefeuilles modèles » (AAJ 2026), puis un hero navy générique — badge « Rendements », titre fort (« À profil égal, l’écart se compose »), mais le gros bouton blanc dit **Réserver 15 minutes**, pas « ouvre le comparateur ». Ça froisse : j’ai cliqué pour jouer, pas pour booker. En bref est clair (sans compte, profil égal, illustration). L’outil se charge déjà à 3/3 avec 10 000 $ / 200 $/mois / 10 ans / équilibré — live je vois banque ~52 060 $ vs modèles ~66 061 $, écart **14 001 $**. Les barres + la carte « Écart illustratif » font un vrai petit « damn ». Puis le footer me crie **Télécharger mon résumé PDF** — mon émotion meurt en lead magnet. Plus bas : « Prêt à clarifier ta situation ? » (générique) + « Voir mon écart » qui m’envoie vers `/outils/comparateur-rendements` (hors funnel). Je ne booke pas demain : j’ai mon PDF mental, zéro phrase qui cite *mon* 14 k$, et le CTA mid me fait fuir le tracking Meta. Si on collait le RDV sous l’écart avec « 14 001 $ · ton relevé · 15 min », là oui.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Bandeau portefeuilles (site) → `PageHero` navy + grille + orbs · badge « Rendements » · H1 « À profil égal… » · CTA blanc « Réserver 15 minutes » | Curieux puis méfiant (« ads = outil, page = RDV ») | Fuite : mismatch Ad1. Opportunité : dual CTA « Voir mon écart » primaire + RDV secondaire |
| 3–15 s En bref | 3 cards numérotées : gratuit/sans compte · profil égal · illustration + 15 min | OK, rassuré | Opportunité sous-exploitée : pas de chiffre / preuve 20 ans du post mythe |
| Première interaction outil | Shell « Banque vs modèles — même départ » · Progress **déjà 3/3** · champs préremplis · 5 radios profil avec taux inline | Soulagé (pas de formulaire) puis « wow c’est déjà fini ? » | Fuite : pas de geste découverte. Opportunité : chip « scénario mythe 50 k$ · 20 ans » pour forcer un 2ᵉ aha |
| Climax résultat | 2 cards totaux + barres Banque/Modèles + `ResultCard` « Écart illustratif » **14 001 $** (~26,9 %) · `ecartFontScale` | Damn doux — objection « détail » fissurée | Opportunité #1 : monétiser *ce* chiffre en soft close RDV immédiat |
| Après le climax (PDF / CTA) | Status « C’est prêt. Télécharge le PDF… » · bouton primaire PDF plein (`ToolDownloadPdf`) · disclaimer court | Emotion ↓ · mode « souvenir » | Fuite majeure : PDF vole la vedette. Pas de `…_rdv_tool` |
| Soft close mid / form | Bloc navy « Prêt à clarifier ta situation ? » · RDV + **« Voir mon écart »** → `/outils/…` | Flat / confus | Fuite critique funnel (`secondaryIsTool` mort). Soft close ≠ ton Ad3 |
| FAQ / fin | 3 FAQ (garantie / profil égal / outil obligatoire) · disclaimer site générique | Neutre | Fuite : pas de « mêmes produits ? » / « d’où viennent les taux ? » — peurs post-écart |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évaluer **cette** landing, pas un conseil générique.

### Hero
- Composition (brand, titre, promesse, CTA) : titre **excellent** (mythe composé). Badge trop vague (« Rendements » ≠ Comparateur). Promesse OK mais silence sur « gratuit / sans compte » (hook #1 ads). CTA unique = RDV — trop agressif vs Ad1/Ad2/Ad3 « tu joues d’abord ».
- Atmosphère : `PageHero.jsx` = gradient + glow-orbs + grille site. **Zéro** reprise visuelle navy/chiffres des PNG mythe (`facebook-campagne-rendements.png`). Sent « landing campagne générique », pas « banque vs modèles ».
- Motion / présence : orbs CSS passifs ; pas de motion utile sur l’écart à l’apparition 3/3. Compteur Progress anime la barre — OK mais le climax $ n’a pas d’entrée scénique.
- Mobile : H1 lisible ; CTA pouce OK ; mais 5 radios profil empilés + taux + 3 result cards = scroll long **avant** de revoir l’écart après avoir tweaker.

### Corps de page
- Hiérarchie : En bref (1 job) → outil (1 job) → mid CTA → FAQ. Correct, pas de card soup extrême. Intro « À toi de jouer » hardcodée PDF-first (`CampagneAdsLanding.jsx` L133–135) — trop générique.
- Confiance : bandeau portefeuilles live (AAJ) au-dessus = bonus inattendu pour *cette* campagne ; mais **aucune** ligne CSF / Victoriaville / process « ouvre → profil → écart → 15 min » dans le corps. Photo conseiller absente.
- Densité : hero un peu vide d’atmosphère sujet ; outil dense (bien) ; mid CTA trop vide de contenu émotionnel.
- Ce qui manque pour un rendu **pro / premium** (liste concrète) :
  1. Ancre visuelle « banque vs modèles » / chiffre d’écart dans le hero (pas collage stickers).
  2. Module preuve 1 job : tableau 5 profils + ligne 50 k$ / 20 ans (~150 k$) — absente alors que le post organique la porte.
  3. Soft close mid myth-specific (pas le navy clone des 15 landings).
  4. Ligne confiance « Conseiller en sécurité financière · iA · Victoriaville » sous hero ou avant mid.

### Soft close / form
- Mid : digne d’un template, pas d’un RDV payé en attention Meta. Microcopy générique. 2ᵉ bouton = fuite. Aucune citation de *mon* écart. Réassurance = « sans pression » seulement — Ad3 est plus fort (« pas pour te vendre un produit en vitesse »).

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. **Hero outil-first + badge Comparateur** — Avant : badge « Rendements » + CTA RDV seul (`campagneAdsLandings.js` L178–184, `CampagneAdsLanding.jsx` L79–88). Après : badge « Comparateur » · promesse + « Gratuit, sans compte » · CTA primaire scroll `#outil` « Voir mon écart » + RDV ghost.
2. **Module preuve composé sous En bref** — Avant : 3 bullets → outil. Après : section 1 job « Pourquoi 2–3 % ce n’est pas du détail » + mini-table 5 profils + 1 ligne projection 20 ans + disclaimer adjacent.
3. **Climax typographique** — Avant : Progress « 3 / 3 » rivalise avec l’écart ; PDF bouton plein. Après : à `milestones[2].done`, scale/fade sur `Écart illustratif` + bandeau RDV collé ; PDF outline.

---

## 3. Audit OUTIL interactif (cœur du WOW)

Lis le JSX. Joué live sur https://www.pierreoliviercaouette.ca/campagnes/comparateur-rendements (2026-11-04).

### Première impression outil
- En <10 s : oui — titre « Banque vs modèles — même départ » + intro claire. Je comprends le deal.
- Defaults (`'10000'` / `'200'` / `'10'` / `equilibre`, L148–151) : aident l’aha immédiat (~14 k$ live avec modèles ~9,6 % au 27 oct. 2026) mais **spoilent** le parcours « je joue » et **manquent** le scénario signature ads/post (50 k$ / 0 $/mois / 20 ans → écart ~150 k$). Progress 3/3 dès l’arrivée = pas de tension.

### Moment « wow »
- Chiffre qui doit faire dire « damn » : **`Écart illustratif`** (`ResultCard` L569–575 + barres L540–567 + `ecartFontScale`). Live : **14 001 $** après 10 ans, ≈ 26,9 % vs banque, ~34 000 $ versés.
- Assez grand ? Oui pour 10 ans + cotisations. Assez narré ? Non — aucune phrase « 2–3 pts × composition = … ». Assez personnel ? Semi : je n’ai pas collé *mon* taux relevé ; le préréglage 6,3 % fait le travail sans mon geste.
- Manque pour désir de parler : (1) interprétation québécoise sous l’écart, (2) CTA RDV qui cite le $, (3) invitation à coller le taux du relevé comme « prochain micro-geste » avant booker, (4) preset mythe pour vivre le wow organique.

### Friction outil
- 5 radios + ligne `banque ~X % · modèles Y %` = dense mobile avant climax.
- Jargon « modèles / série Classique » peu expliqué dans l’outil (FAQ non).
- PDF vole la vedette (`statusDetail` L222–227 → « Télécharge le PDF »).
- Gaps vs ads : scénario composé 20 ans absent ; tableau tous profils absent ; PDF ASCII sans accents (`Resume — banque vs modeles`, L231) ; disclaimer outil < ads (pas Classique 75/75, pas « produits différents »).

### Après le résultat
- Next step naturel aujourd’hui = **PDF**, pas booker. Le mid CTA arrive trop tard + trop générique + fuite secondaire. Je quitte avec un chiffre, sans calendrier.

**Note outil WOW /10 :** 6,5  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Soft close + RDV sous écart** — Avant : « C’est prêt. Télécharge le PDF… » + `ToolDownloadPdf` primaire (`ComparateurRendementsTool.jsx` L222–227, L289–297). Après : « ≈ {écart} après {N} ans à profil égal. Ça chicotte ? 15 min pour coller ça à ton relevé. » + `trackRendezVousClick('campagne_comparateur-rendements_rdv_tool')` + PDF outline.
2. **Chip preset mythe 50 k$ · 20 ans** — Avant : defaults 10k/200/10 seuls (L148–151). Après : chip one-tap → `50000` / `0` / `20` / `equilibre` + reset taux banque ; microcopy « Même illustration que le post ».
3. **Narration « 2–3 % ≠ détail » sous ResultCard écart** — Avant : detail technique % + capital versé (L572). Après : + 1 phrase composition en $ / an ou cumul + CTA « Saisis le taux de ton relevé pour coller ça à toi ».
4. **PDF FR + notes méthodo ads** — Avant : ASCII + notes courtes (L229–281). Après : accents ; notes = moyenne 5 ans nette Classique 75/75 (`asOfLabel`) + préréglages bancaires illustratifs + produits différents + passés ≠ futurs.
5. **Event `…_result` à 3/3** — Avant : seul `onFocusCapture` landing (`CampagneAdsLanding.jsx` L120–125). Après : `select_content` une fois quand `milestones[2].done` (qualité funnel).

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « Ma banque me donne déjà de bons rendements / tout le monde a à peu près la même affaire » (Ad3 + post).
2. « 2–3 % de plus par année, c’est du détail » (Ad2 — la page ne montre pas le ~150 k$ / 20 ans).
3. « C’est pas comparable — pas les mêmes produits / c’est de la pub » (post-écart ; FAQ absente).
4. « Pour comparer, fallait un RDV / un compte » (Ad1) — l’outil prouve le contraire, le hero le contredit.

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve / clarté / urgence douce / « on le fait ensemble » / peur de mal faire seul : voir *mon* écart $ + peur de laisser composer le mauvais côté sans avoir collé le relevé ; reassurance « illustration → on valide ensemble, pas un pitch produit ».
- Phrase de soft close idéale (québécois) qui cite **mon** résultat :  
  « T’as ~14 000 $ d’écart illustratif après 10 ans, à profil égal. Si ton relevé raconte autre chose — ou la même affaire — on le regarde en 15 minutes. Zéro pression. »

### Ce qui me fait fuir
- Hero qui push le calendrier avant l’outil.  
- PDF comme seul next step après le damn.  
- Bouton « Voir mon écart » qui quitte la campagne vers l’outil public.  
- Soft close clone « Prêt à clarifier ta situation ? ».  
- Disclaimer / FAQ trop faibles quand l’écart $ est agressif → réflexe « c’est du marketing ».

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Soft close chiffré + RDV collé sous l’écart (PDF secondaire)** · Le climax produit est l’écart $ — c’est *là* que je booke, pas 2 écrans plus bas · `ComparateurRendementsTool.jsx` (`statusDetail`, `footer`, après `ResultCard` L569) + `buildCampagneRdvPath` / `trackRendezVousClick` · Avant : PDF-only « C’est prêt… » · Après : phrase qui cite `{formatCad(ecart)}` + CTA RDV primaire + PDF outline · **H** · **S**

2. **Couper la fuite mid « Voir mon écart » → `/outils/comparateur-rendements`** · Je reste dans le funnel UTM / Bookings campagne · `campagneAdsLandings.js` L207–210 (`apprendrePath`, `apprendreLabel`, `secondaryIsTool`) ; `CampagneAdsLanding.jsx` L197–208 · Avant : 2ᵉ bouton = sortie site + track `_apprendre` · Après : ancre `#outil` « Ajuster mon écart » **ou** retirer ; brancher `secondaryIsTool` · **H** · **S**

3. **Preset one-tap scénario mythe 50 000 $ · 0 $/mois · 20 ans** · Je revis le wow organique (~150 k$) qui casse l’objection « détail » · `ComparateurRendementsTool.jsx` Block « Tes chiffres » L330–404 + state L148–151 · Avant : defaults 10k/200/10 seulement · Après : chip « Essayer le scénario 50 k$ · 20 ans (mythe) » · **H** · **S**

4. **Module preuve landing : 5 profils + story composé 20 ans** · Ads/post vendent une preuve ; sans elle la landing est plus faible que l’organique · Nouveau bloc conditionnel slug dans `CampagneAdsLanding.jsx` **ou** data `proof*` dans `campagneAdsLandings.js` ; rates `comparateurRendementsRates.js` / `getIaPct` · Avant : En bref → outil · Après : section 1 job + disclaimer · **H** · **M**

5. **Soft close mid myth-specific (ctaHeadline / ctaSubline)** · Le navy mid cesse d’être un clone · Data `campagneAdsLandings.js` + branche RDV `CampagneAdsLanding.jsx` L182–187 *(shell — item générique #1)* · Avant : « Prêt à clarifier ta situation ? » · Après : « Tu as l’écart illustratif. Et ton relevé ? » / « 15 min pour relier l’illustration à ce que t’as déjà — pas pour te vendre un produit en vitesse. » · **H** · **S**

6. **FAQ « mêmes produits ? » + « d’où viennent les taux ? » + disclaimer = ads** · Ferme le réflexe « pub » juste après le wow $ · `campagneAdsLandings.js` `faq` L190–206 ; disclaimer page L229–232 ; prop `disclaimer` outil L288 ; ref ads L11–12 · Avant : 3 FAQ ; disclaimer générique · Après : +2 objections ; texte ads (Classique 75/75, produits différents, `asOf`, CSF, iA) · **M** · **S**

7. **Hero outil-first + badge/promesse « gratuit sans compte »** · Aligne Ad1→landing ; je scroll vers le WOW avant le calendrier · `campagneAdsLandings.js` L178–184 + `CampagneAdsLanding.jsx` dual CTA *(shell — item générique #2)* · Avant : CTA RDV seul · Après : primaire `#outil` + RDV secondaire ; badge « Comparateur » ; promesse + « Gratuit, sans compte » · **M–H** · **S**

8. **PDF accents FR + notes méthodo + Ad2 catalog composé 20 ans** · Asset gardé crédible + retargeting « composé » ancré · `ComparateurRendementsTool.jsx` `handleDownload` L229–281 ; `emails/campagne-meta-catalog/comparateur-rendements.md` Ad2 L44–68 · Avant : `Resume — banque vs modeles` ; Ad2 sans chiffre 20 ans · Après : FR + notes ads ; Ad2 = mythe 2–3 % + scénario 50 k$/20 ans + CTA outil + disclaimer · **M** · **S–M**

*(Items 5 et 7 = seuls items « shell générique » — le reste est unique à cette campagne.)*

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | À profil égal, l’écart se compose | *(garder)* À profil égal, l’écart se compose |
| Promesse | Même montant, mêmes cotisations, même confort avec le risque — vois l’écart illustratif côte à côte. | Même montant, mêmes cotisations, même confort avec le risque — vois l’écart illustratif banque vs modèles. Gratuit, sans compte. |
| Soft close post-outil | C’est prêt. Télécharge le PDF pour garder ton comparatif. / Prêt à clarifier ta situation ? | ≈ {écart} après {N} ans à profil égal. Ça chicotte ? On colle ça à ton relevé en 15 minutes — zéro pression. / Tu as l’écart illustratif. Et ton relevé ? |
| CTA label | Réserver 15 minutes *(hero seul)* | Hero : Voir mon écart → · Mid/outil : Réserver 15 minutes |
| 1 ligne confiance | *(absente hors footer)* | Conseiller en sécurité financière · iA Groupe financier · Victoriaville — illustration, pas un pitch produit. |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax
- [ ] La page a une identité visuelle du **sujet** (pas template clone)
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book

**État 2026-11-04 :** climax visible (écart + barres) ✅ partiel ; CTA RDV dans les 2 s après climax ❌ (PDF d’abord) ; identité sujet ❌ (PageHero clone + fuite mid) ; ami comprend pourquoi Book ❌ (pourquoi PDF, oui).

---

## 8. Notes agent

**Sources code :**  
- `frontend/src/pages/CampagneAdsLanding.jsx`  
- `frontend/src/components/layout/PageHero.jsx`  
- `frontend/src/components/campagne/tools/ComparateurRendementsTool.jsx`  
- `frontend/src/components/campagne/CampagneToolShell.jsx`  
- `frontend/src/data/campagneAdsLandings.js` (entrée `comparateur-rendements` L176–211)  
- `frontend/src/data/comparateurRendementsRates.js`  
- `emails/campagne-meta-catalog/comparateur-rendements.md`

**Page live ouverte :** https://www.pierreoliviercaouette.ca/campagnes/comparateur-rendements  
Observations 2026-11-04 : bandeau portefeuilles modèles au 27 oct. 2026 au-dessus du hero ; defaults → banque 52 060 $ · modèles 66 061 $ (~9,6 %) · écart **14 001 $** ; Progress 3/3 immédiat ; footer PDF primaire ; mid « Voir mon écart » présent.

**Conformité :** garder illustration / passés ≠ futurs / pas conseil personnalisé / titre CSF / iA. Tout claim ~150 k$ ou taux nominaux **avec** disclaimer adjacent (série Classique 75/75, produits différents, date `asOf`). Ne pas présenter les préréglages banque comme « ton rendement réel » sans « ou saisis ton taux ».
