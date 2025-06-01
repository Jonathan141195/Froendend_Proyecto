import { Component, signal } from '@angular/core';
import{ Sede} from './../modelo/Sede';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Distrito } from '../modelo/Distrito';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-sede',
  imports: [FormsModule],
  templateUrl: './crear-sede.component.html',
  styleUrl: './crear-sede.component.css'
})
export class CrearSedeComponent {


//Aqui escribo mi codigo
public Sedes= signal<Sede[]>([]);
public Distrito: String = '';

public Distritos = signal<Distrito[]>([]);

public DistritoId: string = '';
public Telefono: string = '';
public Email: string = '';
public Direccion: string = '';

constructor(private http: HttpClient,private router: Router) {
  this.metodoGETDistritos();
};
public metodoGETSedes() {
  let cuerpo = {};
  this.http.get('http://localhost/sedes', cuerpo).subscribe((Sedes) => {
    const arr = Sedes as Sede[];
    arr.forEach((Sede) => {
      this.agregarSedesALaSenial(Sede.Sede,Sede.SedeId,Sede.DistritoId,Sede.Email,Sede.Telefono,Sede.Direccion, Sede.FechaDeCreacion, Sede.ActualizadoEn);
    });
    console.log(typeof(arr));
  });
};

public agregarSede(Sede: string, DistritoId: string, Telefono: string, Email: string, Direccion: string) {
  if (!Sede.trim() || !DistritoId.trim() || !Telefono.trim() || !Email.trim() || !Direccion.trim()) {
    window.alert('⚠️ Todos los campos son obligatorios.');
    return;
  }

  let cuerpo = {
    Sede: Sede.trim(),
    DistritoId: parseInt(DistritoId, 10),
    Telefono: Telefono.trim(),
    Email: Email.trim(),
    Direccion: Direccion.trim()
  };

  this.http.post('http://localhost/sedes', cuerpo).subscribe({
    next: () => {
      this.Sedes.update((Sedes) => [...Sedes, cuerpo]);
      window.alert('✅ Sede agregada correctamente.');
      this.router.navigate(['/Sedes']); // Cambia el path según tu ruta de destino
    },
    error: (err) => {
      console.error('Error al agregar la sede:', err);
      window.alert('❌ Ocurrió un error al agregar la sede. Por favor, intenta nuevamente.');
    }
  });
}



public agregarSedesALaSenial(Sede: string, SedeId?: string, DistritoId?: number,Email?:string,Telefono?:string,Direccion?:string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaSede = {
    SedeId: SedeId,
    Sede: Sede,
    DistritoId:DistritoId,
    Email:Email,
    Telefono:Telefono,
    Direccion:Direccion,
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
// Método que maneja el cambio de selección
onDistritoChange(event: any) {
  this.DistritoId = event.target.value;
}

public metodoGETDistritos() {
  let cuerpo = {};
  this.http.get('http://localhost/distritos', cuerpo).subscribe((Distritos) => {
    const arr = Distritos as Distrito[];
    arr.forEach((Distrito) => {
      this.agregarDistritoALaSenial(Distrito.Distrito, Distrito.DistritoId, Distrito.FechaDeCreacion, Distrito.ActualizadoEn);
    });
    console.log(typeof(arr));
  });
};
public agregarDistritoALaSenial(Distrito: string, DistritoId?: string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaDistrito = {
    DistritoId: DistritoId,
    Distrito: Distrito,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Distritos.update((Distritos) => [...Distritos, nuevaDistrito]);
};
redirigirCrearSede() {
  window.location.href = '/CrearSede';
}
}

