import ClassroomEntregaRepository from '../repositories/ClassroomEntregaRepository';
import { ClassroomEntregaEstado } from '../enums/classroomEntrega.enum';

class ClassroomEntregaService {
  async listByCarga(idCargaAcademica: string, idPeriodo?: string) {
    return ClassroomEntregaRepository.findByCarga(idCargaAcademica, idPeriodo);
  }

  async listByTarea(idTarea: string) {
    return ClassroomEntregaRepository.findByTarea(idTarea);
  }

  async listByEstudiante(idEstudiante: string) {
    return ClassroomEntregaRepository.findByEstudiante(idEstudiante);
  }

  async get(id: string) {
    return ClassroomEntregaRepository.findById(id);
  }

  async create(data: { idClassroomTarea: string; idEstudiante: string }) {
    const res = await ClassroomEntregaRepository.create({
      ...data,
      estado: ClassroomEntregaEstado.PENDIENTE,
    });
    return ClassroomEntregaRepository.findById(res.id);
  }

  async updateEstado(id: string, data: { estadoEntrega: string; observacionProfesor?: string }) {
    await ClassroomEntregaRepository.updateEstado(id, { estado: data.estadoEntrega, observacionProfesor: data.observacionProfesor });
    return ClassroomEntregaRepository.findById(id);
  }

  async delete(id: string) {
    return ClassroomEntregaRepository.remove(id);
  }

  async listAdjuntos(idEntrega: string) {
    return ClassroomEntregaRepository.findAdjuntos(idEntrega);
  }

  async createAdjunto(data: { idClassroomEntrega: string; urlArchivo: string; nombreArchivo: string }) {
    return ClassroomEntregaRepository.createAdjunto(data);
  }

  async deleteAdjunto(id: string) {
    return ClassroomEntregaRepository.removeAdjunto(id);
  }
}

export default new ClassroomEntregaService();
