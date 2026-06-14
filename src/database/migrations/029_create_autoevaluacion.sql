CREATE TABLE autoevaluacion (
  id           CHAR(36)       NOT NULL DEFAULT (UUID()),
  id_estudiante CHAR(36)      NOT NULL,
  id_periodo   CHAR(36)       NOT NULL,
  id_grado_educacion CHAR(36) NOT NULL,
  nota         DECIMAL(4,2)   NOT NULL,
  observacion  TEXT           NULL,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_autoevaluacion (id_estudiante, id_periodo, id_grado_educacion),
  FOREIGN KEY (id_estudiante)      REFERENCES estudiante(id)      ON DELETE CASCADE,
  FOREIGN KEY (id_periodo)         REFERENCES periodo(id)          ON DELETE CASCADE,
  FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id)  ON DELETE CASCADE
);
