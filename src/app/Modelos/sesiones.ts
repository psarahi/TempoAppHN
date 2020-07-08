export interface SesionesModel {
  fechaLogin: any;
  fechaLoginTemp: any;
  fechaLogout: any;
  tiempoLogin: number;
  estado: boolean;
  _id: string;
  cuentas: string;
  miembros: Miembros;
  __v: number;
}

export interface Miembros {
  _id: string;
  nombre: string;
  apellido: string;
  usuario: string;
}
