import EstudianteMatriculaRepository from '../repositories/EstudianteMatriculaRepository';
import AnioElectivoRepository from '../repositories/AnioElectivoRepository';
import RubroRepository from '../repositories/RubroRepository';
import TipoEstudioRepository from '../repositories/TipoEstudioRepository';
import GradosPorMatriculaRepository from '../repositories/GradosPorMatriculaRepository';
import ObligacionPagoRepository from '../repositories/ObligacionPagoRepository';
import { AppError } from '../error/AppError';

interface MatricularAnioDto {
  idAnioElectivo: string;
  idRubro: string;
  meses: number[];
}

class EstudianteMatriculaService {
  async list() {
    return await EstudianteMatriculaRepository.findAll();
  }

  async get(id: string) {
    const data = await EstudianteMatriculaRepository.findById(id);
    if (!data) throw new AppError(404, 'Matrícula no encontrada');
    return data;
  }

  async create(data: any) {
    const res: any = await EstudianteMatriculaRepository.create(data);
    return res?.id;
  }

  async update(id: string, data: any) {
    return await EstudianteMatriculaRepository.update(id, data);
  }

  async delete(id: string) {
    return await EstudianteMatriculaRepository.remove(id);
  }

  async matricularAnio(idEstudianteMatricula: string, dto: MatricularAnioDto): Promise<void> {
    const em = await EstudianteMatriculaRepository.findById(idEstudianteMatricula);
    if (!em) throw new AppError(404, 'Estudiante matrícula no encontrado');

    const anioElectivo = await AnioElectivoRepository.findById(dto.idAnioElectivo);
    if (!anioElectivo) throw new AppError(404, 'Año electivo no encontrado');

    const rubro = await RubroRepository.findById(dto.idRubro);
    if (!rubro) throw new AppError(404, 'Rubro no encontrado');

    const montoBase = rubro.montoBase ?? '0';

    const tipoEstudio = em.idTipoEstudio
      ? await TipoEstudioRepository.findById(em.idTipoEstudio)
      : null;
    const actualizarAnioElectivo = tipoEstudio?.nombre === 'Educacion formal';

    await EstudianteMatriculaRepository.matricularAnio(
      idEstudianteMatricula,
      dto.idAnioElectivo,
      anioElectivo.anio,
      dto.idRubro,
      montoBase,
      dto.meses,
      actualizarAnioElectivo
    );
  }

  async updateEstudio(id: string, idTipoEstudio: string, idTiempoValidacion: string | null): Promise<void> {
    const em = await EstudianteMatriculaRepository.findById(id);
    if (!em) throw new AppError(404, 'Matrícula no encontrada');
    await EstudianteMatriculaRepository.updateEstudio(id, idTipoEstudio, idTiempoValidacion);
  }

  async getGrados(idEstudianteMatricula: string) {
    return await GradosPorMatriculaRepository.findByEstudianteMatricula(idEstudianteMatricula);
  }

  async getObligaciones(idEstudianteMatricula: string) {
    return await ObligacionPagoRepository.findByEstudianteMatricula(idEstudianteMatricula);
  }
}

export default new EstudianteMatriculaService();
