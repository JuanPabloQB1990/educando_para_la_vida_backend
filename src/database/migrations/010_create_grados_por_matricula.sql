CREATE TABLE IF NOT EXISTS grados_por_matricula (
  id_estudiante_periodo VARCHAR(100) NOT NULL,
  id_grado_educacion VARCHAR(100) NOT NULL,
  estado ENUM('finalizado','pendiente', 'retirado') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (id_estudiante_periodo, id_grado_educacion),
  CONSTRAINT fk_gpm_estudiante_periodo FOREIGN KEY (id_estudiante_periodo) REFERENCES estudiante_periodo(id_estudiante_periodo) ON DELETE CASCADE,
  CONSTRAINT fk_gpm_grado_educacion FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id_grado_educacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
