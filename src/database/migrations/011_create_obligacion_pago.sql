CREATE TABLE IF NOT EXISTS obligacion_pago (
  id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
  id_estudiante_matricula VARCHAR(100) NOT NULL,
  id_rubro VARCHAR(100) NOT NULL,
  monto_cuota DECIMAL(12,2) NOT NULL DEFAULT 0,
  fecha_vencimiento DATETIME,
  estado ENUM('pendiente','pagado','vencido') NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_op_estudiante_matricula FOREIGN KEY (id_estudiante_matricula) REFERENCES estudiante_matricula(id) ON DELETE CASCADE,
  CONSTRAINT fk_op_rubro FOREIGN KEY (id_rubro) REFERENCES rubro(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
