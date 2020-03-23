import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MiembrosModel } from 'src/app/Modelos/miembros';
import { MiembrosService } from '../../Servicios/miembros.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PerfilesService } from '../../Servicios/perfiles.service';
import { PerfilModel } from '../../Modelos/perfil';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  validateForm: FormGroup;
  passwordVisible = false;
  loadingTable = true;
  visible = false;
  listaMiembros: MiembrosModel[];
  listaPerfiles: PerfilModel[];
  listOfDisplayData: MiembrosModel[];
  dataMiembros;

  constructor(
    private serviceMiembro: MiembrosService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private servicePerfiles: PerfilesService

  ) { }

  createMessage(type: string, mensaje: string): void {
    this.message.create(type, mensaje);
  }

  ngOnInit() {

    this.serviceMiembro.getMiembros().toPromise().then(
      (data: MiembrosModel[]) => {
        this.listaMiembros = data;
        this.listOfDisplayData = [...this.listaMiembros];
        this.loadingTable = false;

      },
      (error) => {
        console.log(error);

        this.createMessage('error', 'Opps!!! Algo salio mal');
      }
    );

    this.servicePerfiles.getPerfiles().toPromise().then(
      (data: PerfilModel[]) => {
        this.listaPerfiles = data;
      }
    );

    this.validateForm = this.fb.group({
      nombre: [null, [Validators.required]],
      apellido: [null, [Validators.required]],
      usuario: [null, [Validators.required]],
      password: [null, [Validators.required]],
      correo: [null, [Validators.email, Validators.required]],
      costoHr: [null, [Validators.required]],
      perfil: [null, [Validators.required]],
      expertis: [null, [Validators.required]],
      estado: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    // debugger;
    // console.log(this.validateForm.value);
    this.validateForm.value.password = btoa(this.validateForm.value.password);
    this.dataMiembros = {
      ...this.validateForm.value,
      idCuenta: localStorage.getItem('infoUser')
    };

    console.log(this.dataMiembros);
    this.serviceMiembro.postMiembros(this.dataMiembros).toPromise().then(
      (data: MiembrosModel) => {

        this.listOfDisplayData = [... this.listOfDisplayData, data];
        this.loadingTable = false;
        this.createMessage('success', 'Registro creado con exito');

        this.validateForm = this.fb.group({
          nombre: [null, [Validators.required]],
          apellido: [null, [Validators.required]],
          usuario: [null, [Validators.required]],
          password: [null, [Validators.required]],
          correo: [null, [Validators.email, Validators.required]],
          costoHr: [null, [Validators.required]],
          perfil: [null, [Validators.required]],
          expertis: [null, [Validators.required]],
          estado: [null, [Validators.required]],
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

}

