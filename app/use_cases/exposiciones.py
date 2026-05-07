from sqlalchemy.orm import Session
from app.infrastructure.orm_models import ExposicionORM
from app.domain.entities import Exposicion
from typing import List

def get_exposiciones(db: Session) -> List[Exposicion]:
    expos_orm = db.query(ExposicionORM).all()
    return [Exposicion.model_validate(e) for e in expos_orm]
