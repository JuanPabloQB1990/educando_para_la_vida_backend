export interface ObligacionPagoRow {
  id: string;
  id_estudiante_matricula: string;
  id_rubro: string;
  monto_cuota: string;
  fecha_vencimiento?: string | null;
  estado: 'pendiente' | 'pagado' | 'vencido';
}

export interface ObligacionPago {
  id: string;
  idEstudianteMatricula: string;
  idRubro: string;
  montoCuota: string;
  fechaVencimiento?: string | null;
  estado: 'pendiente' | 'pagado' | 'vencido';
}

import { mapRowToEntity } from './dbMappers';

export function mapObligacionPago(row: ObligacionPagoRow): ObligacionPago {
  return mapRowToEntity<ObligacionPago>(row);
}
