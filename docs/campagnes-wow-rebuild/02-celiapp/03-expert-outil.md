# [#02] CELIAPP — Spec UX outil (shippable)

**Rôle :** Expert outils numériques  
**Slug :** `/campagnes/celiapp`  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/CeliappTool.jsx`

---

## 1. Defaults (tension, pas spoiler)

| State | Avant | Après |
|-------|-------|-------|
| `cotisationAnnuelle` | `'8000'` | `'4000'` |
| `annees` | `'5'` | `'4'` |
| `dejaCotise` | `'0'` | `'0'` |
| Résultat load | 40 000 $ / 40 000 $ ambre 100 % | **16 000 $** / 40 000 $ (~40 %), place restante 24 000 $ |

**Chip optionnel** sous step 1 : « Viser le max 8 k $ × 5 ans » → set `8000` / `5` (ownership explicite du climax max).

**Placeholder inputs :** aligner `4000` / `4` (pas `8000` / `5`).

---

## 2. Climax WOW — hiérarchie chiffres

**Ordre d’affichage card résultat (step 3) :**

1. **`lecture.headline`** en `font-heading text-3xl sm:text-4xl` *(aujourd’hui calculé L141–146, **jamais rendu** — bug produit)*  
   - Ex. : `Environ 16 000 $ pour ta mise de fonds`  
   - Ou : `Tu touches le max à vie dans ce scénario`
2. `lecture.detail` (déjà affiché)
3. Si cible saisie : bandeau 3 colonnes **Projection · Cible · Écart** (écart = cible − totalProjete ; si négatif : « Au-dessus de ta cible (cotisations seulement) »)
4. `lecture.points` (bullets)
5. KPIs existants : Par année / Ajouté / Place restante
6. **Bandeau conversion navy** (RDV primary + PDF outline) — **dans les 2 s** / sans scroll hors card sur desktop
7. Bloc « À retenir » beige (secondaire)
8. Checklist admissibilité *peut* vivre entre step 2 et step 3 (voir §4)

**Label mort à retirer :** uppercase « Total pour la mise de fonds » remplacé par le headline (garder « Max à vie » seulement si `plafondAtteint`).

---

## 3. Pont résultat → RDV (PDF secondaire)

### Dans `CeliappTool` footer (`CampagneToolShell` footer ~L282–290)

```
[statusDetail chiffré / booker-first]
[Link RDV primary]  [ToolDownloadPdf outline]
```

- RDV : `buildCampagneRdvPath('celiapp', search)` + `trackRendezVousClick('campagne_celiapp_rdv_outil')`
- Classes RDV : `rounded-full bg-primary … text-white` (même langage que mid)
- PDF : nouvelle prop `variant="outline"` sur `ToolDownloadPdf` — `border border-primary bg-white text-primary`

### Bandeau sous KPIs (priorité P0)

Même CTAs + copy template script (`~{totalProjete}$` / place restante).  
Sur mobile : RDV full-width puis PDF full-width.

### Landing « À toi de jouer »

Remplacer « résumé clair et un PDF à garder » → copy script (PDF = bonus).

---

## 4. Champs / modules à ajouter

| Module | Spec | Priorité |
|--------|------|----------|
| Afficher `lecture.headline` | Remplacer label statique L435–440 | P0 |
| Soft close + RDV sous climax | Bandeau + footer | P0 |
| Defaults 4000/4 + chip max | `useState` L152–154 | P0 |
| Retirer `max={PLAFOND_ANNUEL}` | `MoneyInput` cotisation L336–344 — activer `coupeParPlafondAnnuel` + message L395–396 | P0 |
| Cible mise de fonds (optionnel) | Nouveau `Field` step 2 : `miseCible` string state ; `buildLecture` + UI écart | P1 |
| Checklist admissibilité | 3× `ToolChecklistItem` (déjà dans `CampagneToolShell`) post-step 2 ; états oui/non/indet ; **aucun verdict juridique** ; si doute → highlight pont RDV | P1 |
| Mini tableau CELI ≠ CELIAPP | Sous À retenir ou data landing | P1 |
| PDF accents FR | `Resume` → `Résumé`, `annee` → `année`, etc. dans `handleDownload` | P1 |
| Hint reports | Si `prevu > 8000` : message clamp + note « reports possibles — à valider » (finance) | P1 |

**Ne pas ajouter :** rendement, calcul maison/prix, score d’admissibilité vert/rouge, email gate.

---

## 5. Events analytics

| Event | Quand | Payload |
|-------|-------|---------|
| `select_content` tool focus | déjà `onFocusCapture` landing | `campagne_celiapp_tool` |
| `trackRendezVousClick('campagne_celiapp_rdv_outil')` | click RDV dans outil | — |
| `trackRendezVousClick('campagne_celiapp_rdv_mid')` | mid (existant) | — |
| `trackRendezVousClick('campagne_celiapp_rdv')` | hero secondary | — |
| `select_content` | click primary hero scroll `#outil` | `item_id: campagne_celiapp_scroll_outil` |
| `select_content` | chip « Viser le max » | `campagne_celiapp_chip_max` |
| `select_content` | toggle admissibilité | `campagne_celiapp_elig_toggle` |
| PDF | déjà `useCampagneToolPdf('campagne_celiapp_pdf')` | garder |

---

## 6. Fichiers JSX / JS exacts à toucher

| Fichier | Changements |
|---------|-------------|
| `frontend/src/components/campagne/tools/CeliappTool.jsx` | defaults, headline, cible, checklist, soft close RDV, max input, status, PDF accents, chip max |
| `frontend/src/components/campagne/CampagneToolShell.jsx` | `ToolDownloadPdf` `variant="outline" \| "primary"` |
| `frontend/src/pages/CampagneAdsLanding.jsx` | dual CTA hero ; `id="outil"` ; mid soft close depuis data ; sous-titre outil |
| `frontend/src/components/layout/PageHero.jsx` | props atmosphère / image optionnelle (si pattern partagé) |
| `frontend/src/data/campagneAdsLandings.js` | copy celiapp + `softCloseHeadline` / `softCloseSubline` / bullets / FAQ |
| `frontend/src/App.js` | `hidePortfolioBanner` sur `/campagnes` |
| `emails/campagne-meta-catalog/celiapp.md` | soft close labels (script §9) |

**Shell vs spécifique :**
- Shell partagé : dual CTA hero pattern, mid soft close data-driven, `ToolDownloadPdf` outline, hide banner campagnes
- Spécifique CELIAPP : logique projection, checklist, cible, headline, chip max

---

## 7. Logique calcul (inchangée sauf cible)

Garder :
- `PLAFOND_ANNUEL = 8000`, `PLAFOND_VIE = 40000`
- `cotisationEffective = min(prevu, 8000, droitsRestantsAvant)`
- Pas de rendement

Ajouter (P1) :
- `cible = toNumber(miseCible)` ; `ecart = cible - totalProjete` si cible > 0
- Ne **pas** modeler le report 16 k$ dans le moteur P0 (disclaimer + hint seulement) — voir finance

---

## 8. Critères acceptation UX

- [ ] Load : barre ≠ 100 % ambre ; chiffre ≈ 16 k$ avec defaults
- [ ] Saisir 10 000 $/an → message clamp 8 000 $ visible (`coupeParPlafondAnnuel`)
- [ ] Headline « Environ X $… » visible dans la card
- [ ] CTA RDV cliquable dans les 2 s après lecture du chiffre (même viewport desktop)
- [ ] PDF toujours dispo mais outline / secondaire
- [ ] Checklist n’affiche jamais « Tu es admissible » / « Tu n’es pas admissible »
