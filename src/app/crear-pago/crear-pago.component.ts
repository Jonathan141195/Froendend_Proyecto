import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MetodoPago, EstadoPago, Pago } from '../modelo/Pago';
import { Matricula } from '../modelo/Matricula';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-crear-pago',
  standalone: true, // 👈 importante si estás usando Angular standalone components
  imports: [CommonModule, FormsModule], // 👈 aquí se importan los módulos necesarios
  templateUrl: './crear-pago.component.html',
  styleUrls: ['./crear-pago.component.css']
})
export class CrearPagoComponent {
  
    public pago: Pago = {
      MatriculaId: '',
      Matricula: { MatriculaId: '', Matricula: '', TotalMatricula: '' },
      Monto: '',
      Cambio: '0.00',
      MetodoPago: MetodoPago.EFECTIVO,
      EstadoPago: '',
      FechaPago: new Date().toISOString(),
      FechaDeCreacion: new Date().toISOString(),
      ActualizadoEn: new Date().toISOString(),
      Recibo: ''
    };
  
    public tarjetaInfo = {
      numero: '',
      nombre: '',
      vencimiento: '',
      cvv: ''
    };
  
    public metodoPagoOptions = Object.values(MetodoPago);
    public mostrarAlerta = false;
    public mensajeAlerta = '';
    public tipoAlerta: 'success' | 'error' = 'success';
    public cargando = false;
    public enviado = false;

  
    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) this.cargarDatosMatricula(id);
    }
  
    cargarDatosMatricula(id: string) {
      this.http.get<any[]>(`http://localhost/matricula/${id}`).subscribe(data => {
        const datos = data[0];
        if (datos) {
          this.pago.MatriculaId = datos.MatriculaId;
          this.pago.Matricula = {
            MatriculaId: datos.MatriculaId,
            Matricula: datos.Matricula,
            TotalMatricula: datos.TotalMatricula
          };
        }
      });
    }
  
    calcularCambio(): void {
      const montoEntregado = Number(this.pago.Monto) || 0;
      const totalMatricula = Number(this.pago.Matricula?.TotalMatricula || 0);
  
      if (montoEntregado < totalMatricula) {
        this.alerta('El monto entregado no puede ser menor al total a pagar.', 'error');
        this.pago.Cambio = '0.00';
        return;
      }
  
      this.pago.Cambio = (montoEntregado - totalMatricula).toFixed(2);
    }
  
    realizarPago(): void {
      if (this.enviado) return; // ← evita que se dispare dos veces
      this.enviado = true;
    
      if (!this.pago.MetodoPago || !this.pago.Monto) {
        this.alerta('Debe completar todos los campos obligatorios.', 'error');
        this.enviado = false;
        return;
      }
    
      const montoEntregado = Number(this.pago.Monto);
      const totalMatricula = Number(this.pago.Matricula?.TotalMatricula || 0);
    
      if (isNaN(montoEntregado) || montoEntregado < totalMatricula) {
        this.alerta('El monto entregado es insuficiente.', 'error');
        this.enviado = false;
        return;
      }
    
      const cambioCalculado = montoEntregado - totalMatricula;
      this.pago.Cambio = cambioCalculado > 0 ? cambioCalculado.toFixed(2) : '0.00';
    
      if (this.pago.MetodoPago === MetodoPago.TARJETA) {
        if (!this.tarjetaInfo.numero || !this.tarjetaInfo.nombre || !this.tarjetaInfo.vencimiento || !this.tarjetaInfo.cvv) {
          this.alerta('Debe completar la información de la tarjeta.', 'error');
          this.enviado = false;
          return;
        }
    
        this.alerta('Procesando pago con tarjeta...', 'success');
        this.cargando = true;
    
        setTimeout(() => {
          this.cargando = false;
          this.finalizarPago();
        }, 2000);
      } else {
        this.finalizarPago();
      }
    }
    
    finalizarPago(): void {
      this.pago.FechaPago = new Date().toISOString();
      this.pago.FechaDeCreacion = new Date().toISOString();
      this.pago.ActualizadoEn = new Date().toISOString();
      this.pago.EstadoPago = EstadoPago.PAGADO;
      this.pago.Recibo = this.generarRecibo();
    
      // 🔄 Convertimos los strings antes de enviar, sin tocar la interfaz
      const datosConvertidos = {
        ...this.pago,
        Monto: parseFloat(this.pago.Monto ?? '0'),
        Cambio: parseFloat(this.pago.Cambio ?? '0')
      };
    
      this.http.post('http://localhost/pago', datosConvertidos).subscribe({
        next: () => {
          this.alerta('Pago registrado exitosamente.', 'success');
          setTimeout(() => this.router.navigate(['/Pago']), 2000);
        },
        error: () => this.alerta('Error al registrar el pago.', 'error')
      });
    }
    
  
    generarRecibo(): string {
      const now = new Date();
      const idRandom = Math.floor(1000 + Math.random() * 9000);
      return `REC-${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${idRandom}`;
    }
  
    alerta(mensaje: string, tipo: 'success' | 'error') {
      this.mensajeAlerta = mensaje;
      this.tipoAlerta = tipo;
      this.mostrarAlerta = true;
      setTimeout(() => this.mostrarAlerta = false, 4000);
    }
  }
  