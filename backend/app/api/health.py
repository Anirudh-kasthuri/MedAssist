from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("/ping")
def ping():
    return {"status": "ok"}
