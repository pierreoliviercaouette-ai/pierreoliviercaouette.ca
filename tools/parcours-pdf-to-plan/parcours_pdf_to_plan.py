#!/usr/bin/env python3
"""
Convertit un PDF « Mon parcours financier » (outil interne) en JSON
importable dans l'illustrateur patrimonial (session / Import JSON).

Usage:
  python parcours_pdf_to_plan.py "C:\\chemin\\Mon parcours....pdf"
  python parcours_pdf_to_plan.py input.pdf -o dossier.json

Dépendance: pip install pypdf
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("Installez pypdf: pip install pypdf", file=sys.stderr)
    sys.exit(1)

DEFAULT_TAX_PERSONNEL = 53.31


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"


def parse_money(raw):
    if raw is None:
        return None
    s = str(raw).strip()
    if not s or s in {"-", "—", "–"}:
        return None
    # pdf.js remplace souvent l'espace fine par « ? »
    s = re.sub(r"\?(?=\d)", "", s)
    s = re.sub(r"\?(?=\s*\$)", "", s)
    s = (
        s.replace("\u00a0", "")
        .replace("\u202f", "")
        .replace(" ", "")
        .replace("?", "")
        .replace("$", "")
    )
    s = re.sub(r"[^\d,.\-]", "", s)
    s = s.replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return None


def grab(text: str, pattern: str, flags=re.I):
    m = re.search(pattern, text, flags)
    return m.group(1) if m else None


def grab_money(text: str, pattern: str):
    return parse_money(grab(text, pattern))


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    parts = []
    for page in reader.pages:
        parts.append(page.extract_text() or "")
    return "\n".join(parts)


def split_name(full: str):
    parts = [p for p in (full or "").strip().split() if p]
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def build_plan(text: str) -> dict:
    text_n = (
        text.replace("\u00a0", " ")
        .replace("\u202f", " ")
        .replace("\u2019", "'")
        .replace("\x92", "'")
    )
    text_n = re.sub(r"(\d)\?(?=\d)", r"\1 ", text_n)
    text_n = re.sub(r"\?(?=\s*\$)", " ", text_n)
    text_n = re.sub(r"\s+", " ", text_n)
    now = datetime.now(timezone.utc).isoformat()

    name = grab(text_n, r"intention de\s*:\s*([A-ZÀ-Ü][A-ZÀ-Ü\- ]+?)(?:\s+Votre|\s+Parcours)")
    if not name:
        name = grab(text_n, r"Monsieur\s+([A-ZÀ-Ü][A-ZÀ-Ü\- ]+?),")
    name = (name or "Client importé").strip()
    first, last = split_name(name)

    birth = grab(text_n, r"Date de naissance\s*(\d{4}-\d{2}-\d{2})")
    by, bm, bd = "", "", ""
    if birth:
        by, bm, bd = birth.split("-")
        bm = str(int(bm))
        bd = int(bd)
        by = int(by)

    sex_raw = grab(text_n, r"Sexe\s+(Homme|Femme)")
    sex = "F" if sex_raw and sex_raw.lower().startswith("f") else "M"
    marital_raw = grab(text_n, r"[ÉE]tat civil\s*([^U]+?)(?:Usage du tabac|Cellulaire)") or ""
    marital = "conjoint" if "conjoint" in marital_raw.lower() else (
        "marie" if "mari" in marital_raw.lower() else "celibataire"
    )
    has_spouse = marital in {"conjoint", "marie"}
    tobacco = bool(re.search(r"Usage du tabac\s*Oui", text_n, re.I))
    email = grab(text_n, r"Courriel personnel\s*([^\s]+@[^\s]+)") or ""
    gross = grab_money(text_n, r"Revenu annuel brut\s*([\d\s\u00a0.,]+)\s*\$") or 0

    reer = grab_money(text_n, r"REER(?!\s*collectif)\s*([\d\s\u00a0.,]+)\s*\$")
    reer_c = grab_money(text_n, r"REER collectif\s*([\d\s\u00a0.,]+)\s*\$")
    home = grab_money(text_n, r"R[ée]sidence principale\s*([\d\s\u00a0.,]+)\s*\$")
    mortgage = grab_money(text_n, r"Pr[êe]t hypoth[ée]caire\s*([\d\s\u00a0.,]+)\s*\$")
    credit = grab_money(text_n, r"Marge de cr[ée]dit\s*([\d\s\u00a0.,]+)\s*\$") or 0
    m_rate = grab(text_n, r"Pr[êe]t hypoth[ée]caire1[^%]*?([\d.,]+)\s*%")
    m_pay = grab_money(text_n, r"ans\s*([\d\s\u00a0.,]+)\s*\$\s*/\s*aux deux")

    person_id = new_id("ent")
    assets = []
    if reer is not None:
        assets.append({
            "id": new_id("ast"), "name": "REER", "type": "reer", "entityId": person_id,
            "currentBalance": reer, "monthlyContribution": 0, "avgAnnualReturn": 3.8,
        })
    if reer_c is not None:
        assets.append({
            "id": new_id("ast"), "name": "REER collectif", "type": "reer", "entityId": person_id,
            "currentBalance": reer_c, "monthlyContribution": 0, "avgAnnualReturn": 4.1,
        })
    if home is not None:
        assets.append({
            "id": new_id("ast"), "name": "Résidence principale", "type": "immobilier",
            "entityId": person_id, "currentBalance": home, "monthlyContribution": 0,
            "avgAnnualReturn": 3, "principalResidence": True, "_acb": home,
        })

    debts = []
    if mortgage is not None:
        biweekly = m_pay or 0
        debts.append({
            "id": new_id("debt"), "name": "Prêt hypothécaire", "type": "hypotheque",
            "entityId": person_id, "currentBalance": mortgage,
            "interestRate": float((m_rate or "5.9").replace(",", ".")),
            "amortizationRemaining": 24,
            "monthlyPayment": round(biweekly * 26 / 12, 2) if biweekly else 0,
        })

    # Assurances
    life_policies = []
    for m in re.finditer(
        r"(Temporaire|Enti[eèé]re)\d*\s*[A-ZÀ-Ü][A-ZÀ-Ü\s\-]*?(Beneva|Empire\s*Vie|Desjardins|iA)[^\d]*([\d\s\u00a0.,]+)\s*\$\s*([\d\s\u00a0.,]+)\s*\$\s*(\d{4}-\d{2}-\d{2})",
        text_n,
        re.I,
    ):
        kind = m.group(1).lower()
        life_policies.append({
            "id": new_id("pol"),
            "type": "temporaire" if kind.startswith("temp") else "permanente",
            "insured": name,
            "amount": parse_money(m.group(3)) or 0,
            "annualPremium": parse_money(m.group(4)) or 0,
            "insurer": re.sub(r"\s+", " ", m.group(2)).strip(),
        })

    dis_policies = []
    dm = re.search(
        r"Individuel[A-ZÀ-Ü\s\-]*?(Beneva|Empire Vie|Desjardins|iA)[^\d]*([\d\s\u00a0.,]+)\s*\$\s*([\d\s\u00a0.,]+)\s*\$\s*(\d{4}-\d{2}-\d{2})\s*(\d+)\s*jours",
        text_n,
        re.I,
    )
    if dm:
        dis_policies.append({
            "id": new_id("pol"),
            "amount": parse_money(dm.group(2)) or 0,
            "annualPremium": parse_money(dm.group(3)) or 0,
            "insurer": dm.group(1),
        })
    else:
        amt = grab_money(text_n, r"Assurance invalidit[ée] long terme\s*([\d\s\u00a0.,]+)\s*\$")
        if amt:
            dis_policies.append({"id": new_id("pol"), "amount": amt, "annualPremium": 0})

    ci_policies = []
    cm = re.search(
        r"Assurancemaladiegrave[\s\S]{0,200}?Individuel[A-ZÀ-Ü\s\-]*?(Beneva|Empire Vie|Desjardins|iA)[^\d]*([\d\s\u00a0.,]+)\s*\$\s*([\d\s\u00a0.,]+)\s*\$",
        text_n,
        re.I,
    )
    if cm:
        ci_policies.append({
            "id": new_id("pol"),
            "amount": parse_money(cm.group(2)) or 0,
            "annualPremium": parse_money(cm.group(3)) or 0,
            "insurer": cm.group(1),
        })

    death_exp = grab_money(text_n, r"Frais li[ée]s au d[ée]c[èe]s\s*([\d\s\u00a0.,]+)\s*\$") or 15000
    rrq_death = grab_money(text_n, r"Prestation de d[ée]c[èe]s RPC/RRQ\s*([\d\s\u00a0.,]+)\s*\$") or 2500
    replace_pct = grab_money(text_n, r"Revenu cible\s*\((\d+)\s*%") or 70
    years = grab_money(text_n, r"pendant\s+(\d+)\s+ans") or 25
    discount = grab_money(text_n, r"taux de rendement de\s*([\d.,]+)\s*%") or 3.4

    emerg_req = grab_money(text_n, r"3 mois de d[ée]penses mensuelles\s*([\d\s\u00a0.,]+)\s*\$")
    monthly_emerg = round((emerg_req or 4500) / 3)

    target_net = grab_money(text_n, r"Revenusannuelsnetsvis[ée]s\s*([\d\s\u00a0.,]+)\s*\$") or 0
    retire_age = grab_money(text_n, r"Momentdelaretraite[^\d]*\((\d+)\s*ans\)") or 65
    reer_room = grab_money(text_n, r"DroitsREER/RPACinutilis[ée]s\s*([\d\s\u00a0.,]+)\s*\$") or 0
    celi_room = grab_money(text_n, r"DroitsCELIinutilis[ée]s\s*([\d\s\u00a0.,]+)\s*\$") or 0
    rrq = grab_money(text_n, r"SourcesderevenuannuelRRQ\s*([\d\s\u00a0.,]+)\s*\$") or 0
    sv = grab_money(text_n, r"SV\s*([\d\s\u00a0.,]+)\s*\$\s*\d{1,2}-\d{4}") or 0

    monthly_gross = round(gross / 12, 2) if gross else 0
    revenues = []
    if monthly_gross:
        revenues.append({
            "id": new_id("rev"), "name": "Salaire", "type": "salaire",
            "entityId": person_id, "monthlyAmount": monthly_gross, "growthRate": 0,
        })

    debt_ids = [d["id"] for d in debts]
    plan = {
        "meta": {
            "name": name,
            "clientLabel": name,
            "notes": f"Importé depuis PDF Mon parcours financier ({now[:10]}). Vérifier les montants.",
            "createdAt": now,
            "updatedAt": now,
            "source": "parcours-financier-pdf",
        },
        "horizonYears": 25,
        "deathScenarioYear": None,
        "scope": {"conjoint": has_spouse, "corporatif": False},
        "entities": [{
            "id": person_id, "name": "Personnel", "type": "personnel",
            "province": "QC", "marginalTaxRate": DEFAULT_TAX_PERSONNEL,
        }],
        "assets": assets,
        "debts": debts,
        "revenues": revenues,
        "events": [],
        "needs": {
            "hypotheque": mortgage or 0,
            "revenu_net": round(monthly_gross * 0.7),
            "pct_remplacer": replace_pct,
            "nb_annees": years,
            "funerailles": death_exp,
            "av_actuelle": sum(p["amount"] for p in life_policies),
            "urgence": monthly_emerg * 3,
        },
        "scenarios": [],
        "workflow": {"step": "hub"},
        "priorities": ["assurance_vie", "invalidite", "maladie_grave"],
        "nextStepsNotes": "",
        "person": {
            "firstName": first, "lastName": last,
            "birthDay": bd, "birthMonth": bm, "birthYear": by,
            "sex": sex, "maritalStatus": marital, "province": "QC",
            "email": email, "tobacco": tobacco,
            "planType": "conjoint" if has_spouse else "individuel",
            "children": [], "spouse": {"firstName": "", "lastName": "", "birthYear": "", "sex": "F"},
            "language": "fr", "canadaSinceYear": "", "legalNotes": [],
        },
        "objectives": [],
        "contributionRoom": {"reer": reer_room, "celi": celi_room, "celiapp": 0},
        "emergency": {
            "base": "depenses", "months": 3, "monthlyAmount": monthly_emerg,
            "creditLine": credit, "allocatedAssetIds": [],
        },
        "deathNeeds": {
            "policies": life_policies,
            "rrqDeathBenefit": rrq_death,
            "liquidateAssetIds": [a["id"] for a in assets if a["type"] == "reer"],
            "repayDebtIds": debt_ids,
            "expenses": [{"id": new_id("exp"), "description": "Frais liés au décès", "amount": death_exp, "indexed": False}],
            "incomeMode": "individuel", "incomeBasis": "brut", "incomeFrequency": "annuel",
            "incomeReplacePct": replace_pct, "incomeReplaceYears": years, "discountRate": discount,
            "survivorPension": 0, "orphanPension": 0, "otherIncome": 0,
            "spousalRollover": has_spouse,
            "principalResidenceAssetIds": [a["id"] for a in assets if a.get("principalResidence")],
            "noRolloverAssetIds": [],
        },
        "disabilityNeeds": {
            "policies": dis_policies, "otherMonthlyIncome": 0, "eiCovered": False,
            "approach": "remplacement", "incomeBasis": "net", "replacePct": 70,
            "physicalLevel": 20, "workHours": 40, "workHoursUnit": "semaine",
            "riskyHobby": False, "waitingDays": 30, "coverageToAge": 65,
        },
        "criticalIllnessNeeds": {
            "policies": ci_policies, "useDisability": False, "useEmergency": False,
            "clientMonthlyIncome": round(gross * 0.7 / 12) if gross else 0,
            "clientMonths": 12, "caregiverMonthly": 0, "caregiverMonths": 6,
            "protectionLevel": "confort",
            "extras": {
                "uninsuredTreatment": 0, "medicalEquipment": 0, "homeAdapt": 0,
                "vehicleAdapt": 0, "other": 0,
            },
        },
        "projects": [],
        "retirement": {
            "incomeMode": "individuel", "incomeUnit": "cad", "incomeFrequency": "annuel",
            "replacePct": 70, "replaceAmount": target_net, "autoSaveSurplus": False,
            "expenses": [], "profileBefore": "audacieux", "profileDuring": "audacieux",
            "targetAge": retire_age,
            "publicPensions": [
                {"id": new_id("pen"), "type": "RRQ", "annualAmount": rrq, "frequency": "annuel", "indexed": True, "startAge": retire_age},
                {"id": new_id("pen"), "type": "SV", "annualAmount": sv, "frequency": "annuel", "indexed": True, "startAge": retire_age},
            ],
            "definedBenefit": [], "plannedWithdrawals": [],
            "decumulationAssetIds": [a["id"] for a in assets if a["type"] == "reer"],
        },
        "recommendations": [],
        "savings": [],
        "modules": {"title": "Proposition de planification", "baselineLabel": "Situation actuelle", "selections": {}, "byModule": {}},
        "budget": {"mode": "individuel", "viewFrequency": "mensuel", "netIncomeAnnual": round(gross * 0.7), "lines": {}},
    }

    return {
        "version": 1,
        "exportedAt": now,
        "product": "illustrateur-patrimonial",
        "source": "parcours-financier-pdf",
        "plan": plan,
    }


def main():
    parser = argparse.ArgumentParser(description="PDF Mon parcours financier → JSON illustrateur")
    parser.add_argument("pdf", type=Path, help="Chemin du PDF parcours")
    parser.add_argument("-o", "--output", type=Path, help="Fichier JSON de sortie")
    args = parser.parse_args()
    if not args.pdf.exists():
        print(f"Fichier introuvable: {args.pdf}", file=sys.stderr)
        sys.exit(1)

    text = extract_text(args.pdf)
    payload = build_plan(text)
    out = args.output
    if out is None:
        stem = args.pdf.stem.replace(" ", "_")
        out = args.pdf.with_name(f"{stem}.illustrateur.json")

    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    plan = payload["plan"]
    print(f"OK -> {out}")
    print(f"  Client : {plan['meta']['clientLabel']}")
    print(f"  Actifs : {len(plan['assets'])} | Passifs : {len(plan['debts'])}")
    print(f"  AV policies : {len(plan['deathNeeds']['policies'])}")
    print("Importez ce JSON via Illustrateur > Import JSON/PDF.")


if __name__ == "__main__":
    main()
