import EstudianteRepository from '../repositories/EstudianteRepository';
import UsuarioRepository from '../repositories/UsuarioRepository';
import UsuarioService from './UsuarioService';

class EstudianteService {
  async list() {
    return await EstudianteRepository.findAll();
  }

  async get(id: string) {
    return await EstudianteRepository.findById(id);
  }

  async create(data: any) {
    // Accept nested payloads: { usuario: {...}, estudiante: {...} } or flat
    let usuarioPayload = data.usuario ?? {};
    // If usuario nested object not provided, pick top-level usuario fields from data
    if (!usuarioPayload || Object.keys(usuarioPayload).length === 0) {
      const possibleKeys = ['nombres','apellido1','apellido2','contacto1','contacto2','email','id_rol','estado','id_tipo_documento','no_documento','fecha_expedicion_documento'];
      usuarioPayload = {};
      for (const k of possibleKeys) {
        if (k in data) (usuarioPayload as any)[k] = (data as any)[k];
      }
    }
    const estudiantePayload = data.estudiante ?? {};

    // Create usuario via UsuarioService and obtain id_usuario
    const createdUser: any = await UsuarioService.create(usuarioPayload);
    if (!createdUser || !createdUser.idUsuario) throw new Error('Failed to create usuario');
    const id_usuario = createdUser.idUsuario;

    // Build payload for estudiante repository. EstudianteRepository expects `id_usuario` snake_case
    const payload = { id_usuario, ...estudiantePayload, ...data };
    // Ensure we don't accidentally pass usuario-only fields
    return await EstudianteRepository.create(payload);
  }

  async update(id: string, data: any) {
    // Normalize payload: prefer nested usuario/estudiante objects
    const usuarioPayload = data.usuario ?? {};
    const estudiantePayload = data.estudiante ?? {};
    const payload = { ...estudiantePayload, ...data };

    // fetch existing to get id_usuario
    const existing: any = await EstudianteRepository.findById(id);
    if (!existing) return null;
    const idUsuario = existing.idUsuario ?? existing.usuarioIdUsuario ?? null;

    // update usuario if data provided
    if (Object.keys(usuarioPayload).length > 0) {
      if (idUsuario) await UsuarioRepository.update(idUsuario, usuarioPayload);
    } else {
      // if top-level usuario fields were provided, detect some common keys
      const hasUsuarioFields = ['nombres', 'apellido1', 'apellido2', 'contacto1', 'contacto2', 'email', 'id_rol', 'estado', 'id_tipo_documento', 'no_documento', 'fecha_expedicion_documento'].some(k => k in data);
      if (hasUsuarioFields && idUsuario) {
        const uPayload: any = {};
        for (const k of ['nombres','apellido1','apellido2','contacto1','contacto2','email','id_rol','estado','id_tipo_documento','no_documento','fecha_expedicion_documento']) {
          if (k in data) uPayload[k] = (data as any)[k];
        }
        if (Object.keys(uPayload).length > 0) await UsuarioRepository.update(idUsuario, uPayload);
      }
    }

    // update estudiante table with estudiante-specific fields
    await EstudianteRepository.update(id, payload);
    return await EstudianteRepository.findById(id);
  }

  async delete(id: string) {
    // remove estudiante and its usuario
    const existing: any = await EstudianteRepository.findById(id);
    if (!existing) return null;
    const idUsuario = existing.idUsuario ?? existing.usuarioIdUsuario ?? null;
    const res = await EstudianteRepository.remove(id);
    if (idUsuario) await UsuarioRepository.remove(idUsuario);
    return res;
  }
}

export default new EstudianteService();
