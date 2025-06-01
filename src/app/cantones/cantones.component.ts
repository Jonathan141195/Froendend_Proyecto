import { Component } from '@angular/core';
import {  signal } from '@angular/core';
import{ Canton} from './../modelo/Canton';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cantones',
  imports: [JsonPipe],
  templateUrl: './cantones.component.html',
  styleUrl: './cantones.component.css'
})
export class CantonesComponent {
public Cantones = signal<Canton[]>([]);


constructor(private http: HttpClient) {
  this.metodoGETCantones();
};
public metodoGETCantones() {
  let cuerpo = {};
  this.http.get('http://localhost/cantones', cuerpo).subscribe((Cantones) => {
    const arr = Cantones as Canton[];
    arr.forEach((Canton) => {
      this.agregarCantonALaSenial(Canton.Canton, Canton.CantonId, Canton.FechaDeCreacion, Canton.ActualizadoEn);
    });
    // console.log(typeof(arr));
  });
};

public agregarCanton(event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Canton: tag.value,
  }
  this.http.post('http://localhost/cantones', cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Cantones.update((Cantones) => [...Cantones, cuerpo]);
  });
};
public agregarCantonALaSenial(Canton: string, CantonId?: string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaCanton = {
    CantonId: CantonId,
    Canton: Canton,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Cantones.update((Cantones) => [...Cantones, nuevaCanton]);
};
public modificarCanton(Id: any, event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Canton: tag.value,
  }
  this.http.put('http://localhost/cantones/' + Id, cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Cantones.update((Cantones) => {
      return Cantones.map((Canton) => {
        if (Canton.CantonId === Id) {
          return {...Canton, Canton: tag.value};
        }
        return Canton;
      });
    });
  });
};
public borrarCanton(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/cantones/' + Id).subscribe(() => {
    this.Cantones.update((Cantones) => Cantones.filter((Canton) => Canton.CantonId !== Id));
  });
}
redirigirCrearCanton() {
  window.location.href = '/CrearCanton';
}
}