import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CuentaModel, Cuenta } from '../../Modelos/cuenta';
import { CuentaService } from '../../Servicios/cuenta.service';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {

  validateForm: FormGroup;
  dataCuenta;
  loadingTable = true;
  visible = false;
  passwordVisible = false;
  listaCuentas: CuentaModel[];
  listOfDisplayData: CuentaModel[];

  constructor(
    private fb: FormBuilder,
    private serviceCuenta: CuentaService,
    private message: NzMessageService
  ) { }

  createMessage(type: string, mensaje: string): void {
    this.message.create(type, mensaje);
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    //  this.validateForm.value.password = btoa(this.validateForm.value.password);
    this.dataCuenta = {
      ...this.validateForm.value,
      // fechaRegistro: moment().format('YYYY-MM-DD'),
      perfiles: '5e8e2246ce7ae6c0d4926b89',
    };

    this.serviceCuenta.postCuenta(this.dataCuenta).subscribe(
      (data: CuentaModel) => {
        this.listOfDisplayData = [... this.listOfDisplayData, data];

        this.loadingTable = false;

        this.createMessage('success', 'Registro creado con exito');

        this.validateForm = this.fb.group({
          nombre: [null, [Validators.required]],
          apellido: [null, [Validators.required]],
          usuario: [null, [Validators.required]],
          correo: [null, [Validators.email, Validators.required]],
          password: [null, [Validators.required]],
          empresa: [null, [Validators.required]],
          lugar: [null, [Validators.required]],
          estado: [true, [Validators.required]],
        });

      },
      (error) => {
        console.log(error);

        this.createMessage('error', 'Opps!!! Algo salio mal');
      }
    );

  }


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  ngOnInit() {
    // debugger;
    this.serviceCuenta.getCuenta().toPromise().then(
      (data: CuentaModel[]) => {
        this.listaCuentas = data;
        this.listaCuentas.forEach(element => {
          element.fechaRegistro = moment(element.fechaRegistro).format('YYYY-MM-DD');
        });
        this.listOfDisplayData = [...this.listaCuentas];
        this.loadingTable = false;
      }
    );

    this.validateForm = this.fb.group({
      nombre: [null, [Validators.required]],
      apellido: [null, [Validators.required]],
      usuario: [null, [Validators.required]],
      correo: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      empresa: [null, [Validators.required]],
      lugar: [null, [Validators.required]],
      estado: [true, [Validators.required]],
    });

  }

}
