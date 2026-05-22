import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { TipoDocumento } from '../models/tipoDocumento';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class TipoDocumentoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM tipo_documento ORDER BY id_tipo_documento');
    return mapRowsToEntities<TipoDocumento>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM tipo_documento WHERE id_tipo_documento = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<TipoDocumento>(row) : null;
  }

  async create(nombre: string) {
    const id_tipo_documento = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO tipo_documento (id_tipo_documento, nombre) VALUES (?,?)', [id_tipo_documento, nombre]);
    return { id: id_tipo_documento };
  }

  async update(id: string, nombre: string) {
    const [result] = await pool.execute('UPDATE tipo_documento SET nombre = ? WHERE id_tipo_documento = ?', [nombre, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM tipo_documento WHERE id_tipo_documento = ?', [id]);
    return result;
  }
}

export default new TipoDocumentoRepository();
