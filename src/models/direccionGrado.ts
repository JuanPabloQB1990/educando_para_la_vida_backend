export interface DireccionGradoRow {
  id: string;
  id_grado_educacion: string | null;
  id_usuario: string;
  id_anio_electivo: string;
  id_bloque?: string | null;
  link_clase_virtual: string | null;
  ultima_actualizacion_link: Date | null;
  nombre_grado?: string;
  nombre_usuario?: string;
  nombre_bloque?: string | null;
  anio?: number;
}

export interface DireccionGrado {
  id: string;
  idGradoEducacion: string | null;
  idUsuario: string;
  idAnioElectivo: string;
  idBloque?: string | null;
  linkClaseVirtual: string | null;
  ultimaActualizacionLink: Date | null;
  nombreGrado?: string;
  nombreUsuario?: string;
  nombreBloque?: string | null;
  anio?: number;
}
