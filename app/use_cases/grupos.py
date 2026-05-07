from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.infrastructure.orm_models import GrupoORM, MateriaORM
from app.domain.entities import GrupoInput

def create_grupo(db: Session, grupo_in: GrupoInput):
    materia = db.query(MateriaORM).filter(MateriaORM.id_materia == grupo_in.id_materia).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
        
    grupo = GrupoORM(
        nombre_grupo=grupo_in.nombre_grupo,
        id_materia=grupo_in.id_materia
    )
    db.add(grupo)
    db.commit()
