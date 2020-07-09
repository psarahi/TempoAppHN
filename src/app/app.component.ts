import { Component, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SesionesService } from './Servicios/sesiones.service';
import { UserService } from './Servicios/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  infoLogin;

  // @HostListener('window:unload', ['$event'])
  // beforeUnloadHander(event) {
  //   this.infoLogin = this.userService.getInfoLogin();
  //   this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'logout');
  //   this.userService.clearInfoLogin();
  // }
  constructor(
    private route: Router,
    private sesionesService: SesionesService,
    private userService: UserService,

  ) { }

  // ngOnDestroy() {
  //   this.infoLogin = this.userService.getInfoLogin();
  //   this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'logout');
  //   this.userService.clearInfoLogin();
  // }

  logout() {
    localStorage.clear();
    this.route.navigate(['/']);


  }
}
