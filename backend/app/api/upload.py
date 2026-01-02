from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.db.models import Upload
from app.services.image_service import analyze_medical_image

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "uploads/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/image")
def upload_image(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1️⃣ Save file to disk
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2️⃣ Run image analysis (CLIP)
    image_analysis = analyze_medical_image(file_path)

    # 3️⃣ Save upload record
    upload = Upload(
        filename=file.filename,
        user_id=user.id
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)

    # 4️⃣ Return response
    return {
        "upload_id": upload.id,
        "filename": upload.filename,
        "image_analysis": image_analysis
    }
