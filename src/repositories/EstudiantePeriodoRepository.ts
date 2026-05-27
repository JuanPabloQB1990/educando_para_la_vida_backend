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
      
      const { id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, id_anio_electivo = null } = data;
      const id_estudiante_periodo = generatePrimaryKey();
      const [result] = await pool.execute(
        'INSERT INTO estudiante_periodo (id_estudiante_periodo, id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, id_anio_electivo) VALUES (?,?,?,?,?,?,?)',
        [id_estudiante_periodo, id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, id_anio_electivo]
      );
      
      return { id: id_estudiante_periodo };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, data: any) {
    const { id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, id_anio_electivo } = data;
    const [result] = await pool.execute(
      'UPDATE estudiante_periodo SET id_estudiante=?, id_tipo_estudio=?, id_tiempo_validacion=?, fecha_inscripcion=?, file_certificado_grados=?, id_anio_electivo=? WHERE id_estudiante_periodo=?',
      [id_estudiante, id_tipo_estudio, id_tiempo_validacion, fecha_inscripcion, file_certificado_grados, id_anio_electivo, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM estudiante_periodo WHERE id_estudiante_periodo = ?', [id]);
    return result;
  }
}

export default new EstudiantePeriodoRepository();
