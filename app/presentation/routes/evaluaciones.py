from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.domain.entities import EvaluacionInput
from app.use_cases import evaluaciones as eval_uc

router = APIRouter(prefix="/api/v1/evaluaciones", tags=["Evaluaciones"])

@router.get("/criterios")
def get_criterios(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Obtener los criterios de evaluación disponibles"""
    return eval_uc.get_criterios(db)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_evaluacion(
    evaluacion: EvaluacionInput,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Registrar evaluación completa mediante rúbrica"""
    eval_uc.create_evaluacion(db, evaluacion)
    return {"message": "Evaluación registrada correctamente"}
