# [#14] Succession — bases — Expert outils numériques

**Slug :** `/campagnes/succession-bases`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier principal :** `frontend/src/components/campagne/tools/SuccessionChecklistTool.jsx`  
**Shell / landing :** `CampagneAdsLanding.jsx`, `CampagneToolShell.jsx`, `campagneAdsLandings.js`  
**Note WOW outil post-P0 /10 :** ~7,5 → cible Vague 2 **8,5+**

---

## Rescore post-P0 (outil)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| WOW outil | 6 | 7,5 | 8,5 |
| Pont RDV | 3 | 8 (`ToolSoftClose` sous climax) | 8 |
| Hiérarchie climax | 6 | 7 | 8,5 |

**Top 1 gap outil restant :** climax Trous lisible mais **pas assez XXL** ; SoftClose déjà bien placé — manque motion keyed + amplification `missingCount` + ordre mobile cases-first explicite. Module CSF\|Notaire = landing (pas un SoftClose custom).

---

## Interdits (ne pas re-spécifier)

- Pont RDV SoftClose / PDF ghost (livré : `showSoftClose = count >= 1`, sous grille portrait)
- Next-step branché CSF vs notaire (livré : `nextStepFor`)
- Invite froid + reveal `count >= 1` (livré)
- Dual CTA / mid copy landing

---

## Job outil (inchangé)

Faire vivre l’aha « liquidité ≠ actifs » via 6 coches, révéler *mes* trous après interaction, puis SoftClose CSF 15 min (testament = notaire) — PDF secondaire.

---

## Spec climax P1 (Vague 2)

### Hiérarchie chiffres / reorder

| Élément | Avant (post-P0) | Après V2 |
|---------|-----------------|----------|
| Carte Trous `value` | `font-heading text-xl/2xl` | Si `missingCount ≥ 1` : `text-3xl md:text-4xl` tabular ; shorts restent détail |
| Carte État | Même échelle que Trous | Rester `text-xl/2xl` — Trous **domine** |
| SoftClose | Sous grille (OK) | **Garder** — placement déjà sous climax ; ne pas renvoyer en footer-only |
| Cases vs portrait mobile | Portrait gated, cases encore sous | Wrapper checklist + portrait : `flex flex-col-reverse md:flex-col` **ou** déplacer bloc checklist **au-dessus** du portrait sur `max-md` |

### Nouveaux signaux WOW (pas de nouveaux items checklist)

| Signal | Spec |
|--------|------|
| Badge trous | Sur carte Trous : pill `N trous` ambre si `missingCount ≥ 1` — tokens prestige, pas nouvelle palette |
| Liquidité Ad2 | Ligne sous progress **déjà** si `nextItem.id === 'liquidites'` — garder |
| Complet | Tone SoftClose `ok` déjà possible — s’assurer `tone={missingCount === 0 ? 'ok' : 'warn'}` |

### Motion in-tool

1. `ResultCard` Trous : `key={`gaps-${missingCount}`}` + classe helper shell `animate-fade-in` / keyed reveal  
2. SoftClose : fade à l’apparition (helper shell, pas lib locale)  
3. Progress bar : inchangé `duration-500`

### SoftClose placement

**Déjà sous climax** (`showSoftClose` dans le bloc `showPortrait`).  
Vague 2 : **ne pas** inventer un bandeau custom — uniquement `ToolSoftClose`. Option : passer `tone="warn"` quand trous, `tone="ok"` si complet.

---

## Spec Avant → Après

| Zone | Avant | Après | Fichier |
|------|-------|-------|---------|
| Typo Trous | xl/2xl | 3xl/4xl si trous | `SuccessionChecklistTool.jsx` `ResultCard` ou prop `size` |
| SoftClose tone | default | warn / ok selon `missingCount` | même fichier |
| Motion Trous | `animate-fade-in` conteneur | keyed reveal sur Trous | même fichier |
| Mobile order | Portrait puis cases | Cases thumb-first (`flex-col-reverse` ou reorder) | même fichier |
| Events optionnels | absents | `first_check` / `gaps_reveal` | même fichier + `analytics` |

---

## Events analytics

| Event | Quand | ID |
|-------|-------|-----|
| SoftClose RDV (existant) | clic | `campagne_succession-bases_rdv_tool` |
| PDF (existant) | download | `campagne_succession-bases_pdf` |
| Optionnel V2 | `count` 0→1 | `campagne_succession-bases_tool_first_check` |
| Optionnel V2 | reveal grille | `campagne_succession-bases_tool_gaps_reveal` |

---

## Ce qu’on n’ajoute **pas**

- Calculateur mois de liquidité / impôts décès  
- Email gate PDF  
- 7ᵉ item checklist  
- SoftClose one-off hors `ToolSoftClose`  
- Remplacement disclaimer Scale

---

## Fichiers exacts

| Fichier | Changements V2 |
|---------|----------------|
| `SuccessionChecklistTool.jsx` | typo Trous XXL ; tone SoftClose ; keyed motion ; mobile order ; events optionnels |
| `CampagneAdsLanding.jsx` | process + module CSF\|Notaire + portrait mid (**shell** — pas climax outil) |
| `campagneAdsLandings.js` | `atmosphere`, `heroExtras`, `processSteps` |
| `PageHero.jsx` / helpers motion | shell catalogue (dépendance) |

---

## Critères acceptation outil V2

- [ ] SoftClose reste `ToolSoftClose` sous climax (pas footer-only)
- [ ] `missingCount` impossible à manquer (échelle 3xl/4xl)
- [ ] Mobile : cases dans le 1er écran outil
- [ ] Aucun SoftClose custom / mid reinventé
- [ ] Disclaimer Scale + shell always on

---

## Hors scope

- Re-spec SoftClose copy / wiring RDV  
- Commit / code
