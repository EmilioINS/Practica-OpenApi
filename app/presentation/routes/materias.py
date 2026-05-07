from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.domain.entities import PagedMaterias
from app.use_cases import materias as materias_uc
from typing import Optional

router = APIRouter(prefix="/api/v1/materias", tags=["Materias"])

@router.get("", response_model=PagedMaterias)
def get_materias(
    page: int = Query(0, description="Página actual"),
    size: int = Query(10, description="Tamaño de página"),
    nombre: Optional[str] = Query(None, description="Filtrar materias por nombre"),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id) 
):
    """Listar materias con paginación"""
    return materias_uc.get_materias(db, page, size, nombre)
