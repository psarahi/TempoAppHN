import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Servicios/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isCollapsed = false;

  constructor(
    private route: Router,
    private userService: UserService
  ) { }

  ngOnInit() {

  }

  logout() {
    this.userService.clearInfoLogin();
    this.route.navigate(['/']);
  }
}
