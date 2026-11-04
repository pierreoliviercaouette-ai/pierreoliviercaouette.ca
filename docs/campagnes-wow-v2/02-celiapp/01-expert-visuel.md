# [#02] CELIAPP — Spec visuelle Vague 2 (CSS-only)

**Rôle :** Expert marketing visuel  
**Slug :** `/campagnes/celiapp`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Pilote atmosphère :** foyer / 1ʳᵉ propriété  
**Sources :** code `PageHero.jsx`, `CampagneAdsLanding.jsx`, `CeliappTool.jsx`, `_ROLES.md`

---

## Rescore post-P0 (visuel)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Identité sujet au fold | 3/10 (navy clone + orbes) | 4/10 (dual CTA OK, hero encore générique) | **8/10** — atmosphere foyer lisible en 5 s |
| Chrome conversion | 3/10 | **7/10** (`ToolSoftClose` sous climax) | 8/10 (+ portrait mid) |
| Process / micro-signaux | 2/10 | 2/10 | **8/10** (process strip + heroExtras) |

**Top 1 gap WOW restant (visuel) :** le fold reste un template navy + orbes — sans photo, la teinte/texture foyer + chips `heroExtras` doivent porter l’identité « 1ʳᵉ propriété ».

---

## Interdits (ne pas re-spécifier)

- Soft close RDV / PDF ghost — déjà livré via `ToolSoftClose`
- Hero dual CTA outil-first — déjà livré
- Mid `ctaHeadline` / `ctaSubline` — déjà en data
- Shoot / achat / `backgroundImage` full-bleed photos

---

## 1. Atmosphere CSS — foyer / 1ʳᵉ propriété

**Prop data :** `atmosphere: 'foyer'` (ou `celiapp`) sur l’item `campagneAdsLandings` → passé à `PageHero`.

| Couche | Spec Tailwind / CSS | Intention |
|--------|---------------------|-----------|
| Base | Garder `gradient-hero` (navy) | Cohérence catalogue |
| Tint sujet | Overlay absolu `bg-gradient-to-br from-amber-900/25 via-transparent to-primary/40` | Chaleur foyer sans crème #F4F1EA solo |
| Texture | Grain SVG opacity `0.04–0.06` **ou** soft radial « fenêtre » `radial-gradient(ellipse at 70% 20%, rgba(255,220,180,0.12), transparent 55%)` | Lumière intérieure, pas photo |
| Orbes | **Réduire** : max 1 orb secondaire soft ; retirer le 3ᵉ orb right si atmosphere active | Moins « template campagnes » |
| Grille | Garder `HERO_GRID` à `opacity-[0.025]` | Shell partagé |
| Vague bas | Inchangée (`showWave`) | Uniformité |

**Test 5 s sans nav :** « ça sent la mise de fonds / 1ʳᵉ propriété », pas « une autre landing navy ».

**Pas de :** `backgroundImage` URL, collage clés, cards media inset, badges flottants sur le hero.

---

## 2. Micro-signaux fold — `heroExtras`

Rendu **sous** la promise, **au-dessus** du dual CTA (children `PageHero`), via slot shell `heroExtras` (même composant pour les 15).

| Extra | Type | Contenu (script) | Classes |
|-------|------|------------------|---------|
| Kicker | ligne texte | « 1ʳᵉ propriété · plafonds illustratifs 2026 » | `text-xs text-white/70 tracking-wide` |
| Chip A | contraste | « CELIAPP ≠ CELI » | `rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/90` |
| Chip B | sujet | « Cotisations seulement » | même chip |

**Budget fold :** brand (badge) + H1 + promise + heroExtras + dual CTA + atmosphere. Rien d’autre.

---

## 3. Process strip 3 steps

**Placement catalogue (ordre verrouillé) :** après En bref, avant « À toi de jouer » / `#outil`.

**Composant :** strip partagé `CampagneProcessSteps` (même classes partout) — **seuls les 3 libellés** changent.

| # | Libellé CELIAPP |
|---|-----------------|
| 1 | Projeter ton rythme |
| 2 | Lire le chiffre (et l’écart) |
| 3 | 15 min si ça chicotte |

Visuel : une ligne, numéros `text-secondary`, séparateurs `→` ou traits prestige — **pas de cards**, pas d’icônes Lucide custom par campagne.

---

## 4. Portrait CSF

| Spec | Valeur |
|------|--------|
| Asset | `/seo/portrait.jpg` **uniquement** (existant) |
| Taille | 48–64px, `rounded-full`, ring `ring-2 ring-white/80` |
| Libellé | `Conseiller en sécurité financière · Victoriaville` (identique cross-catalogue) |
| Placement | Mid soft-close (bandeau navy landing) — à gauche du headline mid, **ou** au-dessus des CTAs mid |
| SoftClose outil | **Ne pas** inventer un SoftClose custom pour coller le portrait ; portrait = shell mid (ou prop optionnelle `ToolSoftClose` partagée si le shell l’ajoute pour toutes) |

---

## 5. Motion climax (2–3 max, helpers shell)

1. **Keyed gap reveal** : quand `miseCible` > 0 et projection prête, grille 3 cols Projection \| Cible \| Écart fade/slide-up 300 ms (`key={ecart}` ou `key={totalProjete+cible}`) — helper partagé type `campagne-reveal`
2. **SoftClose fade** : déjà présent post-P0 — ne pas re-spec ; s’assurer que le gap s’insère **au-dessus** du `ToolSoftClose` existant
3. Barre « Vers le max à vie » : garder `transition-all duration-500` (déjà)

Pas de lib motion externe ; pas de glow pulse orphelin.

---

## 6. Typo & tokens (contrat catalogue)

| Zone | Règle |
|------|-------|
| Climax headline | `font-heading text-3xl sm:text-4xl` (déjà) — **pas** d’échelle solo |
| Gap 3 cols | Labels `text-xs text-prestige-taupe` ; montants `font-heading text-lg sm:text-xl font-semibold` ; Écart peut être `text-primary` si > 0, `text-amber-700` si au-dessus cible — tokens existants |
| SoftClose | Composant `ToolSoftClose` uniquement |
| Cards En bref | Tokens prestige existants ; pas de nouvelle palette « foyer crème » hors tint hero |

---

## 7. Avant → Après

| Zone | Avant (code actuel post-P0) | Après Vague 2 | Fichiers |
|------|----------------------------|---------------|----------|
| Hero | `gradient-hero` + 3 orbes + grille ; dual CTA OK | + `atmosphere="foyer"` tint/grain ; orbes réduits | `PageHero.jsx`, `CampagneAdsLanding.jsx`, data |
| Fold extras | Absent | `heroExtras` kicker + 2 chips | data + landing |
| Process | Absent | Strip 3 steps partagé sous En bref | landing shell + data `processSteps` |
| Portrait | Absent | 48–64px + libellé CSF mid | landing shell mid |
| Climax visuel | Headline + KPIs + SoftClose | + bandeau 3 cols gap (si cible) keyed reveal | `CeliappTool.jsx` |
| SoftClose | `ToolSoftClose` sous climax + footer | **Inchangé** (placement OK) | — |

---

## 8. Structure page (ordre catalogue — ne pas réordonner)

```
Nav
Hero (atmosphere + heroExtras + dual CTA)
En bref
Process 3 steps          ← V2
À toi de jouer + CeliappTool
  └ progress
  └ steps
  └ climax (headline → gap 3 cols → KPIs → ToolSoftClose)
  └ À retenir
Mid soft-close (+ portrait) 
FAQ
Footer disclaimer
```

---

## 9. Critères acceptation visuelle

- [ ] Sans nav, en 5 s : « CELIAPP / 1ʳᵉ propriété », pas clone navy générique
- [ ] Aucune photo hero / full-bleed nouvelle
- [ ] Process strip présent, mêmes classes que les autres campagnes
- [ ] Portrait `/seo/portrait.jpg` + libellé CSF identique au catalogue
- [ ] SoftClose = `ToolSoftClose` (pas de bandeau navy one-off)
- [ ] Gap 3 cols lisible mobile (stack ou 3 cols `sm:`)
- [ ] Divergence limitée à atmosphere / heroExtras / climax chiffres
