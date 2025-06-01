import { Component, signal } from '@angular/core';
import{ PlanEstudio} from '../modelo/PlanEstudio';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-estudio',
  imports: [FormsModule,CommonModule],
  templateUrl: './plan-estudio.component.html',
  styleUrl: './plan-estudio.component.css'
})
export class PlanEstudioComponent {

  
//Aqui escribo mi codigo
public PlanEstudios= signal<PlanEstudio[]>([]);


public PlanEstudio: string = '';


constructor(private http: HttpClient,private router: Router) {
  this.metodoGETPlanEstudio();
};


public metodoGETPlanEstudio() {
  this.http.get('http://localhost/planestudio').subscribe((PlanEstudios) => {
    const arr = PlanEstudios as PlanEstudio[];

    arr.forEach((PlanEstudio) => {
      this.agregarPlanEstudioALaSenial(
        PlanEstudio.PlanEstudioId ?? '',
        PlanEstudio.PlanEstudio ?? '',
        PlanEstudio.CarreraId ?? '',
        {
          CarreraId: PlanEstudio.Carrera?.CarreraId ?? '',
          Carrera: PlanEstudio.Carrera?.Carrera ?? '',
        },    
        
        PlanEstudio.MateriasOnPlanEstudio?.map((mp) => ({
          MateriaId: mp.Materia?.MateriaId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Materia: mp.Materia?.Materia ?? '', 
          Semestre: mp.Semestre ?? 1, // Si no tiene semestre, asigna 1 por defecto
          Requisitos: mp.Requisitos ?? null, // Si no tiene requisito, asigna null    
        })) ?? [],
        PlanEstudio.FechaDeCreacion ?? '',  // Si es undefined, asignamos un valor vacío por defecto
        PlanEstudio.ActualizadoEn ?? '' , // Si es undefined, asignamos un valor vacío por defecto
      );
    });

    console.log(typeof arr);
  });
}

public agregarPlanEstudioALaSenial(
  PlanEstudioId: string,
  PlanEstudio: string,  // Asegúrate de que este sea el nombre correcto del plan
  CarreraId: string,
  Carrera: {
    CarreraId: string;
    Carrera: string;
  },
  Materia: { MateriaId: string; Materia: string }[],
  FechaDeCreacion: string,
  ActualizadoEn: string
) {
  let nuevaPlanEstudio: PlanEstudio = {
    PlanEstudioId: PlanEstudioId,
    PlanEstudio: PlanEstudio,
    Carrera: {
      CarreraId: Carrera.CarreraId,
      Carrera: Carrera.Carrera,
    },
    MateriasOnPlanEstudio: Materia.map(materia => ({
      PlanEstudioId: PlanEstudioId,
      MateriaId: materia.MateriaId,  // Este es el ID de la materia, no el PlanEstudioId
      Materia: {
        MateriaId: materia.MateriaId,
        Materia: materia.Materia,
      }
    })),
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };

  this.PlanEstudios.update((PlanEstudio) => [...PlanEstudio, nuevaPlanEstudio]);
}



public borrarPlanEstudio(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/planestudio/' + Id).subscribe(() => {
    this.PlanEstudios.update((PlanEstudios) => PlanEstudios.filter((PlanEstudio) => PlanEstudio.PlanEstudioId !== Id));
  });
};
  // Método para redirigir a la edición del estudiante
  public redirigirEditarPlanEstudio(id: string): void {
    // Navega a la ruta que tenga el parámetro de id
    this.router.navigate(['/EditarPlanEstudio', id]);
  }
redirigirCrearPlanEstudio() {
  window.location.href = '/CrearPlanEstudio';
}
}
