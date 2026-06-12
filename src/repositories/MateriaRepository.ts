import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Materia } from '../models/materia';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class MateriaRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM materia ORDER BY nombre');
    return mapRowsToEntities<Materia>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM materia WHERE id = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Materia>(row) : null;
  }

  async create(nombre: string, abreviatura: string) {
    const id = generatePrimaryKey();
    await pool.execute('INSERT INTO materia (id, nombre, abreviatura) VALUES (?, ?, ?)', [id, nombre, abreviatura]);
    return { id };
  }

  async update(id: string, nombre: string, abreviatura: string) {
    const [result] = await pool.execute('UPDATE materia SET nombre = ?, abreviatura = ? WHERE id = ?', [nombre, abreviatura, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM materia WHERE id = ?', [id]);
    return result;
  }
}

export default new MateriaRepository();
