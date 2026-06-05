import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { DireccionGrado } from '../models/direccionGrado';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class DireccionGradoRepository {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT dg.*,
              g.nombre AS nombre_grado,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_usuario,
              ae.anio
       FROM direccion_grado dg
       JOIN grado_educacion g ON dg.id_grado_educacion = g.id
       JOIN usuario u ON dg.id_usuario = u.id
       JOIN anio_electivo ae ON dg.id_anio_electivo = ae.id
       ORDER BY ae.anio DESC, g.nombre`
    );
    return mapRowsToEntities<DireccionGrado>(rows as any[]);
  }

  async findByProfesor(idUsuario: string, idAnioElectivo?: string) {
    let sql = `SELECT dg.*,
                      g.nombre AS nombre_grado,
                      ae.anio
               FROM direccion_grado dg
               JOIN grado_educacion g ON dg.id_grado_educacion = g.id
               JOIN anio_electivo ae ON dg.id_anio_electivo = ae.id
               WHERE dg.id_usuario = ?`;
    const params: any[] = [idUsuario];
    if (idAnioElectivo) {
      sql += ' AND dg.id_anio_electivo = ?';
      params.push(idAnioElectivo);
    }
    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<DireccionGrado>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT dg.*,
              g.nombre AS nombre_grado,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_usuario,
              ae.anio
       FROM direccion_grado dg
       JOIN grado_educacion g ON dg.id_grado_educacion = g.id
       JOIN usuario u ON dg.id_usuario = u.id
       JOIN anio_electivo ae ON dg.id_anio_electivo = ae.id
       WHERE dg.id = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<DireccionGrado>(row) : null;
  }

  async create(data: { idGradoEducacion: string; idUsuario: string; idAnioElectivo: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO direccion_grado (id, id_grado_educacion, id_usuario, id_anio_electivo) VALUES (?, ?, ?, ?)',
      [id, data.idGradoEducacion, data.idUsuario, data.idAnioElectivo]
    );
    return { id };
  }

  async updateLink(id: string, linkClaseVirtual: string) {
    const [result] = await pool.execute(
      'UPDATE direccion_grado SET link_clase_virtual = ?, ultima_actualizacion_link = NOW() WHERE id = ?',
      [linkClaseVirtual, id]
    );
    return result;
  }

  async update(id: string, data: { idGradoEducacion: string; idUsuario: string; idAnioElectivo: string }) {
    const [result] = await pool.execute(
      'UPDATE direccion_grado SET id_grado_educacion = ?, id_usuario = ?, id_anio_electivo = ? WHERE id = ?',
      [data.idGradoEducacion, data.idUsuario, data.idAnioElectivo, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM direccion_grado WHERE id = ?', [id]);
    return result;
  }
}

export default new DireccionGradoRepository();
