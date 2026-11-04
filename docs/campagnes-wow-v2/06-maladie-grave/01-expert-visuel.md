# [#06] Maladie grave — Spec VISUEL (Vague 2 post-P0)

**Slug :** `/campagnes/maladie-grave`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** `_ROLES.md` · rebuild 06 · `PageHero` · `CampagneAdsLanding` · `MaladieGraveTool.jsx`

**Verdict post-P0 :** Expérience visuelle **6,5/10**. SoftClose + contraste 2 cols in-tool + dual CTA = livrés. La page reste un **shell navy clone** : sans badge, un ami ne reconnaît pas « capital forfaitaire ≠ chèque de paie ». Écart amber encore `text-lg` — sous-climax vs capital `text-3xl/4xl`.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 6,5 | ≥ 8 |
| WOW outil | 6,5 | 7,5 | ≥ 8,5 |
| Env. booker | 4,5 | 6,5 | ≥ 7,5 |

**Top 1 gap WOW restant :** atmosphère CSS « capital » + écart typo climax (`text-3xl+`) — pas de nouvelles photos.

---

## Interdits Vague 2 (ne pas re-spécifier)

- SoftClose / PDF ghost / dual CTA hero / `ctaHeadline` mid
- Chips hero `Invalidité | MG` (déjà prouvés in-tool `mg-contrast`)
- Shoot / `backgroundImage` full-bleed / imagerie médicale

---

## 1. Atmosphere CSS — pilote « capital ≠ invalidité »

**Job :** en 3 s, le hero *pèse* comme une somme forfaitaire — pas comme un revenu mensuel (#04).

| Prop | Valeur proposée |
|------|-----------------|
| `item.atmosphere` | `capital-forfaitaire` |
| Tint | Navy prestige + wash ambre/or très léger (`from-amber-500/[0.08]` → transparent) — poids « lump sum », **pas** le teal/revenu d’invalidité |
| Texture | Grain CSS subtil `opacity-[0.04]` + grille existante PageHero |
| Overlay | Soft vignette bas → blanc (wave inchangée) |
| Interdit | Photo, hôpital, ECG, purple glow |

**Avant :** `gradient-hero` générique catalogue.  
**Après :** même shell PageHero + layer `data-atmosphere="capital-forfaitaire"` (classes Tailwind / CSS var).

Sans le nav : un ami doit encore sentir « grosse somme une fois », pas « trou de paie mensuel ».

---

## 2. `heroExtras` — micro-signaux (≠ chips Invalidité\|MG)

Le contraste 2 jobs vit **dans l’outil** (`mg-contrast`). Le fold hero ne le duplique pas.

| Slot | Contenu |
|------|---------|
| Kicker (1 ligne) | `Capital forfaitaire · une fois · si le contrat s’applique` |
| Chip optionnel A | `3 blocs → ordre de grandeur` |
| Chip optionnel B | `Complète l’invalidité` |

Style catalogue (identique aux autres campagnes) :
```
text-xs text-white/85 · border-white/25 · bg-white/10 · rounded-full px-3 py-1
```
Mobile : kicker seul OK ; chips stack max 2. **Pas** de sticker overlay.

---

## 3. Process strip 3 steps (sous En bref)

Même composant / classes shell — seuls les libellés changent.

| # | Label court | Sous-ligne |
|---|-------------|------------|
| 1 | Estime ton capital | 3 blocs illustratifs |
| 2 | Lis l’écart | vs déjà couvert |
| 3 | Clarifie 15 min | brochure · Clarifier ≠ acheter |

Placement : après En bref, avant `#outil`. Pas de cards hero ; strip horizontal desktop, stack mobile.

---

## 4. Portrait CSF mid

| Élément | Spec |
|---------|------|
| Src | `/seo/portrait.jpg` (existant — **pas** de shoot) |
| Taille | 48–64 px, `rounded-full`, ring `ring-2 ring-white/30` |
| Placement | Bloc mid navy soft-close (sous headline / près CTA) |
| Libellé | `Conseiller en sécurité financière · Victoriaville` |
| Uniformité | Même vignette + même libellé que les 14 autres |

---

## 5. Motion (2–3 — helpers shell)

1. **Keyed reveal écart** : quand `ecart` change → fade/slide-up 200–300 ms sur le chiffre écart (`prefers-reduced-motion: reduce` = instant).
2. **Fade SoftClose** : apparition douce du bloc `ToolSoftClose` au mount quand `hasCapital` (helper partagé).
3. **Option** : léger pulse border amber 1× sur bandeau écart (pas de loop).

Pas de lib motion one-off.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero chrome | Navy générique | `atmosphere: capital-forfaitaire` tint ambre + grain | `PageHero.jsx` + `campagneAdsLandings.js` |
| Fold micro | CSF line seule | `heroExtras` kicker capital + 1–2 chips (pas Invalidité\|MG) | `CampagneAdsLanding.jsx` |
| Post En bref | Direct outil | Process 3 steps shell | `CampagneAdsLanding.jsx` + data |
| Mid | Copy OK, 0 humain | Portrait 48–64 + libellé CSF | mid navy |
| Écart | `text-lg` | `font-heading text-3xl sm:text-4xl` | `MaladieGraveTool.jsx` |
| Motion | 0 | Reveal écart + fade SoftClose | tool + helpers shell |

---

## Backlog visuel

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| V-1 | Atmosphere `capital-forfaitaire` | M | P0-v2 (shell) |
| V-2 | `heroExtras` kicker + chips | S | P0-v2 |
| V-3 | Process strip 3 steps | S | P0-v2 (shell) |
| V-4 | Portrait mid 48–64 | S | P0-v2 (shell) |
| V-5 | Motion reveal écart + fade SoftClose | S | P1 |
| V-6 | Hint SCC condensé mobile | S | P2 |

---

## Critères acceptation VISUEL

- [ ] En 5 s, ami reconnaît « capital forfaitaire » (atmosphere + kicker), pas un hero CSF clone
- [ ] Aucune chip hero Invalidité \| MG (contraste = outil)
- [ ] Process 3 steps visible entre En bref et outil
- [ ] Portrait `/seo/portrait.jpg` mid + libellé CSF catalogue
- [ ] Écart lisible `text-3xl+` dans le même viewport que SoftClose
- [ ] 0 nouvelle photo
