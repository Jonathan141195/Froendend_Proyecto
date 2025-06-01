import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Sede } from '../modelo/Sede';
import { Carrera, CarreraOnSedes } from '../modelo/Carrera';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-carrera',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-carrera.component.html',
  styleUrls: ['./editar-carrera.component.css']
})
export class EditarCarreraComponent {

  public carreraId: string | null;
  public Carrera: Carrera = {
    CarreraId: '',
    Carrera: '',
    CarreraOnSedes: [],
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };

  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public tipoAlerta: 'success' | 'error' = 'success';

  public Sedes = signal<Sede[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.carreraId = this.route.snapshot.paramMap.get('id');
    if (this.carreraId) {
      this.cargarDatosCarrera(this.carreraId);
    }
  }
  ngOnInit(): void {
    this.cargarSedes();
    if (this.carreraId) {
      this.cargarDatosCarrera(this.carreraId);
    }
  }
  cargarSedes(): void {
    this.http.get<Sede[]>('http://localhost/Sedes').subscribe({
      next: (data) => this.Sedes.update(() => data),
      error: (err) => {
        this.alerta('Ocurrió un error al cargar las sedes.', 'error');
        console.error(err);
      }
    });
  }
 
  cargarDatosCarrera(id: string): void {
    this.http.get<any[]>(`http://localhost/carrera/${id}`).subscribe({
      next: (data) => {
        const datos = data[0];
        if (datos) {
          // Asignamos los valores directamente a la propiedad Carrera
          this.Carrera = {
            // Campos de Carrera
            CarreraId: datos.CarreraId ?? '',
            Carrera: datos.Carrera ?? '',
            FechaDeCreacion: datos.FechaDeCreacion ?? '',
            ActualizadoEn: datos.ActualizadoEn ?? '',
            CarreraOnSedes: (datos.CarreraOnSedes ?? []).map((item: any) => ({
              CarreraId: item.CarreraId ?? '',
              SedeId: item.SedeId ?? '',
              Sede: {
                Sede: item.Sede?.Sede ?? '',
                Direccion: item.Sede?.Direccion ?? '',
                SedeId: item.Sede?.SedeId ?? ''
              }
            })),
     
          };
        } else {
          console.warn('No se encontraron datos para la carrera con el ID proporcionado.');
        }
      },
      error: (err) => {
        console.error('Error al cargar datos de la carrera:', err);
      }
    });
  }
  
  

  modificarCarrera(Id: string | undefined, event: Event): void {
    event.preventDefault();
    if (!this.Carrera.Carrera || this.Carrera.CarreraOnSedes.length === 0) {
      this.alerta('Debe completar todos los campos obligatorios.', 'error');
      return;
    }

    this.http.put(`http://localhost/carrera/${Id}`, this.Carrera).subscribe({
      next: () => {
        this.alerta('Carrera modificada correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/Carreras']), 2000);
      },
      error: (err) => {
        this.alerta('Ocurrió un error al modificar la carrera.', 'error');
        console.error(err);
      }
    });
  }

  isSedeSelected(sedeId: string): boolean {
    return this.Carrera.CarreraOnSedes.some(sede => sede.SedeId === sedeId);
  }

  onSedeChange(sedeId: string, event: any): void {
    const selectedSede = this.Sedes().find(s => s.SedeId === sedeId);
    if (!selectedSede) return;

    if (event.target.checked) {
      if (!this.isSedeSelected(sedeId)) {
        const newSede: CarreraOnSedes = {
          CarreraId: this.Carrera.CarreraId ?? '',
          SedeId: sedeId,
          Sede: {
            Sede: selectedSede.Sede,
            Direccion: selectedSede.Direccion ?? '',
            SedeId: selectedSede.SedeId ?? '',
          }
        };
        this.Carrera.CarreraOnSedes = [...this.Carrera.CarreraOnSedes, newSede];
      }
    } else {
      this.Carrera.CarreraOnSedes = this.Carrera.CarreraOnSedes.filter(s => s.SedeId !== sedeId);
    }
  }

  alerta(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000);
  }
}




  