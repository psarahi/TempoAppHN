import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProgramacionEquipoService {

  constructor(private http: HttpClient) { }

  getProgramacionEquipos() {
    return this.http.get(`${apiUrl}/programacionEquipos`);
  }

  postProgramacionEquipos(programacionEquipos) {
    return this.http.post(`${apiUrl}/programacionEquipos`, programacionEquipos);
  }

  getProgramacionEquipo_Programacion(programacionProyecto: string) {
    return this.http.get(`${apiUrl}/programacionEquipos/ProgramacionProyecto/${programacionProyecto}`);
  }

}
