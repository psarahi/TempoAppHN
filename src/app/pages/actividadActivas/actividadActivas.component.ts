import { Component, OnInit, OnDestroy } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
import { WebSocketService } from '../../Servicios/webSocket.service';
import { isEmpty } from 'ng-zorro-antd';

moment.locale('es');

interface cronometro {
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
export class ActividadActivasComponent implements OnInit {
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    margin: '1%'
  };

  sinTrabajar: boolean = true;
  acumularTime: number = 0;
  control: any;
  acumularTime2: any;
  timetest;
  timeActual;
  hh: any = '00';
  mm: any = '00';
  ss: any = '00';
  actividades: cronometro[] = [];
  actividadesActuales: any[] = [];
  contador = 0;

  constructor(
    private detalleActividadService: DetalleActividadService,
    private webSoketService: WebSocketService

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

    // console.log(this.actividades);

  }

  ngOnDestroy(): void {
    clearInterval(this.control);

  }

  ngOnInit() {

    this.detalleActividadService.getAllDetalleActividadActivas()
      .toPromise()
      .then(
        (data: any) => {
          // this.actividadesActuales = data;
          let test = data;
          //  console.log(data);

          if (test.length > 0) {
            this.actividadesEnCurso(data);
          }

        }
      );

    this.escucharSoket();

  }
  actividadesEnCurso(actividadesData: any) {
    // debugger;
    this.sinTrabajar = false;
    if (actividadesData.length === undefined) {
      this.actividadesActuales.push({ ...actividadesData });

    } else {
      this.actividadesActuales = actividadesData;

    }

    for (let index = 0; index < this.actividadesActuales.length; index++) {
      let nombre = `${this.actividadesActuales[index].programacionequipos.miembros.nombre}
       ${this.actividadesActuales[index].programacionequipos.miembros.apellido}`;

      let proyecto = this.actividadesActuales[index].programacionequipos.programacionproyecto.proyectos.nombreProyecto;
      let actividad = this.actividadesActuales[index].programacionequipos.programacionproyecto.actividades.nombre;

      let inicio = moment(this.actividadesActuales[index].inicio);
      this.timeActual = new Date();

      this.control = setInterval(() => {
        this.cronometro(inicio, index, nombre, proyecto, actividad);
      }, 10);
    }
  }

  escucharSoket() {

    this.webSoketService.listen('actividades-enCurso')
      .subscribe((data: any) => {

        this.actividadesEnCurso(data);
        console.log(this.actividades);

      },
        (err) => {
          console.log(err);

        });

  }

}
