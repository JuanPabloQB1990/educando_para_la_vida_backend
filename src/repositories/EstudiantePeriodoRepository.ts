import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { EstudiantePeriodo } from '../models/estudiantePeriodo';

class EstudiantePeriodoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM estudiante_periodo ORDER BY id_estudiante_periodo');
    return mapRowsToEntities<EstudiantePeriodo>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM estudiante_periodo WHERE id_estudiante_periodo = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<EstudiantePeriodo>(row) : null;
  }

  async create(data: any) {
    
    try {
      
      const { id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo = null } = data;
      const id_estudiante_periodo = generatePrimaryKey();
      const [result] = await pool.execute(
        'INSERT INTO estudiante_periodo (id_estudiante_periodo, id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo) VALUES (?,?,?,?,?,?,?,?)',
        [id_estudiante_periodo, id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo]
      );
      
      return { id: id_estudiante_periodo };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, data: any) {
    const { id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo } = data;
    const [result] = await pool.execute(
      'UPDATE estudiante_periodo SET id_estudiante=?, id_tipo_estudio=?, id_tiempo_validacion=?, fecha_inscripcion=?, file_certificado_grados=?, file_compromiso=?, id_anio_electivo=? WHERE id_estudiante_periodo=?',
      [id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, file_compromiso, id_anio_electivo, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM estudiante_periodo WHERE id_estudiante_periodo = ?', [id]);
    return result;
  }

  async matricularAnio(
    idEstudiantePeriodo: string,
    idAnioElectivo: string,
    anio: number,
    idRubro: string,
    montoBase: string,
    meses: number[]
  ): Promise<void> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.execute(
        'UPDATE estudiante_periodo SET id_anio_electivo = ? WHERE id_estudiante_periodo = ?',
        [idAnioElectivo, idEstudiantePeriodo]
      );

      for (const mes of meses) {
        const fechaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-27 23:59:00`;
        const idObligacion = generatePrimaryKey();
        await conn.execute(
          'INSERT INTO obligacion_pago (id_obligacion_pago, id_estudiante_periodo, id_rubro, monto_cuota, fecha_vencimiento, estado) VALUES (?,?,?,?,?,?)',
          [idObligacion, idEstudiantePeriodo, idRubro, montoBase, fechaStr, 'pendiente']
        );
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      console.error(error);
      throw error;
    } finally {
      conn.release();
    }
  }
}

export default new EstudiantePeriodoRepository();
