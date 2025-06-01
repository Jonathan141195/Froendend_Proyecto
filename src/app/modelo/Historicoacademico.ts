export enum Estado {
    Aprobado = 'Aprobado',
    Reprobado = 'Reprobado',
    EnProceso = 'EnProceso'
  }

  export interface HistoricoAcademico {
    HistoricoAcademicoId?: string;
    HistoricoAcademico: string;
    EstudianteId?: string;
    Estudiante?: {
        EstudianteId: string;
        Estudiante: string;
       };
    FechaRegistro?: string;
    FechaDeCreacion?: string;
    ActualizadoEn?: string;
    CursosHistorico: CursosHistorico[]; // Relación opcional
  }
  
  export interface CursosHistorico {
    HistoricoAcademicoId?: string;
    CursoId?: string;
    Nota?: string;
    FechaRegistro?: string;
    Estado?: Estado; // Usando el enum
    FechaDeCreacion?: string;
    ActualizadoEn?: string;
    Curso?: {
        Curso: string;
        CursoId: string; // Añadir SedeId en Sede también
      };

  }
  