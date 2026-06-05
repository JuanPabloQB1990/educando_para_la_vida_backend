import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { TipoEstudio } from '../models/tipoEstudio';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class TipoEstudioRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM tipo_estudio ORDER BY nombre');
    return mapRowsToEntities<TipoEstudio>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM tipo_estudio WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<TipoEstudio>(row) : null;
  }

  async create(nombre: string) {
    const id = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO tipo_estudio (id, nombre) VALUES (?,?)', [id, nombre]);
    return { id };
  }

  async update(id: string, nombre: string) {
    const [result] = await pool.execute('UPDATE tipo_estudio SET nombre = ? WHERE id = ?', [nombre, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM tipo_estudio WHERE id = ?', [id]);
    return result;
  }
}

export default new TipoEstudioRepository();
