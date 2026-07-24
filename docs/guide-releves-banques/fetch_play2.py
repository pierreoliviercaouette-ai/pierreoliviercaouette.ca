# -*- coding: utf-8 -*-
import re
import shutil
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "officiel"
PDF = ROOT / "assets" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
PDF.mkdir(parents=True, exist_ok=True)
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
PAGES = [
    ("td", "https://play.google.com/store/apps/details?id=com.td.investing.lite&hl=fr_CA"),
    ("cibc", "https://play.google.com/store/apps/details?id=com.cibc.android.mobi&hl=fr_CA"),
    ("cibc", "https://play.google.com/store/apps/details?id=com.mobilebrokerage.CIBC&hl=fr_CA"),
]


def fetch_shots(bank: str, url: str) -> list[Path]:
    print("FETCH", url)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "fr-CA"})
    html = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "replace")
    imgs = re.findall(r"https://play-lh\.googleusercontent\.com/[^\"\\=]+", html)
    seen: set[str] = set()
    uniq: list[str] = []
    for u in imgs:
        u = u.split("=")[0]
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    print(" found", len(uniq))
    saved: list[Path] = []
    prefix = f"{bank}_play2_{abs(hash(url)) % 10000}_"
    for i, u in enumerate(uniq[:10]):
        full = u + "=w1242-h2208"
        dest = OUT / f"{prefix}{i}.jpg"
        try:
            req = urllib.request.Request(full, headers={"User-Agent": UA})
            data = urllib.request.urlopen(req, timeout=40).read()
            if len(data) < 8000:
                continue
            dest.write_bytes(data)
            im = Image.open(dest)
            print(" ", dest.name, im.size, len(data))
            saved.append(dest)
        except Exception as e:
            print(" skip", e)
    return saved


def main() -> None:
    all_saved: dict[str, list[Path]] = {}
    for bank, url in PAGES:
        try:
            shots = fetch_shots(bank, url)
        except Exception as e:
            print(" FAIL", e)
            continue
        all_saved.setdefault(bank, []).extend(shots)

    # Curate mid-size phone-ish screenshots into pdf/
    for bank, paths in all_saved.items():
        for i, p in enumerate(paths[:4]):
            dest = PDF / f"{bank}_play_{i}.jpg"
            shutil.copy2(p, dest)
            print("curated", dest.name)


if __name__ == "__main__":
    main()
