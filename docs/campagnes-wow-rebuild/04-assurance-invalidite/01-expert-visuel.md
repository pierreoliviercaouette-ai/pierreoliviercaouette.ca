# [#04] Expert marketing visuel — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/04-assurance-invalidite.md` · live · `InvaliditeTool.jsx` · `CampagneAdsLanding.jsx` · `PageHero.jsx` · ads Meta  
**Note visuelle actuelle /10 :** 6 → cible **8,5**

---

## 1. Verdict visuel (1 paragraphe)

La page **parle** (H1 Ad1 fort) mais **ne sent** pas le sujet : `PageHero` navy/orbs génériques, zéro ancrage paie/livret/bureau. L’outil est la meilleure composition (snapshot + steps + cards ambre), mais le climax est **sous-pondéré** (trou seul en haut ; coussin enterré en Block 2) et le next step visuel = bouton PDF primary full-width — le RDV n’existe pas au pic émotionnel. Soft close mid = bandeau navy clone catalogue. WOW outil oui ; identité sujet + pont booker = non.

---

## 2. Spec hero (1 viewport)

### Composition cible (brand test)
| Slot | Spec |
|------|------|
| Atmosphère | Full-bleed photo **bureau / livret RH / enveloppe paie QC** (pas hôpital). Overlay navy `from-primary/90 via-dark/75 to-dark/85`. Brief ads : `emails/campagne-meta-catalog/visuels/invalidite-feed.jpg` comme référence ton. |
| Brand | Badge pill existant « Invalidité » + sous-badge texte 1 ligne : `Conseiller · Victoriaville · éducatif` (sous H1 ou sous CTA). |
| H1 | **Garder** : « Si le salaire s’arrête : le trou de ton assurance collective » |
| Promesse | 1 phrase (voir script) — max ~2 lignes mobile |
| CTA group | **Primary** outline/blanc soft : « Voir mon trou » → `#outil` · **Secondary** ghost/blanc plein : « Réserver 15 minutes » → RDV |

### Avant → Après
| Avant | Après | Où |
|-------|-------|-----|
| Orbs `PageHero` génériques | Image sujet full-bleed + overlay | Shell : étendre `PageHero` **ou** prop `backgroundImage` / variante `CampagneAdsLanding` si `item.heroImage` |
| CTA unique RDV blanc | Duo outil-first + RDV | `CampagneAdsLanding.jsx` L79–88 |
| Aucune ligne confiance | « Conseiller en sécurité financière · Victoriaville · contenu éducatif » | Sous CTA hero, `text-white/70 text-sm` |

### Contrainte design system
Préserver typo `font-heading`, palette primary/secondary/prestige. Pas de cards dans le hero. Pas de badges flottants sur l’image. Pas d’hôpital / brancard / peur visuelle.

---

## 3. Palette / typo / motion

### Palette (inchangée + accents sujet)
- Fond page : blanc → `gray-50/80` (shell actuel)
- Alerte trou/coussin : `amber-50` / `amber-400→500` (déjà dans `ResultCard` tone warn)
- OK marge : `emerald-*` **seulement** pour $ — jamais pour « t’es couvert pour vrai »
- Soft close mid : `from-primary to-dark` (garder) mais copy chiffrée (script)

### Typo
- Snapshot duo : les deux chiffres en `font-heading text-2xl font-bold tabular-nums` **égal**
- Labels snapshot : `text-xs uppercase tracking-wide`
- Soft close outil : `text-sm` taupe + CTA `rounded-full` outline primary

### Motion (2–3 utiles — pas décor)
1. **Barre couverture** : garder `transition-all duration-500` (déjà)
2. **Entrée chiffre snapshot** : léger `animate-in fade-in` / pulse ambre 400 ms quand `gapWarn` ou coussin change (1 seule fois au mount + onChange significatif)
3. **Chips délai** : `transition-colors` selected (primary filled) — feedback immédiat Ad2

Pas de parallax hero. Pas de glow excessif.

---

## 4. Modules page (corps)

### En bref
- Garder 3 bullets numérotés (shell)
- **Ajouter** 1 ligne process sous la liste (pas une 4ᵉ card) :  
  `4 chiffres → trou + coussin → livret en 15 min`  
  Classe : `text-center text-sm text-prestige-taupe`

### Outil — hiérarchie visuelle
| Zone | Spec Avant → Après |
|------|-------------------|
| Snapshot L193–230 | 1 colonne trou → **grille 2 cols** : Trou/mois \| Coussin d’attente (ambre si warn) ; barre couverture en 3ᵉ ligne full-width |
| Champs carence | Input seul → chips **30 · 90 · 120** au-dessus/sous l’input (selected = `bg-primary text-white`) |
| Block 2 | OK composition ; éviter doublon visuel excessif avec snapshot (option P1 : compresser collective en micro-ligne) |
| Note définition L317–322 | Garder bandeau beige ; **ajouter** CTA soft text-link sous la note si `!gapWarn` |
| Footer L186–191 | PDF primary seul → **RDV outline primary** + PDF ghost (`border` / `bg-white`) |

### Soft close mid
- Remplacer microcopy hardcodée L182–187 par `item.ctaHeadline` / `item.ctaSubline` (déjà supporté pour form ; brancher aussi branche RDV)
- Visuel : garder bandeau navy ; CTA blanc primary + Apprendre outline

### Confiance / preuve
- Sous hero : ligne CSF Victoriaville
- Option P1 : vignette « aperçu livret + PDF » (mock 2 frames) au-dessus de l’outil — **pas** de photo conseiller obligatoire si stock faible

### FAQ
- Shell actuel OK ; densifier à 5 questions (script) — même card divide-y

---

## 5. Mobile (thumb zones)

| Zone | Règle |
|------|-------|
| Hero CTAs | Stack vertical ; primary « Voir mon trou » = premier bouton (pouce) |
| Snapshot duo | 2 cols même sur mobile (`grid-cols-2`) — chiffres lisibles, labels wrap OK |
| Chips 30/90/120 | Rangée `flex gap-2` thumb-friendly (min h-10) |
| Footer outil | Colonne : copy → **RDV full-width** → PDF ghost full-width (ordre émotionnel) |
| Mid navy | Après outil ; ne pas remonter avant climax |

---

## 6. 3 upgrades visuels WOW (priorisés)

1. **Hero sujet full-bleed + CTA outil-first** — corrige dissonance Ad3 + brand test  
2. **Snapshot duo Trou \| Coussin** — double climax Ad1+Ad2 impossible à manquer  
3. **Footer outil RDV outline + PDF ghost** — booker au pic, pas « ce soir »

---

## 7. Fichiers à toucher (visuel)

| Fichier | Changement |
|---------|------------|
| `CampagneAdsLanding.jsx` | Hero duo CTA ; mid `ctaHeadline`/`ctaSubline` ; `id="outil"` sur wrapper outil |
| `PageHero.jsx` *ou* landing locale | Support image/overlay campagne (shell partagé — coordonner PM) |
| `campagneAdsLandings.js` | `heroImage`, `ctaHeadline`, `ctaSubline`, bullets process hint si besoin |
| `InvaliditeTool.jsx` | Snapshot duo, chips, footer CTAs, motion légère |
| Asset | Réutiliser / dériver `emails/campagne-meta-catalog/visuels/invalidite-feed.jpg` → `frontend/public/…` si hero web |

---

## 8. Critères acceptation visuelle

- [ ] Sans la nav, la 1ʳᵉ viewport **sent** invalidité / paie / livret (pas un template CSF générique)
- [ ] Trou **et** coussin visibles sans scroller le Block 2
- [ ] Au climax, le bouton le plus visible pousse le **RDV**, pas le PDF
- [ ] Mobile : chips + duo snapshot utilisables d’une main
- [ ] Aucune image hôpital / promesse visuelle « salaire garanti »
