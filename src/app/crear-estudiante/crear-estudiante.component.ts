import { Component, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Estudiante } from '../modelo/Estudiante';
import {  HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-crear-estudiante',
  imports: [FormsModule],
  templateUrl: './crear-estudiante.component.html',
  styleUrl: './crear-estudiante.component.css'
})
export class CrearEstudianteComponent implements OnInit{


//Aqui escribo mi codigo
public Estudiantes= signal<Estudiante[]>([]);
public Cedula: string = '';


public Telefono: string = '';
public Email: string = '';
public Direccion: string = '';

constructor(private http: HttpClient,private router: Router) {
  this.metodoGETEstudiantes();
};
async ngOnInit(): Promise<void> {
  const rol = localStorage.getItem('Rol');

  if (rol !== '1') {
    alert('Solo administradores pueden acceder.');
    window.location.href = '/#';
    return;
  }

  const tokenValido = await this.validarToken();
  if (tokenValido) {
    this.metodoGETEstudiantes();
  }
}


public metodoGETEstudiantes() {
  let cuerpo = {};
  this.http.get('http://localhost/estudiante', cuerpo).subscribe((Estudiantes) => {
    const arr = Estudiantes as Estudiante[];
    arr.forEach((Estudiante) => {
      this.agregarEstudiantesALaSenial(Estudiante.Estudiante,Estudiante.EstudianteId,Estudiante.Cedula,Estudiante.Email,Estudiante.Telefono,Estudiante.Direccion,Estudiante.FechaDeCreacion, Estudiante.ActualizadoEn);
    });
    console.log(typeof(arr));
  });
};

public async agregarEstudiante(Estudiante: string, Cedula: string, Telefono: string, Email: string, Direccion: string) {
  const rol = localStorage.getItem('Rol');
  if (rol !== '1') {
    alert('Solo administradores pueden agregar estudiantes.');
    window.location.href = '/#';
    return;
  }

  const tokenValido = await this.validarToken();
  if (!tokenValido) return;

  if (!Estudiante.trim() || !Cedula.trim() || !Telefono.trim() || !Email.trim() || !Direccion.trim()) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  const token = localStorage.getItem('token');
  const cuerpo = { Estudiante, Cedula, Telefono, Email, Direccion };

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  this.http.post('http://localhost/estudiante', cuerpo, { headers }).subscribe({
    next: () => {
      this.Estudiantes.update((Estudiantes) => [...Estudiantes, cuerpo]);
      alert('Estudiante agregado correctamente.');
      this.router.navigate(['/Estudiantes']);
    },
    error: (err) => {
      alert('Hubo un problema al agregar el estudiante.');
      console.error(err);
    }
  });
}


public agregarEstudiantesALaSenial(Estudiante: string, EstudianteId?: string, Cedula?: string,Email?:string,Telefono?:string,Direccion?:string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaEstudiante = {
    EstudianteId:EstudianteId,
    Estudiante: Estudiante,
    Cedula:Cedula,
    Email:Email,
    Telefono:Telefono,
    Direccion:Direccion,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Estudiantes.update((Estudiantes) => [...Estudiantes, nuevaEstudiante]);
};

validarToken(): Promise<boolean> {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Token no encontrado. Inicia sesión.');
    window.location.href = '/#';
    return Promise.resolve(false);
  }

  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token
  });

  return new Promise((resolve) => {
    this.http.get('http://localhost/usuario/validarToken', { headers }).subscribe({
      next: () => resolve(true), // token válido
      error: () => {
        alert('Sesión expirada o no válida. Por favor, inicia sesión.');
        localStorage.clear();
        window.location.href = '/#';
        resolve(false);
      }
    });
  });
}

public borrarEstudiante(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/estudiante/' + Id).subscribe(() => {
    this.Estudiantes.update((Estudiantes) => Estudiantes.filter((Estudiante) => Estudiante.EstudianteId !== Id));
  });
};

redirigirCrearEstudiante() {
  window.location.href = '/CrearEstudiante';
}


}