CREATE TABLE IF NOT EXISTS usuario (
  id_usuario VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  nombres VARCHAR(150) NOT NULL,
  apellido1 VARCHAR(150) NOT NULL,
  apellido2 VARCHAR(150),
  contacto1 VARCHAR(50),
  contacto2 VARCHAR(50),
  email VARCHAR(200) UNIQUE,
  password VARCHAR(255),
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  id_tipo_documento VARCHAR(100),
  id_rol VARCHAR(100),
  no_documento VARCHAR(100),
  fecha_expedicion_documento DATE,
  CONSTRAINT fk_usuario_tipo_documento FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo_documento),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
