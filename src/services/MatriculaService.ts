import UsuarioRepository from '../repositories/UsuarioRepository';

class MatriculaService {
  /**
   * Procesa el flujo inicial de inscripción recibido desde FormData.
   * Actualmente valida si existe un usuario con `no_documento` y `id_rol = 2`.
   */
  async processEnrollment(form: any) {
    console.log(form);
    
    const no_documento = form.no_documento ?? form.noDocumento ?? null;
    // rol estudiante = 1cc03e3e-5567-11f1-8a61-9c5c8e85e154 (según requerimiento)
    const id_rol = '1cc03e3e-5567-11f1-8a61-9c5c8e85e154';

    if (!no_documento) {
      return { exists: false, payload: null };
    }

    const user = await UsuarioRepository.findByDocumento(no_documento, id_rol);
    if (user) return { exists: true, payload: user };
    return { exists: false, payload: null };

    
  }
}

export default new MatriculaService();
