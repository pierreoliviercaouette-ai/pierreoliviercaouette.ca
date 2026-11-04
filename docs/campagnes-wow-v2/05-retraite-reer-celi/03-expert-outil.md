# [#05] Expert outils numériques — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier principal :** `frontend/src/components/campagne/tools/RetraiteReerCeliTool.jsx`  
**Landing :** `frontend/src/pages/CampagneAdsLanding.jsx` · `frontend/src/data/campagneAdsLandings.js`  
**Périmètre V2 :** climax P1 matching — **pas** le pont RDV SoftClose (déjà livré).

---

## Rescore post-P0 (outil)

| Zone | État code actuel | Gap V2 |
|------|------------------|--------|
| Tone mixte | `nuance` ✓ | — |
| Snapshot $ XXL | mixte + monthly → `$ / $` ✓ | — |
| SoftClose footer | `ToolSoftClose` + RDV + PDF ghost ✓ | Placement OK (footer sous Block 2) |
| Matching | **Absent** | **Climax P1 #05** |
| Analytics RDV tool | `…_rdv_tool` ✓ | + event matching optionnel |

**Top 1 gap WOW outil :** chips matching employeur Oui / Non / Je sais pas — objection #1 persona 35–55 non capturée dans l’outil.

---

## Spec climax P1 — Matching employeur

### Defaults

Conserver P0 :

- `tranche: 'moyenne'` · `horizon: 'moyen'` · `liquidite: 'non'` · `cotisationMensuelle: '500'`  
- **Nouveau :** `matching: 'je_sais_pas'` (neutre — n’altère **pas** le split %)

### Options

```js
const MATCHING_OPTIONS = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'je_sais_pas', label: 'Je sais pas' },
];
```

### Placement UX

- Block 1, **après liquidité**, **avant** cotisation mensuelle.  
- `ChoiceGroup` `columns={3}` → mobile 1 col (pattern existant).  
- Label + hint (script § matching).

### Effet sur `buildSuggestion`

| matching | Split % | Raisons | Snapshot |
|----------|---------|---------|----------|
| `non` / `je_sais_pas` | Inchangé | Inchangé | Inchangé |
| `oui` | **Ne pas** forcer 100 % REER | Prepend raison éducative (script) | Chip `Match employeur noté` sous sous-ligne |
| `oui` + `liquidite === 'oui'` | Règle CELI **reste prioritaire** | + nuance « même avec un match… » (script) | Idem chip |

### PDF

Ajouter row :

```
{ label: 'Matching employeur', value: optionLabel(MATCHING_PDF, matching) }
```

dans section « Tes réponses ».

### SoftClose placement

**Déjà sous climax** (footer `CampagneToolShell`) — ne pas déplacer, ne pas inventer de bandeau.  
Option : passer `tone="nuance"` / `ok` selon `suggestion.tone` pour cohérence visuelle (S, optionnel).

### Motion in-tool

1. SplitBar : `key={`${suggestion.split.celi}-${suggestion.split.reer}`}` + `transition-all duration-500` (déjà).  
2. SoftClose fade : helper shell quand `pdfReady` flip.  
3. (P2) count-up `$` sur snapshot dominant.

---

## Analytics

| Event | Trigger | id |
|-------|---------|-----|
| Existant | RDV SoftClose | `campagne_retraite-reer-celi_rdv_tool` |
| **Nouveau** | change matching → `oui` | `select_content` · `campagne_retraite-reer-celi_matching_oui` |
| Optionnel | PDF row matching présent | déjà pdf hook |

Pas de PII.

---

## Spec Avant → Après

| Zone | Avant | Après V2 | Fichiers |
|------|-------|----------|----------|
| Block 1 | 4 champs | + matching chips 3 options | `RetraiteReerCeliTool.jsx` |
| `buildSuggestion` | pas de matching | raison prepend si Oui ; split inchangé | même |
| Snapshot | $ / short | + chip match si Oui | même |
| PDF rows | 4 réponses | + Matching employeur | `handleDownload` |
| SoftClose | Footer OK | **Inchangé** (contrat shell) | — |
| Landing chrome | Pas atmosphere / process | data `atmosphere`, `heroExtras`, `processSteps` | `campagneAdsLandings.js` + shell |

---

## Fichiers exacts à toucher

1. `frontend/src/components/campagne/tools/RetraiteReerCeliTool.jsx` — matching state, ChoiceGroup, raisons, PDF, chip  
2. `frontend/src/data/campagneAdsLandings.js` — bloc `retraite-reer-celi` : `atmosphere`, `heroExtras`, `processSteps`, `toolIntro`  
3. Shell partagé (si pas encore) : `PageHero.jsx` (atmosphere), `CampagneAdsLanding.jsx` (process + heroExtras + portrait mid)  
4. `CampagneToolShell.jsx` / SoftClose — **seulement** si portrait prop générique ; pas de SoftClose one-off #05

---

## Backlog outil

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| O-1 | Chips matching + state + PDF row | M | **P1** (climax) |
| O-2 | Raison Oui / Oui+liquidité | S | P1 |
| O-3 | Chip snapshot + event analytics | S | P1 |
| O-4 | Keyed SplitBar / SoftClose fade shell | S | P0-v2 / P2 |
| O-5 | Count-up $ | S | P2 |

---

## Critères acceptation outil

- [ ] Matching Oui / Non / Je sais pas visibles Block 1  
- [ ] Oui → raison éducative ; **pas** de forçage split REER  
- [ ] Liquidité oui + matching oui → CELI reste `ok`  
- [ ] SoftClose reste `ToolSoftClose` partagé  
- [ ] Régressions : liquidité→CELI ; élevée+long→REER  
