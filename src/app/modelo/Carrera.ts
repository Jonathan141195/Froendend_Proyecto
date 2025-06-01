// Carrera.ts

export interface CarreraOnSedes {
  CarreraId: string;
  SedeId: string; // Asegúrate de que SedeId esté aquí
  Sede: {
    Sede: string;
    Direccion: string;
    SedeId: string; // Añadir SedeId en Sede también
  };
}

export interface Carrera {
  CarreraId?: string; // Opcional si es necesario
  Carrera: string;
  FechaDeCreacion?: string;
  ActualizadoEn?: string;
  CarreraOnSedes: CarreraOnSedes[];
}

  
  