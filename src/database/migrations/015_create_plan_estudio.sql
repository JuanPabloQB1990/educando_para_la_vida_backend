-- Migration: 015_create_plan_estudio.sql
CREATE TABLE IF NOT EXISTS plan_estudio (
  id_plan_estudio VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_grado_educacion VARCHAR(100) NOT NULL,
  id_materia VARCHAR(100) NOT NULL,
  CONSTRAINT fk_plan_grado FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id_grado_educacion),
  CONSTRAINT fk_plan_materia FOREIGN KEY (id_materia) REFERENCES materia(id_materia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
