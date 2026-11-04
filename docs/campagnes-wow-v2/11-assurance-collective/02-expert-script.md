# [#11] Expert script marketing — Assurance collective (employé)

**Slug :** `/campagnes/assurance-collective`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, zéro drama médical  
**CTA :** RDV Bookings 15 min — **zéro MRa / PME / « ton équipe »**

---

## Rescore post-P0 (copy)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Fold reconnaissable | 5 | 7.5 | ≥ 8.5 |
| Pont émotion → booker | 4.5 | 7.5 | ≥ 8 |
| Différenciation vs catalogue | 4 | 6 | ≥ 8 |

**Top 1 gap WOW restant :** H1/promise déjà bons (mythe Ad1) ; ce qui manque = **micro-signaux fold + process** qui nomment le sujet *livret employé* avant l’outil. Soft close / mid : **ne pas réécrire** (P0 OK).

---

## Interdits Vague 2

- Ne pas réécrire SoftClose (`T’as encore n cases floues…` / `Démêler mes cases floues`)
- Ne pas réécrire mid `ctaHeadline` / `ctaSubline` (déjà data-driven)
- Ne pas réécrire dual CTA labels hero
- Aucun wording MRa, PME, présentation équipe, cotisation employeur

---

## Textes différenciants à livrer

### 1. `heroExtras` (chips / kicker)

| ID | Texte (max court) |
|----|-------------------|
| chip-1 | Paliers invalidité |
| chip-2 | Livret ≠ carte |
| chip-3 | Cases floues → 15 min |
| kicker (opt.) | Checklist employé — pas une offre pour ton entreprise |

### 2. `processSteps` (3 max — strip catalogue)

| # | Titre | Sous-ligne |
|---|-------|------------|
| 1 | Tu apportes ton livret | PDF RH ou résumé — pas juste la carte |
| 2 | On repère les cases floues | Invalidité, vie, départ — ce qui reste vague |
| 3 | 15 min si trou | Clarifier ensemble — clarifier ≠ acheter |

Data shape suggérée (alignée shell) :

```js
processSteps: [
  { title: 'Tu apportes ton livret', detail: 'PDF RH ou résumé — pas juste la carte' },
  { title: 'On repère les cases floues', detail: 'Invalidité, vie, départ — ce qui reste vague' },
  { title: '15 min si trou', detail: 'Clarifier ensemble — clarifier ≠ acheter' },
]
```

### 3. Fold H1 / promise — **garder** (pas générique post-P0)

| Champ | Texte actuel (OK) |
|-------|-------------------|
| `title` | Ton assurance collective te couvre… vraiment ? |
| `promise` | Ouvre le PDF RH. Coche invalidité (un % ou plusieurs paliers), vie, départ. Mini résumé sans compte — 15 min seulement si une case reste floue. |

Ajustement **seulement si** QA 5 s échoue : raccourcir promise à  
> Ouvre le PDF RH. Coche les cases. 15 min seulement si une reste floue.

### 4. Soft close / mid — **pas de rewrite**

| Zone | Statut |
|------|--------|
| SoftClose outil | OK — `T’as encore {n} case(s) floue(s)…` + *Clarifier, c’est pas acheter.* |
| Mid | OK — *Des cases encore floues ? On ouvre le livret ensemble.* |
| Gap micro mid | Optionnel V2 : 1 ligne sous portrait — *Pierre-Olivier · CSF · Victoriaville* (libellé catalogue, pas nouveau pitch) |

### 5. Climax nommé (sous-ligne outil — script court)

Quand `missingCount > 0`, sous le chiffre XXL :

> Ex. *Invalidité · Si tu quittes · Livret* encore flous — on les démêle en 15 min.

Règle : lister **seulement** les milestones non `done` (max 3 noms).  
Si complet : garder *5/5 — range ton PDF avec le livret*.

### 6. Chips trous (si outil P1 — labels)

| Chip | Options | Copy safe |
|------|---------|-----------|
| Maladie grave dans ta collective ? | Oui / Non / Je ne sais pas | *Présente ou non selon ton livret — on ne revend rien ici.* |
| Plafond invalidité $/mois noté ? | Oui (+ $) / Non / Je ne sais pas | *Si le livret indique un max mensuel, note-le — le % seul peut tromper.* |

Placeholder plafond : *ex. 4 000 $* (illustration, pas promesse).

---

## Spec Avant → Après (copy)

| Zone | Avant | Après V2 | Fichier |
|------|-------|----------|---------|
| heroExtras | Absent | 3 chips + kicker optionnel | `campagneAdsLandings.js` |
| processSteps | Absent | 3 steps ci-dessus | idem |
| Sous-ligne climax | `done/total · %` seul | + noms des flous | `CollectiveChecklistTool.jsx` |
| SoftClose / mid / H1 | P0 livré | **inchangé** | — |

---

## Conformité copy (rappel)

- Question H1 OK (« …vraiment ? ») — pas claim « t’es couvert »
- Toujours *clarifier ≠ acheter* / *le livret prime*
- FAQ existante paliers / livret : **garder**
- Grep mental page : aucun « MRa », « PME », « ton équipe »

---

## Effort

| Item | Effort |
|------|--------|
| heroExtras + processSteps data | S |
| Sous-ligne climax nommée | S |
| Labels chips MG / plafond | S |
| Rewrite SoftClose/mid | **0** (interdit sauf gap QA) |
