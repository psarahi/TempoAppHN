import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(
    private http: HttpClient,
    private userService: UserService

  ) { }

  postActividades(actividade) {
    return this.http.post(`${apiUrl}/actividades/`, actividade);
  }

  getActividades() {
    const { idCuenta } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/actividades/cuenta/${idCuenta}`);
  }

  getAllActividades() {
    return this.http.get(`${apiUrl}/actividades/`);
  }

}
