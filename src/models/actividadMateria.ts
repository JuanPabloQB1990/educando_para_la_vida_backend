export interface ActividadMateriaRow {
  id_actividad_materia: string;
  id_actividad: string;
  id_materia: string;
  id_carga_academica: string;
  nombre_actividad: string;
  nombre_materia?: string;
}

export interface ActividadMateria {
  idActividadMateria: string;
  idActividad: string;
  idMateria: string;
  idCargaAcademica: string;
  nombreActividad: string;
  nombreMateria?: string;
}
