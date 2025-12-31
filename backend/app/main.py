from fastapi import FastAPI

from app.api import auth, upload, reports, health

app = FastAPI(title="Smart Multimodal Medical Assistant")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(health.router, tags=["Health"])
