export interface ProgramacionEquipoModel {
    estado: boolean;
    _id: string;
    programacionproyectos: string;
    miembros: Miembros;
    __v: number;
}

export interface Miembros {
    _id: string;
    nombre: string;
    apellido: string;
    costoHr: number;
}
    // _id: string;
    // programacionproyectos: string;
    // miembros: string;
    // estado: boolean;
