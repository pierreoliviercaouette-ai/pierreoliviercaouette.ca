# -*- coding: utf-8 -*-
"""Telecharge captures App Store via API iTunes (images officielles)."""
from __future__ import annotations

import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "officiel"
PDF = ROOT / "assets" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
PDF.mkdir(parents=True, exist_ok=True)

# Apps pertinentes pour releves / placements
APPS = [
    ("td", 358790776, "TD Canada"),
    ("td", 1505371720, "TD Easy Trade"),
    ("scotia", 341151570, "Scotiabank"),
    ("scotia", 1571172499, "Scotia iTRADE"),
    ("cibc", 351448953, "CIBC Mobile Banking"),
    ("cibc", 441129412, "CIBC Mobile Wealth"),
    ("bmo", 1600976936, "BMO Invest"),
    ("rbc", 297430070, "RBC Mobile"),
]


def lookup(app_id: int) -> dict:
    url = f"https://itunes.apple.com/lookup?id={app_id}&country=ca"
    req = urllib.request.Request(url, headers={"User-Agent": "GuideReleves/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read())
    results = data.get("results") or []
    return results[0] if results else {}


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "GuideReleves/1.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        dest.write_bytes(r.read())


def main() -> None:
    meta = []
    for bank, app_id, label in APPS:
        print("LOOKUP", bank, label, app_id)
        info = lookup(app_id)
        if not info:
            print("  empty")
            continue
        shots = info.get("screenshotUrls") or []
        shots += info.get("ipadScreenshotUrls") or []
        print("  screenshots", len(shots))
        saved = []
        for i, u in enumerate(shots[:12]):
            # prefer larger resolution if size param present
            u2 = u.replace("392x696bb", "1284x2778bb").replace("460x0w", "1284x0w")
            ext = "jpg"
            if ".png" in u2.lower():
                ext = "png"
            dest = OUT / f"{bank}_itunes_{app_id}_{i}.{ext}"
            try:
                download(u2, dest)
                saved.append(dest.name)
                print("   ", dest.name, dest.stat().st_size)
            except Exception as e:
                try:
                    download(u, dest)
                    saved.append(dest.name)
                    print("   fallback", dest.name, dest.stat().st_size)
                except Exception as e2:
                    print("   fail", i, e, e2)
        meta.append(
            {
                "bank": bank,
                "app_id": app_id,
                "label": label,
                "trackViewUrl": info.get("trackViewUrl"),
                "images": saved,
            }
        )
    (ROOT / "appstore_fetch.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print("done")


if __name__ == "__main__":
    main()
