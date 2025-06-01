import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { Estudiante } from '../modelo/Estudiante';
import { Carrera } from '../modelo/Carrera';
import { Curso } from '../modelo/Curso';
import { Pago } from '../modelo/Pago';
import { Matricula, EstadoMatricula } from '../modelo/Matricula';
import { Periodo } from './../modelo/OfertaAcademica';

@Component({
  selector: 'app-editar-matricula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-matricula.component.html',
  styleUrl: './editar-matricula.component.css'
})
export class EditarMatriculaComponent {
  public matriculaId: string | null;
  public Matricula: Matricula = {
    EstudianteId: '',
    MatriculaId: '',
    Matricula: '',
    CursosMatriculados: [],
    FechaDeMatricula: '',
    EstadoMatricula: '',
    CostoPorCredito: '',
    CostoMatricula: '',
    CostoPoliza: '',
    TotalMatricula: '',
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };

  public Estudiantes = signal<Estudiante[]>([]);
  public Cursos = signal<Curso[]>([]);
  public listaCursos: Curso[] = [];
  public carreras: Carrera[] = [];
  public anios: number[] = [];
  public periodo: Periodo = Periodo.I_CUATRIMESTRE;
  public periodos: Periodo[] = [Periodo.I_CUATRIMESTRE, Periodo.II_CUATRIMESTRE, Periodo.III_CUATRIMESTRE];
  public anioSeleccionado: number = new Date().getFullYear();
  public permitirSeleccion = false;
  public TotalMatricula: number = 0;

  public CostoPorCredito: number = 15000;
  public CostoMatricula: number = 30000;
  public CostoPoliza: number = 16000;
  public totalCreditosSeleccionados: number = 0; // <- puedes agregar esta nueva
  public modoCargaInicial = false;
  public CarreraId: string = '';
  public cursosSeleccionados: string[] = [];

  public mensajeAlerta = '';
  public mostrarAlerta = false;
  public tipoAlerta: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.matriculaId = this.route.snapshot.paramMap.get('id');
    if (this.matriculaId) {
      this.cargarDatosMatricula(this.matriculaId);
      this.inicializarAnios();
    }
  }

  ngOnInit() {
    this.cargarEstudiantes();
  }

  inicializarAnios(): void {
    this.anios = [];
    for (let anio = 2024; anio <= 2030; anio++) {
      this.anios.push(anio);
    }
  }

  cargarEstudiantes(): void {
    this.http.get<Estudiante[]>('http://localhost/estudiante').subscribe(data => {
      this.Estudiantes.update(() => data);
    });
  }

  onEstudianteSeleccionado(event: Event) {
    const estudianteId = (event.target as HTMLSelectElement).value;
    this.obtenerCarrerasPorEstudiante(estudianteId);
    this.CarreraId = '';
    setTimeout(() => {
      if (this.carreras.length > 0) this.CarreraId = this.carreras[0].CarreraId ?? '';
    }, 500);
    this.cdr.detectChanges();
  }

  obtenerCarrerasPorEstudiante(id: string) {
    this.http.get<Carrera[]>(`http://localhost/estudiante/${id}/carreras`).subscribe(data => {
      this.carreras = data;
    });
  }

  cargarDatosMatricula(id: string): void {
    this.http.get<any[]>(`http://localhost/matricula/${id}`).subscribe(data => {
      const datos = data[0];
      if (datos) {
        this.Matricula = {
          MatriculaId: datos.MatriculaId ?? '',
          Matricula: datos.Matricula ?? '',
          EstudianteId: datos.EstudianteId ?? '',
          FechaDeMatricula: datos.FechaDeMatricula ?? '',
          EstadoMatricula: datos.EstadoMatricula ?? '',
          CostoPorCredito: datos.CostoPorCredito ?? '',
          CostoMatricula: datos.CostoMatricula ?? '',
          CostoPoliza: datos.CostoPoliza ?? '',
          TotalMatricula: datos.TotalMatricula ?? '',
          FechaDeCreacion: datos.FechaDeCreacion ?? '',
          ActualizadoEn: datos.ActualizadoEn ?? '',
          CursosMatriculados: (datos.CursosMatriculados ?? []).map((item: any) => {
            this.cursosSeleccionados.push(item.CursoId);
            return {
              MatriculaId: item.MatriculaId ?? '',
              CursoId: item.CursoId ?? '',
              FechaInscripcion: item.FechaInscripcion ?? '',
              Curso: {
                Curso: item.Curso?.Curso ?? '',
                CursoId: item.Curso?.CursoId ?? ''
              },
              Materia: item.Curso?.Materia ?? {} 
            };
          })
          
           
        };
        this.modoCargaInicial = true;
        this.calcularCostoTotal();
      }
    });
  }

  habilitarSeleccion(): void {
    this.permitirSeleccion = true;
    this.anioSeleccionado = new Date().getFullYear();
    this.periodo = this.periodos[0];
    this.Matricula.CursosMatriculados = [];
    this.modoCargaInicial = false; 
  }
  

  obtenerCursosPorOferta() {
    const params = new HttpParams()
      .set('carreraId', this.CarreraId)
      .set('periodo', this.periodo)
      .set('anno', this.anioSeleccionado.toString());

    this.http.get<Curso[]>('http://localhost/matricula/cursos-oferta', { params })
      .subscribe(cursos => {
        this.listaCursos = cursos;
        this.actualizarCursosMatriculados(); // 🔁 Reaplicar selección
      });
  }

  actualizarCursosMatriculados(): void {
    this.Matricula.CursosMatriculados = this.listaCursos
      .filter(curso => this.cursosSeleccionados.includes(curso.CursoId ?? ''))
      .map(curso => ({
        MatriculaId: this.Matricula.MatriculaId, // ✅ Se agrega para cumplir con la interfaz
        CursoId: curso.CursoId ?? '',            // ✅ Valor seguro (no undefined)
        Curso: curso,
        FechaInscripcion: new Date().toISOString()
      }));
    this.calcularCostoTotal();
  }
  

  toggleSeleccionCurso(cursoId: string): void {
    const index = this.cursosSeleccionados.indexOf(cursoId);
    if (index > -1) {
      this.cursosSeleccionados.splice(index, 1);
    } else {
      this.cursosSeleccionados.push(cursoId);
    }
    this.actualizarCursosMatriculados(); // 🔁 Sincroniza visual y cálculo
  }

  esCursoSeleccionado(cursoId: string): boolean {
    return this.cursosSeleccionados.includes(cursoId);
  }

  eliminarCursoMatriculado(cursoId: string): void {
    this.cursosSeleccionados = this.cursosSeleccionados.filter(id => id !== cursoId);
    this.Matricula.CursosMatriculados = this.Matricula.CursosMatriculados.filter(c => c.CursoId !== cursoId);
    this.alerta('Curso eliminado de la matrícula.', 'error');
    this.calcularCostoTotal();
  }

  public calcularCostoTotal(): void {
    let totalCreditos = 0;
  
    if (this.modoCargaInicial) {
      this.Matricula.CursosMatriculados.forEach(curso => {
        const creditos = curso.Materia?.Creditos;
        if (creditos) totalCreditos += Number(creditos);
      });
    } else {
      this.cursosSeleccionados.forEach(cursoId => {
        const cursoInfo = this.listaCursos.find(c => c.CursoId === cursoId);
        if (cursoInfo?.Materia?.Creditos) {
          totalCreditos += Number(cursoInfo.Materia.Creditos);
        }
      });
    }
  
    this.totalCreditosSeleccionados = totalCreditos;
  
    const costoCreditos = totalCreditos * Number(this.Matricula.CostoPorCredito);
    this.Matricula.TotalMatricula = (
      costoCreditos +
      Number(this.Matricula.CostoMatricula) +
      Number(this.Matricula.CostoPoliza)
    ).toString();
  
    // Forzar la detección de cambios para actualizar la vista
    this.cdr.detectChanges();
  }
  
  
  

  modificarMatricula(id: string | undefined, event: Event): void {
    event.preventDefault();
    if (!this.Matricula.Matricula || this.Matricula.CursosMatriculados.length === 0) {
      this.alerta('Debe completar todos los campos obligatorios.', 'error');
      return;
    }
  
    const fechaActual = new Date().toISOString();
  
    const matriculaActualizada = {
      ...this.Matricula,
      FechaDeMatricula: fechaActual,
      CostoPorCredito: Number(this.Matricula.CostoPorCredito),
      CostoMatricula: Number(this.Matricula.CostoMatricula),
      CostoPoliza: Number(this.Matricula.CostoPoliza),
      TotalMatricula: Number(this.Matricula.TotalMatricula),
      CursosMatriculados: this.Matricula.CursosMatriculados.map(curso => ({
        CursoId: Number(curso.CursoId),
        FechaInscripcion: fechaActual
      }))
    };
  
    this.http.put(`http://localhost/matricula/${id}`, matriculaActualizada).subscribe({
      next: () => {
        this.alerta('Matrícula modificada correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/Matricula']), 2000);
      },
      error: () => {
        this.alerta('Error al modificar la matrícula.', 'error');
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
