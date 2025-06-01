import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Docente } from '../modelo/Docente';
import { Materia } from '../modelo/Materia';
import { Sede } from '../modelo/Sede';
import { Curso } from '../modelo/Curso';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-curso',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-curso.component.html',
  styleUrl: './editar-curso.component.css'
})
export class EditarCursoComponent {


  public cursoId: string | null;
  public Curso: Curso = {
    CursoId: '',  // ID del curso
    Curso: '',     // Nombre del curso
    Materia: {
      Materia: '',    // Nombre de la materia
      MateriaId: ''   // ID de la materia
    },
    Docente: {
      Docente: '',    // Nombre del docente
      DocenteId: ''   // ID del docente
    },
    Sede: {
      Sede: '',       // Nombre de la sede
      SedeId: ''      // ID de la sede
    },
    FechaInicio: '',   // Fecha de inicio del curso
    FechaFin: '',      // Fecha de fin del curso
    HoraInicial: '',   // Hora de inicio
    HoraFinal: '',     // Hora de finalización
    CupoMaximo: '',    // Cupo máximo
    CupoDisponible: '',// Cupo disponible
    Estado: '',        // Estado del curso
    FechaDeCreacion: '',   // Fecha de creación del curso
    ActualizadoEn: ''      // Fecha de la última actualización
  };
  
  

  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public tipoAlerta: 'success' | 'error' = 'success';
  public Cursos = signal<Curso[]>([]);
  public Materias = signal<Materia[]>([]);
  public Sedes = signal<Sede[]>([]);
  public Docentes = signal<Docente[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.cursoId = this.route.snapshot.paramMap.get('id');
    if (this.cursoId) {
      this.cargarDatosCursos(this.cursoId);
    }
  }
  ngOnInit(): void {
    this.cargarSedes();
    this.cargarDocentes();
    this.cargarMaterias();
    if (this.cursoId) {
      this.cargarDatosCursos(this.cursoId);
    }
  }
  cargarSedes(): void {
    this.http.get<Sede[]>('http://localhost/Sedes').subscribe({
      next: (data) => this.Sedes.update(() => data),
      error: (err) => {
        this.alerta('Ocurrió un error al cargar las sedes.', 'error');
        console.error(err);
      }
    });
  }
  cargarMaterias(): void {
    this.http.get<Materia[]>('http://localhost/Materia').subscribe({
      next: (data) => this.Materias.update(() => data),
      error: (err) => {
        this.alerta('Ocurrió un error al cargar las Materias.', 'error');
        console.error(err);
      }
    });
  }
  cargarDocentes(): void {
    this.http.get<Docente[]>('http://localhost/Docente').subscribe({
      next: (data) => this.Docentes.update(() => data),
      error: (err) => {
        this.alerta('Ocurrió un error al cargar los Docente.', 'error');
        console.error(err);
      }
    });
  }
 
 
  cargarDatosCursos(id: string): void {
  this.http.get<any[]>(`http://localhost/cursos/${id}`).subscribe({
    next: (data) => {
      const datos = data[0];
      if (datos) {
        // Asignamos los valores directamente a la propiedad Curso
        this.Curso = {
          // Campos de Curso
          CursoId: datos.CursoId ?? '',
          Curso: datos.Curso ?? '',
          Materia: {
            Materia: datos.Materia?.Materia ?? '',
            MateriaId: datos.Materia?.MateriaId ?? '',
          },
          Docente: {
            Docente: datos.Docente?.Docente ?? '',
            DocenteId: datos.Docente?.DocenteId ?? '',
          },
          Sede: {
            Sede: datos.Sede?.Sede ?? '',
            SedeId: datos.Sede?.SedeId ?? '',
          },
          FechaInicio: datos.FechaInicio ? new Date(datos.FechaInicio).toISOString().split('T')[0] : '',
          FechaFin: datos.FechaFin ? new Date(datos.FechaFin).toISOString().split('T')[0] : '',
          HoraInicial: datos.HoraInicial ? new Date(datos.HoraInicial).toISOString().substr(11, 5) : '',
          HoraFinal: datos.HoraFinal ? new Date(datos.HoraFinal).toISOString().substr(11, 5) : '',
          CupoMaximo: datos.CupoMaximo ?? '',
          CupoDisponible: datos.CupoDisponible ?? '',
          Estado: datos.Estado ?? '',
          FechaDeCreacion: datos.FechaDeCreacion ?? '',
          ActualizadoEn: datos.ActualizadoEn ?? '',
        };
      } else {
        console.warn('No se encontraron datos para el curso con el ID proporcionado.');
      }
    },
    error: (err) => {
      console.error('Error al cargar datos del curso:', err);
    }
  });
}



modificarCurso(Id: string | undefined, event: Event): void {
  event.preventDefault();

  // Verificar que los campos obligatorios estén completos
  if (!this.Curso.Curso || this.Curso.Curso.length === 0) {
    this.alerta('Debe completar todos los campos obligatorios.', 'error');
    return;
  }

  // Convertir los IDs a enteros
  const MateriaId = this.Curso.Materia?.MateriaId ? parseInt(this.Curso.Materia.MateriaId) : NaN;
  const DocenteId = this.Curso.Docente?.DocenteId ? parseInt(this.Curso.Docente.DocenteId) : NaN;
  const SedeId = this.Curso.Sede?.SedeId ? parseInt(this.Curso.Sede.SedeId) : NaN;

  // Verificar que los IDs sean válidos
  if (isNaN(MateriaId) || isNaN(DocenteId) || isNaN(SedeId)) {
    this.alerta('Los IDs de Materia, Docente o Sede no son válidos.', 'error');
    return;
  }

  // Convertir los valores de CupoMaximo y CupoDisponible a enteros
  const CupoMaximo = this.Curso.CupoMaximo ? parseInt(this.Curso.CupoMaximo) : 0;
  const CupoDisponible = this.Curso.CupoDisponible ? parseInt(this.Curso.CupoDisponible) : 0;

  // Verificar que los valores de CupoMaximo y CupoDisponible sean válidos
  if (isNaN(CupoMaximo) || isNaN(CupoDisponible)) {
    this.alerta('Los valores de Cupo Máximo o Cupo Disponible no son válidos.', 'error');
    return;
  }


  // Asegurarse de que los datos sean correctos antes de enviar
  const cursoData = {
    Curso: this.Curso.Curso,  // Nombre del curso
    MateriaId,  // Solo enviar el ID de la materia
    DocenteId,  // Solo enviar el ID del docente
    SedeId,  // Solo enviar el ID de la sede
    FechaInicio:this.Curso.FechaInicio,  // Fecha de inicio en formato ISO 8601
    FechaFin:this.Curso.FechaFin,  // Fecha de fin en formato ISO 8601
    HoraInicial: this.Curso.HoraInicial,  // Hora inicial en formato ISO 8601
    HoraFinal: this.Curso.HoraFinal,  // Hora final en formato ISO 8601
    CupoMaximo,  // Cupo máximo (ya parseado a entero)
    CupoDisponible,  // Cupo disponible (ya parseado a entero)
    Estado: this.Curso.Estado,  // Estado del curso
  };

  // Hacer la solicitud PUT al backend
  this.http.put(`http://localhost/cursos/${Id ?? ''}`, cursoData).subscribe({
    next: () => {
      this.alerta('Curso modificado correctamente.', 'success');
      setTimeout(() => this.router.navigate(['/Cursos']), 2000);
    },
    error: (err) => {
      this.alerta('Ocurrió un error al modificar el curso.', 'error');
      console.error(err);
    }
  });
}


  alerta(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000);
  }
}




  
