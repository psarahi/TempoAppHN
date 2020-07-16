import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Servicios/user.service';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
import { ProgramacionEquipoService } from '../../Servicios/programacionEquipo.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProgramacionEquipoDetalladoModel } from '../../Modelos/programacionEquipo';
import { WebSocketService } from '../../Servicios/webSocket.service';
import { MiembrosService } from '../../Servicios/miembros.service';
import { SesionesService } from '../../Servicios/sesiones.service';
import swal from 'sweetalert';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { resolve } from 'url';

moment.locale('es');

interface Cronometro {
  hh: number;
  mm: number;
  ss: number;
  inicio: any;
  miembro: string;
  proyecto: string;
  actividad: string;
  descripcion: string;
}

interface Conectado {
  nombre: string;
  apellido: string;
  estado: boolean;
}

console.log(window.navigator.onLine);

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  // tslint:disable-next-line: member-ordering
  isCollapsed = false;
  menu: any[] = [];
  isVisible = false;
  visibleUsuarios = false;
  acumularTime: number = 0;
  timeInicial;
  control: any;
  acumularTime2: any;
  timetest;
  timeActual;
  hh: any = '00';
  mm: any = '00';
  ss: any = '00';
  actividades: Cronometro[] = [];
  contador = 0;

  validateForm: FormGroup;

  enviar: boolean = true;
  up: boolean = false;
  down: boolean = true;
  modoManual: boolean = true;
  modoReloj: boolean = false
  duracion;
  inicioDetalle;
  finDetalle;
  descripcionDetalle;
  detalleProyecto;
  detalleActividad;
  btnStart: boolean;
  btnStop: boolean;
  btnResumen: boolean;
  btnPause: boolean;
  listaProgramacion: ProgramacionEquipoDetalladoModel[] = [];
  isMarch: boolean = false;
  visible = false;
  pageRecargado: boolean = false;
  inicio: any = new Date();
  fin: any = new Date();
  infoLogin: any;
  time: Date | null = null;
  detalleActividades: DetalleActividadModel[];
  dataDetalleActividades;
  actividadActiva: DetalleActividadModel[] = [];
  actividadPausada: DetalleActividadModel[] = [];
  pausa;
  empezo;
  usuario = {};

  formilario: boolean;
  pausar: boolean;
  limiteAct: boolean;

  miembrosCuenta: any[] = [];
  miembrosConectados: Conectado[] = [];
  arrayConectados: any[] = [];


  @HostListener('window:unload', ['$event'])
  async unloadHandler(event) {
    if (this.infoLogin) {
      this.pageRecargado = true;

      await this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'logout');

    }
  }


  @HostListener('window.navigator.onLine')
  windownavigator() {
    console.log(window.navigator.onLine);
  }
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(event) {

  //   this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'refresh');
  // }

  constructor(
    private route: Router,
    private userService: UserService,
    private detalleActividadService: DetalleActividadService,
    private serviceProgramacionEquipos: ProgramacionEquipoService,
    private message: NzMessageService,
    public webSoketService: WebSocketService,
    private miembroService: MiembrosService,
    private sesionesService: SesionesService,
    private fb: FormBuilder,


  ) { }
  createBasicMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  putActividad(inicio, fin, programacionEquipo, descripcion, estado, id) {

    const dataDetalleActividad = {
      inicio: moment(inicio).toISOString(),
      fin: moment(fin).toISOString(),
      fecha: moment(inicio).toISOString(),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: programacionEquipo,
      descripcion,
      estado
    };

    this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
      .toPromise()
      .then((data: DetalleActividadModel) => { });
  }

  postActividad(inicio, fin, programacionEquipo, descripcion, estado, accion) {

    const dataDetalleActividad = {
      inicio: moment(inicio).toISOString(),
      fin: moment(fin).toISOString(),
      fecha: moment(inicio).toISOString(),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: programacionEquipo,
      descripcion,
      estado
    };

    if (accion === 'curso') {
      this.detalleActividadService.postDetalleActividad(dataDetalleActividad)
        .toPromise()
        .then(
          (data: DetalleActividadModel) => {

            swal('Puedes empezar a trabajar', 'La actividad se inicio con éxito', 'success');
            this.validateForm = this.fb.group({
              programacionequipos: [null, [Validators.required]],
              descripcion: [null, [Validators.required]],
            });
          },
          (error) => {
            console.log(error);
            swal('Oppps!!', 'Hubo un problema al registrar la actividad', 'error');

            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    } else {
      this.detalleActividadService.postDetalleActividad(dataDetalleActividad)
        .toPromise()
        .then(
          (data: DetalleActividadModel) => {
          },
          (error) => {
            console.log(error);

            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    }
  }

  submitForm(value: { programacionequipos: string; descripcion: string }): void {
    // tslint:disable-next-line: forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.postActividad(
      new Date(),
      new Date(),
      this.validateForm.value.programacionequipos,
      this.validateForm.value.descripcion,
      '5f00e4c38c10d277700bcfa0',
      'curso');
  }

  closeUsuarios(): void {
    this.visibleUsuarios = false;
  }

  close() {
    this.visible = false;
  }

  cronometro(inicio) {
    this.timeActual = new Date();
    this.acumularTime = this.timeActual - inicio;
    this.acumularTime2 = new Date();
    this.acumularTime2.setTime(this.acumularTime);

    this.ss = this.acumularTime2.getSeconds();
    this.mm = this.acumularTime2.getMinutes();
    this.hh = this.acumularTime2.getHours() - 18;
    if (this.ss < 10) { this.ss = '0' + this.ss; }
    if (this.mm < 10) { this.mm = '0' + this.mm; }
    if (this.hh < 10) { this.hh = '0' + this.hh; }
  }

  showModal(): void {
    this.revisarActividades();
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm = this.fb.group({
      programacionequipos: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });
  }

  revisarActividades() {
    this.detalleActividadService.getDetalleActividadActivoMiembros()
      .toPromise()
      .then(
        (data: any) => {

          this.serviceProgramacionEquipos.getProgramaEquipo_DetalladoActivo()
            .toPromise()
            .then((data: ProgramacionEquipoDetalladoModel[]) => {
              this.listaProgramacion = data;
            });

          this.actividadActiva = data[0];
          this.actividadPausada = data[1];

          if (!this.actividadActiva[0] && !this.actividadPausada[0]) {
            this.formilario = true;
            this.pausar = false;
            this.limiteAct = false;
          }

          if (this.actividadActiva[0] && !this.actividadPausada[0]) {
            this.formilario = false;
            this.pausar = true;
            this.limiteAct = false;
          }

          if (data[0].length > 1) {
            this.formilario = false;
            this.pausar = false;
            this.limiteAct = true;
          }

          if (data[0].length === 1 && this.actividadPausada[0]) {
            this.formilario = true;
            this.pausar = false;
            this.limiteAct = false;
          }

        }
      );
  }

  finalizarTareas(actividadActiva, actividadPausada) {
    return new Promise((resolve, reject) => {

      actividadActiva.forEach(element => {
        if (element.estado._id === '5f00e4c38c10d277700bcfa0') {
          // Actualizo estado de a abandono sesion
          this.putActividad(
            element.inicio,
            new Date(),
            element.programacionequipos._id,
            element.descripcion,
            '5f0a934eb250787e784ab1af',
            element._id);

          // // Creo registro tiempo muerto
          this.postActividad(
            new Date(),
            new Date(),
            element.programacionequipos._id,
            'Abandono sesion sin pausar actividades',
            '5f03ce10fbd6f3df7d7251b2',
            'pausa'
          );
        } else {
          // Actualizo estado de a abandono sesion
          this.putActividad(
            element.inicio,
            new Date(),
            element.programacionequipos._id,
            element.descripcion,
            '5f0a934eb250787e784ab1af',
            element._id);
        }
      });
      if (actividadPausada[0]) {
        actividadPausada.forEach(element => {
          console.log('agrego un nuevo comentario a la descripcion', element.programacionequipos._id);
          this.putActividad(
            element.inicio,
            moment(element.inicio).format('YYYY-MM-DD HH:mm:ss'),
            element.programacionequipos._id,
            `${element.descripcion}, salio de aplicación `,
            '5f03ce10fbd6f3df7d7251b2',
            element._id
          );

        });
      }

      resolve(true);
    });
  }

  async logout() {
    this.detalleActividadService.getDetalleActividadActivoMiembros()
      .toPromise()
      .then(
        (data: any) => {
          this.actividadActiva = data[0];
          this.actividadPausada = data[1];

          if (this.actividadActiva[0]) {
            swal({
              title: '¿Estás seguro que quieres salir, tienes un actividades activas?',
              // tslint:disable-next-line: max-line-length
              // text: `${this.actividadActiva[0].programacionequipos.programacionproyecto.proyectos.nombreProyecto} - ${this.actividadActiva[0].programacionequipos.programacionproyecto.actividades.nombre}`,
              icon: 'warning',
              buttons: ['Cancelar', 'Salir'],
              dangerMode: true,
            })
              .then((willDelete) => {
                if (willDelete) {
                  this.finalizarTareas(this.actividadActiva, this.actividadPausada)
                    .then(
                      () => {
                        this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'logout');
                        this.userService.clearInfoLogin();
                      });
                } else {
                  swal('Sigue trabajando');
                }
              });
          } else {
            this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'logoutFinal');
            this.userService.clearInfoLogin();
          }

        });



  }


  escucharSoket() {
    // this.webSoketService.emit('actividades-enCurso', actividad);
    // this.webSoketService.emit('usuario', info);

    this.webSoketService.listen('usuarios-conectados')
      .subscribe((data: any[]) => {
        this.arrayConectados = [];
        data.forEach(element => {
          this.arrayConectados.push(element.miembros);
        });

        this.revisarConeccion();
      }
      );

  }

  openUsuarios(): void {
    this.miembrosConectados = [];
    this.arrayConectados = [];
    this.miembrosCuenta = [];
    this.miembroService.usuariosConectados()
      .toPromise()
      .then(
        (data: []) => {
          this.miembrosCuenta = data;
          this.sesionesService.getSesionesCuentaDia()
            .toPromise()
            .then(
              (data: any[]) => {
                data.forEach(element => {
                  this.arrayConectados.push(element.miembros);
                });
                this.revisarConeccion();
              }
            );
        }

      );
    this.visibleUsuarios = true;
  }

  revisarConeccion() {
    this.miembrosConectados = [];
    // tslint:disable-next-line: prefer-for-of
    this.miembrosCuenta.forEach(element => {
      if (this.arrayConectados.includes(element._id)) {
        this.miembrosConectados.push({ nombre: element.nombre, apellido: element.apellido, estado: true });
      } else {
        this.miembrosConectados.push({ nombre: element.nombre, apellido: element.apellido, estado: false });
      }

    });

  }

  ngOnInit() {
    this.escucharSoket();
    this.infoLogin = this.userService.getInfoLogin();

    if (this.pageRecargado === true) {
      this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [0], 'refresh');
    }

    this.detalleActividadService.getDetalleActividadActivoMiembros()
      .toPromise()
      .then(
        (data: any) => {
          this.actividadActiva = data[0];
          this.actividadPausada = data[1];

          console.log(data);

          this.actividadActiva.forEach(element => {
            console.log(element.estado._id);

            if (element.estado._id === '5f0a934eb250787e784ab1af') {
              this.putActividad(
                element.inicio,
                element.fin,
                element.programacionequipos._id,
                element.descripcion,
                '5f00e4e58c10d277700bcfa2',
                element._id);

            }
          });
        });

    this.menu = this.infoLogin.menu;

    this.validateForm = this.fb.group({
      programacionequipos: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });

  }

}
