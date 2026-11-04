# [#04] Expert outils numériques — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/InvaliditeTool.jsx`  
**Shell :** `CampagneToolShell.jsx` · `ToolSoftClose` · `CampagneAdsLanding.jsx` · `campagneAdsLandings.js`  
**Note WOW outil post-P0 /10 :** 8 → cible **9** (placement SoftClose + pulse — **pas** re-spécifier pont RDV)

---

## 1. Verdict UX post-P0

P0 livré : duo snapshot, chips 30/90/120, SoftClose RDV+PDF ghost, `!gapWarn` définition, PDF FR, events `…_rdv_tool` / `…_rdv_tool_definition`.  
**Gap #1 :** `ToolSoftClose` est encore dans `footer` du shell (L218–229) — **sous Block 2**, pas sous le climax duo (L236–271). Le prospect lit trou+coussin, scrolle les champs + Block 2, **puis** voit le booker → friction émotionnelle.  
**Gap #2 :** pas de warn pulse / keyed reveal sur les chiffres climax.  
**Interdit V2 :** reinventer SoftClose, dual CTA, mid copy, PDF ghost pattern.

---

## 2. Modèle de calcul (inchangé)

| Variable | Formule |
|----------|--------|
| `montantCollective` | `revenu * (pct / 100)` |
| `trouVsDepenses` | `depenses - montantCollective` |
| `trouVsRevenu` | `revenu - montantCollective` |
| `coussin` | `(jours / 30) * depenses` |
| `gapWarn` | `trouVsDepenses > 0` |
| `coussinWarn` | `jours > 0 && depenses > 0` |
| `couverturePct` | `min(100, round(montantCollective / depenses * 100))` |

**Defaults :** `4500` · `60` · `90` · `3200` — garder (WOW immédiat).

Aucun nouveau champ P1 obligatoire (chip 60 % = option P2).

---

## 3. Spec climax P1 — placement SoftClose

### 3.1 Avant → Après structure JSX

**Avant (code actuel) :**
```
CampagneToolShell footer={<ToolSoftClose …>}
  Snapshot duo + barre
  Block 1 champs
  Block 2 ResultCards + note définition
```

**Après (Vague 2) :**
```
CampagneToolShell footer={hasInputs ? null : <invite>}
  Snapshot duo + barre          ← climax
  ToolSoftClose                 ← IMMÉDIATEMENT sous climax
  Block 1 champs
  Block 2 ResultCards + note
```

### 3.2 Règles composant

| Règle | Détail |
|-------|--------|
| Composant | **Uniquement** `ToolSoftClose` importé de `CampagneToolShell` |
| Props | `headline`, `subline`, `rdvPath`, `rdvLabel`, `onRdvClick`, `onPdf`, `pdfBusy`, `pdfLabel`, `tone` |
| `tone` | `warn` si `gapWarn \|\| coussinWarn` ; sinon `default` (pas `ok` émeraude rassurant) |
| Footer shell | `null` si SoftClose monté sous duo ; **ou** micro-invite saisie si `!hasInputs` |
| PDF | Toujours via SoftClose ghost — pas de 2ᵉ bouton PDF primary |

### 3.3 Typo climax (catalogue)

| Élément | Classe cible |
|---------|--------------|
| `SnapshotCell` value | `font-heading text-3xl md:text-4xl font-bold tabular-nums` |
| SoftClose headline | déjà `font-heading text-base md:text-lg` — OK shell |

### 3.4 Motion in-tool

| Motion | Spec | Helper |
|--------|------|--------|
| Warn pulse | One-shot ~400–600 ms sur cellule trou et/ou coussin quand valeur warn change | Helper shell (ex. `useClimaxPulse(key)`) **ou** `key={trouVsDepenses}` + classe `animate-pulse` limitée — **pas** lib motion solo |
| SoftClose fade | Apparition fade quand `hasInputs` | Helper shell partagé fade SoftClose |
| Barre | Garder `transition-all duration-500` | Existant |

**Key pulse :** `trouVsDepenses` + `coussin` (ou `delaiCarence`) — pulse au chip 30→120 aussi.

### 3.5 Note définition (Block 2)

Garder bandeau + lien `…_rdv_tool_definition` si `!gapWarn`. Pas de SoftClose dupliqué en bas.

### 3.6 Option P2 (hors ship V2 prioritaire)

- Chip rapide **60 %** à côté du champ %  
- Compresser card « collective / mois » en micro-ligne si redondance snapshot trop forte  

---

## 4. Shell landing (dépendances — uniformité)

| Besoin | Fichier | Spec |
|--------|---------|------|
| `atmosphere` | `PageHero` + landing | Brancher `item.atmosphere` |
| `heroExtras` | landing | Même slot catalogue |
| `processSteps` | landing sous En bref | Même composant ; 3 strings data |
| Portrait mid | bandeau mid navy | `/seo/portrait.jpg` 48–64 + libellé CSF |
| `#outil` | déjà sur shell | OK |
| SoftClose | **outil only** | Pas de SoftClose custom mid |

---

## 5. Analytics (garder + optionnel)

| Event | Quand | V2 |
|-------|-------|-----|
| `campagne_assurance-invalidite_rdv_tool` | SoftClose RDV | Garder (même id — seul placement change) |
| `…_rdv_tool_definition` | Lien note | Garder |
| `…_pdf` | PDF SoftClose | Garder |
| `…_chip_delai` | Optional `{ value }` | Nice-to-have |
| `…_outil_scroll` / hero | Déjà landing | Garder |

**Ne pas** inventer un nouvel event « softclose_moved ».

---

## 6. États edge

| Cas | Comportement |
|-----|--------------|
| `!hasInputs` | Pas de SoftClose climax ; invite saisie (footer ou sous barre) |
| `gapWarn` | SoftClose `tone="warn"` sous duo |
| `!gapWarn` + coussin | SoftClose `default` ou `warn` si `coussinWarn` ; copy définition |
| Chip délai | Recalc coussin + pulse cellule coussin |
| Mobile | SoftClose full-width stack RDV → PDF juste sous duo |

---

## 7. Fichiers JSX exacts

| Fichier | Changement |
|---------|------------|
| `InvaliditeTool.jsx` | Déplacer `ToolSoftClose` sous snapshot (≈L236–271) ; retirer du `footer` ; typo 3xl/4xl ; pulse ; `tone` |
| `CampagneToolShell.jsx` | Helpers motion partagés si absents (fade / pulse) — **shell**, pas one-off |
| `CampagneAdsLanding.jsx` | processSteps + portrait mid + atmosphere (shell) |
| `campagneAdsLandings.js` | data #04 |
| `PageHero.jsx` | `atmosphere` variants |

---

## 8. Critères acceptation outil

- [ ] SoftClose visible **sans scroller** Block 1–2 après lecture du duo (viewport desktop outil)  
- [ ] Toujours `ToolSoftClose` partagé — zéro bandeau custom  
- [ ] Warn pulse au change trou/coussin (chips inclus)  
- [ ] Chiffres climax text-3xl/4xl `font-heading`  
- [ ] Events P0 inchangés et fire toujours  
- [ ] PDF reste ghost dans SoftClose  
- [ ] Ami en 5 s sur l’outil : « ses 2 chiffres → Clarifier mon trou »
