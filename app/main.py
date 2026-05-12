# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.database import engine, Base
from app.infrastructure import orm_models # Para que SQLAlchemy registre los modelos
from app.presentation.routes import auth, materias, alumnos, grupos, exposiciones, evaluaciones, stats

# Create tables in DB if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Sistema de Exposiciones",
    description="API REST para la gestión de materias, grupos, equipos y evaluaciones con rúbrica.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(materias.router)
app.include_router(alumnos.router)
app.include_router(grupos.router)
app.include_router(exposiciones.router)
app.include_router(evaluaciones.router)
app.include_router(stats.router)

@app.get("/")
def root():
    return {"message": "API Sistema de Exposiciones en ejecución"}
