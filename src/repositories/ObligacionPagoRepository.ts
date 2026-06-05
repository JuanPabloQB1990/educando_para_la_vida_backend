import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { ObligacionPago } from '../models/obligacionPago';

class ObligacionPagoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM obligacion_pago ORDER BY id');
    return mapRowsToEntities<ObligacionPago>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM obligacion_pago WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<ObligacionPago>(row) : null;
  }

  async create(data: any) {
    const { id_estudiante_matricula, id_rubro, monto_cuota, fecha_vencimiento, estado } = data;
    const id = generatePrimaryKey();
    const [result] = await pool.execute(
      'INSERT INTO obligacion_pago (id, id_estudiante_matricula, id_rubro, monto_cuota, fecha_vencimiento, estado) VALUES (?,?,?,?,?,?)',
      [id, id_estudiante_matricula, id_rubro, monto_cuota, fecha_vencimiento, estado]
    );
    return { id };
  }

  async update(id: string, data: any) {
    const { id_estudiante_matricula, id_rubro, monto_cuota, fecha_vencimiento, estado } = data;
    const [result] = await pool.execute(
      'UPDATE obligacion_pago SET id_estudiante_matricula=?, id_rubro=?, monto_cuota=?, fecha_vencimiento=?, estado=? WHERE id=?',
      [id_estudiante_matricula, id_rubro, monto_cuota, fecha_vencimiento, estado, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM obligacion_pago WHERE id = ?', [id]);
    return result;
  }

  async findByEstudianteMatricula(idEstudianteMatricula: string) {
    try {
      const sql = `
        SELECT op.id AS id_obligacion_pago, op.id_rubro, op.monto_cuota, op.fecha_vencimiento, op.estado,
               r.nombre AS nombre_rubro
        FROM obligacion_pago op
        INNER JOIN rubro r ON op.id_rubro = r.id
        WHERE op.id_estudiante_matricula = ?
        ORDER BY op.fecha_vencimiento ASC
      `;
      const [rows] = await pool.query(sql, [idEstudianteMatricula]);
      return mapRowsToEntities<any>(rows as any[]);
    } catch (error) {
      throw error;
    }
  }
}

export default new ObligacionPagoRepository();
