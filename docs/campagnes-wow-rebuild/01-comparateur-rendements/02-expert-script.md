# [#01] Expert script marketing — Textes finaux

**Campagne :** `/campagnes/comparateur-rendements`  
**Signé :** Expert script marketing  
**Date :** 2026-11-04  
**Ton :** québécois parlé (tu), outil-first, conformité éducative  
**Principe :** Ad1–Ad3 vendent « tu joues d’abord » — la landing doit **tenir** la promesse.

---

## 1. Hero (coller dans `campagneAdsLandings.js`)

| Champ | Texte final |
|-------|-------------|
| `badge` | Comparateur |
| `title` | À profil égal, l’écart se compose |
| `promise` | Même montant, mêmes cotisations, même confort avec le risque — vois l’écart illustratif banque vs modèles. Gratuit, sans compte. |
| `seoTitle` | *(garder)* Comparateur de rendements \| Conseiller en sécurité financière |
| `seoDescription` | Illustre banque vs portefeuilles modèles à même style de placement. Outil gratuit, sans compte. Illustration seulement — passés ≠ futurs. Victoriaville. |

### CTA labels hero
| Rôle | Label | Action |
|------|-------|--------|
| Primaire | Voir mon écart | Scroll `#outil` |
| Secondaire | Réserver 15 minutes | `buildCampagneRdvPath('comparateur-rendements')` · track `campagne_comparateur-rendements_rdv` |

### Ligne confiance (sous hero / avant En bref)
Conseiller en sécurité financière · iA Groupe financier · Victoriaville — illustration, pas un pitch produit.

---

## 2. En bref — 3 bullets

1. Outil gratuit, zéro compte : tu entres tes chiffres, tu vois banque vs modèles tout de suite.
2. Même style de placement des deux côtés — c’est ça « à profil égal ».
3. Illustration seulement (passés ≠ futurs). Si ça chicotte, 15 minutes pour coller ça à ton relevé.

---

## 3. Intro outil (`CampagneAdsLanding.jsx` — remplacer L133–135)

**Eyebrow :** À toi de jouer *(garder)*  
**Phrase :** Ouvre. Ajuste. Regarde l’écart.  
*(PDF retiré de l’intro — il reste disponible en secondaire.)*

**Titre shell outil :** Banque vs modèles — même départ *(garder)*  
**Intro shell :** Même profil des deux côtés. Côté modèles : moyenne 5 ans nette de mes portefeuilles (mise à jour auto). Côté banque : préréglage ou le taux de ton relevé.

---

## 4. Soft close post-outil (dans l’outil, sous l’écart)

**Template dynamique :**
> T’as ~{formatCad(écart)} d’écart illustratif après {N} an(s), à profil égal. Ça chicotte ? On colle ça à ton relevé en 15 minutes — zéro pression.

**CTA primaire :** Réserver 15 minutes  
**Track :** `campagne_comparateur-rendements_rdv_tool`  
**Lien micro :** Saisis le taux de ton relevé juste au-dessus si tu veux coller ça à toi.  
**PDF (secondaire) :** Garder mon résumé PDF  
**Status si < 3/3 :** Entre ton montant, ce que tu ajoutes chaque mois, et l’horizon. / Regarde l’écart — mêmes chiffres, même style des deux côtés.

**Narration sous ResultCard écart (1 phrase) :**
> 2–3 points de plus par année, ça a l’air d’un détail — jusqu’à ce que ça se compose. Ici, l’illustration montre ≈ {formatCad(écart)} après {N} ans.

---

## 5. Soft close mid (bloc navy)

| Champ | Texte final |
|-------|-------------|
| `ctaHeadline` | Tu as l’écart illustratif. Et ton relevé ? |
| `ctaSubline` | 15 minutes pour relier l’illustration à ce que t’as déjà — pas pour te vendre un produit en vitesse. |
| CTA primaire | Réserver 15 minutes · track `_rdv_mid` |
| CTA secondaire | Ajuster mon écart → `#outil` *(remplace « Voir mon écart » → `/outils/…`)* |
| `apprendreLabel` | Ajuster mon écart |
| `apprendrePath` | `#outil` **ou** retirer le 2ᵉ bouton |
| `secondaryIsTool` | `true` = ancre page, **pas** sortie site |

**Avant → Après**
- Avant : « Prêt à clarifier ta situation ? » / « Voir mon écart » hors funnel  
- Après : tableau ci-dessus

---

## 6. Module preuve (titres + microcopy)

**Eyebrow :** Preuve composée  
**H2 :** Pourquoi 2–3 % ce n’est pas du détail  
**Lead :** Sur 20 ans, à profil égal, l’écart peut devenir une vraie somme — pas un chiffre « de publicité » isolé.  
**Légende table :** Préréglages banque illustratifs vs moyenne 5 ans nette modèles (série Classique), par profil.  
**Ligne signature :** Exemple 50 000 $ · 0 $/mois · 20 ans · profil équilibré → écart illustratif **calculé live**.  
**Chip outil (label) :** Essayer le scénario 50 k$ · 20 ans (mythe)  
**Micro chip :** Même illustration que le post — one tap.

---

## 7. FAQ (max 5) — remplacer / compléter `faq`

1. **Les chiffres garantissent-ils mon rendement futur ?**  
   Non. Ce sont des illustrations à partir de taux d’exemple. Les produits et les marchés diffèrent ; rien n’est garanti. Passés ≠ futurs.

2. **C’est quoi « à profil égal » ?**  
   On compare deux projections avec le même confort face aux hauts et aux bas et les mêmes montants. Ça isole l’effet du rendement illustratif — pas une recommandation de produit.

3. **C’est comparable ? C’est pas les mêmes produits…**  
   Exact : frais, structure et garanties peuvent différer. L’outil illustre un écart de rendement à profil et montants égaux — ce n’est pas une preuve que « c’est mieux », ni un conseil d’achat. On valide ensemble au RDV si tu veux.

4. **D’où viennent les taux ?**  
   Côté modèles : moyenne 5 ans nette des portefeuilles modèles iA (série Classique 75/75), selon le profil, à la date affichée dans l’outil. Côté banque : préréglage illustratif par profil — ou le taux que tu saisis depuis ton relevé.

5. **Dois-je passer par l’outil avant le rendez-vous ?**  
   Utile pour arriver avec un chiffre en tête, mais pas obligatoire. On peut commencer directement par 15 minutes de clarification.

---

## 8. Disclaimer page (remplacer L229–232 générique pour cette campagne)

Illustration éducative. Rendements nets annualisés 5 ans côté modèles (portefeuilles modèles iA, série Classique 75/75, date affichée dans l’outil). Préréglages bancaires illustratifs — ou taux saisi. Produits différents (frais, structure, garanties). Passés ≠ futurs. Pas un conseil personnalisé. Titre autorisé : conseiller en sécurité financière. Produits d’assurance de iA Groupe financier. Victoriaville.

*(Aligné commentaire épinglé ads.)*

---

## 9. Ads Meta — ajustements Ad1–Ad3

### Ad1 — Mythe (outil gratuit) — **garder structure, micro-alignement**
**Texte principal :** *(inchangé sur le fond — OK)*  
Optionnel fin : remplacer « Tu peux même télécharger un PDF… » par « Tu vois l’écart tout de suite. PDF optionnel si tu veux le garder. »  
**Titre :** Compare gratuitement — zéro compte  
**Description :** Outil interactif · sans formulaire pour commencer  
**CTA bouton :** En savoir plus

### Ad2 — Composition — **à renforcer (scénario 20 ans)**
**Texte principal (final) :**
> Je pensais que 2–3 % de plus par année, sur un relevé, c’était du détail. Presque rien.
>
> Comme beaucoup de monde.
>
> Jusqu’à ce que tu projettes — pis que tu vois ce que ça fait quand l’argent compose. Sur un scénario type 50 000 $ · 20 ans · à profil égal, l’écart illustratif peut devenir une vraie somme — pas un « détail ».
>
> Au lieu de te fier à un post, ouvre l’outil gratuit. Même profil des deux côtés : côté banque (préréglage ou ton taux) vs côté modèles. Change de profil. Change le taux. Regarde l’écart.
>
> C’est interactif. C’est gratuit. Pis t’as rien à remplir pour commencer — tu ouvres, tu joues.
>
> C’est pas une promesse de rendement. C’est une invitation à regarder ton relevé autrement, à profil égal.
>
> Essaie l’outil ici :
> https://www.pierreoliviercaouette.ca/campagnes/comparateur-rendements
>
> Ensuite, si tu veux relier ça à ta situation, 15 minutes avec moi — soft, sans pression.
>
> —
> Illustration. Moyennes 5 ans nettes vs préréglages. Produits différents. Passés ≠ futurs. Pas un conseil personnalisé. Conseiller en sécurité financière.

**Titre :** 2–3 % · compose sur 20 ans  
**Description :** Ouvre l’outil · scénario mythe inclus

### Ad3 — Soft close — **garder** (déjà excellent : « pas pour te vendre un produit en vitesse »)
Aucun changement majeur. S’assurer que le mid landing **reprend** la phrase Ad3 (fait en §5).

### Disclaimer épinglé (inchangé — obligatoire)
Illustration. Rendements nets annualisés 5 ans. Moyennes bancaires vs Portefeuilles Modèles iA (série Classique 75/75). Produits différents. Passés ≠ futurs. Pas un conseil personnalisé. Titre : conseiller en sécurité financière. Produits d’assurance de iA Groupe financier.

---

## 10. Fichiers à toucher (copy)

| Fichier | Quoi |
|---------|------|
| `frontend/src/data/campagneAdsLandings.js` | badge, promise, bullets, faq×5, ctaHeadline, ctaSubline, apprendre*, seoDescription, disclaimer optionnel |
| `frontend/src/pages/CampagneAdsLanding.jsx` | intro outil ; brancher ctaHeadline/Subline RDV ; labels dual CTA |
| `frontend/src/components/campagne/tools/ComparateurRendementsTool.jsx` | statusDetail, narration, soft close, chip label, PDF title FR |
| `emails/campagne-meta-catalog/comparateur-rendements.md` | Ad2 + micro Ad1 |

---

## 11. Critères acceptation script

- [ ] Ad1 « zéro compte / tu joues » = promesse hero tenue (CTA primaire outil).
- [ ] Soft close cite **le** chiffre d’écart du prospect.
- [ ] Aucune promesse de rendement futur ; vocabulaire « illustratif / illustration ».
- [ ] FAQ ferme « pas les mêmes produits » + « d’où viennent les taux ».
- [ ] Mid ≠ clone « Prêt à clarifier ta situation ? ».
