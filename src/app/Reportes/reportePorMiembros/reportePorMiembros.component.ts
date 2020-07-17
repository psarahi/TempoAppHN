import { Component, OnInit } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';

interface category {
  label: string;
}
interface data {
  value: number;
}

@Component({
  selector: 'app-reportePorMiembros',
  templateUrl: './reportePorMiembros.component.html',
  styleUrls: ['./reportePorMiembros.component.css']
})

export class ReportePorMiembrosComponent implements OnInit {
  dataSource: any;
  grafico: boolean = false;
  tiempoProyectado: data[] = [];
  tiempoMuerto: data[] = [];
  tiempoTotal: data[] = [];
  tiempoProductivo: data[] = [];
  actividadesFinalizadas: DetalleActividadModel[] = [];
  actividadesPausadas: DetalleActividadModel[] = [];
  miembros: category[] = [];
  arrayTempo;
  tiempoProyectadoTempo: number = 0;
  tiempoTotalTempo: number = 0;
  tiempoMuertoTempo: number = 0;
  cont: number = 0;
  cont2: number = 0;
  constructor(
    private detalleActividadService: DetalleActividadService

  ) { }

  ngOnInit() {
    this.detalleActividadService.getDetalleReporteDiarioAdmin()
      .toPromise()
      .then((data) => {
        console.log(data);

        this.actividadesFinalizadas = data[0];
        this.actividadesPausadas = data[1];

        this.actividadesFinalizadas.forEach(element => {
          // tslint:disable-next-line: max-line-length
          if (!this.miembros.find(x => x.label === `${element.programacionequipos.miembros.nombre} ${element.programacionequipos.miembros.apellido}`)) {

            const { nombre, apellido } = element.programacionequipos.miembros;
            this.miembros[this.cont] = {
              label: `${nombre} ${apellido}`
            };
            this.cont++;
          }


        });

        this.miembros.forEach(element => {
          this.tiempoProyectadoTempo = 0;
          this.tiempoTotalTempo = 0;
          this.tiempoMuertoTempo = 0;
          // tslint:disable-next-line: max-line-length
          this.arrayTempo = this.actividadesFinalizadas.filter(x => `${x.programacionequipos.miembros.nombre} ${x.programacionequipos.miembros.apellido}` === element.label);
          this.arrayTempo.forEach(y => {

            this.tiempoProyectadoTempo += y.programacionequipos.programacionproyecto.tiempoProyectado;
            this.tiempoTotalTempo += y.programacionequipos.programacionproyecto.tiempoReal;
            this.tiempoMuertoTempo += y.programacionequipos.programacionproyecto.tiempoMuerto;

          });

          this.tiempoProyectado[this.cont2] = {
            value: this.tiempoProyectadoTempo
          };

          this.tiempoTotal[this.cont2] = {
            value: this.tiempoTotalTempo
          };

          this.tiempoProductivo[this.cont2] = {
            value: this.tiempoTotalTempo - this.tiempoMuertoTempo
          };

          this.tiempoMuerto[this.cont2] = {
            value: this.tiempoMuertoTempo
          };
          this.cont2++;
        });

      });

    this.dataSource = {
      'chart': {
        'caption': 'Detalle de tiempo por miembro',
        'xAxisname': 'Detalle',
        'yAxisName': 'Horas',
        'numberPrefix': ' hrs',
        'plotFillAlpha': '80',
        'theme': 'fusion'
      },
      'categories': [
        {
          'category': this.miembros
        }
      ],
      'dataset': [
        {
          'seriesname': 'PROYECTADO',
          'data': this.tiempoProyectado
        },
        {
          'seriesname': 'REGISTRADO',
          'data': this.tiempoTotal
        },
        {
          'seriesname': 'PRODUCTIVO',
          'data': this.tiempoProductivo
        },
        {
          'seriesname': 'IMPRODUCTIVO',
          'data': this.tiempoMuerto
        }
      ]
    };

    this.grafico = true;

  }

}
