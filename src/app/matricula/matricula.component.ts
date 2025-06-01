import { Component, signal } from '@angular/core';
import { EstadoMatricula, Matricula} from './../modelo/Matricula';
import {  CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-matricula',
  imports: [ CommonModule ,FormsModule ],
  templateUrl: './matricula.component.html',
  styleUrl: './matricula.component.css'
})
export class MatriculaComponent {



  public Matriculas = signal<Matricula[]>([]);
  constructor(private http: HttpClient, private router: Router) {
    this.validarTokenPorRol(['1'])  // Admin y Docente
      .then((valido) => {
        if (valido) {
          this.metodoGETOfertaAcademica();
        }
      });
  }
  
  
  public Matricula: string = '';
  public MatriculaId: string = '';
  trackByIndex(index: number): number {
    return index;
  }
  public metodoGETOfertaAcademica() {
    this.http.get('http://localhost/Matricula').subscribe((response) => {
      const arr = response as Matricula[];
    
      const nuevosMatriculas = arr.map((Matricula) => ({
        MatriculaId:Matricula.MatriculaId ?? '',
        Matricula:Matricula.Matricula ?? '',
        FechaDeMatricula: Matricula.FechaDeMatricula ?? '',
        EstadoMatricula:Matricula.EstadoMatricula?? '',
        CostoPorCredito:Matricula.CostoPorCredito ?? '',
        CostoMatricula:Matricula.CostoMatricula ?? '',
        CostoPoliza:Matricula.CostoPoliza?? '',
        TotalMatricula:Matricula.TotalMatricula?? '',

        EstudianteId:Matricula.EstudianteId?? '',
        Estudiante: {
          EstudianteId: Matricula.Estudiante?.EstudianteId ?? '',
          Estudiante: Matricula.Estudiante?.Estudiante ?? '',
        },
        CursosMatriculados: Matricula.CursosMatriculados?.map((cm) => ({
          MatriculaId: Matricula.MatriculaId ?? '',
          Matricula:Matricula.Matricula,
          CursoId: cm.Curso?.CursoId ?? '',
          Curso: {
            CursoId: cm.Curso?.CursoId ?? '',
            Curso: cm.Curso?.Curso ?? '',
          },
          FechaIncripcion: cm.FechaInscripcion ?? '',
        })) ?? [],
        FechaDeCreacion: Matricula.FechaDeCreacion ?? '',
        ActualizadoEn: Matricula.ActualizadoEn ?? '',
      }));
    
      this.Matriculas.set(nuevosMatriculas);
    });
  }
    
  public async borrarMatricula(Id: string | undefined) {
    if (!Id) {
      console.error('Error: El ID es undefined');
      return;
    }
  
    const valido = await this.validarTokenPorRol(['1']);
    if (!valido) return;
  
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });
  
    this.http.delete(`http://localhost/Matricula/${Id}`, { headers }).subscribe({
      next: () => {
        this.Matriculas.update((Matriculas) =>
          Matriculas.filter((M) => M.MatriculaId !== Id)
        );
        alert('Matrícula eliminada correctamente.');
      },
      error: (error) => {
        alert('Error al eliminar la matrícula.');
        console.error('Error al borrar:', error);
      },
    });
  }
  
  

    public puedePagar(estado: string): boolean {
      return estado?.toLowerCase() === 'pendiente';
    }
    private validarTokenPorRol(rolesPermitidos: string[]): Promise<boolean> {
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('Rol');
    
      if (!token || !rolesPermitidos.includes(rol || '')) {
        alert('Acceso denegado. No tenés permisos para ver esta sección.');
        window.location.href = '/#';
        return Promise.resolve(false);
      }
    
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token
      });
    
      return new Promise((resolve) => {
        this.http.get('http://localhost/usuario/validarToken', { headers }).subscribe({
          next: (response: any) => {
            if (response?.name === 'JsonWebTokenError' || response?.name === 'TokenExpiredError') {
              alert('Sesión inválida o expirada. Por favor, iniciá sesión nuevamente.');
              localStorage.clear();
              window.location.href = '/#';
              resolve(false);
            } else {
              resolve(true);
            }
          },
          error: (err) => {
            alert('Error de conexión al validar token.');
            console.error(err);
            resolve(false);
          }
        });
      });
    }
    
  redirigirMatricula(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/EditarMatricula', id]);
    } else {
      console.error('ID no disponible para redirigir');
    }

  }

  redirigirMatriculaPagar(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/CrearPago', id]);
    } else {
      console.error('ID no disponible para redirigir');
    }
    
  }
  

  redirigirCrearMatricula() {
    window.location.href = '/CrearMatricula';
  }
}