# [#10] Trop jeune — Spec OUTIL climax P1 (Vague 2)

**Slug :** `/campagnes/trop-jeune-assurance`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/TropJeuneTool.jsx`  
**Shell :** `CampagneToolShell.jsx` · `ToolSoftClose` · `CampagneAdsLanding.jsx` · `campagneAdsLandings.js`  
**Interdits :** re-spec SoftClose RDV/PDF · dual CTA hero · defaults (déjà `non`/`non`)

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 7,5 | 8,5 |
| WOW outil | 6 | 7,5 | 9 |
| Env. booker | 4 | 7,5 | 8 |

**Top 1 gap WOW outil :** split capital existe en **sous-ligne muted** (`detail` ResultCard) — pas encore **dual capital XXL** (2 chiffres hero côte à côte). SoftClose déjà sous Lecture ✓.

---

## 0. État P0 (fait — ne pas re-ship)

- Defaults `projetHypotheque/Famille = 'non'` + coach step 2  
- `capitalAujourdhui` / `capitalProjets` / total  
- ResultCard detail string + BreakdownGroup Présent/Projets  
- `ToolSoftClose` sous Lecture (scoreMoyen) / variante légère score bas  
- Contrib `Proche dépend de toi` · PDF FR · `_rdv_outil` · toggle futur  

---

## 1. Climax P1 — Dual capital XXL

### Avant (~L586–590)
```jsx
<ResultCard
  label="Montant à viser (illustration)"
  value={formatCad(capital)}
  detail={`Aujourd’hui ~${formatCad(capitalAujourdhui)} · Projets connus ~${formatCad(capitalProjets)}`}
  tone={tone}
/>
```

### Après
```jsx
{/* Dual XXL — climax Ad2 */}
<div
  className="grid gap-3 sm:grid-cols-2"
  key={aDuFutur ? 'futur-on' : 'futur-off'}
  data-testid="trop-jeune-dual-capital"
>
  <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] to-white px-4 py-3.5">
    <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">Aujourd’hui</p>
    <p className="font-heading mt-1.5 text-3xl font-bold tabular-nums text-dark md:text-4xl">
      {formatCad(capitalAujourdhui)}
    </p>
  </div>
  <div className={`rounded-2xl border px-4 py-3.5 ${
    capitalProjets > capitalAujourdhui
      ? 'border-secondary/30 bg-gradient-to-br from-secondary/[0.08] to-white'
      : 'border-primary/15 bg-gradient-to-br from-primary/[0.04] to-white'
  }`}>
    <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">Projets connus</p>
    <p className={`font-heading mt-1.5 text-3xl font-bold tabular-nums md:text-4xl ${
      capitalProjets > capitalAujourdhui ? 'text-secondary' : 'text-dark'
    }`}>
      {formatCad(capitalProjets)}
    </p>
    {capitalProjets > capitalAujourdhui ? (
      <p className="mt-1.5 text-xs text-prestige-taupe">C’est souvent ici que le mythe tombe.</p>
    ) : null}
  </div>
</div>

{/* Total secondaire — plus le seul hero */}
<p className="mt-3 text-center">
  <span className="text-xs uppercase tracking-wide text-prestige-taupe">Total illustratif</span>
  <span className="font-heading mt-0.5 block text-xl font-semibold tabular-nums text-dark md:text-2xl">
    {formatCad(capital)}
  </span>
</p>

{/* Breakdown groups — garder */}
{/* ToolSoftClose — garder placement sous dual */}
```

### Formules
**Aucune nouvelle formule.** Réutiliser `capitalAujourdhui`, `capitalProjets`, `capital` existants.

### Hiérarchie chiffres (ordre lecture)

1. Score header (déjà)  
2. **Dual XXL** Aujourd’hui | Projets  
3. Total illustratif (downgraded)  
4. Breakdown Présent / Projets  
5. `ToolSoftClose` (placement OK — ne pas bouger)

---

## 2. Motion in-tool

| Motion | Trigger | Impl |
|--------|---------|------|
| Keyed dual reveal | 1er `aDuFutur` true | `key` + classe fade shell (`animate-in` / opacity transition 300 ms) |
| Barre segments | déjà `transition-all duration-500` | garder ; option `data-reveal` si helper catalogue |
| SoftClose fade | mount scoreMoyen | helper shell V2-S5 — pas custom |

---

## 3. SoftClose placement

**Déjà sous climax** (Lecture, après breakdown).  
Action V2 : s’assurer qu’il reste **immédiatement sous** dual+breakdown (pas footer-only). Pas de bandeau custom — `ToolSoftClose` uniquement.

Option P2 : slot portrait 48px au-dessus du SoftClose outil si le shell mid ne suffit pas — **même** `/seo/portrait.jpg` + libellé CSF.

---

## 4. Champs / modules optionnels (pas cœur climax)

| Module | Priorité | Note |
|--------|----------|------|
| Case « collective déjà en place » (hors score) | P2 | Informatif ; note « on croise en RDV » |
| Sticky score mobile | P2 | Confort |
| Jalons dirty plus stricts | P2 | Nice-to-have post-P0 |

---

## 5. Events analytics

| Action | Event |
|--------|-------|
| Existants | `_tool`, `_toggle_futur`, `_rdv_outil`, `_pdf` |
| Nouveau | `select_content` / `item_id: campagne_trop-jeune-assurance_dual_reveal` — 1× quand `aDuFutur` passe à true |
| Hero / mid | inchangés (shell) |

---

## 6. Fichiers exacts à toucher

1. **`TropJeuneTool.jsx`** — remplacer ResultCard unique par dual XXL + total secondaire (~L586–637) ; motion key ; event dual_reveal  
2. **`campagneAdsLandings.js`** — `atmosphere: 'score'`, `heroExtras`, `processSteps` (data)  
3. **`CampagneAdsLanding.jsx` / `PageHero.jsx`** — **shell** : props atmosphere, heroExtras, processSteps, portrait mid (dépendance catalogue, pas if-slug)  
4. **`CampagneToolShell.jsx`** — seulement si slot portrait SoftClose partagé

Pas de SoftClose one-off.

---

## Spec Avant → Après

| Zone | Avant (post-P0) | Après (Vague 2) | Fichiers |
|------|-----------------|-----------------|----------|
| Climax $ | 1× ResultCard + detail | Dual XXL + total sec. | `TropJeuneTool.jsx` |
| Accent projets | muted | Colonne secondary si > aujourd’hui | idem |
| SoftClose | Sous Lecture | Rester collé sous dual | idem |
| Motion | Barre | + keyed dual fade | tool + shell helper |
| Analytics | toggle futur | + `dual_reveal` | tool |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| O-1 | Dual capital XXL UI | M | **P1** (climax catalogue) |
| O-2 | Hint + accent projets > aujourd’hui | S | P1 |
| O-3 | Keyed fade + event `dual_reveal` | S | P1 |
| O-4 | Data atmosphere / extras / process | S | P0-v2 |
| O-5 | Case collective informative | M | P2 |

---

## Critères acceptation outil

- [ ] Load : score bas, dual montre Aujourd’hui ~5 k$ · Projets ~0 $  
- [ ] Toggle hypo → colonne Projets XXL saute (visible sans lire le breakdown)  
- [ ] Typo `font-heading` text-3xl/4xl (contrat catalogue)  
- [ ] SoftClose = `ToolSoftClose` sous dual  
- [ ] Aucune nouvelle formule / aucun module prime
