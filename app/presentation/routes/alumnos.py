from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.domain.entities import Alumno, AlumnoInput
from app.use_cases import alumnos as alumnos_uc

router = APIRouter(prefix="/api/v1/alumnos", tags=["Alumnos"])

@router.get("", response_model=List[Alumno])
def get_alumnos(
    page: int = 0,
    size: int = 10,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Listar alumnos paginados"""
    return alumnos_uc.get_alumnos(db, page, size)

@router.get("/available", response_model=List[Alumno])
def get_available_alumnos(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Listar alumnos que no están en ningún equipo"""
    return alumnos_uc.get_available_alumnos(db)

@router.post("", response_model=Alumno, status_code=status.HTTP_201_CREATED)
def create_alumno(
    alumno: AlumnoInput,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Registrar un nuevo alumno"""
    return alumnos_uc.create_alumno(db, alumno)

@router.put("/{id_alumno}/assign/{id_equipo}")
def assign_to_equipo(
    id_alumno: int,
    id_equipo: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Asignar un alumno a un equipo"""
    return alumnos_uc.assign_alumno_to_equipo(db, id_alumno, id_equipo)

@router.delete("/{id_alumno}/unassign")
def unassign_from_equipo(
    id_alumno: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Remover un alumno de su equipo actual"""
    return alumnos_uc.remove_alumno_from_equipo(db, id_alumno)
