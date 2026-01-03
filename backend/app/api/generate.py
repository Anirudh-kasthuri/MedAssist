from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Upload, Report
from app.api.schemas.report import GenerateRequest, GenerateResponse

router = APIRouter(prefix="/generate", tags=["Generate"])


@router.post(
    "/generate",
    response_model=GenerateReportResponse
)
def generate_report(
    upload_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
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

    ai_result = generate_medical_report(upload.filename)

    report = Report(
        result=ai_result,
        user_id=user.id,
        upload_id=upload.id
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "report_id": report.id,
        "pdf_path": f"generated_reports/report_{report.id}.pdf"
    }

    data: GenerateRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    upload = db.query(Upload).filter(
        Upload.id == data.upload_id,
        Upload.user_id == user.id
    ).first()

    if not upload:
        raise HTTPException(
            status_code=404,
            detail="Upload not found"
        )

    # Placeholder AI logic (will be replaced later)
    result_text = "Analysis completed successfully"

    report = Report(
        result=result_text,
        user_id=user.id,
        upload_id=upload.id
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "report_id": report.id,
        "result": report.result
    }
