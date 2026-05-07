from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import date

# Auth
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    expiresIn: int

# Materias
class MateriaBase(BaseModel):
    clave_materia: str
    nombre_materia: str

class Materia(MateriaBase):
    id_materia: int

    class Config:
        from_attributes = True

class PagedMaterias(BaseModel):
    content: List[Materia]
    totalElements: int
    totalPages: int

# Alumnos
class AlumnoBase(BaseModel):
    matricula: str
    nombre: str
    correo: EmailStr

class AlumnoInput(AlumnoBase):
    password: Optional[str] = None # Added for auth

class Alumno(AlumnoBase):
    id_alumno: int

    class Config:
        from_attributes = True

# Grupos
class GrupoInput(BaseModel):
    nombre_grupo: str
    id_materia: int

# Exposiciones
class Exposicion(BaseModel):
    id_exposicion: int
    tema: str
    fecha: date
    id_equipo: int

    class Config:
        from_attributes = True

# Evaluaciones
class EvaluacionDetalleInput(BaseModel):
    id_criterio: int
    calificacion: float = Field(..., ge=0, le=10)

class EvaluacionInput(BaseModel):
    id_exposicion: int
    id_alumno_evaluador: int
    comentarios: str
    detalles: List[EvaluacionDetalleInput]
