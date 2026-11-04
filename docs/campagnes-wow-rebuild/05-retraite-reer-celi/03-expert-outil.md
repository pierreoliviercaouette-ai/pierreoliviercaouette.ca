# [#05] Expert outils numériques — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Date :** 2026-11-04  
**Fichier principal :** `frontend/src/components/campagne/tools/RetraiteReerCeliTool.jsx`  
**Landing :** `frontend/src/pages/CampagneAdsLanding.jsx` · data `frontend/src/data/campagneAdsLandings.js`  
**Objectif :** climax $ impossible à manquer → CTA RDV <2 s → PDF secondaire.

---

## 1. État actuel (constat code)

| Zone | Lignes approx. | Problème |
|------|----------------|----------|
| `buildSuggestion` mixte | L123–134 | `tone: 'warn'` → ambre + triangle au load (defaults moyenne/moyen/non/500) |
| Defaults | L275–278 | Path majoritaire = mixte warn (anti-WOW) |
| Snapshot | L382–400 | XXL = `suggestion.short` (« Mixte »), $ en `text-xs` |
| ResultCard | L214–238 | Pas de tone `nuance` ; warn = `AlertTriangle` |
| Footer | L370–378 | PDF only ; texte « 15 min » sans lien Bookings |
| PDF | L309–362 | Accents manquants (`Resume`, `reponses`, `liquidite`…) |
| Matching | — | Absent (objection #1 persona 35–55) |
| Analytics RDV tool | — | Inexistant (`campagne_retraite-reer-celi_rdv_tool`) |

---

## 2. Spec UX shippable

### 2.1 Defaults (garder — changer le tone)
Conserver :
- `tranche: 'moyenne'`
- `horizon: 'moyen'`
- `liquidite: 'non'`
- `cotisationMensuelle: '500'`
- **Nouveau :** `matching: 'je_sais_pas'` (neutre, n’altère pas le split)

Règles `buildSuggestion` liquidité/horizon/tranche : **inchangées** pour le split %.  
Seul changement tone mixte : `'warn'` → `'nuance'`.

### 2.2 Climax WOW (hiérarchie)

```
Si key === 'mixte' && monthly > 0:
  Snapshot dominant = `${formatCad(celiAmt)} / ${formatCad(reerAmt)}`
  Sous-ligne = « Mixte illustratif — CELI / REER »
  SplitBar secondaire
Sinon si key celi|reer:
  Snapshot dominant = suggestion.short
  value longue à droite
Sinon (mixte, monthly 0):
  Snapshot = leanLabel / short « Mixte »
```

Block 2 ResultCards :
- Mixte : card **Partage** `sm:col-span-2` en premier (chiffres $), card Ordre en `tone="nuance"` sans icon warn.
- CELI/REER : garder grille 2 cols, `tone="ok"`.

### 2.3 Tone `nuance`
Dans `ResultCard` :
```js
tone === 'warn'   → ambre + AlertTriangle   // réserver vrais flags futurs
tone === 'ok'     → emerald + Check
tone === 'nuance' → primary/secondary gradient (actuel default) — pas d’icône alerte
default           → idem nuance
```
`isClear = suggestion.tone === 'ok'` reste valide ; mixte n’est plus « pas clear » émotionnellement — ajuster bullets dots : primary aussi pour nuance.

### 2.4 Champ matching employeur
```js
const MATCHING_OPTIONS = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'je_sais_pas', label: 'Je sais pas' },
];
```
- Placement : Block 1, après liquidité, avant cotisation.
- `columns={3}` → sur mobile 1 col (ChoiceGroup déjà OK).
- Si `matching === 'oui'` : prepend raison éducative (script) ; **ne pas** forcer split 100 % REER.
- Soft pont : footer / raisons mentionnent « quantifier le match en 15 min ».
- PDF row : `Matching employeur` → label option.

### 2.5 Pont résultat → RDV (PDF secondaire)

Footer `CampagneToolShell` :

```jsx
<footer stack>
  <p>{statusDetailByKey}</p>  // script §2
  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
    <Link
      to={buildCampagneRdvPath('retraite-reer-celi', location.search)}
      onClick={() => trackRendezVousClick('campagne_retraite-reer-celi_rdv_tool')}
      className="… primary full-width mobile"
      data-testid="campagne-retraite-rdv-tool"
    >
      Réserver 15 min avec mon résumé
    </Link>
    <ToolDownloadPdf variant="outline" … label="Télécharger mon résumé PDF" />
  </div>
  <p className="text-xs">Prioriseur sans compte · PDF gratuit · 15 min soft</p>
</footer>
```

Imports à ajouter :
- `Link` + `useLocation` (react-router-dom)
- `buildCampagneRdvPath` depuis `../../../data/campagneAdsLandings`
- `trackRendezVousClick` (+ éventuellement `trackEvent`) depuis `../../../lib/analytics`

### 2.6 Soft close post-PDF
Dans `handleDownload` / après resolve de `downloadPdf` :
- Option A : `trackEvent('select_content', { item_id: 'campagne_retraite-reer-celi_pdf_done' })` + setState `pdfReady: true` → bandeau sous footer avec Link RDV.
- Option B (S) : changer `statusDetail` localement en « PDF prêt — 15 min pour le coller à ton dossier ? ».

### 2.7 PDF — accents + matching
Corriger strings :
- Titre : `Résumé — REER ou CELI en premier`
- `Tes réponses` · `Besoin de liquidité` · `Ordre suggéré` · `Répartition illustrative`
- Notes : `Illustration éducative seulement — pas un conseil personnalisé.` · accents sur `déjà`
- Ajouter row matching

---

## 3. Landing / shell (hors outil)

| Changement | Fichier | Détail |
|------------|---------|--------|
| `id="outil"` sur wrapper Tool | `CampagneAdsLanding.jsx` ~L118 | Deep-link hero |
| Dual CTA hero | même | Primaire scroll `#outil` ; secondaire RDV — data `heroCtaPrimary: 'outil'` |
| Mid CTA data-driven | L181–187 | Utiliser `item.ctaHeadline` / `item.ctaSubline` (comme branche form) |
| Data slug | `campagneAdsLandings.js` L75–105 | promise, bullets, faq×4, ctaHeadline/Subline, apprendreLabel, optionnel `apprendrePathSecondary: '/apprendre/celi'` |
| Intro outil copy | L127–135 | Eyebrow / sous-ligne script |

---

## 4. Analytics events

| Event | Trigger | `item_id` / id |
|-------|---------|----------------|
| `view_item` | déjà | `campagne_retraite-reer-celi` |
| `select_content` tool focus | déjà | `campagne_retraite-reer-celi_tool` |
| `trackRendezVousClick` | hero RDV | `campagne_retraite-reer-celi_rdv` |
| `trackRendezVousClick` | mid | `campagne_retraite-reer-celi_rdv_mid` |
| **Nouveau** `trackRendezVousClick` | footer outil | `campagne_retraite-reer-celi_rdv_tool` |
| **Nouveau** `select_content` | click `#outil` hero | `campagne_retraite-reer-celi_outil_cta` |
| PDF | déjà hook | `campagne_retraite-reer-celi_pdf` |
| **Nouveau** optionnel | PDF done → RDV shown | `campagne_retraite-reer-celi_pdf_done` |

Pas d’event PII. UTM conservés via `buildCampagneRdvPath(slug, location.search)`.

---

## 5. Fichiers exacts à toucher

### P0 (campagne #05)
1. `frontend/src/components/campagne/tools/RetraiteReerCeliTool.jsx`
   - tone mixte → nuance
   - snapshot $ dominant
   - matching field + raison
   - footer dual CTA + analytics
   - PDF accents + row matching
   - ResultCard support `nuance`
2. `frontend/src/data/campagneAdsLandings.js` (bloc `retraite-reer-celi`)
   - promise, bullets, faq, ctaHeadline, ctaSubline, apprendreLabel

### P0/P1 (shell — partagé catalogue)
3. `frontend/src/pages/CampagneAdsLanding.jsx`
   - mid `ctaHeadline`/`ctaSubline`
   - `id="outil"`
   - dual hero CTA si flag data
4. `frontend/src/components/campagne/CampagneToolShell.jsx`
   - `ToolDownloadPdf` prop `variant?: 'primary' | 'outline'`

### Tests
5. S’il existe des tests outil campagne : étendre asserts tone / présence lien RDV  
   Sinon : smoke manuel checklist §7

---

## 6. Pseudo-flux résultat → booker

```
Load → mixte nuance + 250$/250$ (pas warn)
  → user ajuste / voit raisons (+ matching si Oui)
  → footer : RDV primary + PDF outline
  → click RDV → /rendez-vous/campagne?utm_…&utm_content=…
  → (alt) PDF → bandeau « PDF prêt — 15 min ? » → même RDV
```

---

## 7. Critères acceptation outil

- [ ] Au load : `tone !== 'warn'` ; pas d’`AlertTriangle`  
- [ ] Au load avec 500 $ : snapshot montre dollars CELI/REER en plus gros que le mot « Mixte »  
- [ ] Footer contient un lien Bookings tracké `…_rdv_tool`  
- [ ] PDF outline moins dominant que RDV (classes)  
- [ ] Matching Oui ajoute une raison + ligne PDF  
- [ ] `liquidite === 'oui'` → toujours CELI `ok` (régression)  
- [ ] `tranche elevee` + `horizon long` → REER `ok` (régression)  
- [ ] Disclaimer éducatif visible sous l’outil  
