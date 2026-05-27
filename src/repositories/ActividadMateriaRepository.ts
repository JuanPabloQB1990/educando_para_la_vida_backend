import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { ActividadMateria } from '../models/actividadMateria';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class ActividadMateriaRepository {
  async findByActividad(idActividad: string) {
    const [rows] = await pool.query(
      `SELECT am.*, m.nombre_materia
       FROM actividad_materia am
       JOIN materia m ON am.id_materia = m.id_materia
       WHERE am.id_actividad = ?
       ORDER BY m.nombre_materia`,
      [idActividad]
    );
    return mapRowsToEntities<ActividadMateria>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT am.*, m.nombre_materia
       FROM actividad_materia am
       JOIN materia m ON am.id_materia = m.id_materia
       WHERE am.id_actividad_materia = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<ActividadMateria>(row) : null;
  }

  async create(data: { idActividad: string; idMateria: string; idCargaAcademica: string; nombreActividad: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO actividad_materia (id_actividad_materia, id_actividad, id_materia, id_carga_academica, nombre_actividad) VALUES (?, ?, ?, ?, ?)',
      [id, data.idActividad, data.idMateria, data.idCargaAcademica, data.nombreActividad]
    );
    return { id };
  }

  async update(id: string, data: { nombreActividad: string }) {
    const [result] = await pool.execute(
      'UPDATE actividad_materia SET nombre_actividad = ? WHERE id_actividad_materia = ?',
      [data.nombreActividad, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM actividad_materia WHERE id_actividad_materia = ?', [id]);
    return result;
  }
}

export default new ActividadMateriaRepository();
