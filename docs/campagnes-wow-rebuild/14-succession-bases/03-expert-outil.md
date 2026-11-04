# [#14] Succession — bases — Expert outils numériques

**Slug :** `/campagnes/succession-bases`  
**Fichier principal :** `frontend/src/components/campagne/tools/SuccessionChecklistTool.jsx`  
**Shell / landing :** `CampagneAdsLanding.jsx`, `CampagneToolShell.jsx`, `campagneAdsLandings.js`  
**Date :** 2026-11-04  
**Note WOW outil actuelle /10 :** 6 → cible **8,5** avec pont RDV

---

## 1. Job de l’outil (1 phrase)

Faire vivre l’aha « liquidité ≠ actifs » via 6 coches honnêtes, révéler *mes* trous seulement après interaction, puis offrir en &lt;2 s un pont CSF 15 min (vs notaire pour le testament) — PDF en secondaire.

---

## 2. Defaults & première impression (&lt;10 s)

| État | Spec |
|------|------|
| Cases | Toutes **décochées** (garder `INITIAL_CHECKED` false) — honnêteté Ad3 |
| Portrait à `count === 0` | **Pas** de grille Trous warn. Afficher 1 carte ou bandeau invite : « Commence par la liquidité… » |
| Progress | `0 / 6` + barre 0 % — OK |
| PDF | **Un seul** bouton, footer shell — retirer le `ToolDownloadPdf` sous le titre portrait (~L290–296) |
| Ordre mobile | Cases **avant** portrait (`flex-col-reverse` md:normal **ou** portrait rendu seulement si `count ≥ 1`) |

---

## 3. Climax WOW

**Trigger :** `count >= 1` (première coche) → reveal grille :
- État (`etatValue` / tone)
- **Trous prioritaires** (shorts manquants, tone warn)
- Prochaine étape (branchée — §5)
- Piliers 1·Argent / 2·Qui reçoit / 3·Qui sait

**Narration Ad2 live :** si `nextItem?.id === 'liquidites'`, ligne sous progress ou sous carte Trous :
> Argent accessible ≠ maison sur papier — souvent le 1er vrai trou.

**Hiérarchie chiffres :** `missingCount` doit dominer (déjà via carte Trous) — ne pas noyer avec double PDF.

---

## 4. Pont résultat → RDV (cœur ship)

### Quand afficher
- Soft-close RDV si `missingCount >= 1`
- Variante « valider » si `missingCount === 0` (après parcours complet)

### UI (footer `CampagneToolShell` ou sous grille portrait)
```
[ Texte soft close script ]
[ CTA primaire Link RDV ]  [ ToolDownloadPdf outline ]
```

### Wiring
```js
import { Link, useLocation } from 'react-router-dom';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackRendezVousClick } from '../../../lib/analytics';

const location = useLocation();
const rdvPath = buildCampagneRdvPath('succession-bases', location.search);

// onClick CTA :
trackRendezVousClick('campagne_succession-bases_rdv_tool');
```

### Labels CTA
- Trous : `Réserver 15 minutes` (ou `{N} trous · 15 min` si place)
- Complet : `Valider ma base en 15 min`

PDF label inchangé : `Télécharger mon résumé PDF` — **jamais** seul next step émotionnel.

---

## 5. Next-step branché (remplace `PDF + notaire`)

Remplacer ~L179–182 et PDF row ~L216–218.

| `nextItem.id` | `nextValue` | `nextDetail` | Soft close angle |
|---------------|-------------|--------------|------------------|
| `liquidites` | Liquidité | Argent accessible les premiers mois — souvent le 1er vrai trou. | CSF 15 min |
| `dettes-hypotheque` | Revenu / dettes | Plan si le revenu disparaît (dettes, hypo). | CSF 15 min |
| `beneficiaires` | Bénéficiaires | Polices, REER, CELI à jour — qui reçoit vraiment. | CSF 15 min |
| `testament` | Testament · notaire | Cadre légal chez le notaire ; 15 min pour préparer la conversation. | Notaire + prep CSF |
| `inventaire` | Inventaire | Liste simple maison / comptes / accès. | CSF priorisation |
| `discussion` | Famille informée | Qui fait quoi — moins d’improvisation. | CSF priorisation |
| `null` (complet) | Valider · notaire | PDF à jour + notaire pour le légal ; option 15 min CSF pour valider liquidité / bénéficiaires. | CSF valider |

### `statusDetail` (ajuster ~L80–95)
- `count >= 5` : ne plus pousser « télécharge ton résumé » comme seul next — mentionner validation 15 min **et** notaire.
- Ex. : `Bonne base. Tu peux valider liquidité & bénéficiaires en 15 min ; un notaire reste essentiel pour le cadre légal.`

---

## 6. Portrait froid → reveal (implémentation)

**Fichier :** `SuccessionChecklistTool.jsx` ~L155–177, ~L280–337

```text
si count === 0:
  - afficher InviteCard (1 ligne) à la place de la grille 3 ResultCard
  - piliers optionnels grisés 0/2 ou masqués
sinon:
  - grille ResultCard actuelle + piliers
  - className transition opacity/translate
```

`trousValue` / tone warn **uniquement** dans la branche `count >= 1`.

---

## 7. PDF — polish

| Avant | Après |
|-------|-------|
| title `Resume — si tu manques` | `Résumé — si tu manques` |
| `A faire` | `À faire` |
| `Points clarifies` | `Points clarifiés` |
| `liquidite` / `clarte` / `etape` / `coches` | accents FR complets |
| `Prochaine etape` value `PDF + notaire` | même logique branchée que UI |
| notes ASCII | `points cochés` ; disclaimer notaire inchangé |
| 2 boutons PDF | 1 bouton footer |

`useCampagneToolPdf('campagne_succession-bases_pdf')` — garder.

---

## 8. Events analytics

| Event | Quand | ID |
|-------|-------|-----|
| `select_content` tool | focus outil (existant landing) | `campagne_succession-bases_tool` |
| `trackRendezVousClick` | clic CTA soft-close outil | `campagne_succession-bases_rdv_tool` **NEW** |
| PDF | download | `campagne_succession-bases_pdf` |
| Optionnel | première coche (`count` 0→1) | `campagne_succession-bases_tool_first_check` |
| Optionnel | reveal trous | `campagne_succession-bases_tool_gaps_reveal` |

---

## 9. Champs / modules à **ne pas** ajouter (scope)

- Pas de calculateur « mois de liquidité » chiffré (P2 éventuel — hors sprint WOW→RDV).
- Pas de capture email obligatoire pour PDF.
- Pas de remplacement du disclaimer Scale / notaire.
- Pas d’items checklist au-delà des 6 (alignement ads 1:1 = force).

---

## 10. Fichiers exacts à toucher

| Fichier | Changements |
|---------|-------------|
| `SuccessionChecklistTool.jsx` | invite ; reveal ; soft-close RDV ; next-step branché ; 1 PDF ; accents FR ; microcopy Ad2 ; events |
| `CampagneAdsLanding.jsx` | `id="outil"` ; dual CTA hero (shell ≤2) ; mid `ctaHeadline`/`ctaSubline` si props |
| `campagneAdsLandings.js` | title, promise, bullets, faq×5, ctaHeadline, ctaSubline |
| `CampagneToolShell.jsx` | seulement si slot footer RDV générique Sprint 1 — sinon inline dans l’outil |

---

## 11. Critères acceptation outil

- [ ] À l’ouverture : **aucun** Trous warn ambre
- [ ] Après ≥1 coche : grille Trous visible + motion reveal
- [ ] Si `missingCount ≥ 1` : CTA RDV visible sans scroll hors footer outil ; event `…_rdv_tool`
- [ ] Next-step ≠ `PDF + notaire` quand trou = liquidités / bénéficiaires
- [ ] Un seul bouton PDF ; accents FR dans le fichier généré
- [ ] Disclaimer notaire toujours visible (Scale block + shell disclaimer)
