
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Materia } from '../modelo/Materia';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-editar-materia',
  imports: [FormsModule,CommonModule],
  templateUrl: './editar-materia.component.html',
  styleUrl: './editar-materia.component.css'
})
export class EditarMateriaComponent {


  public materiaId: string | null;
  public Materia: Materia = {
    MateriaId: '',
    Materia: '',
    Creditos: 0,
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };

  // Propiedades para manejar la alerta
  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.materiaId = this.route.snapshot.paramMap.get('id');
    if (this.materiaId) {
      this.cargarDatosMateria(this.materiaId);
    }
  }

  cargarDatosMateria(id: string): void {
    this.http.get<any[]>(`http://localhost/materia/${id}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          this.Materia = {
            MateriaId: datos.MateriaId ?? '',
            Materia: datos.Materia ?? '',
            Creditos: datos.Creditos ??=0,
            FechaDeCreacion: datos.FechaDeCreacion ?? '',
            ActualizadoEn: datos.ActualizadoEn ?? ''
          };
        } else {
          console.warn('No se encontraron datos para el ID proporcionado.');
        }
      },
      error: (err) => {
        console.error('Error al cargar datos del estudiante:', err);
      }
    });
  }

  // Función para modificar el estudiante
  public modificarMateria(Id: string | undefined, event: Event): void {
    const tag = event.target as HTMLInputElement;
    // Parsear Creditos a entero antes de enviarlo
  const creditosParseados = parseInt(this.Materia.Creditos as any, 10) || 0;
    // Crea un objeto con todos los campos del estudiante
    const cuerpo = {
      MateriaId: this.Materia.MateriaId,
      tMateria: this.Materia.Materia,
      Creditos: creditosParseados,
      FechaDeCreacion: this.Materia.FechaDeCreacion,
      ActualizadoEn: this.Materia.ActualizadoEn
    };
  
    // Realiza la petición PUT
    this.http.put(`http://localhost/materia/${Id}`, cuerpo).subscribe({
      next: () => {
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Materia modificado correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000); // Desaparece la alerta después de 3 segundos
        this.router.navigate(['/Materias']);
      },
      error: (err) => {
        console.error('Error al modificar la Materia:', err);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Ocurrió un error al modificar la Materia.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 10000); // Desaparece la alerta después de 3 segundos
      }
    });
  }
  
}
