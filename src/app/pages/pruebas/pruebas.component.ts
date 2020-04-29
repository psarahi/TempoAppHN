import { timer } from 'rxjs';
import { LoginService } from '../../Servicios/login.service';
import { CuentaService } from '../../Servicios/cuenta.service';
import { CuentaModel } from 'src/app/Modelos/cuenta';

import * as moment from 'moment';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DetalleActividadModel } from 'src/app/Modelos/detalleActividad';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
// import { DatePipe } from '@angular/common';

moment().utcOffset(-420);
moment.locale('es');

interface ItemData {
  gender: string;
  name: Name;
  email: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}


interface event {
  title: string;
  date: any;
  start: any;
  end: any;
  allDay: boolean;
}

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css'],
})
export class PruebasComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarEvents: event[] = [];

  btnStart: boolean;
  btnStop: boolean;
  btnResumen: boolean;
  btnPause: boolean;

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
  test22: any;
  // cc: any = '00';

  detalleActividades: DetalleActividadModel[];

  //ds = new MyDataSource(this.http);

  loading = false;
  data = [
  ];

  listDataMap = {
    eight: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' }
    ],
    ten: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
      { type: 'error', content: 'This is error event.' }
    ],
    eleven: [
      { type: 'warning', content: 'This is warning event' },
      { type: 'success', content: 'This is very long usual event........' },
      { type: 'error', content: 'This is error event 1.' },
      { type: 'error', content: 'This is error event 2.' },
      { type: 'error', content: 'This is error event 3.' },
      { type: 'error', content: 'This is error event 4.' }
    ]
  };

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }

  constructor(
    private detalleActividadService: DetalleActividadService,
    private http: HttpClient,
    // private datePipe: DatePipe
  ) {
  }


  change(): void {
    this.loading = true;
    if (this.data.length > 0) {
      setTimeout(() => {
        this.data = [];
        this.loading = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.data = [
          {
            title: 'Ant Design Title 1'
          },
          {
            title: 'Ant Design Title 2'
          },
          {
            title: 'Ant Design Title 3'
          },
          {
            title: 'Ant Design Title 4'
          }
        ];
        this.loading = false;
      }, 1000);
    }
  }

  handleEventClick(arg) { // handler method
    console.log(arg.event.title);

  }

  ngOnInit() {
    this.btnResumen = false;
    this.btnPause = false;
    this.btnStop = false;
    this.btnStart = true;
    // console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    // let a = moment([moment().get('year'), moment().get('month'), moment().get('day'), 
    // moment().get('hour'), moment().get('minute'), moment().get('second')]);
    // // let b = moment([moment().get('year'), moment().get('month'), moment().get('day'),
    //  moment().get('hour'), moment().get('minute'), moment().get('second')]);
    // let dif = b.diff(a, 'second');
    // console.log(dif);

    // this.timetest = moment([
    //   moment().get('year'),
    //   moment().get('month'),
    //   moment().get('day'),
    //   moment().get('hour'),
    //   moment().get('minute'),
    //   moment().get('second')]);
    // this.serviceCuenta.getCuenta().toPromise()
    //   .then((data: CuentaModel[]) => {

    //     this.test22 = moment(data[0].fechaRegistro).format('YYYY MM DD HH:mm:ss');

    //     // let a = moment([
    //     //   moment(time1).get('year'),
    //     //   moment(time1).get('month'),
    //     //   moment(time1).get('day'),
    //     //   moment(data[0].fechaRegistro).get('hour'),
    //     //   moment(data[0].fechaRegistro).get('minute'),
    //     //   moment(data[0].fechaRegistro).get('second')]);
    //     console.log(this.test22);

    //   });

    // this.detalleActividadService.getDetalleActividadMiembros()
    //   .toPromise()
    //   .then(
    //     (data) => {
    //       console.log(data);

    //     }
    //   );

    this.detalleActividadService.getAllDetalleActividad()
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          let inicio;
          let fin;
          let dif;

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

            // this.calendarEvents = [...this.calendarEvents, {
            //   title: `${dif} minutos`,
            //   date: moment(x.fecha).add(6, 'hour').format('YYYY-MM-DD'),
            //   start: moment(x.inicio).add(6, 'hour').format('YYYY-MM-DD hh:mm:ss'),
            //   end:  moment(x.fin).add(6, 'hour').format('YYYY-MM-DD hh:mm:ss'),
            //   // date: x.fecha,
            //   // start: x.inicio,
            //   // end: x.fin,
            //   allDay: false
            // }];

          }
          );
          this.calendarEvents = [
            {
              date: '2020-04-28', title: 'Hola', start: '2020-04-28T18:30:00.000Z', end: '2020-04-28T19:00:00.000Z', allDay: false
            }];
          console.log(this.calendarEvents);
          this.detalleActividades = data;
          console.log(this.detalleActividades);

        }
      );

  }

  start() {
    this.btnStart = false;
    this.btnStop = true;
    this.btnPause = true;
    this.btnResumen = false;
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
    this.btnStart = false;
    this.btnStop = false;
    this.btnPause = true;
    this.btnResumen = false;
    if (this.isMarch === true) {
      clearInterval(this.control);
      this.isMarch = false;
    }
  }

  resume() {
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

}


