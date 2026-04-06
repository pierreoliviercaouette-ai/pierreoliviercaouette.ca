"""
Migrate legacy tool templates from `backend/update_tools.py` to Supabase.

Usage:
  python backend/migrate_tools_to_supabase.py --dry-run
  python backend/migrate_tools_to_supabase.py

Required env vars:
  SUPABASE_URL                 e.g. https://xxxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY    service_role key (NOT anon)

Notes:
  - Reads TOOLS_DATA from update_tools.py without importing motor.
  - Upserts by `slug` into public.tools.
  - Keeps existing rows up to date (name/description/html/tags/is_active).
"""

from __future__ import annotations

import argparse
import ast
import json
import os
import sys
from pathlib import Path
from typing import Any

import requests


ROOT = Path(__file__).resolve().parent
TOOLS_SOURCE = ROOT / "update_tools.py"


def load_tools_data() -> list[dict[str, Any]]:
    if not TOOLS_SOURCE.exists():
        raise FileNotFoundError(f"Missing source file: {TOOLS_SOURCE}")

    src = TOOLS_SOURCE.read_text(encoding="utf-8")
    tree = ast.parse(src)

    tools_node = None
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "TOOLS_DATA":
                    tools_node = node.value
                    break
        if tools_node is not None:
            break

    if tools_node is None:
        raise ValueError("Could not find TOOLS_DATA in update_tools.py")

    data = ast.literal_eval(tools_node)
    if not isinstance(data, list):
        raise ValueError("TOOLS_DATA is not a list")
    return data


def build_supabase_payload(tools_data: list[dict[str, Any]]) -> list[dict[str, Any]]:
    payload: list[dict[str, Any]] = []
    for t in tools_data:
        payload.append(
            {
                "name": t.get("name", "").strip(),
                "slug": t.get("slug", "").strip(),
                "description": t.get("description", "").strip(),
                "html_content": t.get("html_content", ""),
                "tags": t.get("tags", []),
                "is_active": True,
            }
        )
    return payload


def upsert_tools(payload: list[dict[str, Any]], dry_run: bool = False) -> None:
    supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    service_role = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    if not supabase_url or not service_role:
        raise EnvironmentError(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
        )

    if dry_run:
        print(f"[DRY RUN] Would upsert {len(payload)} tools to {supabase_url}/rest/v1/tools")
        print(json.dumps(payload[:2], ensure_ascii=False, indent=2))
        if len(payload) > 2:
            print(f"... and {len(payload) - 2} more")
        return

    endpoint = f"{supabase_url}/rest/v1/tools?on_conflict=slug"
    headers = {
        "apikey": service_role,
        "Authorization": f"Bearer {service_role}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
    }

    resp = requests.post(endpoint, headers=headers, json=payload, timeout=60)
    if resp.status_code >= 300:
        raise RuntimeError(f"Supabase upsert failed [{resp.status_code}]: {resp.text}")

    result = resp.json()
    print(f"Upserted {len(result)} tools successfully.")
    print("Slugs:")
    for row in result:
        print(f" - {row.get('slug')}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Migrate tools to Supabase.")
    parser.add_argument("--dry-run", action="store_true", help="Preview payload without writing.")
    args = parser.parse_args()

    try:
        tools_data = load_tools_data()
        payload = build_supabase_payload(tools_data)
        if not payload:
            raise ValueError("No tools found in TOOLS_DATA.")
        upsert_tools(payload, dry_run=args.dry_run)
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

