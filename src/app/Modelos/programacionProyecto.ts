export interface ProgramacionProyectoModel {
  _id: string;
  idCuenta: string;
  idProyecto: string;
  idActividad: string;
  tiempoProyectado: number;
  tiempoReal: number;
  presupuestoProyectado: number;
  presupuestoReal: number;
  estado: number;
}
