# [#06] Maladie grave — Spec OUTIL climax P1 (Vague 2 post-P0)

**Slug :** `/campagnes/maladie-grave`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Composant :** `frontend/src/components/campagne/tools/MaladieGraveTool.jsx`  
**Shell :** `CampagneToolShell` · `ToolSoftClose` (déjà branché sous écart)

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 6,5 | ≥ 8 |
| WOW outil | 6,5 | 7,5 | ≥ 8,5 |
| Env. booker | 4,5 | 6,5 | ≥ 7,5 |

**Top 1 gap outil :** l’écart amber — meilleur asset — est encore `text-lg` pendant que le capital est déjà `text-3xl/4xl`. Climax P1 = **hiérarchie typo écart**.

---

## Interdits (ne pas re-spécifier)

- SoftClose RDV / PDF ghost / events `…_rdv_tool` (livrés)
- Contraste 2 cols / solo / chip 0 $ / phrase 3 blocs (livrés)
- Nouveau SoftClose custom — garder `ToolSoftClose` uniquement

---

## 1. Climax P1 — écart MG `text-3xl+`

### Avant (code actuel ~L285)
```
<p className="font-heading text-lg font-bold tabular-nums text-dark">
  {formatCad(ecart)}
</p>
```

### Après
```
<p
  key={ecart}
  className="font-heading text-3xl font-bold tracking-tight tabular-nums text-dark sm:text-4xl"
  data-testid="mg-ecart-climax"
>
  {formatCad(ecart)}
</p>
```

**Hiérarchie lecture snapshot (haut → bas) :**

| Rang | Élément | Échelle |
|------|---------|---------|
| 1 | Capital illustratif | `text-3xl sm:text-4xl` (garder) |
| 2 | **Écart vs déjà couvert** | **`text-3xl sm:text-4xl`** ← upgrade |
| 3 | Phrase « ce que ça paie » | `text-sm` taupe |
| 4 | Breakdown rows | muted |
| 5 | SoftClose | sous bandeau (déjà OK) |

**Layout bandeau :** stack mobile — label + icône au-dessus, chiffre XXL dessous pleine largeur ; desktop : chiffre à droite ou centré sous label si trop serré. Uniformité catalogue : `font-heading` + `text-3xl/4xl` (pas d’échelle orpheline `text-5xl` sauf fit desktop).

**Formule :** inchangée  
`capital = remplacement + soins + surplus` · `ecart = capital − couvert` · solo = revenu 0.

---

## 2. Motion in-tool

| Motion | Trigger | Impl |
|--------|---------|------|
| Keyed reveal écart | `ecart` change / mount | `key={ecart}` + classe shell `animate-in fade-in slide-in-from-bottom-1` (ou helper partagé) · 200–300 ms |
| Fade SoftClose | `hasCapital` true | helper shell fade — pas de CSS one-off MG |
| Pulse border (opt) | 1× quand `ecart` change et `gapWarn` | `transition` border-amber — pas de loop |

`prefers-reduced-motion: reduce` → pas d’anim.

---

## 3. SoftClose placement

**Statut :** déjà sous climax dans le snapshot (`data-testid="mg-rdv-tool"`).  
Vague 2 : **ne pas déplacer** ; seulement s’assurer que le chiffre écart XXL + SoftClose restent **même viewport** mobile (réduire padding bandeau si besoin).

Tone SoftClose (option P1) : passer `tone="warn"` si `gapWarn`, `tone="ok"` sinon — props déjà supportées par `ToolSoftClose`.

---

## 4. Events analytics

| Event | Statut |
|-------|--------|
| `campagne_maladie-grave_rdv_tool` | ✅ garder |
| `campagne_maladie-grave_tool` / `_pdf` / `_rdv` / `_rdv_mid` | ✅ |
| `campagne_maladie-grave_ecart_reveal` | optionnel P2 — quand écart change après interaction |

Pas de nouvel event bloquant P0-v2.

---

## Spec Avant → Après

| Zone | Avant | Après | Fichier |
|------|-------|-------|---------|
| Chiffre écart | `text-lg` | `text-3xl sm:text-4xl` + `key={ecart}` | `MaladieGraveTool.jsx` |
| SoftClose | Présent sous bandeau | Inchangé (+ `tone` warn/ok optionnel) | idem |
| Motion | 0 | Reveal keyed + fade SoftClose shell | tool + helper shell |
| Contraste / solo / chip | Livrés P0 | Pas retoucher | — |

---

## Backlog outil

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| O-1 | Écart `text-3xl+` + layout bandeau | S | **P1 / P0-v2** |
| O-2 | Keyed reveal + reduced-motion | S | P1 |
| O-3 | `tone` SoftClose warn/ok | S | P1 |
| O-4 | Hint SCC 1 ligne + expand | S | P2 |
| O-5 | Event `ecart_reveal` | S | P2 |

---

## États QA

| Scénario | Attendu |
|----------|---------|
| Mount couple défaut | Capital 90 k$ · écart 90 k$ **XXL amber** · SoftClose visible |
| Solo | Capital ~48 k$ · écart XXL · pas de row conjoint |
| `dejaCouvert = 50k` | Écart 40 k$ XXL · CTA Clarifier |
| Couvert ≥ capital | Emerald · chiffre XXL · Valider |
| Reduced motion | Chiffre XXL sans anim |

---

## Critères acceptation OUTIL

- [ ] Écart ≥ `text-3xl` (`sm:text-4xl`) — même échelle catalogue que capital
- [ ] SoftClose = `ToolSoftClose` partagé, sous climax
- [ ] Reveal motion via helper shell
- [ ] Aucune régression solo / contraste / `…_rdv_tool`
- [ ] Labels « illustratif » conservés près du XXL
