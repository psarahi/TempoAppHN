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
  menu: any[] = [];


  constructor(
    private route: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    const infoUser = this.userService.getInfoLogin();
    this.menu = infoUser.menu;
    console.log(this.menu);
    
  }

  logout() {
    this.userService.clearInfoLogin();
  }
}
