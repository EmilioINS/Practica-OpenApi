from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.infrastructure.security import get_current_user_id
from app.use_cases import stats as stats_uc

router = APIRouter(prefix="/api/v1/stats", tags=["Stats"])

@router.get("")
def get_stats(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Obtener estadísticas reales para el dashboard"""
    return stats_uc.get_dashboard_stats(db)
