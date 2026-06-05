import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Rol } from '../models/rol';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class RolRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM rol ORDER BY nombre');
    return mapRowsToEntities<Rol>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM rol WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rol>(row) : null;
  }

  async findByName(nombre: string) {
    const [rows] = await pool.query('SELECT * FROM rol WHERE nombre = ? LIMIT 1', [nombre]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rol>(row) : null;
  }

  async create(nombre: string) {
    const id = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO rol (id, nombre) VALUES (?,?)', [id, nombre]);
    return { id };
  }

  async update(id: string, nombre: string) {
    const [result] = await pool.execute('UPDATE rol SET nombre = ? WHERE id = ?', [nombre, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM rol WHERE id = ?', [id]);
    return result;
  }
}

export default new RolRepository();
