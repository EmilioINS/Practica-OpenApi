from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from app.infrastructure.orm_models import Usuario, AlumnoORM
from app.infrastructure.security import verify_password, create_access_token
from app.domain.entities import LoginRequest, LoginResponse
from datetime import timedelta

ACCESS_TOKEN_EXPIRE_MINUTES = 1440

def authenticate_user(db: Session, request: LoginRequest):
    user = db.query(Usuario).filter(Usuario.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    alumno = db.query(AlumnoORM).filter(AlumnoORM.id_usuario == user.id).first()
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # The security utility expects subject as the first positional argument
    access_token = create_access_token(
        subject=user.username,
        expires_delta=access_token_expires
    )
    
    return {
        "token": access_token,
        "expiresIn": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "username": user.username,
        "role": "ADMIN" if not alumno else "STUDENT",
        "id_alumno": alumno.id_alumno if alumno else None
    }

def get_current_user_details(db: Session, username: str):
    user = db.query(Usuario).filter(Usuario.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    alumno = db.query(AlumnoORM).filter(AlumnoORM.id_usuario == user.id).first()
    
    return {
        "id": user.id,
        "username": user.username,
        "role": "ADMIN" if not alumno else "STUDENT",
        "id_alumno": alumno.id_alumno if alumno else None
    }
