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
