# [#06] Maladie grave — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/maladie-grave`  
**Persona :** 30–55 ans, couple ou solo, clique Ad1 (« j’ai déjà l’invalidité ») — confond chèque de paie partiel et capital forfaitaire ; objection #1 = « c’est déjà réglé / c’est la même affaire »  
**CTA :** RDV Bookings  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 6,5  
**Score envie de booker après la page (1–10) :** 4,5

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta avec Ad1 dans la tête : « invalidité ≠ maladie grave ». Le H1 me rassure tout de suite — *ok, ils ont compris mon confusion*. En bref, les 3 blocs sont clairs, mais ça reste du texte en cartes blanches génériques : rien qui *prouve* visuellement la différence invalidité vs capital. L’outil flash ~90 000 $ dès l’ouverture — wow chiffre — puis l’écart amber 90 000 $ me pique vraiment… et le footer me dit « Télécharge le PDF ». Pas « on regarde ça ensemble ». Je suis solo ? Les deux premiers champs me parlent de conjoint comme si c’était obligatoire — je me sens un peu hors cible. Le soft close mid (« Prêt à clarifier ta situation ? ») est interchangeable avec n’importe quelle autre campagne. FAQ #1 confirme mon mythe, mais trop tard et trop texte. Est-ce que je booke ? Pas demain. J’ai mon chiffre, j’ai mon PDF mental, et personne n’a transformé l’écart amber en « 15 min pour lire *ma* brochure ».

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge Maladie grave · H1 « ≠ invalidité » · promesse 3 blocs · CTA blanc « Réserver 15 minutes » sur `PageHero` navy/grid | Accroche mythe = fort ; CTA RDV immédiat = pression trop tôt (Ad3 disait essaie d’abord) | **Opportunité :** dual CTA « Estimer mon capital » primaire + « ou 15 min ». **Fuite :** bounce si j’ai peur du pitch. |
| 3–15 s En bref | 3 cartes numérotées (conjoint / ~33 k$ SCC / QV + déjà couvert) — layout clone shell | Compréhension OK, zéro différenciation visuelle vs #04 | **Opportunité manquée :** module 2 cols Invalidité \| MG ici — ancré Ad1. |
| Première interaction outil | Snapshot déjà à 90 000 $ (3 500×12 + 33 k$ + 15 k$) ; champs sous le résultat | « Damn, c’est gros » — mais abstract ; framing conjoint forcé | Defaults aident l’aha *et* spoilent le solo. Toggle « Pas de conjoint » = WOW d’inclusion. |
| Climax résultat | Capital XXL + breakdown muted + bandeau amber **Écart vs déjà couvert 90 000 $** | Pic émotionnel de la page | **Asset #1.** Doit être monétisé en RDV, pas en PDF. |
| Après le climax (PDF / CTA) | `statusDetail` : « Y’a un écart… Télécharge le PDF » · bouton PDF seul · ligne taupe Invalidité≠MG en bas | Insight dilué → fichier | **Fuite majeure.** Soft CTA sous écart en <2 s. |
| Soft close mid / form | Bloc navy générique « Prêt à clarifier ta situation ? » + RDV + capsule | Rupture narrative vs capital / écart | Mid copy branchée sur écart + collective. |
| FAQ / fin | 3 Q (invalidité, vie, besoin) — pas collective / maladies / délai | Demi-réponse ; peurs contrat non traitées | +2 FAQ → RDV = « on lit le contrat », pas pitch produit. |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évalué live : https://www.pierreoliviercaouette.ca/campagnes/maladie-grave (2026-11-04).

### Hero
- Composition : brand OK en nav ; H1 = meilleur hook catalogue (mythe Ad1). Promesse dense. CTA unique RDV — trop tôt vs Ad3. Sans le nav, le hero pourrait être *n’importe quelle* landing CSF (gradient orbs / grid `PageHero`).
- Atmosphère : navy calme = brief ads « mythe-bancaire » partiellement tenu ; **zéro** signal « capital vs chèque de paie » en image — seulement typo.
- Motion / présence : 0 mouvement utile (pas de reveal chiffre, pas de pulse écart).
- Mobile : H1 fort ; CTA pouce OK ; promesse un peu longue.

### Corps de page
- Hiérarchie : En bref = 3 jobs OK mais card soup shell. Outil = vraie pièce. Mid = clone.
- Confiance : pas de photo conseiller, pas de ligne « CSF · Victoriaville · éducatif » near-CTA ; footer site seulement.
- Densité : correcte desktop ; hint SCC (soins) trop long avant action mobile.
- Ce qui manque pour un rendu **pro / premium** :
  1. Module contraste Invalidité (revenu dans le temps) vs MG (capital forfaitaire) — 2 cols, pas FAQ.
  2. Hero outil-first (scroll anchor `#outil`) vs RDV froid.
  3. Climax écart amber + CTA RDV dans le même viewport.
  4. Atmosphère sujet (navy + symbole ≠ / dual chips) au-delà du badge.
  5. Ligne confiance humaine sous soft close.

### Soft close / form
- Digne d’un RDV payé en attention ? Non — microcopy générique, zéro citation du capital / écart, réassurance « Clarifier ≠ acheter » absente alors qu’elle est dans les ads.

**Note visuelle /10 :** 5,5  
**3 upgrades visuels WOW (Avant → Après) :**
1. **Avant :** H1 texte seul + CTA RDV. **Après :** chips dual « Invalidité = revenu » / « MG = capital » sous le H1 + CTA primaire « Estimer mon capital » (anchor outil).
2. **Avant :** écart amber sans next step. **Après :** même bandeau + bouton plein « Clarifier cet écart (~X $) en 15 min » ; PDF ghost.
3. **Avant :** mid navy « Prêt à clarifier… ». **Après :** « Ton écart illustratif, on le lit avec ta brochure » + ligne CSF · Victoriaville.

---

## 3. Audit OUTIL interactif (cœur du WOW)

Sources : `MaladieGraveTool.jsx` (L80–317), defaults L81–85, capital/écart L94–98, bandeau L197–229, footer PDF L106–172.

### Première impression outil
- En <10 s : oui — « Combien viser » + total live. Intro rappelle « complète l’invalidité ».
- Defaults : 3 500 × 12 + 33 000 + 15 000 = **90 000 $** ; `dejaCouvert = 0` → **écart = 90 000 $** amber au mount. Fort aha *et* dramatize (perçu pitch si disclaimer scrollé).

### Moment « wow »
- Chiffre : **`formatCad(ecart)`** amber (pas seulement le capital) — « ce qu’il manquerait encore ».
- Assez grand : oui. Assez narré : non — sous-titre capital = « Conjoint + soins + qualité de vie » (vague). Assez personnel : partiellement (conjoint forcé ; collective = champ passif).
- Manque pour désir de parler : pont RDV collé à l’écart + « on ouvre ta brochure collective » + traduction des 3 blocs en langage vécu.

### Friction outil
- Framing conjoint obligatoire (célibataires exclus émotionnellement).
- Hint SCC trop long ; PDF accents cassés (`Resume`, `estime`, `qualite`, `Ecart` L114–147).
- Ligne Invalidité≠MG = taupe 12px en bas (L310–313) — mythe Ad1 sous-prouvé dans l’UI.
- Ads promettent « essaie → 15 min si chicotte » ; outil livre PDF-only.

### Après le résultat
- Next step naturel aujourd’hui = PDF. Devrait = booker pour lire collective / exclusions / si un capital a du sens.

**Note outil WOW /10 :** 6,5  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **CTA sous écart** — Avant : PDF footer. Après : RDV primaire branché `formatCad(ecart)` + `trackRendezVousClick('campagne_maladie-grave_rdv_tool')`. → `MaladieGraveTool.jsx` L197–229 + footer L164–172.
2. **Phrase « ce que ça paie »** — Avant : sous-titre vague L182–184. Après : « Ex. : ~{remplacement} pour {mois} mois côté conjoint, ~{soins} soins hors couverture, ~{surplus} pour respirer. »
3. **Toggle « Pas de conjoint »** — Avant : 2 champs forcés. Après : chip → capital = soins + QV ; breakdown conjoint masqué. L241–271.
4. **Chip « Je ne sais pas → 0 $ »** sur `mg-couvert` + pont brochure RDV. L294–307.
5. **Mini contraste 2 cols** au-dessus des champs (ou sous intro) — Invalidité vs MG, ancré Ad1. Remplace/complète L310–313.

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « J’ai déjà l’invalidité — c’est la même affaire. » (Ad1 ; H1 dit non, UI ne le *montre* pas.)
2. « Ma collective a déjà un capital maladie grave — c’est réglé. » (Ad2/Ad3 ; champ 0 $ passif, pas de FAQ dédiée.)
3. « Je suis seul(e) / pas de conjoint à remplacer — votre outil n’est pas pour moi. »
4. (Latente) « Si je booke, on me vend un produit / on me promet 90 k$. »

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve visuelle deux jobs · clarté de *mon* écart · urgence douce (« brochure souvent petite / conditionnelle ») · « on le lit ensemble » · peur de mal faire seul face au contrat (maladies, délai de survie).
- Phrase soft close idéale (québécois) qui cite **mon** résultat :  
  « T’as ~90 000 $ d’écart illustratif vs ce que t’as déjà. En 15 min on ouvre ta brochure — ce que la collective couvre vraiment, les exclusions, si un capital a du sens chez toi. Clarifier ≠ acheter. »

### Ce qui me fait fuir
- RDV avant d’avoir joué · PDF qui vole le climax · framing couple exclusif · mid générique · claim implicite que « tu recevras 90 k$ » sans disclaimer visible.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact** · **Effort**

1. **Monétiser le bandeau écart (CTA RDV in-tool)**  
   - **Quoi :** Sous le bandeau amber (`gapWarn`), bouton RDV branché sur `formatCad(ecart)` ; PDF secondaire ; `statusDetail` dual.  
   - **Pourquoi je booke plus :** Le climax émotionnel existe déjà — aujourd’hui il pousse un fichier. Coller le calendrier dans les 2 s = insight → intention.  
   - **Où :** `MaladieGraveTool.jsx` L197–229, L106–110, footer L164–172 ; `buildCampagneRdvPath('maladie-grave')` + `trackRendezVousClick('campagne_maladie-grave_rdv_tool')`.  
   - **Avant → Après :** « Télécharge le PDF… » → « Écart illustratif ~90 000 $. Clarifier cet écart en 15 min — collective, exclusions, si un capital a du sens. »  
   - **Impact :** H · **Effort :** S

2. **Module visuel Invalidité ≠ MG (pas seulement FAQ)**  
   - **Quoi :** Contraste 2 colonnes : invalidité = revenu dans le temps / MG = capital forfaitaire une fois — ancré Ad1.  
   - **Pourquoi je booke plus :** Persona confond les deux ; sans preuve visuelle je repars convaincu que #04 suffit → pas de 2ᵉ outil, pas de RDV MG.  
   - **Où :** `campagneAdsLandings.js` section post–En bref **ou** bandeau haut `MaladieGraveTool.jsx` ; garder FAQ Q1.  
   - **Avant → Après :** Phrase taupe L310–313 → tableau 2 cols « Chèque de paie partiel » vs « Capital forfaitaire — 3 blocs ».  
   - **Impact :** H · **Effort :** S

3. **Toggle « Pas de conjoint à remplacer »**  
   - **Quoi :** Chip qui met revenu/mois à 0 (ou masque) ; capital = soins + QV ; microcopy adaptée.  
   - **Pourquoi je booke plus :** Audience CBO 30–55 inclut solos/séparés ; framing couple = abandon avant *leur* écart.  
   - **Où :** `MaladieGraveTool.jsx` state + Field `mg-revenu-conjoint` / `mg-mois` L241–271.  
   - **Avant → Après :** Champs forcés → chip « Pas de conjoint » → capital live ~48 k$ ; label « Soins + qualité de vie ».  
   - **Impact :** H · **Effort :** M

4. **Soft close mid spécifique capital / écart / brochure** *(shell data — #1/2 shell)*  
   - **Quoi :** Brancher `ctaHeadline` / `ctaSubline` sur le bloc RDV mid (aujourd’hui hardcodé).  
   - **Pourquoi je booke plus :** Après l’outil j’ai un écart amber en tête ; « Prêt à clarifier… » casse le fil Ad2.  
   - **Où :** `campagneAdsLandings.js` entrée `maladie-grave` ; `CampagneAdsLanding.jsx` L181–187 (lire headline aussi si `!isFormCta`).  
   - **Avant → Après :** « Prêt à clarifier ta situation ? » → « Ton capital illustratif, on le lit ensemble » / « 15 min — brochure, exclusions, Clarifier ≠ acheter. »  
   - **Impact :** H · **Effort :** S–M

5. **Lecture actionnable du capital (3 blocs narrés)**  
   - **Quoi :** Sous `formatCad(capital)`, phrase qui déplie conjoint / soins / QV en $.  
   - **Pourquoi je booke plus :** 90 k$ abstrait → scénario vécu ; objection « c’est trop » devient « je vois à quoi ça sert → je veux valider ».  
   - **Où :** `MaladieGraveTool.jsx` L182–184.  
   - **Avant → Après :** « Conjoint + soins + qualité de vie… » → « Ex. : ~42 k$ pour 12 mois côté conjoint, ~33 k$ soins, ~15 k$ pour respirer. »  
   - **Impact :** M · **Effort :** S

6. **Chip « Je ne sais pas (0 $) » + pont brochure**  
   - **Quoi :** Preset explicite `dejaCouvert = 0` + hint RDV brochure (au-delà du hint L298).  
   - **Pourquoi je booke plus :** Ad2/Ad3 attaquent « j’ai déjà quelque chose en collective » ; assumer l’inconnu crée l’intention de *vérifier*.  
   - **Où :** `MaladieGraveTool.jsx` Field `mg-couvert` L294–307.  
   - **Avant → Après :** Hint passif → chip active + « En RDV on ouvre ta brochure : capital MG collectif souvent petit / conditionnel. »  
   - **Impact :** M · **Effort :** S

7. **FAQ +2 : collective MG + maladies / délai de survie**  
   - **Quoi :** Deux objections absentes que ads/disclaimer promettent.  
   - **Pourquoi je booke plus :** Post-chiffre, peur #1 collective / #2 « quelles maladies ? » — sans réponse le RDV = pitch ; avec = lecture contrat.  
   - **Où :** `campagneAdsLandings.js` → `faq[]` slug `maladie-grave` (L120–136).  
   - **Avant → Après :** 3 Q → + « Ma collective couvre déjà la MG ? » / « Quelles maladies / délai de survie ? » → dépend du contrat, on lit ensemble.  
   - **Impact :** M · **Effort :** S

8. **Hero outil-first (dual CTA)** *(shell — #2/2 shell)*  
   - **Quoi :** CTA primaire scroll `#outil` « Estimer mon capital » ; secondaire texte « ou réserver 15 min ».  
   - **Pourquoi je booke plus :** Ad3 vend essaie d’abord ; RDV froid above-the-fold tue les leads chauds outil. Plus de climax vécu → plus de `…_rdv_tool`.  
   - **Où :** `CampagneAdsLanding.jsx` / `PageHero` enfants (pattern shell toutes campagnes RDV).  
   - **Avant → Après :** Un bouton RDV → dual (outil primary / RDV ghost).  
   - **Impact :** H · **Effort :** M

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Maladie grave ≠ invalidité — un capital à part | **Garder** (meilleur hook ; Ad1 match parfait) |
| Promesse | Estimer un capital : remplacer le revenu du conjoint… | Trois blocs concrets pour un ordre de grandeur — sans compte. L’invalidité paie un revenu ; la MG, un capital. |
| Soft close post-outil | Y’a un écart… Télécharge le PDF | Écart illustratif ~{ecart}. 15 min pour lire ta brochure — Clarifier ≠ acheter. |
| CTA label | Réserver 15 minutes | Hero : « Estimer mon capital » ; outil : « Clarifier cet écart en 15 min » |
| 1 ligne confiance | (absente near-CTA) | Conseiller en sécurité financière · Victoriaville · éducatif, pas un pitch |

Conformité : SCC 2024 = ordre de grandeur Canada, ajustable ; jamais « tu recevras 90 k$ » ; maladies / délais / exclusions = contrat ; MG complète l’invalidité, ne la remplace pas.

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil (écart amber) est impossible à manquer
- [ ] Le CTA RDV apparaît **dans les 2 secondes** après le climax (in-tool, pas seulement mid)
- [ ] La page a une identité visuelle **Invalidité ≠ capital** (pas template clone)
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué Book (« son écart vs collective »)

Mesures proxy : ratio `campagne_maladie-grave_rdv_tool` ≥ hero `…_rdv` ; ↓ sessions PDF-only sans RDV ; prospects qui mentionnent écart ou brochure en RDV.

---

## 8. Notes agent

**Sources :** `MaladieGraveTool.jsx` (entier) ; `campagneAdsLandings.js` (`maladie-grave` L107–140) ; `CampagneAdsLanding.jsx` (hero RDV L62–88, mid hardcodé L181–210) ; `emails/campagne-meta-catalog/maladie-grave.md` (Ad1 mythe / Ad2 3 blocs / Ad3 outil-first) ; WebFetch + browse live https://www.pierreoliviercaouette.ca/campagnes/maladie-grave (2026-11-04).

**Observations live :** H1 fort ; outil charge à 90 000 $ / écart 90 000 $ immédiatement ; footer PDF dominant ; mid générique ; FAQ invalidité OK mais visuelle absente ; pas de soft close « Clarifier ≠ acheter » malgré ads.

**Unique vs #04 Invalidité :** climax = **capital forfaitaire + écart** (pas trou mensuel / coussin). Persona arrive en *confusion* avec #04 — le différenciateur doit être UI, pas seulement H1/FAQ.

**Risques conformité :** defaults ~90 k$ perçus comme promesse ; chevauchement créa #04 (garder vocabulaire « capital » vs « chèque de paie ») ; SCC illustrative Canada ≠ QC personnalisé.

**Shell count TOP 8 :** items 4 et 8 = dettes shell (max 2) ; 1–3, 5–7 = uniques MG.
