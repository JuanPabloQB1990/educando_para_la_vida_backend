export interface PagoRow {
  id: string;
  id_obligacion_pago: string;
  monto_pagado: string;
  fecha_pago_real?: string | null;
  file_comprobante?: string | null;
  observaciones?: string | null;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_verificacion?: string | null;
}

export type CreatePagoDto = Omit<PagoRow, 'id'>;

export interface Pago {
  id: string;
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
