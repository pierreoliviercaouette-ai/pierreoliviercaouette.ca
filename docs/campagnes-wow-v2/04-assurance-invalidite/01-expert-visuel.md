# [#04] Expert marketing visuel — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** rebuild `00-PM-brief-final` · `InvaliditeTool.jsx` · `CampagneAdsLanding.jsx` · `PageHero.jsx` · `_ROLES.md` V2  
**Note visuelle post-P0 /10 :** 7 → cible **8,5** (chrome sujet CSS, pas photo)

---

## 1. Verdict post-P0 (1 paragraphe)

P0 a livré le pont booker (`ToolSoftClose` RDV + PDF ghost), le duo Trou \| Coussin, les chips délai, le mid `ctaHeadline`/`ctaSubline`, et le hero outil-first. Il reste un fold **générique** (`PageHero` orbs navy catalogue) et un SoftClose **trop bas** (footer shell, après Block 2) — le pic émotionnel duo n’a pas le CTA collé dessus. Aucune photo à acheter : l’identité sujet = **teinte livret / talon de paie CSS**. Portrait CSF existant au mid. Motion manquante : pulse ambre sur warn.

---

## 2. Spec hero — atmosphere CSS `livret-paie` (pas de photo)

### Prop shell
```
PageHero atmosphere="livret-paie"
// ou item.atmosphere: 'livret-paie' → CampagneAdsLanding → PageHero
```

### Tint / texture (Tailwind + overlays CSS-only)

| Couche | Spec | Classes / technique |
|--------|------|---------------------|
| Base | Garder `gradient-hero` | Inchangé |
| Teinte papier | Overlay chaud « talon de paie » | `absolute inset-0 bg-gradient-to-br from-amber-900/25 via-transparent to-primary/40` |
| Lignes livret | 4–6 traits horizontaux très discrets (style feuille RH) | Pseudo `repeating-linear-gradient` opacity 0.04–0.06, `pointer-events-none` |
| Grain papier | Noise SVG data-URI léger | `opacity-[0.04]` (même pattern que grille actuelle, teinte crème) |
| Orbs | Réduire orbs génériques **ou** teinter secondary → ambre soft | `--glow: rgba(245, 158, 11, 0.12)` sur 1 orb max |

**Interdit :** `backgroundImage` photo, hôpital, brancard, mock PDF photo, shoot.

### Micro-signaux fold (`heroExtras`)

| Slot | Contenu | Classes |
|------|---------|---------|
| Kicker sujet | `Livret · paie · délai` | `text-xs uppercase tracking-[0.14em] text-white/70` sous badge |
| Chips contraste (2) | `% remplacé` · `Jours d’attente` | Pills `border border-white/25 bg-white/10 text-white/90 text-xs` — **pas** stickers flottants sur media |

Même composant `heroExtras` que les 14 autres ; seuls libellés + atmosphere changent.

### Avant → Après hero

| Avant (code actuel) | Après (Vague 2) | Fichiers |
|---------------------|-----------------|----------|
| `PageHero` orbs navy clone | `atmosphere="livret-paie"` + overlays CSS | `PageHero.jsx`, `CampagneAdsLanding.jsx`, `campagneAdsLandings.js` |
| Aucun `heroExtras` | Kicker + 2 chips sujet | data + landing |
| Dual CTA déjà P0 | **Garder** variantes boutons shell (blanc primary outil / ghost RDV) | — ne pas reinventer |

H1 / promise : **garder** (déjà sujets). Brand test 5 s = teinte papier + chips « % / délai », pas une photo.

---

## 3. Process strip (sous En bref)

**Composant shell unique** (même classes catalogue) — 3 steps micro-line :

1. `4 chiffres`  
2. `Trou + coussin`  
3. `Livret en 15 min`

Placement : sous la liste En bref, avant « À toi de jouer ».  
Classes : strip horizontal `text-sm text-prestige-taupe` + séparateurs `→` ou dots shell — **pas** 3 cards supplémentaires.

---

## 4. Portrait CSF (mid SoftClose)

| Spec | Valeur |
|------|--------|
| Asset | `/seo/portrait.jpg` (existant) |
| Taille | 48–64 px, `rounded-full`, ring `ring-2 ring-white/30` |
| Libellé | `Conseiller en sécurité financière · Victoriaville` (identique catalogue) |
| Placement | Dans le **bandeau mid** navy (après outil), à gauche ou au-dessus du H2 — **même pattern** que les 14 autres |
| Interdit | Autre photo, avatar stock, photo full-bleed |

---

## 5. Outil — hiérarchie visuelle Vague 2

### SoftClose sous duo snapshot (placement — spec outil)

| Avant | Après |
|-------|-------|
| `ToolSoftClose` dans `footer` du shell (sous Block 2) | `ToolSoftClose` **immédiatement sous** le duo + barre couverture ; `footer={null}` ou invite saisie seulement |
| Composant | **Toujours** `ToolSoftClose` partagé — pas de bandeau custom invalidité |

Tone SoftClose : `tone="warn"` si `gapWarn \|\| coussinWarn`, sinon `default` (jamais émeraude « t’es couvert »).

### Snapshot / typo climax

| Zone | Spec |
|------|------|
| Chiffres duo | `font-heading text-3xl md:text-4xl font-bold tabular-nums` (échelle catalogue climax — monter depuis `text-2xl` actuel) |
| Labels | `text-xs font-semibold uppercase tracking-wide text-secondary` |
| Barre | Garder `transition-all duration-500` |
| Block 2 | Tokens prestige inchangés ; option P2 compresser redondance |

### Motion climax (2–3 — helpers shell)

1. **Warn pulse** : sur `SnapshotCell` quand `gapWarn` / coussin change — `animate-pulse` court (≈400–600 ms) **ou** helper shell `keyedReveal` + `ring-amber-300/60` one-shot. Pas Framer one-off.  
2. **Fade SoftClose** : helper partagé fade-in quand SoftClose apparaît sous duo.  
3. **Barre** : garder transition existante (keyed width).

---

## 6. Soft close mid (bandeau navy)

- Structure / boutons : **inchangés** (shell).  
- Ajout Vague 2 : portrait + libellé CSF (ci-dessus).  
- Copy : déjà P0 (`ctaHeadline` / `ctaSubline`) — ne pas redesign mid.

---

## 7. Palette / tokens

| Token | Usage |
|-------|-------|
| Prestige / primary / secondary | Page, cards, CTAs — **pas** de palette solo |
| Ambre (`amber-50` → `500`) | Warn trou/coussin + pulse + teinte atmosphere légère |
| Emerald | Uniquement marge $ ≥ 0 sur snapshot — jamais « couverture réelle » |
| Atmosphere | Teinte overlay **seulement** dans hero |

---

## 8. Mobile

| Zone | Règle |
|------|-------|
| Hero chips | Wrap `flex-wrap justify-center gap-2` |
| Process | 1 ligne scrollable ou stack `→` lisible thumb |
| Duo + SoftClose | Duo `grid-cols-2` ; SoftClose full-width juste dessous (ordre émotionnel) |
| Portrait mid | 48 px mobile, libellé wrap |

---

## 9. Fichiers à toucher (visuel)

| Fichier | Changement V2 |
|---------|---------------|
| `PageHero.jsx` | Prop `atmosphere` + variantes CSS (`livret-paie`) — **shell partagé** |
| `CampagneAdsLanding.jsx` | Brancher `item.atmosphere`, `heroExtras`, `processSteps`, portrait mid |
| `campagneAdsLandings.js` | Champs data #04 |
| `InvaliditeTool.jsx` | SoftClose sous duo ; typo 3xl/4xl ; warn pulse |
| `CampagneToolShell.jsx` | Helpers motion SoftClose fade / keyed reveal si pas déjà |

---

## 10. Critères acceptation visuelle

- [ ] Sans nav, 1ʳᵉ viewport **sent** livret/paie (teinte CSS) — pas template CSF clone  
- [ ] Aucune nouvelle photo  
- [ ] Process 3 steps = même composant catalogue  
- [ ] Portrait mid = `/seo/portrait.jpg` + libellé CSF identique  
- [ ] SoftClose = `ToolSoftClose` sous duo (pas footer custom)  
- [ ] Climax chiffres `font-heading` text-3xl/4xl  
- [ ] Warn pulse visible au change trou/coussin  
- [ ] Ami en 5 s : « trou + coussin → livret »
