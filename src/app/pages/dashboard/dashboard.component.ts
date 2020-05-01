import { Component, OnInit } from '@angular/core';
import { ProgramacionEquipoDetalladoModel } from './../../Modelos/programacionEquipo';
import { ProgramacionEquipoService } from '../../Servicios/programacionEquipo.service';
import * as moment from 'moment';
moment().utcOffset(-420);
moment.locale('es');

import * as goldenColors from 'golden-colors';
import esLocale from '@fullcalendar/core/locales/es-us';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleActividadModel } from 'src/app/Modelos/detalleActividad';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { UserService } from '../../Servicios/user.service';


interface Event {
  id: number;
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

  programacionequipos: string = '';
  descripcion: string = '';
  inicio: any;
  fin: any;
  infoLogin: any;
  time: Date | null = null;
  //defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  detalleActividades: DetalleActividadModel[];
  dataDetalleActividades;

  // validateForm: FormGroup;

  // submitForm(): void {
  //   // tslint:disable-next-line: forin
  //   for (const i in this.validateForm.controls) {
  //     this.validateForm.controls[i].markAsDirty();
  //     this.validateForm.controls[i].updateValueAndValidity();
  //   }
  // }

  constructor(
    private detalleActividadService: DetalleActividadService,
    // private fb: FormBuilder,
    private serviceProgramacionEquipos: ProgramacionEquipoService,
    private userService: UserService

    // private datePipe: DatePipe
  ) { }


  handleEventClick(arg): void {
    this.visible = true;
    this.duracion = arg.event.title;
    this.inicioDetalle = moment(arg.event.start).format('HH:mm:ss');
    this.finDetalle = moment(arg.event.end).format('HH:mm:ss');
    this.descripcionDetalle = arg.event.extendedProps.descripcion;
    this.detalleProyecto = arg.event.extendedProps.nombreProyecto;
    this.detalleActividad = arg.event.extendedProps.nombreAct;

    console.log(arg);

  }

  close() {
    this.visible = false;
  }

  guardar() {

    this.dataDetalleActividad = {
      inicio: this.inicio,
      fin: this.fin,
      fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: this.programacionequipos,
      descripcion: this.descripcion,
      costo: 0,
      estado: true
    };

    console.log(this.dataDetalleActividad);
    

    this.detalleActividadService.postDetalleActividad(this.dataDetalleActividad)
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          console.log(data);

        },
        (error) => {
          console.log(error);

          // this.createMessage('error', 'Opps!!! Algo salio mal');
        }

    );

  }

  start() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = true;
    this.btnResumen = false;

    this.dataDetalleActividad = {

      estado: true,

    }

    console.log(this.programacionequipos);

    // this.detalleActividadService.postDetalleActividad('')
    //   .toPromise()
    //   .then(

    //   );

    if (this.isMarch === false) {
      this.timeInicial = new Date();
      this.control = setInterval(this.cronometro.bind(this), 1000);
      this.isMarch = true;
    }
  }

  cronometro() {
    this.timeActual = new Date();
    this.acumularTime = this.timeActual - this.timeInicial;
    this.acumularTime2 = new Date();
    this.acumularTime2.setTime(this.acumularTime);

    // this.cc = Math.round(this.acumularTime2.getMilliseconds() / 10);
    this.ss = this.acumularTime2.getSeconds();
    this.mm = this.acumularTime2.getMinutes();
    this.hh = this.acumularTime2.getHours() - 18;
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

    if (this.isMarch === true) {
      clearInterval(this.control);
      this.isMarch = false;
    }
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
  ngOnInit() {
    this.up = false;
    this.down = true;

    this.modoManual = false;
    this.modoReloj = true;

    this.btnResumen = false;
    this.btnPause = false;
    this.btnStop = false;
    this.btnStart = true;
    this.infoLogin = this.userService.getInfoLogin();

    // this.validateForm = this.fb.group({
    //   programacionequipos: [null, [Validators.required]]
    // });

    this.serviceProgramacionEquipos.getProgramaEquipo_Detallado()
      .toPromise()
      .then((data: ProgramacionEquipoDetalladoModel[]) => {
        this.listaProgramacion = data;
        console.log(this.listaProgramacion);
      }

      );

    this.detalleActividadService.getAllDetalleActividad()
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          let inicio;
          let fin;
          let dif;
          let id = 1;
          data.forEach(x => {
            inicio = moment([
              moment(x.inicio).get('year'),
              moment(x.inicio).get('month'),
              moment(x.inicio).get('day'),
              moment(x.inicio).get('hour'),
              moment(x.inicio).get('minute'),
              moment(x.inicio).get('second')
            ]);

            fin = moment([
              moment(x.fin).get('year'),
              moment(x.fin).get('month'),
              moment(x.fin).get('day'),
              moment(x.fin).get('hour'),
              moment(x.fin).get('minute'),
              moment(x.fin).get('second')
            ]);

            dif = fin.diff(inicio, 'minutes');

            this.calendarEvents = [...this.calendarEvents, {
              id,
              title: `${dif} minutos`,
              // date: moment(x.fecha).format('YYYY-MM-DD'),
              start: moment(x.inicio).format('YYYY-MM-DD HH:mm:ss'),
              end: moment(x.fin).format('YYYY-MM-DD HH:mm:ss'),
              allDay: false,
              color: goldenColors.getHsvGolden(0.5, 0.95),
              descripcion: x.descripcion,
              nombreProyecto: x.programacionequipos.programacionproyecto.proyectos.nombreProyecto,
              nombreAct: x.programacionequipos.programacionproyecto.actividades.nombre

            }];
            id++;
          }
          );

          this.detalleActividades = data;

        }
      );

  }

}
