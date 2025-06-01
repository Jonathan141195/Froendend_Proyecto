import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Curso } from './../modelo/Curso';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [JsonPipe, CommonModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent {
  public Cursos = signal<Curso[]>([]);

  constructor(private http: HttpClient,private router: Router) {
    this.metodoGETCurso();
  }

  public metodoGETCurso() {
    this.http.get('http://localhost/cursos').subscribe((Cursos) => {
      const arr = Cursos as Curso[];
      arr.forEach((Curso) => {
        // Verifica si los valores están disponibles en los objetos relacionados
        const docente = Curso.Docente?.Docente || 'Nombre del Docente';  // Suponiendo que el nombre del docente esté disponible en `Nombre`
        const materia = Curso.Materia?.Materia || 'Nombre de la Materia'; // Suponiendo que el nombre de la materia esté disponible en `Nombre`
        const sede = Curso.Sede?.Sede || 'Nombre de la Sede'; // Suponiendo que el nombre de la sede esté disponible en `Nombre`
  
        this.agregarCursosALaSenial(
          Curso.CursoId?.toString() || '',
          Curso.Curso || '',
          Curso.Docente?.DocenteId?.toString() || '', // Accediendo a la propiedad DocenteId dentro de Docente
          Curso.Materia?.MateriaId?.toString() || '', // Accediendo a la propiedad MateriaId dentro de Materia
          Curso.Sede?.SedeId?.toString() || '', // Accediendo a la propiedad SedeId dentro de Sede
          Curso.FechaInicio || '',
          Curso.HoraInicial || '',
          Curso.HoraFinal || '',
          Curso.FechaFin || '',
          Curso.CupoDisponible?.toString() || '',
          Curso.CupoMaximo?.toString() || '',
          Curso.Estado || '',
          Curso.FechaDeCreacion || '',
          Curso.ActualizadoEn || '',
          docente,  // Pasando el nombre del docente
          materia,  // Pasando el nombre de la materia
          sede // Pasando el nombre de la sede
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
    HoraInicial: string = '',
    HoraFinal: string = '',
    CupoDisponible: string = '',
    CupoMaximo: string = '',
    Estado: string = '',
    FechaDeCreacion: string = '',
    ActualizadoEn: string = '',
    Docente: string = '',
    Materia: string = '',
    Sede: string = ''
  ) {
    let nuevaCurso = {
      CursoId,
      Curso,
      Docente: {
        Docente, // Ahora tenemos el nombre del docente
        DocenteId
      },
      Materia: {
        Materia, // Ahora tenemos el nombre de la materia
        MateriaId
      },
      Sede: {
        Sede, // Ahora tenemos el nombre de la sede
        SedeId
      },
      FechaInicio,
      FechaFin,
      HoraFinal,
      HoraInicial,
      CupoDisponible,
      CupoMaximo,
      Estado,
      FechaDeCreacion,
      ActualizadoEn
    };
    this.Cursos.update((Cursos) => [...Cursos, nuevaCurso]);
  }
  
  public borrarCurso(Id: string) {
    this.http.delete(`http://localhost/cursos/${Id}`).subscribe({
      next: () => {
        this.Cursos.update((Cursos) => Cursos.filter((Curso) => Curso.CursoId !== Id));
      },
      error: (err) => {
        console.error('Error al eliminar curso:', err);
      }
    });
  }

  redirigirCrearCurso() {
    window.location.href = '/CrearCurso';
  }
  //Método para redirigir a la edición del estudiante
  public redirigirEditarCurso(id: string): void {
    // Navega a la ruta que tenga el parámetro de id
    this.router.navigate(['/EditarCurso', id]);
  }
}
