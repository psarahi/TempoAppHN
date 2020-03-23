export interface ProyectoModel {
    _id: string;
    idCuenta: string;
    nombreProyecto: string;
    responsable: string;
    tiempoProyectadoPro: number;
    tiempoRealPro: number;
    presuProyectadoPro: number;
    presupuestoRealPro: number;
    estado: boolean;
}

export interface Proyecto {
    idCuenta: string;
    nombreProyecto: string;
    responsable: string;
    tiempoProyectadoPro: number;
    tiempoRealPro: number;
    presuProyectadoPro: number;
    presupuestoRealPro: number;
    estado: boolean;
}
