import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Pago, CreatePagoDto } from '../models/pago';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

export interface PagoAdminFilters {
  idRubro?: string;
  fechaPagoReal?: string;
  estado?: string;
  fechaVerificacion?: string;
  noDocumento?: string;
  padreCedula?: string;
  madreCedula?: string;
  acudienteCedula?: string;
}

class PagoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM pago ORDER BY id');
    return mapRowsToEntities<Pago>(rows as any[]);
  }

  async findAllForAdmin(filters: PagoAdminFilters) {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.idRubro) {
      conditions.push('op.id_rubro = ?');
      params.push(filters.idRubro);
    }
    if (filters.fechaPagoReal) {
      conditions.push('DATE(p.fecha_pago_real) = ?');
      params.push(filters.fechaPagoReal);
    }
    if (filters.estado) {
      conditions.push('p.estado = ?');
      params.push(filters.estado);
    }
    if (filters.fechaVerificacion) {
      conditions.push('DATE(p.fecha_verificacion) = ?');
      params.push(filters.fechaVerificacion);
    }
    if (filters.noDocumento) {
      conditions.push('u.no_documento LIKE ?');
      params.push(`%${filters.noDocumento}%`);
    }
    if (filters.padreCedula) {
      conditions.push('e.padre_cedula LIKE ?');
      params.push(`%${filters.padreCedula}%`);
    }
    if (filters.madreCedula) {
      conditions.push('e.madre_cedula LIKE ?');
      params.push(`%${filters.madreCedula}%`);
    }
    if (filters.acudienteCedula) {
      conditions.push('e.acudiente_cedula LIKE ?');
      params.push(`%${filters.acudienteCedula}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT
        p.id AS id_pago, p.id_obligacion_pago, p.monto_pagado, p.fecha_pago_real,
        p.file_comprobante, p.observaciones, p.estado, p.fecha_verificacion,
        op.id_rubro, op.monto_cuota, op.fecha_vencimiento, op.estado AS estado_obligacion,
        r.nombre AS nombre_rubro,
        ep.id AS id_estudiante_matricula, ep.id_estudiante, ep.fecha_inscripcion, ep.file_compromiso, ep.file_certificado_grados,
        te.nombre AS nombre_tipo_estudio,
        tv.tiempo AS tiempo_validacion,
        e.fecha_nacimiento, e.edad, e.sexo,
        e.municipio_nacimiento, e.departamento_nacimiento, e.pais_nacimiento,
        e.religion, e.direccion_actual, e.barrio_vereda_actual, e.ciudad_actual,
        e.departamento_actual, e.pais_actual,
        e.file_foto, e.file_doc, e.file_diagnostico,
        e.ref1_nombres, e.ref1_apellidos, e.ref1_tel,
        e.ref2_nombres, e.ref2_apellidos, e.ref2_tel,
        e.ref3_nombres, e.ref3_apellidos, e.ref3_tel,
        e.ref4_nombres, e.ref4_apellidos, e.ref4_tel,
        e.ref5_nombres, e.ref5_apellidos, e.ref5_tel,
        e.ref6_nombres, e.ref6_apellidos, e.ref6_tel,
        e.limitaciones, e.otras_limitaciones, e.capacidades, e.ci_puntaje,
        e.padre_apellido1, e.padre_apellido2, e.padre_nombre, e.padre_cedula,
        e.padre_contacto1, e.padre_contacto2, e.padre_file,
        e.madre_apellido1, e.madre_apellido2, e.madre_nombre, e.madre_cedula,
        e.madre_contacto1, e.madre_contacto2, e.madre_file,
        e.acudiente_apellido1, e.acudiente_apellido2, e.acudiente_nombre, e.acudiente_cedula,
        e.acudiente_contacto1, e.acudiente_contacto2, e.acudiente_file,
        e.problemasalud, e.eps, e.ips, e.rh,
        e.observaciones AS observaciones_estudiante,
        u.nombres, u.apellido1, u.apellido2, u.no_documento, u.email,
        u.contacto1, u.contacto2, u.estado AS estado_usuario, u.fecha_expedicion_documento,
        td.nombre AS nombre_tipo_documento
      FROM pago p
      INNER JOIN obligacion_pago op ON p.id_obligacion_pago = op.id
      INNER JOIN rubro r ON op.id_rubro = r.id
      INNER JOIN estudiante_matricula ep ON op.id_estudiante_matricula = ep.id
      INNER JOIN estudiante e ON ep.id_estudiante = e.id
      INNER JOIN usuario u ON e.id_usuario = u.id
      LEFT JOIN tipo_documento td ON u.id_tipo_documento = td.id
      LEFT JOIN tipo_estudio te ON ep.id_tipo_estudio = te.id
      LEFT JOIN tiempo_validacion tv ON ep.id_tiempo_validacion = tv.id
      ${where}
      ORDER BY p.fecha_pago_real DESC
    `;

    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<any>(rows as any[]);
  }

  async aprobarRechazar(
    idPago: string,
    accion: 'aprobado' | 'rechazado',
    observaciones?: string,
    idObligacionPagoNuevo?: string,
    montoPagado?: string
  ) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [pagoRows] = await conn.query(
        'SELECT id_obligacion_pago FROM pago WHERE id = ?',
        [idPago]
      );
      const pagoActual = (pagoRows as any[])[0];
      if (!pagoActual) throw new Error('Pago no encontrado');

      const idObligacionActual: string = pagoActual.id_obligacion_pago;
      const idObligacionFinal = idObligacionPagoNuevo ?? idObligacionActual;
      const cambiandoObligacion = idObligacionPagoNuevo && idObligacionPagoNuevo !== idObligacionActual;

      const setClauses: string[] = ['estado = ?', 'fecha_verificacion = NOW()', 'observaciones = ?'];
      const values: unknown[] = [accion, observaciones ?? null];

      if (cambiandoObligacion) {
        setClauses.push('id_obligacion_pago = ?');
        values.push(idObligacionFinal);
      }
      if (montoPagado !== undefined) {
        setClauses.push('monto_pagado = ?');
        values.push(montoPagado);
      }
      values.push(idPago);

      await conn.execute(`UPDATE pago SET ${setClauses.join(', ')} WHERE id = ?`, values as any);

      if (cambiandoObligacion) {
        const [oldOpRows] = await conn.query(
          'SELECT estado, fecha_vencimiento FROM obligacion_pago WHERE id = ?',
          [idObligacionActual]
        );
        const oldOp = (oldOpRows as any[])[0];
        if (oldOp?.estado === 'pagado') {
          const fechaVenc = oldOp.fecha_vencimiento ? new Date(oldOp.fecha_vencimiento) : null;
          const estadoRevertido = fechaVenc && fechaVenc < new Date() ? 'vencido' : 'pendiente';
          await conn.execute(
            'UPDATE obligacion_pago SET estado = ? WHERE id = ?',
            [estadoRevertido, idObligacionActual]
          );
        }
      }

      let estadoObligacion: string;
      if (accion === 'aprobado') {
        estadoObligacion = 'pagado';
      } else {
        const [opRows] = await conn.query(
          'SELECT fecha_vencimiento FROM obligacion_pago WHERE id = ?',
          [idObligacionFinal]
        );
        const op = (opRows as any[])[0];
        const fechaVenc = op?.fecha_vencimiento ? new Date(op.fecha_vencimiento) : null;
        estadoObligacion = fechaVenc && fechaVenc < new Date() ? 'vencido' : 'pendiente';
      }

      await conn.execute(
        'UPDATE obligacion_pago SET estado = ? WHERE id = ?',
        [estadoObligacion, idObligacionFinal]
      );

      await conn.commit();
      return { idPago, accion, estadoObligacion };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async findByObligacionPago(idObligacionPago: string) {
    const [rows] = await pool.query('SELECT * FROM pago WHERE id_obligacion_pago = ? LIMIT 1', [idObligacionPago]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Pago>(row) : null;
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM pago WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Pago>(row) : null;
  }

  async create(data: CreatePagoDto) {
    const { id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion } = data;
    const id = generatePrimaryKey();
    await pool.execute('INSERT INTO pago (id, id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion) VALUES (?,?,?,?,?,?,?,?)', [id, id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion]);
    return { id };
  }

  async updateComprobante(id: string, fileComprobante: string, fechaPagoReal: Date) {
    await pool.execute(
      'UPDATE pago SET file_comprobante = ?, fecha_pago_real = ?, estado = ?, observaciones = NULL, fecha_verificacion = NULL WHERE id = ?',
      [fileComprobante, fechaPagoReal, 'pendiente', id]
    );
  }

  async update(id: string, data: CreatePagoDto) {
    const { id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion } = data;
    const [result] = await pool.execute('UPDATE pago SET id_obligacion_pago=?, monto_pagado=?, fecha_pago_real=?, file_comprobante=?, observaciones=?, estado=?, fecha_verificacion=? WHERE id=?', [id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM pago WHERE id = ?', [id]);
    return result;
  }
}

export default new PagoRepository();
