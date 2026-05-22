export interface ObligacionPagoRow {
  id_obligacion_pago: string;
  id_estudiante_periodo: string;
  id_rubro: string;
  monto_cuota: string;
  fecha_vencimiento?: string | null;
  estado: 'pendiente' | 'pagado' | 'vencido';
}

export interface ObligacionPago {
  idObligacionPago: string;
  idEstudiantePeriodo: string;
  idRubro: string;
  montoCuota: string;
  fechaVencimiento?: string | null;
  estado: 'pendiente' | 'pagado' | 'vencido';
}

import { mapRowToEntity } from './dbMappers';

export function mapObligacionPago(row: ObligacionPagoRow): ObligacionPago {
  return mapRowToEntity<ObligacionPago>(row);
}
