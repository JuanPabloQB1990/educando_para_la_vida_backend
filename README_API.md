# API REST de Productos

API REST completa para gestión de productos, construida con Node.js, Express y MySQL.

## Características

✅ **CRUD Completo**: GET, POST, PUT, PATCH, DELETE  
✅ **Arquitectura en Capas**: Controllers, Services, Repositories  
✅ **Validación de Datos**: Con Joi  
✅ **Manejo Centralizado de Errores**: Middleware de errores  
✅ **Respuestas JSON Estandarizadas**  
✅ **Variables de Entorno**: Configuración segura  

## Estructura del Proyecto

```
src/
├── config/               # Configuración
│   ├── database.js      # Pool de conexión MySQL
│   └── environment.js   # Variables de entorno
├── controllers/          # Controladores (manejo de requests)
│   └── ProductController.js
├── services/             # Lógica de negocio
│   └── ProductService.js
├── repositories/         # Acceso a datos
│   └── ProductRepository.js
├── routes/               # Definición de rutas
│   └── productRoutes.js
├── validators/           # Validaciones con Joi
│   └── productValidator.js
├── middleware/           # Middlewares
│   └── errorHandler.js
├── database/             # Scripts SQL
│   └── products.sql
└── index.js             # Punto de entrada
```

## Instalación

1. **Clonar e instalar dependencias**:
```bash
npm install
```

2. **Crear base de datos**:
```bash
mysql -u root -p
CREATE DATABASE productos;
USE productos;
source src/database/products.sql;
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

4. **Iniciar servidor**:
```bash
# Desarrollo con hot reload
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints

### GET - Obtener todos los productos
```
GET /api/products
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "Laptop Dell XPS 13",
      "price": 999.99,
      "quantity": 10,
      "category": "Electrónica",
      "created_at": "2025-05-01T10:00:00.000Z",
      "updated_at": "2025-05-01T10:00:00.000Z"
    }
  ],
  "error": null
}
```

### GET - Obtener producto por ID
```
GET /api/products/:id
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "Laptop Dell XPS 13",
    "price": 999.99,
    "quantity": 10,
    "category": "Electrónica",
    "created_at": "2025-05-01T10:00:00.000Z",
    "updated_at": "2025-05-01T10:00:00.000Z"
  },
  "error": null
}
```

### POST - Crear nuevo producto
```
POST /api/products
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Mouse Logitech",
  "description": "Mouse inalámbrico",
  "price": 29.99,
  "quantity": 50,
  "category": "Accesorios"
}
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Mouse Logitech",
    "description": "Mouse inalámbrico",
    "price": 29.99,
    "quantity": 50,
    "category": "Accesorios"
  },
  "error": null
}
```

**Validaciones**:
- `name`: Requerido, mínimo 3 caracteres, máximo 255
- `description`: Opcional, máximo 1000 caracteres
- `price`: Requerido, debe ser positivo
- `quantity`: Requerido, número entero no negativo
- `category`: Requerido, máximo 100 caracteres

### PUT - Actualizar producto completamente
```
PUT /api/products/:id
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Laptop Gaming",
  "description": "Laptop para gaming profesional",
  "price": 1299.99,
  "quantity": 5,
  "category": "Gaming"
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Gaming",
    "description": "Laptop para gaming profesional",
    "price": 1299.99,
    "quantity": 5,
    "category": "Gaming"
  },
  "error": null
}
```

### PATCH - Actualizar producto parcialmente
```
PATCH /api/products/:id
Content-Type: application/json
```

**Body** (solo los campos a actualizar):
```json
{
  "price": 899.99,
  "quantity": 8
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "price": 899.99,
    "quantity": 8
  },
  "error": null
}
```

### DELETE - Eliminar producto
```
DELETE /api/products/:id
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "message": "Product deleted successfully"
  },
  "error": null
}
```

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## Manejo de Errores

Respuesta de error (ejemplo):
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Product not found",
    "statusCode": 404
  }
}
```

## Testing con cURL

```bash
# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teclado Mecánico",
    "description": "Teclado RGB",
    "price": 150,
    "quantity": 20,
    "category": "Accesorios"
  }'

# Obtener todos los productos
curl http://localhost:3000/api/products

# Obtener producto específico
curl http://localhost:3000/api/products/1

# Actualizar (PUT)
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teclado Mecánico Pro",
    "price": 180
  }'

# Actualizar parcialmente (PATCH)
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 15
  }'

# Eliminar
curl -X DELETE http://localhost:3000/api/products/1
```

## Patrones Implementados

### Arquitectura en Capas
- **Repositories**: Acceso exclusivo a datos (SQL injection prevention)
- **Services**: Lógica de negocio y validaciones
- **Controllers**: Manejo de requests/responses
- **Routes**: Definición de endpoints

### Buenas Prácticas
- ✅ Async/Await (sin callbacks)
- ✅ Validación con Joi
- ✅ Manejo centralizado de errores
- ✅ Variables de entorno
- ✅ Queries parametrizadas (prevención SQL injection)
- ✅ Respuestas JSON estandarizadas

## Próximas Mejoras

- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Paginación
- [ ] Búsqueda y filtros avanzados
- [ ] Logging centralizado
- [ ] Tests unitarios
- [ ] Docker y Docker Compose
