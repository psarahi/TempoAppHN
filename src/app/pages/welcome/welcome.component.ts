import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Servicios/user.service';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
import { ProgramacionEquipoService } from '../../Servicios/programacionEquipo.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProgramacionEquipoDetalladoModel } from '../../Modelos/programacionEquipo';

moment.locale('es');

interface cronometro {
  hh: number;
  mm: number;
  ss: number;
  inicio: any;
  miembro: string;
  proyecto: string;
  actividad: string;
  descripcion: string;
}


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isCollapsed = false;
  menu: any[] = [];
  isVisible = false;

  acumularTime: number = 0;
  timeInicial;
  control: any;
  acumularTime2: any;
  timetest;
  timeActual;
  hh: any = '00';
  mm: any = '00';
  ss: any = '00';
  actividades: cronometro[] = [];
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
  dataDetalleActividad;
  putDetalleActividad;

  programacionequipos: string = '';
  descripcion: string = '';
  inicio: any = new Date();
  fin: any = new Date();
  infoLogin: any;
  time: Date | null = null;
  detalleActividades: DetalleActividadModel[];
  dataDetalleActividades;
  actividadActiva: DetalleActividadModel[] = [];;

  actividadesActivas: DetalleActividadModel[] = [];

  constructor(
    private route: Router,
    private userService: UserService,
    private detalleActividadService: DetalleActividadService,
    private serviceProgramacionEquipos: ProgramacionEquipoService,
    private message: NzMessageService
  ) { }

  createBasicMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  postDetalle(inicio, fin, programacionEquipo, descripcion, estado, manual) {
    this.dataDetalleActividad = {
      inicio: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
      fin: moment(fin).format('YYYY-MM-DD HH:mm:ss'),
      fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: programacionEquipo,
      descripcion,
      costo: 0,
      estado
    };

    if (manual === true) {
      this.detalleActividadService.postDetalleActividad(this.dataDetalleActividad)
        .toPromise()
        .then(
          (data: DetalleActividadModel) => {
            this.inicio = new Date();
            this.fin = new Date();
            this.descripcion = '';
            this.programacionequipos = '';
            this.ocultar();
            console.log(data, 'post db');

          },
          (error) => {
            console.log(error);

            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    } else {
      this.detalleActividadService.postDetalleActividad(this.dataDetalleActividad)
        .toPromise()
        .then(
          (data: DetalleActividadModel[]) => {

            this.actividadActiva = data;
            console.log(this.actividadActiva);

            if (this.isMarch === false) {
              this.timeInicial = new Date();
              this.control = setInterval(() => {
                this.cronometro(this.timeInicial);
              }, 10);
              this.isMarch = true;
            }
          },
          (error) => {
            console.log(error);

            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    }


  }
  guardar() {
    this.postDetalle(this.inicio, this.fin, this.programacionequipos, this.descripcion, false, true);
  }

  start() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = true;
    this.btnResumen = false;

    this.postDetalle(
      new Date(),
      new Date(),
      this.programacionequipos,
      this.descripcion,
      true,
      false);
  }

  stop() {
    this.btnStart = true;
    this.btnStop = false;
    this.btnPause = false;
    this.btnResumen = false;
    console.log(this.actividadActiva[0].inicio , ' inicio inicio');
    this.putDetalleActividad = {

      inicio: moment(this.actividadActiva[0].inicio).format('YYYY-MM-DD HH:mm:ss'),
      fin: moment().format('YYYY-MM-DD HH:mm:ss'),
      fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: this.programacionequipos,
      descripcion: this.descripcion,
      costo: 0,
      estado: false
    };
    console.log(this.actividadActiva[0]._id);

    this.detalleActividadService.putDetalleActividad(this.actividadActiva[0]._id, this.putDetalleActividad)
      .toPromise()
      .then((data: DetalleActividadModel) => {
        this.programacionequipos = '';
        this.descripcion = '';
        clearInterval(this.control);
        this.isMarch = false;
        this.reset();

        // if (this.isMarch === true) {
        //   clearInterval(this.control);
        //   this.isMarch = false;
        //   this.reset();
        // }
      }
      );
  }

  pause() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = false;
    this.btnResumen = true;

    if (this.isMarch === true) {
      clearInterval(this.control);
      this.isMarch = false;
    }
  }

  resume() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = true;
    this.btnResumen = false;
    let timeActu2;
    let acumularResume;
    if (this.isMarch == false) {
      timeActu2 = new Date();
      timeActu2 = timeActu2.getTime();
      acumularResume = timeActu2 - this.acumularTime;

      this.timeInicial.setTime(acumularResume);
      this.control = setInterval(() => {
        this.cronometro(this.timeInicial);
      }, 10);
      this.isMarch = true;
    }
  }

  reset() {
    if (this.isMarch === true) {
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
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  revisarActividades() {
    this.detalleActividadService.getAllDetalleActividadActivas()
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          this.actividadActiva = data;
          console.log(this.actividadActiva);

          if (this.actividadActiva.length > 0) {

            this.btnStart = false;
            this.btnStop = true;
            this.btnPause = true;
            this.btnResumen = false;
            this.isMarch = true;

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
            }, 10);

          }
        }
      );
  }

  ngOnInit() {
    this.enviar = true;
    this.up = false;
    this.down = true;

    this.modoManual = false;
    this.modoReloj = true;

    this.btnResumen = false;
    this.btnPause = false;
    this.btnStop = false;
    this.btnStart = true;
    this.infoLogin = this.userService.getInfoLogin();

    this.serviceProgramacionEquipos.getProgramaEquipo_Detallado()
      .toPromise()
      .then((data: ProgramacionEquipoDetalladoModel[]) => {
        this.listaProgramacion = data;
        //  console.log(this.listaProgramacion);
      }

      );
    this.menu = this.infoLogin.menu;

  }

  logout() {
    this.userService.clearInfoLogin();
  }
}
