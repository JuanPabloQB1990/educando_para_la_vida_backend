import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Estudiante } from '../models/estudiante';

/** Campos de identificación del documento; viven en `usuario`, no en `estudiante`. */
const OMIT_FROM_ESTUDIANTE = new Set([
  'id_tipo_documento',
  'no_documento',
  'fecha_expedicion_documento',
]);

class EstudianteRepository {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT e.*, u.id_usuario AS usuario_id_usuario, u.nombres AS usuario_nombres, u.apellido1 AS usuario_apellido1, u.apellido2 AS usuario_apellido2, u.contacto1 AS usuario_contacto1, u.contacto2 AS usuario_contacto2, u.email AS usuario_email, u.id_rol AS usuario_id_rol, u.estado AS usuario_estado, u.id_tipo_documento AS usuario_id_tipo_documento, u.no_documento AS usuario_no_documento, u.fecha_expedicion_documento AS usuario_fecha_expedicion_documento
       FROM estudiante e
       LEFT JOIN usuario u ON e.id_usuario = u.id_usuario
       ORDER BY e.id_estudiante`
    );
    return mapRowsToEntities<any>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT e.*, u.id_usuario AS usuario_id_usuario, u.nombres AS usuario_nombres, u.apellido1 AS usuario_apellido1, u.apellido2 AS usuario_apellido2, u.contacto1 AS usuario_contacto1, u.contacto2 AS usuario_contacto2, u.email AS usuario_email, u.id_rol AS usuario_id_rol, u.estado AS usuario_estado, u.id_tipo_documento AS usuario_id_tipo_documento, u.no_documento AS usuario_no_documento, u.fecha_expedicion_documento AS usuario_fecha_expedicion_documento
       FROM estudiante e
       LEFT JOIN usuario u ON e.id_usuario = u.id_usuario
       WHERE e.id_estudiante = ? LIMIT 1`,
      [id]
    );
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<any>(row) : null;
  }

  async create(data: any) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // The service layer is responsible for creating `usuario` and passing `id_usuario` here.
      const id_usuario = data.id_usuario;
      if (!id_usuario) throw new Error('id_usuario is required to create estudiante; create usuario in service first');

      // prepare estudiante data (remove usuario-only fields)
      const id_estudiante = generatePrimaryKey();
      const row: Record<string, unknown> = { id_estudiante, id_usuario, ...data };
      for (const k of OMIT_FROM_ESTUDIANTE) delete row[k];
      const keys = Object.keys(row);
      const values = keys.map((k) => row[k]);
      const placeholders = keys.map(() => '?').join(',');

      await conn.execute(`INSERT INTO estudiante (${keys.join(',')}) VALUES (${placeholders})`, values as any[]);

      await conn.commit();
      return await this.findById(id_estudiante);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async update(id: string, data: any) {
    const payload = { ...data };
    for (const k of OMIT_FROM_ESTUDIANTE) delete payload[k];
    const keys = Object.keys(payload);
    const values = keys.map((k) => payload[k]);
    const setClause = keys.map((k) => `${k}=?`).join(',');
    const [result] = await pool.execute(
      `UPDATE estudiante SET ${setClause} WHERE id_estudiante = ?`,
      [...values, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM estudiante WHERE id_estudiante = ?', [id]);
    return result;
  }
}

export default new EstudianteRepository();
