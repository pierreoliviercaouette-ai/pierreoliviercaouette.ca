"""
Import model portfolio returns from IA-style PDF reports into Supabase.

Usage:
  python backend/import_model_portfolios_from_pdf.py --dry-run --pdf "C:/path/report-prudent.pdf"
  python backend/import_model_portfolios_from_pdf.py --pdf "C:/path/report-prudent.pdf" --pdf "C:/path/report-modere.pdf"

Required env vars:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY

Notes:
  - Expects text patterns like "Profil prudent" and a performance header containing "AAJ".
  - Uses the most recent annual column found in the report (e.g. 2025, else 2024).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

import requests
from pypdf import PdfReader


PROFILE_KEY_MAP = {
    "prudent": "prudent",
    "modere": "modere",
    "modéré": "modere",
    "equilibre": "equilibre",
    "équilibré": "equilibre",
    "croissance": "croissance",
    "audacieux": "audacieux",
}

PERIOD_LABELS = ["1 mois", "3 mois", "6 mois", "AAJ", "1 an", "3 ans", "5 ans", "10 ans"]
PERCENT_RE = re.compile(r"-?\d+(?:,\d+)?%")


def read_pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        text = page.extract_text() or ""
        pages.append(text)
    return "\n".join(pages)


def _normalize_profile_name(value: str) -> str:
    v = value.strip().lower()
    v = v.replace("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("â", "a")
    return v


def extract_profile_key(text: str) -> str:
    lowered = text.lower()
    for raw_name, key in PROFILE_KEY_MAP.items():
        if f"profil {raw_name}" in lowered:
            return key
        if f"portefeuille {raw_name}" in lowered:
            return key

    match = re.search(r"Profil\s+([A-Za-zÀ-ÿ]+)", text, flags=re.IGNORECASE)
    if match:
        profile_name = _normalize_profile_name(match.group(1))
        key = PROFILE_KEY_MAP.get(profile_name)
        if key:
            return key
        raise ValueError(f"Profil non pris en charge: {match.group(1)}")

    raise ValueError("Impossible de trouver le profil dans le PDF (ex: 'Profil prudent').")


def _to_float_percent(token: str) -> float:
    return float(token.replace("%", "").replace(",", "."))


def extract_returns(text: str) -> tuple[float, int, float]:
    # Strategy A: IA "Rend année civile" rows (more reliable when available)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    civil_idx = next((i for i, ln in enumerate(lines) if "Rend année civile" in ln), None)
    if civil_idx is not None:
        window = lines[civil_idx : min(len(lines), civil_idx + 30)]
        ytd = None
        annual_pairs: list[tuple[int, float]] = []
        for ln in window:
            m_aaj = re.match(r"^AAJ\s+(-?\d+(?:,\d+)?)\b", ln, flags=re.IGNORECASE)
            if m_aaj:
                ytd = _to_float_percent(f"{m_aaj.group(1)}%")
                continue

            m_year = re.match(r"^(20\d{2})\s+(-?\d+(?:,\d+)?)\b", ln)
            if m_year:
                annual_pairs.append((int(m_year.group(1)), _to_float_percent(f"{m_year.group(2)}%")))

        if ytd is not None and annual_pairs:
            latest_year, latest_value = max(annual_pairs, key=lambda x: x[0])
            return ytd, latest_year, latest_value

    # Strategy B: Legacy "1 mois 3 mois 6 mois AAJ ..." compact line
    label_idx = None
    for i, line in enumerate(lines):
        if "AAJ" in line and "1 mois" in line and "3 mois" in line:
            label_idx = i
            break
    if label_idx is None:
        raise ValueError("Impossible de trouver la ligne des periodes (AAJ, 1 mois, etc.).")

    label_line = lines[label_idx]
    years = [int(y) for y in re.findall(r"\b20\d{2}\b", label_line)]
    if not years:
        raise ValueError("Impossible de trouver les colonnes annuelles (ex: 2025) dans le PDF.")

    expected_count = len(PERIOD_LABELS) + len(years)
    context_start = max(0, label_idx - 25)
    context_end = min(len(lines), label_idx + 3)
    context = " ".join(lines[context_start:context_end])
    all_percents = PERCENT_RE.findall(context)
    if len(all_percents) < expected_count:
        raise ValueError(
            f"Pas assez de pourcentages detectes autour de la ligne AAJ: {len(all_percents)} trouves, {expected_count} attendus."
        )

    values = [_to_float_percent(x) for x in all_percents[-expected_count:]]

    ytd = values[PERIOD_LABELS.index("AAJ")]
    latest_year = max(years)
    latest_year_index = len(PERIOD_LABELS) + years.index(latest_year)
    latest_year_value = values[latest_year_index]
    return ytd, latest_year, latest_year_value


def build_payload(path: Path) -> dict[str, Any]:
    text = read_pdf_text(path)
    key = extract_profile_key(text)
    ytd, annual_year, annual_value = extract_returns(text)
    return {
        "key": key,
        "ytd_2026": ytd,
        "year_2025": annual_value,
        "as_of_date": None,
        "annual_source_year": annual_year,
        "source_file": str(path),
    }


def apply_updates(rows: list[dict[str, Any]], dry_run: bool = False) -> None:
    if dry_run:
        print("[DRY RUN] Parsed rows:")
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return

    supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    service_role = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not supabase_url or not service_role:
        raise EnvironmentError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.")

    endpoint = f"{supabase_url}/rest/v1/model_portfolios"
    headers = {
        "apikey": service_role,
        "Authorization": f"Bearer {service_role}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    for row in rows:
        patch = {
            "ytd_2026": row["ytd_2026"],
            "year_2025": row["year_2025"],
        }
        resp = requests.patch(
            f"{endpoint}?key=eq.{row['key']}",
            headers=headers,
            json=patch,
            timeout=60,
        )
        if resp.status_code >= 300:
            raise RuntimeError(f"Failed update for {row['key']} [{resp.status_code}]: {resp.text}")

        print(
            f"Updated {row['key']}: 2026 YTD={row['ytd_2026']:.2f}% | "
            f"{row['annual_source_year']}={row['year_2025']:.2f}%"
        )


def main() -> int:
    parser = argparse.ArgumentParser(description="Import model portfolio returns from PDF reports.")
    parser.add_argument("--pdf", action="append", required=True, help="Absolute or relative path to a report PDF.")
    parser.add_argument("--dry-run", action="store_true", help="Parse only, do not write to Supabase.")
    args = parser.parse_args()

    try:
        rows = [build_payload(Path(p).expanduser().resolve()) for p in args.pdf]
        if not rows:
            raise ValueError("No rows parsed from PDFs.")
        apply_updates(rows, dry_run=args.dry_run)
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
