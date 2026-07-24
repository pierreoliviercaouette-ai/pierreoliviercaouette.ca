# -*- coding: utf-8 -*-
"""Telecharge images et texte depuis pages d'aide officielles des banques."""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

import urllib.request

OUT = Path("docs/guide-releves-banques/assets/officiel")
OUT.mkdir(parents=True, exist_ok=True)
META = Path("docs/guide-releves-banques/sources-officielles.json")

UA = "Mozilla/5.0 (compatible; GuideReleves/1.0; +https://pierreoliviercaouette.ca)"

PAGES = [
    {
        "bank": "desjardins",
        "title": "Documents et releves - Desjardins",
        "url": "https://www.desjardins.com/fr/comptes-services/documents-releves.html",
    },
    {
        "bank": "desjardins",
        "title": "PGLM - suivi rendement AccesD",
        "url": "https://www.desjardins.com/fr/epargne-placements/placements-garantis-lies-marches.html",
    },
    {
        "bank": "bnc",
        "title": "Services numeriques FBNGP",
        "url": "https://www.fbngp.ca/services-numeriques.html",
    },
    {
        "bank": "bnc",
        "title": "Rapport sur le rendement des placements",
        "url": "https://www.fbngp.ca/documentation/releves/rendement-placements.html",
    },
    {
        "bank": "bnc",
        "title": "Releve de portefeuille BNC",
        "url": "https://www.bnc.ca/particuliers/centre-aide/epargne-placements/bases/releves-portefeuille.html",
    },
    {
        "bank": "td",
        "title": "View investments in EasyWeb",
        "url": "http://td.intelliresponse.com/cbaw/index.jsp?id=435&question=Can+I+view+my+investments+in+EasyWeb&requestType=NormalRequest",
    },
    {
        "bank": "scotia",
        "title": "Where will I find the performance of my accounts",
        "url": "https://help.scotiabank.com/article/where-will-i-find-the-performance-of-my-accounts?origin=neo",
    },
    {
        "bank": "scotia",
        "title": "Where do I find out how my investments are performing",
        "url": "https://help.scotiabank.com/article/where-do-i-find-out-how-my-investments-are-performing?origin=neo",
    },
    {
        "bank": "rbc",
        "title": "RBC Mobile App",
        "url": "https://www.rbcroyalbank.com/ways-to-bank/mobile/rbc-mobile-app/index.html",
    },
    {
        "bank": "rbc",
        "title": "RBC DI mobile tutorials",
        "url": "https://www.rbcdirectinvesting.com/manage/trading-platform-tutorials.html",
    },
    {
        "bank": "bmo",
        "title": "BMO Invest App Store",
        "url": "https://apps.apple.com/ca/app/bmo-invest/id1600976936",
    },
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "fr-CA,fr;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def extract_imgs(html: str, base: str) -> list[str]:
    urls = []
    for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.I):
        src = m.group(1)
        if src.startswith("data:"):
            continue
        full = urljoin(base, src)
        # keep likely product/help images
        if any(x in full.lower() for x in [".png", ".jpg", ".jpeg", ".webp", ".gif", "svg"]):
            urls.append(full)
    # also srcset
    for m in re.finditer(r'srcset=["\']([^"\']+)["\']', html, re.I):
        part = m.group(1).split(",")[0].strip().split(" ")[0]
        if part and not part.startswith("data:"):
            urls.append(urljoin(base, part))
    # dedupe
    seen = set()
    out = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out[:25]


def download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        if len(data) < 1500:
            return False
        dest.write_bytes(data)
        return True
    except Exception as e:
        print("fail", url, e)
        return False


def main():
    catalog = []
    for i, page in enumerate(PAGES):
        print("PAGE", page["url"])
        try:
            html = fetch(page["url"])
        except Exception as e:
            print("  fetch fail", e)
            catalog.append({**page, "error": str(e), "images": []})
            continue
        imgs = extract_imgs(html, page["url"])
        saved = []
        for j, img in enumerate(imgs):
            ext = Path(urlparse(img).path).suffix.lower() or ".jpg"
            if ext not in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
                ext = ".jpg"
            name = f"{page['bank']}_{i}_{j}{ext}"
            dest = OUT / name
            if download(img, dest):
                saved.append({"file": name, "url": img})
                print("  img", name)
        catalog.append({**page, "images": saved, "html_len": len(html)})
    META.write_text(json.dumps(catalog, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Wrote", META)


if __name__ == "__main__":
    main()
