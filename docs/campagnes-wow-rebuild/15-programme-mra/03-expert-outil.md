# [#15] Programme MRa PME — Spec OUTIL (UX shippable WOW → Lead)

**Rôle :** Expert outils numériques  
**Slug :** `/campagnes/programme-mra`  
**Outil :** `MraFitTool.jsx`  
**CTA conversion :** `CampagneLeadForm` → `generate_lead` (**pas** Bookings)  
**Date :** 2026-11-04

> **≠ #11** : pas de checklist livret / `missingCount` / RDV 15 min. Ici = **score fit employeur** (taille · situation · contrib) → formulaire.

---

## 1. Job de l’outil

En <2 min, le décideur PME obtient : « Pour *ma* boîte de ~n, avec *ma* situation et *ma* idée de cotisation → **Bon fit / À explorer / Moins prioritaire** », puis un geste évident : **Demander une présentation** (`#demande`). Le PDF est un souvenir, pas le sommet.

---

## 2. Defaults (état initial)

| Champ | Aujourd’hui | Après |
|-------|-------------|-------|
| `employes` | `'8'` | **garder** `'8'` (aha taille PME) |
| `situation` | `'aucune'` | **garder** `'aucune'` (match Ad1) |
| `contrib` | `'indetermine'` | **garder** (neutre) |
| `checked` piliers | `{ flex/simple/rapide: true }` | **tous `false`** — discovery Ad2 réelle |

---

## 3. Climax WOW — score fit

### Inputs utilisés
`nEmployes` + `situation` + `contrib` (+ optionnel `pillarsOn` pour nuance soft, **pas** pour spoiler le badge).

### Grille score (shippable)

| Score | Badge UI | Conditions (ordre d’évaluation) |
|-------|----------|----------------------------------|
| **Bon fit** | vert/secondary | `n` ∈ [5, 40] ET (`situation` ∈ `aucune\|couteuse\|choix`) ET (`contrib` ≠ bloquant) — typiquement tout sauf cas « trop grand + explorer only » |
| **À explorer** | ambre | `n` ∈ [1, 4] OU `n` ∈ [41, 80] OU `situation === 'explorer'` OU mix mitigé |
| **Moins prioritaire** | taupe | `n` > 80 (souvent logique collective plus lourde à explorer autrement) OU `n` ≤ 0 (invalide → pas de badge, prompt taille) |

Affiner en code sans sur-ingénierie : priorité = **toujours citer contrib dans la phrase**, même si le badge dépend surtout taille+situation.

### Phrase (`fitBlurb` / `fitSummary`)

Doit inclure :
1. `~{n}`  
2. situation courte  
3. accroche **contrib** (`zero` → sans cotiser ; `pct` → % ; `plafond` → plafond $ ; `indetermine` → « même si t’as pas encore décidé comment cotiser »)

**Avant (bug) :** `fitBlurb` L94–106 ignore `contrib`  
**Après :** `useMemo(..., [nEmployes, situation, contrib])` + helper `scoreFit()`

### UI climax (remplace bloc L192–195)

```
[ Lecture fit ]
  ~8                    ← text-4xl font-heading
  [ Bon fit ]           ← badge
  Une phrase…           ← text-base text-dark
```

Sous le climax (avant piliers) : **CTA primaire Lead** + PDF outline (voir §5).

---

## 4. Ordre des blocs dans l’outil

1. Taille + contrib  
2. Situation  
3. **Climax** (chiffre + badge + phrase)  
4. **CTA Lead + PDF** (dupliquer aussi en footer shell)  
5. Piliers opt-in (Toi / Eux)  
6. Note conformité courte  

Rationale : aujourd’hui piliers *après* Lecture rapide mais *avant* tout CTA utile → fatigue ; et Lecture rapide est trop molle.

---

## 5. Pont résultat → Lead (critique)

### Boutons

| Priorité | Label | Action |
|----------|-------|--------|
| Primaire | `Recevoir une présentation` | `scrollIntoView('#demande')` + bridge préremplissage + event |
| Secondaire | `Télécharger mon résumé PDF` | `handlePdf` existant — style outline |

### Bridge CRM → form

Au clic CTA Lead (et idéalement au changement de fit si form déjà monté) :

Préremplir `CampagneLeadForm` :
- `company` ← nom vide mais hint ; **ou** concat `~{n} employés`
- `message` ← `Fit outil : ~{n} | {situationLabel} | {contribLabel} | score {badge}`

Props à ajouter (rétrocompat OK) :

```js
// CampagneLeadForm.jsx
initialMessage?: string
initialCompany?: string
requireCompany?: boolean  // true pour programme-mra
requireMessage?: boolean  // false pour programme-mra
teamSize?: number | string
phoneHint?: string
title?: string
subline?: string
```

Payload submit : garder `create_contact_submission` ; enrichir `p_message` avec bloc outil si pas déjà dedans ; tracker `team_size` / `fit_score` dans `generate_lead` params si possible sans casser le RPC.

### Wiring landing

`CampagneAdsLanding.jsx` : state lift **ou** `CustomEvent` / petit context campagne :

Option A (S) : `MraFitTool` écrit `sessionStorage` clé `campagne_programme-mra_fit` ; form lit au mount + au focus.  
Option B (M) : lift state dans `CampagneAdsLanding` via render prop / callback `onFitChange`.

Recommandation P0 : **sessionStorage + lecture form** (découplé, S).

---

## 6. PDF

- Garder sections situation / piliers / lecture
- Ajouter row `Score fit` = badge
- Corriger accents strip : `résumé`, `équipe`, `éducatif`, `sélection`, `assurabilité` (aujourd’hui ASCII strip dans title/notes)
- Title PDF : `Programme MRa — résumé pour PME`
- Notes : rappeler présentation / rappel (pas Bookings)

`ToolDownloadPdf` : accepter `variant="outline"` **ou** bouton custom secondaire dans footer.

---

## 7. Events analytics

| Event | Quand | Params clés |
|-------|-------|-------------|
| `select_content` | focus outil | `item_id: campagne_programme-mra_tool` (existe landing) |
| `select_content` | clic CTA outil → form | `content_type: tool_to_form`, `item_id: campagne_programme-mra_tool_to_form`, `fit_score`, `team_size` |
| `campagne_programme-mra_pdf` | PDF (hook existant) | + `fit_score` |
| `generate_lead` | submit form | `method: campagne_lead_form`, `item_id: campagne_programme-mra`, `has_phone`, `has_company`, `fit_score`, `team_size` |
| `select_content` | sticky CTA (P1) | `campagne_programme-mra_sticky_form` |

Pas d’event Bookings / `trackRendezVousClick` sur cette page.

---

## 8. Formulaire Lead — changements UX

Fichier : `CampagneLeadForm.jsx` (+ data landing)

| Champ | Avant | Après (MRa) |
|-------|-------|-------------|
| Titre H3 | Laisse tes coordonnées | `Tes coordonnées pour le rappel` (prop) |
| Entreprise | optionnelle, floue « approx. d’employés » | **Nom entreprise *** (`requireCompany`) |
| Taille | mélangée dans entreprise | chip/champ `~n` prérempli outil (`teamSize`) |
| Message | `required` rows=4 | **optionnel** rows=2 |
| Tel | neutre | hint « Idéal pour le rappel » |
| Submit | Demander une présentation | `Recevoir une présentation` |

---

## 9. Shell / landing (dépendances)

| Item | Scope | Note |
|------|-------|------|
| CTA post-résultat Lead | **Spécifique** `MraFitTool` P0 ; pattern `postResultCta` shell = P1 catalogue | Audit TOP #7 |
| Sticky mobile post-outil | `CampagneAdsLanding` si `ctaType === 'form'` | P1 |
| Intro « À toi de jouer » | Landing dit encore « résumé clair et un PDF » — **changer** pour form-CTA : `Remplis l’outil — tu vois ton fit, puis tu demandes une présentation.` | Copy landing |
| Nav globale « Prendre rendez-vous » | Hors scope page si layout global — noter comme bruit ; ne pas ajouter 2e Bookings in-page | |

`CampagneToolShell` : pas obligatoire de modifier en P0 si footer custom suffit.

---

## 10. Fichiers exacts à toucher

| Fichier | Changements |
|---------|-------------|
| `frontend/src/components/campagne/tools/MraFitTool.jsx` | score, contrib, piliers off, climax UI, CTA Lead, PDF accents, events |
| `frontend/src/components/campagne/CampagneLeadForm.jsx` | props requireCompany / message optionnel / initial* / title / teamSize |
| `frontend/src/pages/CampagneAdsLanding.jsx` | intro outil, apprendre lien #11, process strip (ou data), sticky P1, passer props form |
| `frontend/src/data/campagneAdsLandings.js` | copy + `apprendre*` + flags form si besoin |
| `frontend/src/components/campagne/CampagneToolShell.jsx` | optionnel `variant` PDF / `postResultCta` (P1 shell) |
| Ads md | alignement Ad1–3 (script) |

---

## 11. Critères acceptation OUTIL

- [ ] Defaults : 8 / aucune / indéterminé / piliers **off**
- [ ] `contrib` influence la phrase (preuve manuelle zero vs pct)
- [ ] Badge fit visible + `~n` XL
- [ ] Bouton Lead in-tool ≤2 s après climax ; PDF secondaire
- [ ] Clic CTA préremplit message form avec fit
- [ ] Submit = `generate_lead` (pas redirection Bookings)
- [ ] Event `…_tool_to_form` tiré
- [ ] Aucune confusion UX avec checklist #11
