import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Actividad } from '../models/actividad';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class ActividadRepository {
  async findByGradoPeriodo(idGradoEducacion: string, idPeriodo: string) {
    const [rows] = await pool.query(
      `SELECT a.*, p.numero_periodo, g.nombre AS nombre_grado
       FROM actividad a
       JOIN periodo p ON a.id_periodo = p.id
       JOIN grado_educacion g ON a.id_grado_educacion = g.id
       WHERE a.id_grado_educacion = ? AND a.id_periodo = ?
       ORDER BY a.nombre`,
      [idGradoEducacion, idPeriodo]
    );
    return mapRowsToEntities<Actividad>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT a.*, p.numero_periodo, g.nombre AS nombre_grado
       FROM actividad a
       JOIN periodo p ON a.id_periodo = p.id
       JOIN grado_educacion g ON a.id_grado_educacion = g.id
       WHERE a.id = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Actividad>(row) : null;
  }

  async create(data: { idPeriodo: string; idGradoEducacion: string; nombre: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO actividad (id, id_periodo, id_grado_educacion, nombre) VALUES (?, ?, ?, ?)',
      [id, data.idPeriodo, data.idGradoEducacion, data.nombre]
    );
    return { id };
  }

  async update(id: string, data: { nombre: string }) {
    const [result] = await pool.execute(
      'UPDATE actividad SET nombre = ? WHERE id = ?',
      [data.nombre, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM actividad WHERE id = ?', [id]);
    return result;
  }
}

export default new ActividadRepository();
