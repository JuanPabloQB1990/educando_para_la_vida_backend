import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { GradoEducacion } from '../models/gradoEducacion';

class GradoEducacionRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM grado_educacion ORDER BY orden ASC');
    return mapRowsToEntities<GradoEducacion>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM grado_educacion WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<GradoEducacion>(row) : null;
  }

  async create(nombre: string) {
    const id = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO grado_educacion (id, nombre) VALUES (?,?)', [id, nombre]);
    return { id };
  }

  async update(id: string, nombre: string) {
    const [result] = await pool.execute('UPDATE grado_educacion SET nombre = ? WHERE id = ?', [nombre, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM grado_educacion WHERE id = ?', [id]);
    return result;
  }
}

export default new GradoEducacionRepository();
