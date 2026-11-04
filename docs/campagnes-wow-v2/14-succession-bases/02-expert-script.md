# [#14] Succession — bases — Expert script marketing

**Slug :** `/campagnes/succession-bases`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, zéro dramatisation funéraire  
**Fichiers cibles :** `campagneAdsLandings.js` (`succession-bases`), slots shell `heroExtras` / `processSteps`, microcopy module CSF\|Notaire  
**Note :** Soft close outil + mid Ad3 **déjà livrés** — ne pas réécrire sauf gap réel.

---

## Rescore post-P0 (copy)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Message match Meta | 4 | 8 (H1 Ad1) | 8 |
| Clarté CSF vs notaire | 5 | 7 (FAQ + SoftClose) | 8,5 |
| Fold différenciant | 4 | 5 | 8 |

**Top 1 gap copy restant :** fold et process n’ont pas encore les micro-signaux « Liquidité ≠ papier / CSF · Notaire » — le H1 porte seul l’identité.

---

## Interdits (ne pas re-spécifier)

- SoftClose outil (`T’as {N} cases…` / complet) — **OK tel quel**
- Mid `ctaHeadline` / `ctaSubline` — **OK** (« Des cases vides te chicottent ? »)
- Hero dual CTA labels — **OK** (`Remplir la checklist` / RDV)
- H1 / promise — **garder** (plus générique = faux)

---

## Textes différenciants Vague 2 (prêts à coller)

### `heroExtras`

| Champ | Texte |
|-------|--------|
| `kicker` | Checklist · sans compte |
| Chip 1 | Liquidité ≠ papier |
| Chip 2 | CSF · Notaire |

Ligne confiance existante (ne pas dupliquer) :  
`Conseiller en sécurité financière · Victoriaville · Contenu éducatif`

### `processSteps` (3 max)

| # | Label court | Aide optionnelle (1 ligne) |
|---|-------------|----------------------------|
| 1 | Coche ce qui est vrai | Sans compte — seulement aujourd’hui. |
| 2 | Portrait des trous | Tes cases vides apparaissent après tes coches. |
| 3 | 15 min CSF ou notaire | Liquidité & bénéficiaires avec moi ; testament = notaire. |

### Module CSF \| Notaire (sous outil)

| Colonne | Titre | Corps |
|---------|-------|--------|
| Gauche | Avec moi (15 min) | Liquidité des premiers mois, plan revenu / dettes, bénéficiaires (assurance, REER, CELI, collective). Clarifier ≠ acheter. |
| Droite | Avec le notaire | Testament et cadre légal. Cette checklist ne le remplace pas — elle prépare la bonne conversation. |

Eyebrow optionnel au-dessus du module : `Qui fait quoi`

### Portrait mid (libellé shell)

`Pierre-Olivier Caouette`  
`Conseiller en sécurité financière · Victoriaville`

---

## Spec Avant → Après (copy V2 seulement)

| Zone | Avant (post-P0) | Après Vague 2 |
|------|-----------------|---------------|
| Fold sous CTAs | Confiance texte seule | + kicker + 2 chips contraste |
| Sous En bref | Direct outil | Process 3 steps (libellés ci-dessus) |
| Sous outil | Scale fin de liste | Module 2 colonnes CSF \| Notaire (copy ci-dessus) |
| Mid | Ad3 OK, sans visage | + portrait `/seo/portrait.jpg` + même libellé CSF |

---

## Soft close / mid — verdict gap

| Slot | Gap post-P0 ? | Action |
|------|---------------|--------|
| SoftClose outil | Non | **Ne pas toucher** |
| Mid headline/subline | Non | **Ne pas toucher** |
| FAQ ×5 | Non | **Ne pas toucher** |
| Ads Ad1–Ad3 | Mineur | Optionnel Ad2 : « Sur la page, le portrait apparaît après tes coches » (déjà dans rebuild — P2 ads) |

---

## Phrases interdites (rappel)

- « Succession réglée », « on remplace ton notaire »
- Choc funéraire en accroche
- « Conseil personnalisé » sur l’outil
- Urgence fake / countdown

---

## Events (copy IDs — existants + V2)

| Moment | ID |
|--------|-----|
| Hero outil (existant) | `campagne_succession-bases_outil_scroll` / `_outil_cta` |
| SoftClose outil (existant) | `campagne_succession-bases_rdv_tool` |
| Mid (existant) | `campagne_succession-bases_rdv_mid` |
| Optionnel process click | `campagne_succession-bases_process` (select_content) |

---

## Hors scope

- Réécriture SoftClose / mid / H1  
- Commit / code
