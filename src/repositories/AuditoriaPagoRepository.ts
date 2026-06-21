import pool from '../config/database';
import { mapRowsToEntities } from '../models/dbMappers';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import type { AuditoriaPago, CreateAuditoriaPagoDto } from '../models/auditoriaPago';

class AuditoriaPagoRepository {
  async upsert(dto: CreateAuditoriaPagoDto): Promise<void> {
    const id = generatePrimaryKey();
    await pool.execute(
      `INSERT INTO auditoria_pago (id, id_pago, nombres, apellido1, apellido2)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nombres = VALUES(nombres), apellido1 = VALUES(apellido1), apellido2 = VALUES(apellido2)`,
      [id, dto.idPago, dto.nombres, dto.apellido1, dto.apellido2]
    );
  }

  async findByIdPago(idPago: string): Promise<AuditoriaPago | null> {
    const [rows] = await pool.execute(
      `SELECT * FROM auditoria_pago WHERE id_pago = ? LIMIT 1`,
      [idPago]
    );
    const [entity] = mapRowsToEntities<AuditoriaPago>(rows as any[]);
    return entity ?? null;
  }
}

export default new AuditoriaPagoRepository();
