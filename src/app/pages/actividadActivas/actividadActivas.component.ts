import { Component, OnInit } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
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

  actividadesActivas: DetalleActividadModel[] = [];

  constructor(
    private detalleActividadService: DetalleActividadService,

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

    // this.rellenarArreglo(this.hh, this.mm, this.ss, num);

  }

  // rellenarArreglo(hora, min, seg, num) {
  //   this.actividades[num] = { num: this.contador, hh: hora, mm: min, ss: seg };
  // }

  ngOnInit() {

    this.detalleActividadService.getAllDetalleActividadActivas()
      .toPromise()
      .then(
        (data: DetalleActividadModel[]) => {
          this.actividadesActivas = data;
          console.log(this.actividadesActivas);

          if (this.actividadesActivas.length !== 0) {

            for (let index = 0; index < this.actividadesActivas.length; index++) {
              let nombre = `${this.actividadesActivas[index].programacionequipos.miembros.nombre}
               ${this.actividadesActivas[index].programacionequipos.miembros.apellido}`;
              // console.log(nombre);

              let proyecto = this.actividadesActivas[index].programacionequipos.programacionproyecto.proyectos.nombreProyecto;
              let actividad = this.actividadesActivas[index].programacionequipos.programacionproyecto.actividades.nombre;

              let inicio = moment(this.actividadesActivas[index].inicio);
              this.timeActual = new Date();
              this.timeInicial = new Date(
                inicio.get('year'),
                inicio.get('month'),
                inicio.get('day'),
                inicio.get('hour'),
                inicio.get('minute'),
                inicio.get('second')
              );

              this.control = setInterval(() => {
                this.cronometro(inicio, index, nombre, proyecto, actividad);
                // this.rellenarArreglo(this.hh, this.mm, this.ss, index);
              }, 10);
            }

          }
        }
      );

  }

}
