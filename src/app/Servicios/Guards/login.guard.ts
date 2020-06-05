import { UserService } from './../user.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    public userService: UserService,
    private router: Router
  ) { }
  canActivate() {

    if (this.userService.estaLogueado()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }

}
