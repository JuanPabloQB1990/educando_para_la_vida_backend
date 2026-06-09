import type { PeriodoEstado } from '../enums/periodo.enum';

export interface PeriodoRow {
  id: string;
  id_anio_electivo: string;
  numero_periodo: number;
  estado: PeriodoEstado;
}

export interface Periodo {
  id: string;
  idAnioElectivo: string;
  numeroPeriodo: number;
  estado: PeriodoEstado;
}
