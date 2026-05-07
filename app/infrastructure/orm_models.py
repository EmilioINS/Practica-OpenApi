from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class MateriaORM(Base):
    __tablename__ = "materias"
    id_materia = Column(Integer, primary_key=True, index=True)
    clave_materia = Column(String, unique=True, index=True)
    nombre_materia = Column(String)
    
    grupos = relationship("GrupoORM", back_populates="materia")

class AlumnoORM(Base):
    __tablename__ = "alumnos"
    id_alumno = Column(Integer, primary_key=True, index=True)
    matricula = Column(String, unique=True, index=True)
    nombre = Column(String)
    correo = Column(String, unique=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    
    usuario = relationship("Usuario")

class GrupoORM(Base):
    __tablename__ = "grupos"
    id_grupo = Column(Integer, primary_key=True, index=True)
    nombre_grupo = Column(String)
    id_materia = Column(Integer, ForeignKey("materias.id_materia"))
    
    materia = relationship("MateriaORM", back_populates="grupos")
    equipos = relationship("EquipoORM", back_populates="grupo")

class EquipoORM(Base):
    __tablename__ = "equipos"
    id_equipo = Column(Integer, primary_key=True, index=True)
    nombre_equipo = Column(String)
    id_grupo = Column(Integer, ForeignKey("grupos.id_grupo"))
    
    grupo = relationship("GrupoORM", back_populates="equipos")
    exposiciones = relationship("ExposicionORM", back_populates="equipo")

class ExposicionORM(Base):
    __tablename__ = "exposiciones"
    id_exposicion = Column(Integer, primary_key=True, index=True)
    tema = Column(String)
    fecha = Column(Date)
    id_equipo = Column(Integer, ForeignKey("equipos.id_equipo"))
    
    equipo = relationship("EquipoORM", back_populates="exposiciones")
    evaluaciones = relationship("EvaluacionORM", back_populates="exposicion")

class CriterioEvaluacionORM(Base):
    __tablename__ = "criterios_evaluacion"
    id_criterio = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String)

class EvaluacionORM(Base):
    __tablename__ = "evaluaciones"
    id_evaluacion = Column(Integer, primary_key=True, index=True)
    id_exposicion = Column(Integer, ForeignKey("exposiciones.id_exposicion"))
    id_alumno_evaluador = Column(Integer, ForeignKey("alumnos.id_alumno"))
    comentarios = Column(Text)
    
    exposicion = relationship("ExposicionORM", back_populates="evaluaciones")
    detalles = relationship("EvaluacionDetalleORM", back_populates="evaluacion")

class EvaluacionDetalleORM(Base):
    __tablename__ = "evaluaciones_detalles"
    id_detalle = Column(Integer, primary_key=True, index=True)
    id_evaluacion = Column(Integer, ForeignKey("evaluaciones.id_evaluacion"))
    id_criterio = Column(Integer, ForeignKey("criterios_evaluacion.id_criterio"))
    calificacion = Column(Float)
    
    evaluacion = relationship("EvaluacionORM", back_populates="detalles")
    criterio = relationship("CriterioEvaluacionORM")
