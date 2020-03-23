export interface MiembrosModel {
  _id: string;
  idCuenta: string;
  nombre: string;
  apellido: string;
  usuario: string;
  password: string;
  correo: string;
  costoHr: number;
  perfil: string;
  expertis: string[];
  estado: boolean;
}

export interface Miembro {
  idCuenta: string;
  nombre: string;
  apellido: string;
  usuario: string;
  password: string;
  correo: string;
  costoHr: number;
  perfil: string;
  expertis: string[];
  estado: boolean;
}
