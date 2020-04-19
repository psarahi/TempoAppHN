import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  infoLogin: any;

  constructor() {}

  getInfoLogin() {
    return this.infoLogin;
  }

  clearInfoLogin() {
    this.infoLogin = '';
    localStorage.clear();
  }

  executeLogin( data) {
    localStorage.setItem('infoUser', JSON.stringify(data));
    this.infoLogin = JSON.parse(localStorage.getItem('infoUser'));
    return this.infoLogin;
  }

}
