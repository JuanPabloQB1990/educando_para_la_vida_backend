import CargaAcademicaRepository from '../repositories/CargaAcademicaRepository';

class CargaAcademicaService {
  async list() {
    return CargaAcademicaRepository.findAll();
  }

  async listByProfesor(idUsuario: string, idAnioElectivo?: string) {
    return CargaAcademicaRepository.findByProfesor(idUsuario, idAnioElectivo);
  }

  async get(id: string) {
    return CargaAcademicaRepository.findById(id);
  }

  async create(data: { idUsuario: string; idMateria: string; idGradoEducacion: string; idAnioElectivo: string }) {
    const res = await CargaAcademicaRepository.create(data);
    return CargaAcademicaRepository.findById(res.id);
  }

  async delete(id: string) {
    return CargaAcademicaRepository.remove(id);
  }
}

export default new CargaAcademicaService();
