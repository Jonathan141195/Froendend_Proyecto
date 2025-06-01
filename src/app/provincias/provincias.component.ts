import { Component, signal } from '@angular/core';
import{ Provincia} from './../modelo/Provincia';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-provincias',
  imports: [JsonPipe],
  templateUrl: './provincias.component.html',
  styleUrl: './provincias.component.css'
})
export class ProvinciasComponent {
//Aqui escribo mi codigo
public Provincias = signal<Provincia[]>([]);


constructor(private http: HttpClient) {
  this.metodoGETProvincias();
};
public metodoGETProvincias() {
  let cuerpo = {};
  this.http.get('http://localhost/provincias', cuerpo).subscribe((Provincias) => {
    const arr = Provincias as Provincia[];
    arr.forEach((Provincia) => {
      this.agregarProvinviaALaSenial(Provincia.Provincia, Provincia.ProvinciaId, Provincia.FechaDeCreacion, Provincia.ActualizadoEn);
    });
    // console.log(typeof(arr));
  });
};

public agregarProvinvia(event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Provincia: tag.value,
  }
  this.http.post('http://localhost/provincias', cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Provincias.update((Provincias) => [...Provincias, cuerpo]);
  });
};
public agregarProvinviaALaSenial(Provincia: string, ProvinciaId?: string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaProvincia = {
    ProvinciaId: ProvinciaId,
    Provincia: Provincia,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Provincias.update((Provincias) => [...Provincias, nuevaProvincia]);
};
public modificarProvinvia(Id: any, event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Provincia: tag.value,
  }
  this.http.put('http://localhost/provincias/' + Id, cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Provincias.update((Provincias) => {
      return Provincias.map((Provincia) => {
        if (Provincia.ProvinciaId === Id) {
          return {...Provincia, Provincia: tag.value};
        }
        return Provincia;
      });
    });
  });
};
public borrarProvinvia(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/provincias/' + Id).subscribe(() => {
    this.Provincias.update((Provincias) => Provincias.filter((Provincia) => Provincia.ProvinciaId !== Id));
  });
};
}
