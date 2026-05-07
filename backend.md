# Backend Guidelines (AI Instructions)

## Objetivo

Construir sistemas robustos, escalables, seguros y mantenibles siguiendo las mejores prácticas actuales.

## Principios Clave

* SOLID
* Clean Architecture
* Domain-Driven Design (DDD)
* Separación de capas
* Escalabilidad horizontal y vertical

## Arquitectura

* Clean Architecture (Controllers, Use Cases, Domain, Infrastructure)
* Hexagonal Architecture (Ports & Adapters)
* Microservices o Monolito modular según necesidad
* API-first design

## Tecnologías Recomendadas

* Lenguajes modernos (Node.js, Python, Go, Java, etc.)
* TypeScript preferido en entornos JS
* Frameworks robustos (NestJS, Spring Boot, FastAPI)

## Estructura del Proyecto

* Separación clara:

  * Controllers
  * Services / Use Cases
  * Repositories
  * Entities / Domain
* Organización basada en dominios (no por tipo)

## Base de Datos

* Uso de ORM/ODM (Prisma, TypeORM, Sequelize, etc.)
* Diseño normalizado
* Indexación adecuada
* Migraciones versionadas

## APIs

* RESTful o GraphQL
* Versionado de APIs
* Validación estricta de datos (DTOs)
* Documentación con OpenAPI/Swagger

## Seguridad

* Autenticación (JWT, OAuth2)
* Autorización basada en roles/permisos
* Protección contra:

  * SQL Injection
  * XSS
  * CSRF
* Rate limiting
* Encriptación de datos sensibles

## Escalabilidad

* Stateless services
* Uso de contenedores (Docker)
* Orquestación (Kubernetes)
* Balanceo de carga
* Cache (Redis)

## Performance

* Optimización de queries
* Uso de caching
* Procesamiento asíncrono (colas: RabbitMQ, Kafka)

## Testing

* Unit Testing
* Integration Testing
* Contract Testing

## Logging y Monitoreo

* Logs estructurados
* Observabilidad (Prometheus, Grafana)
* Alertas automáticas

## DevOps

* CI/CD pipelines
* Infraestructura como código (Terraform)
* Deploy automatizado

## Resiliencia

* Retries
* Circuit breakers
* Graceful degradation

## Reglas para IA

La IA debe:

* Generar código desacoplado y escalable
* Priorizar arquitectura sobre soluciones rápidas
* Aplicar patrones de diseño adecuados
* Detectar posibles cuellos de botella
* Sugerir mejoras de seguridad y rendimiento
* Mantener consistencia en toda la base de código
