
export interface DetalleActividadModel {
  inicio: string;
  fin: string;
  fecha: string;
  _id: string;
  cuentas: string;
  programacionequipos: Programacionequipos;
  descripcion: string;
  estado: Estado;
  __v: number;
}

export interface Estado {
  _id: string;
  nombre: string;
  __v: number;
}

export interface Programacionequipos {
  estado: boolean;
  _id: string;
  programacionproyecto: Programacionproyecto;
  miembros: Miembros;
  __v: number;
}

export interface Miembros {
  _id: string;
  nombre: string;
  apellido: string;
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
