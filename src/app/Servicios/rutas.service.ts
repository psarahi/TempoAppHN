import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  valores: any;
  constructor() {
    this.valores = JSON.parse(localStorage.getItem('dataProyecto'));
  }

  ejecutarNavegacion(data) {
    localStorage.setItem('dataProyecto', JSON.stringify(data));


    this.valores = JSON.parse(localStorage.getItem('dataProyecto'));
    return this.valores;
  }

  getInfoNavegacion() {
    return this.valores;
  }

  destroyInfo() {
    this.valores = '';
    localStorage.removeItem('dataProyecto');
  }

}
