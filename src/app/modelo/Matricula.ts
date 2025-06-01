export interface CursosMatriculados {
    MatriculaId: string;
    CursoId: string;
    Curso?: {
      CursoId?: string;
      Curso?: string;
     };
     Materia?: {
      MateriaId?: string;
      Materia?: string;
      Creditos?: number;
    };
    FechaInscripcion?:string;
  }
  
  export interface Matricula {
    MatriculaId: string;
    Matricula: string;
    EstudianteId: string;
    Estudiante?: {
      EstudianteId?: string;
      Estudiante?: string;
     };
    CursosMatriculados: CursosMatriculados[];
    FechaDeMatricula: string;
    EstadoMatricula: string;
    CostoPorCredito: string;
    CostoMatricula: string;
    CostoPoliza: string;
    TotalMatricula: string;
    FechaDeCreacion:string;
    ActualizadoEn: string;
  }
  
  export enum EstadoMatricula {
    Pendiente = 'Pendiente',
    ParcialmentePagado = 'ParcialmentePagado',
    Pagado = 'Pagado',
    Cancelado = 'Cancelado',
  }