import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProgramacionProyectoService {

  constructor(private http: HttpClient) { }

  getProgramacionProyecto(cuenta: string, proyecto: string) {
    return this.http.get(`${apiUrl}/programacionProyectos/cuenta/${cuenta}/${proyecto}`);
  }

  getAllProgramacionProyecto(cuenta: string, proyecto: string) {
    return this.http.get(`${apiUrl}/programacionProyectos/`);
  }

  postProgramacionProyecto(programacionProyecto) {
    return this.http.post(`${apiUrl}/programacionProyectos/`, programacionProyecto);
  }

}
