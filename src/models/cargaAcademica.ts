export interface CargaAcademicaRow {
  id: string;
  id_usuario: string;
  id_materia: string;
  id_grado_educacion: string;
  id_anio_electivo: string;
  nombre_usuario?: string;
  nombre_materia?: string;
  nombre_grado?: string;
  anio?: number;
}

export interface CargaAcademica {
  id: string;
  idUsuario: string;
  idMateria: string;
  idGradoEducacion: string;
  idAnioElectivo: string;
  nombreUsuario?: string;
  nombreMateria?: string;
  nombreGrado?: string;
  anio?: number;
}
