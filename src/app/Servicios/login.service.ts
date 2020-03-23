import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  validar(user: string, password: string) {
    return this.http.get(`${apiUrl}/cuentas?filter[where][estado]=true&filter[where][usuario]=${user}&filter[where][password]=${password}`);
  }

}
