import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(
    private http: HttpClient,
    private userService: UserService
    ) { }

  getMiembros() {
    const { idCuenta } = this.userService.getInfoLogin();

    return this.http.get(`${apiUrl}/miembros/cuenta/${idCuenta}`);
  }

  getMiembrosResponsables() {
    const { idCuenta } = this.userService.getInfoLogin();

    return this.http.get(`${apiUrl}/miembros/miembrosResponsables/${idCuenta}`);
  }

  postMiembros(miembro) {
    return this.http.post(`${apiUrl}/miembros/`, miembro);
  }
}
