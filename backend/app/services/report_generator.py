from app.services.ai_service import AIService

ai = AIService()

def generate_medical_report(filename: str) -> dict:
    base_report = ai.generate_report(filename)

    base_report.update({
        "findings": ["Normal scan"],
        "assessment": "Low risk",
        "recommendation": "No action required"
    })

    return base_report
