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

      // prepare usuario data
      const id_usuario = generatePrimaryKey();
      const usuarioPayload = {
        id_usuario,
        nombres: data.nombres ?? null,
        apellido1: data.apellido1 ?? null,
        apellido2: data.apellido2 ?? null,
        contacto1: data.contacto1 ?? null,
        contacto2: data.contacto2 ?? null,
        email: data.email ?? null,
        id_rol: data.id_rol ?? null,
        estado: data.estado ?? 'activo',
        id_tipo_documento: data.id_tipo_documento ?? null,
        no_documento: data.no_documento ?? null,
        fecha_expedicion_documento: data.fecha_expedicion_documento ?? null,
      };

      await conn.execute(
        'INSERT INTO usuario (id_usuario, nombres, apellido1, apellido2, contacto1, contacto2, email, id_rol, estado, id_tipo_documento, no_documento, fecha_expedicion_documento) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          usuarioPayload.id_usuario,
          usuarioPayload.nombres,
          usuarioPayload.apellido1,
          usuarioPayload.apellido2,
          usuarioPayload.contacto1,
          usuarioPayload.contacto2,
          usuarioPayload.email,
          usuarioPayload.id_rol,
          usuarioPayload.estado,
          usuarioPayload.id_tipo_documento,
          usuarioPayload.no_documento,
          usuarioPayload.fecha_expedicion_documento,
        ]
      );

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
