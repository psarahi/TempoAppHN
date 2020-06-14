import { Component, OnInit } from '@angular/core';
import { ProgramacionEquipoDetalladoModel } from './../../Modelos/programacionEquipo';
import { ProgramacionEquipoService } from '../../Servicios/programacionEquipo.service';
import * as moment from 'moment';
moment.locale('es');

import * as goldenColors from 'golden-colors';
import esLocale from '@fullcalendar/core/locales/es-us';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from 'src/app/Modelos/detalleActividad';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { UserService } from '../../Servicios/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';


interface Event {
  title: string;
  // date: any;
  start: any;
  end: any;
  allDay: boolean;
  color: any;
  descripcion: string;
  nombreProyecto: string;
  nombreAct: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // detalle: Event[] = [];
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
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarEvents: Event[] = [];
  locales = [esLocale];
  btnStart: boolean;
  btnStop: boolean;
  btnResumen: boolean;
  btnPause: boolean;
  listaProgramacion: ProgramacionEquipoDetalladoModel[] = [];
  isMarch: boolean = false;
  acumularTime: number = 0;
  timeInicial;
  control: any;
  acumularTime2: any;
  timetest;
  timeActual;
  hh: any = '00';
  mm: any = '00';
  ss: any = '00';
  // cc: any = '00';
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
  actividadActiva: DetalleActividadModel;

  constructor(
    private detalleActividadService: DetalleActividadService,
    private serviceProgramacionEquipos: ProgramacionEquipoService,
    private userService: UserService,
    private message: NzMessageService
  ) { }

  createBasicMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  handleEventClick(arg): void {
    this.visible = true;
    this.duracion = arg.event.title;
    this.inicioDetalle = moment(arg.event.start).format('HH:mm:ss');
    this.finDetalle = moment(arg.event.end).format('HH:mm:ss');
    this.descripcionDetalle = arg.event.extendedProps.descripcion;
    this.detalleProyecto = arg.event.extendedProps.nombreProyecto;
    this.detalleActividad = arg.event.extendedProps.nombreAct;
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
            this.eventosCalendario(data);
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
          (data: DetalleActividadModel) => {

            this.actividadActiva = data;
            console.log(this.actividadActiva);

            if (this.isMarch === false) {
              this.timeInicial = new Date();
              this.control = setInterval(this.cronometro.bind(this), 1000);
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

  cronometro() {
    //debugger;
    this.timeActual = new Date();
    this.acumularTime = this.timeActual - this.timeInicial;
    this.acumularTime2 = new Date();
    this.acumularTime2.setTime(this.acumularTime);

    // this.cc = Math.round(this.acumularTime2.getMilliseconds() / 10);
    this.ss = this.acumularTime2.getSeconds();
    this.mm = this.acumularTime2.getMinutes();
    this.hh = this.acumularTime2.getHours() - 18;
    // this.hh = this.acumularTime2.getHours() - 18;
    // if (this.cc < 10) { this.cc = '0' + this.cc; }
    if (this.ss < 10) { this.ss = '0' + this.ss; }
    if (this.mm < 10) { this.mm = '0' + this.mm; }
    if (this.hh < 10) { this.hh = '0' + this.hh; }

    // pantalla.innerHTML = this.hh + ' : ' + this.mm + ' : ' + this.ss + ' : ' + this.cc;
  }

  stop() {
    this.btnStart = true;
    this.btnStop = false;
    this.btnPause = false;
    this.btnResumen = false;

    this.putDetalleActividad = {
      inicio: moment(this.actividadActiva.inicio).format('YYYY-MM-DD HH:mm:ss'),
      fin: moment().format('YYYY-MM-DD HH:mm:ss'),
      fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: this.programacionequipos,
      descripcion: this.descripcion,
      costo: 0,
      estado: false
    };
    console.log(this.actividadActiva._id);

    this.detalleActividadService.putDetalleActividad(this.actividadActiva._id, this.putDetalleActividad)
      .toPromise()
      .then((data: DetalleActividadModel) => {

        this.programacionequipos = '';
        this.descripcion = '';
        this.eventosCalendario(data);
        if (this.isMarch === true) {
          clearInterval(this.control);
          this.isMarch = false;
          this.reset();
        }
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
      this.control = setInterval(this.cronometro.bind(this), 10);
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
    // this.cc = '00';
    // this.pantalla.innerHTML = '00 : 00 : 00 : 00';

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

  eventosCalendario(dataEvento: DetalleActividadModel) {
    let inicio;
    let fin;
    let dif = 0;

    //console.log(moment(dataEvento.inicio).get('quarters'));


    inicio = moment([
      moment(dataEvento.inicio).get('year'),
      moment(dataEvento.inicio).get('month'),
      moment(dataEvento.inicio).get('day'),
      moment(dataEvento.inicio).get('hour'),
      moment(dataEvento.inicio).get('minute'),
      moment(dataEvento.inicio).get('second')
      ,
    ]);

    fin = moment([
      moment(dataEvento.fin).get('year'),
      moment(dataEvento.fin).get('month'),
      moment(dataEvento.fin).get('day'),
      moment(dataEvento.fin).get('hour'),
      moment(dataEvento.fin).get('minute'),
      moment(dataEvento.fin).get('second'),
    ]);

    dif = fin.diff(inicio, 'minutes');

    // console.log(dif);

    this.calendarEvents = [...this.calendarEvents, {
      title: `${dif} minutos`,
      // date: moment(x.fecha).format('YYYY-MM-DD'),
      start: moment(dataEvento.inicio).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(dataEvento.fin).format('YYYY-MM-DD HH:mm:ss'),
      allDay: false,
      color: goldenColors.getHsvGolden(0.5, 0.95),
      descripcion: dataEvento.descripcion,
      nombreProyecto: dataEvento.programacionequipos.programacionproyecto.proyectos.nombreProyecto,
      nombreAct: dataEvento.programacionequipos.programacionproyecto.actividades.nombre
    }];

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

    this.detalleActividadService.getAllDetalleActividad()
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          data.forEach(x => {
            this.eventosCalendario(x);
          }
          );
          //  console.log(this.calendarEvents);

        }
      );

  }

}
