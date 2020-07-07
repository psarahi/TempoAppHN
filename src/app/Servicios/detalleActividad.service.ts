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
    console.log(`${apiUrl}/detalleActividad/cuenta/${idCuenta}`);

    return this.http.get(`${apiUrl}/detalleActividad/cuenta/${idCuenta}`);
  }

  getAllDetalleActividad() {
    return this.http.get(`${apiUrl}/detalleActividad/`);
  }

  getAllDetalleActividadActivas() {
    return this.http.get(`${apiUrl}/detalleActividad/activo`);
  }

  getAllDetalleActividadActivasCuenta() {
    const { idCuenta } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/detalleActividad/activoCuenta/${idCuenta}`);
  }

  postDetalleActividad(detalleActividad) {
    return this.http.post(`${apiUrl}/detalleActividad/`, detalleActividad);
  }

  putDetalleActividad(_id, detalleActividad) {
    return this.http.put(`${apiUrl}/detalleActividad/${_id}`, detalleActividad);
  }

  getDetalleActividadMiembros() {
    const { idCuenta, id } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/detalleActividad/miembrosDetalle/${idCuenta}/${id}`);
  }

  getDetalleActividadActivoMiembros() {
    const { idCuenta, id } = this.userService.getInfoLogin();
    console.log(`${apiUrl}/detalleActividad/miembrosDetalleActivos/${idCuenta}/${id}`);

    return this.http.get(`${apiUrl}/detalleActividad/miembrosDetalleActivos/${idCuenta}/${id}`);
  }

}

