
import { Component, signal } from '@angular/core';
import { OfertaAcademica } from './../modelo/OfertaAcademica';
import {  CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oferta-academica',
  imports: [ CommonModule ,FormsModule ],
  templateUrl: './oferta-academica.component.html',
  styleUrl: './oferta-academica.component.css'
})
export class OfertaAcademicaComponent {


  public OfertaAcademicas = signal<OfertaAcademica[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    this.metodoGETOfertaAcademica();
  }
  public OfertaAcademica: string = '';
  public OfertaAcademicaId: string = '';

  public metodoGETOfertaAcademica() {
    this.http.get('http://localhost/OfertaAcademica').subscribe((response) => {
      const arr = response as OfertaAcademica[];
    
      const nuevosOfertasAcademicas = arr.map((OfertaAcademica) => ({
        OfertaAcademicaId: OfertaAcademica.OfertaAcademicaId ?? '',
        OfertaAcademica: OfertaAcademica.OfertaAcademica ?? '',
        Periodo: OfertaAcademica.Periodo ?? undefined,
        Anno:OfertaAcademica.Anno?? '',
        CarreraId:OfertaAcademica.CarreraId?? '',
        Carrera: {
          CarreraId: OfertaAcademica.Carrera?.CarreraId ?? '',
          Carrera: OfertaAcademica.Carrera?.Carrera ?? '',
        },
        CursosOfertaAcademica: OfertaAcademica.CursosOfertaAcademica?.map((ch) => ({
          OfertaAcademicaId: OfertaAcademica.OfertaAcademicaId ?? '',
          OfertaAcademica:OfertaAcademica.OfertaAcademica,
          CursoId: ch.Curso?.CursoId ?? '',
          Curso: {
            CursoId: ch.Curso?.CursoId ?? '',
            Curso: ch.Curso?.Curso ?? '',
          },
          FechaRegistro: ch.FechaRegistro ?? 'N/A',
        })) ?? [],
        FechaDeCreacion: OfertaAcademica.FechaDeCreacion ?? '',
        ActualizadoEn: OfertaAcademica.ActualizadoEn ?? '',
      }));
    
      this.OfertaAcademicas.set(nuevosOfertasAcademicas);
    });
  }
    

  public borrarOfertaAcademica(Id: string | undefined) {
    if (!Id) {
      console.error('Error: El ID es undefined');
      return;
    }

      this.http.delete(`http://localhost/OfertaAcademica/${Id}`).subscribe({
        next: () => {
          this.OfertaAcademicas.update((OfertaAcademicas) =>
            OfertaAcademicas.filter((h) => h.OfertaAcademicaId !== Id)
          );
        },
        error: (error) => console.error('Error al borrar:', error),
      });
    }

  redirigirEditarOfertaAcademica(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/EditarOfertaAcademica', id]);
    } else {
      console.error('ID no disponible para redirigir');
    }
  }
  

  redirigirCrearOfertaAcademica() {
    window.location.href = '/CrearOfertaAcademica';
  }
}


