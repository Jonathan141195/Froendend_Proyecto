import { Component, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Docente } from '../modelo/Docente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docentes',
  imports: [],
  templateUrl: './docentes.component.html',
  styleUrl: './docentes.component.css'
})
export class DocentesComponent {



//Aqui escribo mi codigo
public Docentes= signal<Docente[]>([]);


constructor(private http: HttpClient, private router: Router) {
  this.validarTokenPorRol(['1']).then((valido) => {
    if (valido) {
      this.metodoGETDocentes();
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
public modificarDocente(Id: any, event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Docente: tag.value,
  }
  this.http.put('http://localhost/docente/' + Id, cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Docentes.update((Docentes) => {
      return Docentes.map((Docente) => {
        if (Docente.DocenteId === Id) {
          return {...Docente, Docente: tag.value};
        }
        return Docente;
      });
    });
  });
};
public borrarDocente(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/docente/' + Id).subscribe(() => {
    this.Docentes.update((Docentes) => Docentes.filter((Docente) => Docente.DocenteId !== Id));
  });
};

  // Método para redirigir a la edición del estudiante
  public redirigirEditarDocente(id: string): void {
    // Navega a la ruta que tenga el parámetro de id
    this.router.navigate(['/EditarDocente', id]);
  }

redirigirCrearDocente() {
  window.location.href = '/CrearDocente';
}
}
