import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Estudiante } from '../modelo/Estudiante';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-estudiante',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './editar-estudiante.component.html',
  styleUrls: ['./editar-estudiante.component.css']
})
export class EditarEstudianteComponent {

  public estudianteId: string | null;
  public Estudiante: Estudiante = {
    EstudianteId: '',
    Estudiante: '',
    Telefono: '',
    Cedula: '',
    Email: '',
    Direccion: '',
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
    this.estudianteId = this.route.snapshot.paramMap.get('id');
    if (this.estudianteId) {
      this.cargarDatosEstudiante(this.estudianteId);
    }
  }

  cargarDatosEstudiante(id: string): void {
    this.http.get<any[]>(`http://localhost/estudiante/${id}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          this.Estudiante = {
            EstudianteId: datos.EstudianteId ?? '',
            Estudiante: datos.Estudiante ?? '',
            Telefono: datos.Telefono ?? '',
            Cedula: datos.Cedula ?? '',
            Email: datos.Email ?? '',
            Direccion: datos.Direccion ?? '',
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
  public modificarEstudiante(Id: string | undefined, event: Event): void {
    const tag = event.target as HTMLInputElement;
    
    // Crea un objeto con todos los campos del estudiante
    const cuerpo = {
      EstudianteId: this.Estudiante.EstudianteId,
      Estudiante: this.Estudiante.Estudiante,
      Telefono: this.Estudiante.Telefono,
      Cedula: this.Estudiante.Cedula,
      Email: this.Estudiante.Email,
      Direccion: this.Estudiante.Direccion,
      FechaDeCreacion: this.Estudiante.FechaDeCreacion,
      ActualizadoEn: this.Estudiante.ActualizadoEn
    };
  
    // Realiza la petición PUT
    this.http.put(`http://localhost/estudiante/${Id}`, cuerpo).subscribe({
      next: () => {
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Estudiante modificado correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000); // Desaparece la alerta después de 3 segundos
        this.router.navigate(['/Estudiantes']);
      },
      error: (err) => {
        console.error('Error al modificar el estudiante:', err);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Ocurrió un error al modificar el estudiante.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000); // Desaparece la alerta después de 3 segundos
      }
    });
  }
  
}
