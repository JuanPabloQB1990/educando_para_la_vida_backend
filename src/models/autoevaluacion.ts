export interface Autoevaluacion {
  id: string;
  idEstudiante: string;
  idPeriodo: string;
  idGradoEducacion: string;
  nota: number;
  observacion: string | null;
  createdAt: Date;
  updatedAt: Date;
}
