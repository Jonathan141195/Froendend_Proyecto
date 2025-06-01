export interface Usuario {
    UserId?: string | undefined;
    Username: string | undefined;
    CorreoElectronico: string;
    RolId: number | undefined;  // Asegúrate de que sea 'number' aquí
    name: string | undefined;
    Password: string | undefined;
    FechaDeCreacion?: string | undefined;
    ActualizadoEn?: string | undefined;
  }

  export interface Rol {
    RolId?: string ;
    Descripcion: string 
    FechaDeCreacion?: string ;
    ActualizadoEn?: string ;
  }

  