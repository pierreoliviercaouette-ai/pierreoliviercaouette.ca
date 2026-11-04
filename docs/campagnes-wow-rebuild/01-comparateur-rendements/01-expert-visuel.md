# [#01] Expert marketing visuel — Spec de refonte

**Campagne :** `/campagnes/comparateur-rendements`  
**Signé :** Expert marketing visuel  
**Date :** 2026-11-04  
**Source live :** page ouverte 2026-11-04 (hero navy générique · badge « Rendements » · CTA blanc RDV seul · écart live ~12 088 $ à profil équilibré 6,3 % vs 9,2 %)  
**Score visuel actuel /10 :** 6 → **cible ship :** 8,5

---

## Verdict (1 paragraphe)

La landing sent le **template campagne** : `PageHero` gradient + orbs + grille, badge vague, CTA calendrier avant outil. Le client Meta a cliqué pour **jouer** ; le premier viewport pousse le RDV. L’outil a déjà un climax lisible (barres + `ResultCard` « Écart illustratif »), mais Progress « 3 / 3 » rivalise avec le $, le PDF plein vole la vedette, et le mid navy clone ne cite jamais *son* écart. Objectif : 1 composition sujet « banque vs modèles », outil-first, climax typographique scénique, soft close collé sous le chiffre — sans collage stickers ni cards décoratives.

---

## 1. Hero — composition 1 viewport

### Job unique
Brand + mythe composé + promesse outil gratuit + CTA scroll `#outil` (primaire) · RDV ghost (secondaire).

### Contenu autorisé dans le 1er viewport
| Élément | Spec |
|---------|------|
| Badge | `Comparateur` (pas « Rendements ») |
| H1 | Garder : **À profil égal, l’écart se compose** |
| Promesse | 1 phrase + mention **Gratuit, sans compte** (voir script) |
| CTA groupe | Primaire blanc plein « Voir mon écart → » → `#outil` · Secondaire ghost bordure blanche « Réserver 15 minutes » |
| Atmosphère | Ancre sujet : split hint banque / modèles (voir §2) — **pas** overlay badges flottants |

### Interdit dans le hero
Stats strips, tableau 5 profils, PDF, FAQ, photo conseiller, cards.

### Avant → Après
| Avant | Après | Fichier / classe |
|-------|-------|------------------|
| Badge `Rendements` | Badge `Comparateur` | `campagneAdsLandings.js` L179 |
| CTA unique `Link` RDV blanc plein (`CampagneAdsLanding.jsx` L79–88) | Dual CTA : bouton scroll `#outil` primaire + `Link` RDV secondaire ghost | `CampagneAdsLanding.jsx` + data `heroPrimaryLabel` / `heroPrimaryHref` (ou props dédiées) |
| `PageHero` orbs passifs seuls | Option A (P0) : garder shell + ajouter sous le H1 une **ligne contraste** `Banque` · `Modèles` en typo `font-heading` blanche/or secondaire, opacity 70 %, sans sticker · Option B (P1) : variante `atmosphere="split-compare"` sur `PageHero` | `PageHero.jsx` (props optionnelles) ou wrapper local dans landing |
| Promesse sans « gratuit » | Promesse + « Gratuit, sans compte » | data `promise` |

### Mobile thumb zones
- CTA primaire « Voir mon écart » : zone pouce bas-centre du hero (garder `rounded-full px-8 py-3`).
- CTA secondaire RDV : sous le primaire, pleine largeur `sm:w-auto` — pas de concurrence visuelle (ghost = bordure `border-white/40 text-white`).
- Ne pas empiler 3 boutons.

---

## 2. Palette / typo / atmosphère sujet

### Palette (existant site — ne pas inventer un thème violet)
- Fond hero : `gradient-hero` (navy primary → dark) — **garder**.
- Accent contraste : `secondary` (cyan/teal site) pour côté « modèles » ; taupe `prestige-taupe` pour côté « banque ».
- Corps : blanc / `gray-50` / cards blancs existants.
- Climax écart : gradient `from-primary/[0.06] to-secondary/[0.08]` déjà sur `ResultCard emphasize` — **amplifier**, pas remplacer.

### Typo
- H1 / écart $ : `font-heading` (déjà expressif — garder).
- Chiffres : `tabular-nums` (déjà).
- Pas d’Inter/Roboto ; pas de nouveau display font.

### Ancre visuelle « banque vs modèles » (sans collage)
Sous la promesse, **une seule** rangée de contraste (pas une card) :

```
Banque                    Modèles
préréglage / relevé       moyenne 5 ans nette
```

Classes suggérées : `mt-4 flex max-w-md mx-auto justify-between gap-6 text-left text-xs text-white/70` + labels `font-heading text-sm text-white`.

Référence créative ads : navy + contrastes forts des PNG mythe — **réinterpréter en CSS**, ne pas coller le PNG dans le hero.

---

## 3. Motion (2–3 utiles — présence, pas bruit)

| # | Moment | Spec | Fichier |
|---|--------|------|---------|
| M1 | Apparition climax | Quand `milestones[2].done` : `ResultCard` écart reçoit `animate-in fade-in zoom-in-95` (ou CSS `@keyframes` local 400–600 ms) une fois ; `ecartFontScale` déjà OK | `ComparateurRendementsTool.jsx` L569–575 |
| M2 | Barres | Garder `transition-all duration-500` ; au 1er rendu 3/3, forcer un remount width 0→cible (clé `key={years-profil}`) pour que le geste « compose » se voie | L540–567 |
| M3 | Soft close sous écart | Bandeau RDV slide-up 200 ms après M1 (`opacity` + `translate-y`) | Nouveau bloc post-`ResultCard` |

**Ne pas** animer les orbs hero davantage.

---

## 4. Modules manquants (corps de page)

### 4.1 Module preuve — 1 job (sous En bref, avant outil)
**Titre section :** Pourquoi 2–3 % ce n’est pas du détail  
**Contenu :** mini-table 5 profils (taux banque préréglage vs modèles live) + **1 ligne** projection signature 50 000 $ · 0 $/mois · 20 ans · équilibré (chiffre calculé live via `getIaPct` / `getBanqueAvgForProfil` — pas hardcodé stale).  
**Disclaimer adjacent** (finance) sous la table.  
**Visuel :** pas de card soup — table `divide-y` dans un `rounded-2xl border border-prestige-beige` (pattern FAQ existant).  
**Fichiers :** `CampagneAdsLanding.jsx` branche `item.slug === 'comparateur-rendements'` **ou** data `proofModule` dans `campagneAdsLandings.js` + rates `comparateurRendementsRates.js`.

### 4.2 Ligne confiance
Sous hero (hors 1er viewport scroll immédiat OK) ou entre En bref et preuve :  
`Conseiller en sécurité financière · iA Groupe financier · Victoriaville` — texte `text-xs text-prestige-taupe`, centré, **sans** photo obligatoire en P0.

### 4.3 Intro outil
Avant : « Remplis l’outil — tu repars avec un résumé clair et un PDF à garder. » (`CampagneAdsLanding.jsx` L133–135)  
Après : « Ouvre. Ajuste. Regarde l’écart. » (PDF sorti de la phrase — voir script).  
Ancre DOM : `id="outil"` sur le wrapper outil.

### 4.4 Soft close mid (identité sujet)
Avant : navy clone « Prêt à clarifier ta situation ? »  
Après : headline/subline myth-specific (script) ; **retirer** le 2ᵉ bouton fuite `/outils/…` ; secondaire = ancre `#outil` « Ajuster mon écart » **ou** un seul CTA RDV.  
Brancher `item.ctaHeadline` / `item.ctaSubline` aussi pour branche RDV (aujourd’hui hardcodé L182–187 — **shell générique**).

### 4.5 Climax typographique + PDF secondaire
- Progress : garder, mais réduire concurrence visuelle (`text-xl` au lieu de `text-2xl` quand 3/3).
- Sous `ResultCard` écart : bandeau soft close chiffré + CTA RDV primaire blanc/primary.
- `ToolDownloadPdf` : variante outline (border primary, fond transparent) — prop `variant="outline"` sur `CampagneToolShell.jsx` `ToolDownloadPdf`.

---

## 5. Mobile — densité outil

| Problème | Spec |
|----------|------|
| 5 radios empilés + taux inline | Garder radios ; sur `max-sm` masquer la ligne `banque ~X · modèles Y` dans le bouton non sélectionné (garder sur selected seulement) pour raccourcir scroll avant résultat |
| Climax loin après tweak | Sticky mini-bar optionnelle P2 : `Écart ≈ {formatCad(ecart)}` fixe bas écran quand `milestones[2].done` et résultat hors viewport — **P2 seulement** |
| Thumb CTA post-climax | Bandeau RDV pleine largeur sous écart, `py-3.5`, avant footer PDF |

---

## 6. Avant → Après — checklist composants

1. **Hero outil-first** — `campagneAdsLandings.js` + `CampagneAdsLanding.jsx` dual CTA + `#outil`.
2. **Badge Comparateur + promesse gratuit** — data only.
3. **Ligne contraste Banque / Modèles** — markup hero children ou sous `PageHero`.
4. **Module preuve 5 profils + 20 ans** — landing conditionnelle + rates.
5. **Motion M1–M3** — `ComparateurRendementsTool.jsx`.
6. **PDF outline + RDV collé** — tool + `ToolDownloadPdf` variant.
7. **Mid CTA myth + coupe fuite** — data + shell `ctaHeadline`/`ctaSubline` + `secondaryIsTool` réellement branché (aujourd’hui flag mort : mid pointe toujours `apprendrePath`).
8. **Ligne confiance CSF / iA / Victoriaville**.

---

## 7. Critères acceptation visuelle

- [ ] En 5 s, un ami comprend que c’est un **comparateur banque vs modèles**, pas une landing RDV générique.
- [ ] CTA primaire du 1er viewport = outil, pas calendrier.
- [ ] L’écart $ a une entrée scénique ; le PDF n’est plus le bouton le plus saturé.
- [ ] Mid CTA n’envoie plus hors funnel `/outils/comparateur-rendements`.
- [ ] Mobile : pouce atteint « Voir mon écart » et le RDV post-écart sans combats de cards.

**Dépendances shell :** dual CTA hero, `ctaHeadline`/`ctaSubline` sur branche RDV, `ToolDownloadPdf` outline, branchement `secondaryIsTool` — **partagés** avec les 14 autres campagnes. Le reste (preuve, contraste sujet, climax) est **spécifique #01**.
