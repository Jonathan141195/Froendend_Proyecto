
import { Component, signal } from '@angular/core';
import { OfertaAcademica } from './../modelo/OfertaAcademica';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Carrera } from './../modelo/Carrera';
import { Curso } from './../modelo/Curso';
import { Periodo } from './../modelo/OfertaAcademica';

@Component({
  selector: 'app-crear-oferta-academica',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-oferta-academica.component.html',
  styleUrl: './crear-oferta-academica.component.css'
})
export class CrearOfertaAcademicaComponent {


public OfertaAcademicas = signal<OfertaAcademica[]>([]);
  public Carreras = signal<Carrera[]>([]);
  public Cursos = signal<Curso[]>([]);
  public OfertaAcademica: string = '';
  public CarreraId: string = '';
  public Anno: string= '';
  public FechaRegistro: string[] = [];
 // Crear la propiedad listaMaterias como un arreglo de Materia
public listaCursos: Curso[] = [];
public selectedCarrera: string = ''; 
public cursoSeleccionado: string = '';
public fechaRegistro: string = '';

  public CursoId: string[] = []; // Arreglo para almacenar los SedeIds seleccionados
  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public CursosSeleccionados = signal<{ MateriaId: string; Semestre: number; Requisitos: string }[]>([]);
  cursosSeleccionados: any[] = []; // O el tipo de dato que uses
  periodo: Periodo = Periodo.I_CUATRIMESTRE; // Inicializa con un valor del enum
  periodos: Periodo[] = [Periodo.I_CUATRIMESTRE, Periodo.II_CUATRIMESTRE, Periodo.III_CUATRIMESTRE];


  constructor(private http: HttpClient, private router: Router) {
    this.metodoGETCursos();
    this.metodoGETCarreras();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  agregarCurso(cursoId: string,  fechaRegistro: string) {
    
  
    this.cursosSeleccionados.push({ 
      CursoId: cursoId, 
      FechaRegistro: fechaRegistro, 
    });
  }
  obtenerNombreCurso(cursoId: string): string {
    const curso = this.Cursos().find(c => c.CursoId === cursoId);
    return curso?.Curso || 'Nombre no disponible';
  }
  
  
  public metodoGETCarreras() {
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
  public metodoGETCursos() {
    this.http.get('http://localhost/cursos').subscribe({
      next: (Cursos) => {
        console.log('Respuesta de /cursos:', Cursos); // 👈 Verifica qué viene del backend
  
        const arr = Cursos as Curso[];
        arr.forEach((Curso) => {
          this.agregarCursosALaSenial(
            Curso.CursoId?.toString() || '',
            Curso.Curso || '',
            Curso.Docente?.DocenteId?.toString() || '',
            Curso.Materia?.MateriaId?.toString() || '',
            Curso.Materia?.Materia || '',
            Curso.Docente?.Docente || '',
            Curso.Sede?.SedeId?.toString() || '',
            Curso.Sede?.Sede || '',
            Curso.Materia?.Creditos?.toString() || '',
            Curso.FechaInicio || '',
            Curso.FechaFin || '',
            Curso.CupoDisponible?.toString() || '',
            Curso.CupoMaximo?.toString() || '',
            Curso.Estado || '',
            Curso.FechaDeCreacion || '',
            Curso.ActualizadoEn || ''
          );
        });
  
        console.log('Cursos señal actualizados:', this.Cursos()); // 👈 Verifica si el signal se llenó
      },
      error: (err) => {
        console.error('Error al obtener cursos:', err); // 👈 Captura errores de red/backend
      }
    });
  }
  
  
  
  public agregarCursosALaSenial(
    CursoId: string = '',
    Curso: string = '',
    DocenteId: string = '',
    MateriaId: string = '',
    Materia: string = '',
    Docente: string = '',
    SedeId: string = '',
    Sede:string= '',
    Creditos:string= '',
    FechaInicio: string = '',
    FechaFin: string = '',
    CupoDisponible: string = '',
    CupoMaximo: string = '',
    Estado: string = '',
    FechaDeCreacion: string = '',
    ActualizadoEn: string = ''
  ) {
    let nuevaCurso = {
      CursoId,
      Curso,
      Docente: {
        Docente,
        DocenteId
      },
      Materia: {
        Materia, // Modifica si lo necesitas
        MateriaId,
        Creditos,
      },
      Sede: {
        Sede,
        SedeId
      },
      FechaInicio,
      FechaFin,
      CupoDisponible,
      CupoMaximo,
      Estado,
      FechaDeCreacion,
      ActualizadoEn
    };
    this.Cursos.update((Cursos) => [...Cursos, nuevaCurso]);
  }
  // Método para enviar el plan de estudio
  agregarOfertaAcademica() {
  

    const cuerpo = {
      
      OfertaAcademica: this.OfertaAcademica,
      CarreraId: this.CarreraId,
      FechaDeCreacion: new Date().toISOString(),
      Periodo:this.periodo,
      Anno:this.Anno,
      ActualizadoEn: new Date().toISOString(),
      CursosOfertaAcademica: this.cursosSeleccionados.map(curso => ({
        CursoId: parseInt(curso.CursoId, 10),
        FechaRegistro:curso.FechaRegistro,
      }))
    };

    this.http.post('http://localhost/OfertaAcademica', cuerpo).subscribe({
      next: () => {
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Oferta Academica creado correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
          this.router.navigate(['/OfertaAcademica']);
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
  public onCursoChange(event: any) {
    const cursoId = event.target.value;
    if (this.CursoId.includes(cursoId)) {
      // Si ya está seleccionado, lo eliminamos
      this.CursoId = this.CursoId.filter((id) => id !== cursoId);
    } else {
      // Si no está seleccionado, lo agregamos
      this.CursoId.push(cursoId);
    }
  }
  public agregarFilaCurso() {
    if (this.Cursos().length === 0) {
      alert('No hay Cursos disponibles para agregar.');
      return;
    }
  }
  public listaCurso: any[] = [];

public metodoGETCurso() {
  this.http.get('http://localhost/curso').subscribe((cursos) => {
    this.listaCurso = cursos as any[];
  });
}
onCarreraChange(event: any) {
  console.log('Estudiante seleccionada ID:', event.target.value);
  this.Carreras = event.target.value; // Asigna el ID seleccionado a la variable
  }

  public eliminarCurso(index: number) {
    this.CursosSeleccionados.update((CursosSeleccionados) =>
      CursosSeleccionados.filter((_, i) => i !== index)
    );
  }
  alternarCurso(cursoId: string) {
    const index = this.cursosSeleccionados.findIndex(c => c.CursoId === cursoId);
    if (index > -1) {
      this.cursosSeleccionados.splice(index, 1);
    } else {
      const curso = this.Cursos().find(c => c.CursoId === cursoId);
      if (curso) {
        this.cursosSeleccionados.push(curso);
      }
    }
  }
  
  esCursoSeleccionado(cursoId: string): boolean {
    return this.cursosSeleccionados.some(c => c.CursoId === cursoId);
  }
  
    
 
}


