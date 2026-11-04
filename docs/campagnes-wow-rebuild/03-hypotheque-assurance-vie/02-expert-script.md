# [#03] Expert script marketing — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, tutoiement, éducatif, sans pression  
**CTA final :** RDV Bookings — 15 min  
**Conformité :** claims validés / adoucis avec expert finance (fichier `04`)

---

## 1. Hero (prêt à coller)

| Élément | Texte final |
|---------|-------------|
| Badge | Assurance hypothécaire |
| Titre (H1) | Assurance de la banque ou protection pour la famille ? |
| Promesse | D’abord, estime ce qu’il faudrait vraiment aux proches — au-delà du solde. Ensuite, compare banque vs perso. |
| CTA primaire | Voir mon écart solde → famille |
| CTA secondaire | Réserver 15 minutes |
| Ligne confiance | Conseiller en sécurité financière · Victoriaville · contenu éducatif, sans pression |

---

## 2. Process / En bref (3 steps — remplace cards denses)

1. **Estime l’écart** — Solde du prêt vs un montant pensé pour les proches.
2. **Compare les deux logiques** — Prêteur ≠ protection personnelle (qui est protégé, coût, flexibilité).
3. **Clarifie en 15 min** — On lit ta situation ensemble, sans pression.

**Bullets data (si on garde le format actuel) :**
- Banque / prêteur : couverture souvent liée au solde qui diminue ; le coût « par dollar » peut grimper — et la prime peut être revue aux renouvellements*.
- Personnel : bénéficiaires choisis, capital que tu contrôles, souvent portable après l’hypothèque.
- Estimateur : solde + dettes + revenu de transition + imprévus → montant illustratif pour la famille.

---

## 3. Outil — titres & microcopy

| Slot | Texte |
|------|--------|
| Titre shell | Banque vs famille : chiffre l’écart, puis compare |
| Intro | L’assurance du prêteur et une protection personnelle, ce n’est pas le même produit. Estime d’abord ce qu’il faudrait aux proches — au-delà du seul solde. Ensuite, compare les deux logiques. |
| Label section estimateur | Combien pour la famille ? (au-delà du solde) |
| Intro estimateur | Même solde — on ajoute dettes, revenu de transition et imprévus pour illustrer un montant pensé pour les proches, pas seulement pour le prêt. |
| Card prêteur (renouvellement*) | Vers l’année {n}, si le solde a diminué d’environ moitié, la couverture liée au prêt suit souvent le solde — alors que la prime peut rester semblable **ou être revue au renouvellement\***. |
| Label result solde | Si on couvre seulement le solde |
| Label result famille | Montant illustratif pour la famille |
| Bandeau écart | Écart illustratif : +{auDelaDuPret} $ au-delà du prêt |
| Micro sous bandeau | C’est souvent ça qu’on clarifie en 15 minutes — sans pression. |
| `<details>` tableau | Approfondir : banque vs protection personnelle |
| Soft close inline (footer) | Ton illustration : {solde} vs {capitalFamille}. On clarifie banque vs perso en 15 min. |
| CTA post-outil | Clarifier banque vs famille (15 min) |
| PDF (secondaire) | Télécharger mon résumé PDF |
| Intro « À toi de jouer » (landing) | Remplis l’outil — tu vois ton écart, puis tu peux réserver 15 minutes si tu veux y voir clair. |

---

## 4. Soft close mid (navy)

| Slot | Texte |
|------|--------|
| Headline | On regarde ton écart solde → famille |
| Subline | 15 minutes, éducatif — tu gardes ton PDF. Sans pression. |
| CTA | Réserver 15 minutes |
| Secondaire | Lire la capsule assurance vie temporaire |

*(Si le shell peut injecter des montants depuis l’outil : « On regarde ton écart {solde} → {capitalFamille} » — idéal ; sinon headline ci-dessus.)*

---

## 5. FAQ (max 5) — coller dans `campagneAdsLandings.js`

1. **C’est la même chose que l’assurance vie ?**  
   Pas exactement. L’assurance créancier vise surtout à rembourser le prêteur. Une protection personnelle est pensée pour tes bénéficiaires, avec d’autres règles de durée, de montant et de portabilité.

2. **Pourquoi le coût « augmente » si ma prime ne change pas ?**  
   Si la prime reste semblable pendant que le solde (et donc souvent la couverture) diminue, tu paies un prix relatif plus élevé pour chaque dollar de protection. Illustration éducative — ton contrat peut différer.

3. **La prime du prêteur peut-elle monter aux renouvellements ?** *(NOUVELLE — aligne ads)*  
   Selon le contrat et le prêteur, la prime peut rester semblable ou être revue au renouvellement*. Ce n’est pas automatique partout — d’où l’intérêt de lire ta police et de comparer les deux logiques avant de décider.

4. **Faut-il assurer 100 % du solde seulement ?**  
   Pas automatiquement. On regarde aussi le quotidien des proches : autres dettes, revenu de transition, imprévus. L’outil compare « juste le solde » et un total illustratif pour la famille.

5. **Je dois annuler celle de la banque ?**  
   Pas automatiquement. On compare d’abord les deux logiques, puis ta situation. Remplacer ou modifier une protection liée au prêt dépend du prêteur et du contrat* — cette page ne remplace pas la lecture de ta police ni un conseil personnalisé.

---

## 6. Ads Meta — Ad1–Ad3 ajustées (outil-first)

Fichier : `emails/campagne-meta-catalog/assurance-hypothecaire.md`  
Disclaimer global inchangé (voir finance).

### Ad1 — Option 1 vs Option 2 (garder hook vidéo)

**Texte principal :**
> Tu as coché l’assurance du prêteur le jour de l’hypothèque ?
>
> Comme beaucoup de monde.
>
> Dans la vidéo : Option 1 — la prime peut monter aux renouvellements*, pendant que la couverture diminue avec le solde. Option 2 — assurance individuelle : prime et capital plus stables sur la durée choisie.
>
> Ce n’est pas le même produit. Pas le même but. Pas le même contrôle.
>
> Sur la page : tu chiffres d’abord ce qu’il faudrait aux proches — au-delà du solde — puis tu compares les deux logiques. Ensuite, tu réserves 15 minutes si tu veux clarifier (c’est le « formulaire » de la vidéo).
>
> Contenu éducatif. Pas un conseil personnalisé.
> https://www.pierreoliviercaouette.ca/campagnes/hypotheque-assurance-vie

**Titre :** Banque ou protection perso ?  
**Description :** Chiffre l’écart — puis 15 min

### Ad2 — Coût ↑ couverture ↓

**Texte principal :**
> Je pensais que l’assurance de la banque, c’était réglé une fois pour toutes.
>
> Faux — ou du moins, incomplet.
>
> Souvent, la couverture suit le solde qui baisse. La prime, elle, peut rester ou monter aux renouvellements*. Résultat : tu paies cher… pour de moins en moins de protection. Et le premier protégé, c’est souvent le prêteur — pas automatiquement ta famille.
>
> L’assurance individuelle, c’est une autre logique : bénéficiaires, capital choisi, portable si tu changes de prêteur.
>
> Regarde la vidéo, puis va sur la page pour estimer ton écart solde → famille. Quand tu es prêt, réserve 15 minutes — calme et concret.
> https://www.pierreoliviercaouette.ca/campagnes/hypotheque-assurance-vie

**Titre :** Prime ↑ couverture ↓ ?  
**Description :** Éducatif · 15 min sans pression

### Ad3 — Soft close (adouci conformité)

**Texte principal :**
> Avant de décider quoi que ce soit : compare.
>
> Revoir ou remplacer une protection liée au prêt, c’est souvent possible — mais ça dépend du prêteur et du contrat*. Pas de précipitation.
>
> Dans la vidéo : Option 1 (prêteur) vs Option 2 (individuelle), puis une estimation.
>
> Sur mon site : outil pour chiffrer l’écart famille + comparer, ensuite tu réserves 15 minutes. Le bouton « formulaire » de la vidéo = ce rendez-vous. Sans engagement. Pour y voir clair.
>
> Contenu éducatif. Titre : conseiller en sécurité financière.
> https://www.pierreoliviercaouette.ca/campagnes/hypotheque-assurance-vie

**Titre :** Compare tes protections  
**Description :** 15 minutes · sans engagement

---

## 7. Soft close idéal (référence émotionnelle)

> T’as ~{solde} côté prêt et ~{capitalFamille} illustrés pour la famille — {auDelaDuPret} d’écart. En 15 min on regarde si ta police banque couvre vraiment ce que tu crois, sans pression.

---

## 8. Disclaimer page / outil (court)

> Les contrats d’assurance créancier et d’assurance vie personnelle varient. Illustration éducative seulement — pas un amortissement exact ni un conseil personnalisé. Produits d’assurance de iA Groupe financier le cas échéant — analyse au cas par cas.

**Asterisks à prévoir en bas de page / ads :**  
`* Selon le contrat et le prêteur. Conditions variables.`
