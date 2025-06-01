import { Component, signal } from '@angular/core';
import { Carrera } from './../modelo/Carrera';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Sede } from './../modelo/Sede';
import {  HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-crear-carrera',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-carrera.component.html',
  styleUrls: ['./crear-carrera.component.css']
})
export class CrearCarreraComponent {
  public Carreras = signal<Carrera[]>([]);
  public Sedes = signal<Sede[]>([]);
  public Carrera: string = '';
  public SedeId: string[] = []; // Arreglo para almacenar los SedeIds seleccionados
  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.metodoGETSedes();
  }

  // Método para obtener las sedes
  public metodoGETSedes() {
    this.http.get('http://localhost/sedes').subscribe((Sedes) => {
      const arr = Sedes as Sede[];
      arr.forEach((Sede) => {
        this.agregarSedesALaSenial(Sede);
      });
    });
  }

  public agregarCarrera(Carrera: string, Sedes: string[]) {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
  
    // Validación: solo administradores (Rol = 1)
    if (!token || rol !== '1') {
      alert('Acceso no autorizado: solo administradores pueden crear carreras.');
      window.location.href = '/#';
      return;
    }
  
    if (!Carrera.trim() || Sedes.length === 0) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    // Construir CarreraOnSedes
    const carreraOnSedes = Sedes.map((SedeId) => {
      const sede = this.Sedes().find((s) => s.SedeId === SedeId);
      return {
        CarreraId: '',
        SedeId: SedeId,
        Sede: {
          Sede: sede?.Sede ?? '',
          Direccion: sede?.Direccion ?? '',
          SedeId: SedeId
        }
      };
    });
  
    const cuerpo = {
      Carrera: Carrera,
      CarreraOnSedes: carreraOnSedes
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  
    this.http.post('http://localhost/carrera', cuerpo, { headers }).subscribe({
      next: () => {
        this.Carreras.update((Carreras) => [...Carreras, cuerpo]);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Carrera creada correctamente.';
        setTimeout(() => {
          this.mostrarAlerta = false;
          this.router.navigate(['/Carreras']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error al crear la carrera:', err);
        this.mostrarAlerta = true;
        this.mensajeAlerta = 'Ocurrió un error al crear la carrera.';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000);
      }
    });
  }
  

  // Método para agregar una sede a la señal
  public agregarSedesALaSenial(Sede: Sede) {
    this.Sedes.update((Sedes) => [...Sedes, Sede]);
  }

  // Método para manejar el cambio de selección de sede
  public onSedeChange(event: any) {
    const sedeId = event.target.value;
    if (this.SedeId.includes(sedeId)) {
      // Si ya está seleccionado, lo eliminamos
      this.SedeId = this.SedeId.filter((id) => id !== sedeId);
    } else {
      // Si no está seleccionado, lo agregamos
      this.SedeId.push(sedeId);
    }
  }
}
