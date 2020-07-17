import { Component, OnInit } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';

@Component({
  selector: 'app-reporteDiarioAdmin',
  templateUrl: './reporteDiarioAdmin.component.html',
  styleUrls: ['./reporteDiarioAdmin.component.css']
})
export class ReporteDiarioAdminComponent implements OnInit {
  tiempoProyectado: number = 0;
  tiempoMuerto: number = 0;
  tiempoTotal: number = 0;
  actividadesFinalizadas: DetalleActividadModel[] = [];
  actividadesPausadas: DetalleActividadModel[] = [];
  dataSource: any;
  selectedSlice = 'none';
  chart: any;
  grafico: boolean = false;

  constructor(
    private detalleActividadService: DetalleActividadService
  ) { }

  ngOnInit() {
    if (this.dataSource !== undefined) { this.dataSource.dispose(); }
    this.detalleActividadService.getDetalleReporteDiarioAdmin()
      .toPromise()
      .then((data) => {
        console.log(data);
        this.actividadesFinalizadas = data[0];
        this.actividadesPausadas = data[1];
        this.actividadesFinalizadas.forEach(element => {
          this.tiempoProyectado += element.programacionequipos.programacionproyecto.tiempoProyectado;
          this.tiempoMuerto += element.programacionequipos.programacionproyecto.tiempoMuerto;
          this.tiempoTotal += element.programacionequipos.programacionproyecto.tiempoReal;

        });

        this.dataSource = {
          'chart': {
            'caption': 'Tiempos productivos en el día',
            // 'plottooltext': '<b>$percentValue</b> of web servers run on $label servers',
            'showLegend': '1',
            'showPercentValues': '1',
            'legendPosition': 'bottom',
            'useDataPlotColorForLabels': '1',
            'defaultCenterLabel': `Total Hrs ${this.tiempoTotal}`,
            'enablemultislicing': '0',
            'showlegend': '0',
            'theme': 'fusion',
          },
          'data': [{
            'label': 'PRODUCTIVO',
            'value': this.tiempoTotal - this.tiempoMuerto
          }, {
            'label': 'IMPRODUCTIVO',
            'value': this.tiempoMuerto
          }]
        };
        this.grafico = true;
      });
  }

}
