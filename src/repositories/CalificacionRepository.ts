import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Calificacion } from '../models/calificacion';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class CalificacionRepository {
  async findByActividadMateria(idActividadMateria: string) {
    const [rows] = await pool.query(
      `SELECT c.*,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_estudiante
       FROM calificacion c
       JOIN estudiante e ON c.id_estudiante = e.id_estudiante
       JOIN usuario u ON e.id_usuario = u.id_usuario
       WHERE c.id_actividad_materia = ?
       ORDER BY u.apellido1, u.nombres`,
      [idActividadMateria]
    );
    return mapRowsToEntities<Calificacion>(rows as any[]);
  }

  async findByEstudiante(idEstudiante: string, idPeriodo?: string) {
    let sql = `SELECT c.*,
                      am.nombre_actividad,
                      m.nombre_materia
               FROM calificacion c
               JOIN actividad_materia am ON c.id_actividad_materia = am.id_actividad_materia
               JOIN materia m ON am.id_materia = m.id_materia
               JOIN actividad a ON am.id_actividad = a.id_actividad
               WHERE c.id_estudiante = ?`;
    const params: any[] = [idEstudiante];
    if (idPeriodo) {
      sql += ' AND a.id_periodo = ?';
      params.push(idPeriodo);
    }
    sql += ' ORDER BY m.nombre_materia, am.nombre_actividad';
    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<Calificacion>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM calificacion WHERE id_calificacion = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Calificacion>(row) : null;
  }

  async create(data: { idEstudiante: string; idActividadMateria: string; nota: number; observacion?: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO calificacion (id_calificacion, id_estudiante, id_actividad_materia, nota, observacion) VALUES (?, ?, ?, ?, ?)',
      [id, data.idEstudiante, data.idActividadMateria, data.nota, data.observacion ?? null]
    );
    return { id };
  }

  async update(id: string, data: { nota: number; observacion?: string }) {
    const [result] = await pool.execute(
      'UPDATE calificacion SET nota = ?, observacion = ? WHERE id_calificacion = ?',
      [data.nota, data.observacion ?? null, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM calificacion WHERE id_calificacion = ?', [id]);
    return result;
  }
}

export default new CalificacionRepository();
