import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { ActividadMateria } from '../models/actividadMateria';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class ActividadMateriaRepository {
  async findByActividad(idActividad: string) {
    const [rows] = await pool.query(
      `SELECT am.*, m.nombre AS nombre_materia
       FROM actividad_materia am
       JOIN materia m ON am.id_materia = m.id
       WHERE am.id_actividad = ?
       ORDER BY m.nombre`,
      [idActividad]
    );
    return mapRowsToEntities<ActividadMateria>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT am.*, m.nombre AS nombre_materia
       FROM actividad_materia am
       JOIN materia m ON am.id_materia = m.id
       WHERE am.id = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<ActividadMateria>(row) : null;
  }

  async create(data: { idActividad: string; idMateria: string; idCargaAcademica: string; nombre: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO actividad_materia (id, id_actividad, id_materia, id_carga_academica, nombre) VALUES (?, ?, ?, ?, ?)',
      [id, data.idActividad, data.idMateria, data.idCargaAcademica, data.nombre]
    );
    return { id };
  }

  async update(id: string, data: { nombre: string }) {
    const [result] = await pool.execute(
      'UPDATE actividad_materia SET nombre = ? WHERE id = ?',
      [data.nombre, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM actividad_materia WHERE id = ?', [id]);
    return result;
  }
}

export default new ActividadMateriaRepository();
