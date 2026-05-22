import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { TipoEstudio } from '../models/tipoEstudio';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class TipoEstudioRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM tipo_estudio ORDER BY id_tipo_estudio');
    return mapRowsToEntities<TipoEstudio>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM tipo_estudio WHERE id_tipo_estudio = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<TipoEstudio>(row) : null;
  }

  async create(nombre: string) {
    const id_tipo_estudio = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO tipo_estudio (id_tipo_estudio, nombre) VALUES (?,?)', [id_tipo_estudio, nombre]);
    return { id: id_tipo_estudio };
  }

  async update(id: string, nombre: string) {
    const [result] = await pool.execute('UPDATE tipo_estudio SET nombre = ? WHERE id_tipo_estudio = ?', [nombre, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM tipo_estudio WHERE id_tipo_estudio = ?', [id]);
    return result;
  }
}

export default new TipoEstudioRepository();
