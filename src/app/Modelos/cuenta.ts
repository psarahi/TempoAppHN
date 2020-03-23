
export interface CuentaModel {
    _id: string;
    nombre: string;
    apellido: string;
    correo: string;
    usuario: string;
    password: string;
    empresa: string;
    lugar: string;
    fechaRegistro: any;
    perfil: string;
    estado: boolean;
}

export interface Cuenta {
    nombre: string;
    apellido: string;
    correo: string;
    usuario: string;
    password: string;
    empresa: string;
    lugar: string;
    fechaRegistro: any;
    perfil: string;
    estado: boolean;
}