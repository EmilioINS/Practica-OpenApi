from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.infrastructure.orm_models import AlumnoORM, Usuario
from app.infrastructure.security import get_password_hash
from app.domain.entities import AlumnoInput, Alumno
from typing import List

def get_alumnos(db: Session, page: int = 0, size: int = 10) -> List[Alumno]:
    alumnos_orm = db.query(AlumnoORM).offset(page * size).limit(size).all()
    return [Alumno.model_validate(a) for a in alumnos_orm]

def create_alumno(db: Session, alumno_in: AlumnoInput) -> Alumno:
    # Validate uniqueness
    if db.query(AlumnoORM).filter(AlumnoORM.matricula == alumno_in.matricula).first():
        raise HTTPException(status_code=400, detail="Matrícula ya registrada")
    if db.query(AlumnoORM).filter(AlumnoORM.correo == alumno_in.correo).first():
        raise HTTPException(status_code=400, detail="Correo ya registrado")
        
    usuario = None
    if alumno_in.password:
        if db.query(Usuario).filter(Usuario.username == alumno_in.matricula).first():
            raise HTTPException(status_code=400, detail="Usuario ya existe para esta matrícula")
        usuario = Usuario(
            username=alumno_in.matricula,
            hashed_password=get_password_hash(alumno_in.password)
        )
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        
    alumno = AlumnoORM(
        matricula=alumno_in.matricula,
        nombre=alumno_in.nombre,
        correo=alumno_in.correo,
        id_usuario=usuario.id if usuario else None
    )
    db.add(alumno)
    db.commit()
    db.refresh(alumno)
    return Alumno.model_validate(alumno)
