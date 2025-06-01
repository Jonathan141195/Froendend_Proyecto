import { Component, signal,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Docente } from '../modelo/Docente';
import { CommonModule } from '@angular/common';
import {  HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-crear-docente',
  imports: [FormsModule,CommonModule],
  templateUrl: './crear-docente.component.html',
  styleUrl: './crear-docente.component.css'
})
export class CrearDocenteComponent implements OnInit {


//Aqui escribo mi codigo
public Docentes= signal<Docente[]>([]);
public Cedula: string = '';


public Telefono: string = '';
public Email: string = '';
public Direccion: string = '';
public mostrarAlerta: boolean = false;
public mensajeAlerta: string = '';
public alertaTipo: string = 'success'; // 'success' | 'error'

constructor(private http: HttpClient,private router: Router) {
  this.metodoGETDocentes();
};
async ngOnInit(): Promise<void> {
  const valido = await this.validarTokenDesdeBackend();
  if (valido) {
    this.metodoGETDocentes();
  }
}


public async agregarDocente(Docente: string, Cedula: string, Telefono: string, Email: string, Direccion: string) {
  const valido = await this.validarTokenDesdeBackend();
  if (!valido) return;

  if (!Docente.trim() || !Cedula.trim() || !Telefono.trim() || !Email.trim() || !Direccion.trim()) {
    this.alertaTipo = 'error';
    this.mensajeAlerta = 'Todos los campos son obligatorios.';
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 3000);
    return;
  }

  const token = localStorage.getItem('token');
  const cuerpo = { Docente, Cedula, Telefono, Email, Direccion };

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  this.http.post('http://localhost/docente', cuerpo, { headers }).subscribe({
    next: () => {
      this.Docentes.update((Docentes) => [...Docentes, cuerpo]);
      this.alertaTipo = 'success';
      this.mensajeAlerta = 'Docente agregado correctamente.';
      this.mostrarAlerta = true;
      setTimeout(() => {
        this.mostrarAlerta = false;
        this.router.navigate(['/Docentes']);
      }, 2000);
    },
    error: (err) => {
      console.error('Error al agregar docente:', err);
      this.alertaTipo = 'error';
      this.mensajeAlerta = 'Ocurrió un error al agregar el docente.';
      this.mostrarAlerta = true;
      setTimeout(() => this.mostrarAlerta = false, 3000);
    }
  });
}




public metodoGETDocentes() {
  let cuerpo = {};
  this.http.get('http://localhost/docente', cuerpo).subscribe((Docentes) => {
    const arr = Docentes as Docente[];
    arr.forEach((Docente) => {
      this.agregarDocentesALaSenial(Docente.Docente,Docente.DocenteId,Docente.Cedula,Docente.Email,Docente.Telefono,Docente.Direccion,Docente.FechaDeCreacion, Docente.ActualizadoEn);
    });
    console.log(typeof(arr));
  });
};

validarTokenDesdeBackend(): Promise<boolean> {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  if (!token || rol !== '1') {
    alert('Acceso denegado. Solo administradores pueden acceder.');
    window.location.href = '/#';
    return Promise.resolve(false);
  }

  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token
  });

  return new Promise((resolve) => {
    this.http.get('http://localhost/usuario/validarToken', { headers }).subscribe({
      next: () => resolve(true),
      error: () => {
        alert('Sesión expirada o inválida. Por favor, inicia sesión nuevamente.');
        localStorage.clear();
        window.location.href = '/#';
        resolve(false);
      }
    });
  });
}


public agregarDocentesALaSenial(Docente: string, DocenteId?: string, Cedula?: string,Email?:string,Telefono?:string,Direccion?:string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaDocente = {
    DocenteId:DocenteId,
    Docente: Docente,
    Cedula:Cedula,
    Email:Email,
    Telefono:Telefono,
    Direccion:Direccion,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Docentes.update((Docentes) => [...Docentes, nuevaDocente]);
};

public borrarDocente(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/docente/' + Id).subscribe(() => {
    this.Docentes.update((Docentes) => Docentes.filter((Docente) => Docente.DocenteId !== Id));
  });
};

redirigirCrearDocente() {
  window.location.href = '/CrearDocente';
}

}