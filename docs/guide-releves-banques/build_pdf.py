# -*- coding: utf-8 -*-
"""PDF — parcours fonds en banque / releves CRM2 (hors courtage autonome)."""
from pathlib import Path

from fpdf import FPDF
from PIL import Image

ROOT = Path(__file__).resolve().parent
IMG = ROOT / "assets" / "pdf"
OUT = ROOT / "guide-releves-rendements-banques.pdf"
FONT_REG = "C:/Windows/Fonts/arial.ttf"
FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"


class GuidePDF(FPDF):
    def __init__(self):
        super().__init__(format="Letter", unit="mm")
        self.set_auto_page_break(auto=True, margin=16)
        self.set_margins(16, 14, 16)
        self.add_font("ArialUni", "", FONT_REG)
        self.add_font("ArialUni", "B", FONT_BOLD)
        self.brand = (1, 35, 63)
        self.accent = (6, 77, 217)
        self.muted = (100, 116, 139)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_x(self.l_margin)
        self.set_font("ArialUni", "", 8)
        self.set_text_color(*self.muted)
        self.cell(0, 5, "Guide — Releves et rendements (fonds en banque, hors courtage)")
        self.ln(7)

    def footer(self):
        self.set_y(-12)
        self.set_font("ArialUni", "", 8)
        self.set_text_color(*self.muted)
        self.cell(0, 8, str(self.page_no()), align="C")

    def rx(self):
        self.set_x(self.l_margin)

    def h1(self, t):
        self.rx()
        self.set_font("ArialUni", "B", 17)
        self.set_text_color(*self.brand)
        self.multi_cell(0, 8, t)
        self.ln(2)

    def h2(self, t):
        self.ln(1)
        self.rx()
        self.set_font("ArialUni", "B", 12)
        self.set_text_color(*self.accent)
        self.multi_cell(0, 6.5, t)
        self.ln(1)

    def body(self, t):
        self.rx()
        self.set_font("ArialUni", "", 10)
        self.set_text_color(51, 65, 85)
        self.multi_cell(0, 5.2, t)
        self.ln(1)

    def source(self, t):
        self.rx()
        self.set_font("ArialUni", "", 8)
        self.set_text_color(*self.muted)
        self.multi_cell(0, 4.5, "Source: " + t)
        self.ln(1.5)

    def step(self, n, t):
        self.rx()
        self.set_font("ArialUni", "B", 10)
        self.set_text_color(*self.accent)
        self.cell(7, 5.2, f"{n}.")
        self.set_font("ArialUni", "", 10)
        self.set_text_color(51, 65, 85)
        self.multi_cell(0, 5.2, t)
        self.ln(0.5)

    def quote(self, t):
        self.rx()
        self.set_fill_color(248, 250, 252)
        self.set_draw_color(203, 213, 225)
        self.set_font("ArialUni", "", 9)
        self.set_text_color(71, 85, 105)
        self.multi_cell(0, 5, t, border=1, fill=True)
        self.ln(2)

    def img(self, name, caption, w=95):
        path = IMG / name
        if not path.exists():
            return
        if self.get_y() > 155:
            self.add_page()
        self.rx()
        y = self.get_y()
        im = Image.open(path)
        iw, ih = im.size
        h = w * ih / iw
        max_h = 165
        if h > max_h:
            h = max_h
            w = h * iw / ih
        if y + h > 248:
            self.add_page()
            y = self.get_y()
        self.image(str(path), x=self.l_margin, y=y, w=w)
        self.set_xy(self.l_margin, y + h + 1.5)
        self.set_font("ArialUni", "", 8)
        self.set_text_color(*self.muted)
        self.multi_cell(0, 4, caption)
        self.ln(3)


def build():
    pdf = GuidePDF()

    pdf.add_page()
    pdf.set_fill_color(*pdf.brand)
    pdf.rect(0, 0, 220, 48, "F")
    pdf.set_xy(16, 14)
    pdf.set_font("ArialUni", "B", 20)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(180, 9, "Guide officiel", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(16)
    pdf.set_font("ArialUni", "", 11)
    pdf.cell(
        180,
        7,
        "Releves et rendements — fonds en banque (succursale / banque en ligne)",
        align="C",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.set_xy(16, 58)
    pdf.set_text_color(*pdf.brand)
    pdf.set_font("ArialUni", "B", 14)
    pdf.cell(0, 7, "Pierre-Olivier Caouette", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("ArialUni", "", 10)
    pdf.set_text_color(51, 65, 85)
    pdf.cell(
        0,
        6,
        "Conseiller en securite financiere - iA Groupe financier",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(3)
    pdf.body(
        "Ce guide cible les placements gérés / fonds communs visibles dans la banque "
        "en ligne (AccesD, EasyWeb, Scotia OnLine, RBC Online Banking, etc.). "
        "Document type a envoyer: rapport de rendement / PPS / Annual Performance Report."
    )
    pdf.quote(
        "Hors portee: courtage autonome (iTRADE, Investor's Edge, NegociTitres, "
        "BMO Ligne d'action, BNCD). Les ecrans apres connexion ne sont pas capturables "
        "sans compte; on utilise les guides et exemples publies par les institutions."
    )

    # Desjardins
    pdf.add_page()
    pdf.h1("1. Desjardins — Fonds Desjardins")
    pdf.source("desjardins.com Documents et releves ; fondsdesjardins.com PDF rendement")
    pdf.body(
        "Document cle: Rapport sur le rendement des placements "
        "(taux de rendement personnel), avec le releve Fonds Desjardins (4x/an)."
    )
    pdf.h2("Parcours AccesD Web (officiel)")
    pdf.step(1, "Sommaire AccesD > Releves et documents.")
    pdf.step(2, "Releves et documents de placements > Fonds Desjardins / Fonds de placement.")
    pdf.step(3, "Ouvrir le releve + le rapport sur le rendement.")
    pdf.img(
        "desjardins-documents-releves.png",
        "Page officielle Desjardins — Documents et releves (Documents de placements).",
        w=168,
    )
    pdf.img(
        "desjardins_taux_rendement_p1.png",
        "Extrait officiel Fonds Desjardins — Comprendre votre taux de rendement personnel.",
        w=110,
    )

    # BNC
    pdf.add_page()
    pdf.h1("2. Banque Nationale — Fonds BNI")
    pdf.source("bnc.ca releve portefeuille ; rapports annuels ; exemple FBNGP annoté")
    pdf.body(
        "Releve trimestriel. Au 31 decembre: Rapport sur le rendement (TRPVM) "
        "+ Rapport des frais. Hors portee: BNCD (courtage direct)."
    )
    pdf.step(1, "Banque en ligne / espace placements.")
    pdf.step(2, "Documents > releve de portefeuille.")
    pdf.step(3, "Releve du 31 decembre > Rapport sur le rendement.")
    pdf.img(
        "bnc_rapport_rendement.png",
        "Exemple officiel annoté — Rapport sur le rendement des placements (TRPT / TRPVM).",
        w=145,
    )
    pdf.img(
        "bnc_releve_portefeuille.jpg",
        "Exemple officiel — Releve de portefeuille d'investissement (sommaire).",
        w=105,
    )

    # TD
    pdf.add_page()
    pdf.h1("3. TD — Comfort / fonds via EasyWeb")
    pdf.source("td.intelliresponse.com EasyWeb ; td.com Comfort Portfolios")
    pdf.body(
        "Les TD Comfort Portfolios sont des fonds communs gérés, souvent achetes "
        "en succursale, puis visibles dans EasyWeb. Hors portee: Direct Investing / WebBroker."
    )
    pdf.h2("EasyWeb (texte officiel)")
    pdf.step(1, "Connexion EasyWeb.")
    pdf.step(2, "Investments / Placements ou My Accounts.")
    pdf.step(3, "Ouvrir le compte de fonds / Comfort.")
    pdf.h2("Documents")
    pdf.body(
        "Statements / eDocuments / eServices: releve de placements et rapport de "
        "rendement annuel (CRM2) lorsqu'il est disponible. Completer au besoin avec "
        "les Fund Facts du fonds sur td.com."
    )
    pdf.img(
        "td_app_accueil.jpg",
        "Capture officielle Google Play — app TD (ligne Placements sur Mes comptes). "
        "Utile pour repérer le compte; le PDF de rendement reste dans eDocuments.",
        w=70,
    )

    # BMO
    pdf.add_page()
    pdf.h1("4. BMO — Fonds en succursale / Online Banking")
    pdf.source("BMO Mutual Funds — achat succursale ou Online Banking")
    pdf.body(
        "Si les fonds ont ete achetes en succursale ou via BMO Online Banking, "
        "les releves se consultent dans la banque en ligne. Hors portee: Ligne d'action / app Invest."
    )
    pdf.step(1, "Connexion BMO Online Banking.")
    pdf.step(2, "Compte fonds / placements.")
    pdf.step(3, "Documents / Statements > releve + rapport annuel de rendement.")
    pdf.quote(
        "BMO (rapports de fonds): si achat en succursale ou Online Banking, "
        "soutien au 1-800-665-7700."
    )

    # RBC
    pdf.add_page()
    pdf.h1("5. RBC — Fonds via Online Banking")
    pdf.source("rbcroyalbank.com Access Your Investment Accounts ; mutual-fund-investing")
    pdf.body(
        "Document cle: Annual Performance Report (avec le releve annuel), "
        "plus Annual Charges and Compensation Report. Hors portee: Direct Investing."
    )
    pdf.h2("eDocuments (texte officiel)")
    pdf.step(1, "Online Banking > Statements/Documents.")
    pdf.step(2, "Choisir le compte d'investissement.")
    pdf.step(3, "Type de document: releve / Annual Performance Report.")
    pdf.body("App: More > Statements > compte.")
    pdf.img(
        "rbc_app_home.png",
        "Capture officielle RBC Mobile — aperçu des comptes (point d'entree; "
        "les PDF de rendement sont sous Statements/Documents).",
        w=68,
    )

    # Scotia
    pdf.add_page()
    pdf.h1("6. Scotia — Personal Portfolio Statement")
    pdf.source("help.scotiabank.com ; scotiabank.com Annual Performance Report ; PPS Guide PDF")
    pdf.quote(
        "Account performance is provided quarterly in your Personal Portfolio Statement (PPS). "
        "You'll see your personal rates of return over multiple time periods."
    )
    pdf.body(
        "Le Annual Performance Report est joint au PPS de decembre "
        "(taux personnels, money-weighted, apres frais). Hors portee: iTRADE."
    )
    pdf.step(1, "Scotia OnLine / app > Documents / Statements.")
    pdf.step(2, "Telecharger le Personal Portfolio Statement.")
    pdf.step(3, "Pour le rendement annuel: PPS de decembre.")
    pdf.img(
        "scotia_pps_guide_p1.png",
        "Guide officiel Scotiabank — Personal Portfolio Statement (page 1).",
        w=110,
    )
    pdf.img(
        "scotia_pps_guide_p2.png",
        "Guide officiel Scotiabank — Personal Portfolio Statement (detail des fonds).",
        w=110,
    )

    # CIBC
    pdf.add_page()
    pdf.h1("7. CIBC — Imperial Investor Service")
    pdf.source("cibc.com Find My Documents — Imperial Investor Service")
    pdf.body(
        "Fonds via le reseau CIBC / Service Investisseurs Imperial: releves + "
        "rapport annuel de rendement du compte. Hors portee: Investor's Edge."
    )
    pdf.step(1, "Connexion Imperial Investor Service (ou espace placements lie).")
    pdf.step(2, "Accounts > eDocuments.")
    pdf.step(3, "Releve + rapport annuel sur le rendement.")
    pdf.body("App CIBC: Plus > documents / releves pour les comptes lies.")

    # Closing
    pdf.add_page()
    pdf.h1("Pour comparer avec votre conseiller")
    pdf.body(
        "Envoyez le nom du fonds + le rapport de rendement (ou le PPS / "
        "Annual Performance Report). On compare a profil egal avec les "
        "Portefeuilles Modeles iA."
    )
    pdf.ln(2)
    pdf.rx()
    pdf.set_font("ArialUni", "B", 11)
    pdf.set_text_color(*pdf.brand)
    pdf.cell(0, 6, "Pierre-Olivier Caouette", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("ArialUni", "", 10)
    pdf.set_text_color(51, 65, 85)
    pdf.cell(0, 5, "819 806-1164 | p-o.caouette@agc.ia.ca", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "pierreoliviercaouette.ca", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.quote(
        "Document informatif. Images et textes: publication des institutions citees, "
        "a des fins educatives. Les menus peuvent changer. "
        "Les rendements passes ne garantissent pas les rendements futurs."
    )

    pdf.output(str(OUT))
    print("PDF:", OUT)


if __name__ == "__main__":
    build()
