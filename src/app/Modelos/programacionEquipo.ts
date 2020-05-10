export interface ProgramacionEquipoModel {
    _id: string;
    programacionproyecto: string;
    miembros: Miembros;
    estado: boolean;
    __v: number;
}

export interface Miembros {
    _id: string;
    nombre: string;
    apellido: string;
    costoHr: number;
}

export interface ProgramacionEquipoDetalladoModel {
    _id: string;
    programacionproyecto: Programacionproyecto;
    miembros: Miembros;
    estado: boolean;
    __v: number;
}

export interface Programacionproyecto {
    tiempoReal: number;
    presupuestoReal: number;
    estado: boolean;
    _id: string;
    cuentas: Cuentas;
    proyectos: Proyectos;
    actividades: Actividades;
    tiempoProyectado: number;
    presupuestoProyectado: number;
    __v: number;
}

export interface Actividades {
    _id: string;
    nombre: string;
}

export interface Proyectos {
    _id: string;
    nombreProyecto: string;
}

export interface Cuentas {
    _id: string;
    empresa: string;
}
