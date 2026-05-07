from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.domain.entities import LoginRequest, LoginResponse
from app.infrastructure.orm_models import Usuario
from app.infrastructure.security import verify_password, create_access_token
from app.core.config import settings
from datetime import timedelta

def authenticate_user(db: Session, request: LoginRequest) -> LoginResponse:
    user = db.query(Usuario).filter(Usuario.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return LoginResponse(
        token=access_token,
        expiresIn=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
