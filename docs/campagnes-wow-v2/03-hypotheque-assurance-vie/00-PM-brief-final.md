# [#03] Hypothèque — Brief PM final Vague 2 (post-P0)

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Vague :** 2 — pilote atmosphère solde → famille  
**Date :** 2026-11-04  
**Sources :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`

---

## 1. Vision WOW

P0 a mis l’estimateur et le SoftClose en place. Vague 2 rend la page **reconnaissable en 5 s** (atmosphere CSS hypo + chips Banque vs famille) et pousse l’écart `+97 k$` en vrai climax `text-3xl+` — sans reinventer le pont RDV.

---

## 2. Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5 | ~7 | 8,5 |
| WOW outil | 6 | ~7,5 | 9 |
| Env. booker | 4,5 | ~7,5 | 8 |

**Top 1 gap :** hero clone + gap encore sous-dimensionné.

---

## 3. Uniformité catalogue

| Contrat | OK ? | Note |
|---------|------|------|
| Ordre Hero→En bref→Process→Outil→Mid→FAQ | ☐ | Process via shell |
| SoftClose = `ToolSoftClose` partagé | ✅ | Post-P0 |
| Portrait + libellé CSF identiques | ☐ | Shell mid |
| Process strip même composant | ☐ | Labels hypo |
| Typo climax `font-heading` text-3xl/4xl | ☐ | Gap XXL |
| Divergence seulement atmosphere / heroExtras / climax | ☐ | `hypo` |

---

## 4. Backlog P0-v2

| ID | Item | Effort |
|----|------|--------|
| V2-1 | Atmosphere `hypo` + heroChips | S |
| V2-2 | Process strip 3 labels | S |
| V2-3 | Gap `+auDelaDuPret` text-3xl/4xl | S |
| V2-4 | Portrait mid (shell) | S |

## 5. Critères d’acceptation

- Sans nav : chips + teinte disent « hypothèque »
- Gap impossible à manquer avant le tableau `<details>`
- Aucun SoftClose custom
