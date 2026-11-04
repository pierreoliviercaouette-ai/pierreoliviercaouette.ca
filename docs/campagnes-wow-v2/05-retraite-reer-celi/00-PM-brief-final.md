# [#05] PM — Brief final Vague 2 — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**URL live :** https://www.pierreoliviercaouette.ca/campagnes/retraite-reer-celi  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**CTA :** RDV Bookings  
**Livrables :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Pas de commit / pas de code** (brief seulement).

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | ~7,0 | ≥ 8,0 |
| WOW outil | 6 | ~7,0 | ≥ 8,5 |
| Env. booker | 5 | ~7,2 | ≥ 8,0 |

**Top 1 gap WOW restant :** chrome page encore catalogue-générique **+** matching employeur absent dans l’outil.  
→ Visuel : atmosphere CSS dual REER·CELI + kicker `heroExtras` + process + portrait.  
→ Outil : chips matching Oui / Non / Je sais pas (climax P1 master backlog).

---

## Vision WOW V2 (1 paragraphe)

Le prospect Meta reconnaît en 5 s les **deux enveloppes** (kicker + dual bars CSS), suit le process 3 pas, et dans le prioriseur note son **matching employeur** — sans casser le SoftClose déjà livré. Les 250 $ / 250 $ restent le climax chiffre ; le match ajoute la raison « souvent avant le débat perso » et pousse le RDV pour quantifier. Portrait CSF au mid. Zéro photo new. Même système shell que les 14 autres.

---

## Spec Avant → Après (synthèse)

| Zone | Avant (post-P0) | Après Vague 2 | Fichiers |
|------|-----------------|---------------|----------|
| Hero | Gradient générique, dual CTA OK | `atmosphere: 'reer-celi'` + dual bars CSS | `PageHero` · data |
| Fold | Pas de kicker | `heroExtras` kicker `REER · CELI` | data · landing |
| Process | Absent | Strip 3 steps shell | data `processSteps` · landing |
| Portrait | Absent mid | `/seo/portrait.jpg` 48–64 px + libellé CSF | shell mid |
| Outil | SoftClose + $ XXL ; **pas** matching | Chips Oui/Non/Je sais pas + raison + PDF row | `RetraiteReerCeliTool.jsx` |
| SoftClose / mid CTA | Livrés | **Inchangés** (contrat) | — |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V2-05-1 | Atmosphere `reer-celi` + dual bars | S–M | **P0-v2** |
| V2-05-2 | `heroExtras` kicker `REER · CELI` | S | **P0-v2** |
| V2-05-3 | `processSteps` ×3 + `toolIntro` | S | **P0-v2** |
| V2-05-4 | Portrait mid (shell partagé) | S | **P0-v2** |
| V2-05-5 | Chips matching + raisons + PDF + analytics | M | **P1** |
| V2-05-6 | Chip snapshot « Match employeur noté » | S | P1 |
| V2-05-7 | Keyed SplitBar + SoftClose fade helpers | S | P2 |
| V2-05-8 | Count-up $ snapshot | S | P2 |

### Ordre d’implémentation

```
1. Shell V2-S1–S4 (atmosphere, heroExtras, process, portrait)  ← catalogue
2. Data #05 atmosphere + heroExtras + processSteps + toolIntro
3. Matching chips + buildSuggestion raisons + PDF            ← P1 climax
4. Finance sign-off matching
5. Motion polish P2
```

---

## Dépendances shell vs spécifique

| Shell catalogue (partagé) | Spécifique #05 |
|---------------------------|----------------|
| `PageHero` atmosphere / tint / texture | Valeur `reer-celi` + dual bars colors |
| `item.heroExtras` / `processSteps` / portrait mid | Copy kicker + 3 labels process + matching UX |
| Helpers motion SoftClose fade / keyed reveal | Chip match + event `…_matching_oui` |
| `ToolSoftClose` inchangé | — |

---

## Uniformité catalogue

Même **système** shell que les 14 autres ; divergence seulement sujet (atmosphere, micro-signaux, climax matching).

| Contrat | OK ? | Note |
|---------|------|------|
| Ordre sections Hero→En bref→Process→Outil→Mid→FAQ | Oui (cible) | Process inséré sous En bref — pas de réordonnancement custom |
| Hero CTAs primaire outil / secondaire RDV — mêmes variantes | Oui | Déjà P0 ; ne pas re-spécifier |
| SoftClose = `ToolSoftClose` partagé ; RDV primary + PDF ghost | Oui | **Interdit** bandeau SoftClose one-off #05 |
| Portrait `/seo/portrait.jpg` + libellé CSF · Victoriaville | Oui | Même vignette / même wording catalogue |
| Process strip même composant ; seuls 3 libellés changent | Oui | `Répondre` → `Voir l’ordre $` → `15 min` |
| Typo climax `font-heading` text-3xl/4xl | Oui | Snapshot mixte déjà conforme ; pas d’échelle orpheline |
| Spacing / cards tokens prestige ; pas de palette solo | Oui | Teinte atmosphere dual primary/secondary seulement |
| Motion helpers shell partagés | Oui | Pas de lib motion #05-only |
| Divergence autorisée | — | `atmosphere`, `heroExtras`, climax matching, copy sujet |
| Interdit | — | Mid CTA custom, footer outil reinventé, FAQ layout solo, SoftClose one-off |

---

## Critères d’acceptation « ami reconnaît en 5 s »

- [ ] Sans nav : lit **REER · CELI** (kicker / dual bars)  
- [ ] Process 3 pas visible avant l’outil  
- [ ] Portrait CSF reconnaissable au mid  
- [ ] Matching chips dans Block 1 ; Oui → raison éducative sans forcer le split  
- [ ] SoftClose = composant partagé ; PDF ghost  
- [ ] Ami résume : « il valide mon ordre 250/250 **et** mon matching employeur »  
- [ ] Checklist finance § matching cochée  

---

## Finance / conformité (synthèse)

- **Claims OK :** matching « souvent » + quantifier en 15 min ; splits illustratifs.  
- **Interdits :** forcer REER 100 % ; % match inventé ; rendement ; CELIAPP dans le prioriseur.  
- **Disclaimer :** inchangé (outil + SoftClose + bas page).  

---

## One-liner équipe

**Chrome dual REER·CELI + process + portrait (shell) ; climax = chips matching — SoftClose déjà fait, on ne le retouche pas.**
