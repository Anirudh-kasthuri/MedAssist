import os

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:oracle@localhost:5432/medassist"
)
<<<<<<< HEAD
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
=======
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
