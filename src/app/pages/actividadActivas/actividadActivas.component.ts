import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
import { WebSocketService } from '../../Servicios/webSocket.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

moment.locale('es');

interface Cronometro {
  hh: number;
  mm: number;
  ss: number;
  inicio: any;
  miembro: string;
  proyecto: string;
  actividad: string;
  // descripcion: string;
}

@Component({
  selector: 'app-actividadActivas',
  templateUrl: './actividadActivas.component.html',
  styleUrls: ['./actividadActivas.component.css']
})
export class ActividadActivasComponent implements OnInit, OnDestroy {
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    margin: '1%'
  };

  sinTrabajar: boolean;
  acumularTime: number = 0;
  control: any[] = [];
  acumularTime2: any;
  timetest;
  timeActual;
  hh: any = '00';
  mm: any = '00';
  ss: any = '00';
  actividades: Cronometro[] = [];
  actividadesActuales: DetalleActividadModel[] = [];
  actividadesSocket;
  contador = 0;

  createBasicMessage(type, message): void {
    this.message.create(type, message);
  }

  createBasicNotification(message): void {
    this.notification.blank(
      'Actividades culminadas',
      message,
      {
        nzStyle: {
          width: '400px',
          marginLeft: '-20px'
        },
        nzClass: 'test-class'
      }
    );
  }

  constructor(
    private detalleActividadService: DetalleActividadService,
    private webSoketService: WebSocketService,
    private message: NzMessageService,
    private notification: NzNotificationService

  ) { }

  cronometro(inicio, num, miembro, proyecto, actividad) {
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

    this.actividades[num] = {
      hh: this.hh,
      mm: this.mm,
      ss: this.ss,
      inicio: moment(inicio).format('LLL'),
      miembro,
      proyecto,
      actividad
    };

  }

  actividadesEnCurso(actividadesData: DetalleActividadModel[]) {

    this.limpiarSetInterval();
    this.actividadesActuales = [];
    this.control = [];
    this.actividades = [];

    this.sinTrabajar = (actividadesData.length <= 0) ? true : false;

    this.actividadesActuales = actividadesData;

    for (let index = 0; index < this.actividadesActuales.length; index++) {
      let nombre = `${this.actividadesActuales[index].programacionequipos.miembros.nombre}
       ${this.actividadesActuales[index].programacionequipos.miembros.apellido}`;

      let proyecto = this.actividadesActuales[index].programacionequipos.programacionproyecto.proyectos.nombreProyecto;
      let actividad = this.actividadesActuales[index].programacionequipos.programacionproyecto.actividades.nombre;

      let inicio = moment(this.actividadesActuales[index].inicio);
      this.timeActual = new Date();
      // console.log(index);

      this.control[index] = (setInterval(() => {
        this.cronometro(inicio, index, nombre, proyecto, actividad);
      }, 1000)
      );
    }
  }

  escucharSoket() {
    this.webSoketService.listen('actividades-enCurso')
      .subscribe((data: DetalleActividadModel[]) => {
        this.actividadesEnCurso(data);
      },
        (err) => {
          console.log(err);
        });

    this.webSoketService.listen('actividades-terminada')
      .subscribe((data: any[]) => {

        let actividadesFinalizadas: any[] = [];
        let message = '';
        actividadesFinalizadas.push(data[1]);

        console.log(actividadesFinalizadas.length);

        // debugger;
        for (let x = 0; x < actividadesFinalizadas.length; x++) {
          let nombre = `${data[1].programacionequipos.miembros.nombre}
          ${data[1].programacionequipos.miembros.apellido}`;

          message = `${nombre} a terminado su actividad`;

          this.createBasicNotification(message);
          // this.createBasicMessage('success', message);
        }

        this.actividadesEnCurso(data[0]);



      },
        (err) => {
          console.log(err);
        });
  }

  limpiarSetInterval() {
    for (const iterator of this.control) {
      clearInterval(iterator);
    }
  }

  ngOnDestroy(): void {

    this.limpiarSetInterval();
  }

  ngOnInit() {

    this.detalleActividadService.getAllDetalleActividadActivas()
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          this.sinTrabajar = (data.length <= 0) ? true : false;

          if (data.length > 0) {
            this.actividadesEnCurso(data);
          }

        }
      );

    this.escucharSoket();

  }


}
