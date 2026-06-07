import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { GradosPorMatricula } from '../models/gradosPorMatricula';

class GradosPorMatriculaRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM grados_por_matricula ORDER BY id_estudiante_matricula');
    return mapRowsToEntities<GradosPorMatricula>(rows as any[]);
  }

  async findByPK(id_estudiante_matricula: string, id_grado_educacion: string) {
    const [rows] = await pool.query('SELECT * FROM grados_por_matricula WHERE id_estudiante_matricula = ? AND id_grado_educacion = ?', [id_estudiante_matricula, id_grado_educacion]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<GradosPorMatricula>(row) : null;
  }

  async createMany(values: any[]) {
    try {
      const sql = `INSERT INTO grados_por_matricula (id_estudiante_matricula, id_grado_educacion, estado) VALUES ?`;
      return pool.query(sql, [values]);
    } catch (error) {
      throw error;
    }
  }

  async update(id_estudiante_matricula: string, id_grado_educacion: string, estado: string) {
    const [result] = await pool.execute('UPDATE grados_por_matricula SET estado=? WHERE id_estudiante_matricula=? AND id_grado_educacion=?', [estado, id_estudiante_matricula, id_grado_educacion]);
    return result;
  }

  async remove(id_estudiante_matricula: string, id_grado_educacion: string) {
    const [result] = await pool.execute('DELETE FROM grados_por_matricula WHERE id_estudiante_matricula=? AND id_grado_educacion=?', [id_estudiante_matricula, id_grado_educacion]);
    return result;
  }

  async findByEstudianteMatricula(id_estudiante_matricula: string) {
    try {
      const sql = `
        SELECT gpm.id_estudiante_matricula, gpm.id_grado_educacion, gpm.estado,
               ge.nombre AS nombre_grado
        FROM grados_por_matricula gpm
        INNER JOIN grado_educacion ge ON gpm.id_grado_educacion = ge.id
        WHERE gpm.id_estudiante_matricula = ?
        ORDER BY ge.orden
      `;
      const [rows] = await pool.query(sql, [id_estudiante_matricula]);
      return mapRowsToEntities<any>(rows as any[]);
    } catch (error) {
      throw error;
    }
  }
}

export default new GradosPorMatriculaRepository();
