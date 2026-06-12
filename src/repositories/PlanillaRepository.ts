import pool from '../config/database';

class PlanillaRepository {
  async getMeta(idGradoEducacion: string, idAnioElectivo: string, idPeriodo: string) {
    const [rows] = await pool.query(
      `SELECT g.id AS grado_id, g.nombre AS grado_nombre,
              ae.anio,
              p.id AS periodo_id, p.numero_periodo
       FROM grado_educacion g, anio_electivo ae, periodo p
       WHERE g.id = ? AND ae.id = ? AND p.id = ?`,
      [idGradoEducacion, idAnioElectivo, idPeriodo]
    );
    return (rows as any[])[0] ?? null;
  }

  async getDirector(idGradoEducacion: string, idAnioElectivo: string): Promise<string | null> {
    const [rows] = await pool.query(
      `SELECT CONCAT(u.nombres, ' ', u.apellido1) AS director
       FROM direccion_grado dg
       JOIN usuario u ON dg.id_usuario = u.id
       WHERE dg.id_grado_educacion = ? AND dg.id_anio_electivo = ?
       LIMIT 1`,
      [idGradoEducacion, idAnioElectivo]
    );
    const row = (rows as any[])[0];
    return row ? row.director : null;
  }

  async getEstudiantes(idGradoEducacion: string, idAnioElectivo: string) {
    const [rows] = await pool.query(
      `SELECT e.id,
              CONCAT(u.nombres, ' ', u.apellido1,
                IF(u.apellido2 IS NOT NULL AND u.apellido2 != '', CONCAT(' ', u.apellido2), '')) AS nombre,
              td.nombre AS tipo_documento,
              u.no_documento
       FROM grados_por_matricula gpm
       JOIN estudiante_matricula em ON gpm.id_estudiante_matricula = em.id
       JOIN estudiante e ON em.id_estudiante = e.id
       JOIN usuario u ON e.id_usuario = u.id
       JOIN tipo_documento td ON u.id_tipo_documento = td.id
       WHERE gpm.id_grado_educacion = ?
         AND em.id_anio_electivo = ?
       ORDER BY u.apellido1, u.nombres`,
      [idGradoEducacion, idAnioElectivo]
    );
    return rows as any[];
  }

  async getActividadesConMaterias(idGradoEducacion: string, idPeriodo: string) {
    const [rows] = await pool.query(
      `SELECT a.id AS actividad_id, a.nombre AS actividad_nombre,
              am.id AS am_id,
              m.nombre AS materia_nombre, m.abreviatura AS materia_abreviatura
       FROM actividad a
       LEFT JOIN actividad_materia am ON am.id_actividad = a.id
       LEFT JOIN materia m ON am.id_materia = m.id
       WHERE a.id_grado_educacion = ? AND a.id_periodo = ?
       ORDER BY a.created_at ASC, m.nombre`,
      [idGradoEducacion, idPeriodo]
    );
    return rows as any[];
  }

  async getCalificaciones(actividadMateriaIds: string[]) {
    if (!actividadMateriaIds.length) return [];
    const placeholders = actividadMateriaIds.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT id, id_estudiante, id_actividad_materia, nota, observacion
       FROM calificacion
       WHERE id_actividad_materia IN (${placeholders})`,
      actividadMateriaIds
    );
    return rows as any[];
  }

  async getAsistencias(idPeriodo: string, estudianteIds: string[]) {
    if (!estudianteIds.length) return [];
    const placeholders = estudianteIds.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT a.id, a.id_estudiante, a.id_actividad,
              DATE_FORMAT(a.fecha, '%Y-%m-%d') AS fecha,
              a.estado, a.observacion
       FROM asistencia a
       JOIN actividad act ON a.id_actividad = act.id
       WHERE act.id_periodo = ?
         AND a.id_estudiante IN (${placeholders})
       ORDER BY a.fecha`,
      [idPeriodo, ...estudianteIds]
    );
    return rows as any[];
  }
}

export default new PlanillaRepository();
