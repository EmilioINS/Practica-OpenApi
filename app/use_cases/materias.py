from sqlalchemy.orm import Session
from app.infrastructure.orm_models import MateriaORM
from app.domain.entities import Materia, PagedMaterias
from typing import Optional

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
