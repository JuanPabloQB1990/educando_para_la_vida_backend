import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { ClassroomEntrega, ClassroomEntregaAdjunto } from '../models/classroomEntrega';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class ClassroomEntregaRepository {
  async findByTarea(idTarea: string) {
    const [rows] = await pool.query(
      `SELECT ce.*,
              ct.titulo AS titulo_tarea,
              CONCAT(u.nombres, ' ', u.apellido1) AS nombre_estudiante
       FROM classroom_entrega ce
       JOIN classroom_tarea ct ON ce.id_classroom_tarea = ct.id_classroom_tarea
       JOIN estudiante e ON ce.id_estudiante = e.id_estudiante
       JOIN usuario u ON e.id_usuario = u.id_usuario
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
       JOIN classroom_tarea ct ON ce.id_classroom_tarea = ct.id_classroom_tarea
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
       JOIN classroom_tarea ct ON ce.id_classroom_tarea = ct.id_classroom_tarea
       WHERE ce.id_classroom_entrega = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<ClassroomEntrega>(row) : null;
  }

  async create(data: { idClassroomTarea: string; idEstudiante: string; estadoEntrega: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO classroom_entrega (id_classroom_entrega, id_classroom_tarea, id_estudiante, fecha_entrega, estado_entrega) VALUES (?, ?, ?, NOW(), ?)',
      [id, data.idClassroomTarea, data.idEstudiante, data.estadoEntrega]
    );
    return { id };
  }

  async updateEstado(id: string, data: { estadoEntrega: string; observacionProfesor?: string }) {
    const [result] = await pool.execute(
      'UPDATE classroom_entrega SET estado_entrega = ?, observacion_profesor = ? WHERE id_classroom_entrega = ?',
      [data.estadoEntrega, data.observacionProfesor ?? null, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM classroom_entrega WHERE id_classroom_entrega = ?', [id]);
    return result;
  }

  // Adjuntos
  async findAdjuntos(idEntrega: string) {
    const [rows] = await pool.query(
      'SELECT * FROM classroom_entrega_adjunto WHERE id_classroom_entrega = ?',
      [idEntrega]
    );
    return mapRowsToEntities<ClassroomEntregaAdjunto>(rows as any[]);
  }

  async createAdjunto(data: { idClassroomEntrega: string; urlArchivo: string; nombreArchivo: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO classroom_entrega_adjunto (id_classroom_entrega_adjunto, id_classroom_entrega, url_archivo, nombre_archivo) VALUES (?, ?, ?, ?)',
      [id, data.idClassroomEntrega, data.urlArchivo, data.nombreArchivo]
    );
    return { id };
  }

  async removeAdjunto(id: string) {
    const [result] = await pool.execute('DELETE FROM classroom_entrega_adjunto WHERE id_classroom_entrega_adjunto = ?', [id]);
    return result;
  }
}

export default new ClassroomEntregaRepository();
