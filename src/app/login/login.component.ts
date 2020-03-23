import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CuentaModel } from '../Modelos/cuenta';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;



  constructor(
    private fb: FormBuilder,
    private route: Router,
    private serviceLogin: LoginService,
    private notification: NzNotificationService
  ) { }

  createNotification(type: string): void {
    this.notification.create(
      type,
      'Credenciales invalidas',
      '¡Verifique su usuario o password!'
    );
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }


    this.serviceLogin.validar(this.validateForm.value.usuario, btoa(this.validateForm.value.password)).toPromise().then(
      (data: CuentaModel[]) => {
        if (data.length === 0) {
          this.createNotification('error');
        } else {

          localStorage.setItem('infoUser', data[0]._id);
          this.route.navigate(['/proyecto']);

          // const id = localStorage.getItem('infoUser');
          console.log(localStorage.getItem('infoUser'));
          // console.log(data[0]._id);
        }
      }

    );

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      usuario: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }



  login() {
    this.route.navigate(['/proyecto']);
  }
}
