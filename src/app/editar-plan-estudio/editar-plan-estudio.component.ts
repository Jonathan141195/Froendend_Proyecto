import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Carrera, CarreraOnSedes } from '../modelo/Carrera';
import { Materia } from '../modelo/Materia';
import { PlanEstudio, MateriasOnPlanEstudio } from '../modelo/PlanEstudio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-plan-estudio',
  imports: [
    CommonModule,
    FormsModule  // Añadir FormsModule aquí
  ],
  templateUrl: './editar-plan-estudio.component.html',
  styleUrl: './editar-plan-estudio.component.css'
})
export class EditarPlanEstudioComponent {


  public planestudioId: string | null;
  public PlanEstudio: PlanEstudio = {
    CarreraId: '',
    PlanEstudioId: '',
    PlanEstudio: '',
    MateriasOnPlanEstudio: [],
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };
  public CarreraId:string = '';

  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public tipoAlerta: 'success' | 'error' = 'success';
  public Materias = signal<Materia[]>([]);
  public Carreras = signal<Carrera[]>([]);
  public PlanEstudios = signal<PlanEstudio[]>([]);


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.planestudioId = this.route.snapshot.paramMap.get('id');
    if (this.planestudioId) {
      this.cargarDatosPlanEstudio(this.planestudioId);
       
    }
  }
  ngOnInit() {
    this.metodoGETCarrera();  
    this.metodoGETMaterias();
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
 
  cargarDatosPlanEstudio(id: string): void {
    this.http.get<any[]>(`http://localhost/planEstudio/${id}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          // Asignamos los valores directamente a la propiedad Carrera
          this.PlanEstudio = {
            // Campos de Carrera
            PlanEstudioId: datos.PlanEstudioId ?? '',
            PlanEstudio: datos.PlanEstudio ?? '',
            CarreraId:datos.CarreraId ?? '',
            FechaDeCreacion: datos.FechaDeCreacion ?? '',
            ActualizadoEn: datos.ActualizadoEn ?? '',
            MateriasOnPlanEstudio: (datos.MateriasOnPlanEstudio ?? []).map((item: any) => ({
              PlanEstudioId: item.PlanEstudioId ?? '',
              MateriaId: item.MateriaId ?? '',
              Materia: {
                Materia: item.Materia?.Materia ?? '',
                MateriaId: item.Materia?.MateriaId ?? ''
              }
            })),
     
          };
        } else {
          console.warn('No se encontraron datos para la carrera con el ID proporcionado.');
        }
      },
      error: (err) => {
        console.error('Error al cargar datos de la carrera:', err);
      }
    });
  }
  
  

  modificarPlanEstudio(Id: string | undefined, event: Event): void {
    event.preventDefault();
    if (!this.PlanEstudio.PlanEstudio || this.PlanEstudio.MateriasOnPlanEstudio.length === 0) {
      this.alerta('Debe completar todos los campos obligatorios.', 'error');
      return;
    }

    this.http.put(`http://localhost/planestudio/${Id}`, this.PlanEstudio).subscribe({
      next: () => {
        this.alerta('Plan Estudio modificada correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/PlanEstudio']), 2000);
      },
      error: (err) => {
        this.alerta('Ocurrió un error al modificar la carrera.', 'error');
        console.error(err);
      }
    });
  }

  isMateriaSelected(materiaId: string): boolean {
    return this.PlanEstudio.MateriasOnPlanEstudio.some(materia => materia.MateriaId === materiaId);
  }
  onCarreraChange(event: any) {
    this.CarreraId = event.target.value;
    console.log('Distrito seleccionado:', this.CarreraId);
  }
  

  alerta(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000);
  }
  onMateriaChange(materiaId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.PlanEstudio.MateriasOnPlanEstudio.push({
        MateriaId: materiaId,
        Requisitos: undefined, // Sin requisito por defecto
 // Sin requisito por defecto
        Semestre: undefined, // Sin cuatrimestre por defecto
      });
    } else {
      this.PlanEstudio.MateriasOnPlanEstudio = this.PlanEstudio.MateriasOnPlanEstudio.filter(
        (materia) => materia.MateriaId !== materiaId
      );
    }
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
  
  
}
