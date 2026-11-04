# [#05] Expert marketing visuel — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** code live `CampagneAdsLanding` · `PageHero` · `RetraiteReerCeliTool` · rebuild Vague 1 · `_ROLES` V2  
**Choix verrouillé :** pas de nouvelles photos — atmosphère CSS dual REER·CELI + portrait `/seo/portrait.jpg`.

---

## Rescore post-P0 (visuel)

| Dimension | Après P0 | Gap V2 |
|-----------|----------|--------|
| Expérience | ~7 | Hero encore clone catalogue (orbs génériques) |
| WOW outil | ~7 | $ XXL + nuance OK ; matching absent |
| Env. booker | ~7 | SoftClose livré ; mid sans portrait CSF |

**Top 1 gap WOW restant :** sans nav, la page ne « sent » pas les **deux enveloppes** — manque kicker `REER · CELI` + dual bars CSS + process strip.

---

## Spec visuelle CSS-only (pas photo)

### 1. Hero — atmosphere `reer-celi`

| Prop / couche | Spec Après | Classes / fichiers |
|---------------|------------|-------------------|
| `atmosphere` | `'reer-celi'` | `campagneAdsLandings.js` → `PageHero` |
| Tint | Halos existants : secondary (CELI) à gauche / primary (REER) à droite, opacity ↑ légèrement vs défaut | `PageHero.jsx` branche atmosphere |
| Texture | Grain léger `opacity-[0.04]` + 2 barres 3–4 px sous le titre (secondary puis primary) — **pas** `backgroundImage` | overlays CSS absolus |
| Dual bars | `h-1 w-16 bg-secondary/80` + `h-1 w-16 bg-primary/80` centrés, gap-2, sous H1 ou au-dessus de la vague | `heroExtras` ou slot atmosphere |

**Budget hero inchangé :** brand signal · H1 · 1 promesse · CTA group (déjà outil-first) · atmosphère. Pas de stats / cards.

### 2. Micro-signaux fold — `heroExtras`

| Signal | Contenu | Style |
|--------|---------|-------|
| Kicker | `REER · CELI` | `font-heading tracking-[0.22em] text-white/45 text-xs sm:text-sm uppercase` — sous badge ou au-dessus H1 |
| Chips contraste (opt.) | 2 pastilles non cliquables : `CELI` (dot secondary) · `REER` (dot primary) | `text-[11px] text-white/70` — **pas** pills cluster marketing |

Test brand : retirer la nav → kicker + dual bars = campagne identifiable en <3 s.

### 3. Process strip (3 steps)

Même composant shell catalogue (pas de layout one-off) :

1. `Répondre` — 4 choix + matching  
2. `Voir l’ordre $` — partage illustratif  
3. `15 min` — coller au dossier  

Placement : **sous En bref**, avant `#outil`. Classes shell partagées ; seuls les libellés #05 changent.

### 4. Portrait CSF

- Source unique : `/seo/portrait.jpg`  
- Taille : 48–64 px, `rounded-full`, ring `ring-2 ring-primary/15`  
- Libellé : `Conseiller en sécurité financière · Victoriaville`  
- Placement : mid soft-close (sous `ctaHeadline` / à côté du CTA) — **même pattern** que les 14 autres, pas de bandeau photo custom.

### 5. Motion climax (2–3 utiles)

1. **Fade SoftClose** — helper shell partagé (déjà / à brancher) quand `pdfReady` ou key change.  
2. **Keyed SplitBar reveal** — `key={celiPct-reerPct}` pour re-animer largeurs au changement de choix / matching.  
3. **Count-up soft** (opt. P2) sur `celiAmt` / `reerAmt` 300–400 ms — présence du prochain dollar.

Pas de glow purple, pas de stickers flottants, pas de lib motion solo.

### 6. Climax outil (visuel — hors SoftClose)

Déjà P0 : mixte → `$ XXL` (`text-3xl sm:text-4xl font-heading`) ; tone `nuance` primary/secondary.  
V2 : quand matching = Oui, pastille discrète sous snapshot : `Match employeur noté` en `text-xs text-prestige-taupe` (pas ambre).

---

## Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero | `PageHero` gradient générique, orbs défaut | `atmosphere="reer-celi"` + dual bars CSS | `PageHero.jsx` · data landing |
| Fold | Pas de kicker sujet | `heroExtras` kicker `REER · CELI` | `CampagneAdsLanding.jsx` · data |
| Process | Absent | Strip 3 steps shell sous En bref | shell + `processSteps` data |
| Mid | SoftClose mid texte seul | + portrait 48–64 px CSF | shell SoftClose / mid |
| Snapshot | $ XXL OK (P0) | + chip « Match employeur noté » si Oui | `RetraiteReerCeliTool.jsx` |

---

## Backlog visuel

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| V-1 | Atmosphere `reer-celi` + dual bars | S–M | P0-v2 |
| V-2 | `heroExtras` kicker | S | P0-v2 |
| V-3 | Process strip 3 labels | S (shell) | P0-v2 |
| V-4 | Portrait mid | S (shell) | P0-v2 |
| V-5 | Chip match + keyed SplitBar | S | P1 |
| V-6 | Count-up $ | S | P2 |

---

## Critères acceptation visuel

- [ ] Sans nav : ami lit « REER · CELI » en <5 s  
- [ ] Aucune nouvelle photo / pas de `backgroundImage` hero obligatoire  
- [ ] Process + portrait = mêmes composants shell que le catalogue  
- [ ] SoftClose = `ToolSoftClose` inchangé (pas de bandeau custom)  
- [ ] Palette = tokens prestige + teinte atmosphere seulement  
