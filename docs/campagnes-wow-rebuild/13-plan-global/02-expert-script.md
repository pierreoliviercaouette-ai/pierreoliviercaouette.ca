# [#13] Plan global — Expert script marketing

**Slug :** `/campagnes/plan-global`  
**Date :** 2026-11-04  
**Persona :** 32–48 ans, Centre-du-Québec / QC ; a déjà « des affaires » (REER + CELI + une assurance) ; objection #1 : « j’ai des produits = j’ai un plan » / « je sais plus quoi attaquer en premier ».  
**CTA :** RDV Bookings (soft)  
**Ton :** québécois parlé, éducatif, zéro pitch produit

---

## Principe copy

Le WOW n’est **pas** un montant $ — c’est un **rang** (« Commence ici · {order} »). Toute copy post-outil doit **citer le n°1** et monétiser l’ancrage, pas le PDF. Ne jamais dire « ton plan personnalisé » / « plan sur mesure en 2 clics ».

---

## 1. Textes landing (prêts à coller)

### Hero — `campagneAdsLandings.js` · `plan-global`

| Champ | Texte final |
|-------|-------------|
| `badge` | Vision globale |
| `title` | Arrêter d’empiler des produits sans plan |
| `promise` | Des produits côte à côte, c’est un tiroir — pas une feuille de route. Coche : on range urgent → important → plus tard. |
| `ctaLabel` (hero primaire, si shell dual) | Voir mon ordre d’attaque |
| `ctaSecondaryLabel` (si supporté) | Ou réserver 15 min |
| Ligne confiance (sous CTAs) | Conseiller en sécurité financière · Victoriaville · 15 min exploratoire, pas une vente de pile |

*Si le shell n’accepte encore qu’un CTA : garder `ctaLabel: 'Réserver 15 minutes'` en data mid, et traiter le primaire `#outil` comme dette shell (voir PM). Ne pas changer le H1 — match Ad1.*

### En bref — `bullets` (outcomes, pas features)

1. Arrêter de tout faire un peu — un seul front à la fois  
2. Voir quoi est urgent, quoi peut attendre sans culpabilité  
3. Repartir avec un ordre clair — brouillon éducatif, pas un plan sur mesure  

### Mid CTA — data (nécessite shell `ctaHeadline` / `ctaSubline` sur branche RDV)

| Champ | Texte final |
|-------|-------------|
| `ctaHeadline` | Tu as un n°1 — on l’attaque ensemble ? |
| `ctaSubline` | 15 minutes, soft, zéro pitch. On colle ton ordre à ta vraie vie. Tu peux apporter ton PDF. |
| `ctaLabel` | Ancrer mon n°1 — 15 min |
| `apprendreLabel` | Voir les capsules Apprendre *(garder)* |

*Aujourd’hui le mid RDV est hardcodé « Prêt à clarifier… » dans `CampagneAdsLanding.jsx` — brancher les champs data (dette shell catalogue).*

### Soft close **dans** l’outil (sous « Commence ici »)

**Titre / corps :**  
> Ton n°1 : **{first.order}**. 15 minutes pour l’ancrer à ta vraie vie — soft, zéro pitch. Zéro pile de produits.

**Bouton :** Ancrer mon n°1 — 15 min  
**Event :** `trackRendezVousClick('campagne_plan-global_rdv_outil')`  
**Lien :** `buildCampagneRdvPath('plan-global', location.search)`  

**Variante 1 coche seulement :**  
> Un seul front clair : **{first.order}**. 15 min pour le coller à ta situation — ou garde le PDF pour plus tard.

### `statusDetail` (footer outil)

| `doneCount` | Texte |
|-------------|-------|
| 0 | Coche ce qui est vrai chez toi — l’ordre d’attaque se construit en bas. |
| 1 | Ton n°1 est clair. 15 min pour l’ancrer — ou PDF pour le garder. |
| 2–3 | Quelques fronts ouverts. L’ordre évite de tout attaquer en même temps. |
| 4+ | Plusieurs priorités. Ton n°1 d’abord — PDF pour garder l’ordre, 15 min pour coller ça à ta vie. |

### Labels compteur (remplace « X % »)

- Compteur : `{doneCount} cochée(s) · Ordre prêt` (si `doneCount >= 1`) sinon `{doneCount} / 7`  
- Microcopy sous barre : `Urgent d’abord — pas un score de progression`

### Deep-links éducatifs (libellés boutons sous n°1)

| `id` n°1 | Label lien | Cible |
|----------|------------|-------|
| `fondsUrgenceFaible` | Calculer mon filet → | `/campagnes/fonds-urgence` |
| `dettesCheres` | *(pas de fille dédiée — omettre le lien)* | — |
| `revenuNonProtege` | Estimer mon trou de salaire → | `/campagnes/assurance-invalidite` |
| `hypoSansVie` | Comparer banque vs famille → | `/campagnes/hypotheque-assurance-vie` |
| `epargneSansOrdre` | Voir l’ordre REER / CELI → | `/campagnes/retraite-reer-celi` |
| `projetCourt` | Explorer le CELIAPP (1ʳᵉ prop.) → | `/campagnes/celiapp` |
| `successionFloue` | Repérer les trous de liquidité → | `/campagnes/succession-bases` |

Sous-ligne obligatoire près du lien : `Approfondir ce point (éducatif) — pas un conseil personnalisé.`

### Intro / disclaimer outil (légers resserrages)

- **Intro :** Coche ce qui est vrai chez toi. On range urgent → important → plus tard. Brouillon éducatif, pas un plan sur mesure.  
- **Disclaimer :** Illustration éducative seulement — pas un conseil personnalisé. Des produits côte à côte ≠ une feuille de route.

### Labels paliers résultat

| Palier | Titre UI | Aide 1 ligne |
|--------|----------|--------------|
| Urgent | Urgent | À traiter avant d’optimiser le reste |
| Important | Important | Protection et risques qui pèsent lourd |
| Plus tard | Plus tard | Utile — sans culpabilité de ne pas tout faire maintenant |

---

## 2. FAQ (max 5) — coller dans `faq[]`

1. **Je peux utiliser seulement l’outil, sans rendez-vous ?**  
   Oui. L’ordre d’attaque est gratuit, sans compte et sans formulaire. Le RDV est optionnel — seulement si tu veux coller ça à ta vraie vie.

2. **C’est un plan personnalisé / sur mesure ?**  
   Non. C’est un brouillon éducatif qui illustre une logique (urgent → important → plus tard). Un plan réel part de ton portrait complet, en rencontre.

3. **Pourquoi un « ordre d’attaque » ?**  
   Parce que tout faire en même temps mène souvent nulle part. Filet, dettes chères et protection du revenu passent souvent avant d’optimiser l’épargne. Logique éducative — pas un conseil personnalisé.

4. **C’est long une planification ?**  
   La première rencontre exploratoire dure souvent 15–30 minutes. Ensuite, étape par étape — pas une vente de pile de produits en une shot.

5. **Tu vends un produit précis ici ?**  
   Non. Cette page est éducative. Les recommandations viennent après analyse de ta situation.

*(Garder le disclaimer page existant en bas de landing.)*

---

## 3. Ads Meta — ajustements (alignement outil-first)

Les Ad1–Ad3 (`emails/campagne-meta-catalog/plan-global.md`) sont déjà **outil-first** et soft. **Pas de refonte majeure.** Micro-alignements :

### Ad1 — Produits ≠ plan
- **Garder** structure + mythe REER+CELI+assurance.  
- **S’assurer** que la landing hero ne contredit plus (« Réserver » avant l’outil).  
- Titre / description : inchangés.

### Ad2 — Tout en même temps
- Déjà promet « Urgent. Important. Plus tard. » → l’UI **doit** montrer les paliers (sinon dissonance).  
- Aucun changement copy obligatoire ; option : ajouter en fin « Sur la page, tu vois les trois paliers — pas juste une liste. »

### Ad3 — Essaie l’outil, puis on regarde
- Déjà parfait vs soft close.  
- **Garder** « Essaie d’abord… 15 minutes… soft close, zéro vente forcée. »

### Disclaimer ads (inchangé)
> Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. L’outil donne une piste éducative (urgent / important / plus tard), pas un plan sur mesure.

---

## 4. PDF — microcopy

- Titre PDF : `Résumé — ordre d’attaque` (accents FR)  
- Note de bas : `Illustration éducative seulement — pas un conseil personnalisé. Des produits ouverts ne font pas un plan.`  
- Éviter ASCII `Resume` / `educative` / `coche` sans accents.

---

## 5. Phrases interdites / à éviter

| Éviter | Préférer |
|--------|----------|
| Ton plan personnalisé en 2 clics | Brouillon éducatif / ordre d’attaque illustratif |
| On va te vendre la bonne police | 15 min pour ancrer ton n°1 — soft, zéro pitch |
| Score / progression 43 % | X cochées · Ordre prêt |
| Télécharge le PDF et commence | Ton n°1 est clair — 15 min ou PDF pour garder |
| Prêt à clarifier ta situation ? | Tu as un n°1 — on l’attaque ensemble ? |

---

## Critères acceptation script

- [ ] H1 reste reconnaissable Ad1  
- [ ] Soft close post-outil cite `{order}`  
- [ ] FAQ couvre « outil seul » + « pas plan perso »  
- [ ] Aucun claim « plan sur mesure » / conseil personnalisé automatisé  
