import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }


  postSesion(sesion) {
    return this.http.post(`${apiUrl}/sesiones/`, sesion);
  }

  putSesion(id, sesion) {
    return this.http.put(`${apiUrl}/sesiones/${id}`, sesion);
  }

  getSesionesCuentaDia() {
    const { idCuenta } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/sesiones/sesionesCuentaDia/${idCuenta}`);
  }

  getSesionesCuenta() {
    const { idCuenta } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/sesiones/sesionesCuenta/${idCuenta}`);
  }

}
