# [#14] Succession — bases — Expert marketing visuel

**Slug :** `/campagnes/succession-bases`  
**Date :** 2026-11-04  
**Sources :** live page, `CampagneAdsLanding.jsx`, `PageHero.jsx`, `SuccessionChecklistTool.jsx`, ads `succession-bases.md`, audit `14-succession-bases.md`  
**Note visuelle actuelle /10 :** 6 → cible WOW **8+**

---

## 1. Vision visuelle (1 paragraphe)

La page doit « sentir » le dossier familial et la liquidité — pas un clone catalogue navy/orbes. Dès le hero : message-match Ad1 (« Plus tard… »), CTA outil-first, atmosphère **dossier / clarté** (contraste patrimoine-sur-papier vs cash accessible), jamais funéraire. L’outil révèle les Trous seulement après interaction ; le soft close mid rejoue les cases vides. Split visuel clair **Moi 15 min (CSF)** | **Notaire (testament)** avant le mid CTA. Un ami qui regarde l’écran en 5 s doit lire : « trous de liquidité → 15 min avec le conseiller, pas un remplace-notaire ».

---

## 2. Hero — composition 1 viewport

| Élément | Spec Après |
|---------|------------|
| Brand | Nav iA / PO inchangée ; hero ne doit plus être interchangeable avec une autre campagne |
| Badge | `Succession` (garder) — option : `Succession · Checklist` si shell le permet |
| H1 | **Plus tard, c’est souvent trop tard** (Ad1 — message match Meta) |
| Promesse | 1 phrase checklist / sans compte / notaire reste (voir script) |
| CTA groupe | **Primaire** : « Remplir la checklist » → `#outil` (bouton blanc shell) · **Secondaire** : lien texte « Ou réserver 15 minutes » → RDV |
| Atmosphère | Texture « dossier » légère (lignes / papier / contraste cash vs actifs) sur fond navy existant — **pas** cercueil, croix, fleurs, silhouette funéraire |
| Confiance au-dessus du fold | Ligne discrète sous CTAs : `Conseiller en sécurité financière · Victoriaville` (photo mini si slot shell existe ; sinon texte seul en P1) |

**Avant → Après (composants) :**
1. **Avant :** `PageHero` + 1 seul `Link` RDV blanc (`CampagneAdsLanding.jsx` ~L79–88). **Après :** dual CTA — primaire scroll `#outil` + secondaire RDV texte ; id `outil` sur le wrapper outil (~L117).
2. **Avant :** H1 produit « Succession : liquidité et clarté… ». **Après :** H1 Ad1 via `campagneAdsLandings.js` `title`.
3. **Avant :** orbes génériques seuls. **Après :** même `PageHero` + overlay thématique optionnel `heroAccent: 'succession'` **ou** CSS scoped (max 1 shell) — silhouette dossier / 2 colonnes « actifs ≠ liquidité » en watermark très léger (opacity ≤ 0,08).

---

## 3. Palette / typo / motion

### Palette (variables existantes + accents)
- **Base :** `--primary` navy, `--secondary` or/bleu campagne, `prestige-beige`, blanc.
- **Warn trous :** `amber-50` / `amber-600` — **uniquement après** `count ≥ 1` (pas à froid).
- **OK :** `emerald-50` / `emerald-800` (piliers complets).
- **Split CSF | Notaire :** fond `from-primary/[0.04]` (CSF) vs `bg-prestige-beige/40` (notaire) — pas de rouge « danger mort ».

### Typo
- Titres : `font-heading` (existant).
- H1 hero : garder taille actuelle ; ne pas allonger (Ad1 est court = bien).
- Labels outil : uppercase tracking `text-secondary` inchangé.

### Motion (2–3 utiles — pas de bruit)
1. **Reveal Trous** : grille `ResultCard` Trous + piliers en `opacity-0 → 100` + léger `translate-y` (`duration-500`) quand `count` passe de 0 → ≥1.
2. **Progress bar** : garder `transition-all duration-500` existante.
3. **Soft-close outil** : apparition du bandeau RDV sous portrait quand `missingCount ≥ 1` (même timing que reveal) — pic émotionnel collé au CTA.

Éviter : orbes qui bougent, confetti, pulse funéraire.

---

## 4. Modules manquants (preuve / process / confiance)

| Module | Où | Spec visuelle |
|--------|-----|----------------|
| Process 3 steps | Sous « En bref » ou juste au-dessus de l’outil | ① Coche ce qui est vrai · ② Portrait des trous · ③ 15 min CSF **ou** notaire — 3 puces horizontales desktop / stack mobile, **sans cards lourdes** |
| Split CSF \| Notaire | Sous l’outil, avant mid CTA | 2 colonnes : gauche « Avec moi (15 min) — liquidité & bénéficiaires » ; droite « Avec le notaire — testament & cadre légal » |
| Soft close mid succession | Bandeau navy existant (~L181) | Copy Ad3 (script) ; retirer concurrence visuelle capsule Apprendre en outline secondaire plus faible **ou** lien texte sous le CTA |
| Confiance humaine | Mid + éventuellement footer outil | Photo CSF + titre + Victoriaville si asset dispo ; sinon ligne texte forte |

---

## 5. Corps de page — hiérarchie

1. Hero (message + outil-first)  
2. En bref (3 bullets — outcomes premiers mois / collective OK)  
3. Process 3 steps (nouveau, léger)  
4. Outil `#outil` — **cases d’abord sur mobile**, portrait sticky/après 1ʳᵉ coche  
5. Split CSF \| Notaire  
6. Mid CTA Ad3  
7. FAQ (5 max)  
8. Disclaimer pied  

**Densité outil :** aujourd’hui portrait + 3 ResultCards + 3 piliers + 6 cases + Scale + notes = soup. Après : invite 1 ligne à `count === 0` ; cartes Trous seulement si `count ≥ 1` ; **1 seul** bouton PDF (footer).

---

## 6. Mobile — thumb zones

| Zone | Spec |
|------|------|
| Hero CTA primaire | Pleine largeur pouce, au-dessus du secondaire texte |
| Première interaction | Cases liquidité dans le 1er écran outil — **déplacer portrait sous les cases** en `flex-col-reverse` mobile **ou** portrait après 1ʳᵉ coche seulement |
| Soft close outil | Bouton RDV sticky bottom optionnel P2 ; P0 = CTA plein largeur dans footer outil |
| Mid bandeau | CTA RDV full-width ; Apprendre en lien texte |

---

## 7. Soft close / form — digne du climax

Le mid navy générique « Prêt à clarifier… » n’est **pas** digne des Trous. Visuellement :
- Titre mid = question Ad3 (cases vides).
- Sous-titre cite le rôle CSF vs notaire (pas « on regarde ton résumé » seul).
- CTA blanc primaire = Réserver 15 minutes.
- Capsule Apprendre = secondaire ghost / lien — ne pas égaliser les 2 boutons.

---

## 8. 3 upgrades visuels WOW (priorisés)

| # | Avant | Après | Fichier | Impact | Effort |
|---|-------|-------|---------|--------|--------|
| 1 | H1 produit + CTA RDV seul | H1 Ad1 + primaire `#outil` + secondaire RDV | `campagneAdsLandings.js` + `CampagneAdsLanding.jsx` | H | S–M |
| 2 | Trous warn dès 0/6 + double PDF | Invite vide ; reveal grille si `count ≥ 1` ; 1 PDF footer | `SuccessionChecklistTool.jsx` | H | M |
| 3 | Rappel Scale en fin de liste seulement | Bloc 2 colonnes CSF \| Notaire sous outil + mid Ad3 | Tool + landing data / mid props | H | S–M |

---

## 9. Hors scope visuel

- Refonte globale `PageHero` pour tout le catalogue (seulement slot accent / dual CTA).  
- Imagerie générative funéraire ou « tout est réglé ».  
- Commit / implémentation (ce livrable = spec).
