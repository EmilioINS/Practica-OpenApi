# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from sqlalchemy import func
from app.infrastructure.orm_models import AlumnoORM, MateriaORM, ExposicionORM, EvaluacionDetalleORM, GrupoORM

def get_dashboard_stats(db: Session):
    total_alumnos = db.query(AlumnoORM).count()
    total_materias = db.query(MateriaORM).count()
    total_exposiciones = db.query(ExposicionORM).count()
    total_grupos = db.query(GrupoORM).count()
    
    # Average score across all evaluation details
    avg_score = db.query(func.avg(EvaluacionDetalleORM.calificacion)).scalar() or 0
    
    # Get latest 5 exposiciones
    latest_expos = db.query(ExposicionORM).order_by(ExposicionORM.fecha.desc()).limit(5).all()
    
    return {
        "alumnos": total_alumnos,
        "materias": total_materias,
        "exposiciones": total_exposiciones,
        "grupos": total_grupos,
        "promedio": round(float(avg_score), 1),
        "ultimasExposiciones": [
            {
                "id": e.id_exposicion,
                "tema": e.tema,
                "fecha": e.fecha.isoformat(),
                "equipo": e.id_equipo
            } for e in latest_expos
        ]
    }
