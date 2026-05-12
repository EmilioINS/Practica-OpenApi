from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.infrastructure.orm_models import AlumnoORM, Usuario, EquipoORM
from app.infrastructure.security import get_password_hash
from app.domain.entities import AlumnoInput, Alumno
from typing import List

def get_alumnos(db: Session, page: int = 0, size: int = 10) -> List[Alumno]:
    alumnos_orm = db.query(AlumnoORM).offset(page * size).limit(size).all()
    return [Alumno.model_validate(a) for a in alumnos_orm]

def get_available_alumnos(db: Session) -> List[Alumno]:
    # Alumnos not currently in an equipo
    alumnos_orm = db.query(AlumnoORM).filter(AlumnoORM.id_equipo == None).all()
    return [Alumno.model_validate(a) for a in alumnos_orm]

def create_alumno(db: Session, alumno_in: AlumnoInput) -> Alumno:
    if db.query(AlumnoORM).filter(AlumnoORM.matricula == alumno_in.matricula).first():
        raise HTTPException(status_code=400, detail="Matrícula ya registrada")
    if db.query(AlumnoORM).filter(AlumnoORM.correo == alumno_in.correo).first():
        raise HTTPException(status_code=400, detail="Correo ya registrado")
        
    usuario = None
    if alumno_in.password:
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
        id_usuario=usuario.id if usuario else None,
        id_equipo=alumno_in.id_equipo
    )
    db.add(alumno)
    db.commit()
    db.refresh(alumno)
    return Alumno.model_validate(alumno)

def assign_alumno_to_equipo(db: Session, id_alumno: int, id_equipo: int):
    alumno = db.query(AlumnoORM).filter(AlumnoORM.id_alumno == id_alumno).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    equipo = db.query(EquipoORM).filter(EquipoORM.id_equipo == id_equipo).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
        
    alumno.id_equipo = id_equipo
    db.commit()
    return {"message": "Alumno asignado al equipo exitosamente"}

def remove_alumno_from_equipo(db: Session, id_alumno: int):
    alumno = db.query(AlumnoORM).filter(AlumnoORM.id_alumno == id_alumno).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    alumno.id_equipo = None
    db.commit()
    return {"message": "Alumno removido del equipo"}
