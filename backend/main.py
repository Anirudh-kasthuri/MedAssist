from fastapi import FastAPI
from app.api import auth, upload, reports, health
from app.api import audio
from app.api import auth_google


app = FastAPI()

app.include_router(auth.router)
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(reports.router)   # prefix already inside router
app.include_router(health.router)
app.include_router(audio.router, prefix="/audio", tags=["Audio"])
app.include_router(auth_google.router)

