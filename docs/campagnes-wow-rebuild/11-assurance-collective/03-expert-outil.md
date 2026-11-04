# [#11] Expert outils numériques — CollectiveChecklistTool

**Slug :** `/campagnes/assurance-collective`  
**Fichier principal :** `frontend/src/components/campagne/tools/CollectiveChecklistTool.jsx` (~727 L)  
**Shell :** `CampagneToolShell.jsx` · `CampagneAdsLanding.jsx` · `campagneAdsLandings.js`  
**CTA conversion :** RDV Bookings (`buildCampagneRdvPath`) — **pas** lead form MRa  
**Date :** 2026-11-04  
**Unique vs :** `#04` Invalidité (trou $), `#12` Autonome (pas de collective), `#15` MRa (form PME)

---

## 1. État actuel (friction → fuite)

| Problème | Lignes approx. | Effet |
|----------|----------------|-------|
| Step 1 = Employeur | ~L396–417 | Spoil énergie Ad2 (paliers) ; abandon avant aha |
| Checkbox livret en dernier | ~L670–704 | Sans livret, ResultCards creuses |
| Footer = PDF only | ~L308–316 | Next step = télécharger, pas booker |
| `missingCount` taupe | ~L331–335, L229–234 | Climax émotionnel sous-joué |
| Insights plats | ~L192–222 | « À trouver » = statut tech, pas peur utile |
| Trous = textarea libre | ~L653–667 | Pas de chips MG / plafond → flous flous |
| `depart` done = `depart \|\| trousNotes` | ~L156 | On « complète » sans clarifier le départ |
| PDF ASCII | `handleDownload` | `Resume`, `Invalidite`, accents manquants |

**Note outil WOW actuelle /10 :** 5.5

---

## 2. Climax WOW (définition)

**Climax = nombre de cases encore floues (`missingCount` + cards warn), pas le % de progression.**

Ordre émotionnel :
1. Utilisateur ouvre paliers / laisse des vides → cards Invalidité / Départ en **warn**
2. Chiffre gros : **« 2 encore flous »**
3. Phrase : cases nommées (invalidité, départ…)
4. **≤ 2 s** : CTA RDV *Démêler mes cases floues (15 min)*
5. PDF = secondaire (outline)

Defaults : **rester vides** (pas de faux climax). Ne pas préremplir 60 % / 90 j.

---

## 3. Spec UX shippable

### 3.1 Ordre des milestones (P0)

**Nouveau ordre :**

| Step | Bloc | `done` |
|------|------|--------|
| 1 | **Invalidité** (structure simple/paliers, %, délai, définition) | `invaliditeChiffresOk` |
| 2 | Vie et santé | capital + sante |
| 3 | Si tu quittes + trous (chips) | `depart` **requis** (ne plus valider via trousNotes seul) |
| 4 | Livret en main | `hasLivret` |
| 5 | Employeur *(optionnel)* | `employeur.trim()` — compte pour progress mais **ne bloque pas** le soft close |

`total` reste 5. Mettre à jour `milestones` useMemo + indices ResultCards / `milestones[n].done`.

### 3.2 Gate livret (P0)

Au-dessus de Progression (~L319) :
- Callout sticky / sticky-within-tool : *« Idéal avec le PDF RH ouvert »*
- Lien ancre → FAQ `faq-livret` sur la landing (`id` sur la question 2)
- Checkbox « J’ai le livret » **dupliquée en tête** (ou déplacée) ; garder aussi en bas OK si sync même state `hasLivret`

### 3.3 Soft close RDV dans le footer (P0)

Remplacer footer PDF-only :

```text
[ statusDetail émotionnel ]
[ Primary: Link RDV — visible si missingCount > 0 OU card Invalidité warn ]
[ Secondary: ToolDownloadPdf outline / ghost ]
```

- Path : `buildCampagneRdvPath('assurance-collective', location.search)`
- Track : `trackRendezVousClick('campagne_assurance-collective_rdv_cases_floues')`
- Imports : `Link` + `useLocation` (react-router) + analytics + `buildCampagneRdvPath`
- Label : *Démêler mes cases floues (15 min)*
- Si `missingCount === 0` : PDF primaire ; lien soft *Valider ensemble en 15 min* (`…_rdv_validation`)

### 3.4 Hiérarchie chiffres Progression (P0)

```text
Si missingCount > 0 :
  Gros : "{n} encore flou(s)"  (ambre, font-heading)
  Petit : "{done}/{total} · {progress} %"
Sinon :
  Gros : "Complet"
  Petit : "5/5 — range ton PDF avec le livret"
```

### 3.5 Insights émotionnels ResultCard (P0)

Remplacer details vides/partiels (voir textes dans `02-expert-script.md` § Insights).  
Accentuer `tone='warn'` quand À trouver / Partiel / Pas encore.

### 3.6 Chips trous (P1)

Block départ — remplacer / compléter textarea :

| Chip | Values | Effet |
|------|--------|-------|
| Maladie grave dans la collective ? | Oui / Non / Je ne sais pas | `je-ne-sais-pas` ou Non → +1 signal soft close / note auto |
| Plafond invalidité $/mois noté ? | Oui + champ $ / Non / Je ne sais pas | Je ne sais pas → flou nommé |

- State : `maladieGrave`, `plafondNote`, `plafondMontant`
- Alimenter `trousNotes` auto ou section PDF « Trous repérés »
- **Interdit :** lien, CTA ou wording MRa / PME / « présentation équipe »

### 3.7 PDF polish (P1)

- Titres avec accents : `Résumé`, `Invalidité`, `Non renseigné`, `Délai`, `Médicaments`
- Inclure chips MG / plafond dans rows
- Notes : rappeler livret prime + éducatif

### 3.8 Mini-résumé header (P1)

Retirer ou rétrograder le **double** bouton PDF du haut (~L359–365) : garder 1 PDF (footer) pour réduire fatigue mobile ; ou PDF haut = icon-only.

---

## 4. Pont résultat → RDV (règle d’or)

```
Climax flous visible
  → CTA RDV dans le footer outil (même viewport si possible)
  → Mid page = reinforcement data-driven (ctaHeadline)
  → PDF jamais le seul next step quand missingCount > 0
```

Hero landing : primaire scroll `#outil` (id sur wrapper outil dans `CampagneAdsLanding.jsx`).

---

## 5. Events analytics

| Event | `item_id` / name | Quand |
|-------|------------------|-------|
| `select_content` | `campagne_assurance-collective_tool` | focus outil (existant) |
| `select_content` | `campagne_assurance-collective_tool_scroll_cta` | clic hero « Remplir la checklist » |
| `select_content` | `campagne_assurance-collective_paliers` | bascule structure → `paliers` |
| `select_content` | `campagne_assurance-collective_livret_check` | `hasLivret` true |
| `rdv_click` via `trackRendezVousClick` | `campagne_assurance-collective_rdv_cases_floues` | CTA footer flous |
| idem | `campagne_assurance-collective_rdv_validation` | CTA post-complet |
| idem | `campagne_assurance-collective_rdv` | hero secondaire |
| idem | `campagne_assurance-collective_rdv_mid` | mid (existant) |
| PDF | `campagne_assurance-collective_pdf` | existant `useCampagneToolPdf` |

---

## 6. Fichiers exacts à toucher

| Fichier | Changements |
|---------|-------------|
| `CollectiveChecklistTool.jsx` | Ordre steps, gate, climax UI, footer RDV, insights, chips, PDF accents, milestones |
| `CampagneAdsLanding.jsx` | `id="outil"` ; dual CTA hero ; mid `ctaHeadline`/`ctaSubline` pour mode RDV |
| `campagneAdsLandings.js` | Copy + flags `heroPrimaryCta: 'tool'`, headlines |
| `emails/campagne-meta-catalog/assurance-collective.md` | Align Ad2/Ad3 (script) |
| Tests éventuels | `data-testid` : `tool-collective-checklist`, ajouter `campagne-ads-cta-tool` |

**Ne pas toucher :** `MraFitTool.jsx`, landing `#15`, module Apprendre sauf lien existant.

---

## 7. Critères d’acceptation outil

- [ ] Step 1 = Invalidité (paliers visibles < 3 s)
- [ ] Gate livret visible avant de scroller les blocs
- [ ] `missingCount > 0` ⇒ CTA RDV dans footer outil (PDF secondaire)
- [ ] CTA RDV apparaît dans les ~2 s après perception du climax
- [ ] Chips MG / plafond n’évoquent **jamais** MRa
- [ ] Defaults vides ; pas de faux « Complet »
- [ ] Mobile : footer stack lisible ; un seul PDF dominant
