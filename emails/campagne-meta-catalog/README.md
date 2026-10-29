# Campagne Meta — Catalogue CBO multi-sujets (14 ensembles)

Playbook : `docs/campagne-meta-catalog-cbo.md`  
Landings : `/campagnes/{slug}`  
**Référence de ton & visuel :** `emails/campagne-mythe-bancaire/` (mythe cassé, 1ʳᵉ personne, dark navy, contraste fort)  
**Langue :** français **québécois parlé** (tu / t’as / pis / affaire).  
Dire **« ton assurance collective »** / **« ce que ton assurance collective t’offre »**.  
Éviter : « la collective » (trop court/jargon) et les contournements du type « ce que ton job te donne ».

**Ads (Ad1–Ad3) :** hook = **outil interactif gratuit** sur la landing (sans compte, sans formulaire). RDV 15 min en soft close seulement.

**Brief pour Holo (textes seulement) :**  
- PDF : `brief-meta-cbo-holo-textes.pdf`  
- Texte pur : `brief-meta-cbo-holo-textes.txt`  
Régénérer : `python build_brief_holo_pdf.py`

## Fichiers copy

| # | Thème | Fichier | Landing | Outil interactif |
|---|-------|---------|---------|------------------|
| 1 | Comparateur / mythe bancaire | `comparateur-rendements.md` | `/campagnes/comparateur-rendements` | Compare banque vs modèle |
| 2 | CELIAPP | `celiapp.md` | `/campagnes/celiapp` | Simulateur mise de fonds |
| 3 | Hypothèque + vie | `hypotheque-assurance-vie.md` | `/campagnes/hypotheque-assurance-vie` | Estimateur capital hypo |
| 4 | Invalidité | `assurance-invalidite.md` | `/campagnes/assurance-invalidite` | Trou de revenu |
| 5 | Retraite REER/CELI | `retraite-reer-celi.md` | `/campagnes/retraite-reer-celi` | Prioriseur REER/CELI |
| 6 | Maladie grave | `maladie-grave.md` | `/campagnes/maladie-grave` | Estimateur capital |
| 7 | REEE | `reee.md` | `/campagnes/reee` | Simulateur subventions |
| 8 | Fonds d’urgence | `fonds-urgence.md` | `/campagnes/fonds-urgence` | Calculateur filet |
| 9 | CELI droits | `celi-droits.md` | `/campagnes/celi-droits` | Estimateur droits |
| 10 | Trop jeune | `trop-jeune-assurance.md` | `/campagnes/trop-jeune-assurance` | Score besoin + capital |
| 11 | Assurance collective | `assurance-collective.md` | `/campagnes/assurance-collective` | Checklist collective |
| 12 | Travailleur autonome | `travailleur-autonome.md` | `/campagnes/travailleur-autonome` | Checklist filet |
| 13 | Plan global | `plan-global.md` | `/campagnes/plan-global` | Ordre d’attaque |
| 14 | Succession | `succession-bases.md` | `/campagnes/succession-bases` | Checklist liquidité |

Composants : `frontend/src/components/campagne/tools/`

## Visuels

| Fichier | Usage |
|---------|--------|
| `../campagne-mythe-bancaire/facebook-campagne-rendements.png` | Ensemble comparateur (feed) |
| `../campagne-mythe-bancaire/facebook-campagne-rendements-9x16.png` | Ensemble comparateur (Stories) |
| `visuels/celiapp-feed.jpg` | CELIAPP |
| `visuels/hypotheque-vie-feed.jpg` | Hypothèque + vie |
| `visuels/invalidite-feed.jpg` | Invalidité |
| `visuels/fonds-urgence-feed.jpg` | Fonds d’urgence |
| `visuels/trop-jeune-feed.jpg` | Trop jeune |
| `visuels/collective-feed.jpg` | Assurance collective |

## Conformité

Valider textes + visuels avec conformité iA / superviseur avant diffusion payante.  
Titre exact : conseiller en sécurité financière. Pas de promesse de rendement hors cadre illustratif disclaimeré.
