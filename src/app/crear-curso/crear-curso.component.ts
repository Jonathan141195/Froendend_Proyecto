import { EstadoCurso } from '../modelo/EstadoCurso';
import { Component, signal,OnInit } from '@angular/core';
import { Curso } from './../modelo/Curso';

import { HttpClient } from '@angular/common/http';
import { Docente } from '../modelo/Docente';
import { Sede } from '../modelo/Sede';
import { Materia } from '../modelo/Materia';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import {  HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-crear-curso',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.css']
})
export class CrearCursoComponent implements OnInit {

  public Cursos = signal<Curso[]>([]);
  public Sedes = signal<Sede[]>([]);
  public Docentes = signal<Docente[]>([]);
  public Materias = signal<Materia[]>([]);
  public SedeId: number = 0;
  public MateriaId: number = 0;
  public DocenteId: number = 0;
  public CupoDisponible: number = 0;
  public CupoMaximo: number = 0;
  public HoraInicial: string = '';
  public HoraFinal: string = '';
  public Curso: string = '';
  public FechaInicio: string = '';
  public FechaFin: string = '';

  public Estados = Object.values(EstadoCurso);
  public Estado: EstadoCurso = EstadoCurso.Activo;
  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
public alertaTipo: string = 'success'; // 'success' | 'error'

  constructor(private http: HttpClient,private router: Router) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
  
    if (!token || rol !== '1') {
      alert('Acceso no autorizado: solo administradores pueden acceder a esta sección.');
      window.location.href = '/#';
      return;
    }
  
    this.cargarDatos();
  }
  

  private cargarDatos() {
    this.metodoGETDocentes();
    this.metodoGETSedes();
    this.metodoGETMaterias();
  }

  private metodoGETSedes() {
    this.http.get<Sede[]>('http://localhost/sedes').subscribe(
      (Sedes) => this.Sedes.set(Sedes),
     
    );
  }

  private metodoGETMaterias() {
    this.http.get<Materia[]>('http://localhost/materia').subscribe(
      (Materias) => this.Materias.set(Materias),
     
    );
  }

  private metodoGETDocentes() {
    this.http.get<Docente[]>('http://localhost/docente').subscribe(
      (Docentes) => this.Docentes.set(Docentes),
      
    );
  }

  public agregarCurso(
    Curso: string,
    FechaInicio: string,
    CupoDisponible: string,
    FechaFin: string,
    HoraInicial: string,
    HoraFinal: string,
    CupoMaximo: string,
    Estado: string,
    SedeId: string,
    MateriaId: string,
    DocenteId: string
  ) {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
  
    // Validación: solo administradores pueden agregar cursos
    if (!token || rol !== '1') {
      alert('Acceso no autorizado: solo administradores pueden crear cursos.');
      window.location.href = '/#';
      return;
    }
  
    if (!Curso.trim()) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    const cuerpo = {
      Curso: Curso,
      Materia: {
        Materia: 'Nombre de la Materia', // opcional si tu backend lo requiere
        MateriaId: MateriaId
      },
      Sede: {
        Sede: 'Nombre de la Sede', // opcional si tu backend lo requiere
        SedeId: SedeId
      },
      Docente: {
        Docente: 'Nombre del Docente', // opcional si tu backend lo requiere
        DocenteId: DocenteId
      },
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
      HoraInicial: HoraInicial,
      HoraFinal: HoraFinal,
      CupoMaximo: CupoMaximo,
      CupoDisponible: CupoDisponible,
      Estado: Estado
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  
    this.http.post('http://localhost/cursos', cuerpo, { headers }).subscribe({
      next: () => {
        this.Cursos.update((Cursos) => [...Cursos, cuerpo]);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Curso creado correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
          this.router.navigate(['/Cursos']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error al crear el curso:', err);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Ocurrió un error al crear el curso.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000);
      }
    });
  }
  
  
// Método que maneja el cambio de selección
onSedesChange(event: any) {
  console.log('Sede seleccionada ID:', event.target.value);
  this.Sedes = event.target.value; // Asigna el ID seleccionado a la variable
  }

onDocenteChange(event: any) {
  console.log('Docente seleccionada ID:', event.target.value);
  this.Docentes = event.target.value; // Asigna el ID seleccionado a la variable
  }
onMateriaChange(event: any) {
  console.log('Materia seleccionada ID:', event.target.value);
  this.Materias = event.target.value; // Asigna el ID seleccionado a la variable
  }

  private limpiarFormulario() {
    this.Curso = '';
    this.HoraInicial = '';
    this.HoraFinal = '';
    this.CupoMaximo = 0;
    this.CupoDisponible = 0;
    this.MateriaId = 0;
    this.DocenteId = 0;
    this.SedeId = 0;
    this.Estado = EstadoCurso.Activo;
  }

  public redirigirCrearCurso() {
    window.location.href = '/CrearCurso';
  }
}
