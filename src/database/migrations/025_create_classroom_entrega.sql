-- Migration: 025_create_classroom_entrega.sql
CREATE TABLE IF NOT EXISTS classroom_entrega (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_classroom_tarea VARCHAR(100) NOT NULL,
  id_estudiante VARCHAR(100) NOT NULL,
  fecha_entrega DATETIME NOT NULL,
  estado ENUM('pendiente','aprovado','corregido') NOT NULL,
  observacion_profesor TEXT,
  CONSTRAINT fk_ce_tarea FOREIGN KEY (id_classroom_tarea) REFERENCES classroom_tarea(id),
  CONSTRAINT fk_ce_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
