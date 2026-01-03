from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Report, Upload, User
from app.services.ai_service import generate_medical_report
from app.core.redis import redis_client
from app.api.rate_limit import rate_limiter


router = APIRouter(prefix="/reports", tags=["Reports"])


class GenerateReportResponse(BaseModel):
    report_id: int
    pdf_path: str


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


@router.post(
        "/generate", 
        response_model=GenerateReportResponse,
        dependencies=[Depends(rate_limiter("generate_report"))]
)
def generate_report(
    upload_id: int,
    db: Session = Depends(get_db),
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
        .first()
    )

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    ai_result, pdf_path = generate_medical_report(upload.filename)

    report = Report(
        result=ai_result,
        user_id=user.id,
        upload_id=upload.id
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    redis_client.setex(cache_key, 3600, pdf_path)

    return {
        "report_id": report.id,
        "pdf_path": pdf_path
    }
