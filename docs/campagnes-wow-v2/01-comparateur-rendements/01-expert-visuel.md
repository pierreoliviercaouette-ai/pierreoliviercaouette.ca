# [#01] Comparateur rendements — Expert marketing visuel

**Slug :** `/campagnes/comparateur-rendements`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Signé :** Expert marketing visuel  
**État code lu :** `PageHero.jsx` (pas d’`atmosphere`) · `CampagneAdsLanding.jsx` (dual CTA + mid `ctaHeadline` livrés) · `ComparateurRendementsTool.jsx` (`ToolSoftClose` en **footer** shell) · data badge encore `Rendements`

**Interdits V2 (déjà livrés — ne pas re-spécifier) :** SoftClose contenu RDV/PDF · dual CTA hero · `ctaHeadline`/`ctaSubline` mid · shoot photos.

**Contrat catalogue :** différencier le **sujet** (atmosphere + heroExtras + climax) sans reinventer mid, footer, FAQ layout, SoftClose one-off.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | **7,2** | **9,0** |
| WOW outil | 6,5 | **7,4** | **9,0** |
| Env. booker | 4,5 | **7,0** | **8,5** |

**Top 1 gap WOW restant :** la page reste un **template navy générique** (orbs + grille) — aucun signal « banque vs modèles » au fold ; le SoftClose est relégué en **footer gris** après disclaimer, pas collé sous le climax.

---

## Verdict (1 paragraphe)

P0 a monétisé le funnel (outil-first, SoftClose, PDF ghost). Vague 2 doit faire **reconnaître la campagne en 5 s** : teinte `split-compare`, micro-ligne Banque|Modèles, process strip catalogue, climax écart XXL `font-heading text-3xl/4xl` + pulse, SoftClose **déplacé sous le climax** (toujours `ToolSoftClose`), portrait CSF mid. Zéro nouvelle photo — CSS + `/seo/portrait.jpg`.

---

## 1. Hero — atmosphere `split-compare` (CSS-only)

### Job unique (inchangé)
Brand + mythe composé + promesse + dual CTA (déjà livré).

### Prop shell à ajouter
`PageHero` reçoit `atmosphere="split-compare"` (data `item.atmosphere`).

### Spec overlays (pas de `backgroundImage` photo)
Garder `gradient-hero` + orbs + grille existants, puis **couches sujet** :

| Couche | Spec CSS / Tailwind | Rôle |
|--------|---------------------|------|
| Split tint | Pseudo gauche `bg-prestige-taupe/25` (clip 0–48 %) · droite `bg-secondary/20` (clip 52–100 %) via `absolute inset-0` + `mix-blend-soft-light` | Banque vs modèles sans sticker |
| Divider soft | `w-px` vertical centre, `bg-white/25`, blur léger | Lecture « vs » |
| Grain | Overlay SVG noise opacity `0.04` (pattern data-URI partagé shell) | Texture, pas flat |
| Halo accent | Orbe droite déjà `--glow-secondary` un peu plus saturé si `atmosphere===split-compare` | Côté modèles |

**Fichiers :** `PageHero.jsx` (prop `atmosphere` + map de classes) · `campagneAdsLandings.js` (`atmosphere: 'split-compare'`) · `CampagneAdsLanding.jsx` (passer prop).

### Micro-signaux fold — `heroExtras`

Sous la promesse / **au-dessus** des CTAs (ou juste sous CTAs si trop dense — préférer **entre promise et CTAs**), slot data-driven :

```
Banque                         Modèles
préréglage / relevé            moyenne 5 ans nette
```

Classes catalogue (partagées, pas one-off) :
`mt-4 flex max-w-md mx-auto justify-between gap-6 text-left`
- Labels : `font-heading text-sm text-white`
- Sous-lignes : `text-xs text-white/70`
- Séparateur optionnel : `text-white/40` « vs » centré (même composant `HeroExtras` shell)

**Data :**
```js
heroExtras: {
  kind: 'split-pair',
  left: { label: 'Banque', hint: 'préréglage / relevé' },
  right: { label: 'Modèles', hint: 'moyenne 5 ans nette' },
}
```

Badge fold : passer `Rendements` → **`Comparateur`** (micro-ajust script — pas un redesign).

### Interdit hero
Stats, table 5 profils, PDF, photo, cards, floating badges, collage PNG ads.

---

## 2. Process strip — composant catalogue

**Ordre page (contrat) :** Hero → En bref → **Process 3 steps** → Outil → Mid → FAQ.

Même composant shell pour les 15 campagnes (ex. `CampagneProcessStrip`) ; seuls les 3 libellés changent.

| Step | Label #01 | Hint (optionnel 1 ligne) |
|------|-----------|--------------------------|
| 1 | Tes chiffres | Même départ des deux côtés |
| 2 | Profil égal | Même confort face au risque |
| 3 | L’écart | Illustration banque vs modèles |

Classes : tokens prestige existants (`rounded-2xl`, `border-prestige-beige`, numéros `font-heading` dans cercle `bg-primary/10`). **Pas** de nouvelle palette.

**Data :** `processSteps: [{ title, hint }, …]` dans `campagneAdsLandings.js`.  
**Fichier render :** `CampagneAdsLanding.jsx` sous En bref, avant outil.

---

## 3. Climax outil — hiérarchie visuelle (alignée shell)

### Avant (code actuel)
1. Cards totaux banque / modèles  
2. Barres  
3. `ResultCard` écart (échelle inline `fontSize` via `ecartFontScale`)  
4. Narration  
5. SoftClose **footer** shell (gris `bg-gray-50/70`)

### Après Vague 2
1. **Écart illustratif** en premier — typo **`font-heading text-3xl md:text-4xl`** (montée `text-5xl` si écart mythe 20 ans et viewport desktop — **échelle catalogue**, pas orpheline px)  
2. Pulse / keyed reveal barres (helpers motion shell)  
3. Cards totaux (secondaires)  
4. Narration 1 phrase (déjà livrée)  
5. **`ToolSoftClose` collé sous climax** (même composant — **pas** de bandeau custom)  
6. Footer shell : vide ou status si `< 3/3` seulement

### Pulse écart
Sur remount / changement `ecart` significatif : classe helper shell `campagne-climax-pulse` (1× `scale` 1→1.03→1, 450 ms) — **pas** Framer Motion one-off.

### SoftClose fade
Helper shell `campagne-softclose-enter` (opacity + translate-y) quand SoftClose monte sous climax — partagé toutes campagnes.

### Portrait mid
Dans le bloc mid navy (`CampagneAdsLanding.jsx` soft-close mid), **au-dessus** du H2 :
- `<img src="/seo/portrait.jpg" …>` 48–64 px, `rounded-full`, ring `ring-2 ring-white/30`
- Libellé **identique catalogue** : `Conseiller en sécurité financière · Victoriaville`
- Classes partagées `CampagneMidPortrait` — **interdiction** de variante copy « Pierre-Olivier » différente par slug

---

## 4. Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero chrome | `gradient-hero` + orbs génériques | + `atmosphere="split-compare"` tints + grain | `PageHero.jsx`, data, `CampagneAdsLanding.jsx` |
| Fold micro | Rien sujet | `heroExtras` split Banque\|Modèles | data + slot hero shell |
| Badge | `Rendements` | `Comparateur` | `campagneAdsLandings.js` |
| Process | Absent | Strip 3 steps catalogue sous En bref | `CampagneAdsLanding.jsx` + data `processSteps` |
| Climax order | Totaux → barres → écart | Écart-first + typo 3xl/4xl | `ComparateurRendementsTool.jsx` |
| SoftClose place | `footer` prop shell | Sous bloc résultat (toujours `ToolSoftClose`) | tool + éventuellement shell `footer={null}` |
| Mid portrait | Absent | `/seo/portrait.jpg` 48–64 + libellé CSF | `CampagneAdsLanding.jsx` (composant partagé) |
| Motion | Transitions barres only | SoftClose fade + keyed bars + pulse écart (helpers shell) | tool + CSS/util shell |

---

## 5. Backlog (visuel)

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V-1 | `PageHero` prop `atmosphere` + preset `split-compare` | M | **P0-v2** (shell) |
| V-2 | Slot `heroExtras` + data Banque\|Modèles | S | **P0-v2** |
| V-3 | `CampagneProcessStrip` + 3 steps #01 | S–M | **P0-v2** (shell) |
| V-4 | Portrait mid partagé `/seo/portrait.jpg` | S | **P0-v2** (shell) |
| V-5 | Helpers motion fade SoftClose + pulse climax | S | **P0-v2** / P1 |
| V-6 | Badge `Comparateur` | S | **P0-v2** |
| V-7 | Module preuve table 5 profils (visuel table catalogue) | M | P1 |
| V-8 | Sticky mini-bar écart mobile | M | P2 |

---

## 6. Uniformité — checks visuel

| Contrat | Alignement #01 |
|---------|----------------|
| Ordre Hero→En bref→Process→Outil→Mid→FAQ | Respecté — process **entre** En bref et outil |
| SoftClose = `ToolSoftClose` | Oui — **placement** sous climax seulement ; pas de bandeau custom |
| Portrait + libellé CSF | Identiques aux 14 autres |
| Process même composant | Oui — seuls libellés changent |
| Typo climax `font-heading` 3xl/4xl | Remplace l’échelle inline orpheline `ecartFontScale` px (garder boost via classes 3xl→4xl→5xl, pas `style.fontSize`) |
| Divergence | Seulement `split-compare` + heroExtras + reorder climax |

---

## 7. Critère « ami en 5 s »

Sans lire le H1, l’ami voit : **split Banque / Modèles** au hero + **gros $ d’écart** dans l’outil → « c’est la pub du comparateur ».
