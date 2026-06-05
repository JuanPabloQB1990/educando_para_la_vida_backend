-- Migration: 021_create_calificacion.sql
CREATE TABLE IF NOT EXISTS calificacion (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_estudiante VARCHAR(100) NOT NULL,
  id_actividad_materia VARCHAR(100) NOT NULL,
  nota DECIMAL(5,2) NOT NULL,
  observacion TEXT,
  CONSTRAINT fk_calificacion_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id),
  CONSTRAINT fk_calificacion_actividad FOREIGN KEY (id_actividad_materia) REFERENCES actividad_materia(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
