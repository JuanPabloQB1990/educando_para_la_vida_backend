import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Estudiante } from '../models/estudiante';
import { object } from 'joi';

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
      //const id_usuario = data.id_usuario;
      if (!data.id_usuario) throw new Error('id_usuario is required to create estudiante; create usuario in service first');

      // prepare estudiante data (remove usuario-only fields)
      const id_estudiante : string= generatePrimaryKey();
    
      const row = {
            id_estudiante,
            id_usuario: data.id_usuario,
            fecha_nacimiento: data.fecha_nacimiento,
            edad: data.edad,
            sexo: data.sexo,
            municipio_nacimiento: data.municipio_nacimiento,
            departamento_nacimiento: data.departamento_nacimiento,
            pais_nacimiento: data.pais_nacimiento,
            religion: data.religion,
            direccion_actual: data.direccion_actual,
            barrio_vereda_actual: data.barrio_vereda_actual,
            ciudad_actual: data.ciudad_actual,
            departamento_actual: data.departamento_actual,
            pais_actual: data.pais_actual,
            file_doc: data.file_doc,
            file_foto: data.file_foto,
            limitaciones: data.limitaciones
                ? JSON.stringify(data.limitaciones)
                : null,
            otras_limitaciones: data.otras_limitaciones,
            capacidades: data.capacidades
                ? JSON.stringify(data.capacidades)
                : null,
            file_diagnostico: data.file_diagnostico,
            ci_puntaje: data.ci_puntaje,
            problemasalud: data.problemasalud,
            eps: data.eps,
            ips: data.ips,
            rh: data.rh,
            observaciones: data.observaciones,
            file_compromiso: data.file_compromiso,
            padre_apellido1: data.padre_apellido1,
            padre_apellido2: data.padre_apellido2,
            padre_nombre: data.padre_nombre,
            padre_cedula: data.padre_cedula,
            padre_contacto1: data.padre_contacto1,
            padre_contacto2: data.padre_contacto2,
            padre_file: data.padre_file,
            madre_apellido1: data.madre_apellido1,
            madre_apellido2: data.madre_apellido2,
            madre_nombre: data.madre_nombre,
            madre_cedula: data.madre_cedula,
            madre_contacto1: data.madre_contacto1,
            madre_contacto2: data.madre_contacto2,
            madre_file: data.madre_file,
            acudiente_apellido1: data.acudiente_apellido1,
            acudiente_apellido2: data.acudiente_apellido2,
            acudiente_nombre: data.acudiente_nombre,
            acudiente_cedula: data.acudiente_cedula,
            acudiente_contacto1: data.acudiente_contacto1,
            acudiente_contacto2: data.acudiente_contacto2,
            acudiente_file: data.acudiente_file,
            ref1_nombres: data.ref1_nombres,
            ref1_apellidos: data.ref1_apellidos,
            ref1_tel: data.ref1_tel,
            ref2_nombres: data.ref2_nombres,
            ref2_apellidos: data.ref2_apellidos,
            ref2_tel: data.ref2_tel,
            ref3_nombres: data.ref3_nombres,
            ref3_apellidos: data.ref3_apellidos,
            ref3_tel: data.ref3_tel,
            ref4_nombres: data.ref4_nombres,
            ref4_apellidos: data.ref4_apellidos,
            ref4_tel: data.ref4_tel,
            ref5_nombres: data.ref5_nombres,
            ref5_apellidos: data.ref5_apellidos,
            ref5_tel: data.ref5_tel,
            ref6_nombres: data.ref6_nombres,
            ref6_apellidos: data.ref6_apellidos,
            ref6_tel: data.ref6_tel,
      };

      const keys = Object.keys(row);
      const values = Object.values(row);
      const placeholders = keys.map(() => '?').join(',');

      const sql = `
            INSERT INTO estudiante
            (${keys.join(',')})
            VALUES (${placeholders})
        `;
      
      await conn.execute(sql, values);

      await conn.commit();
      return id_estudiante;
    } catch (err) {
      console.log(err);
      
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
