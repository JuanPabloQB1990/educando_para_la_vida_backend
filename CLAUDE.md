# Backend - Sistema Gestión Académica

## Descripción General
Backend REST API profesional y robusto para la institución educativa "Educando Para La Vida", desarrollado bajo arquitectura limpia por capas y TypeScript estricto.

Responsable de: Autenticación/Autorización (RBAC), Gestión Académica, Ciclos de Matrículas, Control Financiero (Obligaciones y Pagos), Gestión Documental, Notas, Asistencias y módulo de Classroom.

## Especificaciones Técnicas del Backend:
- **Sin ORM:** Solo se permiten consultas SQL nativas y parametrizadas usando placeholders (`$1` o `?`). Prohibida la interpolación de strings en SQL.
- **Conexión:** Uso mandatorio de un Pool de conexiones (vía driver nativo).
- **Mapeo:** Transformación obligatoria de `snake_case` (DB) a `camelCase` (TS) en la salida del Repository.
- **Transacciones:** Control explícito de `BEGIN`, `COMMIT` y `ROLLBACK` en operaciones multi-tabla dentro de la capa de servicio o repositorios compuestos.

Separación estricta de responsabilidades.

## JWT y Roles

# Middleware JWT

Validar:

- Token
- Expiración (3 horas)
- Firma

# Middleware Roles

Permitir acceso según:

- admin
- profesor
- estudiante

# Reglas

- Nunca confiar en datos del frontend.
- Validar rol en backend.
- El frontend solo oculta UI.
- El backend protege datos.

# Stack Tecnológico
- Node.js (LTS)
- Express
- TypeScript
- Driver: `mysql2/promise` (SQL Puro y parametrizado con `?`)
- Zod (Validación de esquemas y DTOs de extremo a extremo)
- JWT (Access & Refresh Tokens)
- Bcryptjs (Haseo de credenciales)
- Multer (Carga de archivos)
- Dotenv
- Docker & Docker Compose

# Arquitectura Backend (Estructura de Directorios)

src/
│
├── config/         # Variables de entorno y configuraciones (DB, AWS, etc.)
├── database/       # Pool de conexión, scripts de migración y seeds SQL
├── routes/         # Definición de endpoints expuestos de la API
├── middlewares/    # Interceptores (Auth, Roles, Manejo de Errores, Multer)
├── schemas/        # Esquemas de validación Zod (Reemplaza a validators)
├── controllers/    # Manejo exclusivo de req y res (Extracción de datos)
├── services/       # Lógica de negocio pura, casos de uso y transacciones SQL
├── repositories/   # Consultas SQL parametrizadas nativas (Acceso a datos)
├── models/         # Interfaces y Tipos de TypeScript (Entities y Data Rows)
├── enums/          # Enumeradores compartidos del sistema
├── utils/          # Funciones de ayuda reutilizables (Mappers, Crypto, Fechas)
├── constants/      # Constantes globales del backend
├── uploads/        # Directorio temporal local para desarrollo (ignorado en git)
├── app.ts          # Configuración inicial de la aplicación Express
└── server.ts       # Inicialización del servidor HTTP y escucha de puertos

# Flujo Arquitectónico

Route
  ↓
Middleware
  ↓
Validator
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Model
  ↓
Database

# Convenciones

## Controllers
 - Solo request y response.
 - Nunca lógica SQL.
 - Nunca lógica de negocio compleja.
## Services
 - Toda la lógica del negocio.
 - Validaciones complejas.
 - Transacciones.
## Repositories
 - Solo consultas SQL.
 - Queries parametrizadas.
 - Nunca lógica de negocio.

# Restricciones
- No usar ORM.
- Solo consultas SQL parametrizadas.
- No usar callbacks.
- Usar async/await.
- No usar any en TypeScript si se implementa.
- No guardar archivos localmente en producción.
- Los endpoints privados deben estar protegidos.

# ENUMS

obligacion_pago:
- pendiente
- pagado
- vencido

pago:
- pendiente
- aprovado
- rechazado

anio_electivo:
- activo
- cerrado

asistencia:
- asistió
- falla 
- falla Justificada 
- retraso

usuario:
- activo
- inactivo

grados_por_matricula:
- finalizado
- pendiente
- retirado

classroom_entrega
- pendiente
- aprovado
- corregido
 
