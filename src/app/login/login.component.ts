import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UsuarioLogin } from '../Modelos/autentificacion';
import { NzMessageService } from 'ng-zorro-antd/message';
import { duration } from 'moment';
import { animate } from '@angular/animations';
import { UserService } from '../Servicios/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  passwordVisible = false;
  validateForm: FormGroup;
  formulario: boolean = true;
  loading: boolean = true;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private serviceLogin: LoginService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private userService: UserService
  ) { }

  createNotification(type: string): void {
    this.notification.create(
      type,
      'Credenciales invalidas',
      '¡Verifique su usuario o password!'
    );
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  submitForm(): void {
    this.formulario = false;
    this.loading = true;
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.serviceLogin.validar(this.validateForm.value).toPromise().then(
      (data: UsuarioLogin) => {

        let { nombre, apellido } = this.userService.executeLogin(data);

        this.route.navigate(['/proyecto']);
        this.createMessage('success', `Bienvenido ${nombre} ${apellido}`);
      },
      (error) => {
        // this.createNotification('error');
        this.createMessage('error', 'Credenciales invalidas');
        this.validateForm = this.fb.group({
          usuario: [null, [Validators.required]],
          password: [null, [Validators.required]]
        });
        console.log(error);
        this.formulario = true;
        this.loading = false;
      }
    );

  }

  ngOnInit(): void {

    this.formulario = true;
    this.loading = false;

    this.validateForm = this.fb.group({
      usuario: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    this.route.navigate(['/proyecto']);
  }
}
