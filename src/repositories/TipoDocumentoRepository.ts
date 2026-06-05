import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { TipoDocumento } from '../models/tipoDocumento';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class TipoDocumentoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM tipo_documento ORDER BY nombre');
    return mapRowsToEntities<TipoDocumento>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM tipo_documento WHERE id = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<TipoDocumento>(row) : null;
  }

  async create(nombre: string) {
    const id = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO tipo_documento (id, nombre) VALUES (?,?)', [id, nombre]);
    return { id };
  }

  async update(id: string, nombre: string) {
    const [result] = await pool.execute('UPDATE tipo_documento SET nombre = ? WHERE id = ?', [nombre, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM tipo_documento WHERE id = ?', [id]);
    return result;
  }
}

export default new TipoDocumentoRepository();
