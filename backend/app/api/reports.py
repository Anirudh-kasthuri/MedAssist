from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
import uuid

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Report, Upload, User
from app.services.ai_service import generate_medical_report

router = APIRouter(prefix="/reports", tags=["Reports"])


# -------------------------
# RESPONSE SCHEMA
# -------------------------
class GenerateReportResponse(BaseModel):
    report_id: int
    pdf_path: str


# -------------------------
# GET ALL REPORTS
# -------------------------
@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return (
        db.query(Report)
        .filter(Report.user_id == user.id)
        .order_by(Report.created_at.desc())
        .all()
    )


# -------------------------
# GENERATE REPORT
# -------------------------
@router.post(
    "/generate",
    response_model=GenerateReportResponse
)
def generate_report(
    upload_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # 1️⃣ Validate upload
    upload = (
        db.query(Upload)
        .filter(
            Upload.id == upload_id,
            Upload.user_id == user.id
        )
        .first()
    )

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    # 2️⃣ AI text generation
    ai_text = generate_medical_report(upload.filename)

    # 3️⃣ Generate PDF
    os.makedirs("generated_reports", exist_ok=True)
    pdf_name = f"{uuid.uuid4()}.pdf"
    pdf_path = os.path.join("generated_reports", pdf_name)

    c = canvas.Canvas(pdf_path, pagesize=A4)
    text = c.beginText(40, 800)

    text.textLine("Smart Multimodal Medical Assistant")
    text.textLine("--------------------------------")
    text.textLine(f"User ID: {user.id}")
    text.textLine(f"Upload ID: {upload.id}")
    text.textLine("")
    text.textLine("AI Diagnostic Report:")
    text.textLine(ai_text)

    c.drawText(text)
    c.showPage()
    c.save()

    # 4️⃣ Save DB record
    report = Report(
        result=pdf_path,
        user_id=user.id,
        upload_id=upload.id,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # 5️⃣ Correct response
    return {
        "report_id": report.id,
        "pdf_path": pdf_path,
    }
