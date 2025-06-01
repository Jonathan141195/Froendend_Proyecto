import { Component, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estudiante } from '../modelo/Estudiante';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-estudiantes',
  imports: [],
  templateUrl: './estudiantes.component.html',
  styleUrl: './estudiantes.component.css'
})
export class EstudiantesComponent {

//Aqui escribo mi codigo
public Estudiantes= signal<Estudiante[]>([]);


constructor(private http: HttpClient, private router: Router) {
  this.validarTokenPorRol(['1','3']).then((valido) => {
    if (valido) {
      this.metodoGETEstudiantes();
    }
  });
}

public metodoGETEstudiantes() {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  // Solo permitir acceso si el rol es 1 (admin) o 3 (docente)
  if (!token || (rol !== '1' && rol !== '3')) {
    alert('Acceso no autorizado');
    window.location.href = '/#';
    return;
  }

  const encabezados = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  this.http.get('http://localhost/estudiante', { headers: encabezados }).subscribe((Estudiantes) => {
    const arr = Estudiantes as Estudiante[];
    arr.forEach((Estudiante) => {
      this.agregarEstudiantesALaSenial(
        Estudiante.Estudiante,
        Estudiante.EstudianteId,
        Estudiante.Cedula,
        Estudiante.Email,
        Estudiante.Telefono,
        Estudiante.Direccion,
        Estudiante.FechaDeCreacion,
        Estudiante.ActualizadoEn
      );
    });
    console.log(typeof arr);
  });
}



public agregarEstudiantesALaSenial(Estudiante: string, EstudianteId?: string, Cedula?: string,Email?:string,Telefono?:string,Direccion?:string, FechaDeCreacion?: string
  , ActualizadoEn?: string) {
  let nuevaEstudiante = {
    EstudianteId:EstudianteId,
    Estudiante: Estudiante,
    Cedula:Cedula,
    Email:Email,
    Telefono:Telefono,
    Direccion:Direccion,
    FechaDeCreacion: FechaDeCreacion,
    ActualizadoEn: ActualizadoEn,
  };
  this.Estudiantes.update((Estudiantes) => [...Estudiantes, nuevaEstudiante]);
};
public modificarEstudiante(Id: any, event:  Event) {
  let tag = event.target as HTMLInputElement
  let cuerpo = {
    Distrito: tag.value,
  }
  this.http.put('http://localhost/estudiante/' + Id, cuerpo).subscribe(() => {
    // const nuevaProvincia = Provincia as Provincia;
    this.Estudiantes.update((Estudiantes) => {
      return Estudiantes.map((Estudiante) => {
        if (Estudiante.EstudianteId === Id) {
          return {...Estudiante, Estudiante: tag.value};
        }
        return Estudiante;
      });
    });
  });
};
public async borrarEstudiante(Id: any) {
  const valido = await this.validarTokenPorRol(['1']); // Solo admin (RolId = '1')
  if (!valido) return;

  const token = localStorage.getItem('token');
  const encabezados = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  console.log('Intentando borrar estudiante con ID:', Id);

  this.http.delete('http://localhost/estudiante/' + Id, { headers: encabezados }).subscribe({
    next: () => {
      this.Estudiantes.update((Estudiantes) =>
        Estudiantes.filter((Estudiante) => Estudiante.EstudianteId !== Id)
      );
      alert('Estudiante eliminado correctamente.');
    },
    error: (error) => {
      console.error('Error al borrar estudiante:', error);
      alert('Ocurrió un error al intentar eliminar el estudiante.');
    }
  });
}


private validarTokenPorRol(rolesPermitidos: string[]): Promise<boolean> {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  if (!token || !rolesPermitidos.includes(rol || '')) {
    alert('Acceso denegado. No tenés permisos para ver esta sección.');
    window.location.href = '/#';
    return Promise.resolve(false);
  }

  const headers = new HttpHeaders({
    Authorization: 'Bearer ' + token
  });

  return new Promise((resolve) => {
    this.http.get('http://localhost/usuario/validarToken', { headers }).subscribe({
      next: (response: any) => {
        if (response?.name === 'JsonWebTokenError' || response?.name === 'TokenExpiredError') {
          alert('Sesión inválida o expirada. Por favor, iniciá sesión nuevamente.');
          localStorage.clear();
          window.location.href = '/#';
          resolve(false);
        } else {
          resolve(true);
        }
      },
      error: (err) => {
        alert('Error de conexión al validar token.');
        console.error(err);
        resolve(false);
      }
    });
  });
}


  // Método para redirigir a la edición del estudiante
  public redirigirEditarEstudiante(id: string): void {
    // Navega a la ruta que tenga el parámetro de id
    this.router.navigate(['/EditarEstudiante', id]);
  }
redirigirCrearEstudiante() {
  window.location.href = '/CrearEstudiante';
}
public generarPDF(): void {
  const doc = new jsPDF();
  const estudiantes = this.Estudiantes();
  const fecha = new Date().toLocaleDateString();
  const logoURL = "https://cdn-icons-png.flaticon.com/512/3039/3039436.png";

  const img = new Image();
  img.src = logoURL;

  img.onload = () => {
    // ENCABEZADO
    doc.addImage(img, "PNG", 160, 10, 30, 30);
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.text("Sistema de Matrícula - SEFISA", 10, 20);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Listado de Estudiantes", 10, 28);
    doc.text("Fecha: " + fecha, 10, 35);

    // ENCABEZADO DE TABLA
    let startY = 45;
    const rowHeight = 10;
    const colWidths = [10, 40, 25, 50, 30, 45]; // Ajustados
    const headers = ["#", "Nombre", "Cédula", "Correo", "Teléfono", "Dirección"];

    const drawRow = (row: string[], y: number) => {
      let x = 10;
      row.forEach((text, i) => {
        doc.rect(x, y, colWidths[i], rowHeight); // Borde
        const cellText = text.length > 35 ? text.slice(0, 32) + "..." : text; // Cortar texto si es muy largo
        doc.text(cellText, x + 2, y + 6);
        x += colWidths[i];
      });
    };

    // DIBUJAR ENCABEZADO
    doc.setFillColor(200, 221, 242);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    drawRow(headers, startY);
    startY += rowHeight;

    // DIBUJAR FILAS DE DATOS
    doc.setFont("helvetica", "normal");

    estudiantes.forEach((est, index) => {
      if (startY + rowHeight > 280) {
        doc.addPage();
        startY = 20;
        doc.setFont("helvetica", "bold");
        drawRow(headers, startY); // Repetir encabezado
        doc.setFont("helvetica", "normal");
        startY += rowHeight;
      }

      const fila = [
        `${index + 1}`,
        est.Estudiante,
        est.Cedula || "N/D",
        est.Email || "N/D",
        est.Telefono || "N/D",
        est.Direccion || "N/D",
      ];
      drawRow(fila, startY);
      startY += rowHeight;
    });

    // GUARDAR PDF
    doc.save("Listado_Estudiantes_SEFISA.pdf");
  };
}




}

