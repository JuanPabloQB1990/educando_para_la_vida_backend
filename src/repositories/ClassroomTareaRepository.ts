import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { ClassroomTarea, ClassroomTareaAdjunto } from '../models/classroomTarea';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class ClassroomTareaRepository {
  async findByCarga(idCargaAcademica: string) {
    const [rows] = await pool.query(
      `SELECT ct.*,
              m.nombre_materia,
              g.nombre AS nombre_grado,
              p.numero_periodo
       FROM classroom_tarea ct
       JOIN carga_academica ca ON ct.id_carga_academica = ca.id_carga_academica
       JOIN materia m ON ca.id_materia = m.id_materia
       JOIN grado_educacion g ON ca.id_grado_educacion = g.id_grado_educacion
       JOIN periodo p ON ct.id_periodo = p.id_periodo
       WHERE ct.id_carga_academica = ?
       ORDER BY ct.fecha_creacion DESC`,
      [idCargaAcademica]
    );
    return mapRowsToEntities<ClassroomTarea>(rows as any[]);
  }

  async findByGrado(idGradoEducacion: string, idAnioElectivo: string) {
    const [rows] = await pool.query(
      `SELECT ct.*,
              m.nombre_materia,
              p.numero_periodo
       FROM classroom_tarea ct
       JOIN carga_academica ca ON ct.id_carga_academica = ca.id_carga_academica
       JOIN materia m ON ca.id_materia = m.id_materia
       JOIN periodo p ON ct.id_periodo = p.id_periodo
       WHERE ca.id_grado_educacion = ? AND ca.id_anio_electivo = ?
       ORDER BY ct.fecha_creacion DESC`,
      [idGradoEducacion, idAnioElectivo]
    );
    return mapRowsToEntities<ClassroomTarea>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query(
      `SELECT ct.*,
              m.nombre_materia,
              g.nombre AS nombre_grado,
              p.numero_periodo
       FROM classroom_tarea ct
       JOIN carga_academica ca ON ct.id_carga_academica = ca.id_carga_academica
       JOIN materia m ON ca.id_materia = m.id_materia
       JOIN grado_educacion g ON ca.id_grado_educacion = g.id_grado_educacion
       JOIN periodo p ON ct.id_periodo = p.id_periodo
       WHERE ct.id_classroom_tarea = ?`,
      [id]
    );
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<ClassroomTarea>(row) : null;
  }

  async create(data: { idCargaAcademica: string; idPeriodo: string; titulo: string; instrucciones: string; fechaLimite: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO classroom_tarea (id_classroom_tarea, id_carga_academica, id_periodo, titulo, instrucciones, fecha_limite, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [id, data.idCargaAcademica, data.idPeriodo, data.titulo, data.instrucciones, data.fechaLimite]
    );
    return { id };
  }

  async update(id: string, data: { titulo: string; instrucciones: string; fechaLimite: string }) {
    const [result] = await pool.execute(
      'UPDATE classroom_tarea SET titulo = ?, instrucciones = ?, fecha_limite = ? WHERE id_classroom_tarea = ?',
      [data.titulo, data.instrucciones, data.fechaLimite, id]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM classroom_tarea WHERE id_classroom_tarea = ?', [id]);
    return result;
  }

  // Adjuntos
  async findAdjuntos(idTarea: string) {
    const [rows] = await pool.query(
      'SELECT * FROM classroom_tarea_adjunto WHERE id_classroom_tarea = ?',
      [idTarea]
    );
    return mapRowsToEntities<ClassroomTareaAdjunto>(rows as any[]);
  }

  async createAdjunto(data: { idClassroomTarea: string; urlArchivo: string; nombreArchivo: string }) {
    const id = generatePrimaryKey();
    await pool.execute(
      'INSERT INTO classroom_tarea_adjunto (id_classroom_tarea_adjunto, id_classroom_tarea, url_archivo, nombre_archivo) VALUES (?, ?, ?, ?)',
      [id, data.idClassroomTarea, data.urlArchivo, data.nombreArchivo]
    );
    return { id };
  }

  async removeAdjunto(id: string) {
    const [result] = await pool.execute('DELETE FROM classroom_tarea_adjunto WHERE id_classroom_tarea_adjunto = ?', [id]);
    return result;
  }
}

export default new ClassroomTareaRepository();
