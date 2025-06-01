import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Sede } from '../modelo/Sede';
import { CommonModule } from '@angular/common';
import { Distrito } from '../modelo/Distrito';

@Component({
  selector: 'app-editar-sede',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-sede.component.html',
  styleUrl: './editar-sede.component.css'
})
export class EditarSedeComponent {

  public sedeId: string | null;
  public DistritoId: number = 0;

  public Sede: Sede = {
    SedeId: '',
    Sede: '',
    Telefono: '',
    Direccion: '',
    Email: '',
    DistritoId: 0,
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };

  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public Distritos = signal<Distrito[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.sedeId = this.route.snapshot.paramMap.get('id');
    if (this.sedeId) {
      this.cargarDatosSede(this.sedeId);
    }
  }

  ngOnInit(): void {
    this.cargarDistritos(); // Llamar a cargar distritos
  }

  // Método para cargar los distritos
  cargarDistritos(): void {
    this.http.get<any[]>('http://localhost/distritos').subscribe({
      next: (data) => {
        this.Distritos.update(() => data); // Asigna los distritos a la señal
        this.cargarDatosSede(this.sedeId!); // Después de cargar los distritos, carga la sede
      },
      error: (err) => {
        console.error('Error al cargar distritos:', err);
      }
    });
  }

  // Método para cargar los datos de la sede
  cargarDatosSede(sedeId: string): void {
    this.http.get<any[]>(`http://localhost/sedes/${sedeId}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          this.Sede = {
            SedeId: datos.SedeId ?? '',
            Sede: datos.Sede ?? '',
            Telefono: datos.Telefono ?? '',
            DistritoId: datos.DistritoId ?? 0,  // Asigna el DistritoId de la sede
            Email: datos.Email ?? '',
            Direccion: datos.Direccion ?? '',
            FechaDeCreacion: datos.FechaDeCreacion ?? '',
            ActualizadoEn: datos.ActualizadoEn ?? ''
          };
          // Asigna el DistritoId al modelo del formulario
          this.DistritoId = datos.DistritoId ?? 0; // Inicializa el DistritoId
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
public modificarSede(Id: string | undefined, event: Event): void {
  const tag = event.target as HTMLInputElement;

  // Asegurarse de que DistritoId sea un número entero
  const distritoIdEntero = parseInt(this.DistritoId.toString(), 10);

  // Comprobar si la conversión fue exitosa
  if (isNaN(distritoIdEntero)) {
    console.error("El DistritoId no es un número válido");
    return;
  }

  const cuerpo = {
    SedeId: this.Sede.SedeId,
    Sede: this.Sede.Sede,
    Telefono: this.Sede.Telefono,
    DistritoId: distritoIdEntero,  // Aquí convertimos el DistritoId a entero
    Email: this.Sede.Email,
    Direccion: this.Sede.Direccion,
    FechaDeCreacion: this.Sede.FechaDeCreacion,
    ActualizadoEn: this.Sede.ActualizadoEn
  };

  this.http.put(`http://localhost/sedes/${Id}`, cuerpo).subscribe({
    next: () => {
      this.mostrarAlerta = true;
      this.mensajeAlerta = 'Sede modificada correctamente.';
      setTimeout(() => {
        this.mostrarAlerta = false;
      }, 10000); // Desaparece la alerta después de 10 segundos
      this.router.navigate(['/Sedes']);
    },
    error: (err) => {
      console.error('Error al modificar la Sede:', err);
      this.mostrarAlerta = true;
      this.mensajeAlerta = 'Ocurrió un error al modificar la Sede.';
      setTimeout(() => {
        this.mostrarAlerta = false;
      }, 10000); // Desaparece la alerta después de 10 segundos
    }
  });
}



  onDistritoChange(event: any) {
    this.DistritoId = event.target.value;
    console.log('Distrito seleccionado:', this.DistritoId);
  }
}
