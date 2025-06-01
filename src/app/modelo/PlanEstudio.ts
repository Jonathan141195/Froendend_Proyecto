
  export interface MateriasOnPlanEstudio {
    PlanEstudioId?: string;
    MateriaId?: string;
    Semestre?: string;
    Requisitos?: string;
    FechaDeCreacion?: string;
    ActualizadoEn?: string;
    Materia?: {
      Materia: string;
      MateriaId: string; // Añadir SedeId en Sede también
    };
  }
  
  export interface PlanEstudio {
    PlanEstudioId: string;
    PlanEstudio: string;
    CarreraId?:string;
    Carrera?: {
        CarreraId: string;
        Carrera: string;
       };
    FechaDeCreacion: string;
    ActualizadoEn: string;
    MateriasOnPlanEstudio: MateriasOnPlanEstudio[]; // Relación con Materias
  }
    