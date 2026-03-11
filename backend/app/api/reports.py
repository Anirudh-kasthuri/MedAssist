from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
<<<<<<< HEAD
=======
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
import uuid
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Report, Upload, User
from app.services.ai_service import generate_medical_report
<<<<<<< HEAD
from app.core.redis import redis_client
from app.api.rate_limit import rate_limiter

=======
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366

router = APIRouter(prefix="/reports", tags=["Reports"])


<<<<<<< HEAD
=======
# -------------------------
# RESPONSE SCHEMA
# -------------------------
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
class GenerateReportResponse(BaseModel):
    report_id: int
    pdf_path: str


<<<<<<< HEAD
=======
# -------------------------
# GET ALL REPORTS
# -------------------------
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
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


<<<<<<< HEAD
@router.post(
        "/generate", 
        response_model=GenerateReportResponse,
        dependencies=[Depends(rate_limiter("generate_report"))]
=======
# -------------------------
# GENERATE REPORT
# -------------------------
@router.post(
    "/generate",
    response_model=GenerateReportResponse
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
)
def generate_report(
    upload_id: int,
    db: Session = Depends(get_db),
<<<<<<< HEAD
    user: User = Depends(get_current_user)
):
    cache_key = f"report:{user.id}:{upload_id}"

    cached_pdf = redis_client.get(cache_key)
    if cached_pdf:
        return {
            "report_id": -1,
            "pdf_path": cached_pdf
        }

    upload = (
        db.query(Upload)
        .filter(Upload.id == upload_id, Upload.user_id == user.id)
=======
    user: User = Depends(get_current_user),
):
    # 1️⃣ Validate upload
    upload = (
        db.query(Upload)
        .filter(
            Upload.id == upload_id,
            Upload.user_id == user.id
        )
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
        .first()
    )

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

<<<<<<< HEAD
    ai_result, pdf_path = generate_medical_report(upload.filename)

    report = Report(
        result=ai_result,
        user_id=user.id,
        upload_id=upload.id
=======
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
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
    )

    db.add(report)
    db.commit()
    db.refresh(report)

<<<<<<< HEAD
    redis_client.setex(cache_key, 3600, pdf_path)

    return {
        "report_id": report.id,
        "pdf_path": pdf_path
=======
    # 5️⃣ Correct response
    return {
        "report_id": report.id,
        "pdf_path": pdf_path,
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
    }
