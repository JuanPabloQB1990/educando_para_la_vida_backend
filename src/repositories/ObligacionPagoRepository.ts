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

  async findByIdAndEstudiante(idObligacionPago: string, idEstudiante: string) {
    try {
      const sql = `
        SELECT op.*, r.nombre AS nombre_rubro
        FROM obligacion_pago op
        JOIN rubro r ON op.id_rubro = r.id
        INNER JOIN estudiante_matricula em ON op.id_estudiante_matricula = em.id
        WHERE op.id = ? AND em.id_estudiante = ?
      `;
      const [rows] = await pool.query(sql, [idObligacionPago, idEstudiante]);
      const row = (rows as any[])[0] || null;
      return row ? mapRowToEntity<ObligacionPago>(row) : null;
    } catch (error) {
      throw error;
    }
  }

  async updateVencidosByMatricula(idEstudianteMatricula: string) {
    try {
      await pool.execute(
        `UPDATE obligacion_pago
         SET estado = 'vencido'
         WHERE id_estudiante_matricula = ?
           AND estado = 'pendiente'
           AND fecha_vencimiento < NOW()`,
        [idEstudianteMatricula]
      );
    } catch (error) {
      throw error;
    }
  }

  async findPendientesVencenEn(dias: number) {
    const [rows] = await pool.query(
      `SELECT op.id, op.monto_cuota, op.fecha_vencimiento,
              r.nombre AS nombre_rubro,
              u.email AS email_estudiante,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_estudiante
       FROM obligacion_pago op
       JOIN rubro r ON op.id_rubro = r.id
       JOIN estudiante_matricula em ON op.id_estudiante_matricula = em.id
       JOIN estudiante e ON em.id_estudiante = e.id
       JOIN usuario u ON e.id_usuario = u.id
       WHERE op.estado = 'pendiente'
         AND DATE(op.fecha_vencimiento) = DATE(NOW() + INTERVAL ? DAY)`,
      [dias]
    );
    return rows as any[];
  }

  async findPendientesVencenHoy() {
    const [rows] = await pool.query(
      `SELECT op.id, op.monto_cuota, op.fecha_vencimiento,
              r.nombre AS nombre_rubro,
              u.email AS email_estudiante,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_estudiante
       FROM obligacion_pago op
       JOIN rubro r ON op.id_rubro = r.id
       JOIN estudiante_matricula em ON op.id_estudiante_matricula = em.id
       JOIN estudiante e ON em.id_estudiante = e.id
       JOIN usuario u ON e.id_usuario = u.id
       WHERE op.estado = 'pendiente'
         AND DATE(op.fecha_vencimiento) = CURDATE()`
    );
    return rows as any[];
  }

  async findWithPagosByMatricula(idEstudianteMatricula: string) {
    try {
      const sql = `
        SELECT
          op.id AS id_obligacion_pago, op.id_rubro, op.monto_cuota, op.fecha_vencimiento, op.estado AS estado_obligacion,
          r.nombre AS nombre_rubro,
          p.id AS pago_id, p.monto_pagado, p.fecha_pago_real, p.file_comprobante,
          p.observaciones AS pago_observaciones, p.estado AS pago_estado, p.fecha_verificacion
        FROM obligacion_pago op
        INNER JOIN rubro r ON op.id_rubro = r.id
        LEFT JOIN pago p ON p.id_obligacion_pago = op.id
        WHERE op.id_estudiante_matricula = ?
        ORDER BY op.fecha_vencimiento ASC
      `;
      const [rows] = await pool.query(sql, [idEstudianteMatricula]);
      return (rows as any[]).map((row: any) => ({
        idObligacionPago: row.id_obligacion_pago,
        idRubro: row.id_rubro,
        nombreRubro: row.nombre_rubro,
        montoCuota: row.monto_cuota,
        fechaVencimiento: row.fecha_vencimiento,
        estadoObligacion: row.estado_obligacion,
        pago: row.pago_id ? {
          id: row.pago_id,
          montoPagado: row.monto_pagado,
          fechaPagoReal: row.fecha_pago_real,
          fileComprobante: row.file_comprobante,
          observaciones: row.pago_observaciones,
          estado: row.pago_estado,
          fechaVerificacion: row.fecha_verificacion,
        } : null,
      }));
    } catch (error) {
      throw error;
    }
  }
}

export default new ObligacionPagoRepository();
