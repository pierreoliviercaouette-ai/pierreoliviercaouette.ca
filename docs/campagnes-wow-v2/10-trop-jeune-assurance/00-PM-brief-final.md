# [#10] Trop jeune — Brief PM final (Vague 2 post-P0)

**Rôle :** Gestionnaire de projet  
**Campagne :** `trop-jeune-assurance`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Livrables :** `01-visuel` · `02-script` · `03-outil` · `04-finance`  
**P0 déjà en code :** defaults neutres · SoftClose · dual CTA hero · ctaHeadline · split detail muted  
**Verrouillé :** pas de nouvelles photos · pas commit/code dans ce pack

---

## 1. Vision WOW V2 (1 paragraphe)

Après P0, le prospect possède enfin *son* score (toggle futur). Il manque le **spectaculaire** : le mythe tombe quand **Aujourd’hui** et **Projets connus** s’affichent en dual capital XXL, sur une page qui sent le sujet « score / trop jeune » (atmosphere CSS + chips + process 3 beats) sans ressembler à un template navy orphelin. Soft close et mid restent tels quels — on booke parce que le contraste $ est indéniable, pas parce qu’on réinvente le pont RDV. Même squelette que les 14 autres ; seul le sujet diverge.

**Cibles V2 :** Expérience ≥ 8,5 · WOW outil ≥ 9 · Env. booker ≥ 8.

---

## 2. Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 7,5 | 8,5 |
| WOW outil | 6 | 7,5 | 9 |
| Env. booker | 4 | 7,5 | 8 |

**Top 1 gap WOW restant :** dual capital XXL (outil) + atmosphère CSS `score` / process / portrait (chrome shell) — le detail muted post-P0 ne tue pas assez le mythe en 5 s.

---

## 3. Backlog shippable Vague 2

### P0-v2 — chrome catalogue (shell + data)

| ID | Quoi | Pourquoi | Où | Effort | Source |
|----|------|----------|-----|--------|--------|
| P0v2-1 | `PageHero` `atmosphere: 'score'` (tint/grain CSS) | Ami reconnaît la campagne | Shell `PageHero` + data | **M** | Visuel |
| P0v2-2 | `heroExtras` kicker + 2 chips | Confiance fold score-first | data + `CampagneAdsLanding` | **S** | Script + Visuel |
| P0v2-3 | `processSteps` ×3 sous En bref | Narratif avant outil | Shell process + data | **S** | Script + Visuel |
| P0v2-4 | Portrait `/seo/portrait.jpg` 48–64 mid SoftClose | Confiance CSF uniforme | Shell mid | **S** | Visuel |

### P1 — climax outil (spécifique + typo catalogue)

| ID | Quoi | Où | Effort |
|----|------|-----|--------|
| P1-1 | Dual capital XXL Aujourd’hui \| Projets + total illustratif secondaire | `TropJeuneTool.jsx` | **M** |
| P1-2 | Accent + hint si projets > aujourd’hui | `TropJeuneTool.jsx` | **S** |
| P1-3 | Keyed fade dual + event `dual_reveal` | tool + helper motion shell | **S** |
| P1-4 | Micro-disclaimer « ordres de grandeur » sous dual (option) | tool | **S** |

### P2 — polish

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Case collective informative (hors score) | M |
| P2-2 | Sticky score mobile | M |
| P2-3 | Sync Ad2 1 phrase si pas déjà | S |

---

## 4. Ordre d’implémentation

```
1. Shell V2 (atmosphere + process + heroExtras + portrait)   — P0v2-1…4  [catalogue]
2. Data trop-jeune (atmosphere, extras, processSteps)       — avec 1
3. Dual capital XXL + total illustratif + hint              — P1-1,2     [spécifique]
4. Motion keyed + dual_reveal + SoftClose fade helper       — P1-3
5. Disclaimer micro + QA finance                            — P1-4
6. P2 si bande passante
```

**Dépendance :** P1 dual peut coder en parallèle du shell atmosphere, mais le **ship page** attend le même process/portrait que le reste du catalogue.

---

## 5. Shell vs spécifique

| Changement | Portée | Note PM |
|------------|--------|---------|
| `atmosphere` / tint / grain | **Shell** `PageHero` | Teinte `score` = data ; rendu générique |
| `heroExtras` chips | **Shell** + data | |
| `processSteps` | **Shell** + data | Même composant ; 3 labels locaux |
| Portrait mid | **Shell** | Asset unique `/seo/portrait.jpg` |
| Motion helpers fade / keyed | **Shell** | Pas Framer one-off |
| Dual capital XXL | **Spécifique** `TropJeuneTool.jsx` | Typo `font-heading` text-3xl/4xl (contrat) |
| SoftClose | **Déjà livré** | Ne pas customiser |

---

## 6. Uniformité catalogue

Même système shell que les 14 autres. Différencier le **sujet** (atmosphere `score`, chips mythe, dual capital) sans casser le **système**.

| Contrat shell | OK ? | Note |
|---------------|------|------|
| Structure page Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ | **Oui** | Ordre imposé ; process absent aujourd’hui → P0v2-3 |
| Hero CTAs primaire outil / secondaire RDV — mêmes variantes boutons | **Oui** | Déjà P0 ; ne pas reinventer |
| SoftClose = `ToolSoftClose` uniquement (RDV primary + PDF ghost) | **Oui** | Déjà sous Lecture ; **interdit** bandeau custom V2 |
| Portrait `/seo/portrait.jpg` + libellé CSF · Victoriaville | **Oui** | P0v2-4 mid ; pas d’autre asset |
| Process strip même composant / classes ; seuls 3 libellés changent | **Oui** | Copy script S-2 |
| Typo climax `font-heading` + `text-3xl/4xl` (5xl fit OK) | **Oui** | Dual XXL respecte l’échelle ; pas d’orphelin |
| Spacing / cards tokens prestige ; pas de palette solo hors teinte atmosphere | **Oui** | Teinte ambre/secondary = atmosphere seulement |
| Motion helpers partagés (fade SoftClose, keyed reveal) | **Oui** | P1-3 via shell — pas 15 libs |
| **Autorisé à diverger** | — | `atmosphere: 'score'`, `heroExtras`, climax dual capital, copy |
| **Interdit** | — | Mid CTA one-off, footer outil custom, FAQ layout nouveau, SoftClose one-off |

**Verdict PM :** pack conforme au contrat cross-catalogue. Divergence = sujet mythe/score + dual $ ; système = inchangé.

---

## 7. Critères d’acceptation « ami reconnaît en 5 s »

1. Hero : chips score + teinte `score` → pas une landing assurance générique.  
2. Process : 3 beats → sait quoi cocher.  
3. Load outil : dual ~5 k$ | 0 $ (defaults neutres).  
4. Toggle hypo → Projets XXL saute ; mythe visible sans breakdown.  
5. SoftClose catalogue sous dual → mid + portrait CSF.  
6. FAQ / mid / SoftClose copy P0 inchangés.  
7. Zéro photo nouvelle · zéro claim prime.

### Checklist ami
- [ ] « Trop jeune / score / projets » en 5 s  
- [ ] Comprend pourquoi booker : lire *son* split, pas acheter  
- [ ] Page = même famille que CELIAPP / hypo / etc., sujet différent

---

## 8. Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| Shell atmosphere retarde dual | Dual shippable seul ; chrome suit dans même sprint catalogue |
| Dual XXL lu comme soumission | Labels + Total illustratif + disclaimer finance |
| SoftClose re-customisé par erreur | Contrat uniformité : `ToolSoftClose` only |
| Palette ambre « solo » | Limiter à overlay atmosphere, tokens prestige ailleurs |

---

## 9. Definition of Done

- [ ] 5 md Vague 2 lus  
- [ ] Uniformité catalogue validée (section 6)  
- [ ] P0-v2 shell + P1 dual QA mobile/desktop  
- [ ] Events `dual_reveal` smoke  
- [ ] **Pas de commit** dans ce brief

---

## 10. Résumé exécutif

**Une phrase :** chrome `score` catalogue + dual capital XXL — même système, sujet mythe.  
**Fichiers chauds :** `TropJeuneTool.jsx` (P1) · `PageHero` / `CampagneAdsLanding` / data (P0-v2).  
**Effort V2 focus :** ~1–1,5 j (shell partagé amorti).  
**Impact WOW :** **H** sur outil ; **M** sur chrome page.
