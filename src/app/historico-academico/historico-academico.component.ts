import { Component, signal } from '@angular/core';
import { HistoricoAcademico } from './../modelo/Historicoacademico';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico-academico',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './historico-academico.component.html',
  styleUrl: './historico-academico.component.css',
})
export class HistoricoAcademicoComponent {
  public HistoricoAcademicos = signal<HistoricoAcademico[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    this.validarTokenPorRol(['1', '2', '3']).then((valido) => {
      if (valido) {
        this.metodoGETHistoricoAcademico();
      }
    });
  }
  
  public HistoricoAcademico: string = '';
  public HistoricoAcademicoId: string = '';
  
  public metodoGETHistoricoAcademico() {
    this.http.get('http://localhost/historicoacademico').subscribe((response) => {
      const arr = response as HistoricoAcademico[];
    
      const nuevosHistoricos = arr.map((HistoricoAcademico) => ({
        HistoricoAcademicoId: HistoricoAcademico.HistoricoAcademicoId ?? '',
        HistoricoAcademico: HistoricoAcademico.HistoricoAcademico ?? '',
        Estudiante: {
          EstudianteId: HistoricoAcademico.Estudiante?.EstudianteId ?? '',
          Estudiante: HistoricoAcademico.Estudiante?.Estudiante ?? '',
        },
        CursosHistorico: HistoricoAcademico.CursosHistorico?.map((ch) => ({
          HistoricoAcademicoId: HistoricoAcademico.HistoricoAcademicoId ?? '',
          CursoId: ch.Curso?.CursoId ?? '',
          Curso: {
            CursoId: ch.Curso?.CursoId ?? '',
            Curso: ch.Curso?.Curso ?? '',
          },
          Nota: ch.Nota ?? '',
          FechaRegistro: ch.FechaRegistro ?? 'N/A',
        })) ?? [],
        FechaDeCreacion: HistoricoAcademico.FechaDeCreacion ?? '',
        ActualizadoEn: HistoricoAcademico.ActualizadoEn ?? '',
      }));
    
      this.HistoricoAcademicos.set(nuevosHistoricos);
    });
  }
    
  
  public async borrarHistoricoAcademico(Id: string | undefined) {
    if (!Id) return;
  
    const valido = await this.validarTokenPorRol(['1']);
    if (!valido) return;
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
  
    this.http.delete(`http://localhost/historicoacademico/${Id}`, { headers }).subscribe(() => {
      this.HistoricoAcademicos.update((HistoricoAcademicos) =>
        HistoricoAcademicos.filter((h) => h.HistoricoAcademicoId !== Id)
      );
      alert('Historial académico eliminado correctamente.');
    }, error => {
      alert('Error al eliminar el historial.');
      console.error(error);
    });
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
  

  redirigirEditarHistoricoAcademico(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/EditarHistoricoAcademico', id]);
    } else {
      console.error('ID no disponible para redirigir');
    }
  }
  

  redirigirCrearHistoricoAcademico() {
    window.location.href = '/CrearHistoricoAcademico';
  }
}

