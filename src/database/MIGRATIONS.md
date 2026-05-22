# Migraciones SQL

Archivos de migración y seeds para crear las tablas y datos preinsertados.

Orden de ejecución (primero migraciones, luego seeds):

1. Migraciones (carpeta `migrations/`)
  - `000_create_rol.sql`
  - `001_create_tipo_documento.sql`
  - `002_create_grado_educacion.sql`
  - `003_create_tipo_estudio.sql`
  - `004_create_tiempo_validacion.sql`
  - `005_create_usuario.sql`
  - `006_create_estudiante.sql`
  - `007_create_rubro.sql`
  - `008_create_anio_electivo.sql`
  - `009_create_estudiante_periodo.sql`
  - `010_create_grados_por_matricula.sql`
  - `011_create_obligacion_pago.sql`
  - `012_create_pago.sql`
  - `013_create_sesion_usuario.sql`
  - `014_create_materia.sql`
  - `015_create_plan_estudio.sql`
  - `016_create_periodo.sql`
  - `017_create_carga_academica.sql`
  - `018_create_direccion_grado.sql`
  - `019_create_actividad.sql`
  - `020_create_actividad_materia.sql`
  - `021_create_calificacion.sql`
  - `022_create_asistencia.sql`
  - `023_create_classroom_tarea.sql`
  - `024_create_classroom_tarea_adjunto.sql`
  - `025_create_classroom_entrega.sql`
  - `026_create_classroom_entrega_adjunto.sql`

2. Seeds (carpeta `seeds/`)
  - `100_seed_rol.sql`
  - `101_seed_tipo_documento.sql`
  - `102_seed_grado_educacion.sql`
  - `103_seed_tipo_estudio.sql`
  - `104_seed_tiempo_validacion.sql`
  - `105_seed_rubro.sql`
  - `106_seed_anio_electivo.sql`

Comandos de ejemplo usando el cliente `mysql`:

```bash
# exporta variables de entorno o cámbialas por valores reales
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=institucion_db

# aplicar una migración
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < src/database/migrations/001_create_tipo_documento.sql

# aplicar todos en orden (ejemplo)
for f in src/database/migrations/*.sql; do
  echo "Applying $f";
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$f";
done

# ejecutar seeds
for f in src/database/seeds/*.sql; do
  echo "Seeding $f";
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$f";
done
```

Notas:
- Las migraciones usan `CREATE TABLE IF NOT EXISTS` para evitar errores si ya existen.
- Los seeds usan `INSERT IGNORE` para evitar duplicados en ejecuciones repetidas.

Additional notes:
- Primary keys use `VARCHAR(100)` with `DEFAULT (UUID())` to follow the project convention of UUID string PKs.
- Foreign keys are defined to reference `VARCHAR(100)` UUID PKs across tables.
