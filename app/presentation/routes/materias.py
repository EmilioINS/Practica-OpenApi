from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.domain.entities import PagedMaterias, Materia, MateriaBase
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

@router.post("", response_model=Materia, status_code=status.HTTP_201_CREATED)
def create_materia(
    materia: MateriaBase,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Crear una nueva materia"""
    return materias_uc.create_materia(db, materia)

@router.put("/{id_materia}", response_model=Materia)
def update_materia(
    id_materia: int,
    materia: MateriaBase,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Actualizar una materia existente"""
    return materias_uc.update_materia(db, id_materia, materia)

@router.delete("/{id_materia}")
def delete_materia(
    id_materia: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Eliminar una materia"""
    materias_uc.delete_materia(db, id_materia)
    return {"message": "Materia eliminada con éxito"}
