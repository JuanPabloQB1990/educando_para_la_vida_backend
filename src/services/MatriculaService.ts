import UsuarioRepository from '../repositories/UsuarioRepository';
import EstudianteService from './EstudianteService';
import RolService from './RolService';

class MatriculaService {
  /**
   * Actualmente valida si existe un usuario con `no_documento` y `id_rol = 2`.
   */
  async processEnrollment(form: any) {
    const no_documento = form.no_documento ?? form.noDocumento ?? null;
    // obtener id del rol 'estudiante' desde la tabla rol
    const rol = await RolService.findByName('estudiante');
    const id_rol = rol?.idRol ?? null;

    if (!id_rol) {
      // no existe el rol configurado en la base de datos
      return { exists: false, payload: null, error: 'Rol estudiante no encontrado' };
    }

    if (!no_documento) {
      return { exists: false, payload: null };
    }

    const user = await UsuarioRepository.findByDocumento(no_documento, id_rol);
    if (user) return { exists: true, payload: user };

    // No existe: proceder a crear usuario y estudiante.
    // Aseguramos que el payload tenga el rol de estudiante
    const payload = { ...form, id_rol };

    // EstudianteService.create will create usuario (via UsuarioService) y luego estudiante
    const created = await EstudianteService.create(payload);
    return { exists: false, payload: created };


  }
}

export default new MatriculaService();
