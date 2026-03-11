from fastapi import FastAPI
from app.api import auth, upload, reports, health
from app.api import audio
<<<<<<< HEAD
from app.api import auth_google

=======
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366

app = FastAPI()

app.include_router(auth.router)
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(reports.router)   # prefix already inside router
app.include_router(health.router)
app.include_router(audio.router, prefix="/audio", tags=["Audio"])
<<<<<<< HEAD
app.include_router(auth_google.router)
=======
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366

