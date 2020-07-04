export interface ProyectoModel {

    tiempoRealPro: number;
    estado: boolean;
    _id: string;
    cuentas: string;
    nombreProyecto: string;
    miembros: Miembros;
    tiempoProyectadoPro: number;
    fechaRegistro: string;
    __v: number;
}

export interface Miembros {
    expertis: string[];
    _id: string;
    nombre: string;
    apellido: string;
}

// _id: string;
// cuentas: string;
// nombreProyecto: string;
// miembros: string;
// tiempoProyectadoPro: number;
// tiempoRealPro: number;
// estado: boolean;


export interface Proyecto {
    cuentas: string;
    nombreProyecto: string;
    miembros: string;
    tiempoProyectadoPro: number;
    tiempoRealPro: number;
    estado: boolean;
}
