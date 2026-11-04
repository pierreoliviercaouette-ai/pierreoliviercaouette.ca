# [#03] Hypothèque + assurance vie — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Persona :** 28–55 ans, hypothèque en cours, a coché l’assurance du prêteur « le jour du prêt » — objection #1 : « C’est déjà réglé, la banque s’occupe du prêt. »  
**CTA :** RDV Bookings — « Réserver 15 minutes »  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5  
**Score « effet WOW » outil (1–10) :** 6  
**Score envie de booker après la page (1–10) :** 4.5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta, vidéo Option 1 / Option 2 encore dans la tête — « prime qui peut monter aux renouvellements », « qui est vraiment protégé ». Le H1 m’accroche tout de suite : banque **ou** famille, c’est exactement mon doute. Puis le hero me pousse « Réserver 15 minutes » avant que j’aie vu un chiffre : je me méfie un peu, je scrolle. En bref, trois cards éducatives OK mais sans émotion. L’outil ouvre fort (solde 350 k$ → coût relatif ×2, ambre) — là je hoche la tête — puis je tombe dans un mur : cinq critères « Lu » empilés. Sur mobile je décroche presque. Plus bas, miracle : **350 000 $ vs 447 000 $**, dont **97 000 $ au-delà du prêt**. Damn. Mais juste après : disclaimer + « Télécharger mon résumé PDF ». Pas de « on regarde ton écart en 15 min ». Le soft close mid dit « Prêt à clarifier ta situation ? » — générique, mon chiffre a disparu. Je bookerais **peut-être** si j’étais déjà chaud ; sinon je telecharge le PDF et je disparais. Le wow existe, il est enterré et non monétisé.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge « Assurance hypothécaire », H1 banque vs famille, gradient navy/orbs, CTA blanc RDV | Curiosité + légère pression vente | H1 = WOW copy ; visual = template clone (pas de maison/foyer) ; CTA avant insight = friction |
| 3–15 s En bref | 3 cards numérotées (prêteur / perso / estimateur) | « OK je comprends le pitch » | Dense, utile, zéro tension chiffrée ; promesse ads « chiffre les proches » encore abstraite |
| Première interaction outil | Defaults 350 k$ / 20 ans / 45 $ → cards ambre ×2.0 + émeraude « famille » | Validation (« oui ma couverture baisse ») | Mini-wow coût relatif **trop tôt** et sans pont RDV ; ensuite tableau 5× bloque le vrai climax |
| Climax résultat | Après scroll + 4 champs : ResultCards 350 k$ vs **447 k$** (97 k$ au-delà) | Pic émotionnel famille | `auDelaDuPret` calculé mais en `detail` text-sm — pas dominant ; pas de barre gap |
| Après le climax (PDF / CTA) | Footer shell : compteur « points lus » + PDF only | Refroidissement | Fuite PDF ; opportunité = soft close chiffré + `…_rdv_outil` **ici** |
| Soft close mid / form | « Prêt à clarifier… » / « On regarde ton résumé » + RDV + capsule | Neutre / « déjà vu sur les autres pages » | Ne cite ni solde ni capital famille → envie booker ↓ |
| FAQ / fin | 4 FAQ (même chose que vie ? coût ↑ ? 100 % solde ? annuler banque ?) | Prudence OK | Manque FAQ **renouvellement / prime qui monte** (promis ads) → dissonance post-clic |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évalué live : `https://www.pierreoliviercaouette.ca/campagnes/hypotheque-assurance-vie` (2026-11-04).

### Hero
- Composition : brand faible hors nav ; H1 fort et sujet-spécifique ; promesse **deux jobs** (comparer + chiffrer) un peu dense ; CTA RDV blanc dominant avant valeur.
- Atmosphère : gradient navy + orbes `PageHero` — **ne « sent » pas** l’hypothèque / la maison / la famille. Pourrait être n’importe quelle campagne catalogue.
- Motion : quasi 0 utile (vague bas hero seulement).
- Mobile : titre lisible, CTA pouce OK ; bandeau portefeuilles au-dessus vole l’attention dès l’arrivée Meta.

### Corps de page
- Hiérarchie : En bref = 3 cards (légère card soup) ; outil = double section longue ; une job claire par bloc **mais** ordre inversé vs émotion (tableau avant estimateur).
- Confiance : pas de photo conseiller, CSF, Victoriaville, AMF au-dessus du fold — seulement disclaimer iA en bas d’outil + footer site.
- Densité : haut dans l’outil (3 inputs + 2 cards + 5 rangées + 4 inputs + 2 ResultCards) ; bas ailleurs.
- Manque pour rendu **pro / premium** :
  1. Hero full-bleed foyer / clé / maison QC (pas orbs seuls)
  2. Strip process 3 steps : Compare → Chiffre l’écart → 15 min
  3. Bandeau confiance 1 ligne (CSF · Victoriaville · éducatif)
  4. Domination visuelle du gap 350 k$ → 447 k$ (typo + barre)
  5. Soft close mid qui recycle le chiffre

### Soft close / form
- Bloc navy arrondi correct visuellement, microcopy **générique** (« clarifier ta situation ») — pas digne du moment « 97 k$ manquent pour les proches ». Réassurance « sans pression » OK ; zéro ancrage résultat.

**Note visuelle /10 :** 5  
**3 upgrades visuels WOW (Avant → Après) :**
1. Hero orbs génériques → photo foyer/hypothèque full-bleed + overlay navy, H1 gardé, CTA secondaire « Voir mon écart solde → famille » → `#outil`
2. Deux ResultCards `text-2xl` égales → capital famille en héros + barre gap « +97 000 $ au-delà du prêt » (tone warn)
3. Soft close mid navy générique → headline « On regarde ton écart 350 k$ → 447 k$ » (ou montants dynamiques si branchés) + subline éducative

---

## 3. Audit OUTIL interactif (cœur du WOW)

Sources JSX : `AssuranceHypothecaireTool.jsx` (~488 L) ; `HypothequeVieTool.jsx` = re-export déprécié ; slug mappé `hypotheque-assurance-vie` **et** `assurance-hypothecaire`.

Scénario mental defaults : solde 350 000 · 20 ans · prime 45 · dettes 10 000 · revenu 3 000 × 24 mois · coussin 15 000 → **capitalFamille 447 000 · auDelaDuPret 97 000 · ratio ×2,0**.

### Première impression outil
- Titre shell « Banque vs famille : compare, puis chiffre » — clair en <10 s sur l’intention.
- Defaults aident l’aha **coût relatif** immédiatement (×2) ; l’aha **famille** est spoileré en calc mais **caché** derrière le tableau → spoile le scroll, pas le chiffre.

### Moment « wow »
- Vrai climax conversion : **écart solde → capital famille** (pas le ×2 prêteur).
- Aujourd’hui : deux cards côte à côte ; le « Dont 97 000 $ au-delà… » est en `detail` taupe — trop petit, pas assez narré (« Il manque ~X $ pour que les proches tiennent »).
- Manque pour désir de parler à quelqu’un : phrase personnelle + CTA RDV dans les 2 s + « on lit ta police ensemble » (peur d’annuler / de se tromper).

### Friction outil
- Double-outil : tableau 5 critères × Banque/Personnel/Lu **avant** estimateur — scroll fatigue mobile max catalogue.
- Checkboxes « Lu » = engagement cosmétique (footer compte les points lus, pas le gap).
- Ads « renouvellements* » vs copy carte prêteur « prime peut rester semblable » — dissonance.
- PDF sans accents (`hypothecaire`, `Annees`, `Cout`, `imprevus`) — polish bas.
- Amortissement mi-parcours = `balance * 0.5` hardcodé (disclaimer présent, fragile si challenge).
- Footer = PDF only → cannibalise Bookings.

### Après le résultat
- Next step naturel affiché = PDF, **pas** booker. Insight froid → souvenir fichier, pas calendrier.

**Note outil WOW /10 :** 6  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Ordre** — Avant : §1 tableau → §2 estimateur. Après : estimateur + gap first ; tableau en `<details>` « Approfondir banque vs perso ». → `AssuranceHypothecaireTool.jsx` ~L324–477 + titre shell ~L227–228.
2. **Gap dominant** — Avant : 2 ResultCards égales. Après : ligne « Écart illustratif : +{auDelaDuPret} $ au-delà du prêt » + barre visuelle. → post-ResultCards ~L460–476 (`calc.auDelaDuPret` déjà ~L143).
3. **Soft close inline** — Avant : footer PDF. Après : « Ton illustration : {solde} vs {capitalFamille}. On clarifie banque vs perso en 15 min. » + RDV outline + `trackRendezVousClick('campagne_hypotheque-assurance-vie_rdv_outil')` ; PDF ghost. → footer ~L229–237.
4. **Renouvellement** — Avant : « prime peut rester semblable ». Après : « semblable **ou** revue au renouvellement* » + FAQ dédiée landing. → carte prêteur ~L285–286 ; `campagneAdsLandings.js` FAQ.
5. **Mobile critères** — Avant : 5 rangées toujours ouvertes. Après : 1 critère visible + « Voir les 4 autres » **ou** collapsible post-gap. → `COMPARISON_ROWS` rendu ~L338–377.

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « J’ai déjà coché l’assurance du prêteur — c’est réglé. »
2. « Changer / annuler = cher, vide de couverture, complication. » (Ad3 « sans frais* » vs FAQ « pas automatiquement » = confusion)
3. « Ma prime ne bouge pas — pourquoi la pub parle de renouvellement / coût qui monte ? »

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve visuelle de l’écart solde→famille ; clarté « créancier ≠ vie perso » ; urgence douce au renouvellement* ; « on le lit ensemble » ; peur de mal faire seul (annuler trop vite / sous-assurer les proches).
- Phrase soft close idéale : *« T’as ~350 000 $ côté prêt et ~447 000 $ illustrés pour la famille — 97 000 $ d’écart. En 15 min on regarde si ta police banque couvre vraiment ce que tu crois, sans pression. »*

### Ce qui me fait fuir
- CTA RDV avant le chiffre ; mur de tableau « Lu » ; PDF comme seul next step ; soft close clone ; claim ads annulation trop agressif vs prudence page ; hero sans identité maison/famille.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Gap climax solde→famille dominant** · Le « damn » familial devient impossible à manquer → question ouverte = RDV · `AssuranceHypothecaireTool.jsx` post-ResultCards · Cards égales → bandeau « Écart +{auDelaDuPret} $ » + micro « C’est souvent ça qu’on clarifie en 15 min » · **H** · **S**

2. **Estimateur avant tableau 5×** · Ads promettent « chiffre les proches » ; je touche le wow <10 s au lieu d’abandonner au mur éducatif · même fichier, sections §1/§2 + titre shell · Tableau first → estimateur first ; tableau en `<details>` · **H** · **M**

3. **CTA RDV inline post-écart (PDF secondaire)** · Monétise le pic émotionnel avant refroidissement · footer outil + `buildCampagneRdvPath('hypotheque-assurance-vie')` · PDF only → RDV outline citant solde vs capitalFamille + track `…_rdv_outil` · **H** · **S**

4. **Aligner renouvellement ads ↔ outil/FAQ** · Réduit la dissonance post-Meta (« la pub mentait ? ») → confiance → book · carte prêteur + `campagneAdsLandings.js` FAQ · Silence / « prime stable » → mention renouvellement* + FAQ « La prime du prêteur peut-elle monter ? » · **H** · **S**

5. **Mobile : alléger les 5 critères** · Moins de scroll fatigue = plus de gens voient le gap · rendu `COMPARISON_ROWS` · 5× ouverts → accordéon 1 critère / post-gap only · **H** · **M**

6. **Soft close mid spécifique écart** · *(shell-ish mais data #03)* Le mid arrête de ressembler aux 14 autres pages · `CampagneAdsLanding.jsx` mid RDV + data `ctaHeadline`/`ctaSubline` slug hypo · « Prêt à clarifier… » → « On regarde ton écart solde → famille » / « 15 min, éducatif — tu gardes ton PDF » · **M** · **S** *(compte shell #1)*

7. **Adoucir Ad3 annulation + tutoiement** · Moins de méfiance conformité / match FAQ · `emails/campagne-meta-catalog/assurance-hypothecaire.md` Ad3 · « généralement sans frais* » + « Comparez » → « souvent possible de revoir/remplacer — vérifier prêteur* » + « Compare tes protections » · **M** · **S**

8. **Hero atmosphère hypothèque/famille** · *(shell PageHero)* Identité sujet = page mémorable, pas clone catalogue · `PageHero` / assets campagne #03 · Orbs → full-bleed foyer/clé + H1 gardé + dual CTA (outil primaire / RDV secondaire) · **M** · **M** *(compte shell #2)*

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Assurance de la banque ou protection pour la famille ? | *(garder — meilleur hook)* |
| Promesse | Comparer banque vs personnel (coût qui monte, couverture qui baisse), puis chiffrer… | D’abord estimer ce qu’il faudrait aux proches — au-delà du solde. Ensuite comparer banque vs perso. |
| Soft close post-outil | Compare d’abord… + PDF | Ton illustration : {solde} vs {capitalFamille}. On clarifie banque vs perso en 15 min — PDF si tu veux. |
| CTA label | Réserver 15 minutes | Garder en mid ; post-outil : « Clarifier banque vs famille (15 min) » ; hero primaire scroll outil |
| 1 ligne confiance | *(absente fold)* | Conseiller en sécurité financière · Victoriaville · contenu éducatif, sans pression |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer
- [ ] Le CTA RDV/form apparaît **dans les 2 secondes** après le climax
- [ ] La page a une identité visuelle du **sujet** (pas template clone)
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book

*(État 2026-11-04 : aucun des 4 coché — climax présent mais enterré ; CTA post-climax = PDF ; hero clone ; soft close non chiffré.)*

---

## 8. Notes agent

**Sources :**
- Live : https://www.pierreoliviercaouette.ca/campagnes/hypotheque-assurance-vie — hero H1 OK, orbs, En bref 3 cards, outil defaults → ×2,0 puis tableau puis 350 k$ / 447 k$ / +97 k$, footer PDF, mid « Prêt à clarifier… », 4 FAQ (pas de renouvellement).
- `AssuranceHypothecaireTool.jsx` (calc `auDelaDuPret`/`capitalFamille`/`ratio`, COMPARISON_ROWS, ResultCards, PDF, disclaimer) ; `HypothequeVieTool.jsx` (re-export) ; `tools/index.js` (double slug).
- `campagneAdsLandings.js` entrée `hypotheque-assurance-vie` (~L467–513) + aliases.
- `CampagneAdsLanding.jsx` — mid RDV hardcodé (~L181–187).
- Ads : `emails/campagne-meta-catalog/assurance-hypothecaire.md` (Ad1–Ad3) ; pointeur `hypotheque-assurance-vie.md`.

**Conformité :** garder créancier ≠ vie perso ; adoucir « annulation sans frais » ; ne jamais promettre « toujours moins cher que la banque » ; illustration mi-parcours ≠ amortissement exact ; renouvellement toujours avec `*`.

**Unique #03 :** seul funnel **double-job** (comparatif créancier vs perso **+** estimateur capital famille) ; climax = écart solde–famille déjà calculé — la conversion casse à l’ordre (tableau first) et au bridge émotion → calendrier (PDF first).
