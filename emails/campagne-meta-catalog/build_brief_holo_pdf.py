#!/usr/bin/env python3
"""Génère le brief PDF Meta CBO (textes d'annonces) pour Holo — sans visuels."""

from __future__ import annotations

import re
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "brief-meta-cbo-holo-textes.pdf"
OUT_TXT = ROOT / "brief-meta-cbo-holo-textes.txt"
BASE_URL = "https://www.pierreoliviercaouette.ca"

FONT_REG = r"C:\Windows\Fonts\arial.ttf"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_ITALIC = r"C:\Windows\Fonts\ariali.ttf"

ENSEMBLES = [
    {
        "n": 1,
        "nom": "Comparateur | Mythe bancaire",
        "age": "30–60",
        "file": "comparateur-rendements.md",
        "slug": "comparateur-rendements",
        "utm": "comparateur",
        "outil": "Comparateur banque vs portefeuilles modèles (PDF export)",
    },
    {
        "n": 2,
        "nom": "CELIAPP | 1re propriété",
        "age": "20–40",
        "file": "celiapp.md",
        "slug": "celiapp",
        "utm": "celiapp",
        "outil": "Simulateur mise de fonds CELIAPP",
    },
    {
        "n": 3,
        "nom": "Hypothèque + assurance vie",
        "age": "28–55",
        "file": "hypotheque-assurance-vie.md",
        "slug": "hypotheque-assurance-vie",
        "utm": "hypotheque_vie",
        "outil": "Estimateur capital / hypothèque + vie",
    },
    {
        "n": 4,
        "nom": "Assurance invalidité",
        "age": "25–55",
        "file": "assurance-invalidite.md",
        "slug": "assurance-invalidite",
        "utm": "invalidite",
        "outil": "Calculateur trou de revenu",
    },
    {
        "n": 5,
        "nom": "Retraite REER CELI",
        "age": "35–60",
        "file": "retraite-reer-celi.md",
        "slug": "retraite-reer-celi",
        "utm": "retraite",
        "outil": "Prioriseur REER / CELI",
    },
    {
        "n": 6,
        "nom": "Maladie grave",
        "age": "30–55",
        "file": "maladie-grave.md",
        "slug": "maladie-grave",
        "utm": "maladie_grave",
        "outil": "Estimateur capital maladie grave",
    },
    {
        "n": 7,
        "nom": "REEE",
        "age": "25–50",
        "file": "reee.md",
        "slug": "reee",
        "utm": "reee",
        "outil": "Simulateur subventions REEE",
    },
    {
        "n": 8,
        "nom": "Fonds d’urgence",
        "age": "22–50",
        "file": "fonds-urgence.md",
        "slug": "fonds-urgence",
        "utm": "fonds_urgence",
        "outil": "Calculateur filet d’urgence",
    },
    {
        "n": 9,
        "nom": "CELI | Droits inutilisés",
        "age": "25–55",
        "file": "celi-droits.md",
        "slug": "celi-droits",
        "utm": "celi_droits",
        "outil": "Estimateur droits CELI",
    },
    {
        "n": 10,
        "nom": "Trop jeune pour m’assurer",
        "age": "22–40",
        "file": "trop-jeune-assurance.md",
        "slug": "trop-jeune-assurance",
        "utm": "trop_jeune",
        "outil": "Score besoin + capital (présent / futur)",
    },
    {
        "n": 11,
        "nom": "Assurance collective",
        "age": "25–55",
        "file": "assurance-collective.md",
        "slug": "assurance-collective",
        "utm": "collective",
        "outil": "Checklist assurance collective",
    },
    {
        "n": 12,
        "nom": "Travailleur autonome",
        "age": "25–55",
        "file": "travailleur-autonome.md",
        "slug": "travailleur-autonome",
        "utm": "autonome",
        "outil": "Checklist filet autonome",
    },
    {
        "n": 13,
        "nom": "Plan global",
        "age": "30–60",
        "file": "plan-global.md",
        "slug": "plan-global",
        "utm": "plan_global",
        "outil": "Ordre d’attaque (plan global)",
    },
    {
        "n": 14,
        "nom": "Succession | Bases",
        "age": "35–65",
        "file": "succession-bases.md",
        "slug": "succession-bases",
        "utm": "succession",
        "outil": "Checklist liquidité succession",
    },
]

BASE = "https://www.pierreoliviercaouette.ca"


def clean(text: str) -> str:
    text = (
        text.replace("\u2011", "-")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2212", "-")
        .replace("\u202f", " ")
        .replace("\xa0", " ")
        .replace("\u2019", "'")
        .replace("\u2018", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("×", "x")
        .replace("·", "|")
        .replace("👍", "(pouce)")
    )
    text = text.replace("**", "").replace("*", "")
    return text.strip()


def parse_ads(md_path: Path) -> tuple[str, list[dict]]:
    raw = md_path.read_text(encoding="utf-8")
    disclaimer = ""
    m_disc = re.search(
        r"\*\*Disclaimer[^*]*\*\*\s*:?\s*(.+?)(?=\n---|\n## Ad)",
        raw,
        re.S | re.I,
    )
    if m_disc:
        disclaimer = clean(re.sub(r"\s+", " ", m_disc.group(1)))

    ads: list[dict] = []
    parts = re.split(r"\n## (Ad\d+[^\n]*)\n", raw)
    # parts[0]=preamble, then pairs (title, body)
    for i in range(1, len(parts), 2):
        heading = clean(parts[i])
        body = parts[i + 1]
        if "## Brief" in body:
            body = body.split("## Brief")[0]

        texte = ""
        m_txt = re.search(
            r"\*\*Texte principal\s*:\*\*\s*\n((?:>.*(?:\n|$))+)",
            body,
        )
        if m_txt:
            lines = []
            for line in m_txt.group(1).splitlines():
                if not line.startswith(">"):
                    break
                lines.append(re.sub(r"^>\s?", "", line))
            texte = clean("\n".join(lines).strip())

        titre = ""
        desc = ""
        m_t = re.search(r"\*\*Titre\s*:\*\*\s*(.+)", body)
        m_d = re.search(r"\*\*Description\s*:\*\*\s*(.+)", body)
        if m_t:
            titre = clean(m_t.group(1))
        if m_d:
            desc = clean(m_d.group(1))

        ads.append(
            {
                "heading": heading,
                "texte": texte,
                "titre": titre,
                "description": desc,
            }
        )
    return disclaimer, ads


class BriefPDF(FPDF):
    def __init__(self):
        super().__init__(format="Letter", unit="mm")
        self.set_auto_page_break(auto=True, margin=18)
        self.add_font("ArialUni", "", FONT_REG)
        self.add_font("ArialUni", "B", FONT_BOLD)
        self.add_font("ArialUni", "I", FONT_ITALIC)
        self._section = ""

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("ArialUni", "I", 8)
        self.set_text_color(100, 100, 110)
        self.cell(0, 6, "Brief Meta CBO — textes d’annonces (Holo)  ·  Pierre-Olivier Caouette", align="L")
        self.ln(2)
        self.set_draw_color(200, 200, 210)
        self.line(10, 12, 206, 12)
        self.ln(6)

    def footer(self):
        self.set_y(-14)
        self.set_font("ArialUni", "I", 8)
        self.set_text_color(120, 120, 130)
        self.cell(0, 8, f"Page {self.page_no()}/{{nb}}  ·  Visuels à créer côté Holo  ·  Conformité iA avant diffusion", align="C")

    def _mc(self, h: float, text: str, **kwargs):
        self.multi_cell(0, h, text, new_x="LMARGIN", new_y="NEXT", **kwargs)

    def h1(self, text: str):
        self.set_font("ArialUni", "B", 18)
        self.set_text_color(15, 30, 60)
        self._mc(9, text)
        self.ln(2)

    def h2(self, text: str):
        self.ln(2)
        self.set_font("ArialUni", "B", 13)
        self.set_text_color(20, 45, 90)
        self._mc(7, text)
        self.ln(1)

    def h3(self, text: str):
        self.ln(1)
        self.set_font("ArialUni", "B", 11)
        self.set_text_color(30, 60, 110)
        self._mc(6, text)
        self.ln(0.5)

    def body(self, text: str, size: int = 10):
        self.set_font("ArialUni", "", size)
        self.set_text_color(30, 30, 35)
        self._mc(5, text)
        self.ln(1)

    def muted(self, text: str):
        self.set_font("ArialUni", "I", 9)
        self.set_text_color(90, 90, 100)
        self._mc(4.5, text)
        self.ln(1)

    def bullet(self, text: str):
        self.set_font("ArialUni", "", 10)
        self.set_text_color(30, 30, 35)
        self.cell(5, 5, "-")
        self.multi_cell(0, 5, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(0.3)

    def label_value(self, label: str, value: str):
        self.set_font("ArialUni", "B", 9)
        self.set_text_color(50, 50, 60)
        self.write(5, f"{label} ")
        self.set_font("ArialUni", "", 9)
        self.set_text_color(30, 30, 35)
        self.multi_cell(0, 5, value, new_x="LMARGIN", new_y="NEXT")

    def box_start(self):
        self.set_fill_color(245, 247, 252)
        self.set_draw_color(210, 215, 230)

    def ad_block(self, ad: dict):
        self.h3(ad["heading"])
        if ad["titre"]:
            self.label_value("Titre Meta :", ad["titre"])
        if ad["description"]:
            self.label_value("Description :", ad["description"])
        self.ln(1)
        self.set_font("ArialUni", "B", 9)
        self.set_text_color(50, 50, 60)
        self.cell(0, 5, "Texte principal (copier-coller) :")
        self.ln(6)

        # Quote-like block
        y0 = self.get_y()
        x0 = self.l_margin
        usable = self.w - self.l_margin - self.r_margin
        self.set_x(x0 + 2)
        self.set_font("ArialUni", "", 9.5)
        self.set_text_color(25, 25, 30)
        # Write paragraph by paragraph
        paragraphs = ad["texte"].split("\n")
        for p in paragraphs:
            if p.strip() == "":
                self.ln(3)
                continue
            self.set_x(x0 + 2)
            self.multi_cell(usable - 4, 4.8, p, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
        # Left accent bar
        y1 = self.get_y()
        self.set_draw_color(40, 80, 150)
        self.set_line_width(0.6)
        self.line(x0, y0 - 1, x0, y1 - 1)
        self.set_line_width(0.2)
        self.ln(2)


def build():
    pdf = BriefPDF()
    pdf.alias_nb_pages()

    # —— Cover ——
    pdf.add_page()
    pdf.ln(28)
    pdf.set_font("ArialUni", "B", 22)
    pdf.set_text_color(15, 30, 60)
    pdf.multi_cell(0, 10, "Brief campagne Meta Ads", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("ArialUni", "B", 16)
    pdf.multi_cell(0, 8, "Catalogue CBO - 14 ensembles", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.set_font("ArialUni", "", 12)
    pdf.set_text_color(40, 40, 50)
    pdf.multi_cell(
        0,
        6,
        "Pierre-Olivier Caouette — conseiller en sécurité financière\n"
        "Document pour Holo : tous les textes d'annonces prêts à coller.\n"
        "Visuels : à créer de ton côté (pas inclus ici).",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(8)
    pdf.set_fill_color(20, 45, 90)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("ArialUni", "B", 11)
    pdf.cell(0, 10, "  Contenu : setup Ads Manager + 14 x (Ad1 / Ad2 / Ad3)", fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)
    pdf.set_text_color(60, 60, 70)
    pdf.set_font("ArialUni", "", 10)
    pdf.multi_cell(
        0,
        5,
        "Règle créative Ads : chaque annonce met le focus sur l’outil interactif gratuit "
        "de la landing (sans compte, sans formulaire pour commencer). "
        "Le RDV 15 min est un soft close seulement.\n\n"
        "CTA bouton Meta (tous) : En savoir plus\n"
        "Langue : français québécois parlé (tu / t’as / pis).\n"
        "Conformité : valider avec iA / superviseur avant diffusion payante.",
    )

    # —— Setup ——
    pdf.add_page()
    pdf.h1("1. Setup Ads Manager")
    pdf.h2("Campagne")
    for line in [
        "Nom : 2026 | CBO Catalog | Particuliers RDV",
        "Objectif phase 1 : Trafic (lien)",
        "Achat d’annonces : Enchères",
        "Advantage campaign budget (CBO) : activé",
        "Budget journalier test : 120–200 $ / jour",
        "Emplacements : Advantage+",
        "Optimisation : Clics vers le lien (landing)",
        "Durée test : 4–6 semaines, puis scale des ensembles gagnants",
    ]:
        pdf.bullet(line)

    pdf.h2("Géo (tous les ensembles)")
    pdf.bullet("Centre-du-Québec / Victoriaville + rayons pertinents")
    pdf.bullet("Élargir QC si CPA acceptable après ~14 jours")

    pdf.h2("Exclusions")
    pdf.bullet("Liste clients email (si uploadée)")
    pdf.bullet("Employés / listes internes")

    pdf.h2("UTM (obligatoire sur chaque URL)")
    pdf.body(
        "utm_source=meta\n"
        "utm_medium=paid\n"
        "utm_campaign=cbo_catalog_2026\n"
        "utm_content={prefixe}_ad{n}\n\n"
        f"Exemple Ad1 CELIAPP :\n"
        f"{BASE}/campagnes/celiapp?utm_source=meta&utm_medium=paid"
        f"&utm_campaign=cbo_catalog_2026&utm_content=celiapp_ad1"
    )

    pdf.h2("Conversion")
    pdf.body(
        "Primaire : clic → landing /campagnes/{slug} → réservation /rendez-vous.\n"
        "Sur chaque landing : outil interactif gratuit avant les puces / FAQ."
    )

    # —— Table ensembles ——
    pdf.add_page()
    pdf.h1("2. Les 14 ensembles (vue d’ensemble)")
    pdf.muted("Ciblage : audiences larges (Advantage+ ou intérêts légers). Ne pas empiler 15 intérêts.")
    pdf.ln(2)

    # Simple table header
    pdf.set_font("ArialUni", "B", 8)
    pdf.set_fill_color(20, 45, 90)
    pdf.set_text_color(255, 255, 255)
    col_w = [10, 58, 18, 55, 45]
    headers = ["#", "Ensemble", "Âge", "Landing", "UTM préfixe"]
    for w, h in zip(col_w, headers):
        pdf.cell(w, 7, h, border=0, fill=True)
    pdf.ln()
    pdf.set_x(pdf.l_margin)

    pdf.set_font("ArialUni", "", 7.5)
    for i, e in enumerate(ENSEMBLES):
        if i % 2 == 0:
            pdf.set_fill_color(245, 247, 252)
        else:
            pdf.set_fill_color(255, 255, 255)
        pdf.set_text_color(30, 30, 35)
        row = [
            str(e["n"]),
            clean(e["nom"])[:36],
            clean(e["age"]),
            f"/campagnes/{e['slug']}"[:34],
            e["utm"],
        ]
        pdf.set_x(pdf.l_margin)
        for w, cell in zip(col_w, row):
            pdf.cell(w, 6, cell, border=0, fill=True)
        pdf.ln()
        pdf.set_x(pdf.l_margin)

    pdf.ln(6)
    pdf.h2("Notes pour les créatifs (visuels — à toi)")
    pdf.bullet("Style référence : dark navy, contraste fort, typo bold (esprit mythe bancaire).")
    pdf.bullet("Accroche visuelle : mentionner l’outil gratuit (ex. « Simulateur gratuit — sans compte »).")
    pdf.bullet("Formats utiles : feed 1:1 ou 4:5 + Stories 9:16.")
    pdf.bullet("Éviter : promesses de rendement, garanties magiques, jargon trop dense.")
    pdf.bullet("Disclaimer visible sur le créatif ou en commentaire épinglé (voir chaque ensemble).")

    # —— Each ensemble ——
    for e in ENSEMBLES:
        md = ROOT / e["file"]
        disclaimer, ads = parse_ads(md)
        landing = f"{BASE}/campagnes/{e['slug']}"

        pdf.add_page()
        pdf.h1(f"Ensemble {e['n']}/14 — {e['nom']}")
        pdf.label_value("Âge :", e["age"])
        pdf.label_value("Outil landing :", e["outil"])
        pdf.label_value("Landing :", landing)
        pdf.label_value("UTM content :", f"{e['utm']}_ad1 / {e['utm']}_ad2 / {e['utm']}_ad3")
        pdf.label_value("CTA bouton :", "En savoir plus")
        pdf.ln(1)
        if disclaimer:
            pdf.set_font("ArialUni", "B", 9)
            pdf.set_text_color(120, 60, 20)
            pdf.cell(0, 5, "Disclaimer / conformité :")
            pdf.ln(5)
            pdf.muted(disclaimer)

        pdf.ln(1)
        for ad_i, ad in enumerate(ads, start=1):
            url = (
                f"{landing}?utm_source=meta&utm_medium=paid"
                f"&utm_campaign=cbo_catalog_2026&utm_content={e['utm']}_ad{ad_i}"
            )
            # Ensure URL in texte uses UTM version note
            pdf.ad_block(ad)
            pdf.label_value("URL destination (avec UTM) :", url)
            pdf.ln(2)

        if not ads:
            pdf.body(f"(Aucun Ad parsé — vérifier {e['file']})")

    # —— Closing ——
    pdf.add_page()
    pdf.h1("3. Checklist avant diffusion")
    for item in [
        "14 ensembles créés + 2–3 annonces chacun",
        "URLs avec UTM complets sur chaque annonce",
        "CTA « En savoir plus » partout",
        "Commentaire épinglé / disclaimer où requis (surtout comparateur)",
        "Budget journalier CBO + plafond mensuel définis",
        "Exclusions listes clients / employés",
        "Validation conformité iA / superviseur (textes + visuels)",
        "Pixel / événements : view landing + RDV trackés côté site",
    ]:
        pdf.bullet(f"[ ] {item}")

    pdf.ln(6)
    pdf.h2("Contacts / liens utiles")
    pdf.bullet(f"Site : {BASE}")
    pdf.bullet(f"RDV : {BASE}/rendez-vous")
    pdf.bullet(f"Landings : {BASE}/campagnes/{{slug}}")
    pdf.ln(4)
    pdf.muted(
        "Source des textes : emails/campagne-meta-catalog/*.md — "
        "généré pour partage Holo. Visuels exclus volontairement."
    )

    pdf.output(str(OUT))
    print("OK ->", OUT)
    print("Pages:", pdf.page_no())


def build_txt() -> None:
    """Brief texte pur (partage chat / canaux qui refusent le PDF)."""
    lines: list[str] = []
    W = lines.append

    W("BRIEF CAMPAGNE META ADS — CATALOGUE CBO — 14 ENSEMBLES")
    W("Pierre-Olivier Caouette — conseiller en sécurité financière")
    W("Document pour Holo : textes d'annonces prêts à coller. Visuels à créer de ton côté.")
    W("")
    W(
        "Règle créatives : focus outil interactif gratuit (sans compte, sans formulaire). "
        "RDV 15 min = soft close."
    )
    W("CTA bouton Meta (tous) : En savoir plus")
    W("Langue : français québécois parlé (tu / t'as / pis).")
    W("Conformité : valider avec iA / superviseur avant diffusion payante.")
    W("")
    W("=" * 72)
    W("1. SETUP ADS MANAGER")
    W("=" * 72)
    W("")
    W("CAMPAGNE")
    W("- Nom : 2026 | CBO Catalog | Particuliers RDV")
    W("- Objectif phase 1 : Trafic (lien)")
    W("- Achat d'annonces : Enchères")
    W("- Advantage campaign budget (CBO) : activé")
    W("- Budget journalier test : 120-200 $ / jour")
    W("- Emplacements : Advantage+")
    W("- Optimisation : Clics vers le lien (landing)")
    W("- Durée test : 4-6 semaines, puis scale des ensembles gagnants")
    W("")
    W("GÉO (tous)")
    W("- Centre-du-Québec / Victoriaville + rayons pertinents")
    W("- Élargir QC si CPA acceptable après ~14 jours")
    W("")
    W("EXCLUSIONS")
    W("- Liste clients email (si uploadée)")
    W("- Employés / listes internes")
    W("")
    W("UTM (obligatoire)")
    W("utm_source=meta")
    W("utm_medium=paid")
    W("utm_campaign=cbo_catalog_2026")
    W("utm_content={prefixe}_ad{n}")
    W("")
    W("Exemple Ad1 CELIAPP :")
    W(
        f"{BASE_URL}/campagnes/celiapp?utm_source=meta&utm_medium=paid"
        f"&utm_campaign=cbo_catalog_2026&utm_content=celiapp_ad1"
    )
    W("")
    W("=" * 72)
    W("2. VUE D'ENSEMBLE DES 14 ENSEMBLES")
    W("=" * 72)
    W("")
    for e in ENSEMBLES:
        W(
            f"{e['n']:2d}. {e['nom']} | Âge {e['age']} | /campagnes/{e['slug']} "
            f"| UTM {e['utm']} | Outil : {e['outil']}"
        )
    W("")
    W(
        "Ciblage : audiences larges (Advantage+ ou intérêts légers). "
        "Ne pas empiler 15 intérêts."
    )
    W("")
    W(
        "Notes visuels (à toi) : dark navy, contraste fort, typo bold ; "
        "mentionner outil gratuit ; feed 1:1 ou 4:5 + Stories 9:16 ; "
        "pas de promesses de rendement."
    )
    W("")

    for e in ENSEMBLES:
        disc, ads = parse_ads(ROOT / e["file"])
        landing = f"{BASE_URL}/campagnes/{e['slug']}"
        W("=" * 72)
        W(f"ENSEMBLE {e['n']}/14 — {e['nom']}")
        W("=" * 72)
        W(f"Âge : {e['age']}")
        W(f"Outil landing : {e['outil']}")
        W(f"Landing : {landing}")
        W(f"UTM content : {e['utm']}_ad1 / {e['utm']}_ad2 / {e['utm']}_ad3")
        W("CTA bouton : En savoir plus")
        if disc:
            W("")
            W("DISCLAIMER / CONFORMITÉ :")
            W(disc)
        for ad_i, ad in enumerate(ads, start=1):
            url = (
                f"{landing}?utm_source=meta&utm_medium=paid"
                f"&utm_campaign=cbo_catalog_2026&utm_content={e['utm']}_ad{ad_i}"
            )
            W("")
            W("-" * 72)
            W(ad["heading"])
            W("-" * 72)
            if ad["titre"]:
                W(f"Titre Meta : {ad['titre']}")
            if ad["description"]:
                W(f"Description : {ad['description']}")
            W("")
            W("TEXTE PRINCIPAL (copier-coller) :")
            W("")
            W(ad["texte"])
            W("")
            W(f"URL destination (avec UTM) : {url}")
        W("")

    W("=" * 72)
    W("3. CHECKLIST AVANT DIFFUSION")
    W("=" * 72)
    W("[ ] 14 ensembles créés + 2-3 annonces chacun")
    W("[ ] URLs avec UTM complets sur chaque annonce")
    W("[ ] CTA En savoir plus partout")
    W("[ ] Commentaire épinglé / disclaimer où requis")
    W("[ ] Budget journalier CBO + plafond mensuel définis")
    W("[ ] Exclusions listes clients / employés")
    W("[ ] Validation conformité iA / superviseur (textes + visuels)")
    W("[ ] Pixel / événements : view landing + RDV trackés")
    W("")
    W(f"Site : {BASE_URL}")
    W(f"RDV : {BASE_URL}/rendez-vous")
    W(f"Landings : {BASE_URL}/campagnes/{{slug}}")
    W("")
    W("Source : emails/campagne-meta-catalog/*.md")

    OUT_TXT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("OK ->", OUT_TXT)
    print("Lines:", len(lines))


if __name__ == "__main__":
    build()
    build_txt()
