import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;
const idCuenta = localStorage.getItem('infoUser');

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  constructor(
    private http: HttpClient
  ) { }

  postProyecto(proyecto) {
    return this.http.post(`${apiUrl}/proyectos`, proyecto);
  }

  getProyecto() {
   // return this.http.get(`${apiUrl}/proyectos?filter[where][idCuenta]=${idCuenta}`);
    return this.http.get(`${apiUrl}/proyectos`);

  }

  getAllProyecto() {
    return this.http.get(`${apiUrl}/proyectos`);
  }

}
