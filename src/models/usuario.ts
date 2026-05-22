export interface UsuarioRow {
  id_usuario: string;
  nombres: string;
  apellido1: string;
  apellido2?: string | null;
  contacto1?: string | null;
  contacto2?: string | null;
  email?: string | null;
  password?: string | null;
  estado: 'activo' | 'inactivo';
  id_tipo_documento?: string | null;
  id_rol?: string | null;
  no_documento?: string | null;
  fecha_expedicion_documento?: string | null;
}

export interface Usuario {
  idUsuario: string;
  nombres: string;
  apellido1: string;
  apellido2?: string | null;
  contacto1?: string | null;
  contacto2?: string | null;
  email?: string | null;
  estado: 'activo' | 'inactivo';
  idTipoDocumento?: string | null;
  idRol?: string | null;
  noDocumento?: string | null;
  fechaExpedicionDocumento?: string | null;
}

import { mapRowToEntity } from './dbMappers';

export function mapUsuario(row: UsuarioRow): Usuario {
  return mapRowToEntity<Usuario>(row);
}
