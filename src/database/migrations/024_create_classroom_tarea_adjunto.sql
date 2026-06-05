-- Migration: 024_create_classroom_tarea_adjunto.sql
CREATE TABLE IF NOT EXISTS classroom_tarea_adjunto (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_classroom_tarea VARCHAR(100) NOT NULL,
  url_archivo VARCHAR(500) NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  CONSTRAINT fk_cta_tarea FOREIGN KEY (id_classroom_tarea) REFERENCES classroom_tarea(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
