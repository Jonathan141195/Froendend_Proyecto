import { Component, signal } from '@angular/core';
import{ Distrito} from './../modelo/Distrito';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-distritos',
  imports: [JsonPipe],
  templateUrl: './distritos.component.html',
  styleUrl: './distritos.component.css'
})
export class DistritosComponent {
//Aqui escribo mi codigo
public Distritos = signal<Distrito[]>([]);


constructor(private http: HttpClient) {
  this.metodoGETDistritos();
};
public metodoGETDistritos() {
  let cuerpo = {};
  this.http.get('http://localhost/distritos', cuerpo).subscribe((Distritos) => {
    const arr = Distritos as Distrito[];
    arr.forEach((Distrito) => {
      this.agregarDistritosALaSenial(Distrito.Distrito, Distrito.DistritoId,Distrito.CantonId, Distrito.FechaDeCreacion, Distrito.ActualizadoEn);
    });
    // console.log(typeof(arr));
  });
};

public agregarDistrito(Distrito: string, CantonId: string) {
  if (!Distrito.trim() || !CantonId.trim()) {
    alert('Debe ingresar ambos valores.');
    return;
  }

  let cuerpo = {
    Distrito: Distrito,
    CantonId: parseInt(CantonId, 10),
  };

  this.http.post('http://localhost/distritos', cuerpo).subscribe(() => {
    this.Distritos.update((Distritos) => [...Distritos, cuerpo]);
  });
}

public agregarDistritosALaSenial(Distrito: string, DistritoId?: string, CantonId?: number, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaDistrito = {
    DistritoId: DistritoId,
    Distrito: Distrito,
    CantonId:CantonId,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Distritos.update((Distritos) => [...Distritos, nuevaDistrito]);
};
public modificarDistrito(Id: any, event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Distrito: tag.value,
  }
  this.http.put('http://localhost/distritos/' + Id, cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Distritos.update((Distritos) => {
      return Distritos.map((Distrito) => {
        if (Distrito.DistritoId === Id) {
          return {...Distrito, Distrito: tag.value};
        }
        return Distrito;
      });
    });
  });
};
public borrarDistrito(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/distritos/' + Id).subscribe(() => {
    this.Distritos.update((Distritos) => Distritos.filter((Distrito) => Distrito.DistritoId !== Id));
  });
};

redirigirCrearDistrito() {
  window.location.href = '/CrearDistrito';
}
}
