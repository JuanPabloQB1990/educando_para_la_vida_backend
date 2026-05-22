-- Migration: 026_create_classroom_entrega_adjunto.sql
CREATE TABLE IF NOT EXISTS classroom_entrega_adjunto (
  id_classroom_entrega_adjunto VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_classroom_entrega VARCHAR(100) NOT NULL,
  url_archivo VARCHAR(500) NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  CONSTRAINT fk_cea_entrega FOREIGN KEY (id_classroom_entrega) REFERENCES classroom_entrega(id_classroom_entrega)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
