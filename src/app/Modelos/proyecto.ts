export interface ProyectoModel {

    tiempoRealPro: number;
    presupuestoRealPro: number;
    estado: boolean;
    _id: string;
    cuentas: string;
    nombreProyecto: string;
    miembros: Miembros;
    tiempoProyectadoPro: number;
    presuProyectadoPro: number;
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
// presuProyectadoPro: number;
// presupuestoRealPro: number;
// estado: boolean;


export interface Proyecto {
    cuentas: string;
    nombreProyecto: string;
    miembros: string;
    tiempoProyectadoPro: number;
    tiempoRealPro: number;
    presuProyectadoPro: number;
    presupuestoRealPro: number;
    estado: boolean;
}
