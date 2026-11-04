# [#03] Expert outils numériques — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie` (+ aliases `assurance-hypothecaire`, etc.)  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Composant :** `frontend/src/components/campagne/tools/AssuranceHypothecaireTool.jsx`  
**Alias :** `HypothequeVieTool.jsx` (re-export — ne pas dual-maintenir)  
**Périmètre V2 :** **climax P1** — hiérarchie chiffres / motion in-tool. **Interdit** de re-spécifier SoftClose RDV/PDF (déjà sous gap).

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience outil | 5 | ~7.5 | ≥ 8.5 |
| WOW outil | 6 | ~7.5 | ≥ 9 |
| Env. booker (post-climax) | 4.5 | ~7 | ≥ 8 |

**État P0 déjà en code (ne pas refaire) :**
- Estimateur avant tableau ; `<details>` comparatif
- Bandeau gap + barre ; defaults 350k → 447k / +97k
- `ToolSoftClose` **immédiatement sous** le bandeau (`…_rdv_outil`)
- Renouvellement* carte prêteur ; PDF notes FR

**Top 1 gap WOW restant :** le bandeau gap est en `text-xl md:text-2xl` — le climax émotionnel **+97k** n’est pas encore un héros `text-3xl+`. ResultCard famille est déjà `lg` ; le bandeau doit **dépasser** ou égaler cette échelle.

---

## 1. Job unique (inchangé)

**Climax conversion = `auDelaDuPret`** (écart illustratif au-delà du prêt), pas le ×2 coût relatif prêteur.

Defaults à conserver :

| Champ | Default |
|-------|---------|
| Solde | `350000` |
| Années | `20` |
| Prime | `45` |
| Autres dettes | `10000` |
| Remplacement | `3000` × `24` mois |
| Coussin | `15000` |

**Attendu :** `capitalFamille = 447000` · `auDelaDuPret = 97000` · `ratio ≈ 2,0` · `balanceMid = 175000`

Ne pas gonfler les defaults — WOW = **échelle typo + motion**.

---

## 2. Architecture UX (ordre actuel — OK)

```
[Inputs solde / années / prime]
[Mini cards prêteur ×ratio + perso]          ← aha secondaire
[§ Estimateur famille : 4 champs]
[ResultCards solde | famille lg]
[Bandeau gap + barre]                        ← CLIMAX P1 à upgrader
[ToolSoftClose]                              ← déjà OK — ne pas déplacer
[<details> Tableau 5 critères]
[Disclaimer]
```

SoftClose placement : **déjà sous climax** — pas footer-only. Aucun SoftClose custom.

---

## 3. Climax P1 — hiérarchie chiffres

### Avant (lignes ~413–449)

```jsx
// ResultCard famille size="lg" → text-3xl md:text-4xl
// Bandeau :
<p className="font-heading text-xl font-bold tabular-nums text-dark md:text-2xl">
  Écart illustratif : +{formatCad(calc.auDelaDuPret)} au-delà du prêt
</p>
// Barre h-2.5, width gapShare%
```

### Après (ship Vague 2)

| Élément | Spec |
|---------|------|
| Label bandeau | Inchangé : `Écart illustratif : +{formatCad(…)} au-delà du prêt` |
| Typo chiffre | `font-heading text-3xl font-bold tabular-nums text-dark md:text-4xl lg:text-5xl` |
| Option layout | Sur `md+` : label `text-sm uppercase tracking-wide text-prestige-taupe` au-dessus ; **montant seul** en XXL sur sa ligne pour maximiser le « damn » |
| Micro | Garder phrase soft close 15 min |
| Barre | `h-3` ; fill `from-amber-400 to-amber-600` ; `transition-[width] duration-700` |
| Condition | `auDelaDuPret > 0` seulement |
| SoftClose | Props actuelles OK ; `tone="warn"` optionnel pour continuum ambre |

### Snippet cible (indicatif)

```jsx
<div
  className="mt-4 space-y-3 rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 px-4 py-5 md:px-6"
  data-testid="hypotheque-gap-banner"
>
  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/90">
    Écart illustratif au-delà du prêt
  </p>
  <p className="font-heading text-3xl font-bold tabular-nums text-dark md:text-4xl lg:text-5xl">
    +{formatCad(calc.auDelaDuPret)}
  </p>
  <p className="text-sm leading-relaxed text-prestige-taupe">
    C’est souvent ça qu’on clarifie en 15 minutes — sans pression.
  </p>
  <div className="h-3 overflow-hidden rounded-full bg-amber-100/90" aria-hidden>
    <div
      key={calc.auDelaDuPret} /* keyed reveal */
      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-[width] duration-700 ease-out"
      style={{ width: `${calc.gapShare}%` }}
    />
  </div>
</div>
```

**Contrat typo catalogue :** `font-heading` + échelle `text-3xl/4xl` (5xl fit desktop) — pas d’échelle orpheline (`text-6xl`, display custom).

---

## 4. Motion in-tool

| Motion | Implémentation | Scope |
|--------|----------------|-------|
| Keyed bar reveal | `key={auDelaDuPret}` ou IO une fois + width anim | Helper shell si dispo (V2-S5) ; sinon local S |
| Fade SoftClose | Wrapper opacity au mount | Helper partagé — pas Framer one-off |
| Pulse CTA | **Non** — SoftClose primary déjà fort ; éviter noise | — |

Event optionnel P2 : `select_content` / `campagne_hypotheque-assurance-vie_gap_view` via IntersectionObserver quand bandeau visible.

---

## 5. Analytics (existant — vérifier non-régression)

| Event | Quand | id |
|-------|-------|-----|
| Tool focus | landing | `campagne_hypotheque-assurance-vie_tool` |
| Hero RDV | CTA secondaire | `…_rdv` |
| Mid RDV | navy | `…_rdv_mid` |
| Outil RDV | ToolSoftClose | `…_rdv_outil` ✓ |
| PDF | `useCampagneToolPdf('campagne_assurance-hypothecaire_pdf')` | garder |

Nouvel event V2 (P2) : `…_gap_view` seulement.

---

## 6. SoftClose — placement & contrat

| Règle | Statut #03 |
|-------|------------|
| Composant = `ToolSoftClose` uniquement | ✓ déjà |
| Sous climax (pas footer-only) | ✓ déjà |
| RDV primary + PDF ghost | ✓ déjà |
| Headline chiffrée solde vs capital | ✓ déjà |
| Re-spécifier pont RDV | **Interdit Vague 2** |

---

## 7. Fichiers exacts

| Fichier | Scope V2 |
|---------|----------|
| `AssuranceHypothecaireTool.jsx` | **Principal** — typo gap XXL, label/montant split, barre `h-3`, keyed reveal |
| `HypothequeVieTool.jsx` | Aucun |
| `CampagneToolShell.jsx` | Seulement si helper fade SoftClose générique |
| `campagneAdsLandings.js` | atmosphere / heroExtras / processSteps (chrome — pas calc) |
| `CampagneAdsLanding.jsx` / `PageHero.jsx` | Shell V2 — pas logique outil |

**Hors scope :** vrai amortissement vs `×0.5` ; SoftClose dynamique context lift (P2 rebuild).

---

## 8. Spec Avant → Après

| Zone | Avant (post-P0) | Après Vague 2 | Fichiers |
|------|-----------------|---------------|----------|
| Bandeau gap | `text-xl md:text-2xl` une ligne | Label sm + montant `text-3xl/4xl/5xl` | tool |
| Barre | `h-2.5`, transition 500 | `h-3`, keyed, 700 ms | tool |
| SoftClose | Sous gap, OK | Inchangé | — |
| Calc / defaults | OK | Inchangés | — |
| Tableau details | OK | Inchangé | — |

---

## 9. Backlog outil

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| O-1 | Gap hero XXL + split label/montant | S | P0-v2 |
| O-2 | Barre keyed reveal + `h-3` | S | P0-v2 |
| O-3 | `tone="warn"` SoftClose (option) | S | P1 |
| O-4 | Event `…_gap_view` IO | S | P2 |
| O-5 | Amortissement réel vs ×0.5 | L | P2 — hors sprint WOW |

---

## 10. Critères acceptation outil

- [ ] Defaults : `+97 000 $` lisible en `text-3xl+` sans ouvrir le tableau
- [ ] Gap = élément le plus dominant du viewport outil (plus gros que ResultCards sauf égalité lg)
- [ ] SoftClose toujours immédiatement sous le bandeau ; event `…_rdv_outil` intact
- [ ] PDF reste ghost ; aucun bandeau CTA custom
- [ ] Mobile 390 : montant gap ne wrappe pas de façon illisible
- [ ] Aucun changement de formule `auDelaDuPret` / defaults
