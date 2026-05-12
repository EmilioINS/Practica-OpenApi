from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.domain.entities import Equipo, EquipoInput
from app.use_cases import equipos as equipos_uc

router = APIRouter(prefix="/api/v1/equipos", tags=["Equipos"])

@router.get("", response_model=List[Equipo])
def get_equipos(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Listar todos los equipos"""
    return equipos_uc.get_equipos(db)

@router.get("/grupo/{id_grupo}", response_model=List[Equipo])
def get_equipos_by_grupo(
    id_grupo: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Listar equipos de un grupo específico"""
    return equipos_uc.get_equipos_by_grupo(db, id_grupo)

@router.post("", response_model=Equipo, status_code=status.HTTP_201_CREATED)
def create_equipo(
    equipo: EquipoInput,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Registrar un nuevo equipo"""
    return equipos_uc.create_equipo(db, equipo)
