# [#01] Comparateur rendements — Expert outils numériques

**Slug :** `/campagnes/comparateur-rendements`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Signé :** Expert outils numériques  
**Code lu :** `ComparateurRendementsTool.jsx` (SoftClose en `footer` · order totaux→barres→écart · chip mythe · narration · `_result` 1×) · `CampagneToolShell.jsx` (`ToolSoftClose` partagé)

**Focus V2 :** climax P1 (hiérarchie / motion / placement SoftClose) — **pas** re-spécifier le pont RDV/PDF (déjà livré).  
**Contrat :** toujours `ToolSoftClose` — jamais un bandeau RDV custom ; typo climax catalogue `font-heading text-3xl/4xl`.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | **7,2** | **9,0** |
| WOW outil | 6,5 | **7,4** | **9,0** |
| Env. booker | 4,5 | **7,0** | **8,5** |

**Top 1 gap WOW restant :** SoftClose encore **footer-only** (loin du climax) + ordre **totaux d’abord** → l’ami voit deux cards avant le « damn » ; typo écart via `style.fontSize` orpheline vs échelle catalogue.

---

## Verdict

L’outil a déjà l’aha (~12 k$ defaults) + chip mythe + SoftClose chiffré + PDF ghost. Vague 2 = **écarts-first + pulse + SoftClose sous climax** + motion helpers shell. Aucun nouveau champ fiscal (pas de matching / SCEE — hors sujet #01).

---

## 1. Architecture UX cible (post-V2)

```
Hero dual CTA → #outil
  → Progress (teaser)
  → Chiffres + chip mythe
  → Profil + taux
  → CLIMAX
       1. Écart illustratif XXL (text-3xl/4xl + pulse)
       2. Barres keyed reveal
       3. Cards totaux (secondaires)
       4. Narration composition (déjà)
       5. ToolSoftClose (même composant — sous climax)
  → (footer shell vide si SoftClose monté)
→ Mid + portrait catalogue
→ FAQ
```

---

## 2. SoftClose — placement (pas rewrite)

### Avant
`CampagneToolShell` `footer={ doneCount>=3 ? <ToolSoftClose …/> : status }`  
→ bandeau gris sous tout le contenu + au-dessus disclaimer.

### Après
- Rendre `<ToolSoftClose …/>` **immédiatement sous** le bloc résultat (après narration), quand `doneCount >= 3`.
- `footer={null}` **ou** footer = statusDetail seulement si `< 3/3`.
- Props SoftClose **inchangées** (headline dynamique, subline, rdv, pdf ghost) — **composant partagé uniquement**.

**Fichier :** `frontend/src/components/campagne/tools/ComparateurRendementsTool.jsx` (~L325–342 → déplacer JSX sous climax ~L642).

**Analytics (garder) :**
- `trackRendezVousClick('campagne_comparateur-rendements_rdv_outil')`
- PDF via `useCampagneToolPdf('campagne_comparateur-rendements_pdf')`
- `_result` 1× déjà OK

Event optionnel V2 : `campagne_comparateur-rendements_climax_view` 1× quand SoftClose monte (P2).

---

## 3. Écart-first reorder + typo catalogue

### Avant (L592–641)
```
grid ResultCard banque | modèles
barres
ResultCard écart (emphasize) + ecartFontScale → style.fontSize
narration
```

### Après
```
ResultCard / bloc écart FIRST
  - label « Écart illustratif »
  - value: font-heading text-3xl md:text-4xl (text-5xl si |ecart| très large + desktop — mapping catalogue)
  - detail: % vs banque · années · capital versé (garder)
barres (key={`${profil}-${years}-${Math.round(ecart)}`} pour remount 0→width)
grid totaux banque | modèles (visuellement secondaires — pas emphasize)
narration
ToolSoftClose
```

### Remplacer `ecartFontScale` inline
Mapper l’intensité à des **classes catalogue** (pas px orphelins) :

| Intensité | Classes |
|-----------|---------|
| Base (≤25 % vs banque) | `text-3xl md:text-4xl` |
| Forte | `text-4xl md:text-5xl` |
| Cap | `text-5xl` max |

Garder la logique de tranches actuelle, mais **sortie = className**, alignée shell.

### Pulse
Sur changement `ecart` (après 3/3) : toggle classe helper shell `campagne-climax-pulse` 450 ms.  
**Fichier motion :** util CSS partagé (ex. dans `index.css` ou module shell) — **interdit** d’introduire une lib motion #01-only.

---

## 4. Motion in-tool (2–3)

| ID | Moment | Spec | Helper |
|----|--------|------|--------|
| M1 | SoftClose enter | fade + translate-y quand monté sous climax | `campagne-softclose-enter` (shell) |
| M2 | Barres | remount keyed width 0→cible au 1er 3/3 et au chip mythe | `key=` + `transition-all duration-500` existant |
| M3 | Écart pulse | 1 pulse sur reveal / gros changement | `campagne-climax-pulse` |

Ne pas animer Progress ni chaque keystroke.

---

## 5. Micro-améliorations P1 (outil)

| Item | Spec | Effort |
|------|------|--------|
| Invite highlight taux | Si `!tauxBanqueManuel && doneCount>=3` : tip sous champ banque (script S-4) | S |
| Mobile radios | Masquer ligne `banque ~x% · modèles y%` sur radios **non** sélectionnés | S |
| Chip reset | `Revenir au départ 10k·10ans` (P2) | S |
| Sticky mini-bar écart | Mobile only après climax (P2) — classes prestige, pas sticky one-off fancy | M |

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| SoftClose | `footer` shell | Sous climax, `ToolSoftClose` | `ComparateurRendementsTool.jsx` |
| Order résultats | Totaux → barres → écart | Écart → barres → totaux | idem |
| Typo écart | `style.fontSize` via scale | `font-heading text-3xl/4xl/5xl` | idem + éventuellement `ResultCard` |
| Motion | bar transitions | + fade SoftClose + pulse + keyed bars | tool + CSS shell |
| Progress teaser | OK | Garder (ne vole pas climax) | — |
| Chip mythe | Livré | Garder | — |
| Pont RDV/PDF | Livré | **Ne pas re-spécifier** | — |

---

## Backlog (outil)

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| O-1 | SoftClose sous climax (`ToolSoftClose`) | S | **P0-v2** |
| O-2 | Écart-first reorder | S | **P0-v2** |
| O-3 | Typo climax classes catalogue (retire inline px) | S | **P0-v2** |
| O-4 | Pulse + SoftClose fade (helpers shell) | S | **P0-v2** |
| O-5 | Keyed bar remount | S | **P0-v2** |
| O-6 | Invite highlight relevé | S | P1 |
| O-7 | Mobile hide taux radios non sélectionnés | S | P1 |
| O-8 | Chip reset départ | S | P2 |
| O-9 | Sticky mini-bar | M | P2 |
| O-10 | Module preuve live 5 profils (page) | M | P1 |

---

## Uniformité outil

| Contrat | #01 |
|---------|-----|
| SoftClose partagé | Oui — placement only |
| Pas de bandeau custom | Oui |
| Typo climax catalogue | Oui — 3xl/4xl/5xl |
| Motion helpers shell | Oui — pas lib solo |
| Divergence autorisée | Order écart-first + pulse + chip mythe (déjà) |

---

## Critères acceptation outil

- [ ] À 3/3, SoftClose visible **sans scroller sous le footer gris** — collé sous l’écart.
- [ ] Premier chiffre lu dans le climax = **écart**, pas totaux.
- [ ] Typo écart = classes heading catalogue (inspect DevTools : pas de `font-size` inline orphelin).
- [ ] PDF reste ghost via `ToolSoftClose` / `ToolDownloadPdf variant ghost`.
- [ ] Events `_result`, `_rdv_outil`, UTM Bookings préservés.
