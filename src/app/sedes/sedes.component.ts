import { Component, signal } from '@angular/core';
import{ Sede} from './../modelo/Sede';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sedes',
  imports: [],
  templateUrl: './sedes.component.html',
  styleUrl: './sedes.component.css'
})
export class SedesComponent {


//Aqui escribo mi codigo
public Sedes= signal<Sede[]>([]);


constructor(private http: HttpClient,private router: Router) {
  this.metodoGETSedes();
};
public metodoGETSedes() {
  let cuerpo = {};
  this.http.get('http://localhost/sedes', cuerpo).subscribe((Sedes) => {
    const arr = Sedes as Sede[];
    arr.forEach((Sede) => {
      this.agregarSedesALaSenial(Sede.Sede,Sede.SedeId,Sede.DistritoId,Sede.Email,Sede.Telefono, Sede.FechaDeCreacion, Sede.ActualizadoEn);
    });
    console.log(typeof(arr));
  });
};

public agregarSedes(Sede: string, DistritoId: string) {
  if (!Sede.trim() || !DistritoId.trim()) {
    alert('Debe ingresar ambos valores.');
    return;
  }

  let cuerpo = {
    Sede: Sede,
    DistritoId: parseInt(DistritoId, 10),
  };

  this.http.post('http://localhost/sedes', cuerpo).subscribe(() => {
    this.Sedes.update((Sedes) => [...Sedes, cuerpo]);
  });
}

public agregarSedesALaSenial(Sede: string, SedeId?: string, DistritoId?: number,Email?:string,Telefono?:string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaSede = {
    SedeId: SedeId,
    Sede: Sede,
    DistritoId:DistritoId,
    Email:Email,
    Telefono:Telefono,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Sedes.update((Sedes) => [...Sedes, nuevaSede]);
};
public modificarSede(Id: any, event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Distrito: tag.value,
  }
  this.http.put('http://localhost/sedes/' + Id, cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Sedes.update((Sedes) => {
      return Sedes.map((Sede) => {
        if (Sede.SedeId === Id) {
          return {...Sede, Sede: tag.value};
        }
        return Sede;
      });
    });
  });
};
public borrarSede(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/sedes/' + Id).subscribe(() => {
    this.Sedes.update((Sedes) => Sedes.filter((Sede) => Sede.SedeId !== Id));
  });
};
public redirigirEditarSede(id: string): void {
  // Navega a la ruta que tenga el parámetro de id
  this.router.navigate(['/EditarSede', id]);
}
redirigirCrearSede() {
  window.location.href = '/CrearSede';
}
}

