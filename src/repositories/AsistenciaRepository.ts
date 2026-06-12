import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Asistencia } from '../models/asistencia';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class AsistenciaRepository {
  async findByGradoPeriodo(idGradoEducacion: string, idPeriodo: string) {
    const [rows] = await pool.query(
      `SELECT a.*,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_estudiante,
              p.numero_periodo
       FROM asistencia a
       JOIN estudiante e ON a.id_estudiante = e.id
       JOIN usuario u ON e.id_usuario = u.id
       JOIN actividad act ON a.id_actividad = act.id
       JOIN periodo p ON act.id_periodo = p.id
       JOIN estudiante_matricula em ON em.id_estudiante = e.id
       JOIN grados_por_matricula gpm ON gpm.id_estudiante_matricula = em.id
       WHERE gpm.id_grado_educacion = ? AND act.id_periodo = ?
       ORDER BY a.fecha DESC, u.apellido1`,
      [idGradoEducacion, idPeriodo]
    );
    return mapRowsToEntities<Asistencia>(rows as any[]);
  }

  async findByEstudiante(idEstudiante: string, idPeriodo?: string) {
    let sql = `SELECT a.*, p.numero_periodo
               FROM asistencia a
               JOIN actividad act ON a.id_actividad = act.id
               JOIN periodo p ON act.id_periodo = p.id
               WHERE a.id_estudiante = ?`;
    const params: any[] = [idEstudiante];
    if (idPeriodo) {
      sql += ' AND act.id_periodo = ?';
      params.push(idPeriodo);
    }
    sql += ' ORDER BY a.fecha DESC';
    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<Asistencia>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM asistencia WHERE id = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Asistencia>(row) : null;
  }

  async findByEstudianteActividadFecha(idEstudiante: string, idActividad: string, fecha: string) {
    const [rows] = await pool.query(
      'SELECT * FROM asistencia WHERE id_estudiante = ? AND id_actividad = ? AND fecha = ? LIMIT 1',
      [idEstudiante, idActividad, fecha]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Asistencia>(row) : null;
  }

  async create(data: { idEstudiante: string; idActividad: string; fecha: string; estado: string; observacion?: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO asistencia (id, id_estudiante, id_actividad, fecha, estado, observacion) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.idEstudiante, data.idActividad, data.fecha, data.estado, data.observacion ?? null]
    );
    return { id };
  }

  async update(id: string, data: { fecha: string; estado: string; observacion?: string }) {
    const [result] = await pool.execute(
      'UPDATE asistencia SET fecha = ?, estado = ?, observacion = ? WHERE id = ?',
      [data.fecha, data.estado, data.observacion ?? null, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM asistencia WHERE id = ?', [id]);
    return result;
  }
}

export default new AsistenciaRepository();
