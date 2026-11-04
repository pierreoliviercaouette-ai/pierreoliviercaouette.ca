# [#09] CELI droits — Expert marketing visuel

**Slug :** `/campagnes/celi-droits`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Rôle :** Expert marketing visuel  
**Sources :** code post-P0 (`CeliDroitsTool.jsx`, `campagneAdsLandings.js`, `CampagneAdsLanding.jsx`, `PageHero.jsx`) · rebuild `../campagnes-wow-rebuild/09-celi-droits/`  
**Contrainte :** **pas de photos** — atmosphère CSS + micro-signaux + portrait existant `/seo/portrait.jpg`.

---

## Rescore post-P0 (visuel)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience fold | 5,5 | ~7 | ≥ 8,5 |
| Identité sujet | 4 (orbes génériques) | 4,5 | ≥ 8 |
| Climax lisible | 6 | **8** (split 7k/84k + chips) | ≥ 8,5 |

**Fait P0 (ne pas re-spécifier) :** dual CTA outil-first · split plafond vs place · chips usage · `ToolSoftClose` · pastille sans compte dans l’outil · mid `ctaHeadline`/`ctaSubline`.

**Top 1 gap WOW restant (visuel) :** le fold **ne sent toujours pas** « place restante / mythe plafond » — `PageHero` clone navy/orbes, zéro `heroExtras`, zéro process, zéro portrait CSF au mid.

---

## 1. Direction visuelle (1 phrase)

**Capacité inutilisée :** teinte navy froide + wash clair horizontal (slot / place vide), micro-chips contraste plafond vs place au fold, process 3 steps, portrait CSF au mid — climax outil déjà fort, polish scenic **léger** seulement.

---

## 2. Atmosphere CSS — `place-restante`

Prop data : `atmosphere: 'place-restante'` → `PageHero` (shell V2-S1).

| Couche | Spec Tailwind / CSS | Intention |
|--------|---------------------|-----------|
| Base | Garder `gradient-hero` | Cohérence catalogue |
| Tint | Overlay `bg-gradient-to-br from-sky-400/10 via-transparent to-secondary/15` | Froid « droits / capacité » ≠ foyer CELIAPP |
| Texture | Grain SVG opacity `0.04` + soft vignette `radial-gradient(ellipse at 70% 40%, transparent 40%, rgba(1,35,63,0.35) 100%)` | Profondeur sans photo |
| Motif sujet | Bande horizontale décorative (faux « slot ») : `absolute` bottom-1/3, `h-px` → `h-8` blur, `bg-white/10` + highlight `from-white/20` à gauche (vide) → `to-secondary/25` à droite — **pas** un vrai progressbar live | Hint « place à remplir » |
| Interdit | `backgroundImage` photo, collage, floating cards, stickers | Choix verrouillé V2 |

**Fichiers :** `PageHero.jsx` (prop `atmosphere`) · `campagneAdsLandings.js` (`atmosphere: 'place-restante'`) · éventuellement `CampagneAdsLanding.jsx` passe-through.

---

## 3. `heroExtras` — micro-signaux fold

Sous la promesse / au-dessus des CTAs (enfants `PageHero`), **pas** de cards :

```
[ Plafond année ]     [ Place restante ]
    7 000 $                  ?
  text-white/65            text-white font-heading
  text-sm                  text-lg / tabular-nums
```

| Élément | Spec |
|---------|------|
| Conteneur | `flex flex-wrap items-end justify-center gap-6 sm:gap-10` |
| Chip plafond | Label uppercase `text-[10px] tracking-wide text-white/55` + `7 000 $` décoratif (non-live) |
| Chip place | Label `Place restante` + `?` en `font-heading text-xl text-white` — teaser Ad1 |
| Séparateur | `w-px h-8 bg-white/25` entre les deux (desktop) |
| Pastille trust | Déjà en tool ; option fold : reprendre `Sans compte · estimation` en `text-xs text-white/70` **si** shell catalogue l’accepte via `heroExtras.trust` — sinon laisser tool-only |

**Data :** `heroExtras: { kind: 'contrast-chips', left: { label, value }, right: { label, value } }` — même schéma shell que les autres campagnes (valeurs textuelles seulement).

---

## 4. Process strip (3 steps)

Sous **En bref**, avant `#outil` — **même composant shell** (`processSteps`) :

| # | Libellé court | Hint (optionnel 1 ligne) |
|---|---------------|--------------------------|
| 1 | Estime ta place | Naissance + déjà cotisé |
| 2 | Colle un usage | Urgence · projet · long terme |
| 3 | Clarifie 15 min | Soft — ≠ cotiser demain |

Classes : tokens prestige partagés (numéro `bg-primary/10`, card blanche douce) — **aucun** style solo #09.

---

## 5. Portrait CSF — mid SoftClose

| Spec | Valeur |
|------|--------|
| Asset | `/seo/portrait.jpg` **uniquement** |
| Taille | 48–64px (`h-12 w-12` ou `h-14 w-14`), `rounded-full`, `object-cover` |
| Placement | Au-dessus ou à gauche du titre mid navy (shell) — **pas** dans le hero |
| Libellé | `CSF · Victoriaville` (identique catalogue) |
| Sous-ligne optionnelle | Réutilise `ctaSubline` existant — ne pas inventer un 2ᵉ bloc confiance |

---

## 6. Motion (2–3) — climax scenic **léger**

1. **Keyed place restante** — sur update `placeRestante` : `key={placeRestante}` + `animate-in fade-in zoom-in-95 duration-300` (helper shell) sur le gros $.
2. **Fade SoftClose** — quand `usage` change : fade-in 200–300 ms du `ToolSoftClose` (helper partagé — pas framer one-off).
3. **Barre place utilisée** — déjà `transition-all duration-500` : **garder**, ne pas empiler.

Éviter : confettis, glow purple, parallax, 2ᵉ orbe custom.

---

## 7. Avant → Après

| Zone | Avant (code actuel post-P0) | Après Vague 2 | Fichiers |
|------|----------------------------|---------------|----------|
| Hero | `PageHero` orbes génériques | `atmosphere="place-restante"` CSS | `PageHero.jsx`, data |
| Fold extras | Aucun | Contraste chips `7 000 $` vs `?` | `CampagneAdsLanding.jsx`, data `heroExtras` |
| Process | Absent | Strip 3 steps catalogue | shell + `processSteps` data |
| Mid | Headline OK, pas de face | Portrait 48–64px + CSF · Victoriaville | `CampagneAdsLanding.jsx` |
| Climax outil | Split + chips OK | Reveal léger keyed + SoftClose fade | `CeliDroitsTool.jsx` + helpers shell |

---

## 8. Mobile

| Zone | Spec |
|------|------|
| heroExtras | Stack 2 lignes centrées ; séparateur vertical masqué |
| Process | 3 rows ou scroll horizontal **si** le shell catalogue le définit ainsi — suivre le composant partagé |
| Portrait mid | Au-dessus du H2, centré |
| Outil | Chips déjà ≥44px — ne pas retoucher layout P0 |

---

## 9. Critères acceptation VISUEL V2

- [ ] En 5 s sans lire le H1 : on sent « place / capacité CELI », pas une page générique orbes
- [ ] Zéro nouvelle photo ; atmosphere 100 % CSS
- [ ] `heroExtras` contraste plafond vs place visible au fold
- [ ] Process 3 steps + portrait mid identiques au système catalogue
- [ ] Climax : motion léger seulement — split/chips P0 inchangés structurellement

**Note cible post-V2 :** Expérience fold ≥ 8,5 · Identité sujet ≥ 8
