# [#10] Trop jeune — Spec OUTIL (UX shippable)

**Rôle :** Expert outils numériques  
**Fichier cœur :** `frontend/src/components/campagne/tools/TropJeuneTool.jsx`  
**Shell :** `CampagneToolShell.jsx` · landing `CampagneAdsLanding.jsx` · data `campagneAdsLandings.js`  
**Date :** 2026-11-04  
**Bug #1 live :** defaults futur spoilent (score 33 + 455 000 $ au load)

---

## 0. Promesse produit

Seul outil catalogue qui réfute un **mythe d’âge** via score **présent + futur déjà connu**.  
WOW = le prospect **coche** hypo/famille → score et capital sautent → split Aujourd’hui / Projets → soft close RDV score-aware.  
PDF = artefact secondaire (« apporte en RDV »), pas trophée primaire.

---

## 1. Defaults (anti-spoiler) — P0

### Avant (live 2026-11-04)
```js
age: '28'
soldeMaison: '0'
enfants: '0'
conjointDepend: 'non'
autresDettes: '5000'
revenuMensuel: '4200'
projetHypotheque: 'oui'      // SPOIL
anneesHypotheque: '3'
montantHypothequePrevue: '350000'
projetFamille: 'oui'         // SPOIL
anneesFamille: '5'
// → score ~33, capital 455 000 $
```

### Après
```js
age: '28'                    // OK — contexte narré, hors score
soldeMaison: '0'
enfants: '0'
conjointDepend: 'non'
autresDettes: '5000'         // petit présent réaliste locataire (pts dettes ~1)
revenuMensuel: '4200'        // caché tant que conjoint = non
projetHypotheque: 'non'      // aha au toggle
anneesHypotheque: '3'        // prérempli pour quand Oui
montantHypothequePrevue: '350000'
projetFamille: 'non'
anneesFamille: '5'
// → score ~1 (dettes), capital ~5 000 $
```

**Coach UI** (sous step 2 ou hint YesNo hypo) :  
`Coche tes projets connus — c’est souvent ça qui fait bouger le score.`

**Scénario aha cible :** Non/Non → Oui hypo 350 k$ → score + capital projets dominent → Oui famille → 2e saut.

---

## 2. Climax & hiérarchie chiffres

### Calculs existants (garder formules)
- Présent : maison/400k×25 · enfants · conjoint 20 · dettes/50k×8  
- Futur : hypo pondérée · famille 15/10  
- Capital : maison + dettes + 100 k$/enfants + 24×revenu + hypo prévue + 100 k$ famille prévue

### Nouveaux agrégats (dérivés, pas nouvelles formules)
```js
capitalAujourdhui = maisonActuelle + dettes + capitalEnfants + capitalConjoint
capitalProjets = capitalFutureHypo + capitalFutureFamille
// capital total = somme (déjà)
```

### ResultCard (Lecture)
| Couche | Contenu |
|--------|---------|
| Label | `Montant à viser (illustration)` |
| Value | `formatCad(capital)` |
| Detail **fort** | `Aujourd’hui ~{formatCad(capitalAujourdhui)} · Projets connus ~{formatCad(capitalProjets)}` |
| Breakdown | Grouper : micro-titres `Présent` / `Projets connus` + total |

### Score header
Garder barre + pastilles.  
Renommer contrib `Salaire` → `Proche dépend de toi` (~L242).

---

## 3. Jalons dirty (progress honnête)

### Avant
Steps 1–3 quasi always `done` au load (oui/non déjà set ; score ≥ 0).

### Après
```js
const [touchedPresent, setTouchedPresent] = useState(false)
const [touchedFutur, setTouchedFutur] = useState(false)
// onChange âge/dettes/… → setTouchedPresent(true)
// onChange projetHypo/Famille → setTouchedFutur(true)

milestones = [
  { id: 'present', done: touchedPresent },
  { id: 'futur', done: touchedFutur },
  { id: 'lecture', done: touchedPresent || touchedFutur }, // ou after first meaningful edit
]
```

Alternative S : step futur `done` seulement si user a **changé** hypo ou famille depuis default `non`.

---

## 4. Pont résultat → RDV (PDF secondaire)

### Soft close sous Lecture (~après breakdown, avant fermeture Block 3)
Importer `Link` + `buildCampagneRdvPath` + `trackRendezVousClick`.

```jsx
const rdvPath = buildCampagneRdvPath('trop-jeune-assurance')
// bandeau selon scoreEleve / scoreMoyen (voir script)
<Link
  to={rdvPath}
  onClick={() => trackRendezVousClick('campagne_trop-jeune-assurance_rdv_outil')}
>
  Lire mon score en 15 min
</Link>
```

### Footer shell
| Score | Footer |
|-------|--------|
| ≥ 40 | Texte « Apporte ce résumé en RDV… » + PDF **outline**/secondaire + RDV déjà dans bandeau |
| 15–39 | Idem soft |
| < 15 | PDF primaire (`ToolDownloadPdf`) + lien texte RDV |

Ne pas laisser PDF filled primary comme seul CTA post-climax.

### PDF (`handleDownload`)
- Accents FR : `Âge`, `Hypothèque prévue`, `déjà`, `Résultats`, `présent`, `à viser`  
- Rows résultats : ajouter `Aujourd’hui (illustratif)` + `Projets connus (illustratif)` + total  
- Notes : `Apporte ce PDF — 15 min pour le lire ensemble.` + disclaimer éducatif

---

## 5. Modules / champs à ajouter

| Module | Priorité | Notes |
|--------|----------|-------|
| Split capital + soft close RDV | P0 | Cœur WOW→RDV |
| Defaults non/non + coach | P0 | Anti-spoiler |
| Label contrib + PDF FR + dirty flags | P0/P1 | Confiance |
| Case « couverture déjà en place / collective » (oui/non informatif) | P1 | N’entre **pas** dans le score ; note « on croise en RDV » + lien soft FAQ |
| Sticky score bar mobile | P2 | Confort scroll |

Pas de champ prime / âge dans le score.

---

## 6. Events analytics

| Action | Event |
|--------|-------|
| Focus outil (déjà landing) | `campagne_trop-jeune-assurance_tool` |
| Toggle hypo ou famille → oui (1ère fois) | `select_content` / `item_id: campagne_trop-jeune-assurance_toggle_futur` |
| Soft close RDV outil | `trackRendezVousClick('…_rdv_outil')` |
| PDF | existant `_pdf` |
| Hero scroll outil | `…_hero_outil` (landing) |

---

## 7. Fichiers exacts à toucher

1. `frontend/src/components/campagne/tools/TropJeuneTool.jsx` — defaults L163–167 · capital split · contribs L242 · milestones L221–234 · PDF L252–299 · soft close sous Lecture L500–544 · footer L307–311  
2. `frontend/src/data/campagneAdsLandings.js` — bullets, promise, faq, cta*, trustLine (~L293–327)  
3. `frontend/src/pages/CampagneAdsLanding.jsx` — dual CTA hero · `id="outil"` · mid lit `ctaHeadline`/`ctaSubline` en mode RDV · intro outil copy  
4. `emails/campagne-meta-catalog/trop-jeune-assurance.md` — sync Ad2/Ad3 légère (script)

---

## 8. Critères acceptation outil

- [ ] Load : score bas (~dettes seules), capital ~5 k$, **pas** 455 k$  
- [ ] Toggle hypo Oui → score et capital projets sautent de façon évidente  
- [ ] ResultCard montre Aujourd’hui / Projets / Total  
- [ ] Soft close RDV visible < 2 s après lecture du total (même bloc)  
- [ ] PDF secondaire quand score ≥ 15 ; accents FR ; note « apporte en RDV »  
- [ ] Contrib « Proche dépend de toi » ; jalons pas tous verts au load  
- [ ] Events `_rdv_outil` + toggle futur
)
