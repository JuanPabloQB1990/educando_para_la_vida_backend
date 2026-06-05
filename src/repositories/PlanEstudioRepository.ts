import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { PlanEstudio } from '../models/planEstudio';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class PlanEstudioRepository {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT pe.*, g.nombre AS nombre_grado, m.nombre AS nombre_materia
       FROM plan_estudio pe
       JOIN grado_educacion g ON pe.id_grado_educacion = g.id
       JOIN materia m ON pe.id_materia = m.id
       ORDER BY g.nombre, m.nombre`
    );
    return mapRowsToEntities<PlanEstudio>(rows as any[]);
  }

  async findByGrado(idGradoEducacion: string) {
    const [rows] = await pool.query(
      `SELECT pe.*, m.nombre AS nombre_materia
       FROM plan_estudio pe
       JOIN materia m ON pe.id_materia = m.id
       WHERE pe.id_grado_educacion = ?
       ORDER BY m.nombre`,
      [idGradoEducacion]
    );
    return mapRowsToEntities<PlanEstudio>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT pe.*, g.nombre AS nombre_grado, m.nombre AS nombre_materia
       FROM plan_estudio pe
       JOIN grado_educacion g ON pe.id_grado_educacion = g.id
       JOIN materia m ON pe.id_materia = m.id
       WHERE pe.id = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<PlanEstudio>(row) : null;
  }

  async create(idGradoEducacion: string, idMateria: string) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO plan_estudio (id, id_grado_educacion, id_materia) VALUES (?, ?, ?)',
      [id, idGradoEducacion, idMateria]
    );
    return { id };
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM plan_estudio WHERE id = ?', [id]);
    return result;
  }
}

export default new PlanEstudioRepository();
