
import { Component, signal } from '@angular/core';
import { Matricula } from './../modelo/Matricula';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Estudiante } from './../modelo/Estudiante';
import { Curso } from './../modelo/Curso';
import { Carrera } from './../modelo/Carrera';
import { EstadoMatricula } from './../modelo/Matricula';
import { Periodo } from './../modelo/OfertaAcademica';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-crear-matricula',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-matricula.component.html',
  styleUrl: './crear-matricula.component.css'
})
export class CrearMatriculaComponent {

  public CostoPorCredito: number = 15000;
  public CostoMatricula: number = 30000;
  public CostoPoliza: number = 16000;
  public TotalMatricula: number = 0;
  

  public Matriculas = signal<Matricula[]>([]);
  public Estudiantes = signal<Estudiante[]>([]);
  public Cursos = signal<Curso[]>([]);
  public Matricula: string = '';
  public Creditos: string = '';
  public EstudianteId: string = '';
  public Nota: string[] = [];
  public Estado: EstadoMatricula[] = [];
  public FechaRegistro: string[] = [];
 // Crear la propiedad listaMaterias como un arreglo de Materia
public listaCursos: Curso[] = [];
public selectedEstudiante: string = ''; 
 public CarreraId: string = ''; 
  public CursoId: string[] = []; // Arreglo para almacenar los SedeIds seleccionados
  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public CursosSeleccionados = signal<{ MateriaId: string; Semestre: number; Requisitos: string }[]>([]);
  public cursosSeleccionados: string[] = []; // ← solo los IDs
  estado: EstadoMatricula = EstadoMatricula.Pendiente; // Inicializa con un valor del enum
  estados: EstadoMatricula[] = [EstadoMatricula.Pendiente, EstadoMatricula.ParcialmentePagado, EstadoMatricula.Pagado,EstadoMatricula.Cancelado];
  periodo: Periodo = Periodo.I_CUATRIMESTRE; // Inicializa con un valor del enum
  periodos: Periodo[] = [Periodo.I_CUATRIMESTRE, Periodo.II_CUATRIMESTRE, Periodo.III_CUATRIMESTRE];
  public Carreras: Carrera[] = [];
  public anios: number[] = [];
public anioSeleccionado: number = 2025; // valor inicial



  constructor(private http: HttpClient, private router: Router) {
    this.metodoGETCursos();
    this.metodoGETEstudiantes();
    this.inicializarAnios();
    
  }

  private inicializarAnios(): void {
    this.anios = [];
    for (let anio = 2025; anio <= 2030; anio++) {
      this.anios.push(anio);
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  public obtenerCarrerasPorEstudiante(estudianteId: string) {
    if (!estudianteId) {
      console.error('El ID del estudiante es requerido.');
      return;
    }
  
    const url = `http://localhost/estudiante/${estudianteId}/carreras`;
    this.http.get<Carrera[]>(url).subscribe({
      next: (carreras) => {
        this.Carreras = carreras; // Actualiza el array Carreras
        console.log('Carreras obtenidas:', this.Carreras);
      },
      error: (err) => {
        console.error('Error al obtener las carreras del estudiante:', err);
      },
    });
  }
  
  public esCursoSeleccionado(cursoId: string): boolean {
    return this.cursosSeleccionados.includes(cursoId);
  }
  
  
 
  
  public metodoGETEstudiantes() {
    let cuerpo = {};
    this.http.get('http://localhost/estudiante', cuerpo).subscribe((Estudiantes) => {
      const arr = Estudiantes as Estudiante[];
      arr.forEach((Estudiante) => {
        this.agregarEstudiantesALaSenial(Estudiante.Estudiante,Estudiante.EstudianteId,Estudiante.Cedula,Estudiante.Email,Estudiante.Telefono,Estudiante.Direccion,Estudiante.FechaDeCreacion, Estudiante.ActualizadoEn);
      });
      console.log(typeof(arr));
    });
  };
  
  
  
  public agregarEstudiantesALaSenial(Estudiante: string, EstudianteId?: string, Cedula?: string,Email?:string,Telefono?:string,Direccion?:string, FechaDeCreacion?: string
    , ActualizadoEn?: string) {
    let nuevaEstudiante = {
      EstudianteId:EstudianteId,
      Estudiante: Estudiante,
      Cedula:Cedula,
      Email:Email,
      Telefono:Telefono,
      Direccion:Direccion,
      FechaDeCreacion: FechaDeCreacion,
      ActualizadoEn: ActualizadoEn,
    };
    this.Estudiantes.update((Estudiantes) => [...Estudiantes, nuevaEstudiante]);
  };
  public metodoGETCursos() {
    this.http.get('http://localhost/cursos').subscribe((Cursos) => {
      const arr = Cursos as Curso[];
      arr.forEach((Curso) => {
        this.agregarCursosALaSenial(
          Curso.CursoId?.toString() || '',
          Curso.Curso || '',
          Curso.Docente?.DocenteId?.toString() || '', // Accediendo a la propiedad DocenteId dentro de Docente
          Curso.Materia?.MateriaId?.toString() || '', // Accediendo a la propiedad MateriaId dentro de Materia
          Curso.Sede?.SedeId?.toString() || '', // Accediendo a la propiedad SedeId dentro de Sede
          Curso.FechaInicio || '',
          Curso.FechaFin || '',
          Curso.CupoDisponible?.toString() || '',
          Curso.CupoMaximo?.toString() || '',
          Curso.Estado || '',
          Curso.FechaDeCreacion || '',
          Curso.ActualizadoEn || ''
        );
      });
      console.log(typeof arr);
    });
  }
  
  
  
  public agregarCursosALaSenial(
    CursoId: string = '',
    Curso: string = '',
    DocenteId: string = '',
    Docente: string = '',
    MateriaId: string = '',
    Materia: string = '',
    Creditos: string = '',
    SedeId: string = '',
    Sede: string = '',
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
        Docente, // Puedes modificar este campo si lo necesitas
        DocenteId
      },
      Materia: {
        Materia, // Modifica si lo necesitas
        MateriaId,
        Creditos,
      },
      Sede: {
        Sede, // Modifica si lo necesitas
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


  agregarMatricula() {
   
  
    const fechaActual = new Date().toISOString();
  
    const cuerpo: Matricula = {
      MatriculaId: '',
      Matricula: this.Matricula,
      EstudianteId: this.EstudianteId.toString(),
      CursosMatriculados: this.cursosSeleccionados.map(cursoId => ({
        MatriculaId: '',
        CursoId: cursoId,
        FechaInscripcion: fechaActual
      })),
      
      FechaDeMatricula: fechaActual,
      EstadoMatricula: 'Pendiente',
      CostoPorCredito: this.CostoPorCredito.toString(),
      CostoMatricula: this.CostoMatricula.toString(),
      CostoPoliza: this.CostoPoliza.toString(),
      TotalMatricula: this.TotalMatricula.toString(),
      FechaDeCreacion: fechaActual,
      ActualizadoEn: fechaActual
    };
  
    this.http.post('http://localhost/matricula', cuerpo).subscribe({
      next: () => {
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Matrícula creada correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
          this.router.navigate(['/Matricula']);
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
  
  
  
  
  public onEstudianteSeleccionado(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const estudianteId = selectElement.value;
    this.obtenerCarrerasPorEstudiante(estudianteId);
  
    // Llamar cursos cuando el estudiante y carrera cambien
    setTimeout(() => {
      if (this.CarreraId && this.periodo && this.anioSeleccionado) {
        this.obtenerCursosPorOferta();
      }
    }, 500); // esperar que la carrera se cargue
  }
  
  
  public toggleSeleccionCurso(cursoId: string): void {
    const index = this.cursosSeleccionados.indexOf(cursoId);
    if (index > -1) {
      this.cursosSeleccionados.splice(index, 1);
    } else {
      this.cursosSeleccionados.push(cursoId);
    }
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
onEstudianteChange(event: any) {
  console.log('Estudiante seleccionada ID:', event.target.value);
  this.Estudiantes = event.target.value; // Asigna el ID seleccionado a la variable
  }



  public eliminarCurso(index: number) {
    this.CursosSeleccionados.update((CursosSeleccionados) =>
      CursosSeleccionados.filter((_, i) => i !== index)
    );
  }

  public obtenerCursosPorOferta() {
    console.log("CarreraId:", this.CarreraId);
    console.log("Periodo:", this.periodo);
    console.log("Año:", this.anioSeleccionado);
  
    if (!this.CarreraId || !this.periodo || !this.anioSeleccionado) {
      console.error('Faltan parámetros para obtener los cursos.');
      return;
    }
  
    const url = 'http://localhost/matricula/cursos-oferta';
    const params = new HttpParams()
      .set('carreraId', this.CarreraId)
      .set('periodo', this.periodo)
      .set('anno', this.anioSeleccionado.toString());
  
    this.http.get<Curso[]>(url, { params }).subscribe({
      next: (cursos) => {
        console.log('Cursos obtenidos del backend:', cursos); // Asegura que se reciban datos
        this.listaCursos = cursos;
      },
      error: (err) => {
        console.error('Error al obtener los cursos de la oferta académica:', err);
      },
    });
  }
  public calcularCostoTotal(): void {
    let totalCreditos = 0;

this.cursosSeleccionados.forEach(cursoId => {
  const cursoInfo = this.listaCursos.find(c => c.CursoId === cursoId);
  if (cursoInfo?.Materia?.Creditos) {
    totalCreditos += +cursoInfo.Materia.Creditos; // Convierte a número y suma
  }
});

  
    const costoCreditos = totalCreditos * this.CostoPorCredito;
    this.TotalMatricula = costoCreditos + this.CostoMatricula + this.CostoPoliza;
  }
  
  
}
 

