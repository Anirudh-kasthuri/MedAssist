<<<<<<< HEAD
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
=======
from transformers import pipeline

# Load model once at startup
_generator = pipeline(
    "text-generation",
    model="distilgpt2"
)

def generate_medical_report(input_text: str) -> str:
    """
    Deterministic medical-style report generator.
    Free, local, interview-safe.
    """

    text = input_text.lower()

    findings = []
    diagnosis = []
    recommendations = []

    if "fever" in text:
        findings.append("Elevated body temperature")
        diagnosis.append("Possible infection")

    if "cough" in text:
        findings.append("Persistent cough")
        diagnosis.append("Upper respiratory condition")

    if "chest pain" in text:
        findings.append("Chest discomfort")
        diagnosis.append("Cardiac or pulmonary evaluation required")
        recommendations.append("Immediate clinical assessment advised")

    if not findings:
        findings.append("No significant abnormal findings detected")

    if not recommendations:
        recommendations.append("Follow up with a physician if symptoms persist")

    report = f"""
CLINICAL SUMMARY
----------------
Findings:
- {"; ".join(findings)}

Assessment:
- {"; ".join(diagnosis) if diagnosis else "No definitive diagnosis"}

Recommendations:
- {"; ".join(recommendations)}
"""

    return report.strip()
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
