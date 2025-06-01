import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Estudiante } from '../modelo/Estudiante';
import { Curso } from '../modelo/Curso';
import { HistoricoAcademico,CursosHistorico,Estado} from '../modelo/Historicoacademico';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-historico-academico',
  imports: [
    CommonModule,
    FormsModule  // Añadir FormsModule aquí
  ],
  templateUrl: './editar-historico-academico.component.html',
  styleUrl: './editar-historico-academico.component.css'
})
export class EditarHistoricoAcademicoComponent {



  public historicoacademicoId: string | null;
  public HistoricoAcademico: HistoricoAcademico = {
    EstudianteId: '',
    HistoricoAcademicoId: '',
    HistoricoAcademico: '',
    CursosHistorico: [],
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };
  public EstudianteId:string = '';

  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public tipoAlerta: 'success' | 'error' = 'success';
  public Cursos = signal<Curso[]>([]);
  public Estudiantes = signal<Estudiante[]>([]);
  public HistoricoAcademicos = signal<HistoricoAcademico[]>([]);
  public estadosCurso = [
    
    { value: Estado.Aprobado, label: 'Aprobado' },
    { value: Estado.Reprobado, label: 'Reprobado' },
    { value: Estado.EnProceso, label: 'EnProceso' }
  ];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.historicoacademicoId = this.route.snapshot.paramMap.get('id');
    if (this.historicoacademicoId) {
      this.cargarDatosHistoricoAcademico(this.historicoacademicoId);
       
    }
  }
  ngOnInit() {
    this.cargarEstudiantes() 
    this.metodoGETCursos();
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
  
    // Método para cargar los distritos
    cargarEstudiantes(): void {
      this.http.get<Estudiante[]>('http://localhost/estudiante').subscribe({
        next: (data) => {
          console.log("Estudiantes cargados:", data); // Verifica que realmente se están obteniendo los datos
          this.Estudiantes.update(() => data);
          
          // Cargar los datos del historial académico después de cargar los estudiantes
          if (this.historicoacademicoId) {
            this.cargarDatosHistoricoAcademico(this.historicoacademicoId);
          }
        },
        error: (err) => {
          console.error('Error al cargar estudiantes:', err);
        }
      });
    }
    
  
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
  cargarDatosHistoricoAcademico(id: string): void {
    this.http.get<any[]>(`http://localhost/historicoacademico/${id}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          // Asignamos los valores directamente a la propiedad Carrera
          this.HistoricoAcademico = {
            // Campos de Carrera
            HistoricoAcademicoId: this.historicoacademicoId ?? '',
            HistoricoAcademico: datos.HistoricoAcademico ?? '',
            EstudianteId:datos.EstudianteId ?? '',
            FechaDeCreacion: datos.FechaDeCreacion ?? '',
            ActualizadoEn: datos.ActualizadoEn ?? '',
            CursosHistorico: (datos.CursosHistorico ?? []).map((item: any) => ({
              HistoricoAcademicoId: item.HistorialAcademicoId ?? '',
              CursoId: item.CursoId ?? '',
              Nota:item.Nota?? '',
              Estado:item.Estado?? '',
              FechaRegistro:item.FechaRegistro?? '',
              Curso: {
                Curso: item.Curso?.Curso ?? '',
                CursoId: item.Curso?.CursoId ?? ''
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
  
  
  modificarHistoricoAcademico(Id: string | undefined, event: Event): void {
    event.preventDefault();
    if (!this.HistoricoAcademico.HistoricoAcademico|| this.HistoricoAcademico.CursosHistorico.length === 0) {
      this.alerta('Debe completar todos los campos obligatorios.', 'error');
      return;
    }

    this.http.put(`http://localhost/historicoacademico/${Id}`, this.HistoricoAcademico).subscribe({
      next: () => {
        this.alerta('Plan Estudio modificada correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/HistoricoAcademico']), 2000);
      },
      error: (err) => {
        this.alerta('Ocurrió un error al modificar la carrera.', 'error');
        console.error(err);
      }
    });
  }




  isCursosSelected(cursoId: string): boolean {
    return this.HistoricoAcademico.CursosHistorico.some(curso => curso.CursoId === cursoId);
  }
  onEstudianteChange(event: any) {
    this.EstudianteId = event.target.value;
    console.log('Distrito seleccionado:', this.EstudianteId);
  }
  

  alerta(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000);
  }
  onCursoChange(cursoId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.HistoricoAcademico.CursosHistorico.push({
        CursoId: cursoId,
        Nota: undefined, // Sin requisito por defecto
 // Sin requisito por defecto
        Estado: undefined, // Sin cuatrimestre por defecto
      });
    } else {
      this.HistoricoAcademico.CursosHistorico = this.HistoricoAcademico.CursosHistorico.filter(
        (curso) => curso.CursoId !== cursoId
      );
    }
  }
  
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
    MateriaId: string = '',
    SedeId: string = '',
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
        Docente: 'Nombre del Docente', // Puedes modificar este campo si lo necesitas
        DocenteId
      },
      Materia: {
        Materia: 'Nombre de la Materia', // Modifica si lo necesitas
        MateriaId
      },
      Sede: {
        Sede: 'Nombre de la Sede', // Modifica si lo necesitas
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
    agregarCurso(): void {
      const nuevoCurso = {
        CursoId: '',  // Deberías asignar un valor real si estás obteniendo los cursos desde un servicio
        Nota: undefined,
        Estado: undefined,
        FechaRegistro: new Date().toISOString(),
       
      };
      this.HistoricoAcademico.CursosHistorico.push(nuevoCurso);
    }
  
    // Método para eliminar un curso de la tabla
    eliminarCurso(index: number): void {
      this.HistoricoAcademico.CursosHistorico.splice(index, 1);
      this.notificarCambio(index, 'eliminar');
    }
  
    // Método para notificar cuando se cambia estado o nota
    notificarCambio(index: number, tipo: 'estado' | 'nota' | 'eliminar'): void {
      if (tipo === 'estado') {
        this.alerta(`El estado del curso ha sido actualizado.`, 'success');
      } else if (tipo === 'nota') {
        this.alerta(`La nota del curso ha sido actualizada.`, 'success');
      } else if (tipo === 'eliminar') {
        this.alerta(`El curso ha sido eliminado.`, 'error');
      }
    }
  
  
}

