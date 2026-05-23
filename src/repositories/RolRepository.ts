import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Rol } from '../models/rol';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class RolRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM rol ORDER BY nombre_rol');
    return mapRowsToEntities<Rol>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM rol WHERE id_rol = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rol>(row) : null;
  }

  async findByName(nombre_rol: string) {
    const [rows] = await pool.query('SELECT * FROM rol WHERE nombre_rol = ? LIMIT 1', [nombre_rol]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Rol>(row) : null;
  }

  async create(nombre_rol: string) {
    const id_rol = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO rol (id_rol, nombre_rol) VALUES (?,?)', [id_rol, nombre_rol]);
    return { id: id_rol };
  }

  async update(id: string, nombre_rol: string) {
    const [result] = await pool.execute('UPDATE rol SET nombre_rol = ? WHERE id_rol = ?', [nombre_rol, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM rol WHERE id_rol = ?', [id]);
    return result;
  }
}

export default new RolRepository();
