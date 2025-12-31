from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Report

router = APIRouter()

@router.post("/generate/{upload_id}")
def generate_report(
    upload_id: int,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = Report(
        result="AI analysis placeholder",
        user_id=user.id,
        upload_id=upload_id
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {"report_id": report.id, "result": report.result}
