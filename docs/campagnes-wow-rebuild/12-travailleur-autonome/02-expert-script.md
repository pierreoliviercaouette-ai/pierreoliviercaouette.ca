# [#12] Travailleur autonome — Expert script marketing

**Slug :** `/campagnes/travailleur-autonome`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, calme, éducatif — Clarifier ≠ acheter  
**CTA final :** RDV Bookings 15 min  
**Alignement ads :** Ad1 collective · Ad2 revenu variable · Ad3 outil-first

---

## 1. Textes landing (prêts à coller)

### Hero (`campagneAdsLandings.js` — slug `travailleur-autonome`)

| Champ | Texte final |
|-------|-------------|
| `badge` | Autonome |
| `title` | Travailleur autonome : pas d’assurance collective fournie |
| `promise` | Coche ton filet : liquidité, revenu, proches — quand le revenu varie et qu’il n’y a pas d’assurance collective fournie. |
| `ctaPrimaryLabel` *(nouveau)* | Coche ton filet |
| `ctaSecondaryLabel` *(nouveau)* | Ou 15 min si tu préfères |
| `ctaLabel` *(mid / RDV)* | Clarifier ces trous en 15 min |

### Bullets En bref (`bullets`)

1. Les bons mois font oublier les mauvais — le filet, c’est toi qui le bâtis (pas de RH)
2. Ordre clair : liquidité → revenu → proches / hypothèque → structure
3. Checklist + PDF optionnel : état du filet et prochaine case à cocher

### Soft close mid (branche RDV — via `ctaHeadline` / `ctaSubline`)

| Champ | Texte final |
|-------|-------------|
| `ctaHeadline` | Une case te chicotte — revenu qui stoppe, hypo qui continue ? |
| `ctaSubline` | 15 min pour prioriser liquidité puis protection du revenu. Clarifier ≠ acheter. |

### Soft close **dans l’outil** (templates dynamiques)

| Condition | Phrase |
|-----------|--------|
| `filetValue === 'Mince'` + `nextItem` | Ton filet est mince — prochaine case : {nextItem.short}. 15 min pour décider si tu commences par la liquidité ou le revenu qui stoppe. Clarifier ≠ acheter. |
| `filetValue === 'En cours'` + `nextItem` | Du progrès — il reste {missingCount} trou{s}. Prochaine case : {nextItem.short}. On priorise ensemble en 15 min si tu veux. |
| `filetValue === 'Solide'` | Bonne base. Garde le PDF à jour — ou 15 min si une case te chicotte encore. |
| `doneCount === 0` | *(pas de strip RDV — laisser cocher d’abord)* |

**CTA bouton outil :** `Clarifier : {nextItem.short} en 15 min`  
**Micro sous CTA :** Clarifier ≠ acheter · sans pression

### Ligne confiance

> Conseiller en sécurité financière · Victoriaville — 15 min pour prioriser ton filet, pas pour te vendre une pile de produits.

### Intro outil (shell)

| Champ | Texte |
|-------|-------|
| Titre | Checklist : ton filet d’autonome |
| Intro | Pas d’assurance collective fournie. Coche ce qui est vraiment en place — ton ordre d’attaque se construit en direct. |
| Sous « À toi de jouer » (shell) | Coche ton filet — tu vois les trous dans le bon ordre. PDF optionnel. |

*(Si le sous-titre shell reste global « Remplis l’outil… PDF », override slug-aware ou accepter P1.)*

### SEO (inchangé sauf promise alignée)

| Champ | Texte |
|-------|-------|
| `seoTitle` | Protections travailleur autonome \| Conseiller en sécurité financière |
| `seoDescription` | Checklist filet minimal : urgence, revenu, proches et hypothèque quand tu n’as pas d’assurance collective fournie. Conseiller en sécurité financière à Victoriaville. |

---

## 2. Copy climax outil (status / filet)

**Règle :** « Pas d’assurance collective fournie » **1×** en intro outil — pas en boucle dans chaque insight.

### `statusDetail` (après)

| Seuil | Texte |
|-------|-------|
| `doneCount >= 6` | Bonne base. Garde le résumé sous la main — revalide si ton revenu ou ta famille change. Apporte-le aux 15 min si tu veux. |
| `doneCount >= 3` | Du progrès, mais {n} trou{s} restent. Prochaine case : {short}. Si un mois (ou trois) est mauvais, rien ne tombe automatiquement. |
| sinon + next | Le filet est mince. Si un mois est mauvais, rien ne tombe auto. Commence par : {next} |
| sinon | Le filet est mince. Si un mois est mauvais, rien ne tombe automatiquement — construis-le une case à la fois. |

### `filetDetail` (après)

| Seuil | Texte |
|-------|-------|
| `doneCount === 0` | Aucune case cochée. Le filet, c’est toi qui le bâtis — personne n’envoie le PDF annuel. |
| `doneCount >= 6` | {n}/{total} en place. Garde le PDF à jour. |
| sinon | {n}/{total} en place · {missing} à faire. |

### Hints cases (ajustements)

| id | hint (après) |
|----|----------------|
| `urgence` | Disponible vite si un mois (ou trois) est mauvais. |
| `factures` | Hypothèque, taxes, essentiels — même si le revenu tombe à zéro. |
| `invalidite` | Pour remplacer une partie du revenu quand tu ne peux plus travailler — sans filet d’employeur. |
| `vie` | Pour que les proches ne se retrouvent pas coincés (hypo / conjoint / enfants). |
| `comptes` | Pour voir clairement ce qui rentre et ce qui sort. |
| `epargne` | Un montant décidé d’avance, pas au feeling des bons mois. |
| `rc` | Pas toujours nécessaire — seulement si ton métier le demande. |

---

## 3. FAQ (max 5) — coller dans `faq`

1. **Je peux me « payer » les mêmes protections qu’avec une assurance collective ?**  
   On parle plutôt d’assurances de ton bord, adaptées à ta situation. Le détail dépend de ton revenu net et de ta structure — pas d’un régime employeur. Ce n’est pas « remplacer la collective ».

2. **Par où commencer ?**  
   Souvent liquidité (urgence + factures qui tiennent), puis protection du revenu, puis proches / hypothèque. L’outil te donne l’ordre des trous. 15 minutes pour y voir clair — Clarifier ≠ acheter.

3. **C’est gratuit ? Il faut un compte ?**  
   La checklist est gratuite. Pas de compte. Pas d’obligation de laisser ton courriel pour l’utiliser. Le PDF est optionnel.

4. **Tu vends une assurance ici ?**  
   Non. La page est éducative : tu coches, tu vois ton filet. Si une case te chicotte, on clarifie en 15 minutes. Clarifier ≠ acheter.

5. **Mon revenu varie beaucoup — l’ordre change ?**  
   L’ordre de base reste liquidité → revenu → proches → structure. Avec un revenu variable, la liquidité compte souvent encore plus (tenir les mauvais mois). On ajuste les montants et les priorités à ta situation — pas avec une formule magique sur la page.

---

## 4. Capsules Apprendre

| Priorité | Path | Label |
|----------|------|-------|
| Primaire (data) | `/apprendre/fonds-urgence` | Lire la capsule fonds d’urgence |
| Secondaire (mid, si 2 liens) | `/apprendre/assurance-invalidite` | Capsule invalidité |

Si le shell n’accepte qu’un lien : **urgence en primaire** (trou #1 fréquent TA) ; invalidité reste accessible via FAQ / outil revenu.

Champs :
- `apprendrePath: '/apprendre/fonds-urgence'`
- `apprendreLabel: 'Lire la capsule fonds d’urgence'`
- optionnel `apprendreSecondaryPath` / `apprendreSecondaryLabel` (P1 shell)

---

## 5. Ads Meta — ajustements (alignement outil-first)

### Ad1 — Pas d’assurance collective fournie
**Garder** le corps actuel (déjà outil-first + Clarifier ≠ acheter).  
**Titre / description :** inchangés.  
**Micro-fix :** s’assurer que le landing hero ne contredit plus (« Coche ton filet » = même geste que l’ad).

### Ad2 — Revenu irrégulier
**Garder.** Landing promise + bullet #1 + climax « mois mauvais » doivent **enfin** matcher le clic.  
Pas de claim « pourcentage qui tombe en attendant » côté page outil (déjà OK en ad comme constat).

### Ad3 — Essaie d’abord
**Garder.** Critique : hero primaire = outil, pas RDV — sinon bounce Ad3.

### Disclaimer commentaire épinglé (inchangé)
> Contenu éducatif. Titre : conseiller en sécurité financière. Pas un conseil personnalisé.

### Brief créa (rappel)
Feed navy « Autonome / Checklist filet » · Stories « Coche ton filet » · Éviter lifestyle + promesse couverture « comme un employeur ».

---

## 6. PDF — libellés FR

| Avant (ASCII) | Après |
|---------------|-------|
| Resume — filet… | Résumé — filet travailleur autonome |
| Etat | État |
| Prochaine etape | Prochaine étape |
| A faire | À faire |
| points coches / non cochee | points cochés / non cochée |

Note PDF (dernière ligne) :  
`Apporte ce résumé aux 15 min si tu veux — Clarifier ≠ acheter.`

---

## 7. Interdits copy (rapide)

- « Remplacer l’assurance collective » / « mêmes protections qu’un employé »
- « Tu as besoin d’acheter X » / pitch invalidité forcé si trou = urgence
- Urgence RDV dans le hero comme seul CTA
- Répéter « pas d’assurance collective fournie » dans chaque bloc insight

---

## 8. Critères script WOW → RDV

- [ ] Ad1–Ad3 et hero disent le **même geste** (cocher le filet)
- [ ] Soft close cite **mon** trou (`Fonds d’urgence`, etc.)
- [ ] « Clarifier ≠ acheter » visible outil + mid
- [ ] FAQ tue compte + vente
- [ ] Climax parle **mois mauvais**, pas seulement collective
