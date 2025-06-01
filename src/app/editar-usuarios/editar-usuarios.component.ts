import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../modelo/Usuarios';
import { CommonModule } from '@angular/common';
import { Rol } from '../modelo/Usuarios';

@Component({
  selector: 'app-editar-usuarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-usuarios.component.html',
  styleUrl: './editar-usuarios.component.css'
})
export class EditarUsuariosComponent {


  public usuarioId: string | null;
  public RolId: number = 0;

  public Usuario: Usuario = {
    UserId: '',
    name: '',
    Username: '',
    CorreoElectronico: '',
    Password: '',
    RolId: 0,
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };

  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public Roles = signal<Rol[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    if (this.usuarioId) {
      this.cargarDatosUsuario(this.usuarioId);
    }
  }

  ngOnInit(): void {
    this.cargarRoles(); // Llamar a cargar distritos
  }

  // Método para cargar los distritos
  cargarRoles(): void {
    this.http.get<any[]>('http://localhost/rol').subscribe({
      next: (data) => {
        this.Roles.update(() => data); // Asigna los distritos a la señal
        this.cargarDatosUsuario(this.usuarioId!); // Después de cargar los distritos, carga la sede
      },
      error: (err) => {
        console.error('Error al cargar distritos:', err);
      }
    });
  }

  // Método para cargar los datos de la sede
  cargarDatosUsuario(usuarioId: string): void {
    this.http.get<any[]>(`http://localhost/usuario/${usuarioId}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          this.Usuario = {
            UserId: datos.UserId ?? '',
            name: datos.name ?? '',
            Username: datos.Username ?? '',
            RolId: datos.RolId ?? 0,  // Asigna el DistritoId de la sede
            CorreoElectronico: datos.CorreoElectronico ?? '',
            Password: datos.Password ?? '',
            FechaDeCreacion: datos.FechaDeCreacion ?? '',
            ActualizadoEn: datos.ActualizadoEn ?? ''
          };
          // Asigna el DistritoId al modelo del formulario
          this.RolId = datos.RolId ?? 0; // Inicializa el DistritoId
        } else {
          console.warn('No se encontraron datos para el ID proporcionado.');
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos de la sede:', err);
      }
    });
  }

 // Función para modificar la sede
public modificarUsuario(Id: string | undefined, event: Event): void {
  const tag = event.target as HTMLInputElement;

  // Asegurarse de que DistritoId sea un número entero
  const RolIdEntero = parseInt(this.RolId.toString(), 10);

  // Comprobar si la conversión fue exitosa
  if (isNaN(RolIdEntero)) {
    console.error("El RolId no es un número válido");
    return;
  }

  const cuerpo = {
    UserId: this.Usuario.UserId,
    name: this.Usuario.name,
    Username: this.Usuario.Username,
    RolId: RolIdEntero,  // Aquí convertimos el DistritoId a entero
    CorreoElectronico: this.Usuario.CorreoElectronico,
    Password: this.Usuario.Password,
    FechaDeCreacion: this.Usuario.FechaDeCreacion,
    ActualizadoEn: this.Usuario.ActualizadoEn
  };

  this.http.put(`http://localhost/usuario/${Id}`, cuerpo).subscribe({
    next: () => {
      this.mostrarAlerta = true;
      this.mensajeAlerta = 'Usuario modificada correctamente.';
      setTimeout(() => {
        this.mostrarAlerta = false;
      }, 10000); // Desaparece la alerta después de 10 segundos
      this.router.navigate(['/Usuario']);
    },
    error: (err) => {
      console.error('Error al modificar la Usuario:', err);
      this.mostrarAlerta = true;
      this.mensajeAlerta = 'Ocurrió un error al modificar el Usuario.';
      setTimeout(() => {
        this.mostrarAlerta = false;
      }, 10000); // Desaparece la alerta después de 10 segundos
    }
  });
}



  onRolChange(event: any) {
    this.RolId = event.target.value;
    console.log('Rol seleccionado:', this.RolId);
  }
}