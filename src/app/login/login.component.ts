import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { UsuarioLogin } from '../Modelos/autentificacion';
import { NzMessageService } from 'ng-zorro-antd/message';
import { animate } from '@angular/animations';
import { UserService } from '../Servicios/user.service';
import { SesionesService } from '../Servicios/sesiones.service';
import swal from 'sweetalert';

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
    private userService: UserService,
    private sesionService: SesionesService

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
      (data: any) => {
        const { nombre, apellido, idCuenta, id } = this.userService.executeLogin(data[0]);

        this.sesionService.manejoSesiones(idCuenta, id, data[1], data[2]);

        this.route.navigate(['/actividadActiva']);
        this.createMessage('success', `Bienvenido ${nombre} ${apellido}`);
      },
      (error) => {
        // this.createNotification('error');
        // this.createMessage('error', 'Credenciales invalidas');
        if (error.status === 0) {
          swal('Lo sentimos', 'No se pudo establecer conexión con el servidor', 'error');

        } else {
          swal(`${error.error}`, 'Por favor revise sus credenciales', 'error');

        }

        this.validateForm = this.fb.group({
          usuario: [null],
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
