export interface AuditoriaPago {
  id: string;
  idPago: string;
  nombres: string;
  apellido1: string;
  apellido2: string | null;
  createdAt: string;
}

export interface CreateAuditoriaPagoDto {
  idPago: string;
  nombres: string;
  apellido1: string;
  apellido2: string | null;
}
