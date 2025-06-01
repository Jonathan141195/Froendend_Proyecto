import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Materia } from '../modelo/Materia';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-materias',
  imports: [],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css'
})
export class MateriasComponent {


//Aqui escribo mi codigo
public Materias= signal<Materia[]>([]);

constructor(private http: HttpClient, private router: Router) {
  this.validarTokenPorRol(['1', '2', '3']).then((valido) => {
    if (valido) {
      this.metodoGETMaterias();
    }
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

public metodoGETMaterias() {
  this.http.get('http://localhost/materia').subscribe((Materias) => {
    const arr = Materias as Materia[];

    arr.forEach((Materia) => {
      this.agregarMateriasALaSenial(
        Materia.MateriaId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
        Materia.Materia ?? '',  // Si es undefined, asignamos un valor vacío por defecto
        Materia.Creditos ??=0,
        Materia.FechaDeCreacion ?? '',  // Si es undefined, asignamos un valor vacío por defecto
        Materia.ActualizadoEn ?? ''  // Si es undefined, asignamos un valor vacío por defecto
      );
    });

    console.log(typeof arr);
  });
}

public agregarMateriasALaSenial(
  MateriaId: string,
  Materia: string,
  Creditos: number,
  FechaDeCreacion: string,
  ActualizadoEn: string
) {
  let nuevaMateria: Materia = {
    MateriaId: MateriaId,
    Materia: Materia,
    Creditos: Creditos,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };

  this.Materias.update((Materias) => [...Materias, nuevaMateria]);
}
public async modificarMateria(Id: any, event: Event) {
  const valido = await this.validarTokenPorRol(['1']);
  if (!valido) return;

  const tag = event.target as HTMLInputElement;
  const cuerpo = { Materia: tag.value };
  const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };

  this.http.put('http://localhost/materia/' + Id, cuerpo, { headers }).subscribe(() => {
    this.Materias.update((Materias) =>
      Materias.map((Materia) => Materia.MateriaId === Id ? { ...Materia, Materia: tag.value } : Materia)
    );
    alert('Materia actualizada correctamente.');
  });
}

public async borrarMateria(Id: any) {
  const valido = await this.validarTokenPorRol(['1']);
  if (!valido) return;

  const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };

  this.http.delete('http://localhost/materia/' + Id, { headers }).subscribe(() => {
    this.Materias.update((Materias) => Materias.filter((Materia) => Materia.MateriaId !== Id));
    alert('Materia eliminada correctamente.');
  });
}


redirigirCrearMateria() {
  window.location.href = '/CrearMateria';
}

//Método para redirigir a la edición del estudiante
  public redirigirEditarMateria(id: string): void {
    // Navega a la ruta que tenga el parámetro de id
    this.router.navigate(['/EditarMateria', id]);
  }
}

