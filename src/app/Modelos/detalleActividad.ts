export interface DetalleActividadModel {
    inicio: any;
    fin: any;
    fecha: any;
    estado: boolean;
    _id: string;
    cuentas: string;
    programacionequipos: Programacionequipos;
    descripcion: string;
    costo: number;
    __v: number;
}

export interface Programacionequipos {
    estado: boolean;
    _id: string;
    programacionproyecto: Programacionproyecto;
    miembros: string;
    __v: number;
}

export interface Programacionproyecto {
    _id: string;
    proyectos: Proyectos;
    actividades: Actividades;
}

export interface Actividades {
    _id: string;
    nombre: string;
}

export interface Proyectos {
    _id: string;
    nombreProyecto: string;
}

