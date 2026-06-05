-- Migration: 013_create_sesion_usuario.sql
CREATE TABLE IF NOT EXISTS sesion_usuario (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_usuario VARCHAR(100) NOT NULL,
  token TEXT,
  ip VARCHAR(100),
  user_agent VARCHAR(255),
  fecha_login DATETIME,
  fecha_expiracion DATETIME,
  CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
