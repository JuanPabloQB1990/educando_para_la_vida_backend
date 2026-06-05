import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Rubro } from '../models/rubro';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class RubroRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM rubro ORDER BY nombre');
    return mapRowsToEntities<Rubro>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM rubro WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rubro>(row) : null;
  }

  async findByName(nombre: string) {
    const [rows] = await pool.query('SELECT * FROM rubro WHERE nombre = ? LIMIT 1', [nombre]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rubro>(row) : null;
  }

  async create(data: any) {
    const { nombre, descripcion, monto_base } = data;
    const id = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO rubro (id, nombre, descripcion, monto_base) VALUES (?,?,?,?)', [id, nombre, descripcion, monto_base]);
    return { id };
  }

  async update(id: string, data: any) {
    const { nombre, descripcion, monto_base } = data;
    const [result] = await pool.execute('UPDATE rubro SET nombre=?, descripcion=?, monto_base=? WHERE id=?', [nombre, descripcion, monto_base, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM rubro WHERE id = ?', [id]);
    return result;
  }
}

export default new RubroRepository();
