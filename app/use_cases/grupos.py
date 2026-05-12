from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.infrastructure.orm_models import GrupoORM, MateriaORM, EquipoORM
from app.domain.entities import GrupoInput
from typing import List

def get_grupos(db: Session):
    return db.query(GrupoORM).all()

def get_grupo_details(db: Session, id_grupo: int):
    grupo = db.query(GrupoORM).filter(GrupoORM.id_grupo == id_grupo).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    return {
        "id_grupo": grupo.id_grupo,
        "nombre_grupo": grupo.nombre_grupo,
        "materia": {
            "id_materia": grupo.materia.id_materia,
            "nombre_materia": grupo.materia.nombre_materia,
            "clave_materia": grupo.materia.clave_materia
        },
        "equipos": [
            {
                "id_equipo": e.id_equipo,
                "nombre_equipo": e.nombre_equipo,
                "num_exposiciones": len(e.exposiciones),
                "integrantes": [
                    {
                        "id_alumno": a.id_alumno,
                        "nombre": a.nombre,
                        "matricula": a.matricula
                    } for a in e.integrantes
                ]
            } for e in grupo.equipos
        ]
    }

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
    db.refresh(grupo)
    return grupo
