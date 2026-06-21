import EstudianteRepository, { type EstudianteAdminFilters } from "../repositories/EstudianteRepository";
import EstudianteMatriculaRepository from "../repositories/EstudianteMatriculaRepository";
import GradosPorMatriculaRepository from "../repositories/GradosPorMatriculaRepository";
import UsuarioRepository from "../repositories/UsuarioRepository";
import { AppError } from '../error/AppError';

class EstudianteService {
  async list() {
    return await EstudianteRepository.findAll();
  }

  async get(id: string) {
    const data = await EstudianteRepository.findById(id);
    if (!data) throw new AppError(404, 'Estudiante no encontrado');
    return data;
  }

  async create(data: any) {
    const idEstudiante = await EstudianteRepository.create(data);
    return idEstudiante;
  }

  async update(id: string, data: any) {
    // Normalize payload: prefer nested usuario/estudiante objects
    const usuarioPayload = data.usuario ?? {};
    const estudiantePayload = data.estudiante ?? {};
    const payload = { ...estudiantePayload, ...data };

    // fetch existing to get id_usuario
    const existing: any = await EstudianteRepository.findById(id);
    if (!existing) throw new AppError(404, 'Estudiante no encontrado');
    const idUsuario = existing.idUsuario ?? existing.usuarioIdUsuario ?? null;

    // update usuario if data provided
    if (Object.keys(usuarioPayload).length > 0) {
      if (idUsuario) await UsuarioRepository.update(idUsuario, usuarioPayload);
    } else {
      // if top-level usuario fields were provided, detect some common keys
      const hasUsuarioFields = [
        "nombres",
        "apellido1",
        "apellido2",
        "contacto1",
        "contacto2",
        "email",
        "id_rol",
        "id_tipo_documento",
        "no_documento",
        "fecha_expedicion_documento",
      ].some((k) => k in data);
      if (hasUsuarioFields && idUsuario) {
        const uPayload: any = {};
        for (const k of [
          "nombres",
          "apellido1",
          "apellido2",
          "contacto1",
          "contacto2",
          "email",
          "id_rol",
          "id_tipo_documento",
          "no_documento",
          "fecha_expedicion_documento",
        ]) {
          if (k in data) uPayload[k] = (data as any)[k];
        }
        if (Object.keys(uPayload).length > 0)
          await UsuarioRepository.update(idUsuario, uPayload);
      }
    }

    // update estudiante table with estudiante-specific fields
    await EstudianteRepository.update(id, payload);
    return await EstudianteRepository.findById(id);
  }

  async listAdmin(filters: EstudianteAdminFilters) {
    return EstudianteRepository.findAllForAdmin(filters);
  }

  async getHistorial(idEstudiante: string) {
    const matriculas = await EstudianteMatriculaRepository.findAllByEstudiante(idEstudiante);
    const result = await Promise.all(
      matriculas.map(async (m: any) => ({
        matricula: m,
        grados: await GradosPorMatriculaRepository.findByEstudianteMatricula(m.id),
      }))
    );
    return result;
  }

  async delete(id: string) {
    // remove estudiante and its usuario
    const existing: any = await EstudianteRepository.findById(id);
    if (!existing) throw new AppError(404, 'Estudiante no encontrado');
    const idUsuario = existing.idUsuario ?? existing.usuarioIdUsuario ?? null;
    const res = await EstudianteRepository.remove(id);
    if (idUsuario) await UsuarioRepository.remove(idUsuario);
    return res;
  }
}

export default new EstudianteService();
