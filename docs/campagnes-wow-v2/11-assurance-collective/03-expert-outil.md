# [#11] Expert outils numériques — CollectiveChecklistTool (Vague 2)

**Slug :** `/campagnes/assurance-collective`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier principal :** `frontend/src/components/campagne/tools/CollectiveChecklistTool.jsx`  
**Shell :** `CampagneToolShell.jsx` · `ToolSoftClose` · `CampagneAdsLanding.jsx` · `campagneAdsLandings.js`  
**CTA :** RDV Bookings uniquement — **zéro lead MRa / form PME**

---

## Rescore post-P0 (outil)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| WOW outil | 5.5 | 7.5 | ≥ 9 |
| Climax → booker | 4 | 8 | ≥ 9 |
| Hiérarchie chiffres | 4 | 7 | ≥ 9 |

**Top 1 gap WOW restant :** SoftClose flous **fait** ; le climax `missingCount` est visible (`text-3xl/4xl`) mais **pas encore dominant** (pas de bloc ambre dédié, pas de flous nommés, pas de motion keyed). Chips trous MG / plafond toujours absents.

---

## Interdits Vague 2 (ne pas re-spécifier)

- SoftClose RDV / PDF ghost (déjà dans footer via `ToolSoftClose`)
- Reorder Invalidité-first / gate livret (déjà livrés)
- Dual CTA / mid headlines (shell P0)
- Nouveau SoftClose one-off — **contrat catalogue** = `ToolSoftClose` only

---

## Spec climax P1 (cœur Vague 2)

### A. Hiérarchie `missingCount` XXL

**Avant (P0) :** label Progression + chiffre ambre `text-3xl sm:text-4xl` + `done/total · %` + barre.

**Après (V2) :**

```text
┌─────────────────────────────────────────┐
│  CASES ENCORE FLOUES          (eyebrow) │
│  2 encore flous               (4xl/5xl) │
│  Invalidité · Départ · Livret (noms)    │
│  2/5 · 40 %                   (taupe)   │
│  ████████░░░░  barre keyed              │
└─────────────────────────────────────────┘
```

| Règle | Détail |
|-------|--------|
| Typo | `font-heading text-4xl sm:text-5xl` — échelle catalogue climax (pas orpheline) |
| Conteneur | `rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white px-4 py-4` |
| Noms flous | Mapper milestones non done → labels courts : Invalidité / Vie-santé / Départ / Livret / Employeur |
| Complet | Emerald : *Complet* + *5/5 — range ton PDF avec le livret* |
| Placement SoftClose | **Rester footer** `CampagneToolShell` — déjà sous le flux ; OK catalogue. Ne pas dupliquer SoftClose sous la barre. |

### B. Motion in-tool

| Motion | Impl | Event / note |
|--------|------|--------------|
| Keyed reveal chiffre | `key={missingCount}` + `animate-in fade-in zoom-in-95 duration-200` (helper shell) | — |
| Barre | `transition-all duration-500` (existant) + `key={progress}` optionnel | — |
| SoftClose fade | Helper shell quand `showSoftClose` true | déjà conditionnel |
| Pulse Invalidité warn | 1× `ring-amber-300` au 1er `invaliditeWarn` | `prefers-reduced-motion: reduce` → off |

### C. Chips trous WOW (nouveaux champs)

Block « Si tu quittes et trous » — après select `depart` :

| State | UI | Effet |
|-------|-----|-------|
| `maladieGrave` | Oui / Non / Je ne sais pas | `non` ou `je-ne-sais-pas` → note auto dans résumé / PDF row |
| `plafondNote` | Oui / Non / Je ne sais pas | si Oui → champ `plafondMontant` ($) |
| `plafondMontant` | number | PDF + detail ResultCard si renseigné |

**Interdit :** CTA, lien, ou wording vers `#15` MRa.  
Chip MG = *présence dans la collective*, pas vente produit `#06`.

`depart` done = `Boolean(depart)` seulement (déjà P0) — ne pas revalider via trousNotes.

### D. SoftClose placement

| Check | Statut |
|-------|--------|
| Footer via `ToolSoftClose` | ✅ P0 |
| RDV primary + PDF ghost | ✅ |
| Sous climax barre | Non requis — climax → cards → steps → SoftClose footer = ordre OK |
| Tone SoftClose | Passer `tone="warn"` quand `showSoftClose` (si prop supportée — déjà dans shell) |

---

## Fichiers JSX exacts + analytics

| Fichier | Changement V2 |
|---------|----------------|
| `CollectiveChecklistTool.jsx` | Bloc climax XXL ; noms flous ; chips MG/plafond ; motion keyed ; `tone="warn"` SoftClose |
| `CampagneToolShell.jsx` | Aucun SoftClose custom — helpers motion si partagés |
| `CampagneAdsLanding.jsx` | `id="outil"` sur wrapper Tool (manquant aujourd’hui) ; process/portrait = shell |
| `campagneAdsLandings.js` | `atmosphere`, `heroExtras`, `processSteps` pour slug |

### Events (nouveaux / garder)

| Event | `item_id` | Quand |
|-------|-----------|-------|
| (existant) | `campagne_assurance-collective_livret_check` | checkbox livret |
| (existant) | `campagne_assurance-collective_paliers` | structure paliers |
| (existant) | `campagne_assurance-collective_rdv_cases_floues` | SoftClose RDV |
| (existant) | `campagne_assurance-collective_rdv_validation` | RDV si complet |
| **Nouveau** | `campagne_assurance-collective_chip_mg` | select MG |
| **Nouveau** | `campagne_assurance-collective_chip_plafond` | select plafond |
| **Nouveau** | `campagne_assurance-collective_climax_view` | 1× quand `missingCount` passe de total→&lt;total au scroll/focus (optionnel P2) |

PDF : rows MG + plafond si renseignés ; accents FR déjà P0.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après Vague 2 | Fichiers |
|------|---------------------|---------------|----------|
| Climax | `text-3xl/4xl` plain | Bloc ambre + `4xl/5xl` + noms flous | `CollectiveChecklistTool.jsx` ~L416–457 |
| Motion | Barre only | Keyed chiffre + pulse warn + SoftClose fade | outil + shell helper |
| Trous | Textarea libre | + chips MG / plafond $ | même fichier Block 3 |
| SoftClose | Footer `ToolSoftClose` | Inchangé contrat ; `tone="warn"` | idem |
| Ancre outil | Pas d’`id="outil"` | Wrapper `#outil` | `CampagneAdsLanding.jsx` |

---

## Critères acceptation outil

- [ ] `missingCount` = élément le plus dominant de l’outil (taille + ambre + noms)
- [ ] SoftClose = `ToolSoftClose` partagé, ≤ 1 scroll après climax
- [ ] Chips MG/plafond sans aucune mention MRa
- [ ] Defaults restent vides (pas de faux climax)
- [ ] Mobile : bloc climax lisible sans zoom ; SoftClose stack OK

---

## Effort

| ID | Item | Effort | Tier |
|----|------|--------|------|
| C11-1 | Climax XXL + noms flous | S | P0-v2 |
| C11-2 | Motion keyed + pulse | S | P0-v2 |
| C11-3 | Chips MG + plafond | M | P1 |
| C11-4 | `id="outil"` + tone SoftClose | S | P0-v2 |
| C11-5 | Events chips / climax_view | S | P2 |
