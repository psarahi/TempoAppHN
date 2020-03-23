import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActividadesModel } from '../../Modelos/actividades';
import { ActividadesService } from '../../Servicios/actividades.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {

  validateForm: FormGroup;
  dataActividades;
  loadingTable = true;
  visible = false;
  passwordVisible = false;
  listaActividades: ActividadesModel[];
  listOfDisplayData: ActividadesModel[];

  constructor(
    private fb: FormBuilder,
    private serviceActivades: ActividadesService,
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

    // debugger;
    this.dataActividades = {
      ...this.validateForm.value,
      idCuenta: localStorage.getItem('infoUser')
    };

    this.serviceActivades.postActividades(this.dataActividades)
      .toPromise()
      .then(
        (data: ActividadesModel) => {
          this.listOfDisplayData = [...this.listOfDisplayData, data];
          this.loadingTable = false;

          this.createMessage('success', 'Registro creado con exito');

          this.validateForm = this.fb.group({
            nombre: [null, [Validators.required]],
            estado: [null, [Validators.required]],
          });
        },
        (error) => {
          console.log(error);

          this.createMessage('error', 'Opps!!! Algo salio mal');
        }
      );

  }

  ngOnInit() {
    this.serviceActivades.getActividades()
      .toPromise()
      .then(
        (data: ActividadesModel[]) => {
          this.listaActividades = data;
          this.listOfDisplayData = [...this.listaActividades];
          this.loadingTable = false;
        }
      );

    this.validateForm = this.fb.group({
      nombre: [null, [Validators.required]],
      estado: [null, [Validators.required]],
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

}
