# Import des portefeuilles depuis PDF

Ce script lit des rapports PDF (comme celui du portefeuille prudent), extrait:
- le profil (`Profil prudent`, `Profil modéré`, etc.),
- le rendement `AAJ` (YTD 2026),
- la performance annuelle la plus recente detectee (utilisee pour la colonne `year_2025`).

Puis il met a jour `public.model_portfolios` dans Supabase.

## Prerequis

- Python 3.10+
- Variables d environnement:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Dependances Python:
  - `requests`
  - `pypdf`

Installation rapide:

```bash
pip install requests pypdf
```

## Utilisation

Validation sans ecriture:

```bash
python backend/import_model_portfolios_from_pdf.py --dry-run --pdf "C:/Users/pierr/Downloads/Pierre-Olivier_Caouette_pour__20260407110636.pdf"
```

Import reel (un ou plusieurs fichiers):

```bash
python backend/import_model_portfolios_from_pdf.py \
  --pdf "C:/Users/pierr/Downloads/rapport-prudent.pdf" \
  --pdf "C:/Users/pierr/Downloads/rapport-modere.pdf" \
  --pdf "C:/Users/pierr/Downloads/rapport-equilibre.pdf"
```

## Notes

- Si le rapport contient `2025`, cette valeur est utilisee.
- Si `2025` n est pas present, le script prend la derniere annee disponible (ex: `2024`) et la range dans `year_2025` pour garder l affichage de la banniere cohérent.
- En cas de format PDF trop different, lancer d abord avec `--dry-run` pour verifier les valeurs extraites.
