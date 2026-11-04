# [#15] Programme MRa — Expert outils numériques

**Slug :** `/campagnes/programme-mra`  
**Vague :** 2 (post-P0)  
**Outil :** `MraFitTool.jsx`  
**CTA conversion :** `CampagneLeadForm` → `generate_lead` via `ToolSoftClose formMode` → `#demande`  
**Date :** 2026-11-04

> P0 **fait** : score fit (taille·situation·contrib), climax XL, piliers off, SoftClose `formMode` sous climax + footer, bridge sessionStorage, PDF ghost, event `tool_to_form`.  
> Vague 2 outil = **polish climax P1** (motion) — **pas** re-spécifier SoftClose / pont RDV / dual CTA.  
> **Uniformité :** Lead = variante `ctaType:'form'` du **même** `ToolSoftClose` (pas de bandeau custom).

---

## Rescore post-P0 (outil)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| WOW outil | 4,5 | ~8 (badge + ~n XL + contrib) | ≥ 8,5 |
| Placement SoftClose | Footer PDF only | Sous climax + footer ✅ | Garder |
| Env. Lead | 5 | ~7,5 | ≥ 8 (chrome page) |

**Top 1 gap outil restant :** climax XL mais **statique** — pas de keyed reveal / fade SoftClose partagé catalogue.

---

## Spec Avant → Après (climax P1)

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hiérarchie chiffres | `~n` `text-4xl md:text-5xl` + badge + phrase | **Garder hiérarchie** — pas de nouveaux champs score | `MraFitTool.jsx` ~L302–318 |
| Motion climax | Aucune | `key` sur bloc Lecture fit ; fade/scale 200–280 ms via helper shell | `MraFitTool.jsx` + helper motion |
| SoftClose placement | Déjà sous climax + footer | **OK** — ne pas déplacer ; appliquer fade helper | `MraFitTool.jsx` |
| SoftClose composant | `ToolSoftClose formMode` | **Interdit** custom CTA bandeau | `CampagneToolShell.jsx` |
| Score / contrib | Déjà câblé | Pas de nouvelle grille sauf retour terrain P2 | — |
| Strip comparatif | Absent | P1 landing (option) — hors climax outil core | landing / data |

---

## Climax — polish (pas rebuild)

### Ce qui est déjà bon (ne pas toucher)
- Eyebrow `Lecture fit`
- `~{nEmployes}` XL `font-heading`
- Badge `Bon fit` / `À explorer` / `Moins prioritaire` + `BADGE_STYLES`
- `fitBlurb` cite situation + accroche contrib
- SoftClose immédiat sous climax (`formLabel` présentation + PDF ghost)

### Motion in-tool (P0-v2)

```
Bloc Lecture fit
  key={`${nEmployes}-${badge}`}
  → helper catalogue : fade-in + léger scale chiffre (pas Framer one-off)
SoftClose
  → même helper fade quand softHeadline change
```

Events : **aucun nouvel event obligatoire**. Garder :
- `campagne_programme-mra_tool_to_form` (déjà)
- `campagne_programme-mra_pdf` (déjà)
- `generate_lead` form (déjà)

Option P2 : `select_content` sticky form si sticky shell ship.

---

## SoftClose = contrat catalogue (Lead)

| Élément | Règle #15 |
|---------|-----------|
| Composant | `ToolSoftClose` uniquement |
| Mode | `formMode={true}` → primary scroll `#demande` |
| PDF | ghost via `onPdf` existant |
| Mid page | `ctaType:'form'` + `CampagneLeadForm` — **même funnel**, pas 2e SoftClose reinventé |
| Portrait | Shell mid (pas dans l’outil) |

Ne pas ajouter de 3e bouton Bookings / « Réserver ».

---

## Fichiers exacts

| Fichier | Vague 2 |
|---------|---------|
| `frontend/src/components/campagne/tools/MraFitTool.jsx` | Motion keyed climax + fade SoftClose |
| Helper motion shell (si créé) | Partagé catalogue — pas local MRa-only |
| `CampagneToolShell.jsx` | Aucun changement formMode requis |
| `CampagneLeadForm.jsx` | Aucun (P0 fait) sauf si portrait mid besoin slot voisin |
| `CampagneAdsLanding.jsx` | chrome `processSteps` / portrait / atmosphere (shell) |
| `campagneAdsLandings.js` | `atmosphere`, `heroExtras`, `processSteps` |

---

## Hors scope Vague 2 outil (rappels)

- Re-spéc SoftClose / dual CTA / `ctaHeadline` ❌
- Changer seuils score sauf P2 terrain
- Sticky mobile form = shell catalogue P1 (OK si `ctaType==='form'`)
- Strip 5 critères Collective vs MRa = landing P1, pas climax

---

## Critères acceptation OUTIL

- [ ] Climax XL inchangé en contenu ; motion keyed visible sur change taille/situation
- [ ] SoftClose reste `ToolSoftClose formMode` sous climax
- [ ] Clic CTA → `#demande` + bridge fit (déjà) + event `tool_to_form`
- [ ] Zéro Bookings / `trackRendezVousClick` sur interactions outil
- [ ] Helpers motion = shell partagé (pas lib solo #15)
