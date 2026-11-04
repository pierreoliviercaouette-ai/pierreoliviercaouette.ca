# [#14] Succession — bases — Expert marketing visuel

**Slug :** `/campagnes/succession-bases`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** code post-P0 (`CampagneAdsLanding.jsx`, `PageHero.jsx`, `SuccessionChecklistTool.jsx`, `campagneAdsLandings.js`), rebuild `../campagnes-wow-rebuild/14-succession-bases/`, ads `emails/campagne-meta-catalog/succession-bases.md`  
**Choix verrouillé :** pas de nouvelles photos — atmosphère CSS « dossier », micro-signaux, portrait `/seo/portrait.jpg`  
**Note visuelle post-P0 /10 :** 6,5 → cible Vague 2 **8+**

---

## Rescore post-P0 (visuel)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience page | 5,5 | ~7 | 8 |
| Identité sujet | 4 | 4,5 (H1 Ad1 OK, chrome clone) | 8 |
| Confiance humaine | 4 | 5 (ligne texte CSF) | 7,5 |

**Top 1 gap WOW restant (visuel) :** le hero reste un clone navy/orbes — zéro signal « dossier / liquidité ≠ actifs ». Manque aussi le **module CSF \| Notaire** et le **process strip** catalogue.

---

## Interdits (ne pas re-spécifier)

- SoftClose outil / PDF ghost (livré sous portrait)
- Dual CTA hero outil-first (livré)
- Mid `ctaHeadline` / `ctaSubline` Ad3 (livré)
- Shoot / achat photos full-bleed

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers / classes |
|------|---------------------|-----------------|--------------------|
| Hero atmosphère | `PageHero` orbes génériques | `atmosphere: 'dossier'` — texture papier / lignes dossier légères, grain soft, teinte navy→beige dossier ; watermark contraste « actifs ≠ cash » opacity ≤ 0,08 ; **jamais** funéraire | `PageHero.jsx` + `item.atmosphere` dans `campagneAdsLandings.js` |
| Micro-signaux fold | Ligne confiance texte seule | `heroExtras` : 2 chips contraste `Liquidité` · `Notaire` + kicker « Checklist · sans compte » | `CampagneAdsLanding.jsx` / slot `PageHero` children |
| Process 3 steps | Absent | Strip shell sous En bref : ① Coche ② Portrait des trous ③ 15 min CSF **ou** notaire | `item.processSteps` + composant shell partagé |
| Module CSF \| Notaire | Scale « vois un notaire » fin de liste seulement | Bloc 2 colonnes **sous l’outil, avant mid** — CSF `from-primary/[0.04]` vs Notaire `bg-prestige-beige/40` ; **pas** cards lourdes / pas rouge danger | Section landing ou wrapper post-`#outil` |
| Portrait mid | Absent au mid | Vignette `/seo/portrait.jpg` 48–64px + libellé `Conseiller en sécurité financière · Victoriaville` dans bandeau mid SoftClose | `CampagneAdsLanding.jsx` mid |
| Motion | Progress bar + `animate-fade-in` portrait | + fade SoftClose shell ; keyed reveal carte Trous (`key={missingCount}`) ; **pas** orbes animés | helpers motion shell + `SuccessionChecklistTool.jsx` |

---

## Hero — atmosphère CSS « dossier »

| Prop / token | Spec |
|--------------|------|
| `atmosphere` | `'dossier'` (ou `'succession-dossier'`) |
| Tint | Overlay radial `prestige-beige` 6–10 % coin bas-droit + navy inchangé |
| Texture | Pseudo-élément lignes horizontales 1px `white/5` espacées ~14px **ou** noise SVG data-uri opacity 0,04 |
| Motif sujet | Deux colonnes fantômes typographiques `ACTIFS` / `CASH` en `font-heading` tracking large, opacity ≤ 0,08 — lisible seulement en pause |
| Interdit | `backgroundImage` photo, cercueil, croix, fleurs, silhouette funéraire |

**Brand test :** après retrait de la nav, l’écran doit encore dire « succession / checklist / liquidité », pas « n’importe quelle campagne iA ».

---

## `heroExtras` (fold)

```js
heroExtras: {
  kicker: 'Checklist · sans compte',
  chips: ['Liquidité ≠ papier', 'CSF · Notaire'],
}
```

Rendu : chips outline blanc/35 sous CTAs, **au-dessus** de la ligne confiance existante. Pas de badges flottants sur media.

---

## Process strip (contrat catalogue)

Même composant / classes que les 14 autres — seuls les libellés changent :

1. **Coche ce qui est vrai**
2. **Portrait des trous**
3. **15 min CSF ou notaire**

Placement : **après En bref, avant `#outil`**. Desktop : 3 colonnes légères ; mobile : stack numéroté. Zéro cards shadow.

---

## Module visuel CSF vs notaire (spécifique #14)

| Colonne | Fond | Titre (script) | Signal |
|---------|------|----------------|--------|
| Gauche | `bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05]` | Avec moi (15 min) | Icône existante lucide ok (User / Shield) — pas photo custom |
| Droite | `bg-prestige-beige/40` | Avec le notaire | Scale déjà dans l’outil — réutiliser Scale |

Grid `sm:grid-cols-2`, gap 3–4, padding px-4 py-4, `rounded-2xl` tokens prestige. Ce module **différencie le sujet** sans inventer un SoftClose one-off.

---

## Portrait CSF (shell)

| Slot | Spec |
|------|------|
| Mid SoftClose | `img` `/seo/portrait.jpg` 48–64px `rounded-full`, alt « Pierre-Olivier Caouette », + `Conseiller en sécurité financière · Victoriaville` |
| SoftClose outil | Pas d’obligation portrait si mid l’a — éviter double ; **priorité mid** (contrat catalogue) |

---

## Motion climax (2–3)

1. **Keyed Trous** : `ResultCard` Trous `key={`trous-${missingCount}`}` + fade/slide shell helper  
2. **SoftClose fade** : helper partagé à l’apparition (`count ≥ 1`)  
3. **Progress** : garder `transition-all duration-500`

Éviter confetti, pulse funéraire, motion libs locales.

---

## Mobile

| Zone | Spec |
|------|------|
| Hero chips | Wrap 2 lignes max, pas de scroll horizontal |
| Process | Stack 1→3, thumb-friendly |
| Outil | Cases avant portrait : `flex-col-reverse md:flex-col` **ou** portrait déjà gated `count ≥ 1` (déjà) — V2 = confirmer cases dans 1er écran outil |
| Module CSF\|Notaire | Stack ; CSF d’abord |
| Mid + portrait | Portrait au-dessus du H2 mid, CTA full-width |

---

## 3 upgrades visuels WOW (priorisés Vague 2)

| # | Avant | Après | Effort |
|---|-------|-------|--------|
| 1 | Hero clone | `atmosphere: 'dossier'` + `heroExtras` chips | M (shell) + S (data) |
| 2 | Pas de process | `processSteps` ×3 sous En bref | S (shell + data) |
| 3 | Scale seul | Module CSF \| Notaire + portrait mid `/seo/portrait.jpg` | S–M |

---

## Hors scope

- Nouvelles photos / stock funéraire  
- Refonte SoftClose / dual CTA / mid copy (P0)  
- Commit / code (ce livrable = spec)
