import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// http://localhost:3000/api/proyectos?filter={%22where%22:%20{%22idCuenta%22:%20%225e6a63201c9d4400003a128a%22}}

const apiUrl = environment.apiUrl;
const idCuenta = localStorage.getItem('infoUser');

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(private http: HttpClient) { }

  getMiembros() {
    // return this.http.get(`${apiUrl}/miembros?filter[where][idCuenta]=${idCuenta}`);
    return this.http.get(`${apiUrl}/miembros`);
  }

  postMiembros(miembro) {
    return this.http.post(`${apiUrl}/miembros`, miembro);
  }
}
