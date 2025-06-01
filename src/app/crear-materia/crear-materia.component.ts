import { Component, signal } from '@angular/core';
import{Materia} from './../modelo/Materia';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-crear-materia',
  imports: [FormsModule],
  templateUrl: './crear-materia.component.html',
  styleUrl: './crear-materia.component.css'
})
export class CrearMateriaComponent {


//Aqui escribo mi codigo
public Materias= signal<Materia[]>([]);

public Creditos: string = '';
constructor(private http: HttpClient,private router: Router) {
  this.metodoGETMaterias();
};
public metodoGETMaterias() {
  this.http.get('http://localhost/materia').subscribe((Materias) => {
    const arr = Materias as Materia[];

    arr.forEach((Materia) => {
      this.agregarMateriasALaSenial(
        Materia.MateriaId ?? '',  // Si es undefined, asignamos un valor vacío por defecto
        Materia.Materia ?? '',  // Si es undefined, asignamos un valor vacío por defecto
        Materia.Creditos ??=0,
        Materia.FechaDeCreacion ?? '',  // Si es undefined, asignamos un valor vacío por defecto
        Materia.ActualizadoEn ?? ''  // Si es undefined, asignamos un valor vacío por defecto
      );
    });

    console.log(typeof arr);
  });
}

public agregarMateriasALaSenial(
  MateriaId: string,
  Materia: string,
  Creditos: number,
  FechaDeCreacion: string,
  ActualizadoEn: string
) {
  let nuevaMateria: Materia = {
    MateriaId: MateriaId,
    Materia: Materia,
    Creditos: Creditos,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };

  this.Materias.update((Materias) => [...Materias, nuevaMateria]);
}
public agregarMateria(Materia: string, Creditos: string) {
  if (!Materia.trim() ) {
    window.alert('⚠️ Todos los campos son obligatorios.');
    return;
  }

  let cuerpo = {
    Materia: Materia.trim(),
    Creditos: parseInt(Creditos, 10),
  };

  this.http.post('http://localhost/materia', cuerpo).subscribe({
    next: () => {
      this.Materias.update((Materias) => [...Materias, cuerpo]);
      window.alert('✅ Materia agregada correctamente.');
      this.router.navigate(['/Materias']); // Cambia la ruta según tu proyecto
    },
    error: (err) => {
      console.error('Error al agregar la materia:', err);
      window.alert('❌ Ocurrió un error al agregar la materia. Por favor, intenta nuevamente.');
    }
  });
}



redirigirCrearSede() {
  window.location.href = '/CrearSede';
}
}

