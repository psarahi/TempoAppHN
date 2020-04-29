
export interface CuentaModel {
    estado: boolean;
    _id: string;
    nombre: string;
    apellido: string;
    correo: string;
    usuario: string;
    password: string;
    empresa: string;
    lugar: string;
    perfiles: Perfiles;
    fechaRegistro: any;
    __v: number;
}

export interface Perfiles {
    _id: string;
    nombre: string;
}
// _id: string;
// nombre: string;
// apellido: string;
// correo: string;
// usuario: string;
// password: string;
// empresa: string;
// lugar: string;
// fechaRegistro: any;
// perfiles: string;
// estado: boolean;

export interface Cuenta {
    nombre: string;
    apellido: string;
    correo: string;
    usuario: string;
    password: string;
    empresa: string;
    lugar: string;
    fechaRegistro: any;
    perfiles: string;
    estado: boolean;
}