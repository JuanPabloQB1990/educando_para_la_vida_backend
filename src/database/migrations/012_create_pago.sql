CREATE TABLE IF NOT EXISTS pago (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_obligacion_pago VARCHAR(100) NOT NULL,
  monto_pagado DECIMAL(12,2) NOT NULL DEFAULT 0,
  fecha_pago_real DATETIME,
  file_comprobante VARCHAR(255) NOT NULL,
  observaciones TEXT,
  estado ENUM('pendiente','aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
  fecha_verificacion DATETIME,
  CONSTRAINT fk_pago_obligacion FOREIGN KEY (id_obligacion_pago) REFERENCES obligacion_pago(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
