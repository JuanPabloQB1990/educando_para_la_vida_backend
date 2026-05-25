import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { GradosPorMatricula } from '../models/gradosPorMatricula';

class GradosPorMatriculaRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM grados_por_matricula ORDER BY id_estudiante_periodo');
    return mapRowsToEntities<GradosPorMatricula>(rows as any[]);
  }

  async findByPK(id_estudiante_periodo: string, id_grado_educacion: string) {
    const [rows] = await pool.query('SELECT * FROM grados_por_matricula WHERE id_estudiante_periodo = ? AND id_grado_educacion = ?', [id_estudiante_periodo, id_grado_educacion]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<GradosPorMatricula>(row) : null;
  }

  async createMany(values: any[]) {
    console.log(values);
    
    try {
      const sql = `INSERT INTO grados_por_matricula (id_estudiante_periodo, id_grado_educacion, estado) VALUES ?`;
    
      return pool.query(sql, [values]);
      
    } catch (error) {
      console.error('Error inserting multiple records into grados_por_matricula:', error);
      throw error;
    }
}

  async update(id_estudiante_periodo: string, id_grado_educacion: string, estado: string) {
    const [result] = await pool.execute('UPDATE grados_por_matricula SET estado=? WHERE id_estudiante_periodo=? AND id_grado_educacion=?', [estado, id_estudiante_periodo, id_grado_educacion]);
    return result;
  }

  async remove(id_estudiante_periodo: string, id_grado_educacion: string) {
    const [result] = await pool.execute('DELETE FROM grados_por_matricula WHERE id_estudiante_periodo=? AND id_grado_educacion=?', [id_estudiante_periodo, id_grado_educacion]);
    return result;
  }
}

export default new GradosPorMatriculaRepository();
