-- Migration: 022_create_asistencia.sql
CREATE TABLE IF NOT EXISTS asistencia (
  id_asistencia VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_estudiante VARCHAR(100) NOT NULL,
  id_periodo VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  estado_asistencia ENUM('presente','ausente','tarde') NOT NULL,
  observacion TEXT,
  CONSTRAINT fk_asistencia_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante),
  CONSTRAINT fk_asistencia_periodo FOREIGN KEY (id_periodo) REFERENCES periodo(id_periodo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
