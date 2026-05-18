# Sistema de Exposiciones - Frontend React

Este proyecto implementa el frontend para la gestión de materias, alumnos, grupos, exposiciones y rúbricas de evaluación, permitiendo a los usuarios interactuar con el sistema a través de una interfaz moderna y responsiva.

## Tecnologías Utilizadas
- **Framework:** React 19 con Vite
- **Enrutamiento:** React Router DOM
- **Cliente HTTP:** Axios
- **Animaciones:** Framer Motion
- **Notificaciones:** Sonner
- **Estilos:** CSS / Componentes (Tailwind-merge, clsx)

## Arquitectura y Estructura
El código fuente en `src/` está estructurado de la siguiente manera:
- `api/`: Configuración de Axios e interceptores para peticiones al backend.
- `assets/`: Recursos estáticos como imágenes e íconos.
- `components/`: Componentes reutilizables de la interfaz de usuario.
- `context/`: Proveedores de estado global de la aplicación (ej. autenticación).
- `pages/`: Vistas principales de la aplicación (Dashboard, Login, Materias, etc.).

## Historial de Trabajo y Uso de Ramas

El desarrollo de este frontend se realizó utilizando un flujo de control de versiones basado en *Feature Branches*, separando la implementación por vistas y funcionalidades específicas de la interfaz. A continuación, se presenta la evidencia del trabajo en ramas y su historial de integración:

```text
* c040eab (HEAD -> feature/dashboard-panel, main, feature/materias-alumnos, feature/login-auth, feature/exposiciones-evaluaciones, develop) arreglos frontend
* 89f1598 Cambios para despliegue
* db70daa Agrega vercel.json para routing de React Router
* 93619e8 chore: eliminar backend del repositorio, mantener solo frontend
* 6998154 Se implemento el frontend
* c93efb6 docs: crear README con evidencia de historial en ramas
```

**Módulos desarrollados por rama:**
1. **`feature/login-auth`**: Implementación de pantallas de inicio de sesión, integración de autenticación JWT con el backend y protección de rutas privadas.
2. **`feature/materias-alumnos`**: Desarrollo de interfaces para gestionar y consultar el catálogo de Alumnos, Materias y Grupos.
3. **`feature/exposiciones-evaluaciones`**: Creación de la interfaz para la consulta de exposiciones y el formulario interactivo para el registro de las rúbricas de evaluación.
4. **`feature/dashboard-panel`**: Implementación del panel central (Dashboard) para la navegación, visualización de métricas generales y ruteo de la aplicación.

## Instalación y Ejecución

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Configura tus variables de entorno creando un archivo `.env` en la raíz de la carpeta `frontend` basado en `.env.example`. Debe incluir la URL base de tu backend:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Accede a la aplicación desde tu navegador, usualmente en `http://localhost:5173`.
