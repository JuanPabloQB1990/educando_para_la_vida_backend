import EstudiantePeriodoRepository from '../repositories/EstudiantePeriodoRepository';
import AnioElectivoRepository from '../repositories/AnioElectivoRepository';
import RubroRepository from '../repositories/RubroRepository';
import GradosPorMatriculaRepository from '../repositories/GradosPorMatriculaRepository';
import ObligacionPagoRepository from '../repositories/ObligacionPagoRepository';
import { AppError } from '../error/AppError';

interface MatricularAnioDto {
  idAnioElectivo: string;
  idRubro: string;
  meses: number[];
}

class EstudiantePeriodoService {
  async list() {
    return await EstudiantePeriodoRepository.findAll();
  }

  async get(id: string) {
    return await EstudiantePeriodoRepository.findById(id);
  }

  async create(data: any) {
    const res: any = await EstudiantePeriodoRepository.create(data);
    const id = res?.id;
    return id;
  }

  async update(id: string, data: any) {
    return await EstudiantePeriodoRepository.update(id, data);
  }

  async delete(id: string) {
    return await EstudiantePeriodoRepository.remove(id);
  }

  async matricularAnio(idEstudiantePeriodo: string, dto: MatricularAnioDto): Promise<void> {
    const ep = await EstudiantePeriodoRepository.findById(idEstudiantePeriodo);
    if (!ep) throw new AppError('Estudiante periodo no encontrado', 404);

    const anioElectivo = await AnioElectivoRepository.findById(dto.idAnioElectivo);
    if (!anioElectivo) throw new AppError('Año electivo no encontrado', 404);

    const rubro = await RubroRepository.findById(dto.idRubro);
    if (!rubro) throw new AppError('Rubro no encontrado', 404);

    const montoBase = rubro.montoBase ?? '0';

    await EstudiantePeriodoRepository.matricularAnio(
      idEstudiantePeriodo,
      dto.idAnioElectivo,
      anioElectivo.anio,
      dto.idRubro,
      montoBase,
      dto.meses
    );
  }

  async getGrados(idEstudiantePeriodo: string) {
    return await GradosPorMatriculaRepository.findByEstudiantePeriodo(idEstudiantePeriodo);
  }

  async getObligaciones(idEstudiantePeriodo: string) {
    return await ObligacionPagoRepository.findByEstudiantePeriodo(idEstudiantePeriodo);
  }
}

export default new EstudiantePeriodoService();
