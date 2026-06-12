import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class AutoevaluacionRepository {
  async findByGradoPeriodo(idGradoEducacion: string, idPeriodo: string) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM autoevaluacion WHERE id_grado_educacion = ? AND id_periodo = ?`,
        [idGradoEducacion, idPeriodo]
      );
      return rows as any[];
    } catch (error) {
      throw error;
    }
  }

  async upsert(data: {
    idEstudiante: string;
    idPeriodo: string;
    idGradoEducacion: string;
    nota: number;
    observacion?: string | null;
  }) {
    try {
      const id = generatePrimaryKey();
      await pool.query(
        `INSERT INTO autoevaluacion (id, id_estudiante, id_periodo, id_grado_educacion, nota, observacion)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nota = VALUES(nota), observacion = VALUES(observacion), updated_at = NOW()`,
        [id, data.idEstudiante, data.idPeriodo, data.idGradoEducacion, data.nota, data.observacion ?? null]
      );
      const [rows] = await pool.query(
        `SELECT * FROM autoevaluacion WHERE id_estudiante = ? AND id_periodo = ? AND id_grado_educacion = ?`,
        [data.idEstudiante, data.idPeriodo, data.idGradoEducacion]
      );
      return (rows as any[])[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await pool.query(`DELETE FROM autoevaluacion WHERE id = ?`, [id]);
    } catch (error) {
      throw error;
    }
  }
}

export default new AutoevaluacionRepository();
