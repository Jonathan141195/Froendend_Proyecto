

export interface Pago {
  PagoId?: string;
  MatriculaId?: string;
  Matricula?: {
    MatriculaId?: string;
    Matricula?: string;
    TotalMatricula?: string;
    // Podés agregar más datos si los necesitás
  };
  Monto?: string;
  Cambio?: string;
  MetodoPago?: string;
  EstadoPago?: string;
  FechaPago: string; // en formato ISO 8601
  Recibo?: string;
  FechaDeCreacion: string;
  ActualizadoEn: string;
}

export enum MetodoPago {
    EFECTIVO = 'Efectivo',
    TARJETA = 'Tarjeta',
    TRANSFERENCIA = 'Transferencia'
  }
  export enum EstadoPago {
    PAGADO = 'Pagado',
    PENDIENTE = 'Pendiente',
    RECHAZADO = 'Rechazado'
  }
    
