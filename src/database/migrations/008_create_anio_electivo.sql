CREATE TABLE IF NOT EXISTS anio_electivo (
  id_anio_electivo VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  anio INT NOT NULL UNIQUE,
  estado ENUM('activo','cerrado') NOT NULL DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
