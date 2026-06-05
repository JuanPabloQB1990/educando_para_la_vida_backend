import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { AnioElectivo } from '../models/anioElectivo';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class AnioElectivoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM anio_electivo ORDER BY anio DESC');
    return mapRowsToEntities<AnioElectivo>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM anio_electivo WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<AnioElectivo>(row) : null;
  }

  async create(anio: number, estado: string) {
    const id = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO anio_electivo (id, anio, estado) VALUES (?,?,?)', [id, anio, estado]);
    return { id };
  }

  async update(id: string, anio: number, estado: string) {
    const [result] = await pool.execute('UPDATE anio_electivo SET anio=?, estado=? WHERE id=?', [anio, estado, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM anio_electivo WHERE id = ?', [id]);
    return result;
  }
}

export default new AnioElectivoRepository();
