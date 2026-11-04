# [#15] Programme MRa PME — Rapport expérience client (WOW → LEAD)

**Slug :** `/campagnes/programme-mra`  
**Persona :** Propriétaire / décideur PME (~8–20 employés, Centre-du-Québec). Clique Ad1 parce qu’il « pensait qu’il fallait une grosse collective ». Objection #1 : *ça va me transformer en gestionnaire d’assurances / me coller des dossiers médicaux*.  
**CTA :** formulaire Lead (`CampagneLeadForm` → rappel → présentation) — **pas** Bookings  
**Date :** 2026-11-04  
**Score expérience globale (1–10) :** 5,5  
**Score « effet WOW » outil (1–10) :** 4,5  
**Score envie de booker après la page (1–10) :** 5  

> **Booker = soumettre le formulaire** (Lead Meta → rappel humain → présentation).  
> **≠ #11** : employé + livret + `CollectiveChecklistTool` + RDV 15 min Bookings.

---

## 0. Verdict client (obligatoire — 1 paragraphe)

J’arrive de Meta en boss PME : le hero me parle (« sans la complexité d’une collective ») — ça match Ad1. Les 3 cartes Flex / Simple / Rapide confirment que c’est *pour moi employeur*, pas pour un gars qui lit son livret RH. Je joue l’outil : 8 employés, « pas encore décidé » sur la cotisation, « pas de collective ». La « Lecture rapide » me dit que ça *peut coller*… en une phrase molle, sans badge, sans chiffre qui me tape dans l’œil, et sans jamais utiliser le choix de contribution que je viens de faire. Les 3 piliers sont déjà cochés — zéro discovery. Mon prochain geste évident = **PDF**, pas « Demander une présentation ». Plus bas, le form me demande un Message * obligatoire sur 4 lignes alors que l’outil sait déjà ma taille / situation — et Entreprise est optionnelle. Juste sous le form : « Lire la capsule assurance collective » → je sens le contenu *employé* (#11). Verdict : je pourrais laisser mon courriel si j’étais vraiment chaud, mais rien ne me pousse — je part avec le PDF et je « rappellerai plus tard ». **Je ne booke pas (submit) aujourd’hui.**

---

## 1. Parcours seconde par seconde (obligatoire)

| Moment | Ce que je vois / fais | Émotion | Fuite ou opportunité WOW |
|--------|----------------------|---------|--------------------------|
| 0–3 s hero | Badge « Programme MRa », H1 « Assurance pour ta PME — sans la complexité d’une collective », promesse « Tu offres l’accès… », CTA blanc « Demander une présentation » → `#demande`. Fond navy orbs générique. | Curieux, un peu soulagé (Ad1 match). | Opportunité : atmosphère « petite équipe / usine vs simple » absente → clone catalogue. Nav « Prendre rendez-vous » Bookings = bruit vs CTA Lead. |
| 3–15 s En bref | 3 cartes Flex / Simple / Rapide (cotise ou non, pas de régime complexe, ~2 rencontres + 30–45 min). | « OK, c’est pour le boss. » | Opportunité : pas de strip « collective vs MRa » — objection #1 non tuée. |
| Première interaction outil | Input ~8 employés ; chips contrib (défaut « Pas encore décidé ») ; chips situation (défaut « Pas de collective ») ; Lecture rapide apparaît tout de suite. | Engagement léger — defaults utiles. | Fuite douce : `contrib` saisi mais **ignoré** dans `fitBlurb` ; piliers tous `pressed` dès l’arrivée. |
| Climax résultat | Bloc « Lecture rapide » : *« Avec ~8 personnes et pas de collective… MRa peut offrir… »* + footer « 3/3 piliers cochés · [même blurb] ». | « Mouais… » — insight mou, pas de « damn ». | **Fuite majeure :** climax = paragraphe gris, pas score / badge / contraste. Rien qui crée l’urgence de parler à quelqu’un. |
| Après le climax (PDF / CTA) | Seul bouton outil = « Télécharger mon résumé PDF ». Note bas : « Prochaine étape : formulaire ci-dessous » — texte passif, pas de bouton. | Soulagement faux : j’ai mon PDF. | Fuite : PDF cannibalise le Lead. Soft close Ad3 mort ici. |
| Soft close mid / form | Titre section « Demande une présentation MRa » ; form « Laisse tes coordonnées » : Nom*, Courriel*, Tel, Entreprise (optionnel), Message* 4 rows ; submit « Demander une présentation ». | Friction mobile : textarea * + entreprise floue. | Opportunité ratée : pas de préremplissage outil → CRM ; Message * vs Ad3 « formulaire court ». |
| FAQ / fin | 4 FAQ (≠ collective, cotiser, délais, sélection médicale). Lien Apprendre → capsule collective. | Clarifie un peu, trop tard. | Fuite #11 : Apprendre = contenu employé / livret. Pas de FAQ confidentialité médicale employeur ni « pour quelle taille ». |

---

## 2. Audit VISUEL de la page (comme un client exigeant)

Évaluer **cette** landing, pas un conseil générique. Jugé live : `https://www.pierreoliviercaouette.ca/campagnes/programme-mra` (2026-11-04).

### Hero
- Composition (brand, titre, promesse, CTA) : Brand + badge OK ; H1 correct pour Ad1 ; CTA hero = scroll form (**bon** pour funnel Lead, ≠ Bookings des autres campagnes). Trop générique : même `PageHero` navy/orbs/grille que le reste du catalogue — après retrait du badge, ça pourrait être n’importe quelle campagne assurance.
- Atmosphère : ça ne « sent » **pas** la PME (atelier, équipe 8–12, contraste lourd vs simple). Sens = template financier bleu.
- Motion / présence : quasi 0 utile (fade shell au mieux) — pas de présence « décideur ».
- Mobile : CTA hero lisible ; promesse un peu longue ; le vrai problème mobile arrive plus bas (mur piliers + form Message *).

### Corps de page
- Hiérarchie : En bref = 1 job OK ; outil = job OK mais climax sous-dimensionné ; form = 1 job OK. Card soup légère sur En bref (3 cartes) — acceptable.
- Confiance : titre CSF / disclaimer éducatif présents ; **pas** de photo conseiller, Victoriaville visible hors footer, ni process « présentation → 2 rencontres → 30–45 min » en un bloc avant le form.
- Densité : milieu d’outil chargé (3 grosses cartes Toi/Eux déjà cochées) ; climax trop vide visuellement.
- Ce qui manque pour un rendu **pro / premium** (liste concrète) :
  1. Ancre visuelle PME (équipe / contraste collective lourde vs formule simple)
  2. Badge score fit dominant + n employés
  3. Strip comparatif 5 critères MRa vs collective
  4. Process 3 étapes B2B avant `#demande`
  5. Photo / ligne confiance CSF Victoriaville près du form

### Soft close / form
- Pas encore digne d’un RDV payé en attention : titre form générique « Laisse tes coordonnées » ; Entreprise optionnelle (je peux submit sans boîte) ; Message * 4 rows = friction ; microcopy « Sans engagement » OK mais ne cite pas *mon* fit (~8, pas de collective). Pas de « je te rappelle pour une présentation » ancré sur le résultat outil.

**Note visuelle /10 :** 6  
**3 upgrades visuels WOW (Avant → Après) :**
1. Hero orbs génériques → full-bleed « décideur petite équipe / usine vs simple » + eyebrow « Pour propriétaires & décideurs PME »
2. Lecture rapide paragraphe → hero-number dans l’outil : **~8** + badge **Bon fit** (contrib inclus)
3. Avant `#demande` : process 3 pastilles (Présentation rappel → ~2 rencontres → 30–45 min / personne) + 1 ligne « Infos médicales ≠ côté employeur »

---

## 3. Audit OUTIL interactif (cœur du WOW)

Lis le JSX (`MraFitTool.jsx`). Scénario defaults : 8 · indéterminé · aucune · 3/3 piliers on.

### Première impression outil
- En <10 s : titre « est-ce que ça colle ? » = clair. Intro promet PDF plus que présentation.
- Defaults : taille 8 aide l’aha ; situation « aucune » aide ; contrib « indéterminé » OK ; **piliers tous true** spoilent Ad2 (discovery morte).

### Moment « wow »
- Devrait être : « Pour *ta* PME de ~8 sans collective, qui peut offrir l’accès **sans cotiser** → **Bon fit** — tu offres, eux choisissent. »
- Aujourd’hui : blurb situation-only (`fitBlurb` L94–106 **n’utilise jamais `contrib`**). Pas assez grand, pas assez narré, pas personnel sur la cotisation.
- Manque pour désir de parler : CTA inline « Demander une présentation » + phrase qui cite mon résultat + process temps/charge RH.

### Friction outil
- Piliers densent (Toi/Eux × 3) *après* Lecture rapide — scroll fatigue avant form
- PDF vole la vedette (seul bouton footer)
- Note « formulaire ci-dessous » sans bouton = gap vs Ad3 (« formulaire court après fit »)
- PDF title accents strip (`resume`, `equipe`)

### Après le résultat
- Next step naturel actuel = PDF, **pas** submit form. Soft close cassé.

**Note outil WOW /10 :** 4,5  
**5 upgrades outil (spécifiques — Avant → Après + fichier) :**
1. **CTA post-climax** — Avant : footer PDF only · Après : primaire « Demander une présentation » → `#demande` + PDF outline + event `campagne_programme-mra_tool_to_form` · `MraFitTool.jsx` footer ~L146–152
2. **Score fit + `contrib`** — Avant : blurb situation-only · Après : badge Bon fit / À explorer / Moins prioritaire (taille + situation + contrib) · `fitBlurb` useMemo L94–106
3. **Piliers opt-in** — Avant : `checked` all true L83 · Après : tous off ; « Coche ce qui te parle » devient vrai geste Ad2
4. **Climax typo** — Avant : `text-sm` gris · Après : n employés XL + badge + 1 phrase sous le chiffre (Lecture rapide ~L192–195)
5. **Bridge CRM** — Avant : form vide · Après : au clic CTA, préremplir message / company avec `~8 | pas de collective | plafond/zero` · bridge tool → `CampagneLeadForm`

---

## 4. Psychologie : pourquoi je booke (ou pas)

### Objections dans ma tête (prospect)
1. « Ça va me transformer en gestionnaire d’assurances / usine RH. »
2. « Mes employés vont me coller leurs dossiers médicaux. »
3. « On est trop petits (ou trop grands) — et c’est la même chose qu’une collective non ? »
4. *(form)* « Pourquoi un message obligatoire alors que j’ai déjà rempli l’outil ? »

### Ce qui me ferait booker demain (leviers émotionnels)
- Preuve / clarté / urgence douce / « on le fait ensemble » / peur de mal faire seul : process visible (présentation → 2 rencontres → 30–45 min) + confidentialité médicale + score « Bon fit pour *ton* cas » + rappel humain (pas calendrier imposé — déjà un plus vs Bookings).
- Phrase de soft close idéale (québécois) qui cite **mon** résultat :  
  *« Pour ~8 employés sans collective, t’as un bon fit — surtout si tu veux offrir l’accès sans cotiser. Laisse ton entreprise + ton cell : je te rappelle pour une présentation MRa, sans Bookings ni pression. »*

### Ce qui me fait fuir
- PDF comme sommet ; Message * ; Entreprise optionnelle (leads froids / employés curieux #11) ; lien Apprendre collective juste sous le form ; climax mou ; confusion nav « Prendre rendez-vous ».

---

## 5. TOP 8 améliorations WOW → RDV (ordonnées)

Pour chaque : **Quoi** · **Pourquoi je booke plus** · **Où (fichier)** · **Avant → Après** · **Impact H/M/B** · **Effort S/M/L**  
*(Max 2 shell — items 7–8.)*

1. **CTA outil → `#demande` (primaire) + PDF secondaire** · Après Lecture rapide j’ai mon insight — sans bouton Lead je pars avec le PDF · `MraFitTool.jsx` footer ~L146–152 (+ sous Lecture rapide) · Avant : PDF seul · Après : `[ Demander une présentation ]` + PDF outline + micro « Je te rappelle — sans Bookings » + `select_content` `…_tool_to_form` · **H** · **S**

2. **Score fit réel (taille + situation + `contrib`) + piliers off** · Le « damn » arrive quand le verdict me parle *à moi* (ex. zero cotisation) · `MraFitTool.jsx` `fitBlurb` L94–106, state `checked` L83, UI Lecture rapide · Avant : blurb mou, contrib ignoré, 3/3 on · Après : badge **Bon fit** + phrase avec contrib ; piliers opt-in · **H** · **M**

3. **Qualifier le Lead : Entreprise * + ~n employés (prérempli outil)** · Je booke (submit) plus facilement si on ne me redemande pas ce que j’ai déjà dit — et toi tu rappelles un vrai décideur · `CampagneLeadForm.jsx` company ~L162–174 + props `requireCompany` / `teamSize` · Avant : Entreprise optionnelle, 1 champ flou · Après : Nom entreprise * + chip/champ ~n * (défaut outil) ; payload `team_size` · **H** · **M**

4. **Friction form : Message optionnel + titre « présentation PME » + tel encouragé** · Ad3 vend form court — reality = 5 champs dont textarea * → abandon mobile · `CampagneLeadForm.jsx` L110–115, L177–189 ; copy `ctaHeadline` data · Avant : Message * 4 rows, « Laisse tes coordonnées » · Après : Message optionnel rows=2 ; titre « Demande une présentation MRa » ; Tel « Idéal pour le rappel » · **H** · **S**

5. **Couper la fuite #11 (Apprendre collective + lien employé)** · Je suis boss — un lien livret employé sous mon Lead me fait douter / pollue le remarketing · `campagneAdsLandings.js` `apprendrePath` L552–553 ; FAQ + lien discret « Je suis employé » → `/campagnes/assurance-collective` · Avant : « Lire la capsule assurance collective » · Après : ancre FAQ ≠ collective ; secondaire « Employé avec un livret ? » → #11 · **H** · **S**

6. **Mini comparatif MRa vs collective + process 3 étapes avant form** · Tue objection #1 *avant* le form ; je sais ce que j’achète en cliquant « présentation » · strip dans outil ou section data ; process avant `#demande` · Avant : FAQ seule, process dispersé · Après : 5 critères (volontaire, choix, contrib optionnelle, sélection médicale, portabilité*) + 1→2→3 · **M** · **M**

7. **[Shell ≤2] Slot post-résultat → CTA Lead/RDV (PDF secondaire)** · Pattern catalogue : PDF = faux sommet sur presque toutes les landings · `CampagneToolShell` / landing · Avant : footer PDF-first · Après : slot `postResultCta` branchable Lead (`#demande`) ou Bookings · **H** · **M**

8. **[Shell ≤2] Sticky CTA mobile post-outil « Demander une présentation »** · Sur téléphone, après piliers, le form est loin du pouce · `CampagneAdsLanding.jsx` path form · Avant : rien · Après : barre sticky post-scroll outil → `#demande` · **M** · **M**

---

## 6. Spec copy émotionnelle (avant / après)

| Élément | Avant | Après (WOW / booker = submit) |
|---------|-------|-------------------------------|
| Titre hero | Assurance pour ta PME — sans la complexité d’une collective | Offrir de l’assurance à ton équipe — sans usine à gaz |
| Promesse | Tu offres l’accès. Ils choisissent leurs protections. On accompagne. Une formule conçue pour les petites entreprises. | Tu proposes l’accès. Tes employés choisissent avec un conseiller. Toi : peu de gestion, contribution optionnelle. Pensé pour les décideurs PME — pas une collective traditionnelle. |
| Soft close post-outil | (absent — PDF only + note passive « formulaire ci-dessous ») | Pour ~{n} employés ({situation}), t’as un {score}. Laisse entreprise + cell — je te rappelle pour une présentation MRa. |
| CTA label | Demander une présentation | Recevoir une présentation (micro : je te rappelle) |
| 1 ligne confiance | Tes infos servent uniquement à te recontacter… | Présentation → ~2 rencontres entreprise → 30–45 min / personne. Infos médicales ≠ côté employeur. CSF · Victoriaville. |

---

## 7. Critères de succès « je booke »

- [ ] Le climax outil est impossible à manquer (badge fit + n employés + contrib)
- [ ] Le CTA form apparaît **dans les 2 secondes** après le climax (bouton `#demande` in-tool)
- [ ] La page a une identité visuelle **PME / décideur** (pas template clone + pas sémantique employé #11)
- [ ] Un ami à qui je montre mon écran comprend en 5 s pourquoi j’ai cliqué « Demander une présentation » (pas Bookings, pas livret RH)

---

## 8. Notes agent

**Sources :**  
- Live : `https://www.pierreoliviercaouette.ca/campagnes/programme-mra` (2026-11-04) — hero Lead CTA OK ; outil defaults 8 / indéterminé / aucune / 3 piliers on ; Lecture rapide molle ; footer PDF only ; form Message * + Entreprise optionnelle ; Apprendre → capsule collective.  
- Code : `MraFitTool.jsx` (intégral) · `CampagneLeadForm.jsx` (intégral) · `campagneAdsLandings.js` `programme-mra` L515–562 · `emails/campagne-meta-catalog/programme-mra.md` · `_TEMPLATE.md` (booker = submit form).

**Différenciation #11 vs #15 :**

| | #11 Collective | #15 MRa PME |
|--|----------------|-------------|
| Persona | Employé + livret RH | Décideur / propriétaire PME |
| Outil | `CollectiveChecklistTool` | `MraFitTool` |
| CTA | Bookings 15 min | Form Lead → rappel → présentation |
| Soft close | Schedule | `generate_lead` |
| WOW attendu | Cases floues du livret | Score fit employeur (taille · situation · contrib) |

**Conformité :** garder disclaimers contrats individuels + sélection médicale + preuves d’assurabilité *sous conditions*. Pas de claim agressif taxe/stabilité sans nuance. Ne jamais promettre Bookings sur cette page.  
**Une campagne :** #15 seulement. Pas de commit.
