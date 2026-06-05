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
