export interface PagoRow {
  id_pago: string;
  id_obligacion_pago: string;
  monto_pagado: string;
  fecha_pago_real?: string | null;
  file_comprobante?: string | null;
  observaciones?: string | null;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_verificacion?: string | null;
}

export interface Pago {
  idPago: string;
  idObligacionPago: string;
  montoPagado: string;
  fechaPagoReal?: string | null;
  fileComprobante?: string | null;
  observaciones?: string | null;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaVerificacion?: string | null;
}

import { mapRowToEntity } from './dbMappers';

export function mapPago(row: PagoRow): Pago {
  return mapRowToEntity<Pago>(row);
}
