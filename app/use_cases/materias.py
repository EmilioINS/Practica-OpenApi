from sqlalchemy.orm import Session
from app.infrastructure.orm_models import MateriaORM
from app.domain.entities import Materia, PagedMaterias, MateriaBase
from typing import Optional
from fastapi import HTTPException

def get_materias(db: Session, page: int = 0, size: int = 10, nombre: Optional[str] = None) -> PagedMaterias:
    query = db.query(MateriaORM)
    if nombre:
        query = query.filter(MateriaORM.nombre_materia.ilike(f"%{nombre}%"))
    
    total_elements = query.count()
    total_pages = (total_elements + size - 1) // size
    
    materias_orm = query.offset(page * size).limit(size).all()
    
    content = [Materia.model_validate(m) for m in materias_orm]
    
    return PagedMaterias(
        content=content,
        totalElements=total_elements,
        totalPages=total_pages
    )

def create_materia(db: Session, materia_in: MateriaBase) -> Materia:
    existing = db.query(MateriaORM).filter(MateriaORM.clave_materia == materia_in.clave_materia).first()
    if existing:
        raise HTTPException(status_code=400, detail="La clave de la materia ya existe")
    
    materia = MateriaORM(**materia_in.model_dump())
    db.add(materia)
    db.commit()
    db.refresh(materia)
    return Materia.model_validate(materia)

def update_materia(db: Session, id_materia: int, materia_in: MateriaBase) -> Materia:
    materia = db.query(MateriaORM).filter(MateriaORM.id_materia == id_materia).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    for key, value in materia_in.model_dump().items():
        setattr(materia, key, value)
    
    db.commit()
    db.refresh(materia)
    return Materia.model_validate(materia)

def delete_materia(db: Session, id_materia: int):
    materia = db.query(MateriaORM).filter(MateriaORM.id_materia == id_materia).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    db.delete(materia)
    db.commit()
    return True
