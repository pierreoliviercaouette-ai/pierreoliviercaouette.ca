# [#06] Maladie grave — Spec SCRIPT (textes finaux)

**Slug :** `/campagnes/maladie-grave`  
**Fichier :** `02-expert-script.md`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, calme, éducatif — Clarifier ≠ acheter  
**CTA final :** RDV Bookings 15 min

---

## 1. Landing — textes prêts à coller

### Hero (`campagneAdsLandings.js` → `maladie-grave`)

| Champ | Texte final |
|-------|-------------|
| `badge` | Maladie grave |
| `title` | Maladie grave ≠ invalidité — un capital à part |
| `promise` | Trois blocs concrets pour un ordre de grandeur — sans compte. L’invalidité paie un revenu ; la MG, un capital. |
| `ctaLabel` (hero secondary / mid) | Réserver 15 minutes |
| `ctaPrimaryTool` *(nouveau — shell)* | Estimer mon capital |
| `ctaHeadline` | Ton capital illustratif, on le lit ensemble |
| `ctaSubline` | 15 min — ta brochure collective, les exclusions, si un capital a du sens chez toi. Clarifier ≠ acheter. |

**Chips hero (visuel) — labels :**
- `Invalidité = revenu dans le temps`
- `MG = capital forfaitaire`

**Ligne confiance mid :**
`Conseiller en sécurité financière · Victoriaville · éducatif, pas un pitch`

### En bref (`bullets`)

1. Remplacer un moment le revenu du/de la conjoint(e) — s’il ou elle coupe ses heures
2. Soins non couverts — ordre de grandeur ~33 000 $ (SCC 2024, ajustable)
3. Surplus qualité de vie + ce que t’as déjà (collective ou individuel)

### Intro outil (zone « À toi de jouer » — shell copy)

**Avant :** Remplis l’outil — tu repars avec un résumé clair et un PDF à garder.  
**Après :** Bouge les chiffres — tu vois un capital illustratif et l’écart vs ce que t’as déjà. Ensuite, si ça te chicotte, 15 minutes.

### Soft close in-tool (sous écart — prioritaire)

**Si écart > 0 :**
> Écart illustratif ~{ecart}. En 15 min on ouvre ta brochure — ce que la collective couvre vraiment, les exclusions, si un capital a du sens. Clarifier ≠ acheter.

**CTA bouton :** `Clarifier cet écart en 15 min`  
*(si espace : `Clarifier cet écart (~{ecart}) en 15 min`)*

**Si écart ≤ 0 :**
> Sur papier, ton besoin illustré est couvert. En 15 min on valide quand même maladies, délais et exclusions du contrat — Clarifier ≠ acheter.

**CTA :** `Valider ça en 15 min`

**PDF ghost :** `Télécharger mon résumé PDF`

**statusDetail footer (remplace PDF-first) :**
- écart > 0 : `Y’a un écart illustratif. Le prochain pas, c’est de le lire avec ta brochure — pas juste un PDF.`
- écart ≤ 0 : `Sur papier t’es couvert pour ce besoin. Un RDV sert à valider le contrat, pas à te vendre.`

### Intro tool shell (`MaladieGraveTool` title/intro)

| Champ | Texte |
|-------|-------|
| `title` | Combien viser en cas de maladie grave ? |
| `intro` | Trois blocs : remplacer le revenu du conjoint un moment (si applicable), payer les soins non couverts, garder un surplus pour la qualité de vie. Ça complète l’invalidité — ça la remplace pas. |
| Sous-titre capital | Ex. : ~{remplacement} pour {mois} mois côté conjoint, ~{soins} soins hors couverture, ~{surplus} pour respirer. |
| Sous-titre capital (solo / pas de conjoint) | Ex. : ~{soins} soins hors couverture + ~{surplus} pour respirer — sans bloc conjoint. |

### Champs / chips

| UI | Label / hint |
|----|----------------|
| Chip | `Pas de conjoint à remplacer` |
| Chip active | `Je ne sais pas → 0 $` (sur déjà couvert) |
| Pont brochure sous couvert | En RDV on ouvre ta brochure : capital MG collectif souvent petit / conditionnel. |
| Module 2 cols — col G | **Invalidité** · Chèque de paie partiel · revenu dans le temps |
| Module 2 cols — col D | **Maladie grave** · Capital forfaitaire · une fois si le contrat s’applique · 3 blocs |

### Disclaimer outil (garder + resserrer)
> Illustration éducative seulement. Les maladies couvertes, délais de survie, montants et exclusions dépendent du contrat. Pas un conseil personnalisé. Les montants (incl. ~33 000 $ SCC) sont des ordres de grandeur — pas ce que « tu vas recevoir ».

---

## 2. FAQ (max 5) — `faq[]`

1. **C’est la même chose que l’assurance invalidité ?**  
   Non. L’invalidité remplace une partie du revenu pendant que tu ne peux plus travailler. La maladie grave peut verser un capital forfaitaire si le diagnostic et les conditions du contrat s’alignent. Deux jobs différentes — et pas interchangeables.

2. **Ma collective couvre déjà la maladie grave ?**  
   Parfois un petit capital, souvent avec conditions (maladies listées, délai de survie, exclusions). « J’ai déjà quelque chose » ≠ « c’est réglé ». En 15 min on ouvre ta brochure et on regarde ce qu’elle couvre vraiment.

3. **Quelles maladies / quel délai de survie ?**  
   Ça dépend entièrement du contrat. Pas une liste universelle. On le lit ensemble — Clarifier ≠ acheter.

4. **Est-ce que ça remplace l’assurance vie ?**  
   Non. La maladie grave te verse un montant de ton vivant si les conditions sont remplies. L’assurance vie protège surtout tes proches à ton décès.

5. **Tout le monde en a besoin ?**  
   Non. Ça dépend de tes liquidités, de ce que ton collectif couvre déjà, et de ta tolérance au risque. On le regarde ensemble, sans pression.

---

## 3. Ads Meta — ajustements (alignement outil-first)

Fichier : `emails/campagne-meta-catalog/maladie-grave.md`

### Ad1 — Mythe (garder structure, resserrer CTA)

**Titre :** Invalidité ≠ capital maladie grave  
**Description :** Outil gratuit · sans compte

**Texte principal (final) :**
> Je pensais que mon assurance invalidité réglait « aussi » une maladie grave.
>
> Comme beaucoup de monde.
>
> L’invalidité, c’est surtout un chèque de paie partiel. La maladie grave, quand le contrat s’applique, c’est un capital. Une grosse somme. Une fois. Deux jobs différentes.
>
> Sur la page : un outil gratuit — conjoint (si applicable) + soins + qualité de vie. Tu vois un capital illustratif et l’écart vs ce que t’as déjà. Sans compte. Sans formulaire.
>
> Si le chiffre te chicotte : 15 minutes. On ouvre ta brochure. Clarifier ≠ acheter.
>
> https://www.pierreoliviercaouette.ca/campagnes/maladie-grave
>
> Contenu éducatif. Pas un conseil personnalisé. Les garanties dépendent du contrat.

### Ad2 — Trois blocs (garder + soft close brochure)

**Titre :** Conjoint + soins + qualité de vie  
**Description :** Estimateur gratuit · pas un conseil personnalisé

**Ajustement fin de texte :**
> Quand t’as ton ordre de grandeur — et l’écart vs ta collective — tu décides : trop tôt, déjà couvert, ou on lit la brochure ensemble en 15 minutes. Zéro pression.

*(Reste du corps Ad2 actuel = OK.)*

### Ad3 — Essaie d’abord (renforcer match hero outil-first)

**Titre :** Essaie l’outil — sans compte  
**Description :** Soft close · 15 min si tu veux

**Garder** le corps actuel ; s’assurer landing hero = « Estimer mon capital » (sinon dissonance Ad3).

**Disclaimer ads (commentaire épinglé) :**
> Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. Maladies, délais de survie, montants et exclusions = contrat. Invalidité ≠ maladie grave. Aucun capital n’est promis comme une garantie.

---

## 4. PDF — accents (fix copy)

Corriger chaînes sans accents dans `handleDownload` :

| Avant | Après |
|-------|-------|
| Resume — maladie grave | Résumé — maladie grave |
| Soins non couverts (estime) | Soins non couverts (estimé) |
| Surplus qualite de vie | Surplus qualité de vie |
| Resultat | Résultat |
| Capital illustratif a viser | Capital illustratif à viser |
| Deja couvert | Déjà couvert |
| Ecart vs besoin | Écart vs besoin |
| versee / educative | versée / éducative |

Notes PDF (garder sens) :
1. SOINS_STAT_NOTE (SCC)
2. Capital MG = somme versée si diagnostic couvert — selon contrat
3. Illustration éducative — complète l’invalidité, ne la remplace pas

---

## 5. SEO (léger)

| Champ | Texte |
|-------|-------|
| `seoTitle` | Assurance maladie grave \| Conseiller en sécurité financière |
| `seoDescription` | Estimer un capital maladie grave (3 blocs) et le distinguer de l’invalidité. Outil gratuit · Victoriaville. |

---

## 6. Conformité copy (checklist script)
- [ ] Jamais « tu recevras 90 000 $ » / « tu es couvert pour X $ »
- [ ] Toujours « illustratif », « ordre de grandeur », « si le contrat s’applique »
- [ ] SCC = Canada, ajustable — pas QC personnalisé
- [ ] « Clarifier ≠ acheter » présent soft close outil + mid + ads
- [ ] MG complète l’invalidité, ne la remplace pas
