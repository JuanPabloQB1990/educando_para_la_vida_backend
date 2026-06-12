-- Migration: 020_create_actividad_materia.sql
CREATE TABLE IF NOT EXISTS actividad_materia (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_actividad VARCHAR(100) NOT NULL,
  id_materia VARCHAR(100) NOT NULL,
  id_carga_academica VARCHAR(100) NOT NULL,
  CONSTRAINT fk_am_actividad FOREIGN KEY (id_actividad) REFERENCES actividad(id),
  CONSTRAINT fk_am_materia FOREIGN KEY (id_materia) REFERENCES materia(id),
  CONSTRAINT fk_am_carga FOREIGN KEY (id_carga_academica) REFERENCES carga_academica(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
