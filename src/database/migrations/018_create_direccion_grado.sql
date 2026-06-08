-- Migration: 018_create_direccion_grado.sql
CREATE TABLE IF NOT EXISTS direccion_grado (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_grado_educacion VARCHAR(100) NOT NULL,
  id_usuario VARCHAR(100) NOT NULL,
  id_anio_electivo VARCHAR(100) NOT NULL,
  id_bloque VARCHAR(100) NULL,
  link_clase_virtual VARCHAR(255),
  ultima_actualizacion_link DATETIME,
  CONSTRAINT fk_dg_grado FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id),
  CONSTRAINT fk_dg_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id),
  CONSTRAINT fk_dg_anio FOREIGN KEY (id_anio_electivo) REFERENCES anio_electivo(id),
  CONSTRAINT fk_dg_bloque FOREIGN KEY (id_bloque) REFERENCES bloque(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
