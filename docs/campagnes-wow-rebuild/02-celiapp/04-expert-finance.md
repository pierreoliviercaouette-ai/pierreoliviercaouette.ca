# [#02] CELIAPP — Validation finances & fiscalité (QC / fédéral)

**Rôle :** Expert finances & fiscalité  
**Slug :** `/campagnes/celiapp`  
**Date :** 2026-11-04  
**Réf. :** ARC CELIAPP (droits de participation), audit `02-celiapp.md`, copy ads + landing

---

## 1. Chiffres à garder (illustratifs 2026)

| Concept | Montant | Usage page / outil |
|---------|---------|-------------------|
| Nouveaux droits / année | **8 000 $** | Plafond annuel **simplifié** du simulateur |
| Plafond à vie | **40 000 $** | Barre + clamp vie |
| Période max participation | **15 ans** (règles ARC — horizon outil déjà `max={15}`) | OK |

**Statut :** 8 000 $ / 40 000 $ restent les montants de référence publics 2026 (non indexés comme le CELI). Toujours les qualifier d’**illustratifs** et « à revalider ».

---

## 2. Nuance obligatoire : reports (carry-forward)

- Les droits inutilisés peuvent se reporter (jusqu’à **8 000 $** de report) → une année donnée, une personne peut parfois cotiser jusqu’à **16 000 $** si compte ouvert antérieurement + droits inutilisés.
- L’outil P0 qui **clamp à 8 000 $** est acceptable **si** le copy dit clairement :
  - « 8 000 $ de **nouveaux droits** / année (illustratif) »
  - et, si l’usager saisit > 8 000 $ : hint « on retient le plafond illustratif de nouveaux droits — les reports peuvent changer ton max réel (à valider au dossier / ARC) ».

**Ne pas** écrire : « tu ne peux jamais mettre plus de 8 000 $ dans une année » (faux si reports).

**Ne pas** (P0) complexifier le moteur avec un champ « droits reportés » — risque d’erreur + fausse précision. P2 éventuel seulement avec disclaimer fort.

---

## 3. Vocabulaire — corrections

| À éviter / risqué | Préférer |
|-------------------|----------|
| « ta mise de fonds va grandir » (implique rendement) | « ce que ton rythme de **cotisations** projette » |
| « max 8 000 $ / an » sans nuance | « 8 000 $ de nouveaux droits / an (illustratif) » |
| « tu as le droit » / « admissible » (vert) | « critères à vérifier » / « on valide en RDV » |
| « CELIAPP remplace le CELI » | « CELIAPP ≠ CELI — deux jobs » |
| « RAP = même chose » | « RAP (REER) ≠ CELIAPP — ordres différents » |
| « tu achèteras / tu auras ta mise » | jamais — projection cotisations seulement |
| Titre « planificateur financier » etc. | **conseiller en sécurité financière** uniquement |

**CELI vs CELIAPP :** OK de contraster objectif / retrait / plafonds en 3 lignes **éducatives** — pas de tableau fiscal exhaustif (déductions, transferts REER→CELIAPP, imposition retrait non admissible).

---

## 4. Claims risqués (copy / ads) — verdict

| Claim | Verdict | Action |
|-------|---------|--------|
| Simulateur gratuit, sans compte | OK | Garder |
| Cotisations seulement, pas de rendement inventé | OK — **obligatoire** | Garder partout (outil, PDF, ads) |
| « où ça te mène » (Ad2) | OK si = projection cotisations | Pas « assez pour ta maison » |
| Ad1 « ouvrir trop tard » | OK émotionnel | Ne pas dire « tu perds X $ » chiffré |
| Soft close « droit d’ouvrir » | OK comme **sujet de RDV** | Pas comme résultat outil |
| Gap Projection vs Cible | OK éducatif | Dire « cotisations seulement » ; cible = souhait user, pas norme AMF |
| Checklist 3 toggles | OK si soft | Interdit : score, « admissible ✓ », blocage cotisation |
| « Deux conjoints = 80 000 $ » | Vrai en principe (2×40 k) | **Ne pas** mettre en hero/outil sans contexte admissibilité individuelle |

---

## 5. Disclaimers obligatoires

**Outil (shell) — version validée :**  
Illustration éducative seulement — pas un conseil personnalisé. Chiffres 2026 illustratifs (8 000 $ de nouveaux droits / année, 40 000 $ à vie ; les reports peuvent modifier le maximum d’une année). Qui a le droit, les retraits, les transferts et l’impôt : à revalider selon ta situation. Total = cotisations projetées seulement — aucun rendement inventé.

**PDF notes :** mêmes idées + accents FR corrigés.

**Ads / pied de page :**  
Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. Aucune promesse de rendement. Plafonds, admissibilité et règles fiscales évoluent — à revalider avant de cotiser ou d’ouvrir.

**Checklist :**  
Toujours : « Pas un verdict d’admissibilité. »

---

## 6. Ce qu’on ne doit **pas** promettre

1. Que le prospect **aura** sa mise de fonds / achètera plus vite  
2. Un **rendement** ou un solde futur placé  
3. Qu’il **est** (ou n’est pas) admissible au CELIAPP  
4. Qu’ouvrir maintenant est **toujours** optimal fiscalement  
5. Un ordre universel CELIAPP → CELI → RAP  
6. Que 12 k$ / 16 k$ / 40 k$ « suffit » pour une propriété au Québec  
7. Des plafonds « garantis à vie » sans « illustratif / évolue »

---

## 7. Admissibilité — cadrage pour l’équipe

Points **éducatifs** (FAQ / checklist), jamais comme output calculé :

- Résidence / statut canadien (règles ARC)
- Âge admissible
- Critères de premier acheteur / habitation admissible
- Période de participation (dont horizon max ~15 ans)
- Retrait admissible vs conséquences si achat glisse ou n’a pas lieu

→ Tout doute = pont RDV 15 min. L’outil ne délivre **aucun** feu vert/rouge.

---

## 8. Alignement chiffres produit ↔ conformité

| Élément code | OK ? | Note |
|--------------|------|------|
| `PLAFOND_ANNUEL = 8000` | OK illustratif | Nuancer « nouveaux droits » dans UI |
| `PLAFOND_VIE = 40000` | OK | |
| Pas de rendement | OK | Ne pas « améliorer » avec taux |
| Defaults 4 k × 4 ans = 16 k | OK | Scénario réaliste, sous le plafond vie |
| Cible maison user | OK | Pas une norme réglementaire |
| Message clamp > 8 k | OK + hint reports | Activer en retirant `max={8000}` |

---

## 9. Checklist revue avant ship

- [ ] Aucun « tu es admissible » dans l’UI
- [ ] « Cotisations seulement » visible au climax
- [ ] « Illustratif 2026 » près des 8 k / 40 k
- [ ] Titre professionnel exact (CSF)
- [ ] Ads ne promettent pas la mise ni un rendement
- [ ] FAQ « achat qui glisse » reste prudente (pas de conseil fiscal détaillé)
