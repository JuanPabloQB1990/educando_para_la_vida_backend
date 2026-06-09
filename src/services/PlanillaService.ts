import PlanillaRepository from '../repositories/PlanillaRepository';
import { AppError } from '../error/AppError';
import type {
  PlanillaAcademica,
  PlanillaActividad,
  PlanillaEstudiante,
} from '../models/planillaAcademica';

class PlanillaService {
  async getPlanilla(
    idGradoEducacion: string,
    idAnioElectivo: string,
    idPeriodo: string
  ): Promise<PlanillaAcademica> {
    const meta = await PlanillaRepository.getMeta(idGradoEducacion, idAnioElectivo, idPeriodo);
    if (!meta) throw new AppError(404, 'Datos de planilla no encontrados');

    const [director, estudiantesRaw, actividadesRaw] = await Promise.all([
      PlanillaRepository.getDirector(idGradoEducacion, idAnioElectivo),
      PlanillaRepository.getEstudiantes(idGradoEducacion, idAnioElectivo),
      PlanillaRepository.getActividadesConMaterias(idGradoEducacion, idPeriodo),
    ]);

    // Ensamblar actividades con sus materias (eliminando duplicados del JOIN)
    const actividadesMap = new Map<string, PlanillaActividad>();
    const allAmIds: string[] = [];

    for (const row of actividadesRaw) {
      if (!actividadesMap.has(row.actividad_id)) {
        actividadesMap.set(row.actividad_id, {
          id: row.actividad_id,
          nombre: row.actividad_nombre,
          semana: row.semana,
          materias: [],
        });
      }
      if (row.am_id) {
        actividadesMap.get(row.actividad_id)!.materias.push({
          id: row.am_id,
          nombre: row.am_nombre,
          nombreMateria: row.materia_nombre,
        });
        allAmIds.push(row.am_id);
      }
    }

    const estudianteIds = estudiantesRaw.map((e: any) => e.id as string);

    const [calificacionesRaw, asistenciasRaw] = await Promise.all([
      PlanillaRepository.getCalificaciones(allAmIds),
      PlanillaRepository.getAsistencias(idPeriodo, estudianteIds),
    ]);

    // Fechas únicas ordenadas (columnas de asistencia)
    const fechasSet = new Set<string>(asistenciasRaw.map((a: any) => a.fecha as string));
    const fechasAsistencia = Array.from(fechasSet).sort();

    const estudiantes: PlanillaEstudiante[] = estudiantesRaw.map((est: any) => {
      const calificaciones: PlanillaEstudiante['calificaciones'] = {};
      for (const c of calificacionesRaw) {
        if (c.id_estudiante === est.id) {
          calificaciones[c.id_actividad_materia] = {
            id: c.id,
            nota: parseFloat(c.nota),
            observacion: c.observacion ?? null,
          };
        }
      }

      // Una asistencia por fecha (primera registrada si hay duplicados)
      const asistencias: PlanillaEstudiante['asistencias'] = {};
      for (const a of asistenciasRaw) {
        if (a.id_estudiante === est.id && !(a.fecha in asistencias)) {
          asistencias[a.fecha] = {
            id: a.id,
            estado: a.estado,
            observacion: a.observacion ?? null,
          };
        }
      }

      const totalPresente = Object.values(asistencias).filter(
        (a) => a.estado === 'asistio'
      ).length;
      const totalSesiones = fechasAsistencia.length;
      const porcentajeAsistencia =
        totalSesiones > 0 ? Math.round((totalPresente / totalSesiones) * 100) : 0;

      return {
        id: est.id,
        nombre: est.nombre,
        tipoDocumento: est.tipo_documento,
        noDocumento: est.no_documento,
        calificaciones,
        asistencias,
        totalPresente,
        porcentajeAsistencia,
      };
    });

    return {
      grado: { id: meta.grado_id, nombre: meta.grado_nombre },
      anio: meta.anio,
      periodo: { id: meta.periodo_id, numeroPeriodo: meta.numero_periodo },
      director,
      actividades: Array.from(actividadesMap.values()),
      fechasAsistencia,
      estudiantes,
    };
  }
}

export default new PlanillaService();
