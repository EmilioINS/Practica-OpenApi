from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.infrastructure.orm_models import EvaluacionORM, EvaluacionDetalleORM, ExposicionORM, AlumnoORM, CriterioEvaluacionORM
from app.domain.entities import EvaluacionInput

def create_evaluacion(db: Session, eval_in: EvaluacionInput):
    if not db.query(ExposicionORM).filter(ExposicionORM.id_exposicion == eval_in.id_exposicion).first():
        raise HTTPException(status_code=400, detail="Exposición no encontrada")
        
    if not db.query(AlumnoORM).filter(AlumnoORM.id_alumno == eval_in.id_alumno_evaluador).first():
        raise HTTPException(status_code=400, detail="Alumno evaluador no encontrado")
        
    # Check if already evaluated
    existing_eval = db.query(EvaluacionORM).filter(
        EvaluacionORM.id_exposicion == eval_in.id_exposicion,
        EvaluacionORM.id_alumno_evaluador == eval_in.id_alumno_evaluador
    ).first()
    
    if existing_eval:
        raise HTTPException(status_code=409, detail="El alumno ya evaluó esta exposición")
        
    nueva_evaluacion = EvaluacionORM(
        id_exposicion=eval_in.id_exposicion,
        id_alumno_evaluador=eval_in.id_alumno_evaluador,
        comentarios=eval_in.comentarios
    )
    db.add(nueva_evaluacion)
    db.flush() # To get the id_evaluacion
    
    for detalle in eval_in.detalles:
        if not db.query(CriterioEvaluacionORM).filter(CriterioEvaluacionORM.id_criterio == detalle.id_criterio).first():
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Criterio {detalle.id_criterio} no encontrado")
            
        nuevo_detalle = EvaluacionDetalleORM(
            id_evaluacion=nueva_evaluacion.id_evaluacion,
            id_criterio=detalle.id_criterio,
            calificacion=detalle.calificacion
        )
        db.add(nuevo_detalle)
        
    db.commit()
