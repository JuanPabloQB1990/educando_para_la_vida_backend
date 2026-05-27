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
       JOIN estudiante e ON a.id_estudiante = e.id_estudiante
       JOIN usuario u ON e.id_usuario = u.id_usuario
       JOIN periodo p ON a.id_periodo = p.id_periodo
       JOIN estudiante_periodo ep ON ep.id_estudiante = e.id_estudiante
       JOIN grados_por_matricula gpm ON gpm.id_estudiante_periodo = ep.id_estudiante_periodo
       WHERE gpm.id_grado_educacion = ? AND a.id_periodo = ?
       ORDER BY a.fecha DESC, u.apellido1`,
      [idGradoEducacion, idPeriodo]
    );
    return mapRowsToEntities<Asistencia>(rows as any[]);
  }

  async findByEstudiante(idEstudiante: string, idPeriodo?: string) {
    let sql = `SELECT a.*, p.numero_periodo
               FROM asistencia a
               JOIN periodo p ON a.id_periodo = p.id_periodo
               WHERE a.id_estudiante = ?`;
    const params: any[] = [idEstudiante];
    if (idPeriodo) {
      sql += ' AND a.id_periodo = ?';
      params.push(idPeriodo);
    }
    sql += ' ORDER BY a.fecha DESC';
    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<Asistencia>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM asistencia WHERE id_asistencia = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Asistencia>(row) : null;
  }

  async create(data: { idEstudiante: string; idPeriodo: string; fecha: string; estadoAsistencia: string; observacion?: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO asistencia (id_asistencia, id_estudiante, id_periodo, fecha, estado_asistencia, observacion) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.idEstudiante, data.idPeriodo, data.fecha, data.estadoAsistencia, data.observacion ?? null]
    );
    return { id };
  }

  async update(id: string, data: { fecha: string; estadoAsistencia: string; observacion?: string }) {
    const [result] = await pool.execute(
      'UPDATE asistencia SET fecha = ?, estado_asistencia = ?, observacion = ? WHERE id_asistencia = ?',
      [data.fecha, data.estadoAsistencia, data.observacion ?? null, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM asistencia WHERE id_asistencia = ?', [id]);
    return result;
  }
}

export default new AsistenciaRepository();
