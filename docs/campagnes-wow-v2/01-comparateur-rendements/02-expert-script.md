# [#01] Comparateur rendements — Expert script marketing

**Slug :** `/campagnes/comparateur-rendements`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Signé :** Expert script marketing  
**Ton :** québécois parlé (tu), éducatif, outil-first  
**Interdits V2 :** ne pas réécrire SoftClose / mid `ctaHeadline`/`ctaSubline` / dual CTA labels sauf gap réel post-P0.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | **7,2** | **9,0** |
| WOW outil | 6,5 | **7,4** | **9,0** |
| Env. booker | 4,5 | **7,0** | **8,5** |

**Top 1 gap WOW restant (script) :** le fold n’a **aucun micro-copy sujet** (Banque|Modèles) ; badge encore générique `Rendements` ; process strip absent → la promesse ads « tu joues le comparateur » n’est pas ancrée en 5 s hors H1.

---

## Verdict

P0 a livré soft close chiffré, mid « Ton écart est clair… », narration composition, chip mythe — **garder**. Vague 2 = textes **différenciants fold + process** seulement. Soft close / mid : **pas de rewrite** (copy déjà québécoise et booker-ready).

---

## 1. Ajustements fold (si générique)

| Champ | Après P0 (code) | Vague 2 | Motif |
|-------|-----------------|---------|-------|
| `badge` | `Rendements` | **`Comparateur`** | Signal sujet ads |
| `title` | À profil égal, l’écart se compose | **Garder** | Déjà fort |
| `promise` | Même montant… côte à côte. | Optionnel + « Gratuit, sans compte. » si absent en live | Ad promise |
| `heroToolLabel` | Comparer mon écart | **Garder** | Dual CTA livré |
| Soft close headline | Template ~écart… | **Garder** | Déjà livré |
| `ctaHeadline` / `ctaSubline` | Ton écart est clair… | **Garder** | Déjà livré |

**Ne pas toucher :** bullets majeurs, FAQ existantes (sauf +2 finance si encore manquantes — voir §5), intro outil si déjà « Ouvre. Ajuste… ».

---

## 2. `heroExtras` — micro-copy

```js
heroExtras: {
  kind: 'split-pair',
  left: { label: 'Banque', hint: 'préréglage / relevé' },
  right: { label: 'Modèles', hint: 'moyenne 5 ans nette' },
}
```

Alternatives rejetées (trop pitch) : « Ta banque perd », « On bat le relevé », « Gain garanti ».

---

## 3. Process strip — 3 steps max

| # | `title` | `hint` |
|---|---------|--------|
| 1 | Tes chiffres | Même départ des deux côtés |
| 2 | Profil égal | Même confort face au risque |
| 3 | L’écart | Illustration — pas une garantie |

Eyebrow section (si le composant catalogue en a un) : **Comment ça marche**  
*(libellé eyebrow = **identique** aux autres campagnes si le shell le fixe — ne pas inventer « Le comparateur en 3 temps » one-off).*

---

## 4. Soft close / mid — gaps post-P0 seulement

| Zone | Statut | Action V2 |
|------|--------|-----------|
| Soft close outil (chiffre + RDV + PDF ghost) | Livré | **Aucune rewrite** — seulement **placement** sous climax (outil) |
| Mid navy | Livré | **Aucune rewrite** — ajouter portrait + libellé CSF catalogue (visuel) |
| Subline SoftClose « Saisis le taux… » | Livré | Garder |
| Narration « 2–3 points… » | Livrée | Garder ; finance OK si « illustratif » reste |

**Invite highlight (outil, P1)** — micro-copy seulement si préréglage encore actif post-climax :
> Pour coller ça à toi : saisis le % de ton relevé au champ banque.

Pas un 2ᵉ SoftClose.

---

## 5. FAQ — gaps P0 éventuellement non shippés

Si absentes en data live, ajouter (finance-safe) :

1. **« C’est les mêmes produits banque vs modèles ? »**  
   Non. Produits différents (frais, structure, garanties). L’outil isole un écart de rendement **illustratif** à profil égal — pas une recommandation de transfert.

2. **« D’où viennent les taux ? »**  
   Côté modèles : moyenne 5 ans nette des portefeuilles modèles (série Classique 75/75), date affichée dans l’outil. Côté banque : préréglage illustratif selon le profil, ou le taux que tu saisis depuis ton relevé.

---

## 6. Chip reset (P2 copy)

`Revenir au départ (10 k$ · 10 ans)` — secondaire au chip mythe.

---

## Spec Avant → Après

| Zone | Avant | Après V2 | Fichiers |
|------|-------|----------|----------|
| Badge | Rendements | Comparateur | `campagneAdsLandings.js` |
| heroExtras | — | Banque / Modèles + hints | data + slot landing |
| processSteps | — | 3 titres + hints ci-dessus | data |
| SoftClose copy | Livré | Inchangé | — |
| Mid copy | Livré | Inchangé | — |
| FAQ +2 | À vérifier live | Ajouter si manquantes | data |

---

## Backlog (script)

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| S-1 | Badge Comparateur + heroExtras copy | S | **P0-v2** |
| S-2 | processSteps × 3 | S | **P0-v2** |
| S-3 | FAQ produits / d’où les taux (si absentes) | S | **P0-v2** |
| S-4 | Invite highlight relevé (post-climax) | S | P1 |
| S-5 | Chip « Revenir au départ » | S | P2 |
| S-6 | Ad2 catalog formulation 20 ans (finance-safe) | S | P1 |

---

## Uniformité copy

- SoftClose / mid : **composant + structure catalogue** — on ne livre pas de textes « bandeau custom ».
- Portrait mid : libellé **fixe** `Conseiller en sécurité financière · Victoriaville` (pas de bio longue).
- Process eyebrow : suivre le shell, pas un titre one-off #01.
