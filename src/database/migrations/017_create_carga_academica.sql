-- Migration: 017_create_carga_academica.sql
CREATE TABLE IF NOT EXISTS carga_academica (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_usuario VARCHAR(100) NOT NULL,
  id_materia VARCHAR(100) NOT NULL,
  id_grado_educacion VARCHAR(100) NOT NULL,
  id_anio_electivo VARCHAR(100) NOT NULL,
  CONSTRAINT fk_ca_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id),
  CONSTRAINT fk_ca_materia FOREIGN KEY (id_materia) REFERENCES materia(id),
  CONSTRAINT fk_ca_grado FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id),
  CONSTRAINT fk_ca_anio FOREIGN KEY (id_anio_electivo) REFERENCES anio_electivo(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
