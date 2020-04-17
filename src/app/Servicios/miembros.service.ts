import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {
  infoLogin: any = JSON.parse(localStorage.getItem('infoUser'));
  cuentaLogin = this.infoLogin.idCuenta;

  constructor(private http: HttpClient) { }

  getMiembros() {
    return this.http.get(`${apiUrl}/miembros/cuenta/${this.cuentaLogin}`);
  }

  getMiembrosResponsables() {
    return this.http.get(`${apiUrl}/miembros/miembrosResponsables/${this.cuentaLogin}`);
  }

  postMiembros(miembro) {
    return this.http.post(`${apiUrl}/miembros/`, miembro);
  }
}
