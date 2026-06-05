-- Migration: 022_create_asistencia.sql
CREATE TABLE IF NOT EXISTS asistencia (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_estudiante VARCHAR(100) NOT NULL,
  id_periodo VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('presente','ausente','tarde') NOT NULL,
  observacion TEXT,
  CONSTRAINT fk_asistencia_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id),
  CONSTRAINT fk_asistencia_periodo FOREIGN KEY (id_periodo) REFERENCES periodo(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
