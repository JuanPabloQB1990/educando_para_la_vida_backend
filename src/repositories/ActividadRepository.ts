import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Actividad } from '../models/actividad';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class ActividadRepository {
  async findByGradoPeriodo(idGradoEducacion: string, idPeriodo: string) {
    const [rows] = await pool.query(
      `SELECT a.*, p.numero_periodo, g.nombre AS nombre_grado
       FROM actividad a
       JOIN periodo p ON a.id_periodo = p.id_periodo
       JOIN grado_educacion g ON a.id_grado_educacion = g.id_grado_educacion
       WHERE a.id_grado_educacion = ? AND a.id_periodo = ?
       ORDER BY a.semana`,
      [idGradoEducacion, idPeriodo]
    );
    return mapRowsToEntities<Actividad>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT a.*, p.numero_periodo, g.nombre AS nombre_grado
       FROM actividad a
       JOIN periodo p ON a.id_periodo = p.id_periodo
       JOIN grado_educacion g ON a.id_grado_educacion = g.id_grado_educacion
       WHERE a.id_actividad = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Actividad>(row) : null;
  }

  async create(data: { idPeriodo: string; idGradoEducacion: string; nombreActividad: string; semana: number; descripcion?: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO actividad (id_actividad, id_periodo, id_grado_educacion, nombre_actividad, semana, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.idPeriodo, data.idGradoEducacion, data.nombreActividad, data.semana, data.descripcion ?? null]
    );
    return { id };
  }

  async update(id: string, data: { nombreActividad: string; semana: number; descripcion?: string }) {
    const [result] = await pool.execute(
      'UPDATE actividad SET nombre_actividad = ?, semana = ?, descripcion = ? WHERE id_actividad = ?',
      [data.nombreActividad, data.semana, data.descripcion ?? null, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM actividad WHERE id_actividad = ?', [id]);
    return result;
  }
}

export default new ActividadRepository();
