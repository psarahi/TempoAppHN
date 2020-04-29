import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DetalleActividadService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getDetalleActividad() {
    const { idCuenta } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/detalleActividad/cuenta/${idCuenta}`);
  }

  getAllDetalleActividad() {
    return this.http.get(`${apiUrl}/detalleActividad/`);
  }

  postDetalleActividad(detalleActividad) {
    return this.http.post(`${apiUrl}/detalleActividad/`, detalleActividad);
  }

  putDetalleActividad(detalleActividad) {
    return this.http.post(`${apiUrl}/detalleActividad/`, detalleActividad);
  }

  getDetalleActividadMiembros() {
    const { idCuenta, id } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/detalleActividad/miembrosDetalle/${idCuenta}/${id}`);
  }

  getDetalleActividadActivoMiembros() {
    const { idCuenta, id } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/detalleActividad/miembrosDetalleActivos/${idCuenta}/${id}`);
  }

}

