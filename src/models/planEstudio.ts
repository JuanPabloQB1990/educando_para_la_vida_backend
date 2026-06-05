export interface PlanEstudioRow {
  id: string;
  id_grado_educacion: string;
  id_materia: string;
  nombre_grado?: string;
  nombre_materia?: string;
}

export interface PlanEstudio {
  id: string;
  idGradoEducacion: string;
  idMateria: string;
  nombreGrado?: string;
  nombreMateria?: string;
}
