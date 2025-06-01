import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { Canton } from './../modelo/Canton';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-canton',
  templateUrl: './crear-canton.component.html',
  styleUrl: './crear-canton.component.css'
})
export class CrearCantonComponent {
  public Cantones = signal<Canton[]>([]);

  constructor(private http: HttpClient) {
    this.metodoGETCantones();
  }

  public metodoGETCantones() {
    this.http.get<Canton[]>('http://localhost/cantones').subscribe((cantones) => {
      cantones.forEach((canton) => {
        this.agregarCantonALaSenial(canton.Canton, canton.CantonId, canton.FechaDeCreacion, canton.ActualizadoEn);
      });
    });
  }

  public agregarCanton(nombreCanton: string, provinciaId: string) {
    if (!nombreCanton.trim() || !provinciaId.trim()) {
      console.warn("Por favor, completa ambos campos.");
      return;
    }

    let cuerpo = {
      Canton: nombreCanton,
      ProvinciaId: provinciaId,
    };

    this.http.post<Canton>('http://localhost/cantones', cuerpo).subscribe((nuevoCanton: Canton) => {
      this.Cantones.update((cantones) => [...cantones, nuevoCanton]);
    });
  }

  public agregarCantonALaSenial(Canton: string, CantonId?: string, FechaDeCreacion?: string, ActualizadoEn?: string) {
    let nuevoCanton = { CantonId, Canton, FechaDeCreacion, ActualizadoEn };
    this.Cantones.update((cantones) => [...cantones, nuevoCanton]);
  }

  public modificarCanton(Id: string, event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = { Canton: tag.value };

    this.http.put('http://localhost/cantones/' + Id, cuerpo).subscribe(() => {
      this.Cantones.update((cantones) =>
        cantones.map((canton) => (canton.CantonId === Id ? { ...canton, Canton: tag.value } : canton))
      );
    });
  }

  public borrarCanton(Id: string) {
    this.http.delete('http://localhost/cantones/' + Id).subscribe(() => {
      this.Cantones.update((cantones) => cantones.filter((canton) => canton.CantonId !== Id));
    });
  }
  

  redirigirCrearCanton() {
    window.location.href = '/CrearCanton';
  }
}

