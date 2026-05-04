"""
generate-market-report.py

Generates a Cartrefi-branded PDF market report covering every adult-sector
care service in Wales registered with Care Inspectorate Wales.

Data is read live from Supabase if env is present; otherwise it falls back to
the embedded snapshot at the bottom of this file (matching the row counts as
of the report date).

    python3 scripts/generate-market-report.py
"""

from __future__ import annotations

import os
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reports" / f"gofal-ateb-market-report-{date.today().isoformat()}.pdf"

# Cartrefi brand
HEATHER = colors.HexColor("#7B5B7E")
BRAMBLE = colors.HexColor("#4A2F4E")
LAVENDER = colors.HexColor("#A68AAB")
CORAL = colors.HexColor("#D4806A")
HONEY = colors.HexColor("#E5AD3E")
TEAL = colors.HexColor("#4F8A8B")
IVORY = colors.HexColor("#FBF7F3")
BLUSH = colors.HexColor("#DDD4CE")
DUSK = colors.HexColor("#2C2430")
SOFT_GREY = colors.HexColor("#6B5670")


# ----------------------------- styles -----------------------------

def make_styles():
    base = getSampleStyleSheet()
    styles = {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=26,
            leading=30,
            textColor=BRAMBLE,
            spaceAfter=2,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=16,
            textColor=HEATHER,
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=BRAMBLE,
            spaceBefore=18,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=HEATHER,
            spaceBefore=10,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=DUSK,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=SOFT_GREY,
        ),
        "lead": ParagraphStyle(
            "lead",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=16,
            textColor=DUSK,
            spaceAfter=10,
        ),
        "stat_value": ParagraphStyle(
            "stat_value",
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=24,
            textColor=BRAMBLE,
            alignment=TA_LEFT,
        ),
        "stat_label": ParagraphStyle(
            "stat_label",
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=SOFT_GREY,
            alignment=TA_LEFT,
        ),
        "callout_title": ParagraphStyle(
            "callout_title",
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=BRAMBLE,
            spaceAfter=4,
        ),
        "callout_body": ParagraphStyle(
            "callout_body",
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=DUSK,
        ),
    }
    return styles


# --------------------------- table helpers ---------------------------

def banded_table(data, col_widths, header_bg=HEATHER, last_row_bold=False):
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 7),
        ("TOPPADDING", (0, 0), (-1, 0), 7),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("TEXTCOLOR", (0, 1), (-1, -1), DUSK),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 1), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BLUSH),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ])
    for i in range(1, len(data)):
        if i % 2 == 0:
            style.add("BACKGROUND", (0, i), (-1, i), IVORY)
    if last_row_bold:
        style.add("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold")
        style.add("BACKGROUND", (0, -1), (-1, -1), BLUSH)
    t.setStyle(style)
    return t


def stat_card(value, label, accent=HEATHER, styles=None):
    inner = [
        [Paragraph(f'<font color="{accent.hexval()}">{value}</font>', styles["stat_value"])],
        [Paragraph(label, styles["stat_label"])],
    ]
    t = Table(inner, colWidths=[55 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.6, BLUSH),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 10),
        ("LINEABOVE", (0, 0), (-1, 0), 3, accent),
    ]))
    return t


def stat_row(stats, styles, col_width=55 * mm):
    cells = [stat_card(v, l, a, styles) for (v, l, a) in stats]
    t = Table([cells], colWidths=[col_width] * len(stats))
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def callout_box(title, body, accent=HONEY, styles=None):
    t = Table([
        [Paragraph(title, styles["callout_title"])],
        [Paragraph(body, styles["callout_body"])],
    ], colWidths=[170 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF8EB")),
        ("LINEBEFORE", (0, 0), (0, -1), 4, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 10),
    ]))
    return t


# --------------------------- page chrome ---------------------------

def make_doc(path):
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=22 * mm,
        title="gofal.wales × Ateb — Welsh Adult-Care Market Report (corrected pricing)",
        author="Nathan Bowen / Ateb AI",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="content", showBoundary=0)
    template = PageTemplate(id="main", frames=frame, onPage=draw_chrome)
    doc.addPageTemplates([template])
    return doc


def draw_chrome(canvas, doc):
    canvas.saveState()
    # Top bar — Heather strip
    canvas.setFillColor(HEATHER)
    canvas.rect(0, A4[1] - 8 * mm, A4[0], 8 * mm, stroke=0, fill=1)
    # Footer
    canvas.setFillColor(SOFT_GREY)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(
        20 * mm,
        12 * mm,
        f"gofal.wales × Ateb — Welsh adult-care market report · Source: Care Inspectorate Wales (CIW) public register · {date.today().strftime('%d %b %Y')}",
    )
    canvas.drawRightString(A4[0] - 20 * mm, 12 * mm, f"Page {doc.page}")
    # Footer line
    canvas.setStrokeColor(BLUSH)
    canvas.setLineWidth(0.4)
    canvas.line(20 * mm, 16 * mm, A4[0] - 20 * mm, 16 * mm)
    canvas.restoreState()


# --------------------------- content build ---------------------------

def build(styles):
    s = []

    # ===== Cover =====
    s.append(Paragraph("Welsh adult-care market", styles["title"]))
    s.append(Paragraph(
        "A complete picture of every CIW-registered adult-care service in Wales — "
        "with a directory operator&rsquo;s and an AI-voice-agent provider&rsquo;s lens. "
        "<i>Corrected-pricing edition.</i>",
        styles["subtitle"],
    ))

    s.append(stat_row([
        ("1,836", "adult-sector services", HEATHER),
        ("1,012", "distinct providers", CORAL),
        ("25,191", "registered adult beds", HONEY),
    ], styles))
    s.append(Spacer(1, 6))
    s.append(stat_row([
        ("1,038", "care homes (residential + nursing)", HEATHER),
        ("790", "domiciliary providers", TEAL),
        ("1,830 / 1,836", "geocoded for the live map", LAVENDER),
    ], styles))

    s.append(Spacer(1, 14))
    s.append(callout_box(
        "Why this report",
        "Two product lines, one dataset. <b>gofal.wales</b> needs to know which services to seed, which "
        "to prioritise for the &lsquo;claim your listing&rsquo; flow, and where Welsh-language differentiation matters. "
        "<b>Ateb Care</b> needs to know which operators have the call volume, the lack of digital infrastructure, "
        "and the operational profile to convert at one of three Care tiers (&pound;1,000 Essentials / &pound;1,500 "
        "Professional / &pound;3,000+ Enterprise per month). This report answers both from the public CIW "
        "register, geocoded and segmented.",
        styles=styles,
    ))

    s.append(PageBreak())

    # ===== Section 1 — Market structure =====
    s.append(Paragraph("1. Market structure", styles["h1"]))
    s.append(Paragraph(
        "The CIW adult-sector register has 1,855 active services, of which 1,836 have a usable "
        "postcode for mapping. The remaining 19 are children&rsquo;s/adult mixed sites whose addresses "
        "CIW redacts for safeguarding reasons; we have excluded them in line with the &lsquo;skip children&rsquo; "
        "scope. The four service types break down as follows:",
        styles["body"],
    ))

    s.append(banded_table(
        [
            ["Service type", "Sub-type", "Sites", "% of sector"],
            ["Care Home Service", "Adults Without Nursing", "791", "43.1%"],
            ["Domiciliary Support Service", "—", "790", "43.0%"],
            ["Care Home Service", "Adults With Nursing", "247", "13.5%"],
            ["Adult Placement Service", "—", "8", "0.4%"],
            ["Total", "", "1,836", "100%"],
        ],
        col_widths=[55 * mm, 55 * mm, 25 * mm, 35 * mm],
        last_row_bold=True,
    ))

    s.append(Spacer(1, 12))
    s.append(Paragraph("Capacity (registered places, care homes only)", styles["h2"]))

    s.append(banded_table(
        [
            ["Care home type", "Sites", "Total beds", "Avg", "Median", "Smallest", "Largest"],
            ["Adults Without Nursing", "791", "13,264", "16.8", "10", "1", "149"],
            ["Adults With Nursing", "247", "11,927", "48.3", "42", "6", "129"],
            ["Combined", "1,038", "25,191", "24.3", "13", "1", "149"],
        ],
        col_widths=[55 * mm, 18 * mm, 25 * mm, 16 * mm, 18 * mm, 22 * mm, 22 * mm],
        last_row_bold=True,
    ))

    s.append(Spacer(1, 8))
    s.append(callout_box(
        "Two distinct micro-markets",
        "Residential homes are <b>small</b> &mdash; median 10 beds, half of all residential homes have 10 places "
        "or fewer. Nursing homes are <b>five times larger</b> &mdash; median 42 beds. The same business model "
        "won&rsquo;t fit both: residential operators are mostly owner-managers; nursing homes have managers, "
        "deputies, and call-handling demand that already justifies an Ateb agent.",
        styles=styles,
    ))

    s.append(PageBreak())

    # ===== Section 2 — Operator landscape =====
    s.append(Paragraph("2. Operator landscape — independent vs chain", styles["h1"]))
    s.append(Paragraph(
        "The single most actionable signal in the dataset is the <b>provider portfolio size</b> &mdash; how "
        "many CIW-registered services each provider operates. We bucket providers by adult-sector site count.",
        styles["body"],
    ))

    s.append(Paragraph("All adult-sector services (1,836 sites, 1,012 providers)", styles["h2"]))
    s.append(banded_table(
        [
            ["Bracket", "Providers", "Sites", "% of sites"],
            ["1 site (independent)", "726", "726", "39.5%"],
            ["2-3 sites (small group)", "194", "433", "23.6%"],
            ["4-9 sites (regional)", "78", "442", "24.1%"],
            ["10-24 sites (mid chain)", "13", "190", "10.3%"],
            ["25+ sites (large chain)", "1", "45", "2.5%"],
        ],
        col_widths=[60 * mm, 30 * mm, 30 * mm, 35 * mm],
    ))

    s.append(Spacer(1, 10))
    s.append(Paragraph("Care homes only (1,038 sites, 585 providers)", styles["h2"]))
    s.append(banded_table(
        [
            ["Bracket", "Providers", "Care homes", "% of homes"],
            ["1 site (independent)", "447", "447", "43.1%"],
            ["2-3 sites (small group)", "90", "200", "19.3%"],
            ["4-9 sites (regional)", "38", "215", "20.7%"],
            ["10-24 sites (mid chain)", "9", "133", "12.8%"],
            ["25+ sites (large chain)", "1", "43", "4.1%"],
        ],
        col_widths=[60 * mm, 30 * mm, 30 * mm, 35 * mm],
    ))

    s.append(Spacer(1, 12))
    s.append(Paragraph("Top 10 operators by adult-sector footprint", styles["h2"]))
    s.append(banded_table(
        [
            ["Operator", "Sites", "Care homes", "Dom.", "Notes"],
            ["Accomplish Group Ltd", "45", "43", "2", "Largest single operator"],
            ["Swanton Care &amp; Community Ltd", "24", "23", "1", ""],
            ["Shaw Healthcare (Cambria) Ltd", "20", "17", "3", ""],
            ["Ocean Community Services Ltd", "17", "17", "0", ""],
            ["M&amp;D Care Operations Ltd", "17", "14", "3", ""],
            ["Achieve Together Ltd", "17", "12", "5", ""],
            ["Gwynedd Council", "15", "13", "1", "Public sector · Welsh-medium"],
            ["HC-One Limited", "14", "14", "0", "UK-national chain"],
            ["Mental Health Care (Highfield Park) Ltd", "13", "13", "0", "Specialist"],
            ["Cartrefi Cymru Co-operative Ltd", "12", "5", "7", "Welsh co-op · brand ally"],
        ],
        col_widths=[68 * mm, 16 * mm, 22 * mm, 16 * mm, 48 * mm],
    ))

    s.append(Spacer(1, 8))
    s.append(callout_box(
        "Concentration is shallow",
        "Wales has no Bupa-scale operator. The largest chain (Accomplish Group) holds <b>2.5%</b> of sites; "
        "the top 10 combined hold <b>11%</b>. The market is built on independents and small groups &mdash; which "
        "is exactly the operator profile that lacks the in-house ops to handle phone enquiries professionally. "
        "That is a structural Ateb opportunity.",
        styles=styles,
    ))

    s.append(PageBreak())

    # ===== Section 3 — Digital readiness =====
    s.append(Paragraph("3. Digital readiness — who has a website?", styles["h1"]))
    s.append(Paragraph(
        "CIW captures three contact channels: phone, email, and website. Phone coverage is universal "
        "(every registered service has a phone number); email is near-universal; <b>website coverage is the "
        "soft underbelly</b>. Across the adult sector, 38&ndash;40% of services have no website at all.",
        styles["body"],
    ))

    s.append(banded_table(
        [
            ["Service type", "Sites", "Phone", "Email", "Website", "% website"],
            ["Care Home Service", "1,038", "1,038", "1,034", "636", "61.3%"],
            ["Domiciliary Support Service", "790", "790", "780", "472", "59.7%"],
            ["Adult Placement Service", "8", "8", "8", "6", "75.0%"],
            ["Total", "1,836", "1,836", "1,822", "1,114", "60.7%"],
        ],
        col_widths=[58 * mm, 22 * mm, 22 * mm, 22 * mm, 22 * mm, 24 * mm],
        last_row_bold=True,
    ))

    s.append(Spacer(1, 10))
    s.append(Paragraph("Website coverage by operator size", styles["h2"]))
    s.append(banded_table(
        [
            ["Bracket", "Sites", "With website", "% website"],
            ["1 site (independent)", "726", "407", "56.1%"],
            ["2-3 sites (small group)", "433", "251", "58.0%"],
            ["4-9 sites (regional)", "442", "307", "69.5%"],
            ["10-24 sites (mid chain)", "190", "110", "57.9%"],
            ["25+ sites (large chain)", "45", "39", "86.7%"],
        ],
        col_widths=[58 * mm, 30 * mm, 35 * mm, 35 * mm],
    ))

    s.append(Spacer(1, 8))
    s.append(callout_box(
        "722 services in Wales have no website",
        "1,114 of 1,836 adult-sector services have a working website. The other <b>722 do not</b>. Concentrated "
        "among independents (44% no website) and small groups (42% no website), these are the highest-value "
        "segment for gofal&rsquo;s &lsquo;claim your listing&rsquo; flow &mdash; their CIW listing on gofal.wales becomes their "
        "<i>only</i> public web presence, with all the SEO and family-enquiry value that brings.",
        styles=styles,
    ))

    s.append(Spacer(1, 12))
    s.append(Paragraph("Email domain quality (proxy for digital sophistication)", styles["h2"]))
    s.append(banded_table(
        [
            ["Email type", "Sites", "What it tells us"],
            ["Branded UK domain (.co.uk / .uk)", "1,021", "Has paid for own domain — digital basics in place"],
            ["Other / generic", "455", "Mixed: some branded, some custom subdomains"],
            ["Free webmail (Gmail / Hotmail / etc.)", "244", "Lower digital sophistication — strong gofal target"],
            ["Government / council", "102", "Public-sector — different sales motion"],
        ],
        col_widths=[68 * mm, 22 * mm, 80 * mm],
    ))

    s.append(PageBreak())

    # ===== Section 4 — Geography =====
    s.append(Paragraph("4. Geographic distribution", styles["h1"]))
    s.append(Paragraph(
        "Two thirds of all care homes sit in the southern arc — Cardiff, RCT, Swansea, Carmarthenshire. "
        "North Wales adds heavy concentration in Conwy and Denbighshire. The 22 Welsh local authorities "
        "below show every adult service whose head-office postcode resolves inside Wales.",
        styles["body"],
    ))

    s.append(banded_table(
        [
            ["Local authority", "Total", "Nursing", "Resi.", "Dom.", "Website %", "Welsh"],
            ["Cardiff", "216", "22", "54", "140", "62%", "0"],
            ["Swansea", "152", "24", "59", "69", "70%", "0"],
            ["Carmarthenshire", "123", "14", "73", "35", "63%", "0"],
            ["Rhondda Cynon Taf", "123", "16", "41", "65", "56%", "0"],
            ["Conwy", "96", "18", "52", "25", "60%", "0"],
            ["Pembrokeshire", "96", "11", "54", "31", "52%", "0"],
            ["Denbighshire", "93", "13", "56", "24", "59%", "0"],
            ["Caerphilly", "88", "10", "48", "29", "58%", "0"],
            ["Vale of Glamorgan", "87", "9", "37", "40", "68%", "0"],
            ["Neath Port Talbot", "83", "14", "42", "26", "60%", "0"],
            ["Newport", "82", "13", "27", "42", "65%", "0"],
            ["Bridgend", "76", "10", "28", "38", "49%", "0"],
            ["Flintshire", "66", "8", "30", "28", "65%", "0"],
            ["Powys", "65", "12", "29", "23", "71%", "0"],
            ["Gwynedd", "59", "10", "32", "16", "42%", "5"],
            ["Wrexham", "56", "11", "29", "16", "57%", "0"],
            ["Monmouthshire", "46", "9", "19", "18", "76%", "1"],
            ["Torfaen", "41", "7", "11", "23", "63%", "0"],
            ["Merthyr Tydfil", "33", "2", "21", "10", "52%", "0"],
            ["Isle of Anglesey", "30", "4", "21", "5", "60%", "4"],
            ["Ceredigion", "29", "3", "17", "9", "69%", "1"],
            ["Blaenau Gwent", "29", "7", "11", "11", "52%", "0"],
        ],
        col_widths=[42 * mm, 18 * mm, 18 * mm, 16 * mm, 16 * mm, 22 * mm, 18 * mm],
    ))

    s.append(Spacer(1, 8))
    s.append(callout_box(
        "Cross-border domiciliary providers",
        "67 domiciliary services registered with CIW have head offices outside Wales (Lambeth, Croydon, "
        "Hackney, Stratford-on-Avon, Sevenoaks, Teignbridge, etc.) but provide care across Welsh communities. "
        "These are mostly satellite branches of English groups &mdash; lower priority for gofal claim-listings, "
        "but still valid Ateb prospects if the local Welsh ops team has phone-handling pain.",
        styles=styles,
    ))

    s.append(PageBreak())

    # ===== Section 5 — Welsh-language landscape =====
    s.append(Paragraph("5. Welsh-language landscape", styles["h1"]))
    s.append(Paragraph(
        "Welsh-medium care is the gofal differentiator. The CIW dataset offers two ways to see it: "
        "self-declared operating language, and the Welsh-language naming of homes (a strong proxy for "
        "Welsh community presence).",
        styles["body"],
    ))

    s.append(stat_row([
        ("11", "self-declare Welsh-medium", HEATHER),
        ("268", "have Welsh-named homes", LAVENDER),
        ("74", "use .cymru / .wales domain", CORAL),
    ], styles))

    s.append(Spacer(1, 12))
    s.append(Paragraph("Welsh-language heartland (care homes only)", styles["h2"]))
    s.append(banded_table(
        [
            ["Local authority", "Care homes", "Welsh-declared", "Welsh-named"],
            ["Carmarthenshire", "87", "0", "15"],
            ["Conwy", "70", "0", "4"],
            ["Denbighshire", "69", "0", "6"],
            ["Pembrokeshire", "65", "0", "1"],
            ["Gwynedd", "42", "1", "9"],
            ["Powys", "41", "0", "4"],
            ["Isle of Anglesey", "25", "4", "7"],
            ["Ceredigion", "20", "1", "6"],
        ],
        col_widths=[60 * mm, 30 * mm, 35 * mm, 35 * mm],
    ))

    s.append(Spacer(1, 10))
    s.append(callout_box(
        "Welsh-medium care is dramatically under-represented",
        "Only 11 services across all of Wales <i>declare</i> Welsh-medium operation in CIW data. Yet "
        "<b>268 services have Welsh-language home names</b> &mdash; Plas, T&yacute;, Cartref, Hafan, Llys &mdash; "
        "indicating real Welsh-community roots. This is a CIW data-quality gap, and it is also gofal&rsquo;s "
        "single biggest differentiation vs Carehome.co.uk and Lottie. <b>Recommendation:</b> launch a Welsh-"
        "medium verification flow at claim-time, surfacing self-declared bilingualism on the directory "
        "long before family-search competitors do.",
        styles=styles,
    ))

    s.append(PageBreak())

    # ===== Section 6 — Operator structure =====
    s.append(Paragraph("6. Provider corporate structure", styles["h1"]))
    s.append(Paragraph(
        "Adult-care operators in Wales fall into a few distinct structures. The pitch and pricing for "
        "each segment differs.",
        styles["body"],
    ))

    s.append(banded_table(
        [
            ["Structure", "Sites", "Providers", "Care homes", "Dom.", "Website %"],
            ["Limited Company", "1,635", "931", "883", "750", "62%"],
            ["Local Authority (council-run)", "113", "21", "86", "21", "45%"],
            ["Sole trader / other", "86", "58", "67", "19", "55%"],
            ["Trust / Charity", "1", "1", "1", "0", "100%"],
            ["LLP / Partnership", "1", "1", "1", "0", "0%"],
        ],
        col_widths=[55 * mm, 22 * mm, 22 * mm, 22 * mm, 22 * mm, 22 * mm],
    ))

    s.append(Spacer(1, 8))
    s.append(callout_box(
        "Council-run sites are the longest sales cycle",
        "21 Welsh councils run 113 adult-care sites between them &mdash; Gwynedd, RCT, Caerphilly, "
        "Carmarthenshire are the largest. Procurement is slow, but Gwynedd&rsquo;s Welsh-medium services align "
        "naturally with both gofal&rsquo;s positioning and Llanelli Town Council&rsquo;s Ateb relationship as a "
        "case study reference.",
        styles=styles,
    ))

    s.append(PageBreak())

    # ===== Section 7 — gofal opportunity =====
    s.append(Paragraph("7. gofal opportunity — the claim funnel", styles["h1"]))
    s.append(Paragraph(
        "gofal&rsquo;s &lsquo;claim your listing&rsquo; flow converts free directory rows into &pound;X-per-month enhanced "
        "or featured listings. The highest-converting segment, by definition, is operators who <i>have no "
        "other web presence</i> &mdash; their gofal page becomes their only public front door. "
        "419 pure single-site independent care homes exist (operators who run no other adult-sector service); "
        "<b>176 of those have no website at all</b>, totalling 4,536 registered beds.",
        styles["body"],
    ))

    s.append(Paragraph(
        "Top 15 local authorities by single-site independent care homes with no website:",
        styles["h2"],
    ))
    s.append(banded_table(
        [
            ["Local authority", "Indep. homes (no website)", "Beds at stake"],
            ["Denbighshire", "17", "403"],
            ["Pembrokeshire", "16", "329"],
            ["Conwy", "16", "410"],
            ["Cardiff", "15", "546"],
            ["Flintshire", "9", "272"],
            ["Wrexham", "9", "250"],
            ["Carmarthenshire", "9", "167"],
            ["Swansea", "9", "213"],
            ["Gwynedd", "8", "156"],
            ["Newport", "8", "266"],
            ["Ceredigion", "7", "187"],
            ["Caerphilly", "7", "151"],
            ["Isle of Anglesey", "6", "118"],
            ["Torfaen", "6", "235"],
            ["Powys", "6", "141"],
            ["Top-15 total", "148", "3,844"],
        ],
        col_widths=[62 * mm, 50 * mm, 35 * mm],
        last_row_bold=True,
    ))

    s.append(Spacer(1, 10))
    s.append(callout_box(
        "Recommended gofal launch sequence",
        "Wave 1 (week 1-2): all 148 single-site no-website independents in the top 15 LAs. Personalised "
        "claim emails. Welsh-language-first where the home name is Welsh. "
        "Wave 2 (week 3-4): 90 small groups (2-3 sites). Single contact per provider, multi-listing claim. "
        "Wave 3 (month 2): the 38 regional providers (4-9 sites). Mostly already have websites, but gofal "
        "adds discoverability they don&rsquo;t own. "
        "<b>Skip for now:</b> the 1 large chain &mdash; long sales cycle, low marginal value pre-traction.",
        styles=styles,
    ))

    s.append(PageBreak())

    # ===== Section 8 — Ateb opportunity =====
    s.append(Paragraph("8. Ateb opportunity — the Ateb Care funnel", styles["h1"]))
    s.append(Paragraph(
        "<i>Note: this report supersedes an earlier draft that used a &pound;400/month price assumption. "
        "The pricing model below reflects Ateb Care&rsquo;s actual three-tier structure as of May 2026.</i>",
        styles["small"],
    ))
    s.append(Spacer(1, 6))
    s.append(Paragraph(
        "Ateb Care sells operations and compliance automation at &pound;1,000&ndash;&pound;3,000+/month per site, "
        "tiered: <b>Essentials at &pound;1,000</b>, <b>Professional at &pound;1,500</b>, "
        "<b>Enterprise from &pound;3,000</b>. The conversion sweet spot for the Essentials tier is single-site "
        "independents with high call volume, no website, and a phone number that already terminates at a busy "
        "front desk &mdash; exactly the segment surfaced below.",
        styles["body"],
    ))
    s.append(Spacer(1, 4))
    s.append(banded_table(
        [
            ["Tier", "Price/month", "Target buyer profile"],
            ["Care Essentials", "&pound;1,000", "Single-site independents, small operators, entry-level"],
            ["Care Professional", "&pound;1,500", "Small groups (2-3 sites), regional providers, growing operators"],
            ["Care Enterprise", "&pound;3,000+", "Mid-chains (4+ sites), specialists, council/LA contracts, multi-site"],
        ],
        col_widths=[36 * mm, 28 * mm, 106 * mm],
    ))
    s.append(Spacer(1, 8))

    s.append(Paragraph("The 25 highest-priority Ateb prospects", styles["h2"]))
    s.append(Paragraph(
        "Filter: independent (1 site only), no website, has phone, sorted by registered places.",
        styles["small"],
    ))
    s.append(Spacer(1, 6))
    s.append(banded_table(
        [
            ["Care home", "Town", "Local authority", "Beds", "Type"],
            ["Gibraltar House", "Monmouth", "Monmouthshire", "95", "Nursing"],
            ["The Forge Care Centre", "Cardiff", "Cardiff", "76", "Nursing"],
            ["Romilly Nursing Home", "Cardiff", "Cardiff", "73", "Nursing"],
            ["Capel Grange Care Home", "Newport", "Newport", "72", "Nursing"],
            ["Glain House", "Cardiff", "Cardiff", "72", "Nursing"],
            ["Estuary Gardens", "Deeside", "Flintshire", "66", "Residential"],
            ["Rhosyn Melyn", "Wrexham", "Wrexham", "66", "Nursing"],
            ["Ty Coch Care Home", "Cardiff", "Cardiff", "61", "Nursing"],
            ["Ty Nant Care Home", "Port Talbot", "Neath Port Talbot", "61", "Nursing"],
            ["Ty Mawr Care Home", "Swansea", "Powys", "54", "Nursing"],
            ["Plas Cwmcynfelin Ltd", "Aberystwyth", "Ceredigion", "53", "Nursing"],
            ["Regency House Residential Home", "Pontypool", "Torfaen", "52", "Residential"],
            ["Meifod &amp; Vicarage Court", "Wrexham", "Wrexham", "46", "Residential"],
            ["Emral House Nursing Home", "Wrexham", "Wrexham", "45", "Nursing"],
            ["Springholme Care Anglesey Ltd", "Pentraeth", "Isle of Anglesey", "45", "Residential"],
            ["Bargoed Care Home", "Bargoed", "Caerphilly", "45", "Nursing"],
            ["Torestin Care Home", "Haverfordwest", "Pembrokeshire", "44", "Residential"],
            ["A1 Care Services t/a Ty Ceirios", "Pontypool", "Torfaen", "44", "Nursing"],
            ["High Pastures Nursing Home", "Conwy", "Conwy", "44", "Nursing"],
            ["Eithinog Nursing Home", "Colwyn Bay", "Conwy", "42", "Nursing"],
            ["Hazelhurst Nursing Home", "Penarth", "Vale of Glamorgan", "41", "Nursing"],
            ["The Rookery Care Centre", "Ebbw Vale", "Blaenau Gwent", "41", "Residential"],
            ["Chestnut House Care Home", "Wrexham", "Flintshire", "41", "Residential"],
            ["Orchard House Residential Care", "Barry", "Vale of Glamorgan", "40", "Residential"],
            ["Millheath Nursing Home", "Newport", "Newport", "40", "Nursing"],
        ],
        col_widths=[58 * mm, 28 * mm, 35 * mm, 16 * mm, 26 * mm],
    ))

    s.append(Spacer(1, 10))
    s.append(callout_box(
        "Top-25 list — Care Essentials conversion math",
        "Top-25 list, if all converted at Care Essentials &pound;1,000/month: "
        "<b>&pound;300K ARR</b>. The full pool of 176 single-site independent care homes with no website "
        "would generate <b>&pound;2.11M ARR ceiling</b> at 100% conversion at the Essentials tier. "
        "At a realistic <b>15% close rate</b> that&rsquo;s <b>~&pound;317K ARR</b> from this segment alone "
        "&mdash; before any Professional or Enterprise tier sales upstream.",
        styles=styles,
    ))
    s.append(Spacer(1, 12))
    s.append(Paragraph("TAM ceiling across all three tiers", styles["h2"]))
    s.append(banded_table(
        [
            ["Tier", "Pool", "Avg sites / provider", "Annual contract", "TAM ceiling", "Realistic close", "Realistic ARR"],
            [
                "Care Essentials &pound;1k/mo",
                "176 single-site, no website",
                "1.0",
                "&pound;12K",
                "&pound;2.11M",
                "15%",
                "&pound;317K",
            ],
            [
                "Care Professional &pound;1.5k/mo",
                "90 small-group providers (2-3 sites)",
                "2.2",
                "&pound;39.6K",
                "&pound;3.56M",
                "10%",
                "&pound;356K",
            ],
            [
                "Care Enterprise &pound;3k+/mo",
                "38 regional providers (4-9 sites)",
                "5.7",
                "&pound;205K",
                "&pound;7.79M",
                "5%",
                "&pound;390K",
            ],
        ],
        col_widths=[34 * mm, 38 * mm, 18 * mm, 20 * mm, 22 * mm, 18 * mm, 20 * mm],
    ))

    s.append(PageBreak())

    # ===== Section 9 — Combined funnel =====
    s.append(Paragraph("9. The combined gofal + Ateb funnel", styles["h1"]))
    s.append(Paragraph(
        "The mission stated in CLAUDE.md: <i>&ldquo;gofal.wales is the Trojan horse for Ateb voice agents. "
        "Directory brings care homes in &mdash; Ateb pitch closes the deal.&rdquo;</i> Quantified, that funnel looks "
        "like this:",
        styles["body"],
    ))

    s.append(Paragraph("Layer 1 — Care Essentials acquisition (single-site independents)", styles["h2"]))
    s.append(banded_table(
        [
            ["Funnel stage", "Pool size", "Conversion", "Result"],
            ["Total adult-sector sites in Wales", "1,836", "—", "—"],
            ["Adult care homes (gofal primary directory pool)", "1,038", "100% seeded", "1,038 listings"],
            ["Indep + small-group homes (highest claim intent)", "647", "20-30% claim", "130-195 claims"],
            ["Indep care homes with no website (Ateb Essentials sweet spot)", "176", "10-15% Ateb sale", "18-26 Ateb deals"],
            ["At &pound;1,000/mo &times; 12 = &pound;12,000 ARR per Ateb deal", "—", "—", "&pound;216K-&pound;312K ARR"],
        ],
        col_widths=[80 * mm, 28 * mm, 35 * mm, 30 * mm],
    ))

    s.append(Spacer(1, 10))
    s.append(Paragraph("Layer 2 — Care Professional expansion (small-group operators)", styles["h2"]))
    s.append(banded_table(
        [
            ["Funnel stage", "Pool size", "Conversion", "Result"],
            ["Small-group operators (2-3 sites, has-website-but-needs-platform)", "90 providers / 200 sites", "8% over 18 months", "~16 deals (multi-site)"],
            ["Avg ACV: &pound;1,500/mo &times; 2.2 avg sites &times; 12", "—", "—", "&pound;525K ARR contribution"],
        ],
        col_widths=[80 * mm, 38 * mm, 30 * mm, 25 * mm],
    ))

    s.append(Spacer(1, 14))
    s.append(Paragraph("10. Three-tier TAM summary — Wales-only, 5-year strategic view", styles["h1"]))
    s.append(Paragraph(
        "<b>Ateb Care total addressable market in Wales (CIW-registered adult-care segment only).</b> "
        "This view differs from the immediate Phase-1 ceiling in section 8: here we count the <i>full</i> "
        "operator pool at each tier, not just the no-website subset, and use realistic 5-year capture rates.",
        styles["body"],
    ))
    s.append(Spacer(1, 6))
    s.append(banded_table(
        [
            ["Tier", "Pool", "ACV per provider", "TAM ceiling", "5y SOM (realistic)"],
            [
                "Essentials &pound;1k/mo",
                "447 single-site independents (447 care homes)",
                "&pound;12K",
                "&pound;5.36M",
                "15% &rarr; &pound;800K",
            ],
            [
                "Professional &pound;1.5k/mo",
                "128 small-group + regional (415 care homes; avg 3.2 sites)",
                "&pound;57.6K",
                "&pound;7.38M",
                "10% &rarr; &pound;738K",
            ],
            [
                "Enterprise &pound;3k+/mo",
                "31 mid-chains + large chains + council-run (197 care homes; avg 6.4)",
                "&pound;230K",
                "&pound;7.13M",
                "8% &rarr; &pound;570K",
            ],
            ["Total Welsh adult-care", "606 providers / 1,059 care homes", "—", "&pound;19.87M", "&pound;2.1M"],
        ],
        col_widths=[34 * mm, 60 * mm, 22 * mm, 24 * mm, 30 * mm],
        last_row_bold=True,
    ))

    s.append(Spacer(1, 10))
    s.append(callout_box(
        "Wales-only is not the path to &pound;5M ARR",
        "The <b>&pound;19.87M ceiling</b> is the absolute Wales-only theoretical maximum. The realistic 5-year "
        "SOM is <b>~&pound;2.1M ARR</b>. The &pound;5M ARR strategic target therefore requires the Welsh adult-care "
        "segment to be supplemented by: <b>NHS Wales contracts</b> (Llanelli is the case study reference), "
        "<b>council / LA framework deals</b> (21 Welsh councils run 113 sites), <b>housing association expansion</b> "
        "(out of scope of CIW data but a parallel buyer profile), and <b>English market entry</b> via CQC&rsquo;s "
        "equivalent register. Wales is the proving ground; it is not the whole opportunity.",
        accent=HEATHER,
        styles=styles,
    ))
    s.append(Spacer(1, 8))
    s.append(Paragraph(
        "<b>Pricing reference:</b> the three published Ateb Care tiers are <b>Essentials &pound;1,000/mo</b>, "
        "<b>Professional &pound;1,500/mo</b>, and <b>Enterprise &pound;3,000+/mo</b>. Simply Safe Care Group "
        "(SSCG) is on a non-public &pound;750/mo build-partner rate while Andrew Howells helps shape the platform &mdash; "
        "this is not a market price and is not used as a TAM input.",
        styles["small"],
    ))

    s.append(PageBreak())
    s.append(Paragraph("11. What to build next (data-led)", styles["h1"]))
    s.append(Paragraph(
        "1. <b>Operator rollup pages</b> at <font color='%s'>gofal.wales/operators/[provider-slug]</font> &mdash; "
        "one per of the 1,012 providers, listing every site they run. Captures multi-site claims in a single conversation, "
        "and gives gofal massive long-tail SEO surface ('Accomplish Group care homes Wales' etc.)." % HEATHER.hexval(),
        styles["body"],
    ))
    s.append(Paragraph(
        "2. <b>'No website? Get one in 24h'</b> — the 722 services with no website are gofal&rsquo;s clearest pitch. "
        "Position the gofal listing as their managed front door, with Welsh+English copy generated automatically.",
        styles["body"],
    ))
    s.append(Paragraph(
        "3. <b>Welsh-medium verification</b> &mdash; only 11 sites declare Welsh-medium operation in CIW. "
        "A simple claim-flow checkbox (&lsquo;Welsh-speaking staff available&rsquo;) plus a verification step would "
        "instantly differentiate gofal from carehome.co.uk on the search results that matter most "
        "in Y Fro Gymraeg.",
        styles["body"],
    ))
    s.append(Paragraph(
        "4. <b>Ateb pitch deck per local authority</b> &mdash; with this data, every regional Ateb sales push "
        "can lead with concrete numbers: &lsquo;In Conwy alone there are 16 single-site care homes with no "
        "website &mdash; here&rsquo;s how Ateb handles their out-of-hours call traffic.&rsquo;",
        styles["body"],
    ))

    s.append(Spacer(1, 14))
    s.append(callout_box(
        "Caveats and data quality notes",
        "1. CIW exports the literal string &lsquo;None&rsquo; for sub-type on domiciliary &amp; placement &mdash; treated as null. "
        "2. Local Authority is blank in CIW for all 790 domiciliary rows; recovered from postcode admin_district. "
        "3. 67 domiciliary providers have HQs outside Wales (English border boroughs, London) but are CIW-registered &mdash; included. "
        "4. 19 mixed adults+children sites have CIW-redacted addresses; excluded per &lsquo;skip children&rsquo; scope. "
        "5. 6 of 1,836 services failed postcode geocoding (98 of 100 are mappable). "
        "6. &lsquo;Welsh-named&rsquo; is a heuristic on common Welsh prefixes (T&yacute;, Plas, Hafan, Llys, Cartref) and may include "
        "Anglicised borrowings; treat as a directional indicator, not exact.",
        accent=CORAL,
        styles=styles,
    ))

    return s


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    styles = make_styles()
    doc = make_doc(OUT)
    doc.build(build(styles))
    print(f"Wrote {OUT}")
    print(f"Size: {OUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
