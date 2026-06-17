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
       JOIN estudiante e ON c.id_estudiante = e.id
       JOIN usuario u ON e.id_usuario = u.id
       WHERE c.id_actividad_materia = ?
       ORDER BY u.apellido1, u.nombres`,
      [idActividadMateria]
    );
    return mapRowsToEntities<Calificacion>(rows as any[]);
  }

  async findByEstudiante(idEstudiante: string, idPeriodo?: string) {
    let sql = `SELECT c.*,
                      am.nombre AS nombre_actividad,
                      m.nombre AS nombre_materia
               FROM calificacion c
               JOIN actividad_materia am ON c.id_actividad_materia = am.id
               JOIN materia m ON am.id_materia = m.id
               JOIN actividad a ON am.id_actividad = a.id
               WHERE c.id_estudiante = ?`;
    const params: any[] = [idEstudiante];
    if (idPeriodo) {
      sql += ' AND a.id_periodo = ?';
      params.push(idPeriodo);
    }
    sql += ' ORDER BY m.nombre, am.nombre';
    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<Calificacion>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM calificacion WHERE id = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Calificacion>(row) : null;
  }

  async create(data: { idEstudiante: string; idActividadMateria: string; nota: number; observacion?: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO calificacion (id, id_estudiante, id_actividad_materia, nota, observacion) VALUES (?, ?, ?, ?, ?)',
      [id, data.idEstudiante, data.idActividadMateria, data.nota, data.observacion ?? null]
    );
    return { id };
  }

  async update(id: string, data: { nota: number; observacion?: string }) {
    
    
    const [result] = await pool.execute(
      'UPDATE calificacion SET nota = ?, observacion = ? WHERE id = ?',
      [data.nota, data.observacion ?? null, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM calificacion WHERE id = ?', [id]);
    return result;
  }

  async findIdUsuarioByActividadMateria(idActividadMateria: string): Promise<string | null> {
    const [rows] = await pool.query(
      `SELECT ca.id_usuario
       FROM actividad_materia am
       JOIN carga_academica ca ON ca.id = am.id_carga_academica
       WHERE am.id = ?`,
      [idActividadMateria]
    );
    return (rows as any[])[0]?.id_usuario ?? null;
  }

  async findIdUsuarioByCalificacion(idCalificacion: string): Promise<string | null> {
    const [rows] = await pool.query(
      `SELECT ca.id_usuario
       FROM calificacion c
       JOIN actividad_materia am ON am.id = c.id_actividad_materia
       JOIN carga_academica ca ON ca.id = am.id_carga_academica
       WHERE c.id = ?`,
      [idCalificacion]
    );
    return (rows as any[])[0]?.id_usuario ?? null;
  }
}

export default new CalificacionRepository();
