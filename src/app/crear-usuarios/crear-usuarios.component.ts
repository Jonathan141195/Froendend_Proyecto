import { Component, signal } from '@angular/core';
import{ Usuario} from './../modelo/Usuarios';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../modelo/Usuarios';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-crear-usuarios',
  imports: [FormsModule],
  templateUrl: './crear-usuarios.component.html',
  styleUrl: './crear-usuarios.component.css'
})
export class CrearUsuariosComponent {


//Aqui escribo mi codigo
public Usuarios= signal<Usuario[]>([]);
public Rol: String = '';

public Roles = signal<Rol[]>([]);

public RolId: string = '';
public Username: string = '';
public CorreoElectronico: string = '';
public name: string = '';
public Password: string = '';

constructor(private http: HttpClient) {
  this.metodoGETRoles();
};


public agregarSede(CorreoElectronico: string, RolId: string, name: string, Username: string, Password: string) {
  if (!CorreoElectronico.trim() || !RolId.trim() || !name.trim() || !Username.trim()|| !Password.trim()) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  let cuerpo = {
    CorreoElectronico: CorreoElectronico,
    RolId:  parseInt(RolId, 10),
    name: name,
    Username: Username,
    Password:Password
  };

  this.http.post('http://localhost/usuario', cuerpo).subscribe(() => {
    this.Usuarios.update((Usuarios) => [...Usuarios, cuerpo]);
  });
}



// Método que maneja el cambio de selección
onRolChange(event: any) {
  this.RolId = event.target.value;
}

public metodoGETRoles() {
  let cuerpo = {};
  this.http.get('http://localhost/Rol', cuerpo).subscribe((Roles) => {
    const arr = Roles as Rol[];
    arr.forEach((Rol) => {
      this.agregarRolALaSenial(Rol.Descripcion, Rol.RolId, Rol.FechaDeCreacion, Rol.ActualizadoEn);
    });
    console.log(typeof(arr));
  });
};
public agregarRolALaSenial(Descripcion: string, RolId?: string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaRol = {
    RolId: RolId,
    Descripcion: Descripcion,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Roles.update((Roles) => [...Roles, nuevaRol]);
};

}