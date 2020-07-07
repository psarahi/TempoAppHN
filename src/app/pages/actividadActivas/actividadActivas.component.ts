import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
import { WebSocketService } from '../../Servicios/webSocket.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../Servicios/user.service';

moment.locale('es');

interface Cronometro {
  hh: number;
  mm: number;
  ss: number;
  inicio: any;
  fin: any;
  miembro: string;
  proyecto: string;
  actividad: string;
  descripcion: string;
  estado: string;
  typeAlert: string;
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

  infoLogin: any;
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
      'Actividades actualizadas',
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
    private userService: UserService,
    private message: NzMessageService,
    private notification: NzNotificationService

  ) { }

  cronometro(inicio, fin, num, miembro, proyecto, actividad, descripcion, estado, typeAlert) {
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
      fin: moment(fin).format('HH:mm'),
      miembro,
      proyecto,
      actividad,
      descripcion,
      estado,
      typeAlert
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
      const nombre = `${this.actividadesActuales[index].programacionequipos.miembros.nombre}
       ${this.actividadesActuales[index].programacionequipos.miembros.apellido}`;

      const proyecto = this.actividadesActuales[index].programacionequipos.programacionproyecto.proyectos.nombreProyecto;
      const actividad = this.actividadesActuales[index].programacionequipos.programacionproyecto.actividades.nombre;
      const descripcion = this.actividadesActuales[index].descripcion;
      const estado = this.actividadesActuales[index].estado.nombre;
      const inicio = moment(this.actividadesActuales[index].inicio);
      const fin = this.actividadesActuales[index].fin;
      this.timeActual = new Date();
      const typeAlert = (this.actividadesActuales[index].estado._id === '5f00e4c38c10d277700bcfa0') ? 'success' : 'warning';
      this.control[index] = (setInterval(() => {
        this.cronometro(inicio, fin, index, nombre, proyecto, actividad, descripcion, estado, typeAlert);
      }, 1000)
      );
    }
  }

  escucharSoket() {
    this.webSoketService.listen('actividades-enCurso')
      .subscribe((data: any[]) => {

        if (data[1] == this.infoLogin.idCuenta) {
          this.actividadesEnCurso(data[0]);
        }
      },
        (err) => {
          console.log(err);
        });


    this.webSoketService.listen('actividades-actualizada')
      .subscribe((data: any[]) => {

        const actividadesActualizadas: any[] = [];

        if (data[2] == this.infoLogin.idCuenta) {
          actividadesActualizadas.push(data[1]);
          console.log(actividadesActualizadas.length);
          switch (data[3]) {
            case '5f00e4c38c10d277700bcfa0': {
              this.accionActividad(
                actividadesActualizadas,
                'retomado'
              );
              this.actividadesEnCurso(data[0]);
              break;
            }
            case '5f00e4e58c10d277700bcfa2': {
              this.accionActividad(
                actividadesActualizadas,
                'pausado'
              );
              this.actividadesEnCurso(data[0]);
              break;
            }
            case '5f00e4f88c10d277700bcfa3': {
              this.accionActividad(
                actividadesActualizadas,
                'finalizado'
              );
              this.actividadesEnCurso(data[0]);
              break;
            }
            default:
              break;
          }
        }

      },
        (err) => {
          console.log(err);
        });
  }

  accionActividad(actActualizada, accion) {
    let message = '';
    // tslint:disable-next-line: prefer-for-of
    for (let x = 0; x < actActualizada.length; x++) {
      const nombre = `${actActualizada[x].programacionequipos.miembros.nombre}
      ${actActualizada[x].programacionequipos.miembros.apellido}`;

      message = `${nombre} a ${accion} su actividad`;

      this.createBasicNotification(message);
      // this.createBasicMessage('success', message);
    }
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
    this.infoLogin = this.userService.getInfoLogin();

    this.detalleActividadService.getAllDetalleActividadActivasCuenta()
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
