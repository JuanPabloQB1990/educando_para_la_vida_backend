import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { CargaAcademica } from '../models/cargaAcademica';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class CargaAcademicaRepository {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT ca.*,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_usuario,
              m.nombre_materia,
              g.nombre AS nombre_grado,
              ae.anio
       FROM carga_academica ca
       JOIN usuario u ON ca.id_usuario = u.id_usuario
       JOIN materia m ON ca.id_materia = m.id_materia
       JOIN grado_educacion g ON ca.id_grado_educacion = g.id_grado_educacion
       JOIN anio_electivo ae ON ca.id_anio_electivo = ae.id_anio_electivo
       ORDER BY ae.anio DESC, g.nombre, m.nombre_materia`
    );
    return mapRowsToEntities<CargaAcademica>(rows as any[]);
  }

  async findByProfesor(idUsuario: string, idAnioElectivo?: string) {
    let sql = `SELECT ca.*,
                      m.nombre_materia,
                      g.nombre AS nombre_grado,
                      ae.anio
               FROM carga_academica ca
               JOIN materia m ON ca.id_materia = m.id_materia
               JOIN grado_educacion g ON ca.id_grado_educacion = g.id_grado_educacion
               JOIN anio_electivo ae ON ca.id_anio_electivo = ae.id_anio_electivo
               WHERE ca.id_usuario = ?`;
    const params: any[] = [idUsuario];
    if (idAnioElectivo) {
      sql += ' AND ca.id_anio_electivo = ?';
      params.push(idAnioElectivo);
    }
    sql += ' ORDER BY ae.anio DESC, g.nombre, m.nombre_materia';
    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<CargaAcademica>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT ca.*,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_usuario,
              m.nombre_materia,
              g.nombre AS nombre_grado,
              ae.anio
       FROM carga_academica ca
       JOIN usuario u ON ca.id_usuario = u.id_usuario
       JOIN materia m ON ca.id_materia = m.id_materia
       JOIN grado_educacion g ON ca.id_grado_educacion = g.id_grado_educacion
       JOIN anio_electivo ae ON ca.id_anio_electivo = ae.id_anio_electivo
       WHERE ca.id_carga_academica = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<CargaAcademica>(row) : null;
  }

  async create(data: { idUsuario: string; idMateria: string; idGradoEducacion: string; idAnioElectivo: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO carga_academica (id_carga_academica, id_usuario, id_materia, id_grado_educacion, id_anio_electivo) VALUES (?, ?, ?, ?, ?)',
      [id, data.idUsuario, data.idMateria, data.idGradoEducacion, data.idAnioElectivo]
    );
    return { id };
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM carga_academica WHERE id_carga_academica = ?', [id]);
    return result;
  }
}

export default new CargaAcademicaRepository();
