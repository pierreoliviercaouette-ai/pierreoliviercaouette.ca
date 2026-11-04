# [#09] CELI droits — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/celi-droits`  
**Persona :** 28–42 ans, Québec (souvent Centre-du-Québec). Clique une pub Meta parce qu’il/elle se dit *« j’ai maxé mon CELI »* ou *« c’est juste le plafond de l’année »*. Objection #1 : « J’ai déjà cotisé assez / y’a rien à clarifier — j’veux pas qu’on me vende une cotisation. »  
**CTA :** RDV Bookings **15 min** (`/rendez-vous/campagne`)  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 7  
**Score envie de booker après la page (1–10) :** 4,5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta — Ad1 m’a dit que le plafond de l’année, c’est pas toute l’histoire. Le hero me tape « ça coûte cher en silence » : OK, ça pique, mais l’ad parlait pas de coût, elle parlait de *place*. Badge CELI + promesse « coller un objectif avant de maxer » — là je reconnais Ad3. CTA blanc « Réserver 15 minutes » dès le fold alors que l’ad a juré *outil d’abord, sans compte* : micro-suspicion. Je scroll, En bref #3 promet Urgence / Projet / Long terme — nice. L’outil ouvre déjà rempli (1992 / 20 000 $ / 7 000 $) : barre à 19 %, puis **84 000 $** de place restante en gros. Damn. C’est le WOW. Mais juste après, la lecture me dit « décide urgence, projet, long terme »… sans me laisser choisir. Footer : « Télécharge le PDF et compare avec Mon Dossier ARC. » Pas de bouton RDV sous le chiffre. Mid CTA générique « Prêt à clarifier ta situation ? ». Est-ce que je booke ? Probablement **pas ce soir** — j’ai mon wow, j’ai mon PDF, l’ad m’a dit que le RDV est optionnel, et personne m’a aidé à coller un usage sur ces 84 k$. Demain matin j’oublie.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge CELI, H1 « Des droits CELI qui dorment, ça coûte cher en silence », promesse coller un objectif, CTA « Réserver 15 minutes », fond PageHero navy/gradient + orbes | Curiosité + léger mismatch ads (« outil d’abord ») vs RDV-first | Fuite : claim coût non illustré. Opportunité : H1 mythe plafond / « t’as vraiment regardé ce qu’il te reste ? » + CTA primaire scroll `#outil` |
| 3–15 s En bref | 3 bullets : cumulés≠plafond · 3 chiffres+PDF ARC · Urgence/projet/LT | Confiance qui monte — bullet 3 = promesse Ad3 | Opportunité : bullet 3 crée une dette produit — si l’outil ne livre pas le sélecteur, confiance ↓ au climax |
| Première interaction outil | Titre « Combien de place te reste… », barre 20k/104k (19 %), année 1992 préremplie, déjà 20k, prévu 7k | « Wow déjà un chiffre » puis « c’est *mes* chiffres ou un exemple ? » | Fuite : ownership faible sans badge Exemple. Opportunité : aha immédiat defaults (bon pour Meta) *si* marqué Exemple + reset |
| Climax résultat | Gros **84 000 $** « Place restante », detail « Cumulés 104k · déjà 20k · plafond 2026 : 7k », bullet « Beaucoup de place qui dort… urgence, projet, long terme » — **texte seul, pas de chips** | Damn / soulagement / légère panique (« j’ai maxé ? non ») | **WOW réel sur le $**. Fuite mortelle : promesse usage non interactive. Opportunité #1 = chips + contraste visuel 7k vs 84k |
| Après le climax (PDF / CTA) | ResultCards cotisation possible / place après · « À retenir » ×4 · statusDetail → PDF · disclaimer ARC | Pic émotionnel retombe en download | Fuite : PDF cannibalise le RDV. Opportunité : soft close « ~84k · usage ? — 15 min soft » dans les 2 s |
| Soft close mid / form | « Prêt à clarifier ta situation ? » + Réserver 15 min + capsule CELI | Froideur — plus de lien avec *mon* 84k | Fuite shell. Opportunité : « Ta place restante, c’est un chiffre. L’usage, c’est le plan. » |
| FAQ / fin | 4 FAQ (décembre / maxer / CELI vs REER / conseil ?) — **pas** « où trouver déjà cotisé » | Partiel — objection maxer OK, friction champ #1 absente | Fuite si je sais pas mon déjà cotisé → abandon outil. Opportunité FAQ ARC/relevés |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évalué sur live `https://www.pierreoliviercaouette.ca/campagnes/celi-droits` (2026-11-04) + JSX.

### Hero
- **Composition :** Brand (nav iA + Pierre-Olivier) OK. Badge CELI OK. H1 fort mais angle **coût** ≠ créa Meta (mythe plafond / année de naissance). Promesse alignée Ad3. CTA seul = RDV — trop « pitch » pour un lead Ad3 « essaie d’abord ».
- **Atmosphère :** PageHero gradient navy + orbes génériques — **ne « sent » pas** le CELI / place restante / mythe bancaire du brief ads (« gros CELI · Place restante · sans compte »). Bandeau portefeuilles modèles au-dessus = distraction hors sujet.
- **Motion :** Orbes / vague hero = présence soft ; barre outil `duration-500` = seul motion utile métier. Pas de reveal du gros chiffre.
- **Mobile :** CTA hero thumb-friendly ; mais le parcours ads veut scroller vers l’outil — un seul CTA RDV force un choix trop tôt.

### Corps de page
- **Hiérarchie :** En bref → À toi de jouer → outil : une job/section OK. Outil dense mais lisible (steps 1–3 + climax). Pas de card soup hors shell.
- **Confiance :** Victoriaville / CSF seulement en SEO + footer disclaimer — **absent** au-dessus du fold et près du soft close. Pastille « sans compte · sans formulaire » **absente** alors que les 3 ads la martèlent.
- **Densité :** Hero aéré ; outil juste assez chargé ; entre climax et mid CTA = À retenir + PDF = scroll mort mobile.
- **Manque pour un rendu pro / premium :**
  1. Ancre visuelle CELI (gros « Place restante » / contraste plafond vs place) dans ou sous le hero
  2. Pastille trust ads « Sans compte »
  3. Soft-close bandeau navy sous le 84k (pas seulement mid générique)
  4. Ligne CSF · Victoriaville près du CTA mid
  5. Lien cliquable Mon Dossier ARC (texte plain partout)

### Soft close / form
- Mid shell « Prêt à clarifier… » = indigne du chiffre qu’on vient de voir. Microcopy ne cite ni `$` ni usage. Réassurance soft ads (« Clarifier ≠ cotiser demain ») **absente** de la page.

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. **Hero H1 + CTA** — Avant : « ça coûte cher en silence » + RDV primary. Après : « Des droits CELI qui dorment — t’as vraiment regardé ce qu’il te reste ? » + primaire « Estimer ma place » (`#outil`) / secondaire RDV texte.
2. **Climax contraste** — Avant : 84k dominant, plafond 7k noyé dans `lecture.detail`. Après : split 2 colonnes « Plafond 2026 : 7 000 $ » vs « Place restante estimée : 84 000 $ » (gros côté place).
3. **Bandeau post-chiffre** — Avant : PDF-only footer. Après : bandeau navy « ~84 000 $ estimés — coller un usage en 15 min, soft » + PDF outline.

---

## 3. Audit OUTIL interactif (cœur du WOW)

Fichier : `frontend/src/components/campagne/tools/CeliDroitsTool.jsx` (~601 lignes). Scénario defaults live : naissance **1992** → droits depuis 2010 **104 000 $** · déjà **20 000 $** · prévu **7 000 $** → **placeRestante = 84 000 $**.

### Première impression outil
- En &lt;10 s : oui — barre « Place utilisée » + titre « Combien de place te reste… » = job claire.
- Defaults : **excellent aha Meta** (84k vs mythe 7k) mais **spoilent l’ownership** — je crois que c’est *moi* jusqu’à ce que je change un champ. Pas de badge « Exemple ».

### Moment « wow »
- Chiffre qui devrait faire dire damn : **`formatCad(placeRestante)`** en `text-3xl/4xl` + headline `Environ X $ de place restante`.
- Assez grand : **oui**. Assez narré : partiel (`buildLecture` points OK). Assez personnel : **non** — defaults étrangers + pas d’usage choisi.
- Manque pour désir de parler à quelqu’un : **trancher à quoi servent ces $** (urgence / projet / LT) puis soft close qui cite mon X $ + mon usage. Aujourd’hui `buildLecture` l.210–212 *mentionne* les 3 usages en string si `placeRestante > plafondAnnuel * 2` — **aucun `useState('usage')`, aucune chip** (confirmé live + JSX).

### Friction outil
- Champ « Déjà cotisé (à vie) » = jargon / peur d’erreur (cotisations ≠ solde) — hint présent, FAQ absente.
- « Mon Dossier ARC » cité partout, **zéro hyperlien**.
- Scroll : barre + 2 blocks + climax + 2 cards + À retenir + PDF avant tout RDV.
- PDF ASCII (`Resume`, `Annee`, `Deja`, `prevue`) = polish amateur au download.
- Gap ads : Ad3 « coller un objectif (urgence, projet, long terme) » → **non livré**.

### Après le résultat
- Next step naturel actuel = **PDF / ARC**, pas booker. `statusDetail` (l.307–311) oriente 100 % download. Pas de `trackRendezVousClick('campagne_celi-droits_rdv_outil')` dans l’outil.

**Note outil WOW /10 :** 7 (chiffre fort) → **conversion outil→RDV ~3/10**  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Sélecteur usage** — Avant : string dans `buildLecture`. Après : chips exclusives Fonds d’urgence · Projet court · Long terme / retraite → branchent lecture + CTA + PDF. · `CeliDroitsTool.jsx`
2. **Soft close post-`placeRestante`** — Avant : footer PDF. Après : « ~{X} $ · usage {Y}. 15 min pour coller ça à ton plan — soft. » + event `_rdv_outil` ; PDF ghost. · `CeliDroitsTool.jsx` (+ slot footer shell)
3. **Split plafond vs place** — Avant : plafond dans detail. Après : bandeau contraste Ad1 sous barre ou au-dessus du gros $. · `CeliDroitsTool.jsx` ~L515–552
4. **Lien ARC + pastille sans compte** — Avant : plain text. Après : lien officiel nouvel onglet + badge ads près intro/disclaimer. · `CeliDroitsTool.jsx` + option data landing
5. **Badge Exemple + reset + accents PDF** — Avant : defaults « réels » + PDF sans accents. Après : badge jusqu’à edit ; « Partir de zéro » ; PDF FR + note soft RDV. · `CeliDroitsTool.jsx` state + `handleDownload`

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « J’ai déjà maxé / c’est juste le plafond de l’année — j’ai rien à apprendre. » (Ad1 — l’outil la casse si je crois le chiffre)
2. « Si je me trompe sur le déjà cotisé, je vais cotiser en trop et me faire taxer. »
3. « Coller un objectif = on va me pousser à maxer demain. » / « Faut un RDV juste pour savoir » (Ad3 — partiellement rassuré par l’outil, pas par le hero CTA)

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve : contraste 7k vs 84k impossible à manquer + pastille sans compte tenue.
- Clarté : chips usage → je quitte avec *une* intention, pas juste un PDF.
- Urgence douce : « Clarifier ≠ cotiser demain » repris sous le chiffre.
- Peur de mal faire seul : « On vérifie ton ordre de grandeur vs ARC et on colle l’usage — 15 min. »
- **Phrase soft close idéale (québécois) :** « T’as ~84 000 $ de place estimée. Avant de maxer pour maxer — on colle ça à un usage (urgence, projet ou long terme) en 15 minutes. Soft. Zéro pression de cotiser demain. »

### Ce qui me fait fuir
- Hero qui pousse le RDV avant l’outil alors que l’ad a promis le contraire.
- Claim « coûte cher » sans illustration → doute conformité / bullshit marketing.
- PDF comme seule récompense du wow.
- Promesse Urgence/Projet/LT en En bref **non jouable** dans l’outil.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Sélecteur d’usage Urgence / Projet / Long terme (ABSENT — dette produit #1)** · Je booke parce que le chiffre devient *une décision*, pas un screenshot · `CeliDroitsTool.jsx` (`useState` usage + chips avant/dans « Ce que ça veut dire » ; brancher `buildLecture` + PDF + soft close) · Avant : mention texte si place &gt; 2× plafond. Après : chips obligatoires/fortement suggérées → lecture + CTA adaptés · **H** · **M**

2. **Soft close RDV ancré sur `placeRestante` + usage (dans les 2 s du climax)** · Je booke au pic émotionnel, pas après un PDF · `CeliDroitsTool.jsx` (sous gros $ / footer) + `trackRendezVousClick('campagne_celi-droits_rdv_outil')` · Avant : « Télécharge le PDF et compare avec Mon Dossier ARC. » Après : « ~{X} $ estimés · usage {Y}. 15 min soft pour coller le plan. » PDF outline · **H** · **S**

3. **Contraste visuel mythe Ad1 : plafond annuel vs place restante** · Je *sens* que j’avais tort sur « j’ai maxé » → désir de valider · `CeliDroitsTool.jsx` zone résultat ~L515–552 ou sous barre · Avant : 7k noyé dans detail. Après : split « Plafond {année} : 7 000 $ » vs « Place totale estimée : {X} $ » · **H** · **S**

4. **Pastille « Sans compte » + lien Mon Dossier ARC** · Confiance ads↔page ; friction « où je vérifie ? » ↓ · Intro/disclaimer `CeliDroitsTool.jsx` (+ landing si besoin) · Avant : ARC plain text ×N. Après : lien officiel nouvel onglet + badge « Sans compte · sans formulaire · estimation » · **M** · **S**

5. **Réaligner H1 hero ↔ ads (retirer claim coût non illustré)** · Moins de dissonance + conformité ; match Ad1/Ad2 · `campagneAdsLandings.js` item `celi-droits` (`title` / `promise`) · Avant : « ça coûte cher en silence ». Après : « Des droits CELI qui dorment — t’as vraiment regardé ce qu’il te reste ? » · **M** · **S**

6. **Badge « Exemple » + reset sur defaults 1992 / 20k / 7k** · Insight *mien* → RDV de meilleure qualité · `CeliDroitsTool.jsx` init state + UI Blocks 1–2 · Avant : chiffres « réels » sans marquage. Après : badge Exemple jusqu’au 1er edit ; « Partir de zéro » · **M** · **S**

7. **FAQ « Où trouver mon déjà cotisé ? » + accents PDF** · Moins d’abandon sur le champ #1 ; polish trophy PDF · `campagneAdsLandings.js` `faq` + `handleDownload` · Avant : 4 FAQ ; PDF `Resume — place restante CELI`. Après : FAQ cotisations≠solde / ARC ; PDF FR + note soft RDV · **M** · **S**

8. ***(Shell — max 2)* Mid CTA data-driven CELI + hero outil-first** · Pont post-outil digne du chiffre ; ads Ad3 tenues · `campagneAdsLandings.js` (`ctaHeadline` / `ctaSubline`) + pattern `CampagneAdsLanding` hero dual CTA · Avant : « Prêt à clarifier ta situation ? » + hero RDV only. Après : « Ta place restante, c’est un chiffre. L’usage, c’est le plan. Clarifier ≠ cotiser demain. » + hero primaire `#outil` · **M** · **S**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Des droits CELI qui dorment, ça coûte cher en silence | Des droits CELI qui dorment — t’as vraiment regardé ce qu’il te reste ? |
| Promesse | Voir ce qu’il te reste vraiment à cotiser — et coller un objectif avant de « maxer ». | Estime ta place restante en 2 minutes. Ensuite, colle un usage (urgence, projet, long terme) — ou pas. |
| Soft close post-outil | Ton estimation est prête. Télécharge le PDF… / mid : Prêt à clarifier ta situation ? | ~{X} $ estimés · usage {urgence\|projet\|LT}. Clarifier ≠ cotiser demain — 15 min, soft. |
| CTA label | Réserver 15 minutes (hero + mid) | Hero : Estimer ma place (`#outil`) · Post-outil : Coller un usage — 15 min · Mid : Réserver 15 minutes |
| 1 ligne confiance | *(absente au fold)* | Sans compte · estimation seulement · le solde officiel, c’est Mon Dossier ARC · CSF · Victoriaville |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil (`placeRestante` + contraste plafond) est impossible à manquer
- [ ] Le CTA RDV apparaît **dans les 2 secondes** après le climax (avant/à côté du PDF, pas seulement mid)
- [ ] La page a une identité visuelle **CELI / place restante** (pas clone PageHero orbes seules) + pastille sans compte
- [ ] Un ami à qui je montre mon écran comprend en 5 s : « Ah — t’as de la place, et t’as choisi un usage, tu bookes pour coller le plan »

---

## 8. Notes agent

**Sources :** `_TEMPLATE.md` ; live `https://www.pierreoliviercaouette.ca/campagnes/celi-droits` (snapshot + hero 2026-11-04) ; `CeliDroitsTool.jsx` (entier) ; `campagneAdsLandings.js` `celi-droits` (~L253–291) ; `emails/campagne-meta-catalog/celi-droits.md` (Ad1–3 + brief navy) ; `00-SYNTHESE.md` (sélecteur usage = priorité #09).

**Observations live (defaults) :** barre 20 000 $ / 104 000 $ (19 %) · place restante **84 000 $** · bullet usage texte only · footer PDF only · mid « Prêt à clarifier… » · FAQ ×4 sans déjà cotisé · aucun contrôle radio/chip usage.

**Unique vs autres campagnes :** seul funnel qui **promet explicitement** le tri d’usage (ads + bullet 3 + `buildLecture`) et **ne l’implémente pas**. Estimateur droits déjà riche (cumuls 2009–2026, dépassement, coupe plafond annuel) — le gap n’est pas le calcul, c’est le pont **chiffre → intention → RDV**.

**Conformité :** adoucir/retirer « coûte cher » sans quantification ; garder estimation + ARC fait foi ; pas de rendement inventé ; `PLAFONDS_ANNUELS` commentés « À revalider » — revalider avant scale Ads ; URL ARC officielle à jour pour le lien.

**Pas de commit** — rapport doc seulement.
