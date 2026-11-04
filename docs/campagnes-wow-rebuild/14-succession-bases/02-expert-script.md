# [#14] Succession — bases — Expert script marketing

**Slug :** `/campagnes/succession-bases`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, zéro dramatisation funéraire  
**CTA final :** RDV Bookings (`buildCampagneRdvPath` → `/rendez-vous/campagne`)  
**Fichiers cibles :** `campagneAdsLandings.js` (`succession-bases`), `CampagneAdsLanding.jsx` (mid props), `SuccessionChecklistTool.jsx` (microcopy), `emails/campagne-meta-catalog/succession-bases.md`

---

## 1. Textes finaux — landing (prêts à coller)

### Hero

| Champ | Texte |
|-------|--------|
| `badge` | Succession |
| `title` (H1) | Plus tard, c’est souvent trop tard |
| `promise` | Checklist liquidité / succession : tu coches ce qui est vrai aujourd’hui. Sans compte. Le notaire reste essentiel pour le juridique. |
| CTA primaire (hero) | Remplir la checklist |
| CTA secondaire (hero) | Ou réserver 15 minutes |
| Ligne confiance | Conseiller en sécurité financière · Victoriaville — 15 min pour la liquidité ; le notaire pour le cadre légal. |

### En bref (`bullets`)

1. Qui a besoin d’argent vite les premiers mois ? (liquidité ≠ maison ou REER sur papier)
2. Bénéficiaires à jour — polices, REER, CELI, collective
3. Testament et contrats : est-ce qu’ils se parlent ?

### Intro outil (au-dessus du shell)

| Champ | Texte |
|-------|--------|
| Eyebrow | À toi de jouer |
| Ligne | Coche ce qui est en place — ton portrait des trous se construit en direct. PDF en bonus, pas en destination. |

### Microcopy outil

| Moment | Texte |
|--------|--------|
| Invite `count === 0` | Commence par la liquidité — coche seulement ce qui est vrai aujourd’hui. |
| Sous progress si trou #1 = liquidités | Argent accessible ≠ maison sur papier — souvent le 1er vrai trou. |
| Soft close `missingCount ≥ 1` | T’as {N} cases vides{dontLiquidite}. En 15 minutes on relie ça à ta vie ; le notaire reste pour le testament. Clarifier, c’est pas acheter. |
| `{dontLiquidite}` | si `nextItem.id === 'liquidites'` → ` — dont la liquidité` ; sinon `''` |
| CTA outil primaire | Réserver 15 minutes |
| CTA outil / PDF | Télécharger mon résumé PDF *(outline / secondaire)* |
| Complet (`missingCount === 0`) | Belle base. On peut valider liquidité & bénéficiaires en 15 min ; le notaire garde le juridique. |
| Next-step CSF (liquidités / dettes-hypotheque / beneficiaires) | Prochaine étape utile avec moi : {short}. |
| Next-step testament | Testament → notaire. En 15 min je t’aide à préparer la bonne conversation. |
| Next-step inventaire / discussion | Prochaine case : {short}. Si tu veux prioriser, 15 min suffisent. |

### Split CSF | Notaire

| Colonne | Titre | Corps |
|---------|-------|--------|
| Gauche | Avec moi (15 min) | Liquidité des premiers mois, plan revenu / dettes, bénéficiaires (assurance, REER, CELI, collective). Clarifier ≠ acheter. |
| Droite | Avec le notaire | Testament et cadre légal. Cette checklist ne le remplace pas — elle prépare la bonne conversation. |

### Mid CTA (bandeau)

| Champ | Texte |
|-------|--------|
| `ctaHeadline` | Des cases vides te chicottent ? |
| `ctaSubline` | 15 min liquidité & bénéficiaires avec moi — notaire pour le testament. Zéro pression. |
| `ctaLabel` | Réserver 15 minutes |
| `apprendreLabel` | Lire la capsule succession *(secondaire)* |

### SEO (inchangé d’esprit, aligné H1)

| Champ | Texte |
|-------|--------|
| `seoTitle` | Bases de la succession \| Conseiller en sécurité financière |
| `seoDescription` | Checklist liquidité et succession : trous à voir avant le « plus tard ». Contenu éducatif. Conseiller en sécurité financière à Victoriaville. Ne remplace pas un notaire. |

---

## 2. FAQ (max 5) — `faq[]`

1. **Tu remplaces le notaire ?**  
   Non. On clarifie le volet sécurité financière : liquidité, revenu / dettes, bénéficiaires. Le notaire reste central pour le testament et le cadre légal.

2. **En 15 minutes, on fait quoi ?**  
   On lit ta checklist ensemble : ce qui est flou côté argent accessible et bénéficiaires, et ce qui doit aller chez le notaire. Pas de pitch produit. Clarifier, c’est pas acheter.

3. **C’est payant, l’appel ?**  
   L’appel découverte de 15 minutes est sans frais et sans pression. Si une suite est pertinente, on te l’explique clairement avant.

4. **Avoir une maison et des placements, ça suffit ?**  
   Pas forcément. Sur le papier ça fait « en ordre » ; dans la vraie vie, la famille a souvent besoin d’argent accessible tout de suite. Liquidité ≠ patrimoine sur papier.

5. **C’est seulement pour les grandes fortunes ?**  
   Non. Une hypothèque, des enfants ou une entreprise suffisent souvent à justifier de la clarté.

---

## 3. Disclaimer (pied + outil)

**Pied page (garder / renforcer) :**  
Contenu éducatif et général. Titre autorisé : conseiller en sécurité financière. Ne constitue pas un conseil personnalisé. Ne remplace pas un notaire ni un avis juridique. Chaque situation est unique.

**Outil (garder) :**  
Contenu éducatif seulement — pas un conseil personnalisé. Ne remplace pas un notaire ni un avis juridique.

---

## 4. Ads Meta — ajustements (alignement outil-first)

Les Ad1–Ad3 actuelles sont déjà fortes. Ajustements mineurs :

### Ad1 — Mythe « plus tard » (titre inchangé)
- **Titre :** Plus tard, c’est souvent trop tard  
- **Description :** Checklist gratuite · sans compte  
- **Corps :** garder ; s’assurer que la landing H1 = titre Ad1 (déjà spécifié). Soft close inchangé (« si ça te chicotte, 15 minutes »).

### Ad2 — Liquidité ≠ actifs
- **Titre :** Liquidité d’abord  
- **Description :** Éducatif · ne remplace pas un notaire  
- **Micro-ajout optionnel en fin :** « Sur la page, le portrait des trous apparaît après tes coches — pas avant. »

### Ad3 — Pas besoin de RDV pour commencer
- **Titre :** Checklist avant le RDV  
- **Description :** Gratuit · sans compte · conseiller en sécurité financière  
- **Alignement hero :** promesse « sans formulaire » → CTA landing primaire = checklist (`#outil`), pas RDV froid.

**Disclaimer ads (inchangé) :** Contenu éducatif et général. Titre : conseiller en sécurité financière. Ne remplace pas un notaire. Pas un conseil personnalisé.

---

## 5. Tableau Avant → Après (copy critique)

| Élément | Avant | Après |
|---------|-------|-------|
| H1 | Succession : liquidité et clarté avant le « plus tard » | Plus tard, c’est souvent trop tard |
| Promesse | Repérer les trous… sans remplacer le notaire. | Checklist… Sans compte. Le notaire reste essentiel… |
| Hero CTA | Réserver 15 minutes (seul) | Remplir la checklist (+ secondaire RDV) |
| Mid | Prêt à clarifier ta situation ? | Des cases vides te chicottent ? |
| Mid sub | On regarde ton résumé ensemble si tu veux. | 15 min liquidité & bénéficiaires — notaire pour le testament. Zéro pression. |
| Sortie outil | PDF + notaire | {N} trous · 15 min CSF ; testament = notaire |
| FAQ | 3 (pas de 15 min / tarif) | 5 (+ En 15 min ? + C’est payant ?) |

---

## 6. Phrases interdites / à éviter

- « Succession réglée », « tout est en ordre grâce à nous »
- « On remplace ton notaire » / sous-entendu juridique
- Imagerie verbale funéraire choc (« jour de ta mort », « quand tu décèdes » en accroche — garder « si tu manques » / « premiers mois » comme aujourd’hui)
- « Conseil personnalisé gratuit qui te dit quoi signer »
- Urgence fake (« dernière chance », countdown)

---

## 7. Events / labels analytics (copy IDs)

- Hero outil : `campagne_succession-bases_outil_cta` (select_content)
- Hero RDV : `campagne_succession-bases_rdv` (existant)
- Outil RDV : `campagne_succession-bases_rdv_tool` (**nouveau** — critique)
- Mid RDV : `campagne_succession-bases_rdv_mid` (existant)
- PDF : `campagne_succession-bases_pdf` (existant)
