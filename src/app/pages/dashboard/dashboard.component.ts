import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { WebSocketService } from '../../Servicios/webSocket.service';


interface Event {
  title: string;
  idPE: string;
  // date: any;
  start: any;
  end: any;
  allDay: boolean;
  color: any;
  descripcion: string;
  nombreProyecto: string;
  nombreAct: string;
  tiempoProyectado: number;
  tiempoMuerto: number;
  tiempoTotal: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // detalle: Event[] = [];
  detalle: boolean;
  enviar: boolean = true;
  up: boolean = false;
  down: boolean = true;
  modoManual: boolean = true;
  modoReloj: boolean = false
  duracionMin;
  duracionHora;
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
  tiempoProyectado;
  tiempoMuerto;
  tiempoTrabajado;
  constructor(
    private detalleActividadService: DetalleActividadService,
    private serviceProgramacionEquipos: ProgramacionEquipoService,
    private userService: UserService,
    private message: NzMessageService,
    private webSoketService: WebSocketService
  ) { }

  createBasicMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  handleEventClick(arg): void {
    this.visible = true;
    this.duracionMin = arg.event.title;
    this.inicioDetalle = moment(arg.event.start).format('HH:mm:ss');
    this.finDetalle = moment(arg.event.end).format('HH:mm:ss');
    this.descripcionDetalle = arg.event.extendedProps.descripcion;
    this.detalleProyecto = arg.event.extendedProps.nombreProyecto;
    this.detalleActividad = arg.event.extendedProps.nombreAct;
    this.duracionHora = arg.event.extendedProps.difHora;
    this.tiempoProyectado = arg.event.extendedProps.tiempoProyectado;
    this.tiempoMuerto = arg.event.extendedProps.tiempoMuerto;
    this.tiempoTrabajado = Math.round((arg.event.extendedProps.tiempoTotal - arg.event.extendedProps.tiempoMuerto) * 100) / 100;
  }

  close() {
    this.visible = false;
  }

  eventosCalendario(dataEvento: any, dataPausada: any[]) {
    let inicio;
    let fin;
    let difMin = 0;
    let difMinTM = 0;

    if (dataPausada.length > 0) {

      inicio = moment([
        moment(dataEvento.inicio).get('year'),
        moment(dataEvento.inicio).get('month'),
        moment(dataEvento.inicio).get('day'),
        moment(dataEvento.inicio).get('hour'),
        moment(dataEvento.inicio).get('minute'),
        moment(dataEvento.inicio).get('second')
      ]);

      fin = moment([
        moment(dataEvento.fin).get('year'),
        moment(dataEvento.fin).get('month'),
        moment(dataEvento.fin).get('day'),
        moment(dataEvento.fin).get('hour'),
        moment(dataEvento.fin).get('minute'),
        moment(dataEvento.fin).get('second')
      ]);

      difMin = fin.diff(inicio, 'minutes');

      dataPausada.forEach(element => {

        inicio = moment([
          moment(element.inicio).get('year'),
          moment(element.inicio).get('month'),
          moment(element.inicio).get('day'),
          moment(element.inicio).get('hour'),
          moment(element.inicio).get('minute'),
          moment(element.inicio).get('second')
        ]);

        fin = moment([
          moment(element.fin).get('year'),
          moment(element.fin).get('month'),
          moment(element.fin).get('day'),
          moment(element.fin).get('hour'),
          moment(element.fin).get('minute'),
          moment(element.fin).get('second')
        ]);

        difMinTM += fin.diff(inicio, 'minutes');

      });

      this.calendarEvents = [...this.calendarEvents, {
        title: `${Math.round((difMin / 60) * 100) / 100} horas`,
        idPE: dataEvento.programacionequipos._id,
        // date: moment(x.fecha).format('YYYY-MM-DD'),
        start: moment(dataEvento.inicio).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(dataEvento.fin).format('YYYY-MM-DD HH:mm:ss'),
        allDay: false,
        color: goldenColors.getHsvGolden(0.5, 0.95),
        descripcion: dataEvento.descripcion,
        nombreProyecto: dataEvento.programacionequipos.programacionproyecto.proyectos.nombreProyecto,
        nombreAct: dataEvento.programacionequipos.programacionproyecto.actividades.nombre,
        tiempoProyectado: dataEvento.programacionequipos.programacionproyecto.tiempoProyectado,
        tiempoMuerto: Math.round((difMinTM / 60) * 100) / 100,
        tiempoTotal: Math.round((difMin / 60) * 100) / 100
      }];
    } else {

      inicio = moment([
        moment(dataEvento.inicio).get('year'),
        moment(dataEvento.inicio).get('month'),
        moment(dataEvento.inicio).get('day'),
        moment(dataEvento.inicio).get('hour'),
        moment(dataEvento.inicio).get('minute'),
        moment(dataEvento.inicio).get('second')
      ]);

      fin = moment([
        moment(dataEvento.fin).get('year'),
        moment(dataEvento.fin).get('month'),
        moment(dataEvento.fin).get('day'),
        moment(dataEvento.fin).get('hour'),
        moment(dataEvento.fin).get('minute'),
        moment(dataEvento.fin).get('second')
      ]);

      difMin = fin.diff(inicio, 'minutes');


      this.calendarEvents = [...this.calendarEvents, {
        title: `${Math.round((difMin / 60) * 100) / 100} horas`,
        idPE: dataEvento.programacionequipos._id,
        // date: moment(x.fecha).format('YYYY-MM-DD'),
        start: moment(dataEvento.inicio).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(dataEvento.fin).format('YYYY-MM-DD HH:mm:ss'),
        allDay: false,
        color: goldenColors.getHsvGolden(0.5, 0.95),
        descripcion: dataEvento.descripcion,
        nombreProyecto: dataEvento.programacionequipos.programacionproyecto.proyectos.nombreProyecto,
        nombreAct: dataEvento.programacionequipos.programacionproyecto.actividades.nombre,
        tiempoProyectado: dataEvento.programacionequipos.programacionproyecto.tiempoProyectado,
        tiempoMuerto: Math.round((difMinTM / 60) * 100) / 100,
        tiempoTotal: Math.round((difMin / 60) * 100) / 100
      }];


    }
  }

  escucharSoket() {
    this.webSoketService.listen('actividades-calendario')
      .subscribe((data: any) => {

        if (this.infoLogin.perfil === '5e8e2246ce7ae6c0d4926b89' || this.infoLogin.perfil === '5e8e22d0ce7ae6c0d4926b8a') {
          if (data[0].length > 0 && this.infoLogin.idCuenta === data[0].cuentas) {
            this.detalle = false;
            data[0].forEach(x => {
              const dataPausada = data[1].filter((y) => y.programacionequipos._id === x.programacionequipos._id);
              this.eventosCalendario(x, dataPausada);
            }
            );
          }
        } else {
          if (data[0].length > 0 && this.infoLogin.id === data[0].programacionequipos.miembros._id) {
            this.detalle = false;
            data[0].forEach(x => {
              const dataPausada = data[1].filter((y) => y.programacionequipos._id === x.programacionequipos._id);
              this.eventosCalendario(x, dataPausada);
            }
            );
          }
        }
      },
        (err) => {
          console.log(err);
        });
  }

  ngOnInit() {
    this.infoLogin = this.userService.getInfoLogin();
    this.serviceProgramacionEquipos.getProgramaEquipo_Detallado()
      .toPromise()
      .then((data: ProgramacionEquipoDetalladoModel[]) => {
        this.listaProgramacion = data;
      }
      );

    if (this.infoLogin.perfil == '5e8e2246ce7ae6c0d4926b89' || this.infoLogin.perfil == '5e8e22d0ce7ae6c0d4926b8a') {
      this.detalleActividadService.getDetalleActividad()
        .toPromise()
        .then(
          (data: any) => {
            if (data[0].length > 0) {
              this.detalle = false;
              data[0].forEach(x => {
                const dataPausada = data[1].filter((y) => y.programacionequipos._id === x.programacionequipos._id);
                this.eventosCalendario(x, dataPausada);
              }
              );
            } else {
              this.detalle = true;
            }
          }
        );
    } else {
      this.detalleActividadService.getDetalleActividadMiembros()
        .toPromise()
        .then(
          (data: any) => {
            if (data[0].length > 0) {
              this.detalle = false;
              data[0].forEach(x => {
                const dataPausada = data[1].filter((y) => y.programacionequipos._id === x.programacionequipos._id);
                this.eventosCalendario(x, dataPausada);
              }
              );
            } else {
              this.detalle = true;
            }

          }
        );

    }
    this.escucharSoket();
  }

  // ngOnDestroy() {
  //   this.detalle;
  // }

}
