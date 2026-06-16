import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { BloqueGrado } from '../models/bloqueGrado';

class BloqueGradoRepository {
  async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT bg.id_bloque, bg.id_grado_educacion, b.nombre AS nombre_bloque, g.nombre AS nombre_grado
         FROM bloque_grado bg
         JOIN bloque b ON bg.id_bloque = b.id
         JOIN grado_educacion g ON bg.id_grado_educacion = g.id
         ORDER BY b.nombre, g.nombre`
      );
      return mapRowsToEntities<BloqueGrado>(rows as any[]);
    } catch (error) {
      throw error;
    }
  }

  async findByBloque(idBloque: string) {
    try {
      const [rows] = await pool.query(
        `SELECT bg.id_bloque, bg.id_grado_educacion, b.nombre AS nombre_bloque, g.nombre AS nombre_grado
         FROM bloque_grado bg
         JOIN bloque b ON bg.id_bloque = b.id
         JOIN grado_educacion g ON bg.id_grado_educacion = g.id
         WHERE bg.id_bloque = ?
         ORDER BY g.nombre`,
        [idBloque]
      );
      return mapRowsToEntities<BloqueGrado>(rows as any[]);
    } catch (error) {
      throw error;
    }
  }

  async exists(idBloque: string, idGradoEducacion: string) {
    try {
      const [rows] = await pool.query(
        'SELECT 1 FROM bloque_grado WHERE id_bloque = ? AND id_grado_educacion = ?',
        [idBloque, idGradoEducacion]
      );
      return (rows as any[]).length > 0;
    } catch (error) {
      throw error;
    }
  }

  async create(idBloque: string, idGradoEducacion: string) {
    try {
      await pool.execute(
        'INSERT INTO bloque_grado (id_bloque, id_grado_educacion) VALUES (?, ?)',
        [idBloque, idGradoEducacion]
      );
    } catch (error) {
      throw error;
    }
  }

  async remove(idBloque: string, idGradoEducacion: string) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM bloque_grado WHERE id_bloque = ? AND id_grado_educacion = ?',
        [idBloque, idGradoEducacion]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findByGrado(idGradoEducacion: string) {
    try {
      const [rows] = await pool.query(
        'SELECT id_bloque, id_grado_educacion FROM bloque_grado WHERE id_grado_educacion = ? LIMIT 1',
        [idGradoEducacion]
      );
      const row = (rows as any[])[0] ?? null;
      return row ? mapRowToEntity<BloqueGrado>(row) : null;
    } catch (error) {
      throw error;
    }
  }
}

export default new BloqueGradoRepository();
