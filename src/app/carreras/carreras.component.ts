import { Component, signal } from '@angular/core';
import{ Carrera} from './../modelo/Carrera';
import { JsonPipe,CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Distrito } from '../modelo/Distrito';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {  HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-carreras',
  imports: [FormsModule,CommonModule],
  templateUrl: './carreras.component.html',
  styleUrl: './carreras.component.css'
})
export class CarrerasComponent {

  
//Aqui escribo mi codigo
public Carreras= signal<Carrera[]>([]);


public Nombre: string = '';


constructor(private http: HttpClient,private router: Router) {
  this.metodoGETCarrera();
};


public metodoGETCarrera() {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  // Verificación: solo admin (Rol = 1)
  if (!token || rol !== '1') {
    alert('Acceso no autorizado: solo administradores pueden acceder a las carreras.');
    window.location.href = '/#';
    return;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  this.http.get('http://localhost/carrera', { headers }).subscribe((Carreras) => {
    const arr = Carreras as Carrera[];

    arr.forEach((Carrera) => {
      this.agregarCarrerasALaSenial(
        Carrera.CarreraId ?? '',
        Carrera.Carrera ?? '',
        Carrera.CarreraOnSedes?.map((cs) => ({
          SedeId: cs.Sede?.SedeId ?? '',
          Sede: cs.Sede?.Sede ?? '',
          Direccion: cs.Sede?.Direccion ?? ''
        })) ?? [],
        Carrera.FechaDeCreacion ?? '',
        Carrera.ActualizadoEn ?? ''
      );
    });

    console.log(typeof arr);
  });
}


public agregarCarrerasALaSenial(
  CarreraId: string,
  Carrera: string,
  Sedes: { SedeId: string; Sede: string; Direccion: string }[],
  FechaDeCreacion: string,
  ActualizadoEn: string
) {
  let nuevaCarrera: Carrera = {
    CarreraId: CarreraId,
    Carrera: Carrera,
    CarreraOnSedes: Sedes.map(sede => ({
      CarreraId: CarreraId, // Aseguramos que tenga CarreraId
      SedeId: sede.SedeId,
      Sede: {
        SedeId: sede.SedeId,
        Sede: sede.Sede,
        Direccion: sede.Direccion
      }
    })),
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };

  this.Carreras.update((Carreras) => [...Carreras, nuevaCarrera]);
}




public modificarCarrera(Id: any, event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Distrito: tag.value,
  }
  this.http.put('http://localhost/Carrera/' + Id, cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Carreras.update((Carreras) => {
      return Carreras.map((Carrera) => {
        if (Carrera.CarreraId === Id) {
          return {...Carrera, Carrera: tag.value};
        }
        return Carrera;
      });
    });
  });
};
public borrarCarrera(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/carrera/' + Id).subscribe(() => {
    this.Carreras.update((Carreras) => Carreras.filter((Carrera) => Carrera.CarreraId !== Id));
  });
};
  // Método para redirigir a la edición del estudiante
  public redirigirEditarCarrera(id: string): void {
    // Navega a la ruta que tenga el parámetro de id
    this.router.navigate(['/EditarCarrera', id]);
  }
redirigirCrearCarrera() {
  window.location.href = '/CrearCarrera';
}
}