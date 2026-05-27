export interface DireccionGradoRow {
  id_direccion_grado: string;
  id_grado_educacion: string;
  id_usuario: string;
  id_anio_electivo: string;
  link_clase_virtual: string | null;
  ultima_actualizacion_link: Date | null;
  nombre_grado?: string;
  nombre_usuario?: string;
  anio?: number;
}

export interface DireccionGrado {
  idDireccionGrado: string;
  idGradoEducacion: string;
  idUsuario: string;
  idAnioElectivo: string;
  linkClaseVirtual: string | null;
  ultimaActualizacionLink: Date | null;
  nombreGrado?: string;
  nombreUsuario?: string;
  anio?: number;
}
