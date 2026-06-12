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
          materias: [],
        });
      }
      if (row.am_id) {
        actividadesMap.get(row.actividad_id)!.materias.push({
          id: row.am_id,
          nombreMateria: row.materia_nombre,
          abreviaturaMateria: row.materia_abreviatura ?? '',
        });
        allAmIds.push(row.am_id);
      }
    }

    const estudianteIds = estudiantesRaw.map((e: any) => e.id as string);

    const [calificacionesRaw, asistenciasRaw] = await Promise.all([
      PlanillaRepository.getCalificaciones(allAmIds),
      PlanillaRepository.getAsistencias(idPeriodo, estudianteIds),
    ]);

    // Fechas únicas por actividad
    const fechasPorActividad = new Map<string, Set<string>>();
    for (const a of asistenciasRaw) {
      if (!fechasPorActividad.has(a.id_actividad)) {
        fechasPorActividad.set(a.id_actividad, new Set());
      }
      fechasPorActividad.get(a.id_actividad)!.add(a.fecha as string);
    }

    const actividades = Array.from(actividadesMap.values()).map((act) => ({
      ...act,
      fechasAsistencia: Array.from(fechasPorActividad.get(act.id) ?? []).sort(),
    }));

    const totalSesiones = actividades.reduce((s, act) => s + act.fechasAsistencia.length, 0);

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

      // Asistencias agrupadas por idActividad → fecha (primera registrada si hay duplicados)
      const asistencias: PlanillaEstudiante['asistencias'] = {};
      for (const a of asistenciasRaw) {
        if (a.id_estudiante !== est.id) continue;
        if (!asistencias[a.id_actividad]) asistencias[a.id_actividad] = {};
        if (!(a.fecha in asistencias[a.id_actividad])) {
          asistencias[a.id_actividad][a.fecha] = {
            id: a.id,
            estado: a.estado,
            observacion: a.observacion ?? null,
          };
        }
      }

      const totalPresente = Object.values(asistencias)
        .flatMap((byFecha) => Object.values(byFecha))
        .filter((a) => a.estado === 'asistio').length;
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
      actividades,
      estudiantes,
    };
  }
}

export default new PlanillaService();
