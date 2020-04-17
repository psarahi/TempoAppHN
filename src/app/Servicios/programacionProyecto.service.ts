import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProgramacionProyectoService {
  infoLogin: any = JSON.parse(localStorage.getItem('infoUser'));
  cuentaLogin = this.infoLogin.idCuenta;

  constructor(private http: HttpClient) { }
  // cuenta/${this.cuentaLogin}
  getProgramacionProyecto(cuenta: string, proyecto: string) {
    return this.http.get(`${apiUrl}/programacionProyectos/cuenta/${cuenta}/${proyecto}`);
  }

  postProgramacionProyecto(programacionProyecto) {
    return this.http.post(`${apiUrl}/programacionProyectos/`, programacionProyecto);
  }
}
