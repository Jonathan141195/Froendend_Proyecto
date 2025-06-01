import { Component, signal } from '@angular/core';
import{ Pago} from '../modelo/Pago';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  imports: [FormsModule,CommonModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent {

  
//Aqui escribo mi codigo
public Pagos= signal<Pago[]>([]);


public Pago: string = '';


constructor(private http: HttpClient,private router: Router) {
  this.metodoGETPagos();
};


public metodoGETPagos() {
  this.http.get<Pago[]>('http://localhost/pago').subscribe((pagos) => {
    pagos.forEach((pago) => {
      this.agregarPagoALaSenial(
        pago.Recibo ?? '',
        pago.EstadoPago ?? '',
        pago.MatriculaId ?? '',
        {
          MatriculaId: pago.Matricula?.MatriculaId ?? '',
          Matricula: pago.Matricula?.Matricula ?? '',
          TotalMatricula: pago.Matricula?.TotalMatricula ?? '',
        },
        pago.Monto ?? '',
        pago.Cambio ?? '',
        pago.FechaPago ?? '',
        pago.FechaDeCreacion ?? '',
        pago.ActualizadoEn ?? ''
      );
    });

    console.log('Pagos cargados:', pagos);
  });
}


public agregarPagoALaSenial(
  Recibo: string,
  EstadoPago: string,
  MatriculaId: string,
  Matricula: {
    MatriculaId: string;
    Matricula: string;
    TotalMatricula: string;
  },
  Monto: string,
  Cambio: string,
  FechaPago: string,
  FechaDeCreacion: string,
  ActualizadoEn: string
) {
  const nuevoPago: Pago = {
    Recibo,
    EstadoPago,
    MatriculaId,
    Matricula,
    Monto,
    Cambio,
    FechaPago,
    FechaDeCreacion,
    ActualizadoEn,
  };

  this.Pagos.update((pagos) => [...pagos, nuevoPago]);
}



public borrarPago(Id: any) {
  console.log(Id);
  this.http.delete('http://localhost/pago/' + Id).subscribe(() => {
    this.Pagos.update((Pagos) => Pagos.filter((Pago) => Pago.PagoId !== Id));
  });
};

}
