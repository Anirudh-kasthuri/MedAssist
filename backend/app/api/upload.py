from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Upload

router = APIRouter()

@router.post("/image")
def upload_image(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload = Upload(
        filename=file.filename,
        user_id=user.id
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)

    return {"upload_id": upload.id, "filename": upload.filename}
