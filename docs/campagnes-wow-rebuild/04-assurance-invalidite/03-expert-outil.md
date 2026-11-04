# [#04] Expert outils numériques — Assurance invalidité

**Fichier cœur :** `frontend/src/components/campagne/tools/InvaliditeTool.jsx`  
**Shell :** `CampagneToolShell.jsx` · landing `CampagneAdsLanding.jsx` · data `campagneAdsLandings.js`  
**Date :** 2026-11-04  
**Note WOW actuelle /10 :** 7 → cible **9** (pont RDV inclus)

---

## 1. Verdict UX

Defaults dramatiques (4 500 · 60 % · 90 j · 3 200 → trou **500 $** · coussin **9 600 $**) = aha < 10 s. Climax réel = **duo** trou + coussin ; aujourd’hui le snapshot ne hero que le trou. Next step codé = PDF → intention différée. État `!gapWarn` ferme l’objection Ad1 (« t’es correct ») alors que la note définition dit le contraire. Friction Ad2 : pas de chips 30/90/120. Pont booker au pic = **absent**.

---

## 2. Modèle de calcul (garder)

| Variable | Source | Formule |
|----------|--------|---------|
| `montantCollective` | L115 | `revenu * (pct / 100)` |
| `trouVsDepenses` | L116 | `depenses - montantCollective` |
| `trouVsRevenu` | L117 | `revenu - montantCollective` |
| `coussin` | L118 | `(jours / 30) * depenses` |
| `gapWarn` | L121 | `trouVsDepenses > 0` |
| `couverturePct` | L122–123 | `min(100, round(montantCollective / depenses * 100))` |

**Defaults (inchangés — WOW immédiat) :**  
`revenuNet=4500` · `pctCollective=60` · `delaiCarence=90` · `depensesFixes=3200`

Label UI : toujours « illustration / exemple ajustable », jamais « ton vrai contrat ».

---

## 3. Spec UX shippable

### 3.1 Snapshot duo (climax)
**Où :** L193–230  

**Après :**
```
[ Trou / mois | Coussin d’attente ]   ← grid sm:grid-cols-2, text-2xl égal
[ ========== barre couverture ========== ]
[ microcopy % + jours ]
```
- Trou : `tone` ambre si `gapWarn`, sinon label « Marge » + tone ok/default  
- Coussin : ambre si `jours > 0 && depenses > 0`  
- Barre : garder `transition-all duration-500`

### 3.2 Chips délai 30 / 90 / 120
**Où :** sous `NumberField` `invalidite-carence` L261–271  

```
[ 30 ] [ 90 ] [ 120 ]   ← setDelaiCarence(String(n))
input number reste éditable (cas 60, 119, etc.)
hint: « Pas le livret sous la main ? Pars de 60 % / 90 j — on ajuste en RDV. »
```
Selected chip : `bg-primary text-white` ; idle : border prestige.

Option P1 : chip rapide **60 %** à côté du champ % (même pattern).

### 3.3 `statusDetail` (L125–129) — psychologie

| État | Après |
|------|-------|
| `!hasInputs` | Entre ton revenu, ce que ton assurance collective t’offre, et tes dépenses — le trou apparaît tout de suite. |
| `gapWarn` | ~{formatCad(trou)} /mois à combler · ~{formatCad(coussin)} $ à tenir. On ouvre ton livret en 15 min — %, délai, définition. |
| `!gapWarn` | Les $ tiennent sur papier. Reste la définition et la durée dans ton livret — c’est souvent ça qu’on clarifie en 15 min. |

**Ne plus** pousser le PDF comme next step primaire.

### 3.4 Footer — pont RDV (P0)
**Où :** L186–191  

```
[ statusDetail ]
[ Clarifier mon trou en 15 min ]  ← Link outline / primary outline
[ Télécharger mon résumé PDF ]    ← ghost / secondary
```

Implémentation :
- `import { Link, useLocation } from 'react-router-dom'`
- `import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings'`
- `import { trackRendezVousClick } from '../../../lib/analytics'`
- `to={buildCampagneRdvPath('assurance-invalidite', location.search)}`
- `onClick={() => trackRendezVousClick('campagne_assurance-invalidite_rdv_tool')}`
- Afficher RDV si `hasInputs && (gapWarn || coussin > 0 || true)` → **toujours** si `hasInputs` (même marge OK : objection définition)

Styles suggérés :
- RDV : `rounded-full border-2 border-primary text-primary …` ou filled primary  
- PDF : `rounded-full border border-prestige… bg-white text-dark` (démoter `ToolDownloadPdf` ou prop `variant="ghost"`)

### 3.5 Note définition + CTA soft (`!gapWarn`)
**Où :** sous L317–322  

Si `!gapWarn` : lien texte  
`Clarifier définition & durée en 15 min →` même `rdvPath` + track `…_rdv_tool_definition`

### 3.6 PDF (`handleDownload` L131–178)

| Avant | Après |
|-------|-------|
| `Resume`, `entrees`, `Resultats`, `cheque`, accents cassés | Accents FR : `Résumé`, `Tes entrées`, `Résultats`, `chèque`, `Dépenses`, `délai` |
| Notes 3 lignes | + note : `Prochaine étape : 15 min pour valider %, délai, définition. Aucun % promis comme garantie.` |
| Event | garder `useCampagneToolPdf('campagne_assurance-invalidite_pdf')` |

### 3.7 Block 2
Garder 3 cards. P1 optionnel : si snapshot duo solide, réduire redondance collective (micro-ligne) — **pas P0**.

---

## 4. Shell landing (dépendances)

| Besoin | Fichier | Spec |
|--------|---------|------|
| Ancre `#outil` | `CampagneAdsLanding.jsx` ~L117–136 | `id="outil"` sur wrapper outil |
| Hero CTA primary scroll | même | bouton/`<a href="#outil">` + track `campagne_assurance-invalidite_outil_hero` |
| Mid copy data-driven | L181–187 | Utiliser `item.ctaHeadline` / `item.ctaSubline` (comme branche form L145–149) |
| FAQ +3 | `campagneAdsLandings.js` L58–68 | Voir script |

---

## 5. Analytics events

| Event | `item_id` / args | Quand |
|-------|------------------|-------|
| Existants | `campagne_assurance-invalidite` view_item | page |
| Existants | `…_tool` select_content | focus outil |
| Existants | `…_pdf` | download |
| Existants | `…_rdv` / `…_rdv_mid` | hero / mid |
| **Nouveau** | `campagne_assurance-invalidite_rdv_tool` | footer outil RDV |
| **Nouveau** | `…_rdv_tool_definition` | CTA soft sous note |
| **Nouveau** | `…_outil_hero` | clic « Voir mon trou » |
| **Nouveau** | `…_chip_delai` (optional) | params `{ value: 30\|90\|120 }` |

---

## 6. États edge

| Cas | Comportement |
|-----|--------------|
| Champs vides / 0 | snapshot 0 $ ; CTA RDV désactivé ou soft ; status = invite saisie |
| Marge OK + coussin > 0 | pas d’émeraude « t’es correct » ; pousser définition |
| Marge OK + coussin 0 | rare ; quand même CTA soft définition/durée |
| Délai custom (ex. 45) | chips désélectionnés ; input gagne |
| Mobile | footer stack : copy → RDV → PDF |

---

## 7. 5 upgrades outil (Avant → Après + fichier)

1. Footer PDF only → RDV outline chiffré + PDF ghost — `InvaliditeTool.jsx` L186–191  
2. Input carence → chips 30/90/120 + hint livret — L261–271  
3. `statusDetail` gapWarn→PDF / !gapWarn→« t’es correct » → pont livret/RDV — L125–129  
4. Snapshot trou seul → duo Trou \| Coussin — L193–230  
5. PDF accents + next-step livret — `handleDownload` L131–178  

---

## 8. Critères acceptation outil

- [ ] En < 10 s sans geste : trou **et** coussin visibles (defaults)
- [ ] Changer chip 30→120 recalcule coussin immédiatement
- [ ] < 2 s après lecture du climax : CTA RDV visible sans scroller hors footer outil
- [ ] `!gapWarn` ne tue pas l’envie de booker (copy définition)
- [ ] PDF FR propre + note prochaine étape RDV
- [ ] Track `…_rdv_tool` fire au clic
