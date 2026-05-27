import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Materia } from '../models/materia';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class MateriaRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM materia ORDER BY nombre_materia');
    return mapRowsToEntities<Materia>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM materia WHERE id_materia = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Materia>(row) : null;
  }

  async create(nombreMateria: string) {
    const id = generatePrimaryKey();
    await pool.execute('INSERT INTO materia (id_materia, nombre_materia) VALUES (?, ?)', [id, nombreMateria]);
    return { id };
  }

  async update(id: string, nombreMateria: string) {
    const [result] = await pool.execute('UPDATE materia SET nombre_materia = ? WHERE id_materia = ?', [nombreMateria, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM materia WHERE id_materia = ?', [id]);
    return result;
  }
}

export default new MateriaRepository();
