CREATE TABLE IF NOT EXISTS grados_por_matricula (
  id_estudiante_matricula VARCHAR(100) NOT NULL,
  id_grado_educacion VARCHAR(100) NOT NULL,
  estado ENUM('finalizado','pendiente', 'retirado') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (id_estudiante_matricula, id_grado_educacion),
  CONSTRAINT fk_gpm_estudiante_matricula FOREIGN KEY (id_estudiante_matricula) REFERENCES estudiante_matricula(id) ON DELETE CASCADE,
  CONSTRAINT fk_gpm_grado_educacion FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
