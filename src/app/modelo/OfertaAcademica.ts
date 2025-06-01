import { Carrera } from './../modelo/Carrera';
import { Curso } from './../modelo/Curso';
    

  export enum Periodo {
    I_CUATRIMESTRE = 'I_cuatrimestre',
    II_CUATRIMESTRE = 'II_cuatrimestre',
    III_CUATRIMESTRE = 'III_cuatrimestre'
  }

  export interface OfertaAcademica {
    OfertaAcademicaId?: string;
    OfertaAcademica: string;
    CarreraId?: string;
    Periodo?:string;
    Anno?:string,
    Carrera?: {
        CarreraId?: string;
        Carrera?: string;
       };
    FechaDeCreacion?: string;
    ActualizadoEn?: string;
    CursosOfertaAcademica?: CursosOfertaAcademica[];
  }
  
  export interface CursosOfertaAcademica {
    OfertaAcademicaId?: string;
    CursoId?: string;
   
    FechaRegistro?: string;
    Estado?: string; // Usando el enum
    FechaDeCreacion?: string;
    ActualizadoEn?: string;
    Curso?: {
        Curso: string;
        CursoId: string; // Añadir SedeId en Sede también
      };

  }