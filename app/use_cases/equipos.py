from sqlalchemy.orm import Session
from app.infrastructure.orm_models import EquipoORM
from app.domain.entities import EquipoInput, Equipo
from typing import List

def get_equipos(db: Session) -> List[Equipo]:
    equipos_orm = db.query(EquipoORM).all()
    return [Equipo.model_validate(e) for e in equipos_orm]

def get_equipos_by_grupo(db: Session, id_grupo: int) -> List[Equipo]:
    equipos_orm = db.query(EquipoORM).filter(EquipoORM.id_grupo == id_grupo).all()
    return [Equipo.model_validate(e) for e in equipos_orm]

def create_equipo(db: Session, equipo_in: EquipoInput) -> Equipo:
    equipo = EquipoORM(**equipo_in.model_dump())
    db.add(equipo)
    db.commit()
    db.refresh(equipo)
    return Equipo.model_validate(equipo)
