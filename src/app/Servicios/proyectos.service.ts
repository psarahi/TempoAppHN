import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  postProyecto(proyecto) {
    return this.http.post(`${apiUrl}/proyectos/`, proyecto);
  }

  getProyecto() {

    const { idCuenta } = this.userService.getInfoLogin();

    return this.http.get(`${apiUrl}/proyectos/cuenta/${idCuenta}`);
  }

  getProyectoID(id: string) {
    return this.http.get(`${apiUrl}/proyectos/cuenta/${id}`);
  }

  getAllProyecto() {
    return this.http.get(`${apiUrl}/proyectos/`);
  }

}
