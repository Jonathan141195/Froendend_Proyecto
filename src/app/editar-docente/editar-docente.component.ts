import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Docente } from '../modelo/Docente';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-docente',
  imports: [FormsModule,CommonModule],
  templateUrl: './editar-docente.component.html',
  styleUrl: './editar-docente.component.css'
})
export class EditarDocenteComponent {


  public docenteId: string | null;
  public Docente: Docente = {
    DocenteId: '',
    Docente: '',
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
    this.docenteId = this.route.snapshot.paramMap.get('id');
    if (this.docenteId) {
      this.cargarDatosDocente(this.docenteId);
    }
  }

  cargarDatosDocente(id: string): void {
    this.http.get<any[]>(`http://localhost/docente/${id}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          this.Docente = {
            DocenteId: datos.DocenteId ?? '',
            Docente: datos.Docente ?? '',
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
  public modificarDocente(Id: string | undefined, event: Event): void {
    const tag = event.target as HTMLInputElement;
    
    // Crea un objeto con todos los campos del estudiante
    const cuerpo = {
      DocenteId: this.Docente.DocenteId,
      Docente: this.Docente.Docente,
      Telefono: this.Docente.Telefono,
      Cedula: this.Docente.Cedula,
      Email: this.Docente.Email,
      Direccion: this.Docente.Direccion,
      FechaDeCreacion: this.Docente.FechaDeCreacion,
      ActualizadoEn: this.Docente.ActualizadoEn
    };
  
    // Realiza la petición PUT
    this.http.put(`http://localhost/docente/${Id}`, cuerpo).subscribe({
      next: () => {
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Docente modificado correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 10000); // Desaparece la alerta después de 3 segundos
        this.router.navigate(['/Docentes']);
      },
      error: (err) => {
        console.error('Error al modificar el docente', err);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Ocurrió un error al modificar el docente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000); // Desaparece la alerta después de 3 segundos
      }
    });
  }
  
}

