import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {Carrera } from '../modelo/Carrera';
import { Curso } from '../modelo/Curso';
import { OfertaAcademica,CursosOfertaAcademica,Periodo} from '../modelo/OfertaAcademica';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-editar-oferta-academica',
  imports: [
    CommonModule,
    FormsModule ,
    MatButtonToggleModule, 
  ],
  templateUrl: './editar-oferta-academica.component.html',
  styleUrl: './editar-oferta-academica.component.css'
})
export class EditarOfertaAcademicaComponent {


  public ofertaacademicaId: string | null;
  public OfertaAcademica: OfertaAcademica = {
    CarreraId: '',
    OfertaAcademicaId: '',
    OfertaAcademica: '',
    Periodo: '',
    Anno: '',
    CursosOfertaAcademica: [],
    FechaDeCreacion: '',
    ActualizadoEn: ''
  };
  public CarreraId:string = '';
  public cursosSeleccionados: string[] = [];

  public mostrarAlerta: boolean = false;
  public mensajeAlerta: string = '';
  public tipoAlerta: 'success' | 'error' = 'success';
  public Cursos = signal<Curso[]>([]);
  public Carreras= signal<Carrera[]>([]);
  public OfertaAcademicas = signal<OfertaAcademica[]>([]);
  public estadosCurso = [
    
    { value: Periodo.I_CUATRIMESTRE, label: 'I_CUATRIMESTRE' },
    { value: Periodo.II_CUATRIMESTRE, label: 'II_CUATRIMESTRE' },
    { value: Periodo.III_CUATRIMESTRE, label: 'III_CUATRIMESTRE' }
  ];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.ofertaacademicaId = this.route.snapshot.paramMap.get('id');
    if (this.ofertaacademicaId) {
      this.cargarDatosOfertaAcademica(this.ofertaacademicaId);
       
    }
  }
  ngOnInit() {
    this.metodoGETCarrera();
    this.metodoGETCursos();
  }

  public metodoGETCarrera() {
    this.http.get('http://localhost/carrera').subscribe((Carreras) => {
      const arr = Carreras as Carrera[];
  
      arr.forEach((Carrera) => {
        this.agregarCarrerasALaSenial(
          Carrera.CarreraId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Carrera.Carrera ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Carrera.CarreraOnSedes?.map((cs) => ({
            SedeId: cs.Sede?.SedeId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
            Sede: cs.Sede?.Sede ?? '',  // Si es undefined, asignamos un valor vacío por defecto
            Direccion: cs.Sede?.Direccion ?? ''  // Si es undefined, asignamos un valor vacío por defecto
          })) ?? [],
          Carrera.FechaDeCreacion ?? '',  // Si es undefined, asignamos un valor vacío por defecto
          Carrera.ActualizadoEn ?? ''  // Si es undefined, asignamos un valor vacío por defecto
        );
      });
  
      console.log(typeof arr);
    });
  }
  
  public agregarCarrerasALaSenial(
    CarreraId: string,
    Carrera: string,
    Sedes: { SedeId: string; Sede: string; Direccion: string }[],
    FechaDeCreacion: string,
    ActualizadoEn: string
  ) {
    let nuevaCarrera: Carrera = {
      CarreraId: CarreraId,
      Carrera: Carrera,
      CarreraOnSedes: Sedes.map(sede => ({
        CarreraId: CarreraId, // Aseguramos que tenga CarreraId
        SedeId: sede.SedeId,
        Sede: {
          SedeId: sede.SedeId,
          Sede: sede.Sede,
          Direccion: sede.Direccion
        }
      })),
      FechaDeCreacion: FechaDeCreacion,
      ActualizadoEn: ActualizadoEn,
    };
  
    this.Carreras.update((Carreras) => [...Carreras, nuevaCarrera]);
  }
  

  
  
  modificarOfertaAcademica(Id: string | undefined, event: Event): void {
    event.preventDefault();
    if (!this.OfertaAcademica.OfertaAcademica|| this.OfertaAcademica.CursosOfertaAcademica?.length === 0) {
      this.alerta('Debe completar todos los campos obligatorios.', 'error');
      return;
    }

    this.http.put(`http://localhost/ofertaacademica/${Id}`, this.OfertaAcademica).subscribe({
      next: () => {
        this.alerta('Oferta Academica se actualizo correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/OfertaAcademica']), 2000);
      },
      error: (err) => {
        this.alerta('Ocurrió un error al modificar la Oferta Academica.', 'error');
        console.error(err);
      }
    });
  }



  onCarreraChange(event: any) {
    this.CarreraId = event.target.value;
    console.log('Carrera seleccionada:', this.CarreraId);
  }
  

  alerta(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000);
  }



  public metodoGETCursos() {
    this.http.get('http://localhost/cursos').subscribe((Cursos) => {
      const arr = Cursos as Curso[];
      arr.forEach((Curso) => {
        this.agregarCursosALaSenial(
          Curso.CursoId?.toString() || '',
          Curso.Curso || '',
          Curso.Docente?.DocenteId?.toString() || '',
          Curso.Docente?.Docente?.toString() || '',
          Curso.Materia?.MateriaId?.toString() || '',
          Curso.Materia?.Materia?.toString() || '',
          Curso.Sede?.SedeId?.toString() || '',
          Curso.Sede?.Sede?.toString() || '',
          Curso.FechaInicio || '',
          Curso.FechaFin || '',
          Curso.CupoDisponible?.toString() || '',
          Curso.CupoMaximo?.toString() || '',
          Curso.Estado || '',
          Curso.FechaDeCreacion || '',
          Curso.ActualizadoEn || ''
        );
      });
      console.log(typeof arr);
    });
  }
  
  isDate(value: any): boolean {
    return !isNaN(Date.parse(value));
  }
   
  
  public agregarCursosALaSenial(
    CursoId: string = '',
    Curso: string = '',
    DocenteId: string = '',
    Docente: string = '',
    MateriaId: string = '',
    Materia: string = '',
    SedeId: string = '',
    Sede: string = '',
    FechaInicio: string = '',
    FechaFin: string = '',
    CupoDisponible: string = '',
    CupoMaximo: string = '',
    Estado: string = '',
    FechaDeCreacion: string = '',
    ActualizadoEn: string = ''
  ) {
    let nuevaCurso = {
      CursoId,
      Curso,
      Docente: {
        Docente, // Puedes modificar este campo si lo necesitas
        DocenteId,
      },
      Materia: {
        Materia, // Modifica si lo necesitas
        MateriaId,
      },
      Sede: {
        Sede, // Modifica si lo necesitas
        SedeId,
      },
      FechaInicio,
      FechaFin,
      CupoDisponible,
      CupoMaximo,
      Estado,
      FechaDeCreacion,
      ActualizadoEn
    };
    this.Cursos.update((Cursos) => [...Cursos, nuevaCurso]);
  }
    agregarCurso(): void {
      const nuevoCurso = {
        CursoId: '',  // Deberías asignar un valor real si estás obteniendo los cursos desde un servicio
        Nota: undefined,
        Estado: undefined,
        FechaRegistro: new Date().toISOString(),
       
      };
      this.OfertaAcademica.CursosOfertaAcademica?.push(nuevoCurso);
    }
  
    // Método para eliminar un curso de la tabla
    eliminarCurso(index: number): void {
      this.OfertaAcademica.CursosOfertaAcademica?.splice(index, 1);
      this.notificarCambio(index, 'eliminar');
    }
  
    // Método para notificar cuando se cambia estado o nota
    notificarCambio(index: number, tipo: 'estado' | 'nota' | 'eliminar'): void {
      if (tipo === 'estado') {
        this.alerta(`El estado del curso ha sido actualizado.`, 'success');
      } else if (tipo === 'nota') {
        this.alerta(`La nota del curso ha sido actualizada.`, 'success');
      } else if (tipo === 'eliminar') {
        this.alerta(`El curso ha sido eliminado.`, 'error');
      }
    }
    onCursoChange(cursoId: string): void {
      const index = this.cursosSeleccionados.indexOf(cursoId);
    
      if (index > -1) {
        // Si ya está seleccionado, lo quitamos
        this.cursosSeleccionados.splice(index, 1);
        this.OfertaAcademica.CursosOfertaAcademica = this.OfertaAcademica.CursosOfertaAcademica?.filter(
          (c) => c.CursoId !== cursoId
        );
      } else {
        // Si no está seleccionado, lo agregamos
        this.cursosSeleccionados.push(cursoId);
        this.OfertaAcademica.CursosOfertaAcademica?.push({
          CursoId: cursoId,
          FechaRegistro: new Date().toISOString()
        });
      }
    
      // Se asegura que Angular actualice el DOM
      this.cdr.detectChanges();
    }
    
    esCursoSeleccionado(cursoId: string): boolean {
      return this.cursosSeleccionados.includes(cursoId);
    }
    
    cargarDatosOfertaAcademica(id: string): void {
      this.http.get<any[]>(`http://localhost/ofertaacademica/${id}`).subscribe({
        next: (data) => {
          const datos = data[0];
          if (datos) {
            this.OfertaAcademica = {
              OfertaAcademicaId: this.ofertaacademicaId ?? '',
              OfertaAcademica: datos.OfertaAcademica ?? '',
              CarreraId: datos.CarreraId ?? '',
              Periodo: datos.Periodo ?? '',
              Anno: datos.Anno ?? '',
              FechaDeCreacion: datos.FechaDeCreacion ?? '',
              ActualizadoEn: datos.ActualizadoEn ?? '',
              CursosOfertaAcademica: (datos.CursosOfertaAcademica ?? []).map((item: any) => {
                const cursoId = item.CursoId?.toString();
                if (cursoId) this.cursosSeleccionados.push(cursoId); // Carga cursos ya asociados
                return {
                  OfertaAcademicaId: item.OfertaAcademicaId ?? '',
                  CursoId: cursoId ?? '',
                  FechaRegistro: item.FechaRegistro ?? '',
                  Curso: {
                    Curso: item.Curso?.Curso ?? '',
                    CursoId: cursoId ?? ''
                  }
                };
              })
            };
          } else {
            console.warn('No se encontraron datos para la oferta académica con el ID proporcionado.');
          }
        },
        error: (err) => {
          console.error('Error al cargar datos de la oferta académica:', err);
        }
      });
    }
    
  
}

