# [#07] REEE — Expert outils numériques

**Slug :** `/campagnes/reee`  
**Fichier cœur :** `frontend/src/components/campagne/tools/ReeeTool.jsx`  
**Shell :** `CampagneToolShell` · landing `CampagneAdsLanding.jsx` · data `campagneAdsLandings.js`  
**Date :** 2026-11-04  
**Focus WOW :** `laisseSurTable` + SCEE → pont RDV (PDF secondaire)

---

## 1. Verdict UX outil

Outil déjà solide (barre plafond, presets, projection SCEE, `laisseSurTable` calculé). Le WOW est **calculé mais mal narré** : headline = total études confortable ; regret = 3e cellule + status PDF-first. Persona « compte ouvert » n’a pas de champ SCEE déjà reçues. Cotisation annuelle only. Pont booker cassé.

**Note WOW /10 :** 7 → **cible :** 9 (climax impossible à manquer + CTA RDV &lt; 2 s)

---

## 2. Defaults (garder — bons pour aha plafond)

| Champ | Valeur | Pourquoi |
|-------|--------|----------|
| Âge | `5` | → 12 ans horizon |
| Cotisation | `2500` | max SCEE annuel immédiat |
| Années | `12` | AGE_ETUDES − 5 |
| Rendement | off | total = cotisé + SCEE (lisible) |

**Résultat defaults :** totalSubventions 6 000 / 7 200 (83 %), `laisseSurTable` = **1 200 $**, total illustratif 36 000 $ sans rendement.

**Attention :** spoile un peu le regret *annuel* (`sousMaxAnnuel` false). Le parent « 80–150 $/mois » doit taper preset **1 000 $** pour vivre Ad2 annuel — d’où callout bold + event analytics.

---

## 3. Climax WOW — hiérarchie chiffres

### Priorité visuelle / narrative (quand `laisseSurTable > 0`)
1. **`laisseSurTable`** — bandeau dominant (« Encore possibles »)  
2. Total subventions vs plafond (barre)  
3. `totalIllustratif` — secondary  
4. Cotisé / SCEE reçues — grille support

### Quand `plafondAtteint`
1. Headline max (amber)  
2. Total  
3. Soft-close « valider cadre / autres enfants »

### Headline `buildLecture` — Avant → Après
| Avant | Après |
|-------|-------|
| `Environ {totalIllustratif} pour les études` | Si `laisseSurTable > 0` : `Il resterait encore ~{laisseSurTable} avant le max` **ou** garder total en gros chiffre mais **sous-titre dominant** = encore X $ |
| Points listent laisseSurTable en 3e bullet | Bullet 1 = laisseSurTable ; total en support |

**Recommandation ship :**  
- Garder gros chiffre total pour rassurer  
- **Ajouter** bandeau full-width `laisseSurTable` immédiatement sous le total (voir visuel)  
- `statusDetail` + footer CTA branchés sur X $

---

## 4. Soft-close résultat → RDV (P0)

### Remplacer footer actuel (~L314–322)

```jsx
// Pseudo-spec
footer={
  <>
    {laisseSurTable > 0 || result.plafondAtteint ? (
      <div className="… soft-close card …">
        <p>{/* status chiffré — script §5 */}</p>
        <Link
          to={buildCampagneRdvPath('reee')}
          onClick={() => trackRendezVousClick('campagne_reee_rdv_outil')}
        >
          Relier ça à mon budget — 15 min
        </Link>
        <ToolDownloadPdf … label="Télécharger mon résumé PDF" variant="outline" />
      </div>
    ) : (
      <p>{/* aide incomplete */}</p>
    )}
  </>
}
```

### `statusDetail` (~L232–239)
| État | Après |
|------|-------|
| incomplete | Entre l’âge et combien tu mets… |
| `laisseSurTable > 0` | `Il resterait encore ~X $ avant le max à vie. 15 min pour caler âge, budget, déjà en place — zéro pression.` |
| plafond | Max atteint… 15 min pour valider le cadre… |
| else | Prêt — PDF ou 15 min |

**Règle :** PDF never primary quand climax regret est vivant.

---

## 5. Modules / champs à ajouter

### P0 — Callout `sousMaxAnnuel`
- Fichier : carte SCEE/an ~L456–474 + `buildLecture` ~L133–138  
- Afficher écart annuel `SCEE_MAX_ANNUEL − sceeParAn` et projection `× years`  
- Highlight preset `2500`

### P0 — Soft-close + event climax
- Event `select_content` : `campagne_reee_laisse_sur_table`  
- Params : `value: laisseSurTable` (number), une fois par session quand `laisseSurTable > 0` et milestones lecture done  
- Helper : `trackEvent` depuis `lib/analytics`

### P1 — Champ `sceeDejaRecues` (0–7200)
```
state: sceeDejaRecues = '0'
projeterReee(cotisation, years, rate, sceeDeja = 0)
  totalSubventions starts at sceeDeja
  room = max(0, PLAFOND − totalSubventions) each year
laisseSurTable = max(0, PLAFOND − final totalSubventions)
```
- UI : Field Block 2 ou Block 1 bis « Déjà en place »  
- Headline seed : `Avec ce que t’as déjà, il resterait encore ~X $`  
- PDF section « Tes entrées » + row SCEE déjà reçues  
- **Ne pas** inventer IQEE déjà reçue en P1 (finance)

### P1 — Toggle $/mois ↔ $/an
- State `modeCotisation: 'an' | 'mois'`  
- Affichage input selon mode ; internal always annual = mois × 12  
- Helper visible : `200 $/mois = 2 400 $/an`  
- Presets : adapter labels (`~83 $/mois` ≈ 1 000, `~208 $/mois` ≈ 2 500) **ou** presets annuels + conversion affichée

### P2 — Ligne IQEE illustration séparée
- **Hors** `totalIllustratif` principal  
- Métrique disclaimerée : `IQEE base ~10 % (max ~250 $/an, plafond vie ~3 600 $) — illustration séparée`  
- Voir finance avant d’activer le calcul dans l’UI campagne (éviter double-count / confusion relevé)

### P2 — Multi-enfants
- Ads mentionnent « autres enfants » → RDV only en P0/P1  
- Teaser soft-close : `D’autres enfants ? On le regarde en 15 min.`  
- Pas de nb enfants dans outil campagne tant que SCEE lifetime per child n’est pas clair UX

---

## 6. `projeterReee` — contrat

```js
// Actuel
projeterReee(cotisationAnnuelle, annees, tauxRendement = 0)

// Cible P1
projeterReee(cotisationAnnuelle, annees, tauxRendement = 0, sceeDejaRecues = 0)
→ {
  totalCotise,
  totalSubventions,      // inclut seed + grants
  totalIllustratif,
  plafondAtteint,
  years,
  laisseSurTable,        // exposer ici pour éviter double calc
  sceeParAn,             // optionnel move
}
```

Constants (inchangées sauf validation finance) :
- `SCEE_TAUX = 0.2`
- `SCEE_BASE_ANNUELLE = 2500`
- `SCEE_MAX_ANNUEL = 500`
- `SCEE_PLAFOND_VIE = 7200`
- `AGE_ETUDES = 17`
- `RENDEMENT_OPTIONNEL = 0.04`

---

## 7. Analytics

| Event | Quand | item_id / value |
|-------|-------|-----------------|
| `select_content` tool focus | déjà landing | `campagne_reee_tool` |
| **NEW** climax | première fois `laisseSurTable > 0` + lecture ready | `campagne_reee_laisse_sur_table`, value = $ |
| **NEW** sous-max | user sélectionne preset &lt; 2500 ou callout view | `campagne_reee_sous_max_annuel` |
| RDV outil | click soft-close | `trackRendezVousClick('campagne_reee_rdv_outil')` |
| RDV mid | existant | `campagne_reee_rdv_mid` |
| RDV hero secondary | dual CTA | `campagne_reee_rdv` (existant) |
| PDF | existant hook | `campagne_reee_pdf` |

---

## 8. PDF

- Accents FR : `Résumé`, `Âge`, `année`, `À retenir` (finir ASCII)
- Rows : ajouter SCEE déjà reçues ; Encore possibles en **gras** / premier row Projection si possible
- Notes : rappeler SCEE only + IQEE à revalider
- CTA émotionnel reste hors PDF (RDV sur page)

---

## 9. Fichiers exacts à toucher

| Fichier | Quoi |
|---------|------|
| `frontend/src/components/campagne/tools/ReeeTool.jsx` | Climax UI, soft-close, callout, toggle, sceeDeja, events, PDF |
| `frontend/src/data/campagneAdsLandings.js` | Copy reee + `ctaHeadline`/`ctaSubline` + FAQ + dual CTA labels |
| `frontend/src/pages/CampagneAdsLanding.jsx` | Dual CTA hero ; mid data-driven ; `id="outil"` ; confidence line si prop |
| `frontend/src/lib/analytics.js` | Seulement si helper dédié (sinon `trackEvent` inline) |
| `emails/campagne-meta-catalog/reee.md` | Titres ads micro-align |

**Tests :** étendre / ajouter test projection si existant ; scénarios : defaults 1200 laisse ; preset 1000 sous-max ; sceeDeja 3000 → room réduit.

---

## 10. Critères acceptation outil

- [ ] Sur defaults, bandeau/CTA cite **~1 200 $** avant PDF  
- [ ] Click « Relier ça… » → `buildCampagneRdvPath('reee')` + event `_rdv_outil`  
- [ ] Preset 1 000 $ → callout écart annuel visible (pas taupe discret)  
- [ ] Event `laisse_sur_table` fire 1× avec value  
- [ ] PDF secondary ; À retenir ne bloque plus le CTA sur mobile
