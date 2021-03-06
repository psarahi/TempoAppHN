export interface MiembrosModel {

  expertis: string[];
  estado: boolean;
  _id: string;
  cuentas: string;
  nombre: string;
  apellido: string;
  usuario: string;
  password: string;
  correo: string;
  fecha: any;
  perfiles: Perfiles;
  __v: number;
}

export interface Perfiles {
  _id: string;
  nombre: string;
}
  // _id: string;
  // cuentas: string;
  // nombre: string;
  // apellido: string;
  // usuario: string;
  // password: string;
  // correo: string;
  // perfiles: string;
  // expertis: string[];
  // estado: boolean;

export interface Miembro {
  cuentas: string;
  nombre: string;
  apellido: string;
  usuario: string;
  password: string;
  correo: string;
  perfiles: string;
  expertis: string[];
  estado: boolean;
}
