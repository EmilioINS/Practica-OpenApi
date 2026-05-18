# 📚 Documentación del Proyecto Frontend

Basado en el backend desarrollado en FastAPI ("Análisis y Diseño de Software basado en OpenAPI").

## 🎯 Objetivo General
Desarrollar la interfaz de usuario (Frontend) para el sistema de gestión académica, consumiendo la API REST construida en FastAPI. Se implementarán las mejores prácticas de desarrollo, experiencia de usuario (UX) e interfaces de usuario (UI).

## 📱 Contenido de la Aplicación (Rutas y Módulos)

El frontend contará con las siguientes secciones principales:

1. **Login**: Autenticación de usuarios mediante credenciales.
2. **Dashboard**: Panel principal con resumen de métricas (número de materias, grupos activos, próximas exposiciones).
3. **Materias**: Gestión del catálogo de materias.
4. **Grupos**: Asignación de alumnos y materias a grupos específicos.
5. **Alumnos**: Padrón de estudiantes.
6. **Equipos**: Formación de equipos de trabajo dentro de los grupos.
7. **Exposiciones**: Programación y seguimiento de exposiciones por equipo.
8. **Evaluaciones**: Sistema de calificación para las exposiciones.

---

## ⚡ Requerimientos del Sistema

### Funcionales
- **Inicio de sesión**: Autenticación segura basada en tokens (JWT) provistos por FastAPI.
- **CRUD de materias**: Crear, Leer, Actualizar y Eliminar registros de materias.
- **Evaluación con rúbrica dinámica**: Interfaz para calificar exposiciones usando criterios y puntajes dinámicos que provengan del backend.
- **Roles y permisos**: Restricción de acceso a vistas y acciones dependiendo del rol del usuario autenticado (ej. Administrador, Profesor, Alumno).

### Experiencia de Usuario (UX) e Interfaz (UI)
- **Formularios con validación**: Validación en tiempo real de los datos introducidos (ej. campos obligatorios, formato de correos) antes de ser enviados a la API.
- **Tabla paginada con filtros**: Listados de datos (alumnos, grupos, materias) con barra de búsqueda, filtrado por columnas y paginación para manejar volúmenes grandes de información.
- **Manejo de errores API**: Captura de errores HTTP (4xx, 5xx) y presentación amigable al usuario en lugar de mostrar errores técnicos.
- **Estados vacíos**: Mensajes e ilustraciones visualmente agradables cuando no hay datos registrados en el sistema (ej. "Aún no has creado ninguna materia").
- **Confirmaciones**: Ventanas modales de advertencia antes de realizar acciones destructivas, como eliminar un registro.
- **Responsive**: Diseño completamente adaptable a dispositivos móviles, tablets y monitores de escritorio.
- **Sidebar + Navbar**: Sistema de navegación intuitivo con menú lateral (Sidebar) para los módulos y barra superior (Navbar) para información de perfil y cierre de sesión.
- **Toasts**: Notificaciones flotantes temporales para dar retroalimentación sobre acciones (ej. "El alumno se ha registrado con éxito").
- **Loading states**: Uso de *spinners* o *skeletons* durante la carga asíncrona de datos para indicar al usuario que el sistema está trabajando.
- **Accesibilidad**: Uso correcto de contrastes, tamaños legibles y etiquetas semánticas (HTML5/ARIA) para asegurar que el sistema pueda ser usado por cualquier persona.

---

## 🏗️ Requisitos de Organización del Proyecto

### 1. Gestión de Repositorios
- **Separación de responsabilidades**: Es un requisito fundamental mantener **un repositorio exclusivo para el Backend (FastAPI)** y **un repositorio completamente separado para este Frontend**.

### 2. Estrategia de Ramas (Branching)
El equipo deberá trabajar con un flujo de ramas estructurado. Se recomienda **GitFlow** o **GitHub Flow**:
- `main` / `master`: Rama principal con código estable y listo para producción.
- `develop`: Rama de integración donde se unen las funcionalidades en desarrollo.
- `feature/[nombre-caracteristica]`: Ramas creadas a partir de *develop* para trabajar en funcionalidades específicas (ej. `feature/crud-materias`).
- `fix/[nombre-correccion]`: Para solucionar errores o bugs específicos.

### 3. Convención de Commits
Adoptar **Conventional Commits** para mantener un historial claro en el repositorio:
- `feat:` Para una nueva funcionalidad (ej. `feat: agregar tabla paginada de alumnos`).
- `fix:` Para corregir un error (ej. `fix: validación de contraseña en el login`).
- `docs:` Para cambios en la documentación (como este README).
- `style:` Para cambios visuales o de formato en el código.
- `refactor:` Para reestructuración de código sin cambiar su comportamiento.

### 4. Versionado
Se aplicará el formato de **Semantic Versioning (SemVer)** con la estructura `MAYOR.MENOR.PARCHE` (ej. `v1.0.0`):
- **Parche**: Cuando se hacen correcciones de bugs retrocompatibles.
- **Menor**: Cuando se agregan funcionalidades retrocompatibles.
- **Mayor**: Cuando se realizan cambios que rompen la compatibilidad con versiones anteriores.

### 5. Participación del Equipo
- **Obligatoriedad**: La participación de todos los integrantes del equipo es estricta y obligatoria.
- **Evidencia**: El trabajo de cada integrante debe reflejarse en los repositorios a través de commits, pull requests y revisión de código.

---

## 📄 Exportación a PDF
> **Nota para el equipo:** Este archivo es el README base para cumplir con el requisito del PDF.

Para generar el PDF de este documento:
1. Si usas **Visual Studio Code**, instala la extensión **"Markdown PDF"** de *yzane*.
2. Abre este archivo en el editor.
3. Haz clic derecho y selecciona **"Markdown PDF: Export (pdf)"**.
4. ¡Listo! Se generará el PDF descargable automáticamente.
