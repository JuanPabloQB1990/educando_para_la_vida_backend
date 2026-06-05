import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Bloque } from '../models/bloque';

class BloqueRepository {
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM bloque ORDER BY nombre');
      return mapRowsToEntities<Bloque>(rows as any[]);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const [rows] = await pool.query('SELECT * FROM bloque WHERE id = ?', [id]);
      const row = (rows as any[])[0] || null;
      return row ? mapRowToEntity<Bloque>(row) : null;
    } catch (error) {
      throw error;
    }
  }

  async create(nombre: string) {
    try {
      const id = generatePrimaryKey();
      await pool.execute('INSERT INTO bloque (id, nombre) VALUES (?, ?)', [id, nombre]);
      return { id };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, nombre: string) {
    try {
      const [result] = await pool.execute('UPDATE bloque SET nombre = ? WHERE id = ?', [nombre, id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const [result] = await pool.execute('DELETE FROM bloque WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new BloqueRepository();
