# [#06] Maladie grave — Spec OUTIL (UX shippable)

**Slug :** `/campagnes/maladie-grave`  
**Fichier :** `03-expert-outil.md`  
**Date :** 2026-11-04  
**Composant :** `frontend/src/components/campagne/tools/MaladieGraveTool.jsx`  
**Shell :** `CampagneToolShell` · `useCampagneToolPdf` · `formatCad`  
**Landing :** `CampagneAdsLanding.jsx` + `campagneAdsLandings.js` (`maladie-grave`)

**Verdict outil actuel :** **6,5/10** — climax écart amber existe ; next step = PDF. Solo exclu. Ad1 sous-prouvé en UI.

---

## 1. Formule & defaults (garder logique)

```
remplacementConjoint = revenuMensuel × mois        // défaut 3500 × 12 = 42 000
capital = remplacementConjoint + soins + surplus   // + 33 000 + 15 000 = 90 000
ecart = capital − dejaCouvert                      // défaut couvert = 0 → écart 90 000
```

| State | Default | Notes |
|-------|---------|-------|
| `revenuConjoint` | `'3500'` | Masqué / forcé 0 si toggle solo |
| `moisRemplacement` | `'12'` | Options 6 / 12 / 18 / 24 |
| `soinsNonCouverts` | `'33000'` | Const `SOINS_NON_COUVERTS_DEFAUT` + note SCC |
| `qualiteVie` | `'15000'` | |
| `dejaCouvert` | `'0'` | Chip « Je ne sais pas → 0 $ » |
| `pasDeConjoint` *(nouveau)* | `false` | Chip toggle |

**Solo :**
```
si pasDeConjoint → revenu effectif = 0 ; mois UI masquée ou disabled
capital = soins + surplus   // défaut ~48 000
```

---

## 2. Climax WOW (hiérarchie chiffres)

### Ordre de lecture (haut → bas snapshot)
1. Label : `Capital illustratif à viser`
2. **Hero chiffre** : `formatCad(capital)` — `text-3xl/4xl font-heading`
3. **Phrase « ce que ça paie »** (nouveau — remplace L182–184) :
   - Couple : `Ex. : ~{formatCad(remplacementConjoint)} pour {mois} mois côté conjoint, ~{formatCad(soins)} soins hors couverture, ~{formatCad(surplus)} pour respirer.`
   - Solo : `Ex. : ~{formatCad(soins)} soins + ~{formatCad(surplus)} pour respirer — sans bloc conjoint.`
4. Breakdown muted (3 rows ; row conjoint absente si solo)
5. **Bandeau écart** (amber si `ecart > 0`, emerald sinon) — `formatCad(ecart)` = pic émotionnel
6. **CTA RDV primaire** collé sous bandeau (≤ 2 s du climax)
7. PDF ghost

### Copy bandeau
- Garder `detailEcart` actuel (illustration seulement)
- Ajouter sous le détail : bouton RDV (voir script)

---

## 3. Pont résultat → RDV (P0)

### Sous le bandeau écart (`L197–229`)
```jsx
{hasCapital ? (
  <>
    {/* bandeau existant */}
    <Link
      to={rdvPath}
      onClick={() => trackRendezVousClick('campagne_maladie-grave_rdv_tool')}
      className="mt-3 inline-flex w-full ... rounded-full bg-primary ..."
      data-testid="mg-rdv-tool"
    >
      {gapWarn
        ? `Clarifier cet écart en 15 min`
        : `Valider ça en 15 min`}
    </Link>
    <p className="mt-2 text-xs text-prestige-taupe">{/* soft close script */}</p>
  </>
) : null}
```

### Props / imports à ajouter
- `useLocation` + `buildCampagneRdvPath('maladie-grave', location.search)`
- `trackRendezVousClick` depuis `lib/analytics`
- `Link` depuis `react-router-dom`

### Footer shell (`L164–172`)
**Avant :** `statusDetail` PDF-first + `ToolDownloadPdf` seul.  
**Après :**
- `statusDetail` = pont brochure / contrat (script)
- PDF reste accessible mais **secondaire** (ghost ou même rang inférieur au CTA in-snapshot)
- Option : retirer le gros CTA PDF du footer si déjà ghost sous écart — éviter double PDF dominant

---

## 4. Modules / champs à ajouter

### A. Toggle `Pas de conjoint à remplacer` (P0)
- Emplacement : au-dessus de la grille « Tes chiffres », ou chip à côté du titre section
- `onClick` → `setPasDeConjoint(true)` ; `setRevenuConjoint('0')`
- Masquer Fields `mg-revenu-conjoint` + `mg-mois` (ou `disabled` + opacity)
- Intro section adaptée : « Soins hors couverture + surplus pour l’épreuve »
- Breakdown : pas de row conjoint

### B. Chip `Je ne sais pas → 0 $` (P0)
- Sous / à côté Field `mg-couvert`
- `setDejaCouvert('0')`
- Hint actif : pont brochure RDV (script)

### C. Mini contraste 2 cols (P0 — dans tool si shell pas prêt)
- Au-dessus des champs **ou** sous intro `CampagneToolShell`
- Remplace paragraphe taupe L310–313
- Contenu : voir visuel + script

### D. Ancre `#outil` (P0 shell/landing)
- Wrapper tool dans `CampagneAdsLanding.jsx` : `id="outil"` + `scroll-mt-24`
- Hero CTA primaire : `document.getElementById('outil')?.scrollIntoView({ behavior: 'smooth' })`

---

## 5. Events analytics

| Event | item_id / params | Quand |
|-------|------------------|-------|
| existant | `campagne_maladie-grave_tool` | focus outil (landing) |
| existant | `campagne_maladie-grave_pdf` | download PDF |
| existant | `campagne_maladie-grave_rdv` | hero RDV |
| existant | `campagne_maladie-grave_rdv_mid` | mid navy |
| **nouveau** | `campagne_maladie-grave_rdv_tool` | CTA sous écart |
| optionnel | `campagne_maladie-grave_solo_toggle` | chip pas de conjoint |
| optionnel | `campagne_maladie-grave_couvert_unknown` | chip 0 $ |

**Proxy succès :** `rdv_tool` / `rdv` (hero) ≥ 1 ; ↓ sessions PDF-only sans RDV.

---

## 6. Fichiers exacts à toucher

| Fichier | Quoi |
|---------|------|
| `frontend/src/components/campagne/tools/MaladieGraveTool.jsx` | CTA RDV, phrase 3 blocs, toggle solo, chip 0 $, contraste 2 cols, PDF accents, statusDetail, motion chiffres |
| `frontend/src/pages/CampagneAdsLanding.jsx` | `#outil` ; dual CTA hero ; mid lit `ctaHeadline`/`ctaSubline` si `!isFormCta` ; copy « À toi de jouer » |
| `frontend/src/data/campagneAdsLandings.js` | promise, bullets, faq +2, `ctaHeadline`, `ctaSubline`, seoDescription |
| `emails/campagne-meta-catalog/maladie-grave.md` | Ad1–Ad3 resserrés (script) |

**Pas toucher :** formule capital (sauf solo = revenu 0) ; const SCC ; `CampagneToolShell` API sauf besoin footer flex.

---

## 7. États UX à couvrir (QA)

| Scénario | Attendu |
|----------|---------|
| Mount défaut couple | Capital 90 000 $ · écart 90 000 $ amber · CTA RDV visible |
| Solo chip | Capital ~48 000 $ · pas de row conjoint · copy adaptée |
| `dejaCouvert = 50000` | Écart 40 000 $ · CTA « Clarifier cet écart… » |
| `dejaCouvert ≥ capital` | Emerald · CTA « Valider ça en 15 min » |
| Chip « Je ne sais pas » | Remet 0 $ · hint brochure |
| PDF download | Accents OK · notes conformité |
| Reduced motion | Pas d’anim obligatoire |

---

## 8. Critères acceptation OUTIL
- [ ] CTA RDV in-tool sous écart avec `…_rdv_tool`
- [ ] PDF n’est plus le next step dominant
- [ ] Solo inclus (toggle) sans framing couple obligatoire
- [ ] Phrase « ce que ça paie » déplie les 3 blocs en $
- [ ] Contraste Invalidité ≠ MG visible dans l’UI outil (ou landing immédiatement adjacente)
- [ ] Defaults gardent l’aha ~90 k$ sans claim « tu recevras »
