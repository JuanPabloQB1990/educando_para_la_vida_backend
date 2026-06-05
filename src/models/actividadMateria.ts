export interface ActividadMateriaRow {
  id: string;
  id_actividad: string;
  id_materia: string;
  id_carga_academica: string;
  nombre: string;
  nombre_materia?: string;
}

export interface ActividadMateria {
  id: string;
  idActividad: string;
  idMateria: string;
  idCargaAcademica: string;
  nombre: string;
  nombreMateria?: string;
}
