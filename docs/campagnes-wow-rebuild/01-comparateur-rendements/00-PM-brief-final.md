# [#01] Brief final PM — Comparateur rendements (WOW → booker)

**Slug :** `/campagnes/comparateur-rendements`  
**Signé :** Gestionnaire de projet  
**Date :** 2026-11-04  
**Livrables lus :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Live QA :** écart defaults ~**12 088 $** (6,3 % vs 9,2 % · asOf 30 juin 2026) · CTA hero = RDV seul · PDF primaire · fuite mid `/outils/…`  
**Objectif conversion :** client Meta dit « damn » sur l’écart → book **15 min** (Bookings campagne)  
**Conformité :** éducatif / illustration / CSF · iA — voir finance

---

## 1. Vision WOW (1 paragraphe)

Le prospect arrive d’une ad qui promet un **outil gratuit, zéro compte** ; la page doit le laisser **jouer avant de booker**. Premier viewport = marque + mythe « à profil égal, l’écart se compose » + CTA primaire **Voir mon écart**. L’outil garde ses defaults pour un aha immédiat (~12 k$ sur 10 ans), offre un one-tap **mythe 50 k$ · 20 ans** pour casser « 2–3 % = détail », et monétise le climax : sous l’**écart illustratif**, soft close québécois qui cite *son* chiffre + RDV en ≤2 s — PDF en outline. Mid navy myth-specific (« Et ton relevé ? »), plus de fuite hors funnel. Preuve 5 profils + disclaimer Classique 75/75 ferment le réflexe « c’est de la pub ». Résultat : damn → calendrier, pas damn → souvenir PDF.

---

## 2. Backlog shippable

### P0 — Ship conversion (doit partir ensemble)

| ID | Item | Effort | Owner conceptuel | Fichiers |
|----|------|--------|------------------|----------|
| P0-1 | Soft close chiffré + CTA RDV sous écart ; PDF outline ; `statusDetail` anti-PDF-first | S | Outil + Script | `ComparateurRendementsTool.jsx`, `CampagneToolShell.jsx` (`ToolDownloadPdf` variant) |
| P0-2 | Couper fuite mid « Voir mon écart » → `/outils/…` ; brancher `secondaryIsTool` → `#outil` ; `ctaHeadline`/`ctaSubline` sur mid RDV | S | Outil + Script + **Shell** | `CampagneAdsLanding.jsx`, `campagneAdsLandings.js` |
| P0-3 | Hero outil-first : badge Comparateur, promesse + gratuit, dual CTA (scroll `#outil` + RDV ghost), `id="outil"` | S | Visuel + Script + **Shell** | `campagneAdsLandings.js`, `CampagneAdsLanding.jsx` |
| P0-4 | Chip preset mythe 50 k$ · 0 $ · 20 ans · équilibré | S | Outil | `ComparateurRendementsTool.jsx` |
| P0-5 | Narration « 2–3 % ≠ détail » sous écart + event `…_result` 1× | S | Outil + Script | `ComparateurRendementsTool.jsx` |
| P0-6 | FAQ +2 (mêmes produits / d’où les taux) + disclaimers outil/page = ads (Classique 75/75, produits différents) | S | Finance + Script | `campagneAdsLandings.js`, tool `disclaimer`, bas de page |
| P0-7 | PDF accents FR + notes méthodo finance | S | Outil + Finance | `ComparateurRendementsTool.jsx` `handleDownload` |
| P0-8 | Copy mid + bullets + intro outil (« Ouvre. Ajuste… ») + confiance CSF/iA/Victoriaville | S | Script + Visuel | data + `CampagneAdsLanding.jsx` |

### P1 — Amplifie WOW / preuve ads

| ID | Item | Effort | Fichiers |
|----|------|--------|----------|
| P1-1 | Module preuve : table 5 profils + ligne projection 20 ans **calculée live** + disclaimer adjacent | M | `CampagneAdsLanding.jsx` et/ou data `proof*`, rates / `getIaPct` |
| P1-2 | Motion climax (fade/scale écart + remount barres) + bandeau RDV slide-up | S–M | `ComparateurRendementsTool.jsx` |
| P1-3 | Ligne contraste Banque / Modèles dans hero (atmosphère sujet) | S | `CampagneAdsLanding.jsx` / `PageHero` children |
| P1-4 | Ad2 catalog : scénario composé 20 ans (formulation finance-safe) | S | `emails/campagne-meta-catalog/comparateur-rendements.md` |
| P1-5 | Invite highlight « saisis le taux de ton relevé » si préréglage encore actif post-climax | S | tool |
| P1-6 | Mobile : masquer taux inline sur radios non sélectionnés | S | tool |

### P2 — Nice-to-have

| ID | Item | Effort |
|----|------|--------|
| P2-1 | Sticky mini-bar écart mobile | M |
| P2-2 | Reorder UI : écart au-dessus des cards totaux | S |
| P2-3 | Variante `PageHero` `atmosphere="split-compare"` réutilisable | M |
| P2-4 | Chip « Revenir au départ 10 k$ · 10 ans » | S |

---

## 3. Ordre d’implémentation recommandé

```
1. Shell générique (débloque 14 campagnes + #01)
   └─ dual CTA hero · ctaHeadline/Subline mid RDV · secondaryIsTool · ToolDownloadPdf outline
2. Data + copy #01 (badge, promise, bullets, FAQ, mid, disclaimer)
3. ComparateurRendementsTool P0 (soft close RDV, chip mythe, narration, PDF FR, event result)
4. Ancre #outil + intro + ligne confiance
5. QA live mobile (defaults + chip 20 ans + UTM Bookings)
6. P1 preuve + motion + Ad2
7. P2 si bande passante
```

**Parallélisation :** étapes 1–2 (shell + data) en parallèle de 3 (outil) si 2 devs ; finance review sur copy avant merge ads.

---

## 4. Dépendances shell vs spécifique

| Couche | Items | Impact autres campagnes |
|--------|-------|-------------------------|
| **Shell** `CampagneAdsLanding` / `CampagneToolShell` / `PageHero` | Dual CTA hero, mid `ctaHeadline`/`ctaSubline`, `secondaryIsTool` réel, PDF outline | Positif — templates génériques aujourd’hui soft-broken (`secondaryIsTool` mort ; mid hardcodé) |
| **Spécifique #01** | Chip mythe, soft close chiffré, narration, preuve 5 profils, disclaimers Classique, Ad2 | Isolé au slug + tool + catalog |

**Règle PM :** merger le shell **avec** feature flag / props data-driven pour ne pas casser les 14 autres landings (defaults = comportement actuel si champs absents).

---

## 5. Critères d’acceptation « effet WOW + booker »

### Expérience
- [ ] 1er viewport : CTA primaire = **Voir mon écart** (pas RDV seul).
- [ ] En <10 s : écart illustratif visible (defaults OK).
- [ ] Chip mythe 50 k$ · 20 ans change l’écart de façon évidente (objection « détail » fissurée).
- [ ] ≤2 s après lecture de l’écart : CTA **Réserver 15 minutes** visible (tool track `_rdv_tool`).
- [ ] PDF n’est plus le bouton le plus saturé (outline / secondaire).
- [ ] Mid : pas de lien vers `/outils/comparateur-rendements` ; copy ≠ « Prêt à clarifier ta situation ? ».
- [ ] Ami qui voit l’écran comprend en 5 s pourquoi booker (chiffre + relevé + 15 min).

### Conformité (gate finance)
- [ ] « Illustratif / illustration » sur écart + soft close + PDF.
- [ ] Classique 75/75 + passés ≠ futurs + produits différents + CSF/iA.
- [ ] Aucun « tu vas gagner / garanti / meilleur que ta banque ».
- [ ] Montants 20 ans non hardcodés stale en UI.

### Analytics
- [ ] `_result` 1× à 3/3 ; `_rdv_tool` ; `_hero_outil` ; UTM préservés sur Bookings.

### Score cible (vs audit 2026-11-04)
| Métrique | Avant | Cible ship |
|----------|-------|------------|
| Expérience globale | 5,5 | ≥ 8 |
| Effet WOW outil | 6,5 | ≥ 8,5 |
| Envie de booker | 4,5 | ≥ 8 |

---

## 6. Risques & mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Hero dual CTA = changement shell | Régression autres campagnes | Props optionnelles ; default = CTA unique actuel |
| Écart agressif → réflexe « pub » | Baisse confiance / plainte | FAQ produits + disclaimer adjacent + ton Ad3 |
| Chiffre 20 ans / Ad2 stale | Non-conformité perçue | Calcul live ; copy « vraie somme » si pas de date |
| Progress 3/3 spoil le « je joue » | Moins de geste | Garder defaults (Ad1) + chip mythe pour 2ᵉ aha ; ne pas vider les champs |
| PDF encore trop visible | Book ↓ | Outline + soft close au-dessus du footer |
| `secondaryIsTool` mal branché | Fuite funnel Meta | Test QA : mid secondaire = scroll `#outil` only |
| Taux modèles changent (`asOf`) | QA / screenshots obsolètes | Accepter dynamisme ; ne pas figer $ dans ads |

---

## 7. Hors scope (cette itération)

- Refonte globale `PageHero` pour tout le site.
- Nouveau design system / nouvelle police.
- Photo conseiller obligatoire.
- Changer la formule `futureValueMonthly` ou les préréglages banque sans brief finance séparé.
- Commit / deploy — **sur demande PM produit seulement** (brief livré 2026-11-04, pas de commit agent).

---

## 8. Definition of Done

1. P0-1 → P0-8 mergés et testés mobile + desktop sur `/campagnes/comparateur-rendements`.  
2. Parcours Meta simulé : Ad1 promise → hero outil → damn écart → click `_rdv_tool` avec UTM.  
3. Finance checklist §6 du livrable `04` cochée.  
4. P1-1 + P1-4 si on aligne le post organique / Ad2 le même sprint.  
5. Audit scores re-mesurés (même grille que `plan-modification-marketing/01-…`).

**Go / No-Go booker :** Go seulement si P0-1, P0-2, P0-3 et gate conformité sont verts.
