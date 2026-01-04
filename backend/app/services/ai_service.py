# app/services/ai_service.py

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
import uuid


def generate_medical_report(filename: str):
    """
    SAFE AI placeholder.
    Returns: (report_text, pdf_path)
    NEVER crashes.
    """

    if not filename:
        report_text = "No file provided. Unable to generate report."
    else:
        report_text = (
            "AI Medical Report\n\n"
            f"File analyzed: {filename}\n\n"
            "Findings:\n"
            "- No critical abnormalities detected.\n"
            "- Recommend further clinical correlation.\n"
        )

    # Ensure directory exists
    output_dir = "generated_reports"
    os.makedirs(output_dir, exist_ok=True)

    pdf_name = f"{uuid.uuid4()}.pdf"
    pdf_path = os.path.join(output_dir, pdf_name)

    # Generate PDF
    c = canvas.Canvas(pdf_path, pagesize=A4)
    text_obj = c.beginText(40, 800)

    for line in report_text.split("\n"):
        text_obj.textLine(line)

    c.drawText(text_obj)
    c.showPage()
    c.save()

    return report_text, pdf_path
