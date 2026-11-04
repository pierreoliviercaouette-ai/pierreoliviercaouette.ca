# [#11] Expert marketing visuel — Assurance collective (employé)

**Slug :** `/campagnes/assurance-collective`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Persona :** Employé·e 28–50 ans (Québec) — livret PDF RH, carte en poche. **≠ PME, ≠ MRa `#15`.**  
**Choix verrouillé :** pas de nouvelles photos → atmosphere CSS + portrait `/seo/portrait.jpg`.

---

## Rescore post-P0 (visuel)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience chrome | 5.5 | 7.0 | ≥ 8.5 |
| Identité sujet (5 s) | 4 | 5.5 | ≥ 8 |
| Climax lisible | 4 | 7.0 | ≥ 9 |

**Top 1 gap WOW restant :** page encore **template catalogue** (orbs + grille PageHero) — ne « sent » pas le livret RH ; `missingCount` existe (`text-3xl/4xl` ambre) mais n’occupe pas encore le fold outil comme un héros.

---

## Interdits Vague 2 (ne pas re-spécifier)

- SoftClose flous / PDF ghost (déjà livré)
- Dual CTA hero outil-first (déjà livré)
- `ctaHeadline` / `ctaSubline` mid (déjà livré)
- Shoot / achat photos full-bleed

---

## Spec visuelle CSS-only

### 1. Hero `atmosphere: 'livret'`

Prop data → `PageHero` (shell V2-S1) — **pas** de `backgroundImage`.

| Couche | Spec Tailwind / CSS |
|--------|---------------------|
| Tint | Overlay document : `bg-gradient-to-br from-amber-900/20 via-transparent to-primary/90` par-dessus `gradient-hero` |
| Texture | Grain papier SVG opacity `0.04–0.06` (remplace ou s’ajoute à la grille orbs à opacité réduite) |
| Accent flous | Halo ambre discret bas-droite (`amber-400/15`) — signal « cases à vérifier », pas glow marketing |
| Orbs | Garder 1 orb max, opacity ↓ 40 % — anti-clone sans casser le système |

**Brand test 5 s :** sans la nav → *employé + livret RH / PDF*, pas landing CSF générique, **pas** atelier PME / MRa.

### 2. Micro-signaux fold (`heroExtras`)

Sous confiance CSF (déjà en place), chips horizontales (wrap mobile) — **pas** de cards :

| Chip | Rôle |
|------|------|
| `Paliers invalidité` | Match Ad2 |
| `Livret ≠ carte` | Gate mental |
| `Cases floues → 15 min` | Pont soft close |

Classes partagées shell : `rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/85`.  
Option kicker 1 ligne : *« Checklist employé — pas une offre PME »* (ambre/white 80 %).

### 3. Process strip 3 steps

**Placement catalogue :** après En bref, **avant** `#outil` (contrat Uniformité).

Même composant / classes que les 14 autres ; seuls les libellés changent (voir `02-expert-script.md`) :

1. Tu apportes ton livret  
2. On repère les cases floues  
3. 15 min si trou — clarifier ≠ acheter  

Icônes lucide partagées : `FileText` / `AlertTriangle` / `Calendar`.  
Mobile : stack vertical, gap token prestige.

### 4. Portrait CSF mid SoftClose

- Source unique : `/seo/portrait.jpg` (48–64 px, `rounded-full`, ring `ring-2 ring-white/30`)
- Libellé **identique catalogue** : `Conseiller en sécurité financière · Victoriaville`
- Placement : **bloc mid** (navy soft-close page) — vignette à gauche du H2 ou au-dessus du CTA blanc
- **Interdit :** photo inset hero, collage, portrait différent par campagne

### 5. Motion climax (2–3 — helpers shell)

1. **Keyed reveal** chiffre `missingCount` : `key={missingCount}` + fade/scale 200 ms (`motion-safe:`)  
2. **Fade SoftClose** quand `showSoftClose` passe true (helper shell partagé)  
3. **Pulse 1×** ResultCard Invalidité `tone=warn` au premier passage partiel (respect `prefers-reduced-motion`)

Pas de Framer/lib solo.

---

## Climax outil — plus dominant (visuel)

État P0 : `text-3xl sm:text-4xl` ambre OK mais encore « progress label ».

**Après V2 :**

| Élément | Spec |
|---------|------|
| Chiffre | `font-heading text-4xl sm:text-5xl font-bold tracking-tight text-amber-700` — échelle catalogue climax |
| Zone | Fond ambre léger `from-amber-50/90 to-white` + `border border-amber-200/80` round-2xl — même tokens SoftClose warn |
| Sous-ligne | Cases **nommées** en taupe (script) — pas seulement `done/total` |
| Barre | Garder `duration-500` ; largeur keyed sur `progress` |

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero | `PageHero` orbs + grille génériques | `atmosphere: 'livret'` tint/grain + orbs atténués | `PageHero.jsx`, `campagneAdsLandings.js` |
| Fold | Badge + H1 + dual CTA + confiance | + `heroExtras` 3 chips livret | `CampagneAdsLanding.jsx` |
| Process | Absent | Strip 3 steps shell après En bref | `CampagneAdsLanding.jsx` + `item.processSteps` |
| Mid | Navy card + headlines data | + portrait 48–64 px + libellé CSF | `CampagneAdsLanding.jsx` |
| Climax flous | `text-3xl/4xl` ambre plain | Bloc ambre + `text-4xl/5xl` + keyed motion | `CollectiveChecklistTool.jsx` |

---

## Critères d’acceptation visuelle

- [ ] Ami en 5 s : *livret employé / cases floues* — zéro lecture MRa/PME
- [ ] Atmosphere CSS only (pas de photo full-bleed)
- [ ] Process + portrait = composants catalogue (mêmes classes)
- [ ] Climax `missingCount` = plus gros élément typo de l’outil
- [ ] SoftClose = `ToolSoftClose` existant (pas de bandeau custom)

---

## Effort

| Item | Effort | Scope |
|------|--------|-------|
| Atmosphere `livret` | M | Shell `PageHero` + data slug |
| heroExtras chips | S | Shell + data |
| Process strip | S | Shell + 3 labels data |
| Portrait mid | S | Shell catalogue |
| Climax XXL + motion | S–M | Outil + helper motion shell |
