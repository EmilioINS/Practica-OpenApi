# API Sistema de Exposiciones - Backend FastAPI

Este proyecto implementa el backend para la gestión de materias, alumnos, grupos, exposiciones y rúbricas de evaluación, basado en una arquitectura **Clean Architecture**.

## Tecnologías Utilizadas
- **Framework:** FastAPI (Python 3)
- **Base de Datos:** PostgreSQL (Supabase)
- **ORM:** SQLAlchemy
- **Autenticación:** JWT (JSON Web Tokens)
- **Documentación API:** OpenAPI / Swagger (accesible en `/docs`)

## Arquitectura y Estructura (Clean Architecture)
El código fuente en `app/` está estructurado de la siguiente manera:
- `core/`: Configuraciones centralizadas y variables de entorno (`.env`).
- `domain/`: Entidades de negocio (esquemas y validaciones de Pydantic).
- `infrastructure/`: Modelos de la base de datos (SQLAlchemy) y lógica de seguridad (generación de hashes y JWT).
- `presentation/`: Controladores/Rutas de FastAPI que exponen los endpoints.
- `use_cases/`: La lógica central de negocio que conecta las rutas con la infraestructura.

## Historial de Trabajo y Uso de Ramas

El desarrollo de este sistema se realizó utilizando un flujo de control de versiones basado en *Feature Branches*, separando la implementación por capas funcionales. A continuación, se presenta la evidencia del trabajo en ramas y cómo fueron integradas al `main`:

```text
* 147e3c4 (HEAD -> main, origin/main, origin/HEAD) chore: ignorar archivos sensibles y caches de python
* f9117da fix: instalar dependencias requeridas por pydantic EmailStr
* 925966f (feature/exposiciones-evaluaciones) feat: implementar dominios de exposiciones y evaluaciones
* 79575d2 (feature/materias-alumnos) feat: implementar dominios de materias, alumnos y grupos
* d6f891f (feature/auth) feat: implementar autenticación JWT
* eb8f66d (feature/init-setup) feat: inicializar proyecto FastAPI con Clean Architecture y configuración de DB
* c255076 first commit
```

**Módulos desarrollados por rama:**
1. **`feature/init-setup`**: Configuración de entorno, conexión a Supabase y configuración de SQLAlchemy.
2. **`feature/auth`**: Implementación de seguridad, utilidades para contraseñas seguras (Bcrypt) y endpoints de inicio de sesión (`/api/v1/auth/login`).
3. **`feature/materias-alumnos`**: Casos de uso y rutas para gestionar catálogos y registro de Alumnos, Materias y Grupos.
4. **`feature/exposiciones-evaluaciones`**: Lógica para agendar exposiciones y registro de rúbricas de evaluación (previniendo evaluaciones duplicadas).

## Instalación y Ejecución

1. Activa tu entorno virtual:
   ```bash
   source venv/bin/activate
   ```
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Configura tus variables de entorno creando un archivo `.env` en la raíz de `backend/` basado en la configuración necesaria (ver `app/core/config.py`). Debe incluir tu conexión `DATABASE_URL` usando el *Connection Pooler* de Supabase (puerto 6543, IPv4).
4. Ejecuta el servidor:
   ```bash
   uvicorn app.main:app --reload --port 8080
   ```
