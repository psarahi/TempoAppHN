import { Component, OnInit } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
moment.locale('es');
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

  actividadesActivas: DetalleActividadModel[] = [];

  constructor(
    private detalleActividadService: DetalleActividadService,

  ) { }

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

  ngOnInit() {

    this.detalleActividadService.getAllDetalleActividadActivas()
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          this.actividadesActivas = data;

          if (this.actividadesActivas.length !== 0) {
            let inicio = moment(this.actividadesActivas[0].inicio).add(6, 'hour');
            this.timeActual = new Date();
            this.timeInicial = new Date(
              inicio.get('year'),
              inicio.get('month'),
              inicio.get('day'),
              inicio.get('hour'),
              inicio.get('minute'),
              inicio.get('second')
            );
            console.log(data);
            this.acumularTime = this.timeActual - this.timeInicial;

            let timeActu2;
            let acumularResume;
            // if (this.isMarch == false) {
            timeActu2 = new Date();
            timeActu2 = timeActu2.getTime();
            acumularResume = timeActu2 - this.acumularTime;

            this.timeInicial.setTime(acumularResume);
            this.control = setInterval(this.cronometro.bind(this), 10);
            this.isMarch = true;
            // }
          }

        }
      );

  }

}
