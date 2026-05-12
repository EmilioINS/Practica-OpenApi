from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.domain.entities import Exposicion, ExposicionInput
from app.use_cases import exposiciones as exposiciones_uc

router = APIRouter(prefix="/api/v1/exposiciones", tags=["Exposiciones"])

@router.get("", response_model=List[Exposicion])
def get_exposiciones(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Listar exposiciones programadas"""
    return exposiciones_uc.get_exposiciones(db)

@router.post("", response_model=Exposicion, status_code=status.HTTP_201_CREATED)
def create_exposicion(
    exposicion: ExposicionInput,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Programar una nueva exposición"""
    return exposiciones_uc.create_exposicion(db, exposicion)
