from sqlalchemy.orm import Session
from app.infrastructure.orm_models import ExposicionORM
from app.domain.entities import Exposicion, ExposicionInput
from typing import List

def get_exposiciones(db: Session) -> List[Exposicion]:
    expos_orm = db.query(ExposicionORM).all()
    return [Exposicion.model_validate(e) for e in expos_orm]

def create_exposicion(db: Session, expo_in: ExposicionInput) -> Exposicion:
    expo = ExposicionORM(**expo_in.model_dump())
    db.add(expo)
    db.commit()
    db.refresh(expo)
    return Exposicion.model_validate(expo)
