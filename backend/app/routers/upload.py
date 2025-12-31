from fastapi import APIRouter, UploadFile, File, Depends
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

@router.post("/{file_type}")
async def upload_file(
    file_type: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    return {
        "filename": file.filename,
        "file_type": file_type,
        "uploaded_by": current_user.id
    }
