import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MiembrosModel } from 'src/app/Modelos/miembros';
import { MiembrosService } from '../../Servicios/miembros.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PerfilesService } from '../../Servicios/perfiles.service';
import { PerfilModel } from '../../Modelos/perfil';
import { UserService } from '../../Servicios/user.service';

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
  infoLogin: any;
  informacion: boolean;
  inicial: boolean;

  constructor(
    private serviceMiembro: MiembrosService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private servicePerfiles: PerfilesService,
    private userService: UserService

  ) { }

  createMessage(type: string, mensaje: string): void {
    this.message.create(type, mensaje);
  }

  submitForm(): void {

    this.dataMiembros = {
      ...this.validateForm.value,
      cuentas: this.infoLogin.idCuenta
    };

    this.serviceMiembro.postMiembros(this.dataMiembros).toPromise().then(
      (data: MiembrosModel) => {

        this.listOfDisplayData = [... this.listOfDisplayData, data];
        this.informacion = true;
        this.inicial = false
        this.loadingTable = false;
        this.createMessage('success', 'Registro creado con exito');

        this.validateForm = this.fb.group({
          nombre: [null, [Validators.required]],
          apellido: [null, [Validators.required]],
          usuario: [null, [Validators.required]],
          password: [null, [Validators.required]],
          correo: [null, [Validators.email, Validators.required]],
          perfiles: [null, [Validators.required]],
          expertis: [null, [Validators.required]],
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
    this.infoLogin = this.userService.getInfoLogin();

    this.serviceMiembro.getMiembros().toPromise().then(
      (data: MiembrosModel[]) => {
        this.listaMiembros = data;
        if (this.listaMiembros.length <= 0) {
          this.informacion = false;
          this.inicial = true;
        } else {
          this.informacion = true;
          this.inicial = false;
        }
        this.listOfDisplayData = [...this.listaMiembros];
        this.loadingTable = false;

      },
      (error) => {
        console.log(error);

        this.createMessage('error', 'Opps!!! Algo salio mal');
      }
    );

    this.servicePerfiles.getPerfilAsignable().toPromise().then(
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
      perfiles: [null, [Validators.required]],
      expertis: [null, [Validators.required]],
      estado: [true, [Validators.required]],
    });
  }

}

