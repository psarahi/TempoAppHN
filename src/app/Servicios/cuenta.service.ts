import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(private http: HttpClient) { }

  postCuenta(cuenta) {
    return this.http.post(`${apiUrl}/cuentas/`, cuenta);
  }

  getCuenta() {
    return this.http.get(`${apiUrl}/cuentas/`);
  }
}
