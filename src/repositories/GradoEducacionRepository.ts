import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { GradoEducacion } from '../models/gradoEducacion';

class GradoEducacionRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM grado_educacion ORDER BY id_grado_educacion');
    return mapRowsToEntities<GradoEducacion>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM grado_educacion WHERE id_grado_educacion = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<GradoEducacion>(row) : null;
  }

  async create(nombre: string) {
    const id_grado_educacion = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO grado_educacion (id_grado_educacion, nombre) VALUES (?,?)', [id_grado_educacion, nombre]);
    return { id: id_grado_educacion };
  }

  async update(id: string, nombre: string) {
    const [result] = await pool.execute('UPDATE grado_educacion SET nombre = ? WHERE id_grado_educacion = ?', [nombre, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM grado_educacion WHERE id_grado_educacion = ?', [id]);
    return result;
  }
}

export default new GradoEducacionRepository();
