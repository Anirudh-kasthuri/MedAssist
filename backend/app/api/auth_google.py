from fastapi import APIRouter, HTTPException
import requests

from fastapi import Depends
from app.db.session import get_db
from app.db.models import User
from app.core.security import create_access_token
from app.core.config import GOOGLE_CLIENT_ID

router = APIRouter(prefix="/auth/google", tags=["Auth"])


@router.post("/login")
def google_login(token: str, db=Depends(get_db)):
    # 1. Verify token with Google
    res = requests.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": token}
    )

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    data = res.json()

    if data["aud"] != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Token audience mismatch")

    email = data["email"]

    # 2. Create or fetch user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            email=email,
            oauth_provider="google"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 3. Issue YOUR JWT
    jwt_token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": jwt_token,
        "token_type": "bearer"
    }
