import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { TiempoValidacion } from '../models/tiempoValidacion';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class TiempoValidacionRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM tiempo_validacion ORDER BY tiempo');
    return mapRowsToEntities<TiempoValidacion>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM tiempo_validacion WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<TiempoValidacion>(row) : null;
  }

  async create(tiempo: string) {
    const id = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO tiempo_validacion (id, tiempo) VALUES (?,?)', [id, tiempo]);
    return { id };
  }

  async update(id: string, tiempo: string) {
    const [result] = await pool.execute('UPDATE tiempo_validacion SET tiempo = ? WHERE id = ?', [tiempo, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM tiempo_validacion WHERE id = ?', [id]);
    return result;
  }
}

export default new TiempoValidacionRepository();
