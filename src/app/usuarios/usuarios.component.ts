import { Component, signal } from '@angular/core';
import{ Usuario} from './../modelo/Usuarios';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {



//Aqui escribo mi codigo
public Usuarios= signal<Usuario[]>([]);


constructor(private http: HttpClient,private router: Router) {
  this.metodoGETUsuarios();
};
public metodoGETUsuarios() {
  let cuerpo = {};
  this.http.get('http://localhost/usuario', cuerpo).subscribe((Usuarios) => {
    const arr = Usuarios as Usuario[];
    arr.forEach((Usuario) => {
      this.agregarUsuariosALaSenial(
        Usuario.CorreoElectronico || '', // Asegura que siempre sea string
        Usuario.Password || '',
        Usuario.FechaDeCreacion || '',
        Usuario.ActualizadoEn || '',
        Usuario.UserId?.toString() || '',  // Convierte a string si es necesario
        Usuario.Username || '',
        Usuario.RolId  , // Asigna 0 si es undefined
        Usuario.name || ''
      );
    });
    console.log(typeof arr);
  });
};


public agregarUsuariosALaSenial(
  CorreoElectronico: string, 
  Password?: string, 
  FechaDeCreacion?: string, 
  ActualizadoEn?: string, 
  UserId?: string, 
  Username?: string, 
  RolId?: number, 
  name?: string
) {
  let nuevaUsuario = {
    UserId,
    Username,
    CorreoElectronico,
    RolId,
    name,
    Password,
    FechaDeCreacion,
    ActualizadoEn,
  };

  this.Usuarios.update((Usuarios) => [...Usuarios, nuevaUsuario]);
}



public borrarUsuario(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/usuario/' + Id).subscribe(() => {
    this.Usuarios.update((Usuarios) => Usuarios.filter((Usuario) => Usuario.UserId !== Id));
  });
};
public redirigirEditarUsuario(id: string): void {
  // Navega a la ruta que tenga el parámetro de id
  this.router.navigate(['/EditarUsuario', id]);
}
redirigirCrearUsuario() {
  window.location.href = '/CrearUsuario';
}
}


