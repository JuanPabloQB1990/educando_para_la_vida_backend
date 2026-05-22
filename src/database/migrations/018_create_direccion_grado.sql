-- Migration: 018_create_direccion_grado.sql
CREATE TABLE IF NOT EXISTS direccion_grado (
  id_direccion_grado VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_grado_educacion VARCHAR(100) NOT NULL,
  id_usuario VARCHAR(100) NOT NULL,
  id_anio_electivo VARCHAR(100) NOT NULL,
  link_clase_virtual VARCHAR(255),
  ultima_actualizacion_link DATETIME,
  CONSTRAINT fk_dg_grado FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id_grado_educacion),
  CONSTRAINT fk_dg_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  CONSTRAINT fk_dg_anio FOREIGN KEY (id_anio_electivo) REFERENCES anio_electivo(id_anio_electivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
