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

  programacionequipos: string = '';
  descripcion: string = '';
  inicio: any = new Date();
  fin: any = new Date();
  infoLogin: any;
  time: Date | null = null;
  detalleActividades: DetalleActividadModel[];
  dataDetalleActividades;
  actividadActiva: DetalleActividadModel;
  actividadPausada: DetalleActividadModel;
  pausa;
  actividadesActivas: DetalleActividadModel[] = [];
  usuario = {};

  miembrosCuenta: any[] = [];
  miembrosConectados: Conectado[] = [];
  arrayConectados: any[] = [];


  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (this.infoLogin) {
      this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'logout');
    }
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

  ) { }
  createBasicMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  putActividad(inicio, fin, programacionEquipo, descripcion, estado, id, accion) {

    const dataDetalleActividad = {
      inicio: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
      fin: moment(fin).format('YYYY-MM-DD HH:mm:ss'),
      fecha: moment(fin).format('YYYY-MM-DD HH:mm:ss'),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: programacionEquipo,
      descripcion,
      estado
    };

    switch (accion) {
      case 'stop': {

        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => {

            this.programacionequipos = '';
            this.descripcion = '';
            this.enviar = true;
            this.btnStart = true;
            this.btnStop = false;
            this.btnPause = false;
            this.btnResumen = false;
            this.pausa = '';

            this.reset();
          }
          );

        break;
      }
      case 'pause': {

        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => {

            // this.descripcion = '';
          }
          );

        break;
      }
      case 'resumenA': {

        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => {

            // this.descripcion = '';
          }
          );

        break;
      }
      case 'resumenP': {

        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => {

            this.descripcion = '';
          }
          );

        break;
      }
      default:
        console.log('nada');

        break;
    }
  }

  postActividad(inicio, fin, programacionEquipo, descripcion, estado, accion) {

    const dataDetalleActividad = {
      inicio: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
      fin: moment(fin).format('YYYY-MM-DD HH:mm:ss'),
      fecha: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
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
            this.actividadActiva = data;

            if (this.isMarch === false) {
              this.timeInicial = new Date();
              this.control = setInterval(() => {
                this.cronometro(this.timeInicial);
              }, 1000);
              console.log(this.control);

              this.isMarch = true;
            }
          },
          (error) => {
            console.log(error);

            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    } else {
      this.detalleActividadService.postDetalleActividad(dataDetalleActividad)
        .toPromise()
        .then(
          (data: DetalleActividadModel) => {
            this.actividadPausada = data;
            this.pausa = this.actividadPausada.inicio;
          },
          (error) => {
            console.log(error);

            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    }
  }

  guardar() {
    this.postActividad(this.inicio, this.fin, this.programacionequipos, this.descripcion, false, true);
  }

  start() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = true;
    this.btnResumen = false;

    this.postActividad(
      new Date(),
      new Date(),
      this.programacionequipos,
      this.descripcion,
      '5f00e4c38c10d277700bcfa0',
      'curso');
  }

  stop() {
    this.putActividad(
      this.actividadActiva[0].inicio,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      this.programacionequipos,
      this.descripcion,
      '5f00e4f88c10d277700bcfa3',
      this.actividadActiva[0]._id,
      'stop'
    );
  }

  pause() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = false;
    this.btnResumen = true;

    this.postActividad(
      new Date(),
      new Date(),
      this.programacionequipos,
      this.descripcion,
      '5f03ce10fbd6f3df7d7251b2',
      'pausa'
    );

    this.putActividad(
      this.actividadActiva[0].inicio,
      new Date(),
      this.programacionequipos,
      this.descripcion,
      '5f00e4e58c10d277700bcfa2',
      this.actividadActiva[0]._id,
      'pause'
    );

    // // // if (this.isMarch === true) {
    // // //   clearInterval(this.control);
    // // //   this.isMarch = false;
    // // // }
  }

  resume() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = true;
    this.btnResumen = false;

    console.log(this.actividadActiva[0].inicio);
    console.log(this.actividadPausada[0].inicio);


    this.putActividad(
      this.actividadActiva[0].inicio,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      this.programacionequipos,
      this.descripcion,
      '5f00e4c38c10d277700bcfa0',
      this.actividadActiva[0]._id,
      'resumenA'
    );

    this.putActividad(
      this.actividadPausada[0].inicio,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      this.programacionequipos,
      this.descripcion,
      '5f03ce10fbd6f3df7d7251b2',
      this.actividadPausada[0]._id,
      'resumenP'
    );

    // // // let timeActu2;
    // // // let acumularResume;

    // // // if (this.isMarch == false) {
    // // //   timeActu2 = new Date();
    // // //   timeActu2 = timeActu2.getTime();
    // // //   acumularResume = timeActu2 - this.acumularTime;

    // // //   this.timeInicial.setTime(acumularResume);
    // // //   this.control = setInterval(() => {
    // // //     this.cronometro(this.timeInicial);
    // // //   }, 1000);
    // // //   this.isMarch = true;
    // // // }
  }

  reset() {
    if (this.isMarch == true) {
      clearInterval(this.control);
      this.isMarch = false;
    }
    this.acumularTime = 0;
    this.hh = '00';
    this.mm = '00';
    this.ss = '00';
  }

  changeProgramacion() {
    this.enviar = false;
  }

  closeUsuarios(): void {
    this.visibleUsuarios = false;
  }

  close() {
    this.visible = false;
  }

  mostrar() {
    this.up = true;
    this.down = false;
  }

  ocultar() {
    this.up = false;
    this.down = true;
  }

  manual() {
    this.modoReloj = false;
    this.modoManual = true;
  }

  reloj() {
    this.modoReloj = true;
    this.modoManual = false;
  }

  cronometro(inicio) {
    this.timeActual = new Date();
    this.acumularTime = this.timeActual - inicio;
    this.acumularTime2 = new Date();
    this.acumularTime2.setTime(this.acumularTime);

    console.log('crono');

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
    this.reset();
  }

  revisarActividades() {
    this.detalleActividadService.getDetalleActividadActivoMiembros()
      .toPromise()
      .then(
        (data: DetalleActividadModel) => {
          this.actividadActiva = data[0];
          this.actividadPausada = data[1];

          console.log(this.actividadPausada);

          if (this.actividadActiva[0]) {
            this.btnStart = false;
            this.btnStop = true;
            this.btnPause = true;
            this.btnResumen = false;
            this.isMarch = true;

            if (this.actividadPausada[0]) {
              this.btnStart = false;
              this.btnStop = true;
              this.btnPause = false;
              this.btnResumen = true;
              this.isMarch = true;
              this.pausa = (this.actividadPausada[0].inicio) ? moment(this.actividadPausada[0].inicio).format('HH:mm') : '';
            }

            this.programacionequipos = this.actividadActiva[0].programacionequipos._id;
            this.descripcion = this.actividadActiva[0].descripcion;
            this.inicio = moment(this.actividadActiva[0].inicio);

            this.timeActual = new Date();
            this.timeInicial = new Date(
              this.inicio.get('year'),
              this.inicio.get('month'),
              this.inicio.get('day'),
              this.inicio.get('hour'),
              this.inicio.get('minute'),
              this.inicio.get('second')
            );

            this.control = setInterval(() => {
              this.cronometro(this.inicio);
            }, 1000);

          }
        }
      );
  }

  logout() {
    this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, [1], 'logout');
    this.userService.clearInfoLogin();
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
                console.log(this.arrayConectados);
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
    const localInfoSesion = JSON.parse(localStorage.getItem('infosesion'));

    this.sesionesService.manejoSesiones(this.infoLogin.idCuenta, this.infoLogin.id, localInfoSesion, 'refresh');

    this.usuario = {
      id: this.infoLogin.id,
      nombre: this.infoLogin.nombre + ' ' + this.infoLogin.apellido,
      cuenta: this.infoLogin.idCuenta
    }

    this.enviar = true;
    this.up = false;
    this.down = true;

    this.modoManual = false;
    this.modoReloj = true;

    this.btnResumen = false;
    this.btnPause = false;
    this.btnStop = false;
    this.btnStart = true;

    this.serviceProgramacionEquipos.getProgramaEquipo_Detallado()
      .toPromise()
      .then((data: ProgramacionEquipoDetalladoModel[]) => {
        this.listaProgramacion = data;
        //  console.log(this.listaProgramacion);
      }

      );
    this.menu = this.infoLogin.menu;

  }

}
