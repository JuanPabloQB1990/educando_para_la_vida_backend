import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { ObligacionPago } from '../models/obligacionPago';

class ObligacionPagoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM obligacion_pago ORDER BY id_obligacion_pago');
    return mapRowsToEntities<ObligacionPago>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM obligacion_pago WHERE id_obligacion_pago = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<ObligacionPago>(row) : null;
  }

  async create(data: any) {
    const { id_estudiante_periodo, id_rubro, monto_cuota, fecha_vencimiento, estado } = data;
    const id_obligacion_pago = generatePrimaryKey();
    const [result] = await pool.execute(
      'INSERT INTO obligacion_pago (id_obligacion_pago, id_estudiante_periodo, id_rubro, monto_cuota, fecha_vencimiento, estado) VALUES (?,?,?,?,?,?)',
      [id_obligacion_pago, id_estudiante_periodo, id_rubro, monto_cuota, fecha_vencimiento, estado]
    );
    return { id: id_obligacion_pago };
  }

  async update(id: string, data: any) {
    const { id_estudiante_periodo, id_rubro, monto_cuota, fecha_vencimiento, estado } = data;
    const [result] = await pool.execute(
      'UPDATE obligacion_pago SET id_estudiante_periodo=?, id_rubro=?, monto_cuota=?, fecha_vencimiento=?, estado=? WHERE id_obligacion_pago=?',
      [id_estudiante_periodo, id_rubro, monto_cuota, fecha_vencimiento, estado, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM obligacion_pago WHERE id_obligacion_pago = ?', [id]);
    return result;
  }

  async findByEstudiantePeriodo(idEstudiantePeriodo: string) {
    try {
      const sql = `
        SELECT op.id_obligacion_pago, op.id_rubro, op.monto_cuota, op.fecha_vencimiento, op.estado,
               r.nombre_rubro AS nombre_rubro
        FROM obligacion_pago op
        INNER JOIN rubro r ON op.id_rubro = r.id_rubro
        WHERE op.id_estudiante_periodo = ?
        ORDER BY op.fecha_vencimiento ASC
      `;
      const [rows] = await pool.query(sql, [idEstudiantePeriodo]);
      return mapRowsToEntities<any>(rows as any[]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new ObligacionPagoRepository();
