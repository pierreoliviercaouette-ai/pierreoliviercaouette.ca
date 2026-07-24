# -*- coding: utf-8 -*-
import re
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent / "assets" / "officiel"
OUT.mkdir(parents=True, exist_ok=True)
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
PAGES = [
    ("td", "https://play.google.com/store/apps/details?id=com.td&hl=fr_CA"),
    ("td", "https://play.google.com/store/apps/details?id=com.td.easytrade&hl=en_CA"),
    ("cibc", "https://play.google.com/store/apps/details?id=com.cibc.android&hl=fr_CA"),
]


def main() -> None:
    for bank, url in PAGES:
        print("FETCH", url)
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": UA, "Accept-Language": "fr-CA"}
            )
            html = urllib.request.urlopen(req, timeout=40).read().decode(
                "utf-8", "replace"
            )
        except Exception as e:
            print(" FAIL", e)
            continue
        imgs = re.findall(r"https://play-lh\.googleusercontent\.com/[^\"\\=]+", html)
        seen: set[str] = set()
        uniq: list[str] = []
        for u in imgs:
            u = u.split("=")[0]
            if u not in seen:
                seen.add(u)
                uniq.append(u)
        print(" found", len(uniq))
        prefix = f"{bank}_play_{abs(hash(url)) % 10000}_"
        for i, u in enumerate(uniq[:8]):
            full = u + "=w1280-h720"
            dest = OUT / f"{prefix}{i}.jpg"
            try:
                req = urllib.request.Request(full, headers={"User-Agent": UA})
                data = urllib.request.urlopen(req, timeout=40).read()
                dest.write_bytes(data)
                print(" ", dest.name, len(data))
            except Exception as e:
                print(" skip", e)


if __name__ == "__main__":
    main()
