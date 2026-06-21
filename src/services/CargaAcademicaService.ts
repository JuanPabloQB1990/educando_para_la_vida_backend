import CargaAcademicaRepository from '../repositories/CargaAcademicaRepository';
import { AppError } from '../error/AppError';

class CargaAcademicaService {
  async list() {
    return CargaAcademicaRepository.findAll();
  }

  async listByProfesor(idUsuario: string, idAnioElectivo?: string) {
    return CargaAcademicaRepository.findByProfesor(idUsuario, idAnioElectivo);
  }

  async get(id: string) {
    const data = await CargaAcademicaRepository.findById(id);
    if (!data) throw new AppError(404, 'Carga académica no encontrada');
    return data;
  }

  async create(data: { idUsuario: string; idMateria: string; idGradoEducacion: string; idAnioElectivo: string; idBloque?: string | null }) {
    const res = await CargaAcademicaRepository.create(data);
    return CargaAcademicaRepository.findById(res.id);
  }

  async delete(id: string) {
    return CargaAcademicaRepository.remove(id);
  }
}

export default new CargaAcademicaService();
