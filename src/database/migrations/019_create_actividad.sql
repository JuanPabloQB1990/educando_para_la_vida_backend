-- Migration: 019_create_actividad.sql
CREATE TABLE IF NOT EXISTS actividad (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_periodo VARCHAR(100) NOT NULL,
  id_grado_educacion VARCHAR(100) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  semana INT NOT NULL,
  descripcion TEXT,
  CONSTRAINT fk_actividad_periodo FOREIGN KEY (id_periodo) REFERENCES periodo(id),
  CONSTRAINT fk_actividad_grado FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
