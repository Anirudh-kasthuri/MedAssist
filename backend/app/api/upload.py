from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import os
import shutil
import traceback
import uuid

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Upload
from app.services.image_service import analyze_medical_image

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = "uploads/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/image")
def upload_image(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:

        ext = os.path.splitext(file.filename)[1]
        filename = str(uuid.uuid4()) + ext
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_analysis = analyze_medical_image(file_path)

        upload = Upload(
            filename=filename,
            user_id=user.id
        )

        db.add(upload)
        db.commit()
        db.refresh(upload)

        return image_analysis

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Image analysis failed"
        )
