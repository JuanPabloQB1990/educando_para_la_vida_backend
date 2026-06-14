-- Migration: 023_create_classroom_tarea.sql
CREATE TABLE IF NOT EXISTS classroom_tarea (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_carga_academica VARCHAR(100) NOT NULL,
  id_periodo VARCHAR(100),
  titulo VARCHAR(255) NOT NULL,
  instrucciones TEXT NOT NULL,
  fecha_limite DATETIME NOT NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ct_carga FOREIGN KEY (id_carga_academica) REFERENCES carga_academica(id),
  CONSTRAINT fk_ct_periodo FOREIGN KEY (id_periodo) REFERENCES periodo(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
