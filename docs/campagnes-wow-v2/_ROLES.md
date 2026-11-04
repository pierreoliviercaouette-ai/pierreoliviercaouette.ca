# Mandats des rôles — Vague 2 WOW (post-P0)

**Contexte :** Vague 0+1 P0 déjà en code (`ToolSoftClose`, hero outil-first, `ctaHeadline`, chips, etc.).  
**But Vague 2 :** effet WOW différenciant — chrome page + climax outil.  
**Choix verrouillé :** **pas de nouvelles photos** → atmosphères CSS, micro-signaux sujet, portrait existant `/seo/portrait.jpg`.

## Interdits (ne pas re-spécifier)

- Soft close RDV / PDF ghost (déjà livré)
- Hero dual CTA outil-first (déjà livré)
- `ctaHeadline` / `ctaSubline` mid (déjà livré)
- Shoot / achat photos full-bleed

## Expert marketing visuel

Livrer une **spec visuelle CSS-only** :
- Hero : prop `atmosphere` / tint / texture (overlays, grain, teintes sujet — **pas** `backgroundImage` requis)
- Micro-signaux fold (`heroExtras`) : chips contraste, kicker sujet
- Process strip 3 steps
- Portrait CSF 48–64px au mid SoftClose
- Motion climax 2–3 (fade SoftClose, keyed bar reveal)
- Avant → Après avec `PageHero`, `CampagneAdsLanding`, classes Tailwind

## Expert script marketing

Livrer les **textes différenciants** (fold + process) :
- Micro-copy `heroExtras` / process steps (3 max)
- Ajustements H1/promise **seulement** si le fold reste générique
- Soft close / mid : ne pas réécrire sauf gap réel post-P0
- Ton québécois, éducatif

## Expert outils numériques

Livrer la **spec climax P1** (pas le pont RDV) :
- Hiérarchie chiffres / reorder / nouveaux champs WOW (gap cible, matching, etc.)
- Motion in-tool
- SoftClose **placement** sous climax si encore footer-only
- Fichiers JSX exacts + events analytics

## Expert finances & fiscalité

Valider les **nouveaux** claims / champs P1 :
- Plafonds, matching, SCEE déjà reçues, écarts illustratifs
- Disclaimers
- Ce qu’on ne promet pas

## Gestionnaire de projet

Lire les 4 experts → `00-PM-brief-final.md` :
- Rescore Expérience / WOW outil / Env. booker **post-P0**
- Top 1 gap WOW restant (visuel + outil)
- Backlog P0-v2 / P1 / P2 (effort S/M/L) — P0-v2 = ship Vague 2 pour cette campagne
- Dépendances shell (`PageHero` atmosphere, `processSteps`, portrait) vs spécifique
- Critères acceptation « ami reconnaît la campagne en 5 s »

### Uniformité cross-catalogue (OBLIGATOIRE)

Le PM est **garant du rendu uniforme** avec les 14 autres campagnes. Différencier le **sujet** (atmosphere, micro-signaux, climax) sans casser le **système**.

Dans chaque `00-PM-brief-final.md`, section **« Uniformité catalogue »** qui valide :

| Contrat shell | Règle |
|---------------|-------|
| Structure page | Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ (même ordre) |
| Hero CTAs | Primaire outil / secondaire RDV\|form — mêmes variantes boutons |
| SoftClose | Composant `ToolSoftClose` uniquement (pas de bandeau custom) ; RDV/form primary + PDF ghost |
| Portrait | Même vignette `/seo/portrait.jpg` + même libellé CSF · Victoriaville (placement mid ou SoftClose) |
| Process strip | Même composant / classes ; seuls les 3 libellés changent |
| Typo climax | `font-heading` + échelle `text-3xl/4xl` (ou `5xl` fit) — pas d’échelle orpheline |
| Spacing / cards | Tokens prestige existants ; pas de nouvelle palette « solo » hors teinte atmosphere |
| Motion | Helpers partagés shell (fade SoftClose, keyed reveal) — pas 15 libs motion différentes |

**Autorisé à diverger :** `atmosphere` tint/texture, `heroExtras`, chiffres/climaxes outil, copy.  
**Interdit :** reinventer mid CTA, footer outil, FAQ layout, ou un SoftClose one-off.
