export interface CargaAcademicaRow {
  id: string;
  id_usuario: string;
  id_materia: string;
  id_grado_educacion: string;
  id_anio_electivo: string;
  id_bloque?: string | null;
  nombre_usuario?: string;
  nombre_materia?: string;
  nombre_grado?: string;
  nombre_bloque?: string | null;
  anio?: number;
}

export interface CargaAcademica {
  id: string;
  idUsuario: string;
  idMateria: string;
  idGradoEducacion: string;
  idAnioElectivo: string;
  idBloque?: string | null;
  nombreUsuario?: string;
  nombreMateria?: string;
  nombreGrado?: string;
  nombreBloque?: string | null;
  anio?: number;
}
