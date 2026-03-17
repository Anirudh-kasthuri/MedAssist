from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel

from google.oauth2 import id_token
from google.auth.transport import requests

from app.db.session import get_db
from app.db.models import User
from app.core.security import create_access_token
from app.core.config import GOOGLE_CLIENT_ID

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

class RegisterRequest(BaseModel):
    username: str
    password: str


class RegisterResponse(BaseModel):
    id: int
    username: str


class LoginRequest(BaseModel):
    username: str
    password: str


class GoogleLoginRequest(BaseModel):
    token: str


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.username == data.username).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        username=data.username,
        password_hash=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username
        }
    }



@router.post("/google")
def google_login(
    data: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    try:
        payload = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )

    email = payload.get("email")
    name = payload.get("name", "google_user")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account has no email"
        )

    user = db.query(User).filter(User.username == email).first()

    if not user:
        user = User(
            username=email,
            password_hash="GOOGLE_OAUTH"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "name": name,
            "oauth": True
        }
    }
