from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import os
import shutil

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.services.audio_service import transcribe_audio

router = APIRouter(prefix="/audio", tags=["Audio"])

AUDIO_DIR = "uploads/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)


@router.post("/transcribe")
def transcribe(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # 1️⃣ Save audio file
        file_path = os.path.join(AUDIO_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2️⃣ Transcribe audio
        transcript = transcribe_audio(file_path)

        return {
            "filename": file.filename,
            "transcript": transcript
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
