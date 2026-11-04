# [#08] Fonds d’urgence — Spec visuelle CSS-only (Vague 2)

**Rôle :** Expert marketing visuel  
**Slug :** `/campagnes/fonds-urgence`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Sources :** live `CampagneAdsLanding` · `PageHero` · `FondsUrgenceTool.jsx` · `ToolSoftClose` · brief ads « Filet d’abord. »  
**Interdits V2 :** pas de photos nouvelles · ne pas re-spécifier SoftClose/dual CTA/`ctaHeadline`

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | 8,5 |
| WOW outil | 7,5 | 8 | 8 (garder) |
| Env. booker | 4,5 | 6,5 | 7,5 |

**Top 1 gap WOW restant :** le fold reste un **PageHero clone** (gradient + dots + orbs) — aucun signal « filet / liquidité » en 5 s. L’outil est fort ; le chrome page ne différencie pas #08 du catalogue.

---

## 1. Atmosphere hero — `filet` (CSS only)

**Prop :** `PageHero atmosphere="filet"` (ou `item.atmosphere: 'filet'` → landing).  
**Pas** de `backgroundImage` / photo full-bleed.

| Couche | Spec |
|--------|------|
| Base | `gradient-hero` / navy `#01233F` existant — **garder** tokens prestige |
| Tint sujet | Overlay radial ambre très soft (`from-amber-400/10` → transparent) en bas-gauche — « stress liquidité calmé », pas glow violet |
| Texture filet | SVG/CSS **mesh / filet** : grille diagonale fine `opacity-[0.06–0.08]` blanche (pas la grille dots Home seule) — lit comme un filet, pas un dashboard |
| Grain | Grain CSS léger `opacity-[0.04]` full-bleed (helper shell partagé) |
| Kicker | Micro-ligne blanche sous CTAs : « Calculateur gratuit · Sans compte » (via `heroExtras`, pas sticker flottant) |

**Test brand 5 s :** sans nav, on lit « Fonds d’urgence / filet » — pas « landing CSF générique ».

---

## 2. Micro-signaux fold (`heroExtras`)

Même slot shell pour les 15 — contenu #08 seulement :

| Signal | Spec |
|--------|------|
| Chip 1 | `Cible × mois` |
| Chip 2 | `Écart + délai` |
| Chip 3 (opt.) | `Carte ≠ filet` (ancre Ad2) |
| Placement | Sous promesse / au-dessus dual CTA — row wrap centrée, `border-white/25 bg-white/10`, **pas** pills `rounded-full` massifs |
| Interdit | Badges flottants sur media, stats strip, « 6 mois = OK » |

---

## 3. Process strip 3 steps

**Placement catalogue (ordre verrouillé) :** Hero → En bref → **Process** → Outil → Mid → FAQ.

Même composant / classes shell (`item.processSteps`) — seuls les libellés changent :

1. **Cible** — dépenses × mois  
2. **Écart** — manquant + délai  
3. **Palier** — où garer · rythme  

Visuel : strip horizontal (mobile stack), numéros `font-heading`, **pas** icon row Lucide, **pas** cards ombrées solo.

---

## 4. Portrait CSF (mid SoftClose)

| Slot | Spec |
|------|------|
| Asset | `/seo/portrait.jpg` **uniquement** (48–64px, `rounded-full`, object-cover) |
| Placement | Mid bandeau navy **ou** slot portrait partagé dans `ToolSoftClose` — **même pattern catalogue** |
| Libellé | `Pierre-Olivier · CSF · Victoriaville` (texte shell identique) |
| Interdit | Autre photo, avatar généré, collage |

---

## 5. Motion (2–3 utiles — helpers shell)

1. **Fade SoftClose** — `opacity` 200–300 ms à l’apparition (helper partagé `ToolSoftClose` / wrapper) — déjà partiel côté ton ambre/émeraude ; industrialiser le fade  
2. **Keyed bar reveal** — barre « Vers ta cible » : une fois au mount `#outil`, largeur 0 → `pctVersCible` (`transition-all duration-500` déjà là)  
3. **Optionnel** : chips `heroExtras` fade-in 150 ms au load — pas de lib motion externe

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero | `PageHero` clone dots/orbs | `atmosphere="filet"` + mesh CSS + tint ambre soft | `PageHero.jsx` · `CampagneAdsLanding.jsx` · data |
| Fold | Badge + H1 + promise + dual CTA | + `heroExtras` chips filet | `campagneAdsLandings.js` · landing |
| Process | Absent | Strip 3 steps shell sous En bref | `CampagneAdsLanding.jsx` · data `processSteps` |
| Portrait | Absent | 48–64px `/seo/portrait.jpg` + libellé CSF mid | shell mid / SoftClose |
| Post-climax | SoftClose OK ; « À retenir » toujours ouvert | SoftClose inchangé structure ; À retenir `<details>` mobile | `FondsUrgenceTool.jsx` |
| Motion | Barre `duration-500` only | + fade SoftClose + keyed bar mount | shell + outil |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V-08.1 | Atmosphere `filet` (mesh + tint + grain) | M | P0-v2 *(shell)* |
| V-08.2 | `heroExtras` chips | S | P0-v2 |
| V-08.3 | Process strip 3 steps | S | P0-v2 *(shell)* |
| V-08.4 | Portrait mid + libellé CSF | S | P0-v2 *(shell)* |
| V-08.5 | Fade SoftClose + keyed bar | S | P1 |
| V-08.6 | « À retenir » `<details>` mobile | S | P0-v2 *(spécifique)* |

---

## Critères acceptation visuelle

- [ ] Ami reconnaît « filet d’urgence » en ≤5 s (atmosphere + chips), sans photo  
- [ ] Ordre page = contrat catalogue (Process avant outil)  
- [ ] SoftClose = `ToolSoftClose` partagé (pas de bandeau one-off)  
- [ ] Portrait = même vignette + même libellé que les 14 autres  
- [ ] Mobile : À retenir fermé par défaut ; RDV SoftClose reste visible ≤2 s post-climax  
- [ ] Zéro nouvelle palette hors teinte atmosphere filet  

---

## Hors scope

- Shoot / achat photos  
- Refonte SoftClose / dual CTA / mid copy (P0 livré)  
- Cards promo, overlays stickers, icon rows  
