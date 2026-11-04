# [#12] Travailleur autonome — Expert script marketing

**Slug :** `/campagnes/travailleur-autonome`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif — Clarifier ≠ acheter  
**Verrouillé :** Soft close outil / mid `ctaHeadline`/`ctaSubline` / dual CTA — **ne pas réécrire** (gap post-P0 = fold chrome, pas pont RDV).

---

## Rescore post-P0 (copy)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | ≥ 8,5 |
| WOW outil | 5,5 | 7 | ≥ 8,5 |
| Env. booker | 5 | 7,5 | ≥ 8,5 |

**Top 1 gap WOW restant :** fold sans micro-signaux sujet ; process absent. H1/promise déjà bons — **garder**.

---

## Textes différenciants (prêts à coller)

### `heroExtras` (fold)

| Champ | Texte |
|-------|-------|
| `kicker` | Pas de RH · revenu variable |
| `chip1` | Filet à cocher |
| `chip2` | Mois mauvais |

### `processSteps` — **3 max** (contrat catalogue)

| # | `label` |
|---|--------|
| 1 | Coche ton filet |
| 2 | Vois les trous (liquidité → revenu) |
| 3 | 15 min si ça chicotte |

*(Rebuild avait 4 steps ; Uniformité = 3. Le PDF reste « optionnel » dans bullet En bref / SoftClose, pas une step process.)*

### H1 / promise — **inchangés**

| Champ | Texte (garder) |
|-------|----------------|
| `title` | Travailleur autonome : pas d’assurance collective fournie |
| `promise` | Coche ton filet : liquidité, revenu, proches — quand le revenu varie et qu’il n’y a pas d’assurance collective fournie. |

Pas de rewrite : fold n’est plus générique en **texte** ; le gap est chrome CSS + process.

### Soft close / mid — **inchangés** (sauf gap réel = non)

| Champ | Statut |
|-------|--------|
| `ctaHeadline` | Une case te chicotte — revenu qui stoppe, hypo qui continue ? → **OK** |
| `ctaSubline` | 15 min pour prioriser liquidité puis protection du revenu. Clarifier ≠ acheter. → **OK** |
| SoftClose outil templates | `Ton filet est mince — prochaine case : {short}` → **OK** |

### Portrait / confiance mid (libellé catalogue — ne pas inventer)

> Conseiller en sécurité financière · Victoriaville

Optionnel micro sous portrait (1 ligne, même partout ou slug-aware soft) :  
`15 min pour prioriser ton filet — Clarifier ≠ acheter.`

### Intro outil shell (optionnel P1 override)

| Champ | Texte |
|-------|-------|
| `toolIntro` *(slug)* | Coche ton filet — tu vois les trous dans le bon ordre. PDF optionnel. |

Remplace le générique « Remplis l’outil… » si le shell lit `item.toolIntro` (déjà supporté L72–76 `CampagneAdsLanding.jsx`).

---

## Climax copy — renfort léger (outil, pas SoftClose)

Uniquement si expert outil monte `filetValue` en XXL — micro labels :

| Label ResultCard | Texte |
|------------------|-------|
| État | État du filet *(garder)* |
| Quand `Mince` | *(pas de sous-titre alarmiste)* — detail existant mois mauvais suffit |
| Badge trou #1 | en premier *(garder)* |

**Ne pas** ajouter « Remplacer la collective » ni % de remplacement.

---

## Ads — pas de retouche Vague 2

Ad1–Ad3 + disclaimer épinglé : **inchangés**. Alignement hero « Coche ton filet » déjà tenu post-P0.

---

## Interdits copy V2

- Réécrire SoftClose / Clarifier ≠ acheter
- Process à 4 steps (casse Uniformité)
- Nouveau claim chiffré urgence / invalidité
- « Remplacer la collective »

---

## Critères script V2

- [ ] `heroExtras` + 3 process steps collés en data
- [ ] H1/promise/mid SoftClose intacts
- [ ] Ami en 5 s lit « autonome / filet / mois mauvais » via kicker + chips + process
