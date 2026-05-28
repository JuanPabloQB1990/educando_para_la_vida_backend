CREATE TABLE IF NOT EXISTS estudiante_periodo (
  id_estudiante_periodo VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_estudiante VARCHAR(100) NOT NULL,
  id_tipo_estudio VARCHAR(100) NOT NULL,
  id_tiempo_validacion VARCHAR(100),
  fecha_inscripcion DATETIME NOT NULL,
  file_certificado_grados VARCHAR(255),
  file_compromiso VARCHAR(255) NOT NULL,
  id_anio_electivo VARCHAR(100),
  CONSTRAINT fk_ep_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
  CONSTRAINT fk_ep_tipo_estudio FOREIGN KEY (id_tipo_estudio) REFERENCES tipo_estudio(id_tipo_estudio),
  CONSTRAINT fk_ep_tiempo_validacion FOREIGN KEY (id_tiempo_validacion) REFERENCES tiempo_validacion(id_tiempo_validacion),
  CONSTRAINT fk_ep_anio_electivo FOREIGN KEY (id_anio_electivo) REFERENCES anio_electivo(id_anio_electivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
