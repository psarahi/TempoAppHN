import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UsuarioLogin } from '../Modelos/autentificacion';
import { NzMessageService } from 'ng-zorro-antd/message';
import { duration } from 'moment';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  formulario: boolean = true;
  loading: boolean = true;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private serviceLogin: LoginService,
    private notification: NzNotificationService,
    private message: NzMessageService
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
        // console.log(data);
        localStorage.setItem('infoUser', JSON.stringify(data));
        //console.log(localStorage.getItem('infoUser'));
        this.route.navigate(['/proyecto']);
        this.createMessage('success', 'Bienvenido');

        //  console.log(data);
        // if (data.length === 0) {
        //   this.createNotification('error');
        // } else {
        //   localStorage.setItem('infoUser', data[0]._id);
        //  // this.route.navigate(['/proyecto']);
        //   console.log(localStorage.getItem('infoUser'));
        // }
      },
      (error) => {
        this.createNotification('error');
        this.validateForm = this.fb.group({
          usuario: [null, [Validators.required]],
          password: [null, [Validators.required]]
        });
        // console.log(error);
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
