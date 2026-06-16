import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { ClassroomEntrega, ClassroomEntregaAdjunto } from '../models/classroomEntrega';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class ClassroomEntregaRepository {
  async findByCarga(idCargaAcademica: string, idPeriodo?: string) {
    const params: string[] = [idCargaAcademica];
    let sql = `
      SELECT ce.*,
             ct.titulo AS titulo_tarea,
             CONCAT(u.nombres, ' ', u.apellido1) AS nombre_estudiante
      FROM classroom_entrega ce
      JOIN classroom_tarea ct ON ce.id_classroom_tarea = ct.id
      JOIN estudiante e ON ce.id_estudiante = e.id
      JOIN usuario u ON e.id_usuario = u.id
      WHERE ct.id_carga_academica = ?`;
    if (idPeriodo) {
      sql += ' AND ct.id_periodo = ?';
      params.push(idPeriodo);
    }
    sql += ' ORDER BY ct.titulo, ce.fecha_entrega DESC';
    const [rows] = await pool.query(sql, params);
    return mapRowsToEntities<ClassroomEntrega>(rows as any[]);
  }

  async findByTarea(idTarea: string) {
    const [rows] = await pool.query(
      `SELECT ce.*,
              ct.titulo AS titulo_tarea,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_estudiante
       FROM classroom_entrega ce
       JOIN classroom_tarea ct ON ce.id_classroom_tarea = ct.id
       JOIN estudiante e ON ce.id_estudiante = e.id
       JOIN usuario u ON e.id_usuario = u.id
       WHERE ce.id_classroom_tarea = ?
       ORDER BY ce.fecha_entrega DESC`,
      [idTarea]
    );
    return mapRowsToEntities<ClassroomEntrega>(rows as any[]);
  }

  async findByEstudiante(idEstudiante: string) {
    const [rows] = await pool.query(
      `SELECT ce.*, ct.titulo AS titulo_tarea
       FROM classroom_entrega ce
       JOIN classroom_tarea ct ON ce.id_classroom_tarea = ct.id
       WHERE ce.id_estudiante = ?
       ORDER BY ce.fecha_entrega DESC`,
      [idEstudiante]
    );
    return mapRowsToEntities<ClassroomEntrega>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT ce.*, ct.titulo AS titulo_tarea
       FROM classroom_entrega ce
       JOIN classroom_tarea ct ON ce.id_classroom_tarea = ct.id
       WHERE ce.id = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<ClassroomEntrega>(row) : null;
  }

  async create(data: { idClassroomTarea: string; idEstudiante: string; estado: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO classroom_entrega (id, id_classroom_tarea, id_estudiante, fecha_entrega, estado) VALUES (?, ?, ?, NOW(), ?)',
      [id, data.idClassroomTarea, data.idEstudiante, data.estado]
    );
    return { id };
  }

  async updateEstado(id: string, data: { estado: string; observacionProfesor?: string }) {
    const [result] = await pool.execute(
      'UPDATE classroom_entrega SET estado = ?, observacion_profesor = ? WHERE id = ?',
      [data.estado, data.observacionProfesor ?? null, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM classroom_entrega WHERE id = ?', [id]);
    return result;
  }

  async findByEstudianteAndTarea(idEstudiante: string, idClassroomTarea: string) {
    const [rows] = await pool.query(
      'SELECT * FROM classroom_entrega WHERE id_estudiante = ? AND id_classroom_tarea = ? LIMIT 1',
      [idEstudiante, idClassroomTarea]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<ClassroomEntrega>(row) : null;
  }

  async findAdjuntos(idEntrega: string) {
    const [rows] = await pool.query(
      'SELECT * FROM classroom_entrega_adjunto WHERE id_classroom_entrega = ?',
      [idEntrega]
    );
    return mapRowsToEntities<ClassroomEntregaAdjunto>(rows as any[]);
  }

  async findAdjuntoById(id: string) {
    const [rows] = await pool.query(
      'SELECT * FROM classroom_entrega_adjunto WHERE id = ? LIMIT 1',
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<ClassroomEntregaAdjunto>(row) : null;
  }

  async createAdjunto(data: { idClassroomEntrega: string; urlArchivo: string; nombreArchivo: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO classroom_entrega_adjunto (id, id_classroom_entrega, url_archivo, nombre_archivo) VALUES (?, ?, ?, ?)',
      [id, data.idClassroomEntrega, data.urlArchivo, data.nombreArchivo]
    );
    return { id };
  }

  async removeAdjunto(id: string) {
    const [result] = await pool.execute('DELETE FROM classroom_entrega_adjunto WHERE id = ?', [id]);
    return result;
  }
}

export default new ClassroomEntregaRepository();
