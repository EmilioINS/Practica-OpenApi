from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.domain.entities import LoginRequest, LoginResponse
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.use_cases import auth as auth_use_cases

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Autenticación de usuario"""
    return auth_use_cases.authenticate_user(db, request)

@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    username: str = Depends(get_current_user_id)
):
    """Obtener información del usuario actual"""
    return auth_use_cases.get_current_user_details(db, username)
