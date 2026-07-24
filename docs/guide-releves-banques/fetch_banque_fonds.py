# -*- coding: utf-8 -*-
"""Telecharge guides/PDF officiels parcours banque / fonds (hors courtage autonome)."""
from __future__ import annotations

import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
META = ROOT / "sources-banque-fonds.json"

UA = "Mozilla/5.0 (compatible; GuideReleves/2.0; +https://pierreoliviercaouette.ca)"

FILES = [
    {
        "bank": "desjardins",
        "title": "Comprendre votre taux de rendement personnel",
        "url": "https://www.fondsdesjardins.com/information/comprendre-taux-rendement.pdf",
        "file": "desjardins_comprendre_taux_rendement.pdf",
    },
    {
        "bank": "desjardins",
        "title": "Comprendre vos rendements",
        "url": "https://www.fondsdesjardins.com/information/Comprendre_vos_rendements.pdf",
        "file": "desjardins_comprendre_vos_rendements.pdf",
    },
    {
        "bank": "scotia",
        "title": "Personal Portfolio Statement Guide",
        "url": "https://www.scotiabank.com/ca/en/files/16/09/Personal-Portfolio-Statement-Guide-ENG.pdf",
        "file": "scotia_pps_guide.pdf",
    },
    {
        "bank": "rbc",
        "title": "CRM2 Additional details Annual Performance Report",
        "url": "https://ca.rbcwealthmanagement.com/documents/214796/0/Additional+Details+CRM2+Guide.pdf/0c218143-60c3-494a-bec5-7e19130886cc",
        "file": "rbc_crm2_performance_guide.pdf",
    },
    {
        "bank": "bmo",
        "title": "How to read your BMO InvestorLine Account Statement",
        "url": "https://www.bmoinvestorline.com/selfDirected/pdfs/Statement_Insert_SD_E.pdf",
        "file": "bmo_statement_guide_sd.pdf",
        "note": "Courtage — a telecharger pour reference seulement, pas pour le guide principal",
    },
]


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())


def main() -> None:
    results = []
    for item in FILES:
        dest = OUT / item["file"]
        print("GET", item["url"])
        try:
            download(item["url"], dest)
            print(" OK", dest.name, dest.stat().st_size)
            results.append({**item, "ok": True, "bytes": dest.stat().st_size})
        except Exception as e:
            print(" FAIL", e)
            results.append({**item, "ok": False, "error": str(e)})
    META.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print("wrote", META)


if __name__ == "__main__":
    main()
