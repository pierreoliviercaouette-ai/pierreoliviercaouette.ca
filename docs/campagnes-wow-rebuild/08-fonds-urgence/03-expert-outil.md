# [#08] Fonds d’urgence — Spec UX outil (shippable)

**Rôle :** Expert outils numériques  
**Slug :** `/campagnes/fonds-urgence`  
**Date :** 2026-11-04  
**Fichier principal :** `frontend/src/components/campagne/tools/FondsUrgenceTool.jsx`  
**Shell / data :** `CampagneToolShell.jsx` · `CampagneAdsLanding.jsx` · `campagneAdsLandings.js`  
**Note outil WOW actuelle /10 :** 7,5 → **cible conversion : CTA ≤2 s post-climax**

---

## 1. Objectif produit

L’outil **impressionne déjà** (cible → manquant → délai → rythme12).  
Le gap n’est pas le calcul : c’est **monétiser le climax en RDV** (PDF secondaire) + incarnater Ad2 (carte) et Ad3 (outil d’abord).

**Defaults (garder — scénario aha Ad2-like) :**
| Champ | Valeur | Rôle |
|-------|--------|------|
| Dépenses | `3500` | Cible 21 000 $ à 6 mois |
| Mois | `6` | Courant |
| Déjà de côté | `5000` | Barre ~24 %, manquant **16 000 $** |
| Ajout / mois | `300` | Délai **4 ans 6 mois** · rythme12 **1 334 $** |

Ownership faible (rien tapé) = acceptable pour aha Meta ; ne pas vider les defaults.

---

## 2. Climax WOW — hiérarchie chiffres

Ordre d’affichage bloc « En clair » (après refactor) :

1. `lecture.headline` (ambre / émeraude)
2. Gros chiffre : `manquant` **ou** `surplus` (`text-3xl/4xl`) — **garder**
3. Label « à combler » / « de surplus vs la cible »
4. **NOUVEAU** si `!atteint && moisPourCombler > 12 && rythme12 > 0` :  
   ligne bold `Soit ~{formatCad(rythme12)}/mois pour ~12 mois`
5. `lecture.detail`
6. Liste `lecture.points` (peut alléger le point rythme12 redondant si ligne 4 affichée)
7. Metrics 2 cols (délai · rythme12 / atteint) — **garder**
8. **NOUVEAU** Soft-close RDV branché 3 tons (voir §3)
9. « À retenir » → `<details>` mobile / collapsible
10. Footer status + PDF outline

---

## 3. Pont résultat → RDV (PDF secondaire)

### Soft-close inline (sous Metrics, avant À retenir)

Implémenter dans `FondsUrgenceTool.jsx` (~après L541) :

```text
États :
- warn court  : manquant > 0 && (moisPourCombler == null || moisPourCombler <= 24)
- warn long   : moisPourCombler > 24
- ok          : atteint / surplus > 0
```

UI :
- Conteneur : même langage couleur que En clair (`from-amber-50` / `from-emerald-50`)
- Copy : voir `02-expert-script.md` §2
- Bouton primary : `Link` → `buildCampagneRdvPath('fonds-urgence')`  
  `onClick` → `trackRendezVousClick('campagne_fonds-urgence_rdv_outil')`
- Bouton / contrôle secondary : `ToolDownloadPdf` en **outline** (pas `bg-primary`)

### Footer shell (~L318–327)

| Avant | Après |
|-------|-------|
| `statusDetail` pousse PDF only + `ToolDownloadPdf` primary | Dual : status dual (« 15 min ou PDF ») + RDV primary si pas déjà visible above-the-fold mobile ; PDF outline |

Recommandation : **soft-close sous Metrics = primary conversion** ; footer = rappel court + PDF seulement (évite double gros CTA).

### `buildLecture` / `statusDetail` atteint (~L138–148, ~L242–248)

| Avant | Après |
|-------|-------|
| status « Télécharge le PDF » | « Filet OK — 15 min pour trancher le surplus, ou PDF. » |
| points surplus OK | Garder orientation dettes/CELI/REER ; soft-close CTA « Trancher le prochain dollar — 15 min » |

---

## 4. Champs / modules — pas de nouveaux inputs

Aucun champ supplémentaire. Pas de formulaire email dans l’outil.

**Modules UX à ajouter :**
1. Ligne rythme12 sous gros $ (§2)
2. Soft-close 3 tons (§3)
3. Collapse « À retenir » (mobile default closed)
4. PDF accents FR dans `handleDownload` (~L256–310)
5. Ancre page `#outil` sur wrapper outil (`CampagneAdsLanding` — `id="outil"` sur le bloc Tool)

**Optionnel P1 :** micro-copy 1 ligne au-dessus de l’outil : « La carte ≠ un filet — l’outil calcule *ton* coussin. » (script Ad2)

---

## 5. Analytics events

| Event | Quand | Params / id |
|-------|-------|-------------|
| Existant `select_content` tool | focus outil | `campagne_fonds-urgence_tool` |
| Existant PDF | download | `campagne_fonds-urgence_pdf` |
| Existant mid RDV | clic mid | `campagne_fonds-urgence_rdv_mid` |
| **NOUVEAU** `campagne_fonds-urgence_result` | 1× quand `cible > 0` et user a changé un champ **ou** après 1er paint avec defaults + scroll into En clair | `trackEvent('select_content', { content_type: 'tool_result', item_id: 'campagne_fonds-urgence_result', value: manquant \|\| surplus })` |
| **NOUVEAU** RDV outil | clic soft-close | `trackRendezVousClick('campagne_fonds-urgence_rdv_outil')` |
| Hero outil | scroll `#outil` | `campagne_fonds-urgence_hero_outil` |
| Hero RDV sec. | clic | `campagne_fonds-urgence_rdv` (existant) |

Success metric : ratio `rdv_outil` / `tool` ↑ ; `pdf` reste OK mais ne doit plus dominer le funnel.

---

## 6. Fichiers exacts à toucher

| Fichier | Quoi |
|---------|------|
| `frontend/src/components/campagne/tools/FondsUrgenceTool.jsx` | Soft-close 3 tons · rythme12 sous $ · statusDetail · PDF FR · collapse À retenir · events result/rdv_outil · imports `Link`, `buildCampagneRdvPath`, `trackRendezVousClick` |
| `frontend/src/data/campagneAdsLandings.js` | `fonds-urgence` : promise, bullets, faq carte, `ctaHeadline`, `ctaSubline`, évent. `heroPrimary: 'outil'` |
| `frontend/src/pages/CampagneAdsLanding.jsx` | Dual CTA hero · `id="outil"` · mid data-driven (`ctaHeadline`/`ctaSubline`) · intro outil |
| `frontend/src/components/campagne/CampagneToolShell.jsx` | *(P1 shell)* prop optionnelle `postResultCta` / variant PDF outline — sinon override local dans FondsUrgenceTool |
| `emails/campagne-meta-catalog/fonds-urgence.md` | Micro-ajustements Ad1/Ad2 close (script) |

---

## 7. Acceptance UX

- [ ] Defaults : en <10 s je vois 5 000 / 21 000 · manque 16 000 $ · délai 4 a 6 m
- [ ] Si délai >12 mois : rythme12 visible **sous** le gros manquant (pas seulement Metric)
- [ ] CTA RDV visible sans scroller « À retenir » + mid (≤2 s post-climax)
- [ ] PDF n’est plus le seul bouton primary post-résultat
- [ ] État atteint pousse « prochain dollar » RDV, pas seulement PDF
- [ ] Events `result` + `rdv_outil` tirent en QA
- [ ] Aucun nouveau claim chiffré hors illustration (cible = dépenses × mois)

---

## 8. Hors scope / non-régression

- Ne pas recalculer comme `toolCalculators.calculateFondsUrgence` (outil Apprendre plus granulaire) — garder la formule simple landing
- Ne pas demander email pour PDF
- Ne pas retirer Metrics (preuve délai / rythme)
- Shell dual-CTA = dette partagée 15 campagnes — #08 peut shipper soft-close local **avant** le shell complet
