
  
 export interface Curso {
  CursoId?: string;
  Curso: string;
  Materia: {
    Materia: string;
    MateriaId: string;
    Creditos?:string;
  };
  Docente: {
    Docente: string;
    DocenteId: string;
  };
  Sede: {
    Sede: string;
    SedeId: string;
  };
  FechaInicio?: string;
  FechaFin?: string;
  HoraInicial?: string;
  HoraFinal?: string;
  CupoDisponible?: string;
  CupoMaximo?: string;
  Estado?: string;
  FechaDeCreacion?: string;
  ActualizadoEn?: string;
}
