import { Component, signal, OnInit } from '@angular/core';
import { HistoricoAcademico } from './../modelo/Historicoacademico';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Estudiante } from './../modelo/Estudiante';
import { Curso } from './../modelo/Curso';
import { Estado } from './../modelo/Historicoacademico';
import { jwtDecode } from 'jwt-decode';
import {  HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-crear-historico-academico',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-historico-academico.component.html',
  styleUrl: './crear-historico-academico.component.css'
})
export class CrearHistoricoAcademicoComponent implements OnInit{


public HistoricosAcademicos = signal<HistoricoAcademico[]>([]);
  public Estudiantes = signal<Estudiante[]>([]);
  public Cursos = signal<Curso[]>([]);
  public HistorialAcademico: string = '';
  public EstudianteId: string = '';
  public Nota: string[] = [];
  public Estado: Estado[] = [];
  public FechaRegistro: string[] = [];
 // Crear la propiedad listaMaterias como un arreglo de Materia
public listaCursos: Curso[] = [];
public selectedEstudiante: string = ''; 

  public CursoId: string[] = []; // Arreglo para almacenar los SedeIds seleccionados
  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public CursosSeleccionados = signal<{ MateriaId: string; Semestre: number; Requisitos: string }[]>([]);
  cursosSeleccionados: any[] = []; // O el tipo de dato que uses
  estado: Estado = Estado.EnProceso; // Inicializa con un valor del enum
  estados: Estado[] = [Estado.Aprobado, Estado.EnProceso, Estado.Reprobado];


  constructor(private http: HttpClient, private router: Router) {
    this.metodoGETCursos();
    this.metodoGETEstudiantes();
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
  
    // Verificar existencia de token y rol
    if (!token || rol !== '1') {
      alert('Acceso no autorizado: solo administradores pueden acceder.');
      window.location.href = '/#';
      return;
    }
  
    // Verificar si el token ha expirado
    try {
      const decoded: any = jwtDecode(token);
      const ahora = Date.now() / 1000; // en segundos
  
      if (decoded.exp < ahora) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.clear();
        window.location.href = '/#';
        return;
      }
    } catch (error) {
      console.error('Token inválido:', error);
      alert('Token inválido. Por favor, inicia sesión nuevamente.');
      localStorage.clear();
      window.location.href = '/#';
      return;
    }
  
    this.metodoGETCursos();
    this.metodoGETEstudiantes();
  }
  
  trackByIndex(index: number, item: any): number {
    return index;
  }
  agregarCurso(cursoId: string,  fechaRegistro: string,nota: string, estado: Estado) {
    
  
    this.cursosSeleccionados.push({ 
      CursoId: cursoId, 
      Nota: nota, 
      FechaRegistro: fechaRegistro, 
      Estado: estado 
    });
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
  // Método para enviar el plan de estudio
  agregarHistorialAcademico() {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
  
    // 🔐 Validar token y rol
    if (!token || rol !== '1') {
      alert('Acceso no autorizado: solo administradores pueden registrar historial académico.');
      window.location.href = '/#';
      return;
    }
  
    // ⏳ Validar si el token ha expirado
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000; // en segundos
  
      if (decoded.exp < now) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.clear();
        window.location.href = '/#';
        return;
      }
    } catch (err) {
      console.error('Token inválido:', err);
      alert('Token inválido. Por favor, inicia sesión nuevamente.');
      localStorage.clear();
      window.location.href = '/#';
      return;
    }
  
    // Validación de campos
    if (!this.HistorialAcademico.trim() || this.cursosSeleccionados.length === 0 || !this.EstudianteId) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    const cuerpo = {
      HistorialAcademico: this.HistorialAcademico,
      EstudianteId: this.EstudianteId,
      FechaDeCreacion: new Date().toISOString(),
      ActualizadoEn: new Date().toISOString(),
      CursosHistorico: this.cursosSeleccionados.map(curso => ({
        MateriaId: parseInt(curso.CursoId, 10),
        Nota: parseInt(curso.Nota, 10),
        Estado: curso.Estado,
        FechaRegistro: curso.FechaRegistro,
      }))
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  
    this.http.post('http://localhost/HistoricoAcademico', cuerpo, { headers }).subscribe({
      next: () => {
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Historial académico creado correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
          this.router.navigate(['/HistoricoAcademico']);
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
onEstudianteChange(event: any) {
  console.log('Estudiante seleccionada ID:', event.target.value);
  this.Estudiantes = event.target.value; // Asigna el ID seleccionado a la variable
  }

  public eliminarCurso(index: number) {
    this.CursosSeleccionados.update((CursosSeleccionados) =>
      CursosSeleccionados.filter((_, i) => i !== index)
    );
  }
 
}

