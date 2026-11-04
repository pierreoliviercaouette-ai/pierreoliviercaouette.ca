# [#02] CELIAPP — Spec climax outil Vague 2

**Rôle :** Expert outils numériques  
**Slug :** `/campagnes/celiapp`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/CeliappTool.jsx`  
**Climax P1 verrouillé :** gap cible — 3 cols **Projection \| Cible \| Écart**

---

## Rescore post-P0 (outil)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| WOW outil | 5/10 | **6,5/10** (headline + SoftClose + defaults 4 k×4) | **8,5/10** (gap personnel) |
| Pont booker | 3/10 | **7,5/10** (`ToolSoftClose` sous climax) | 8/10 |
| Tension vs « ma » maison | 2/10 | 2/10 | **8/10** |

**Top 1 gap WOW restant (outil) :** le chiffre est clair (~16 k$) mais impersonnel — sans **Projection \| Cible \| Écart**, le prospect ne sent pas « est-ce assez pour *moi* ? ».

---

## Interdits / déjà livré (ne pas re-spec)

- `ToolSoftClose` sous climax + footer — **placement OK**, ne pas inventer un bandeau custom
- Defaults `4000` / `4` / chip max / clamp sans `max={8000}` / `lecture.headline` affiché
- Dual CTA hero / mid CTA data
- PDF ghost via SoftClose

**Placement SoftClose :** déjà sous climax → **aucune action V2** sauf s’assurer que la grille gap s’insère **au-dessus** de `{softCloseActions}`.

---

## 1. Climax P1 — hiérarchie chiffres (ordre strict)

Card résultat step 3, une fois `milestones[2].done` :

1. Badge « Max à vie » *seulement si* `plafondAtteint` (déjà)
2. **`lecture.headline`** — `font-heading text-3xl sm:text-4xl` (déjà)
3. `lecture.detail` (déjà)
4. **NOUVEAU — si `cible > 0` :** grille 3 colonnes  
   | Projection | Cible | Écart |  
   Montants `font-heading text-lg sm:text-xl` ; labels `text-xs text-prestige-taupe`
5. `lecture.points` (déjà)
6. KPIs Par année / Ajouté / Place restante (déjà)
7. **`ToolSoftClose`** (déjà — ne pas remplacer)
8. « À retenir » beige (déjà)

**Si `cible === 0` :** pas de grille gap (évite 3 cols vides). Champ optionnel reste visible en step 2.

---

## 2. Champ & logique

| Item | Spec |
|------|------|
| State | `miseCible` string, default `''` |
| Placement UI | Step 2 « Ton projet d’achat », à côté / sous les années — `Field` full width `sm:col-span-2` OK |
| Input | `MoneyInput` sans max dur ; min 0 ; placeholder `25000` |
| Calcul | `cible = toNumber(miseCible)` ; si `cible > 0` : `ecart = cible - totalProjete` |
| Sens écart | `ecart > 0` → reste à combler (cotisations) ; `ecart < 0` → au-dessus ; `0` → dans la cible |
| `buildLecture` | Optionnel : 1 point si cible → « Ta cible est {cible} — écart ~{ecart} (cotisations seulement). » Ne **pas** changer le headline principal |
| SoftClose copy | Branche script si cible : Projection · Cible · Écart (voir `02-expert-script`) |
| PDF | Si cible > 0, ajouter row « Mise cible » + « Écart » dans section Projection ; accents FR si on touche le PDF (P1 secondaire) |

**Ne pas ajouter :** rendement, prix maison, % mise, score admissibilité, checklist (P2 / plus tard si métriques), moteur reports 16 k$.

---

## 3. Motion in-tool

| Motion | Spec |
|--------|------|
| Gap reveal | Wrapper keyed `key={\`gap-${cible}-${totalProjete}\`}` + classes shell `animate-in fade-in slide-in-from-bottom-1 duration-300` (ou helper partagé) |
| SoftClose | Inchangé |
| Barre max | Inchangé |

---

## 4. Events analytics

| Event | Quand | Payload |
|-------|-------|---------|
| `select_content` | blur/change cible avec valeur > 0 | `item_id: campagne_celiapp_cible` |
| (existant) | SoftClose RDV, chip max, PDF, scroll outil | garder |

---

## 5. Fichiers exacts

| Fichier | Changements Vague 2 |
|---------|---------------------|
| `CeliappTool.jsx` | state `miseCible`, calcul écart, UI 3 cols, point lecture optionnel, SoftClose branche écart, event cible, PDF rows |
| `campagneAdsLandings.js` | `atmosphere`, `heroExtras`, `processSteps` (chrome — pas logique outil) |
| `PageHero.jsx` | prop `atmosphere` + rendu tint/texture (shell) |
| `CampagneAdsLanding.jsx` | passer atmosphere / heroExtras / processSteps ; portrait mid (shell) |
| `CampagneToolShell.jsx` | **seulement** si portrait/helpers motion partagés — pas de SoftClose one-off CELIAPP |

**Shell vs spécifique :**

| Partagé | Spécifique CELIAPP |
|---------|-------------------|
| `PageHero` atmosphere API | Tint `foyer` values |
| `processSteps` renderer | 3 labels CELIAPP |
| Portrait mid + libellé CSF | — |
| `ToolSoftClose` | Branche copy écart |
| Motion helpers | Grille gap 3 cols + field cible |

---

## 6. Wireframe card (post-cible)

```
[Environ 16 000 $ pour ta mise de fonds]
Sur 4 ans · déjà 0 $ dedans.

┌─────────────┬─────────────┬─────────────┐
│ Projection  │ Cible       │ Écart       │
│ 16 000 $    │ 25 000 $    │ 9 000 $     │
│             │             │ à combler   │
└─────────────┴─────────────┴─────────────┘
(note xs : cotisations vs souhait)

• points…
• KPIs 3 cols…

[ ToolSoftClose — inchangé / branche écart ]
```

Mobile : `grid gap-3 sm:grid-cols-3` — stack OK.

---

## 7. Critères acceptation UX

- [ ] Sans cible : comportement post-P0 inchangé (pas de grille vide)
- [ ] Avec cible 25 k$ + defaults 4 k×4 → Projection 16 k$ · Cible 25 k$ · Écart 9 k$
- [ ] Écart négatif copy « Au-dessus de ta cible (cotisations seulement) »
- [ ] SoftClose reste `ToolSoftClose` sous la grille
- [ ] Typo climax headline reste `text-3xl/4xl` ; gap = `text-lg/xl` (pas d’échelle orpheline)
- [ ] Event `campagne_celiapp_cible` fire au moins une fois par session avec cible
