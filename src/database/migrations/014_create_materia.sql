-- Migration: 014_create_materia.sql
CREATE TABLE IF NOT EXISTS materia (
  id_materia VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  nombre_materia VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
