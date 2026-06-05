CREATE TABLE IF NOT EXISTS usuario (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  nombres VARCHAR(150) NOT NULL,
  apellido1 VARCHAR(150) NOT NULL,
  apellido2 VARCHAR(150) NOT NULL,
  contacto1 VARCHAR(50) NOT NULL,
  contacto2 VARCHAR(50),
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(255),
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'inactivo',
  id_tipo_documento VARCHAR(100) NOT NULL,
  id_rol VARCHAR(100) NOT NULL,
  no_documento VARCHAR(100) NOT NULL,
  fecha_expedicion_documento DATE NOT NULL,
  CONSTRAINT fk_usuario_tipo_documento FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
