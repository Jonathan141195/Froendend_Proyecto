import { Component, signal } from '@angular/core';
import { PlanEstudio } from './../modelo/PlanEstudio';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Carrera } from './../modelo/Carrera';
import { Materia } from './../modelo/Materia';

@Component({
  selector: 'app-crear-plan-estudio',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-plan-estudio.component.html',
  styleUrl: './crear-plan-estudio.component.css'
})
export class CrearPlanEstudioComponent {

public PlanEstudios = signal<PlanEstudio[]>([]);
  public Materias = signal<Materia[]>([]);
  public Carreras = signal<Carrera[]>([]);
  public PlanEstudio: string = '';
  public CarreraId: string = '';
  public Requisitos: string[] = [];
  public Semestre: string[] = [];
 // Crear la propiedad listaMaterias como un arreglo de Materia
public listaMaterias: Materia[] = [];
public selectedCarrera: string = ''; 

  public MateriaId: string[] = []; // Arreglo para almacenar los SedeIds seleccionados
  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public MateriasSeleccionadas = signal<{ MateriaId: string; Semestre: number; Requisitos: string }[]>([]);
  materiasSeleccionadas: any[] = []; // O el tipo de dato que uses
 


  constructor(private http: HttpClient, private router: Router) {
    this.metodoGETMaterias();
    this.metodoGETCarrera();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
   // Agregar materia al array
   agregarMateria(materiaId: string, semestre: string, requisito: string) {
    if (!materiaId || !semestre) {
      alert('Seleccione una materia y un semestre.');
      return;
    }

    this.materiasSeleccionadas.push({ MateriaId: materiaId, Semestre: semestre, Requisitos: requisito });
  }


  public metodoGETCarrera() {
    this.http.get('http://localhost/carrera').subscribe((Carreras) => {
      const arr = Carreras as Carrera[];
  
      arr.forEach((Carrera) => {
        this.agregarCarrerasALaSenial(
          Carrera.CarreraId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Carrera.Carrera ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Carrera.CarreraOnSedes?.map((cs) => ({
            SedeId: cs.Sede?.SedeId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
            Sede: cs.Sede?.Sede ?? '',  // Si es undefined, asignamos un valor vacío por defecto
            Direccion: cs.Sede?.Direccion ?? ''  // Si es undefined, asignamos un valor vacío por defecto
          })) ?? [],
          Carrera.FechaDeCreacion ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Carrera.ActualizadoEn ?? ''  // Si es undefined, asignamos un valor vacío por defecto
        );
      });
  
      console.log(typeof arr);
    });
  }
  
  public agregarCarrerasALaSenial(
    CarreraId: string,
    Carrera: string,
    Sedes: { SedeId: string; Sede: string; Direccion: string }[],
    FechaDeCreacion: string,
    ActualizadoEn: string
  ) {
    let nuevaCarrera: Carrera = {
      CarreraId: CarreraId,
      Carrera: Carrera,
      CarreraOnSedes: Sedes.map(sede => ({
        CarreraId: CarreraId, // Aseguramos que tenga CarreraId
        SedeId: sede.SedeId,
        Sede: {
          SedeId: sede.SedeId,
          Sede: sede.Sede,
          Direccion: sede.Direccion
        }
      })),
      FechaDeCreacion: FechaDeCreacion,
      ActualizadoEn: ActualizadoEn,
    };
  
    this.Carreras.update((Carreras) => [...Carreras, nuevaCarrera]);
  }
  
  public metodoGETMaterias() {
    this.http.get('http://localhost/materia').subscribe((Materias) => {
      const arr = Materias as Materia[];
  
      arr.forEach((Materia) => {
        this.agregarMateriasALaSenial(
          Materia.MateriaId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Materia.Materia ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Materia.Creditos ??=0,
          Materia.FechaDeCreacion ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Materia.ActualizadoEn ?? ''  // Si es undefined, asignamos un valor vacío por defecto
        );
      });
  
      console.log(typeof arr);
    });
  }
  
  public agregarMateriasALaSenial(
    MateriaId: string,
    Materia: string,
    Creditos: number,
    FechaDeCreacion: string,
    ActualizadoEn: string
  ) {
    let nuevaMateria: Materia = {
      MateriaId: MateriaId,
      Materia: Materia,
      Creditos: Creditos,
      FechaDeCreacion: FechaDeCreacion,
      ActualizadoEn: ActualizadoEn,
    };
  
    this.Materias.update((Materias) => [...Materias, nuevaMateria]);
  }

  // Método para enviar el plan de estudio
  agregarPlanEstudio() {
    if (!this.PlanEstudio.trim() || this.materiasSeleccionadas.length === 0 || !this.CarreraId) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const cuerpo = {
      PlanEstudioId: this.PlanEstudio,
      PlanEstudio: this.PlanEstudio,
      CarreraId: this.CarreraId,
      FechaDeCreacion: new Date().toISOString(),
      ActualizadoEn: new Date().toISOString(),
      MateriasOnPlanEstudio: this.materiasSeleccionadas.map(materia => ({
        MateriaId: parseInt(materia.MateriaId, 10),
        Semestre: parseInt(materia.Semestre, 10),
        Requisitos:parseInt( materia.Requisitos, 10)
      }))
    };

    this.http.post('http://localhost/planestudio', cuerpo).subscribe({
      next: () => {
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Plan de estudio creado correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
          this.router.navigate(['/PlanEstudio']);
        }, 3000);
      },
      error: err => {
        console.error('Error:', err);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Ocurrió un error.';
        setTimeout(() => this.mostrarAlerta = false, 3000);
      }
    });
  }
  

 

  // Método para manejar el cambio de selección de sede
  public onMateriaChange(event: any) {
    const materiaId = event.target.value;
    if (this.MateriaId.includes(materiaId)) {
      // Si ya está seleccionado, lo eliminamos
      this.MateriaId = this.MateriaId.filter((id) => id !== materiaId);
    } else {
      // Si no está seleccionado, lo agregamos
      this.MateriaId.push(materiaId);
    }
  }
  public agregarFilaMateria() {
    if (this.Materias().length === 0) {
      alert('No hay materias disponibles para agregar.');
      return;
    }
  }
  public listaCarreras: any[] = [];

public metodoGETCarreras() {
  this.http.get('http://localhost/carrera').subscribe((carreras) => {
    this.listaCarreras = carreras as any[];
  });
}
onCarreraChange(event: any) {
  console.log('Carrera seleccionada ID:', event.target.value);
  this.Carreras = event.target.value; // Asigna el ID seleccionado a la variable
  }

  public eliminarMateria(index: number) {
    this.MateriasSeleccionadas.update((MateriasSeleccionadas) =>
      MateriasSeleccionadas.filter((_, i) => i !== index)
    );
  }
 
}

