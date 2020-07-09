import { Injectable } from '@angular/core';
import { UsuarioLogin } from '../Modelos/autentificacion';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  infoLogin: any;

  constructor(
    private router: Router,

  ) {
    this.infoLogin = JSON.parse(localStorage.getItem('infoUser'));
  }

  getInfoLogin() {
    return this.infoLogin;
  }

  estaLogueado() {
    return (localStorage.getItem('token')) ? true : false;
  }

  clearInfoLogin() {
    this.infoLogin = '';
    localStorage.clear();
    this.router.navigate(['/login']);

  }

  executeLogin(data: UsuarioLogin) {
    localStorage.setItem('infoUser', JSON.stringify(data));
    localStorage.setItem('token', data.token);

    this.infoLogin = JSON.parse(localStorage.getItem('infoUser'));
    return this.infoLogin;
  }

}
