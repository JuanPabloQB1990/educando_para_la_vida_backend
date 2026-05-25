import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Rubro, RubroRow } from '../models/rubro';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class RubroRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM rubro ORDER BY id_rubro');
    return mapRowsToEntities<Rubro>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM rubro WHERE id_rubro = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rubro>(row) : null;
  }

    async findByName(nombre_rubro: string) {
    const [rows] = await pool.query('SELECT * FROM rubro WHERE nombre_rubro = ? LIMIT 1', [nombre_rubro]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rubro>(row) : null;
  }

  async create(data: any) {
    const { nombre_rubro, descripcion, monto_base } = data;
    const id_rubro = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO rubro (id_rubro, nombre_rubro, descripcion, monto_base) VALUES (?,?,?,?)', [id_rubro, nombre_rubro, descripcion, monto_base]);
    return { id: id_rubro };
  }

  async update(id: string, data: any) {
    const { nombre_rubro, descripcion, monto_base } = data;
    const [result] = await pool.execute('UPDATE rubro SET nombre_rubro=?, descripcion=?, monto_base=? WHERE id_rubro=?', [nombre_rubro, descripcion, monto_base, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM rubro WHERE id_rubro = ?', [id]);
    return result;
  }
}

export default new RubroRepository();
