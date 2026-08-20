# Cadrage conformité — import de relevé + analyse IA (comparateur)

Dernière mise à jour : 2026-08-20  
Statut : **reporté / retiré du produit** — pas d’import de relevé client pour le moment

---

## État actuel

Le comparateur public (`/outils/comparateur-rendements`) offre uniquement la **saisie manuelle** :

| Mode | Contenu | Statut |
|------|---------|--------|
| Simple | Profil, rendement 5 ans, capital, horizon, versement | Actif |
| Avancé | + rendements année civile (10 ans) vs portefeuille modèle | Actif |
| Import relevé + IA | Upload / OCR / LLM | **Retiré** |

Motif du retrait : éviter le traitement de relevés clients (résidence des données, compte GPT/OpenAI hors Canada, conformité Loi 25 / AMF) tant qu’une solution clairement conforme n’est pas retenue.

---

## Décisions antérieures (conservées pour reprise éventuelle)

Si l’import est réintroduit plus tard, les décisions déjà tranchées étaient :

1. Conservation éphémère ≤ 24 h  
2. Auth obligatoire pour l’upload  
3. Accès conseiller pour validation de l’analyse seulement  
4. Traitement **Canada seulement** (pas d’API OpenAI directe hors CA)  
5. OCR inclus  
6. Même URL que le comparateur  

**Voie GPT conforme envisagée :** Azure OpenAI en région canadienne (pas le compte ChatGPT / clé `platform.openai.com`).

---

## Reprise (quand décidé)

1. Recréer migration Storage + table + RLS  
2. Edge Function OCR + Azure OpenAI Canada  
3. UI Import + consentement + Legal  
4. Vue admin validation + purge 24 h  
5. Relecture conformité cabinet / réseau  

Aucun code d’import n’est présent dans le dépôt à cette date.
