import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProgramacionEquipoService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getProgramacionEquipos() {
    return this.http.get(`${apiUrl}/programacionEquipos`);
  }

  postProgramacionEquipos(programacionEquipos) {
    return this.http.post(`${apiUrl}/programacionEquipos`, programacionEquipos);
  }

  getProgramacionEquipo_Programacion(programacionProyecto: string) {
    return this.http.get(`${apiUrl}/programacionEquipos/ProgramacionProyecto/${programacionProyecto}`);
  }

  getProgramaEquipo_Detallado() {
    const { id } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/programacionEquipos/detallado/${id}`);
  }

  getProgramacionProyecto(idProgra) {

    console.log(`${apiUrl}/programacionEquipos/ProgramacionProyecto/${idProgra}`);
    
    return this.http.get(`${apiUrl}/programacionEquipos/ProgramacionProyecto/${idProgra}`);
  }

}
