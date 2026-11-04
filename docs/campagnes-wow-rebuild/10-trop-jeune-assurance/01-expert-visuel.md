# [#10] Trop jeune — Spec VISUEL (refonte WOW)

**Rôle :** Expert marketing visuel  
**Slug :** `/campagnes/trop-jeune-assurance`  
**Date :** 2026-11-04  
**Sources :** live + audit `10-trop-jeune-assurance.md` + `TropJeuneTool.jsx` + `CampagneAdsLanding.jsx`  
**Objectif :** mythe-âge reconnaissable en 3 s · climax $ personnel · CTA RDV collé au score · envie de booker

---

## 0. Diagnostic (1 paragraphe)

Hero navy template + CTA blanc « Réserver 15 minutes » = soft-close Meta cassé (ads = outil d’abord). Titre mythe fort, mais atmosphère interchangeable avec les autres landings. Outil charge déjà score **33/100** + pastilles Hypothèque · Famille + **455 000 $** — climax spoilé, pas « mon » geste. Breakdown existe en lignes muted ; le total opaque domine. Post-Lecture = footer PDF seul ; mid CTA « Prêt à clarifier… » trop loin et générique. Identité sujet absente : pas de contraste mythe-bancaire, pas de pastille « Score gratuit · sans compte », pas de bandeau score-aware sous Lecture.

**Note visuelle actuelle /10 :** 6

---

## 1. Hero — composition 1 viewport

### Cible (brand first)
Après retrait de la nav, le viewport doit encore dire **« trop jeune ? » + score gratuit**, pas « landing assurance générique ».

| Élément | Spec |
|---------|------|
| Brand | Logo iA + nom (nav existante) — inchangé |
| Badge | Garder `Assurance vie` **ou** remplacer par `Mythe · 22–35` (pastille secondary) |
| Titre | Garder « Je suis trop jeune… » — vraiment ? (hero-level) |
| Promesse | 1 phrase (voir script) — max 2 lignes mobile |
| CTA group | **Primaire** outil + **secondaire** RDV texte (pas un seul bouton vente) |
| Atmosphère | Contraste mythe-bancaire (navy profond + accent or/ambre sur le mot « trop jeune ») — pas orbs catalogue seuls |

### Avant → Après (composants)

1. **CTA hero**  
   - Avant : 1 `Link` RDV (`CampagneAdsLanding.jsx` ~L79–88) label `ctaLabel`  
   - Après :  
     - Primaire : `<a href="#outil">` / scroll smooth · classe actuelle white pill · label **Voir mon score**  
     - Secondaire : lien texte blanc/80 sous le pill · **Ou réserver 15 min** → `rdvPath` + `trackRendezVousClick('campagne_trop-jeune-assurance_rdv')`  
   - Shell : ajouter props optionnelles `ctaPrimaryHref` / `ctaSecondaryLabel` **ou** override local si `slug === 'trop-jeune-assurance'` (préférer data-driven : `ctaLabel: 'Voir mon score'`, `ctaHref: '#outil'`, `ctaSecondaryLabel`).

2. **Ancre outil**  
   - Wrapper outil (`CampagneAdsLanding.jsx` ~L117–137) : `id="outil"` sur le conteneur.

3. **Pastille confiance sous promesse (fold)**  
   - 1 ligne : `Score gratuit · sans compte · Victoriaville`  
   - Classes : `text-xs text-white/70` sous description PageHero — data `trustLine` optionnelle.

### Atmosphère mythe-âge (léger, pas redesign global)
- Option A (S) : `PageHero` inchangé + badge + trust line + dual CTA — suffisant P0.  
- Option B (M) : accent typographique sur « trop jeune » (span `text-secondary` ou `text-amber-200`) dans le titre data — sans changer toute la palette site.

**Éviter :** cards dans le hero · stats · overlays · collage photos · purple glow.

---

## 2. Corps — modules & hiérarchie

### En bref
- Garder 3 items numérotés (job claire).  
- Réduire « card soup » : ombre plus légère OK ; pas de 4e card.  
- Bullet #3 = score/présent-futur (script) — alignement visuel ads.

### Intro outil (au-dessus du shell)
- Avant : « Remplis l’outil — tu repars avec un résumé clair et un PDF à garder. » (PDF-first)  
- Après : « Coche ton présent + tes projets connus. Le score bouge en live — sans compte. »  
- Option : pastille `Sans formulaire` à côté de « À toi de jouer ».

### Climax $ (dans l’outil — rendu visuel)
Le WOW visuel = **split typographique**, pas une 2e card.

```
[ ResultCard total 455 000 $ ]          ← gros, font-heading
  Aujourd’hui ~5 000 $ · Projets connus ~450 000 $   ← sous-ligne dominante (text-sm font-medium text-dark)
[ Breakdown rows existants ]            ← garder, grouper Présent / Projets
```

- Total reste hero chiffre.  
- Sous-ligne **pas** muted taupe — contraste fort (c’est l’aha Ad2).  
- Grouper breakdown : titres micro `Présent` / `Projets connus` (uppercase tracking secondary).

### Soft-close bandeau sous Lecture (thumb zone)
Collé immédiatement sous le bloc breakdown (avant footer shell) :

| État | Visuel |
|------|--------|
| `score ≥ 40` | Bandeau `rounded-2xl bg-primary text-white` · score + capital · CTA blanc « Lire mon score en 15 min » |
| `15–39` | Même structure, ton `from-primary/90` · CTA « Clarifier mon score · 15 min » |
| `< 15` | Fond beige · CTA texte RDV + PDF primaire dans footer |

Mobile : bandeau full-width, bouton full-width, au-dessus du fold pouce après scroll Lecture.

### Proof strip (1 ligne, post-outil ou sous mid)
`Conseiller en sécurité financière · Victoriaville · clarifier ≠ acheter`  
Classes : `text-center text-xs text-prestige-taupe` — pas de card.

### Mid CTA shell
- Avant : gradient hardcodé « Prêt à clarifier… » (`CampagneAdsLanding.jsx` ~L181–210)  
- Après : lire `item.ctaHeadline` / `item.ctaSubline` aussi en mode RDV (comme form) — copy score-aware (script).  
- Visuel : garder gradient ; ajouter micro-ligne confiance sous les boutons.

---

## 3. Motion (2–3 utiles, pas décoratifs)

1. **Barre score** — déjà `transition-all duration-500` : garder ; s’assurer que le toggle Oui/Non déclenche un vrai saut visible (defaults `non` → aha).  
2. **Sous-ligne split capital** — `transition-opacity` / léger `animate-in fade` quand `aDuFutur` passe false→true (1ère fois).  
3. **Pastilles contrib** — apparition staggered légère (50–80 ms) quand un segment s’ajoute — ownership du geste.  
4. Hero : **pas** de parallax ; scroll `#outil` smooth suffit.

---

## 4. Mobile

| Zone | Spec |
|------|------|
| Hero | Dual CTA : primaire full-width ; secondaire centré dessous (tap 44px) |
| Score sticky option P1 | Barre score sticky top sous nav pendant scroll Présent→Futur (option M) |
| Lecture → soft close | Soft close dans les 2 s visuelles post-climax (même écran ou ½ swipe) |
| PDF | Secondaire : outline / texte ; RDV = filled primary dans bandeau |

---

## 5. Confiance / preuve (modules manquants)

1. Pastille fold « Score gratuit · sans compte »  
2. Proof strip CSF · Victoriaville  
3. Soft close qui **cite** score + capital (preuve que l’outil a « lu » le prospect)  
4. Option P2 : photo conseiller 40px + prénom près du mid CTA (si asset dispo) — pas bloquant

---

## 6. TOP 3 upgrades visuels (ship)

| # | Avant | Après | Fichier | Effort |
|---|-------|-------|---------|--------|
| 1 | CTA hero RDV seul | Primaire `#outil` + secondaire RDV | `CampagneAdsLanding.jsx` + data | S |
| 2 | Total $ opaque | Total + sous-ligne Aujourd’hui / Projets | `TropJeuneTool.jsx` ResultCard | S |
| 3 | Vide post-Lecture → mid loin | Bandeau soft-close collé sous breakdown | `TropJeuneTool.jsx` | M |

---

## 7. Critères acceptation visuel

- [ ] Viewport 1 : brand + mythe + promesse score + CTA outil-first  
- [ ] Ami comprend en 5 s : « score trop jeune / projets » (pas juste « assurance »)  
- [ ] Split présent/projets lisible sans ouvrir le breakdown  
- [ ] Soft close RDV visible dans la zone pouce juste après le total $  
- [ ] Pas de nouveau card soup ; identité mythe via copy + dual CTA + split, pas redesign site
)
