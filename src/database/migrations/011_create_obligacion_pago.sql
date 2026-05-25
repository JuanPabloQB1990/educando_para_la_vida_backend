CREATE TABLE IF NOT EXISTS obligacion_pago (
  id_obligacion_pago VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_estudiante_periodo VARCHAR(100) NOT NULL,
  id_rubro VARCHAR(100) NOT NULL,
  monto_cuota DECIMAL(12,2) NOT NULL DEFAULT 0,
  fecha_vencimiento DATETIME,
  estado ENUM('pendiente','pagado','vencido') NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_op_estudiante_periodo FOREIGN KEY (id_estudiante_periodo) REFERENCES estudiante_periodo(id_estudiante_periodo) ON DELETE CASCADE,
  CONSTRAINT fk_op_rubro FOREIGN KEY (id_rubro) REFERENCES rubro(id_rubro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
