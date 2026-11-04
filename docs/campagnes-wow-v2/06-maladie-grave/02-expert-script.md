# [#06] Maladie grave — Spec SCRIPT (Vague 2 post-P0)

**Slug :** `/campagnes/maladie-grave`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, calme, éducatif — Clarifier ≠ acheter

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 6,5 | ≥ 8 |
| WOW outil | 6,5 | 7,5 | ≥ 8,5 |
| Env. booker | 4,5 | 6,5 | ≥ 7,5 |

**Top 1 gap copy restant :** micro-signaux fold + process — H1 / SoftClose / mid déjà bons. Ne pas réécrire le pont RDV.

---

## Interdits (ne pas re-spécifier)

- Soft close in-tool / mid `ctaHeadline` / `ctaSubline` / dual CTA labels
- Chips hero Invalidité \| MG (copy contraste = outil, déjà livré)

---

## 1. `heroExtras` — textes prêts à coller

| Slot | Texte |
|------|-------|
| Kicker | Capital forfaitaire · une fois · si le contrat s’applique |
| Chip A | 3 blocs → ordre de grandeur |
| Chip B | Complète l’invalidité |

**Ne pas mettre en hero :**
- ~~Invalidité = revenu dans le temps~~
- ~~MG = capital forfaitaire~~  
→ déjà dans `mg-contrast` + H1.

### H1 / promise — garder (fold non générique)

| Champ | Texte (inchangé) |
|-------|------------------|
| `title` | Maladie grave ≠ invalidité — un capital à part |
| `promise` | Trois blocs concrets pour un ordre de grandeur — sans compte. L’invalidité paie un revenu ; la MG, un capital. |
| `heroToolLabel` | Estimer mon capital |
| `ctaLabel` | Réserver 15 minutes |

Ajustement **uniquement si** atmosphere seule ne suffit pas : raccourcir promise mobile à  
`3 blocs → capital illustratif. Invalidité = revenu ; MG = capital.`  
Sinon : **ne pas toucher**.

---

## 2. Process steps (3 max)

| # | Titre | Sous-ligne |
|---|-------|------------|
| 1 | Estime ton capital | Trois blocs illustratifs — conjoint (si applicable), soins, qualité de vie |
| 2 | Lis l’écart | Ce qui reste vs ce que t’as déjà (collective ou individuel) |
| 3 | Clarifie en 15 min | On ouvre ta brochure. Clarifier ≠ acheter |

Intro strip (optionnelle, 1 ligne) :  
`Trois gestes — zéro compte.`

---

## 3. Soft close / mid — ne pas réécrire

Déjà conformes post-P0 :

| Surface | Statut |
|---------|--------|
| SoftClose subline écart > 0 / ≤ 0 | ✅ garder |
| CTA `Clarifier cet écart…` / `Valider ça…` | ✅ garder |
| Mid `ctaHeadline` / `ctaSubline` | ✅ garder |
| Ligne CSF · Victoriaville | ✅ — brancher au portrait (visuel), pas de nouvelle phrase |

**Ajout portrait (libellé catalogue, fixe) :**  
`Conseiller en sécurité financière · Victoriaville`

---

## 4. Climax écart — micro-copy si typo XXL

Quand l’écart passe en `text-3xl+`, le label reste sobre :

| Élément | Texte |
|---------|-------|
| Label bandeau | Écart vs déjà couvert |
| Détail (garder) | Ce qu’il manquerait encore si le diagnostic déclenche le contrat — illustration seulement. |
| Interdit près du XXL | « Tu manques 90 000 $ » / « Tu recevras… » |

Option P2 label CTA long : `Clarifier cet écart (~{ecart}) en 15 min` — seulement si pouce mobile OK.

---

## 5. Intro outil landing (shell `toolIntro`) — gap mineur

| Avant (fallback générique) | Après (data `toolIntro`) |
|----------------------------|--------------------------|
| Remplis l’outil — tu repars avec un résumé clair… | Bouge les chiffres — capital illustratif + écart vs déjà couvert. Ensuite 15 min si ça te chicotte. |

---

## 6. Ads — pas de vague copy V2 obligatoire

Ads rebuild P1 déjà outil-first. Vague 2 = landing chrome. Touch ads seulement si dissonance heroExtras vs Ad1.

---

## Conformité copy (rappel)

- [ ] Toujours « illustratif », « si le contrat s’applique »
- [ ] heroExtras ne promet aucun montant
- [ ] Process step 3 porte « Clarifier ≠ acheter »
- [ ] Pas de duplication chips Invalidité\|MG en hero
