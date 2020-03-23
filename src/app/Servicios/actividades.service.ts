import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;
const idCuenta = localStorage.getItem('infoUser');

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }

  postActividades(actividade) {
    return this.http.post(`${apiUrl}/actividades`, actividade);
  }

  getActividades() {
   // return this.http.get(`${apiUrl}/actividades?filter[where][idCuenta]=${idCuenta}`);
    return this.http.get(`${apiUrl}/actividades`);

  }

}
