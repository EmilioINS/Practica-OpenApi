#  Documentación Técnica Integral y Arquitectura de Software: Sistema de Gestión Académica (Fullstack)

## 1. Resumen Ejecutivo y Visión General del Proyecto
El presente documento constituye la especificación formal, técnica y arquitectónica del Sistema de Gestión Académica. Este ecosistema de software fue diseñado bajo altos estándares de ingeniería para resolver la necesidad de un control académico centralizado, abarcando la administración de materias, la organización de grupos escolares, el padrón general de alumnos, la conformación de equipos de trabajo y un robusto motor de evaluaciones mediante rúbricas dinámicas.

A diferencia de las arquitecturas monolíticas tradicionales, este proyecto ha sido concebido desde su inicio bajo un modelo fuertemente desacoplado, separando de manera definitiva la lógica de negocio (Backend) de la capa de presentación e interacción con el usuario (Frontend). Esta segregación se evidencia en la división del proyecto en dos repositorios o entornos principales:
1. **`Practica_OpenApi_Backend/`**: Un servidor de recursos (Resource Server) expuesto mediante una API RESTful autodescriptiva y estrictamente tipada.
2. **`Practica-OpenApi/` (Frontend)**: Una Single Page Application (SPA) que actúa como cliente web inteligente, capaz de mantener estados de sesión, renderizar dinámicamente el contenido e interactuar asíncronamente con el Backend.

---

## 2. Arquitectura del Sistema y Patrones de Diseño

El sistema está construido siguiendo los preceptos de la **Clean Architecture** (Arquitectura Limpia) acuñada por Robert C. Martin, fusionada con conceptos de **Domain-Driven Design (DDD)**. El objetivo principal de este enfoque es mantener el corazón del sistema (las reglas de negocio) completamente aislado de las herramientas externas (bases de datos, frameworks web o interfaces gráficas). 

### 2.1. Desglose de Capas en el Backend (FastAPI)
El Backend está meticulosamente segmentado en las siguientes capas concéntricas:
- **Capa `core/` (Núcleo de Configuración)**: Actúa como el estrato base de la aplicación. Aquí residen las configuraciones de entorno cargadas a través de `pydantic-settings`, garantizando que la aplicación se configure de acuerdo al entorno de despliegue (Desarrollo, Staging, Producción). También alberga el manejador global de excepciones, interceptando errores genéricos y traduciéndolos en respuestas HTTP semánticamente correctas para no filtrar información sensible del stack trace al cliente.
- **Capa `domain/` (Dominio del Negocio)**: El corazón de la aplicación. Contiene las entidades puras de Python y los contratos o interfaces (Abstract Base Classes). Esta capa no importa absolutamente nada de FastAPI, SQLAlchemy o ninguna otra librería externa. Define *qué* es una Materia, *qué* es un Alumno y *cómo* se estructuran sus datos conceptualmente.
- **Capa `infrastructure/` (Infraestructura y Datos)**: Es la capa de adaptadores. Aquí el sistema interactúa con el mundo físico. Se implementan los modelos ORM de SQLAlchemy que traducen las entidades del dominio en tablas de PostgreSQL. También incluye el control del ciclo de vida de las sesiones de base de datos (`SessionLocal`) y los repositorios concretos que ejecutan las sentencias SQL puras o a través del ORM.
- **Capa `presentation/` (Presentación/Rutas)**: Es la interfaz de entrada del servidor web. Contiene los enrutadores de FastAPI. Su única responsabilidad es recibir peticiones HTTP, des-serializar el JSON entrante usando esquemas de Pydantic, delegar la acción al Caso de Uso correspondiente y devolver un código de estado HTTP adecuado.
- **Capa `use_cases/` (Casos de Uso / Servicios)**: Contiene los flujos de trabajo orquestados. Un caso de uso, por ejemplo "Registrar Evaluación", no sabe de bases de datos ni de peticiones web. Solo sabe que debe recibir los datos de una rúbrica, validar que el evaluador tenga permisos, calcular el promedio, e instruir al repositorio (Infraestructura) para que persista los datos.

### 2.2. Patrón de Diseño en el Frontend
El cliente web está diseñado bajo una arquitectura basada en componentes reactivos. Promueve la filosofía de *Presentational and Container Components*, donde componentes contenedores manejan el estado y la lógica de negocio (peticiones Axios), mientras que los componentes presentacionales se limitan a recibir propiedades (`props`) y renderizar la interfaz pura (HTML/CSS).

---

## 3. Análisis Profundo del Stack Tecnológico

### 3.1. Tecnologías del Servidor (Backend)
- **Lenguaje Base**: Python 3.10+. Python fue seleccionado por su legibilidad, su vasto ecosistema de paquetes y su reciente soporte robusto para el tipado estático (Type Hints), crucial para la mantenibilidad.
- **Framework Web - FastAPI (v0.136.1)**: FastAPI no es solo un marco de desarrollo web, sino un ecosistema impulsado por Starlette (para el enrutamiento y la concurrencia web asíncrona) y Pydantic (para la validación de datos). Destaca por su rendimiento comparable a frameworks de Node.js o Go, y su capacidad de auto-generar documentación OpenAPI 3.0 (Swagger) en tiempo real al analizar el tipado estático de las funciones.
- **Mapeo Objeto-Relacional (ORM) - SQLAlchemy (v2.0.49)**: Considerado el estándar de la industria en Python. SQLAlchemy permite escribir consultas complejas en sintaxis Python segura contra inyecciones SQL. Su versión 2.0 aporta un modelo de ejecución totalmente renovado y un soporte tipado mejorado.
- **Motor de Base de Datos y Adaptador**: PostgreSQL como motor relacional, conectado mediante `psycopg2-binary`, lo que garantiza una comunicación fluida y un soporte transaccional ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad) robusto.
- **Validación de Datos - Pydantic (v2.13.4)**: Motor de parsing y validación basado en el núcleo reescrito en Rust (`pydantic_core`). Transforma diccionarios JSON entrantes en objetos Python validados antes de que lleguen a la lógica de negocio, rechazando automáticamente peticiones malformadas con un error 422 Unprocessable Entity.
- **Seguridad Criptográfica**: 
  - `python-jose`: Implementación de los estándares JSON Object Signing and Encryption.
  - `passlib` & `bcrypt`: El algoritmo bcrypt genera hashes iterativos costosos computacionalmente para proteger las contraseñas, haciéndolas resistentes a ataques de fuerza bruta o de tablas arcoíris.
- **Servidor Web ASGI - Uvicorn**: Uvicorn es un servidor HTTP super-rápido basado en `uvloop` y `httptools`. Sirve como puente entre las peticiones de red TCP/IP y el framework FastAPI.

### 3.2. Tecnologías del Cliente (Frontend)
- **Librería/Framework**: React.js / Next.js. Proveen el concepto de Virtual DOM, que optimiza masivamente el repintado de la pantalla al modificar únicamente los nodos del DOM que sufrieron alteraciones en el estado, logrando experiencias de usuario extremadamente fluidas.
- **Gestión de Estado Global**: Context API para estados ligeros (como el Token de Sesión y el Tema Claro/Oscuro).
- **Cliente HTTP**: Axios o Fetch API. Se configuran con interceptores para inyectar globalmente cabeceras de autorización y centralizar el manejo de respuestas 401 (deslogueando automáticamente al usuario si su token expira).
- **Estilización**: Vanilla CSS con Variables CSS (Custom Properties) para un diseño brutalista o TailwindCSS para un flujo de trabajo basado en utilidades, asegurando que los estilos sean encapsulados y totalmente adaptables (Mobile First).

---

## 4. Ingeniería de Software: Diccionario de Funciones y Endpoints (API)

El backend de FastAPI expone una superficie de API amplia y bien documentada bajo el estándar OpenAPI 3.0.3. A continuación, se detalla el comportamiento algorítmico e ingenieril de cada ruta expuesta:

### 4.1. Módulo de Autenticación y Criptografía (`/auth`)
La seguridad del sistema está construida en torno a Tokens JWT (JSON Web Tokens) de naturaleza "Stateless" (sin estado guardado en memoria del servidor).
- **Ruta:** `POST /auth/login`
- **Mecanismo de Acción**:
  1. El cliente envía un payload JSON (`LoginRequest`) con `username` (matrícula) y `password`.
  2. Pydantic intercepta la petición y verifica que ambos campos sean cadenas de texto no vacías. Si falla, retorna `422`.
  3. El endpoint invoca al Caso de Uso de Autenticación. El ORM (`infrastructure`) busca el registro en la tabla de usuarios. Si no existe, se aborta con `401 Unauthorized`.
  4. Se extrae el hash Bcrypt de la base de datos y se compara contra el password ingresado.
  5. Si el emparejamiento es positivo, se utiliza `python-jose` para generar un payload que contiene el `sub` (Subject/Id del usuario) y `exp` (Fecha de expiración). Se firma este payload con la clave secreta del servidor (guardada en variables de entorno `.env`) usando el algoritmo HS256.
  6. El cliente recibe un `LoginResponse` que contiene el token encriptado y sus segundos de validez.

### 4.2. Catálogo de Materias (`/materias`)
- **Ruta:** `GET /materias`
- **Mecanismo de Acción**:
  1. Diseñado para alta escalabilidad, este endpoint jamás devuelve la tabla entera. Requiere los parámetros de consulta `page` y `size`.
  2. El Caso de Uso inyecta sentencias de compensación (OFFSET) y límite (LIMIT) en SQLAlchemy basadas en la paginación solicitada.
  3. Incorpora un parámetro opcional `nombre`. Si está presente, SQLAlchemy concatena una cláusula `WHERE nombre_materia ILIKE '%termino%'` para búsquedas insensibles a mayúsculas.
  4. El servidor realiza una consulta secundaria con `COUNT()` para devolver el número de `totalElements` y calcular `totalPages`, vitales para construir la barra de paginación en el Frontend.
  5. Retorna un objeto complejo estructurado bajo el schema `PagedMaterias`.

### 4.3. Padrón Estudiantil (`/alumnos`)
- **Ruta:** `POST /alumnos`
- **Mecanismo de Acción**:
  1. Recibe un `AlumnoInput` (matrícula, nombre, correo). La librería `email-validator` conectada a Pydantic realiza una verificación de sintaxis sobre el formato del correo e incluso busca resoluciones DNS de MX para asegurar que el dominio de correo existe.
  2. El ORM efectúa una consulta preventiva: `SELECT id FROM alumnos WHERE matricula = X OR correo = Y`. Si se encuentra un registro, el flujo se detiene levantando una excepción controlada que se traduce en un error HTTP `409 Conflict`.
  3. De superar la validación, el nuevo objeto es persistido en la base de datos de PostgreSQL y la API responde con un `201 Created` retornando el `Alumno` recién creado, incluyendo su nueva clave primaria auto-incremental.
- **Ruta:** `GET /alumnos`
  - Algoritmo similar al catálogo de materias, proveyendo paginación y protección contra saturación de memoria.

### 4.4. Estructura de Grupos Escolares (`/grupos`)
- **Ruta:** `POST /grupos`
- **Mecanismo de Acción**:
  1. El payload `GrupoInput` recibe el `nombre_grupo` y la `id_materia` a la que pertenece.
  2. Se instaura una restricción de integridad referencial obligatoria (Foreign Key constraint). El Caso de Uso verifica previamente si la `id_materia` existe en el catálogo.
  3. SQLAlchemy mapea la relación uno a muchos (One-To-Many) entre las entidades Materia y Grupo.

### 4.5. Configuración de Equipos (`/equipos`)
- Este submódulo representa uno de los retos relacionales más complejos. Modela la relación Muchos a Muchos (Many-To-Many) entre la tabla de `alumnos` y la tabla de `equipos` a través de una tabla intermedia o asociativa `alumno_equipo`. Esto permite que un equipo esté conformado por múltiples alumnos y que, en un contexto hipotético, un alumno pertenezca a varios equipos en diferentes materias.

### 4.6. Logística de Exposiciones (`/exposiciones`)
- **Ruta:** `GET /exposiciones`
- **Mecanismo de Acción**:
  1. Recupera las fechas programadas en formato `YYYY-MM-DD`.
  2. A nivel de infraestructura, SQLAlchemy ejecuta un Eager Loading (usando `joinedload`) para hacer un JOIN SQL y traer en la misma petición la información anidada del equipo que va a exponer. Esto previene el infame problema de rendimiento conocido como "N+1 Queries" (donde se realizaría una consulta por exposición para encontrar su equipo).

### 4.7. Motor de Calificación por Rúbricas (`/evaluaciones`)
- **Ruta:** `POST /evaluaciones`
- **Mecanismo de Acción (Transaccional)**:
  1. El endpoint más denso de la API. Recibe un árbol JSON `EvaluacionInput` conteniendo el evaluador, la exposición y un arreglo de objetos `detalles` (que consisten en `id_criterio` y su `calificacion` flotante entre 0.0 y 10.0 validada con `Field(ge=0, le=10)` de Pydantic).
  2. **Atomicidad SQL**: Al involucrar múltiples inserciones, se abre una transacción estricta (`db.begin()`). 
  3. Se inserta el encabezado en la tabla `evaluaciones`.
  4. Se iteran los detalles de la rúbrica y se insertan masivamente en la tabla `detalles_evaluacion`.
  5. Si el servidor colapsa a mitad de este proceso o si un detalle no cumple con una restricción Check Constraint de PostgreSQL, se dispara un `db.rollback()`. Ningún dato parcial queda guardado.
  6. Si finaliza sin errores, ejecuta un `db.commit()` y hace permanentes los registros.

### 4.8. Agregación de Métricas - Dashboard (`/stats`)
- **Ruta:** `GET /stats`
- **Mecanismo de Acción**:
  1. Destinado a la pantalla inicial del administrador. 
  2. En lugar de descargar todos los registros a la memoria RAM de Python y contarlos usando `len(lista)`, el Caso de Uso instruye al motor PostgreSQL para que realice el trabajo pesado.
  3. Ejecuta sentencias nativas como `SELECT COUNT(id) FROM alumnos` o `SELECT AVG(calificacion) FROM detalles_evaluacion`. El resultado se consolida en milisegundos y se devuelve en un objeto unificado, permitiendo pintar gráficos estadísticos en el frontend al instante.

---

## 5. Dinámica y Flujos de Experiencia de Usuario (Frontend UX/UI)

El frontend actúa como la cara de esta compleja arquitectura. Su diseño no solo debe ser estético, sino robusto en el manejo de estados de la red. A continuación, se detallan los lineamientos técnicos que rigen la implementación de las vistas:

### 5.1. Protección Perimetral de Rutas e Interceptores
El ciclo de vida de la aplicación comienza en el Gestor de Sesión. React Router (o su equivalente) implementa "Guardias de Ruta" (Route Guards). Si un usuario anónimo intenta escribir `http://localhost:3000/dashboard` en la URL, el sistema inspecciona el Contexto de React o el LocalStorage en busca del Token JWT. Al no encontrarlo, o si está expirado, redirige forzosamente hacia `/login`. 

Simultáneamente, la configuración de la librería Axios incluye Interceptores de Petición. Esto significa que antes de que el navegador dispare cualquier llamada asíncrona hacia el Backend, Axios clona la petición e inyecta la cabecera `Authorization: Bearer <TOKEN>`. Esto evita tener que escribir esta lógica repetitivamente en docenas de archivos.

### 5.2. Módulo de Tablas y Paginación Inteligente
Vistas como `/alumnos` o `/materias` muestran componentes de tablas avanzadas. Bajo ningún escenario se debe obtener la base de datos completa. El componente Tabla inicializa su estado interno `currentPage` en 0. Al montar el componente (`useEffect`), llama a la ruta `GET /materias?page=0&size=10`.
La respuesta de FastAPI contendrá el campo `totalElements`. El Frontend usa este número para generar dinámicamente los botones de las páginas (Ej: "Página 1 de 5"). Al hacer clic en "Página 2", el estado muta y dispara otra petición aislada por los siguientes 10 registros.

### 5.3. Interfaz de Evaluación (Rúbrica Dinámica)
La pantalla de Calificación es un formulario altamente dinámico. El frontend realiza primero una petición a la API para obtener el catálogo de "Criterios de Rúbrica". Basado en este arreglo, React itera mediante un mapa (`array.map()`) y renderiza un componente *Slider* o *Input Number* por cada criterio en la pantalla.
Cada componente se enlaza a un gestor de estado complejo (como `useReducer` o `react-hook-form`). Al presionar "Guardar Evaluación", el frontend consolida estos valores dispersos en un único JSON anidado que empata exactamente con la firma requerida por el esquema `EvaluacionInput` de Pydantic, y lo envía mediante método POST.

### 5.4. Resiliencia de Red y Manejo de Errores Visuales
El sistema asume que la red no es confiable. 
- **Estados de Carga (Loading States)**: Siempre que una petición HTTP se encuentre pendiente, la vista entra en estado bloqueado. Se renderizan indicadores circulares (spinners) en los botones para prevenir múltiples clics accidentales. Para la carga inicial de vistas, se utilizan *Skeletons* (Cajas grises animadas con CSS) que imitan el esqueleto visual de los datos por venir, disminuyendo la percepción de lentitud del usuario.
- **Error Boundaries**: Si el backend devuelve un código 4xx (Error de cliente) o 5xx (Falla del servidor), Axios atrapa el error y la interfaz despliega un componente tipo *Toast Notification* en la esquina de la pantalla. Este Toast leerá inteligentemente el campo `message` de la estructura `ErrorResponse` definida en la API y se la mostrará al usuario (Ej: "La matrícula ingresada ya pertenece a otro estudiante"), brindando claridad absoluta sobre el incidente.

---

## 6. Estructura de Seguridad y Autorización
La seguridad es el pilar de la gestión académica. La decisión de usar **JSON Web Tokens (JWT)** proporciona beneficios inmensos:
1. **Firma Irrepudiable**: El JWT incluye una tercera parte que es una firma criptográfica. Si un atacante altera el Payload del token para modificar su "rol" de alumno a administrador, la firma resultante no coincidirá con la del servidor FastAPI, y el Middleware del backend rechazará inmediatamente la conexión con `401 Unauthorized`.
2. **Expiración de Sesión Corta**: Para aminorar las consecuencias del robo de un token (Ataques XSS), el tiempo de vida (TTL) del JWT se configura para caducar rápidamente. En sistemas más complejos, esto se complementa con un mecanismo de *Refresh Tokens*.
3. **CORS Restringido**: El `CORSMiddleware` en FastAPI está configurado para que, en etapa de producción, rechace cualquier petición *Pre-flight* (OPTIONS) que no provenga estrictamente de la URL de producción del Frontend, mitigando ataques CSRF (Cross-Site Request Forgery).

---

## 7. Modelado de Datos Entidad-Relación (DER)
Las entidades reflejadas en las tablas SQL se relacionan lógicamente para sostener la semántica escolar:
- **`Materia` (1) --- (N) `Grupo`**: Una materia puede ser impartida a varios grupos, pero un grupo específico estudia solo esa materia.
- **`Grupo` (1) --- (N) `Equipos`**: Los estudiantes dentro de un grupo se dividen en equipos de trabajo.
- **`Alumnos` (N) --- (N) `Equipos`**: Relación mediada. Un equipo tiene muchos integrantes, y un integrante pertenece a dicho equipo.
- **`Equipo` (1) --- (N) `Exposiciones`**: Un equipo tiene asignada una fecha y un tema específico.
- **`Exposición` (1) --- (N) `Evaluaciones`**: Una presentación puede ser calificada múltiples veces, y cada calificación tiene desgloses en su `DetalleEvaluacion` basado en diferentes métricas (ej. Fluidez, Presentación Visual, Dominio del Tema).

---

## 8. Ingeniería de Despliegue y Ciclo de Vida del Desarrollo (Git)

### 8.1. Estrategia de Ramas: GitFlow Robusto
Dada la magnitud del proyecto al constar de dos partes autónomas, ambos repositorios (`Practica_OpenApi_Backend` y `Practica-OpenApi`) deben obedecer un estricto manejo del control de versiones usando la filosofía **GitFlow**:
- **Rama `main`**: Es sagrada. Representa el código en Producción. Todo lo que reside aquí debe ser compilable y estar libre de errores reportados. Nunca se hace commit directo a `main`.
- **Rama `develop`**: Es el integrador principal. A medida que las funciones se van terminando, se fusionan aquí. Es la base para construir los entornos de prueba.
- **Ramas de Funcionalidad (`feature/*`)**: Cada vez que un desarrollador toma una tarea (ej. Crear el CRUD de materias), bifurca desde `develop` creando `feature/crud-materias`. Trabaja de forma aislada y una vez finalizado, abre un Pull Request/Merge Request para ser revisado por un colega (Code Review) antes de integrarlo de vuelta a `develop`.
- **Ramas de Resolución Rápida (`hotfix/*`)**: Ramas de emergencia que nacen desde `main` exclusivamente para solucionar un bug destructivo en producción.

### 8.2. Convención Semántica de Commits
Para generar historiales (changelogs) automáticamente y permitir búsquedas eficientes en el pasado, el equipo usa Conventional Commits. La sintaxis obliga a declarar la naturaleza del cambio:
- `feat(auth): implementar protección del JWT en las rutas de React`
- `fix(evaluacion): solucionar rollback fallido al recibir calificacion negativa`
- `refactor(db): optimizar consulta SQL de stats reduciendo n+1 queries`
- `docs(readme): expandir de forma masiva el documento de arquitectura`

### 8.3. Versionamiento Semántico (SemVer)
Ambos sistemas evolucionan bajo números de versión `MAYOR.MENOR.PARCHE` (ej. `v1.2.5`).
Si el Backend modifica una ruta, rompiendo la forma en la que el Frontend consumía los datos, se trata de una ruptura de compatibilidad y debe actualizar el número MAYOR (`v2.0.0`). Si simplemente se añade el módulo de Evaluaciones, incrementa el MENOR (`v1.3.0`). Si se corrige un bug ortográfico en un campo de la base de datos, incrementa el PARCHE (`v1.3.1`).

---

## 9. Conclusión de la Arquitectura
El desarrollo del Sistema de Gestión Académica presenta un ecosistema altamente cohesionado en la lógica de negocio y levemente acoplado a nivel de componentes de software. La decisión de separar un Backend REST purista en FastAPI de un Frontend declarativo moderno, sumado al uso de metodologías profesionales como GitFlow, Clean Architecture, validación estática vía Pydantic y autorización sin estado vía JWT, resulta en una plataforma extremadamente segura, fácilmente escalable a futuro, y altamente tolerable a fallas. 

Esta documentación certifica los lineamientos que deben de seguir tanto los ingenieros enfocados a la persistencia de datos y desarrollo backend, como los diseñadores de producto y programadores de frontend.


