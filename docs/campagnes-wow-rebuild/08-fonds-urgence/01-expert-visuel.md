# [#08] Fonds d’urgence — Spec visuelle (refonte WOW)

**Rôle :** Expert marketing visuel  
**Slug :** `/campagnes/fonds-urgence`  
**Date :** 2026-11-04  
**Sources :** audit `docs/plan-modification-marketing/08-fonds-urgence.md` · live page · `CampagneAdsLanding.jsx` · `FondsUrgenceTool.jsx` · brief ads « Filet d’abord. »  
**Note visuelle actuelle /10 :** 6 → **cible : 8+**

---

## 1. Vision 1 viewport (hero)

**Job unique :** promettre le calculateur (match Ad1–Ad3) + atmosphère « filet / liquidité », pas un template RDV générique.

| Élément | Spec |
|---------|------|
| Brand | Signal hero-level : nom conseiller + badge « Fonds d’urgence » — pas seulement la nav |
| Titre | Garder *Le filet avant d’accélérer l’investissement* (match Ad1) |
| Promesse | 1 phrase courte (voir script) — cible / écart / délai en 2 min |
| CTA group | **Primaire** blanc : « Calculer mon filet » → `#outil` · **Secondaire** texte : « ou réserver 15 min » → Bookings |
| Atmosphère | Navy plein cadre (brief ads), typo bold blanche, micro-ligne « Calculateur gratuit · Sans compte » — **pas** lifestyle soft, **pas** PageHero clone dots seul |
| Interdit 1er viewport | Stats, FAQ, PDF, schedule, photo lifestyle, badge flottant « 6 mois » |

**Test brand :** si on retire la nav, la page doit encore dire « filet d’urgence / Pierre-Olivier », pas « une landing CSF générique ».

---

## 2. Palette / typo / motion

### Palette (sujet « filet »)
- **Navy dominant** `#01233F` / `primary` — fond hero + mid soft-close
- **Ambre** (écart / warn) — climax « En clair » tant que `manquant > 0`
- **Émeraude** (atteint / ok) — barre + soft-close état surplus
- **Blanc / beige prestige** — corps, outil
- Éviter : orbs violet, cream terracotta, glow multi-couches

### Typo
- Titres : `font-heading` existant (ne pas introduire Inter/Roboto)
- Chiffre climax : déjà `text-3xl/4xl` — **garder** ; ajouter ligne bold rythme12 juste sous le gros $

### Motion (2–3 utiles — pas décoratif)
1. **Hero → outil** : scroll soft `#outil` au clic primaire (déjà pattern site)
2. **Barre « Vers ta cible »** : garder `transition-all duration-500` ; au mount / focus outil, micro-fade largeur depuis 0 → `pctVersCible` (1 seule fois)
3. **Soft-close post-climax** : apparition `opacity` 200–300 ms sous Metrics quand `cible > 0` (ambre↔émeraude selon ton)

---

## 3. Modules manquants (preuve / process / confiance)

| Module | Placement | Spec visuelle |
|--------|-----------|---------------|
| Dual CTA hero | Sous promesse | Bouton plein + lien texte (pas 2 pills égaux) |
| Proof strip local | Sous En bref **ou** sous soft-close outil | 1 ligne : `Conseiller en sécurité financière · Victoriaville / Centre-du-Québec · éducatif` — pas de card |
| Soft-close chiffré | **Immédiatement sous** Metrics (`FondsUrgenceTool` ~L516–541) | Bandeau ton `warn`/`ok` (même langage couleur que En clair) ; RDV primary, PDF outline |
| Module 1 ligne « carte ≠ filet » | Entre En bref et outil **ou** dans FAQ visuelle courte | Pas une card promo : 1 phrase + lien ancre FAQ |
| Process 15 min | Dans soft-close / mid | 3 mots max : « où garer · rythme · surplus » — pas icônes row |

---

## 4. Mobile (thumb zones)

- CTA hero primaire : pleine largeur, zone pouce bas-centre
- Secondaire « ou 15 min » : sous le bouton, pas à côté (évite collision)
- Post-climax : RDV full-width **avant** PDF ; PDF outline pleine largeur sous
- « À retenir » : `<details>` fermé par défaut sur mobile (coupe scroll soup)
- Mid navy : CTA blanc thumb-friendly ; Apprendre en lien texte sous

---

## 5. Avant → Après (composants / classes)

### A. Hero CTA — `CampagneAdsLanding.jsx` ~L62–88 + data landing
| Avant | Après |
|-------|-------|
| Un seul `Link` blanc `ctaLabel` → Bookings | Primaire `button`/`a` scroll `#outil` label « Calculer mon filet » ; secondaire `Link` Bookings « ou réserver 15 min » |
| `PageHero` navy/dots clone | Variante atmosphère « Filet d’abord. » (classe ou prop `atmosphere="filet"`) alignée brief ads |

### B. Zone post-climax — `FondsUrgenceTool.jsx` ~L516–555 + footer ~L318–327
| Avant | Après |
|-------|-------|
| Metrics → « À retenir » ouvert → footer PDF seul | Metrics → **bandeau soft-close** (RDV + PDF outline) → « À retenir » collapsible → footer status dual |
| PDF `bg-primary` rounded-full dominant | RDV `bg-primary` ; PDF `border` / outline (`ToolDownloadPdf` variant ou classes override) |

### C. Mid CTA — `CampagneAdsLanding.jsx` ~L181–210
| Avant | Après |
|-------|-------|
| Titre hardcodé « Prêt à clarifier ta situation ? » | Data-driven `ctaHeadline` / `ctaSubline` (fonds-urgence) — navy gradient OK, copy sujet |
| Aucune preuve locale | Ligne confiance CSF Victoriaville sous le CTA (texte `text-white/70`) |

---

## 6. Critères acceptation visuelle

- [ ] 1er viewport = brand + H1 + 1 promesse + dual CTA + atmosphère filet (pas dashboard)
- [ ] Identité sujet reconnaissable vs REEE / trop-jeune (pas shell clone pur)
- [ ] Climax ambre/émeraude lisible ; soft-close **dans les 2 s scroll** après Metrics
- [ ] Mobile : RDV avant PDF ; « À retenir » ne pousse pas le mid hors écran
- [ ] Zéro overlay badge / sticker sur hero media

---

## 7. Hors scope visuel (dette shell partagée)

Industrialiser une fois pour les 15 (ne pas sur-customiser #08) :
1. Dual CTA hero outil-first (`CampagneAdsLanding`)
2. Slot `postResultCta` dans `CampagneToolShell`
3. Mid `ctaHeadline` / `ctaSubline` data-driven

#08 consomme ces slots + ajoute atmosphère « Filet d’abord. » et soft-close ton ambre/émeraude.
