CREATE TABLE IF NOT EXISTS bloque_grado (
  id_bloque VARCHAR(100) NOT NULL,
  id_grado_educacion VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_bloque, id_grado_educacion),
  CONSTRAINT fk_bloque_grado_bloque FOREIGN KEY (id_bloque) REFERENCES bloque(id) ON DELETE RESTRICT,
  CONSTRAINT fk_bloque_grado_grado FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
