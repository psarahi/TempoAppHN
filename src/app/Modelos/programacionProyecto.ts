export interface ProgramacionProyectoModel {
  tiempoReal: number;
  presupuestoReal: number;
  estado: boolean;
  _id: string;
  cuentas: string;
  proyectos: string;
  actividades: Actividades;
  tiempoProyectado: number;
  presupuestoProyectado: number;
  __v: number;
}

export interface Actividades {
  _id: string;
  nombre: string;
}
  // _id: string;
  // cuentas: string;
  // proyectos: string;
  // actividades: string;
  // tiempoProyectado: number;
  // tiempoReal: number;
  // presupuestoProyectado: number;
  // presupuestoReal: number;
  // estado: number;

