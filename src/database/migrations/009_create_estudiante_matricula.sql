CREATE TABLE IF NOT EXISTS estudiante_matricula (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_estudiante VARCHAR(100) NOT NULL,
  id_tipo_estudio VARCHAR(100) NOT NULL,
  id_tiempo_validacion VARCHAR(100),
  fecha_inscripcion DATETIME NOT NULL,
  file_certificado_grados VARCHAR(255),
  file_compromiso VARCHAR(255) NOT NULL,
  id_anio_electivo VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
  CONSTRAINT fk_em_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id) ON DELETE CASCADE,
  CONSTRAINT fk_em_tipo_estudio FOREIGN KEY (id_tipo_estudio) REFERENCES tipo_estudio(id),
  CONSTRAINT fk_em_tiempo_validacion FOREIGN KEY (id_tiempo_validacion) REFERENCES tiempo_validacion(id),
  CONSTRAINT fk_em_anio_electivo FOREIGN KEY (id_anio_electivo) REFERENCES anio_electivo(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
