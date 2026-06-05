-- Migration: 016_create_periodo.sql
CREATE TABLE IF NOT EXISTS periodo (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_anio_electivo VARCHAR(100) NOT NULL,
  numero_periodo INT NOT NULL,
  CONSTRAINT fk_periodo_anio FOREIGN KEY (id_anio_electivo) REFERENCES anio_electivo(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
