import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  infoLogin: any = JSON.parse(localStorage.getItem('infoUser'));
  cuentaLogin = this.infoLogin.idCuenta;

  constructor(private http: HttpClient) { }

  postActividades(actividade) {
    return this.http.post(`${apiUrl}/actividades/`, actividade);
  }

  getActividades() {

    return this.http.get(`${apiUrl}/actividades/cuenta/${this.cuentaLogin}`);

  }

}
