# 📚 Documentación General del Sistema: Gestión Académica

## 📖 Descripción del Proyecto
Este documento presenta la arquitectura, requerimientos y lineamientos para el desarrollo integral del sistema de gestión académica. El proyecto es un ecosistema completo dividido en dos partes principales que deben convivir conectadas:
1. **Backend (API REST)**: Desarrollado en la práctica "Análisis y Diseño de Software basado en OpenAPI" utilizando FastAPI.
2. **Frontend (Aplicación Web)**: Desarrollo de la interfaz gráfica de usuario para consumir e interactuar con el backend.

---

## 🏗️ Arquitectura del Sistema

### ⚙️ 1. Backend (FastAPI)
La capa de lógica de negocios y acceso a datos.
- **Framework**: FastAPI (Python).
- **Documentación API**: Estructurado basado en el estándar OpenAPI (Swagger UI).
- **Módulos Principales de la API**:
  - Gestión de **Materias** (CRUD).
  - Gestión de **Grupos**.
  - Padrón de **Alumnos**.
  - Formación de **Equipos**.
  - Programación de **Exposiciones**.
  - Sistema de **Evaluaciones**.
- **Seguridad**: Autenticación y Autorización para la protección de rutas.

### 💻 2. Frontend
La capa de presentación que consumirá los endpoints generados por OpenAPI en FastAPI.
- **Responsabilidad**: Interacción fluida con el usuario.
- **Módulos a implementar**:
  - **Login**: Pantalla de inicio de sesión conectada con la autenticación del backend.
  - **Dashboard**: Panel principal con métricas e indicadores generales.
  - **Materias**: Listado y administración del catálogo de materias.
  - **Grupos**: Vista para organizar materias y alumnos.
  - **Alumnos**: Directorio y control de estudiantes.
  - **Equipos**: Creación y asignación de integrantes por grupo.
  - **Exposiciones**: Calendario o panel para las exposiciones programadas.
  - **Evaluaciones**: Interfaz de calificación por rúbrica dinámica.

---

## ⚡ Requerimientos Técnicos y UX/UI (Enfoque Frontend)

El desarrollo del frontend debe cumplir estrictamente con los siguientes requisitos:

- **Inicio de sesión**: Flujo de autenticación completo manejando el token del backend.
- **CRUD de materias**: Capacidad de Crear, Leer, Actualizar y Eliminar.
- **Formularios con validación**: Validación robusta en el cliente antes de enviar la petición a la API.
- **Tabla paginada con filtros**: Manejo eficiente de grandes volúmenes de datos (búsqueda y ordenamiento).
- **Evaluación con rúbrica dinámica**: Sistema flexible que se adapte a los criterios establecidos en el backend.
- **Manejo de errores API**: Captura de errores (ej. 400, 401, 500) y presentación de mensajes claros al usuario (evitando pantallas en blanco).
- **Estados vacíos**: Interfaces agradables para indicar que no hay datos (ej. "No hay alumnos registrados").
- **Confirmaciones**: Modales de seguridad antes de acciones críticas (ej. borrado de información).
- **Responsive**: Adaptabilidad total a móviles, tablets y monitores grandes.
- **Sidebar + Navbar**: Sistema de navegación global del sistema.
- **Roles y permisos**: Restricción de secciones visuales dependiendo del usuario logueado.
- **Toasts**: Alertas flotantes y sutiles para retroalimentación (ej. "Guardado correctamente").
- **Loading states**: Spinners o skeletons que indiquen carga al esperar respuestas de la API.
- **Accesibilidad**: Contrastes adecuados y soporte para navegación accesible.

---

## 🛠️ Requisitos de Organización del Proyecto

El equipo de desarrollo debe adherirse a los siguientes estándares para ambas partes del proyecto:

### 1. Gestión de Repositorios (Carpetas Separadas)
- **Aislamiento**: Es obligatorio realizar **un repositorio para backend y un repositorio para frontend por separado**. Cada carpeta vivirá en su propio entorno, conectándose únicamente a través de peticiones HTTP (API).

### 2. Estrategia de Ramas (Branching)
Se utilizará una estrategia estructurada en ambos repositorios para evitar conflictos:
- `main` o `master`: Código totalmente estable y probado (Producción).
- `develop`: Rama central para integrar todos los nuevos cambios.
- `feature/[nombre]`: Ramas individuales para cada funcionalidad nueva (ej. `feature/login-frontend` o `feature/crud-backend`).
- `fix/[nombre]`: Ramas para corregir bugs detectados.

### 3. Convención de Commits
Adoptar **Conventional Commits** para generar un historial semántico en GitHub/GitLab:
- `feat:` Para agregar una nueva funcionalidad.
- `fix:` Para reparar un error.
- `docs:` Para actualizar documentación.
- `style:` Para cambios estéticos en el código que no alteran la lógica.
- `refactor:` Para reestructurar el código sin añadir nuevas funciones.

### 4. Versionado
Manejo de versiones mediante **SemVer** (Semantic Versioning - `MAYOR.MENOR.PARCHE`):
- **Mayor (1.x.x)**: Cambios que rompen funcionalidades anteriores.
- **Menor (x.1.x)**: Nuevas características retrocompatibles.
- **Parche (x.x.1)**: Arreglo de errores pequeños.

### 5. Dinámica de Trabajo en Equipo
- La participación de **todos los integrantes es obligatoria**.
- Debe existir evidencia equitativa del trabajo de cada persona mediante commits en los historiales de ambos repositorios (Frontend y Backend).

---

## 📄 ¿Cómo exportar esta documentación a PDF?
Como parte de los requisitos, este archivo debe poder descargarse en formato PDF:
1. En **Visual Studio Code**, instala la extensión **"Markdown PDF"** (creada por *yzane*).
2. Abre este archivo de Markdown.
3. Haz clic derecho sobre el documento y selecciona **"Markdown PDF: Export (pdf)"**.
4. Se generará un PDF limpio y formateado listo para entregarse.
