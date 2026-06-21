import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { EstudianteMatricula } from '../models/estudianteMatricula';

class EstudianteMatriculaRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM estudiante_matricula ORDER BY id');
    return mapRowsToEntities<EstudianteMatricula>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM estudiante_matricula WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<EstudianteMatricula>(row) : null;
  }

  async create(data: any) {
    try {
      const { id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo = null } = data;
      const id = generatePrimaryKey();
      await pool.execute(
        'INSERT INTO estudiante_matricula (id, id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo) VALUES (?,?,?,?,?,?,?,?)',
        [id, id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo]
      );
      return { id };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: any) {
    const { id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo } = data;
    const [result] = await pool.execute(
      'UPDATE estudiante_matricula SET id_estudiante=?, id_tipo_estudio=?, id_tiempo_validacion=?, fecha_inscripcion=?, file_certificado_grados=?, file_compromiso=?, id_anio_electivo=? WHERE id=?',
      [id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM estudiante_matricula WHERE id = ?', [id]);
    return result;
  }

  async findAllByEstudiante(idEstudiante: string) {
    const sql = `
      SELECT em.*,
             te.nombre AS nombre_tipo_estudio,
             ae.anio AS anio_electivo_anio, ae.estado AS anio_electivo_estado,
             tv.tiempo AS meses_tiempo_validacion
      FROM estudiante_matricula em
      LEFT JOIN tipo_estudio te ON em.id_tipo_estudio = te.id
      LEFT JOIN anio_electivo ae ON em.id_anio_electivo = ae.id
      LEFT JOIN tiempo_validacion tv ON em.id_tiempo_validacion = tv.id
      WHERE em.id_estudiante = ?
      ORDER BY em.created_at DESC
    `;
    const [rows] = await pool.query(sql, [idEstudiante]);
    return mapRowsToEntities<any>(rows as any[]);
  }

  async findMostRecentByEstudiante(idEstudiante: string) {
    try {
      const sql = `
        SELECT em.*,
          ae.anio AS anio_electivo_anio, ae.estado AS anio_electivo_estado,
          te.nombre AS nombre_tipo_estudio,
          tv.tiempo AS meses_tiempo_validacion
        FROM estudiante_matricula em
        LEFT JOIN anio_electivo ae ON em.id_anio_electivo = ae.id
        LEFT JOIN tipo_estudio te ON em.id_tipo_estudio = te.id
        LEFT JOIN tiempo_validacion tv ON em.id_tiempo_validacion = tv.id
        WHERE em.id_estudiante = ?
        ORDER BY em.created_at DESC
        LIMIT 1
      `;
      const [rows] = await pool.query(sql, [idEstudiante]);
      const row = (rows as any[])[0] || null;
      return row ? mapRowToEntity<any>(row) : null;
    } catch (error) {
      throw error;
    }
  }

  async updateEstudio(id: string, idTipoEstudio: string, idTiempoValidacion: string | null) {
    await pool.execute(
      'UPDATE estudiante_matricula SET id_tipo_estudio = ?, id_tiempo_validacion = ? WHERE id = ?',
      [idTipoEstudio, idTiempoValidacion, id]
    );
  }

  async matricularAnio(
    idEstudianteMatricula: string,
    idAnioElectivo: string,
    anio: number,
    idRubro: string,
    montoBase: string,
    meses: number[],
    actualizarAnioElectivo: boolean
  ): Promise<void> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      if (actualizarAnioElectivo) {
        await conn.execute(
          'UPDATE estudiante_matricula SET id_anio_electivo = ? WHERE id = ?',
          [idAnioElectivo, idEstudianteMatricula]
        );
      }

      for (const mes of meses) {
        const fechaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-27 23:59:00`;
        const idObligacion = generatePrimaryKey();
        await conn.execute(
          'INSERT INTO obligacion_pago (id, id_estudiante_matricula, id_rubro, monto_cuota, fecha_vencimiento, estado) VALUES (?,?,?,?,?,?)',
          [idObligacion, idEstudianteMatricula, idRubro, montoBase, fechaStr, 'pendiente']
        );
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}

export default new EstudianteMatriculaRepository();
