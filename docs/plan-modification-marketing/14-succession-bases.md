# [#14] Succession — bases — Rapport expérience client (WOW → RDV)

**Slug :** `/campagnes/succession-bases` (alias `/campagnes/succession`)  
**Persona :** 40–60 ans, maison + placements, objection #1 « on verra plus tard » (mythe Ad1)  
**CTA :** RDV Bookings (`buildCampagneRdvPath` → `/rendez-vous/campagne`)  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 6  
**Score envie de booker après la page (1–10) :** 4,5  

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta avec Ad1 « Plus tard, c’est souvent trop tard » dans la tête. Le hero me dit autre chose — un titre produit « liquidité et clarté » — et le gros bouton blanc me pousse déjà à « Réserver 15 minutes » alors que l’ad m’avait promis une checklist sans compte. Je scroll : En bref est clair (liquidité ≠ actifs, ça me parle), l’outil « Si tu manques » est honnête… mais avant même d’avoir coché, « Trous prioritaires » m’affiche déjà Liquidité · Revenu · Bénéficiaires en ambre — ça me flatte pas, ça me juge. Je coche liquidité : le portrait bouge, ok, y’a un vrai aha. Puis le next step me dit PDF + rappel notaire. Personne ne me propose les 15 minutes promises pour démêler *mes* trous CSF. Mid CTA « Prêt à clarifier ta situation ? » — générique, zéro lien avec mes cases vides. Je bookerais pas demain : j’ai mon PDF mental, mon « plus tard » est intact, et j’ai encore peur qu’on veuille remplacer mon notaire ou me pitch.

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge Succession · H1 « Succession : liquidité et clarté… » · CTA blanc RDV · fond navy/orbes PageHero | Curieux → léger frottement (≠ titre Ad1) | **Fuite :** message match Ad1 cassé ; CTA RDV-first vs promesse outil. **WOW manqué :** H1 = « Plus tard, c’est souvent trop tard » |
| 3–15 s En bref | 3 cartes numérotées : argent vite / bénéficiaires / testament↔contrats | « Ok, c’est mon sujet » | Opportunité tenue — Ad2 déjà en bullet 1. Renforcer outcomes (premiers mois / collective) |
| Première interaction outil | Progression 0/6 · portrait déjà rempli de trous warn · cases sous le portrait · double PDF | Surpris / un peu accusé | **Fuite :** warn à froid spoil le « se remplit en direct ». **WOW :** invite vide + cases d’abord (ou sticky portrait après 1ʳᵉ coche) |
| Climax résultat | Après 1–3 coches : `missingCount`, carte Trous, piliers 1·Argent / 2·Qui reçoit / 3·Qui sait | « Damn, j’ai des trous » | **WOW réel** — mais aucun CTA RDV collé. Sortie = status + PDF |
| Après le climax (PDF / CTA) | Footer `statusDetail` + « Télécharger mon résumé PDF » · 2ᵉ PDF à côté du portrait | Soulagé d’avoir un trophy PDF, pas un humain | **Fuite PDF dominante.** Pont naturel = « {N} trous · 15 min liquidité/bénéficiaires » |
| Soft close mid / form | « Prêt à clarifier ta situation ? » + « Lire la capsule succession » | Neutre / fatigué | Mid shell générique — **opportunité :** « Des cases vides te chicottent ? » (Ad3) |
| FAQ / fin | Notaire ? Maison+placements ? Grandes fortunes ? | Rassuré sur notaire ; 15 min pas expliquées | Manque FAQ « En 15 min on fait quoi ? » + « C’est payant ? » → booker |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évalué live : https://www.pierreoliviercaouette.ca/campagnes/succession-bases (2026-11-04).

### Hero
- **Composition :** Badge + H1 long + promise + un seul CTA RDV. Brand iA/PO dans la nav — le hero pourrait appartenir à n’importe quelle campagne catalogue (même navy, même vague, mêmes orbes). Pas de signal « dossier / famille / liquidité ».
- **Atmosphère :** Sujet succession = documents, clarté familiale, mythe « plus tard » — **pas** rendu. Brief ads = navy mythe-bancaire « Succession / Checklist » ; page = clone `PageHero`.
- **Motion / présence :** Vague hero + fill progress outil (`duration-500`) = ~1–2 mouvements utiles. Pas de révélation des cartes Trous après 1ʳᵉ coche (elles sont déjà là).
- **Mobile :** CTA hero OK au pouce ; ensuite portrait 3 cartes + 6 cases + Scale notaire + notes = scroll long avant mid.

### Corps de page
- **Hiérarchie :** Une job / section globalement OK (En bref → outil → mid → FAQ). Soup de cards dans l’outil (3 ResultCard + 3 piliers + 6 labels) — dense mais lisible.
- **Confiance :** Disclaimer notaire fort (outil + Scale + FAQ #1). Photo conseiller / titre CSF / Victoriaville **absents** au-dessus du fold (Victoriaville seulement SEO + footer).
- **Densité :** Outil un peu chargé en haut (portrait avant cases) ; bas de page correct.
- **Manque pour un rendu pro / premium :**
  1. Identité visuelle « succession / liquidité » (pas funéraire) — texture dossier / contraste patrimoine vs cash.
  2. Split visuel **Moi 15 min (liquidité & bénéficiaires)** | **Notaire (testament)**.
  3. Process 3 steps : coche → portrait → 15 min ou notaire.
  4. Soft close mid succession-spécifique (pas bandeau générique navy).

### Soft close / form
- Mid : « Prêt à clarifier… » / « On regarde ton résumé ensemble » — digne d’un catalogue, **pas** digne du climax « trous ». Pas de microcopy qui cite *mes* cases. Capsule Apprendre dilue le booker.

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. **Hero message + CTA** — Avant : H1 produit + CTA RDV seul. Après : H1 Ad1 « Plus tard… » + primaire « Remplir la checklist » (`#outil`) + secondaire texte RDV.
2. **Portrait froid** — Avant : 3 cartes warn dès 0/6. Après : une invite (« Commence par la liquidité ») ; grille Trous seulement si `count ≥ 1`, avec reveal.
3. **Bandeau CSF vs notaire** — Avant : rappel Scale en fin de liste. Après : 2 colonnes sous l’outil (ou FAQ visuelle) avant le mid CTA.

---

## 3. Audit OUTIL interactif (cœur du WOW)

Fichier : `frontend/src/components/campagne/tools/SuccessionChecklistTool.jsx` (ITEMS/GROUPS ~L10–72 ; status/portrait ~L80–182 ; PDF ~L188–235 ; UI ~L237–451).

### Première impression outil
- **En <10 s :** Oui — « coche ce qui est en place, portrait des trous ». Alignement ads 6 points 1:1 = excellent.
- **Defaults :** Tout décoché = bon (honnêteté). Mais `trousValue` liste déjà 3 shorts + warn (`missingCount === 6`) → spoil / dramatize **avant** l’aha.

### Moment « wow »
- **Devrait être :** voir *mes* trous (surtout Liquidité) après avoir coché ce qui est vrai — Ad2 « liquidité ≠ actifs » en direct.
- **Aujourd’hui :** le wow arrive, mais (1) spoilé à froid, (2) pas assez narré (« Ad2 live »), (3) pas assez personnel (pas de mois de liquidité, pas de « qui paie quoi » nominal).
- **Manque pour désir de parler à quelqu’un :** pont explicite CSF vs notaire + CTA 15 min au climax trous — pas « PDF + notaire » comme seule sortie (`nextValue` complet ~L179).

### Friction outil
- Portrait **au-dessus** des cases → scroll fatigue mobile avant liquidité.
- Double `ToolDownloadPdf` (portrait ~L290–296 + footer ~L246–250).
- PDF ASCII (`Resume`, `A faire`, `liquidite`, `Prochaine etape`) — polish pro ↓.
- `statusDetail` ≥5 pousse encore « télécharge ton résumé » ; complet = `PDF + notaire` (pas RDV prep).
- Pas d’event trous / `…_rdv_tool`.

### Après le résultat
- Next step naturel ≠ booker. C’est **télécharger**. Les ads vendent « si ça te chicotte, 15 min » — le code ne le fait jamais.

**Note outil WOW /10 :** 6  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **Soft-close RDV si `missingCount ≥ 1`** — Avant : PDF seul. Après : « On regarde tes {N} trous en 15 min — liquidité / bénéficiaires avec moi ; testament = notaire. » + CTA primaire + `trackRendezVousClick('campagne_succession-bases_rdv_tool')` · `SuccessionChecklistTool.jsx` footer / sous portrait.
2. **Portrait post-1ʳᵉ coche** — Avant : grille warn à `count === 0`. Après : invite 1 ligne ; cartes si `count ≥ 1` · ~L155–177, ~L280–337.
3. **Next-step branché** — Avant : `PDF + notaire`. Après : si next = `liquidites`|`dettes-hypotheque`|`beneficiaires` → 15 min CSF ; si `testament` → notaire + 15 min prep · `statusDetail` / `nextValue` ~L80–95, ~L179–182.
4. **Un PDF footer + accents FR** — Avant : 2 boutons + ASCII. Après : 1 PDF ; `Résumé` / `À faire` / `liquidité` · retirer ~L290–296 ; `handleDownload` ~L188–235.
5. **Microcopy Ad2 si trou #1 = liquidité** — Avant : détail générique. Après : « Argent accessible ≠ maison sur papier — souvent le 1er vrai trou. » sous progress / Trous.

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect 40–60)
1. « C’est pour plus tard / je suis trop jeune pour ça » (cœur Ad1 — H1 landing ne le rejoue pas).
2. « Maison + REER = je suis en ordre » (Ad2 — FAQ #2 touche, soft close ne monétise pas).
3. « Tu vas remplacer mon notaire / me vendre de l’assurance » (disclaimer OK ; 15 min jamais décrites).

### Ce qui me ferait booker demain (leviers émotionnels)
- **Preuve / clarté :** voir 2–3 trous *après* mes coches, pas avant.
- **Urgence douce :** « plus tard » = liquidité des *premiers mois* pour ma famille — pas dramatisation funéraire.
- **On le fait ensemble :** CSF = liquidité & bénéficiaires ; notaire garde le juridique.
- **Phrase soft close idéale (québécois) :**  
  « T’as {N} cases vides — dont la liquidité. En 15 minutes on relie ça à ta vie ; le notaire reste pour le testament. Clarifier, c’est pas acheter. »

### Ce qui me fait fuir
- RDV froids au hero alors que l’ad disait « sans formulaire ».
- Portrait « tout est cassé » avant d’avoir joué.
- PDF / notaire comme seule sortie → je me dis que le job c’est juridique, pas toi.
- Mid générique + capsule Apprendre qui concurrence le booker.

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**

1. **Soft-close RDV au climax trous (`missingCount ≥ 1`)** · Je booke au pic émotionnel, pas après un PDF · `SuccessionChecklistTool.jsx` (footer ~L243–251 ou sous grille ~L298–337) + `buildCampagneRdvPath` + `…_rdv_tool` · Avant : PDF seul / next complet `PDF + notaire` · Après : CTA primaire « {N} trous · 15 min » + PDF outline ; si complet → « Valider ta base en 15 min (CSF) · notaire pour le légal » · **H** · **S–M**

2. **H1 = titre Ad1 « Plus tard, c’est souvent trop tard »** · Continuité émotionnelle Meta → page ; mon mythe est nommé · `campagneAdsLandings.js` `slug: 'succession-bases'` (`title`, `promise`) · Avant : `Succession : liquidité et clarté avant le « plus tard »` · Après : H1 Ad1 + promise checklist/notaire · **H** · **S**

3. **Portrait vide jusqu’à la 1ʳᵉ coche** · L’aha « se remplit en direct » devient vrai ; je ne me sens plus jugé à froid · `SuccessionChecklistTool.jsx` `etat*` / `trous*` / `ResultCard` · Avant : Trous warn dès 0/6 · Après : invite liquidité ; grille après `count ≥ 1` · **H** · **M**

4. **Next-step CSF vs notaire (pas PDF+notaire)** · Je comprends *pourquoi toi* (liquidité) vs notaire (testament) → RDV utile · `statusDetail` ~L80–95, `nextValue`/`nextDetail` ~L179–182, PDF row ~L216–218 · Avant : sortie PDF/notaire même si trou #1 = liquidités · Après : branche selon `nextItem.id` · **H** · **S**

5. **Mid-CTA succession (Ad3 cases vides)** · Soft close ads rejoué après l’outil · data `ctaHeadline`/`ctaSubline` **ou** branche slug dans `CampagneAdsLanding.jsx` (~L182–187 aujourd’hui hardcodé) · Avant : « Prêt à clarifier ta situation ? » · Après : « Des cases vides te chicottent ? » / « 15 min liquidité & bénéficiaires — notaire pour le testament. Zéro pression. » · **M–H** · **S** *(dette shell légère — copy unique campagne)*

6. **FAQ « En 15 minutes ? » + « C’est payant ? »** · Tue peur pitch / remplace-notaire ; donne permission de booker · `campagneAdsLandings.js` `faq[]` ~L445–460 · Avant : 3 FAQ (notaire / maison / fortunes) · Après : garder notaire #1 ; + 15 min = liquidité/bénéficiaires pas testament ; + appel découverte sans pression · **M** · **S**

7. **Un PDF + accents FR + punch liquidité** · Attention mobile sur le booker ; polish pro au trophy · retirer PDF portrait ; `handleDownload` FR ; microcopy si `nextItem?.id === 'liquidites'` · Avant : double PDF ASCII · Après : 1 PDF footer + ligne Ad2 live · **M** · **S**

8. **Hero outil-first (shell)** · Alignement Ad3 « pas besoin de RDV pour commencer » · `CampagneAdsLanding.jsx` / pattern dual CTA · Avant : seul CTA « Réserver 15 minutes » · Après : primaire `#outil` « Remplir la checklist » + secondaire RDV texte · **M–H** · **S–M** *(1 des max 2 shell)*

*(Shell #2 implicite dans #5 si props mid non branchées RDV — rester ≤2 items shell génériques.)*

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker) |
|---------|-------|----------------------|
| Titre hero | Succession : liquidité et clarté avant le « plus tard » | Plus tard, c’est souvent trop tard |
| Promesse | Repérer les trous de liquidité et de transmission — sans improviser le jour J, et sans remplacer le notaire. | Checklist liquidité / succession : tu coches ce qui est vrai aujourd’hui. Sans compte. Le notaire reste essentiel pour le juridique. |
| Soft close post-outil | *(absent — PDF + statusDetail)* / mid « Prêt à clarifier ta situation ? » | Des cases vides te chicottent ? On regarde tes {N} trous en 15 min — liquidité & bénéficiaires avec moi ; testament = notaire. Clarifier ≠ acheter. |
| CTA label | Réserver 15 minutes *(hero primaire)* | Hero : Remplir la checklist → `#outil` ; outil/mid : Réserver 15 minutes |
| 1 ligne confiance | *(footer seulement)* | Conseiller en sécurité financière · Victoriaville — 15 min pour la liquidité ; le notaire pour le cadre légal. |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil (Trous prioritaires après interaction) est impossible à manquer — et n’apparaît pas en warn à froid
- [ ] Le CTA RDV apparaît **dans les 2 secondes** après le climax trous (`…_rdv_tool`)
- [ ] La page a une identité visuelle **succession / liquidité** (pas template clone) + H1 message-match Ad1
- [ ] Un ami à qui je montre mon écran comprend en 5 s : « il a des trous de liquidité / bénéficiaires — il booke 15 min, pas un notaire de remplacement »

---

## 8. Notes agent

**Sources :** `SuccessionChecklistTool.jsx` (intégral) ; `campagneAdsLandings.js` `succession-bases` (~L430–465) ; `CampagneAdsLanding.jsx` (hero RDV L79–88, mid hardcodé L181–210) ; `emails/campagne-meta-catalog/succession-bases.md` (Ad1–Ad3 + brief visuel) ; live https://www.pierreoliviercaouette.ca/campagnes/succession-bases (snapshot + screenshot hero 2026-11-04).

**Observations live :** H1 produit confirmé ; progression 0/6 + Trous déjà listés ; double bouton PDF ; mid « Prêt à clarifier… » ; FAQ ×3 sans « 15 minutes ».

**Unique vs autres campagnes :** Seule checklist qui doit **séparer deux métiers** (CSF liquidité/bénéficiaires vs notaire testament) — sinon cannibalisation RDV ou risque conformité. Alignement ads↔6 items déjà fort ; gap = **sortie émotionnelle** (trous → PDF) + **message match Ad1**.

**Conformité :** Ne jamais suggérer que checklist / RDV CSF remplace le notaire. Éviter imagerie funéraire. Pas de claim « succession réglée ». Disclaimers actuels (outil, Scale, pied) à conserver.

**Hors scope :** commit / implémentation (rapport expérience seul).
