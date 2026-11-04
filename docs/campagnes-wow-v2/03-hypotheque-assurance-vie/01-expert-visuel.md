# [#03] Expert marketing visuel — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** rebuild pack 03 · `PageHero.jsx` · `CampagneAdsLanding.jsx` · `AssuranceHypothecaireTool.jsx` · `campagneAdsLandings.js`  
**Contrainte :** **pas de nouvelles photos** — atmosphère CSS solde → famille · portrait existant `/seo/portrait.jpg`

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience visuelle | 5 | ~7 | ≥ 8.5 |
| WOW outil (lisibilité) | 6 | ~7.5 | ≥ 9 |
| Identité sujet (brand test) | 3 | ~4 | ≥ 8 |

**Top 1 gap WOW restant :** hero encore clone catalogue (orbs + `gradient-hero`) — sans atmosphère **solde → famille**, un ami ne reconnaît pas l’hypothèque en 5 s. Secondaire : gap bandeau `text-xl/2xl` trop petit vs climax attendu `text-3xl+`.

---

## 1. Vision composition (1er viewport)

Une seule composition. Sujet **maison / foyer / écart solde → famille**, différencié par CSS — **pas** photo full-bleed.

| Élément | Spec Vague 2 |
|---------|----------------|
| Brand | Badge « Assurance hypothécaire » + H1 existant (ne pas ajouter 2ᵉ marque) |
| Titre | Garder H1 : *Assurance de la banque ou protection pour la famille ?* |
| Promesse | Inchangée (déjà sujet-spécifique post-P0) |
| CTA group | **Déjà livré** — primaire outil / secondaire RDV (ne pas re-spécifier) |
| Atmosphère | `atmosphere="solde-famille"` — dual-tint CSS (ambre prêteur → émeraude foyer) + grain léger |
| Micro-signaux | `heroExtras` : kicker + 2 chips contraste (voir script) |
| Hero budget | Badge + H1 + promise + dual CTA + extras + atmosphere. Rien d’autre. |

**Brand test :** sans nav, la teinte ambre→émeraude + chips « Solde prêteur / Capital famille » doivent suffire à dire « hypothèque », pas CELIAPP ni MRa.

---

## 2. Atmosphere CSS — `solde-famille`

### Concept
Dégradé narratif **gauche = solde / prêteur (ambre froid)** → **droite = famille / foyer (émeraude chaud)**. Métaphore visuelle du gap sans image.

### Prop shell
```js
// campagneAdsLandings.js
atmosphere: 'solde-famille',
```

### Implémentation `PageHero` (shell V2-S1)

| Couche | Classes / style | Rôle |
|--------|-----------------|------|
| Base | garder `gradient-hero` | Navy prestige inchangé |
| Tint A (gauche) | `absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-amber-500/25 via-amber-400/10 to-transparent` | Zone « solde / banque » |
| Tint B (droite) | `absolute inset-y-0 right-0 w-[55%] bg-gradient-to-l from-emerald-500/20 via-emerald-400/8 to-transparent` | Zone « famille » |
| Grain | `opacity-[0.04]` noise SVG (pattern existant ou overlay partagé shell) | Texture premium, pas flat |
| Orbs | **réduire** opacity orbs génériques à ~40 % quand `atmosphere` est set — sinon clash | Identité > décor catalogue |
| Split hint (optionnel) | ligne diagonale soft `via-white/10` 1 px au centre | Micro-signal « écart » |

**Interdit :** `backgroundImage` hero, photo foyer, collage, floating badges overlay.

### Tokens (pas de palette solo)
- Ambre = tokens déjà utilisés dans l’outil (`amber-400/600`, warn cards)
- Émeraude = tokens côté personnel (`emerald-500/800`)
- Navy / primary / dark / taupe / prestige-beige inchangés

---

## 3. Micro-signaux fold — `heroExtras`

Placement : **sous** la ligne confiance CSF déjà dans le hero, **au-dessus** de la vague. Pas de cards.

| Slot | Visuel | Classes |
|------|--------|---------|
| Kicker | Texte 1 ligne | `text-xs md:text-sm text-white/75 tracking-wide` |
| Chip 1 | « Solde ≈ prêteur » | `rounded-full border border-amber-200/40 bg-amber-500/15 px-3 py-1 text-xs text-amber-50` |
| Chip 2 | « Capital → famille » | `rounded-full border border-emerald-200/40 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-50` |
| Conteneur | flex wrap center gap-2 | **pas** de card ombrée |

Data : `item.heroExtras` (voir script). Rendu générique dans `CampagneAdsLanding` / `PageHero` children — **même composant** pour toutes les campagnes.

---

## 4. Process strip 3 steps

**Remplace le rendu « En bref » en cards ombrées** par un strip process **partagé catalogue** (V2-S3). Les 3 bullets data peuvent rester en source ou migrer vers `processSteps` — UI = strip, pas soup de cards.

### Ordre page (contrat uniforme)
1. Hero (+ atmosphere + heroExtras)
2. En bref (alléger / ou fusionner)
3. **Process 3 steps**
4. Outil
5. Mid soft-close (+ portrait)
6. FAQ

### Classes (shell partagé)
```
nav/ol flex flex-col sm:flex-row gap-4 sm:gap-6
  li: numéro font-heading h-8 w-8 rounded-full bg-primary/10 text-primary
  titre text-sm font-semibold text-dark
  sub text-xs text-prestige-taupe
```
**Pas** 3 cards `shadow-[…] rounded-2xl` — une ligne + numéros seulement.

Libellés : voir `02-script.md`.

---

## 5. Portrait CSF mid SoftClose

| Spec | Valeur |
|------|--------|
| Asset | `/seo/portrait.jpg` **uniquement** (existant) |
| Taille | 48–64 px (`h-12 w-12` ou `h-14 w-14`) `rounded-full object-cover` |
| Placement | Dans le bloc mid navy (`CampagneAdsLanding`), **au-dessus** du H2 ou à gauche du titre sur `sm+` |
| Libellé | `Conseiller en sécurité financière · Victoriaville` — **même string catalogue** |
| Ring | `ring-2 ring-white/30` |

Ne pas inventer une autre photo ni un layout mid one-off.

---

## 6. Climax outil — hiérarchie visuelle P1

### Avant (post-P0 code actuel)
- `ResultCard` capital famille `size="lg"` → `text-3xl md:text-4xl` ✓ partiel
- Bandeau gap : `font-heading text-xl … md:text-2xl` — **trop petit** pour le climax émotionnel
- Barre ambre OK ; SoftClose déjà sous bandeau ✓

### Après Vague 2

| Zone | Spec |
|------|------|
| ResultCard solde | Secondaire — `size` default (`text-2xl`) |
| ResultCard famille | Garder `size="lg"` (`text-3xl md:text-4xl`) |
| **Bandeau gap** | **Héros émotionnel** : `font-heading text-3xl font-bold tabular-nums md:text-4xl lg:text-5xl` + `+{formatCad(auDelaDuPret)}` dominant |
| Micro sous gap | `text-sm text-prestige-taupe` (inchangé sens) |
| Barre | `h-3` (légèrement plus épaisse) ; fill ambre existant ; keyed width reveal |
| SoftClose | **`ToolSoftClose` uniquement** — tone `warn` optionnel pour coller ambre ; **pas** de bandeau CTA custom |

Defaults → chiffre affiché : **+97 000 $** (impossible à manquer).

---

## 7. Motion (2–3, helpers shell partagés)

1. **Keyed bar reveal** — barre gap `width 0 → gapShare%` une fois (IntersectionObserver / `motion` helper catalogue), durée ~500–700 ms `ease-out`.
2. **Fade SoftClose** — opacity 0→1 au mount post-climax (helper partagé, 1×).
3. **Hero extras** — fade-up chips 80–120 ms stagger (optionnel, léger).

Pas de lib motion dédiée #03. Pas de ken burns. Pas de sticky gap.

---

## 8. Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero décor | Orbs + grid génériques | `atmosphere="solde-famille"` dual-tint ambre→émeraude + grain | `PageHero.jsx`, data |
| Fold micro | Ligne CSF seule | + `heroExtras` kicker + 2 chips | `CampagneAdsLanding.jsx`, data |
| En bref | 3 cards ombrées | Process strip 3 steps (composant partagé) | landing + data `processSteps` |
| Mid navy | Headline OK, pas de visage | + portrait 48–64px + libellé CSF | `CampagneAdsLanding.jsx` |
| Gap bandeau | `text-xl md:text-2xl` | `text-3xl md:text-4xl lg:text-5xl` | `AssuranceHypothecaireTool.jsx` |
| SoftClose | `ToolSoftClose` sous gap ✓ | Inchangé composant ; motion fade shell | — |

---

## 9. Backlog visuel

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| V-1 | Shell `PageHero` prop `atmosphere` + map `solde-famille` | M | P0-v2 |
| V-2 | `heroExtras` render générique (chips + kicker) | S | P0-v2 |
| V-3 | Process strip composant partagé + data #03 | S | P0-v2 |
| V-4 | Portrait mid SoftClose catalogue | S | P0-v2 |
| V-5 | Gap bandeau typo XXL + barre `h-3` + keyed reveal | S | P0-v2 |
| V-6 | Fade SoftClose helper partagé | S | P1 |

---

## 10. Critères acceptation visuelle

- [ ] Sans nav : teinte + chips disent « hypothèque / famille »
- [ ] `+97 000 $` (defaults) est le plus gros chiffre émotionnel de la page (`text-3xl+`)
- [ ] Process strip = même look que les autres campagnes V2 (seuls les libellés changent)
- [ ] Portrait = `/seo/portrait.jpg` 48–64px, libellé CSF catalogue
- [ ] Aucune photo new ; aucun SoftClose custom
- [ ] Mobile 390 : climax atteignable sans ouvrir le `<details>` tableau
