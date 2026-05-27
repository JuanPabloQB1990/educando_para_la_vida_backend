import ClassroomTareaRepository from '../repositories/ClassroomTareaRepository';

class ClassroomTareaService {
  async listByCarga(idCargaAcademica: string) {
    return ClassroomTareaRepository.findByCarga(idCargaAcademica);
  }

  async listByGrado(idGradoEducacion: string, idAnioElectivo: string) {
    return ClassroomTareaRepository.findByGrado(idGradoEducacion, idAnioElectivo);
  }

  async get(id: string) {
    return ClassroomTareaRepository.findById(id);
  }

  async create(data: { idCargaAcademica: string; idPeriodo: string; titulo: string; instrucciones: string; fechaLimite: string }) {
    const res = await ClassroomTareaRepository.create(data);
    return ClassroomTareaRepository.findById(res.id);
  }

  async update(id: string, data: { titulo: string; instrucciones: string; fechaLimite: string }) {
    await ClassroomTareaRepository.update(id, data);
    return ClassroomTareaRepository.findById(id);
  }

  async delete(id: string) {
    return ClassroomTareaRepository.remove(id);
  }

  async listAdjuntos(idTarea: string) {
    return ClassroomTareaRepository.findAdjuntos(idTarea);
  }

  async createAdjunto(data: { idClassroomTarea: string; urlArchivo: string; nombreArchivo: string }) {
    return ClassroomTareaRepository.createAdjunto(data);
  }

  async deleteAdjunto(id: string) {
    return ClassroomTareaRepository.removeAdjunto(id);
  }
}

export default new ClassroomTareaService();
