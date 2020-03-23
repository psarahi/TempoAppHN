import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CuentaModel, Cuenta } from '../../Modelos/cuenta';
import { CuentaService } from '../../Servicios/cuenta.service';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  validateForm: FormGroup;
  dataCuenta;
  passwordVisible = false;
  password: string;

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    // debugger;
    this.dataCuenta = {
      ...this.validateForm.value,
      fechaRegistro: moment().format('YYYY-MM-DD'),
      perfil: 'admin',
      estado: true
    };

    this.serviceCuenta.postCuenta(this.dataCuenta).subscribe(
      (data) => {
        this.createMessage('success', 'Registro creado con exito');
      },
      (error) => {
        console.log(error);

        this.createMessage('error', 'Opps!!! Algo salio mal');
      }
    );

  }

  constructor(
    private fb: FormBuilder,
    private serviceCuenta: CuentaService,
    private message: NzMessageService

  ) { }

  createMessage(type: string, mensaje: string): void {
    this.message.create(type, mensaje);
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      nombre: [null, [Validators.required]],
      apellido: [null, [Validators.required]],
      usuario: [null, [Validators.required]],
      correo: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      empresa: [null, [Validators.required]],
      lugar: [null, [Validators.required]]
    });
  }

}
