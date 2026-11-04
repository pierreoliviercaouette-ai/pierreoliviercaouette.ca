# [#09] CELI droits — Brief PM final (Vague 2 post-P0)

**Slug :** `/campagnes/celi-droits`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/celi-droits  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Rôle :** Gestionnaire de projet  
**Livrables :** `01-expert-visuel` → `02-expert-script` → `03-expert-outil` → `04-expert-finance`  
**Pas de commit / pas de code** — docs seulement.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | ~7,5 | ≥ 8,5 |
| WOW outil | 7 | ~8 | ≥ 8,5 |
| Env. booker | 4,5 | ~7 | ≥ 7,5 |

**Ce qui a shippé P0 (ne pas reouvrir) :** chips usage · split plafond/place · `ToolSoftClose` · hero outil-first · `ctaHeadline`/`ctaSubline` · ArcLink · pastille sans compte · PDF FR+usage.

**Top 1 gap WOW restant :** chrome page encore **générique** (orbes) — l’ami ne reconnaît pas « place restante CELI » en 5 s hors H1 ; climax outil solide mais sans scenic léger ni badge Exemple.

---

## 1. Vision Vague 2 (1 paragraphe)

Post-P0, le prospect a déjà le damn (~84 k$ vs 7 k$) et peut coller un usage. Vague 2 fait **sentir** le sujet avant le scroll : atmosphere CSS `place-restante`, `heroExtras` contraste plafond/`?`, process 3 steps catalogue, portrait CSF au mid — puis un climax scenic **léger** (reveal keyed + fade SoftClose) et un badge Exemple pour l’ownership. Même système shell que les 14 autres ; seul le sujet diverge.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero | Orbes génériques | `atmosphere: 'place-restante'` CSS | `PageHero.jsx`, data |
| Fold | Dual CTA OK, 0 extras | `heroExtras` 7 000 $ vs `?` | `CampagneAdsLanding.jsx`, data |
| Process | Absent | 3 steps partagés | shell + `processSteps` |
| Mid | Headline OK | + portrait `/seo/portrait.jpg` + CSF · Victoriaville | `CampagneAdsLanding.jsx` |
| Climax | Split + chips OK | Reveal léger + SoftClose fade | `CeliDroitsTool.jsx` + helpers |
| Ownership | Defaults sans marquage | Badge Exemple + reset | `CeliDroitsTool.jsx` |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V2-09-1 | Shell : `PageHero` atmosphere + data `place-restante` | M | **P0-v2** (shell) |
| V2-09-2 | Data + render `heroExtras` contraste | S | **P0-v2** |
| V2-09-3 | Data + render `processSteps` ×3 | S | **P0-v2** |
| V2-09-4 | Portrait mid shell (48–64px) | S | **P0-v2** (shell) |
| V2-09-5 | Helpers motion fade SoftClose + keyed climax | S | **P0-v2** (shell) |
| V2-09-6 | Brancher motion dans `CeliDroitsTool` | S | **P0-v2** |
| V2-09-7 | Badge Exemple + « Partir de zéro » | S | **P1** |
| V2-09-8 | Label heroExtras `Plafond 2026` (finance) | S | P1 |
| V2-09-9 | Compresser « À retenir » / polish mobile density | S | P2 |

**P0-v2 = ship Vague 2 pour #09** une fois shell V2-S1…S5 prêt (ou branche minimale atmosphere+extras+process+portrait).

---

## Dépendances shell vs spécifique

| Besoin | Scope |
|--------|-------|
| Atmosphere / heroExtras / processSteps / portrait / motion helpers | **Shell catalogue** (même système 01–15) |
| Teinte `place-restante` + copy extras/process #09 | **Spécifique data** |
| Keyed reveal + SoftClose fade + Badge Exemple | **Spécifique** `CeliDroitsTool.jsx` |

Ne pas bloquer data #09 sur polish Exemple (P1) ; P0-v2 chrome débloque le test ami 5 s.

---

## Uniformité catalogue

Même système shell que les 14 autres campagnes. Différencier le **sujet** (atmosphere, micro-signaux, climax) sans casser le **contrat**.

| Contrat | OK ? | Note |
|---------|------|------|
| Ordre sections Hero→En bref→Process→Outil→Mid→FAQ | ✅ spec | Process s’insère sous En bref ; pas d’ordre custom #09 |
| Hero CTAs primaire outil / secondaire RDV — mêmes variantes | ✅ déjà P0 | Ne pas re-skin les boutons |
| SoftClose = `ToolSoftClose` partagé | ✅ | Pas de bandeau navy one-off ; RDV primary + PDF ghost |
| Portrait + libellé CSF · Victoriaville identiques | ✅ spec | Asset `/seo/portrait.jpg` uniquement |
| Process strip même composant | ✅ spec | Seuls les 3 libellés #09 changent |
| Typo climax `font-heading` text-3xl/4xl | ✅ déjà | Place restante dominante ; pas d’échelle orpheline |
| Spacing / cards tokens prestige | ✅ | Teinte atmosphere seulement — pas de palette solo |
| Motion helpers partagés | ✅ spec | Pas de lib motion dédiée #09 |
| Divergence seulement atmosphere / heroExtras / climax | ✅ | Autorisé : tint `place-restante`, chips fold, reveal léger, Exemple |

**Interdit :** reinventer mid CTA, footer outil, FAQ layout, SoftClose one-off.

---

## Finance / conformité (synthèse)

- **Claims OK :** heroExtras plafond année illustratif + `?` ; process « pas le solde » ; intention usage ; Clarifier ≠ cotiser  
- **Interdits :** 84 k$ au fold ; « solde ARC » ; coût non chiffré ; maxer demain  
- **Disclaimer :** garder outil/PDF (retraits non modélisés + ARC fait foi)  
- **V2 :** préférer `Plafond 2026` sur extras ; badge Exemple recommandé

---

## Critères acceptation « ami reconnaît en 5 s »

1. Fold : contraste plafond vs `?` + teinte « place » — pas un clone orbes.  
2. Process visible : Estime → Usage → Clarifie.  
3. Outil : ~84 k$ vs 7 k$ + chips (P0) + motion léger (V2).  
4. Mid : portrait CSF · Victoriaville + headline usage/plan (P0).  
5. SoftClose reste le composant catalogue.  
6. Test phrase ami : « T’as de la place, t’as un usage, tu peux clarifier — ça sent le CELI droits. »

---

## Ordre d’implémentation recommandé

```
1. Shell V2-S1…S5 (atmosphere, extras, process, portrait, motion helpers)
2. Data celi-droits : atmosphere + heroExtras + processSteps
3. CeliDroitsTool : brancher reveal + SoftClose fade
4. P1 : Badge Exemple + reset + label Plafond 2026
5. QA mobile + test ami 5 s + events inchangés
```

---

## Definition of Done (Vague 2 docs → ship)

- [x] 5 md Vague 2 écrits (`00`–`04`)  
- [ ] Uniformité catalogue respectée à l’implémentation  
- [ ] Pas de re-spec SoftClose / dual CTA / ctaHeadline  
- [ ] Zéro nouvelle photo  
- [ ] Pas de commit tant que non demandé  

**Prochaine action dev :** attendre consolidation shell V2, puis brancher data `#09` + motion outil.
