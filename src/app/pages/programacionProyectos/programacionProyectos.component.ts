import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ProgramacionProyectoService } from '../../Servicios/programacionProyecto.service';
import { ProgramacionProyectoModel } from 'src/app/Modelos/programacionProyecto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActividadesService } from '../../Servicios/actividades.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MiembrosService } from '../../Servicios/miembros.service';
import { ProgramacionEquipoService } from '../../Servicios/programacionEquipo.service';
import { ProgramacionEquipoModel } from 'src/app/Modelos/programacionEquipo';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../Servicios/user.service';
import { RutasService } from 'src/app/Servicios/rutas.service';

import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-programacionProyectos',
  templateUrl: './programacionProyectos.component.html',
  styleUrls: ['./programacionProyectos.component.css']
})
export class ProgramacionProyectosComponent implements OnInit, OnDestroy {

  dataEquipoModal;
  isVisible = false;
  idProgramaAct;
  detalleProyecto;
  validateFormActividades: FormGroup;
  validateFormMiembros: FormGroup;
  loadingTable = true;
  visibleActividad = false;
  visibleMiembro = false;
  verMiembro = false;
  nombreProyecto;
  listaActividades: [];
  listaMiembros: [];
  listOfDisplayData: ProgramacionProyectoModel[];
  listaProgramacionProyectos: ProgramacionProyectoModel[];
  dataProgramacionProyecto;
  dataProgramacionEquipo;
  listaProgramacionEquipo: ProgramacionEquipoModel[];
  infoLogin: any;
  horasAsiganadas: number = 0;
  horasAsignables: number = 0;
  horasProyecto: number = 0;
  tiempoActividad;

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'right',
      }
    },
    legend: {
      position: 'top',
    },
    animation: {
      duration: 1000
    }
  };

  // barChartLabels: Label[] = ['Proyectado', 'Asignado', 'Trabajado'];
  barChartLabels: Label[] = ['Tiempo'];
  barChartData: ChartDataSets[] = [
    { data: [0], label: 'Proyectado' },
    { data: [0], label: 'Asignado' },
    { data: [0], label: 'Trabajado' }
  ];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];
  barChartColors = [
    {
      backgroundColor: ['#87dfd6', '#ff847c', '#ffb367'],
    },
  ];

  constructor(
    private router: Router,
    private serviceProgramacionProyectos: ProgramacionProyectoService,
    private serviceActividades: ActividadesService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private serviceMiembros: MiembrosService,
    private serviceProgramacionMiembro: ProgramacionEquipoService,
    private notification: NzNotificationService,
    private userService: UserService,
    private rutaService: RutasService

  ) {
    this.detalleProyecto = this.router.getCurrentNavigation().extras.state || this.rutaService.getInfoNavegacion;
  }

  createNotification(type: string, titulo: string, message: string): void {
    this.notification.create(
      type,
      titulo,
      message
    );
  }

  createMessage(type: string, mensaje: string): void {
    this.message.create(type, mensaje);
  }

  submitFormActividades(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormActividades.controls) {
      this.validateFormActividades.controls[i].markAsDirty();
      this.validateFormActividades.controls[i].updateValueAndValidity();
    }

    this.dataProgramacionProyecto = {
      ...this.validateFormActividades.value,
      cuentas: this.infoLogin.idCuenta,
      proyectos: this.detalleProyecto._id,
      tiempoReal: 0,
      presupuestoReal: 0
    };

    this.serviceProgramacionProyectos.postProgramacionProyecto(this.dataProgramacionProyecto)
      .toPromise()
      .then(
        (data: ProgramacionProyectoModel) => {
          this.listOfDisplayData = [...this.listOfDisplayData, data];
          this.listOfDisplayData = this.listOfDisplayData.filter(x => x.proyectos === this.detalleProyecto._id);
          this.loadingTable = false;

          this.horasAsignables -= this.validateFormActividades.value.tiempoProyectado;
          this.horasAsiganadas += this.validateFormActividades.value.tiempoProyectado;
          this.barChartData = [
            { data: [this.detalleProyecto.tiempoProyectadoPro], label: 'Proyectado' },
            { data: [this.horasAsiganadas], label: 'Asiganado' },
            { data: [this.detalleProyecto.tiempoRealPro], label: 'Trabajado' }
          ];
          this.createMessage('success', 'Registro creado con exito');

          this.validateFormActividades = this.fb.group({
            actividades: [null, [Validators.required]],
            tiempoProyectado: [null, [Validators.required]],
            presupuestoProyectado: [null, [Validators.required]],
            estado: [true, [Validators.required]],
          });
        },
        (error) => {
          this.validateFormActividades = this.fb.group({
            actividades: [null, [Validators.required]],
            tiempoProyectado: [null, [Validators.required]],
            tiempoReal: [null, [Validators.required]],
            presupuestoProyectado: [null, [Validators.required]],
            presupuestoReal: [null, [Validators.required]],
            estado: [true, [Validators.required]],
          });
          console.log(error);

          this.createMessage('error', 'Opps!!! Algo salio mal');
        }
      );

  }

  submitFormMiembro(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormMiembros.controls) {
      this.validateFormMiembros.controls[i].markAsDirty();
      this.validateFormMiembros.controls[i].updateValueAndValidity();
    }
    this.dataProgramacionEquipo = {
      ...this.validateFormMiembros.value,
      programacionproyecto: this.idProgramaAct
    };

    this.serviceProgramacionMiembro.postProgramacionEquipos(this.dataProgramacionEquipo)
      .toPromise()
      .then(
        (data: ProgramacionEquipoModel) => {

          this.listaProgramacionEquipo = [...this.listaProgramacionEquipo, data];

          this.createNotification('success', 'Éxito', '¡Se agrego correctamente el equipo!');

          this.idProgramaAct = '';
          this.validateFormMiembros = this.fb.group({
            miembros: [null, [Validators.required]],
            estado: [true, [Validators.required]],
          });
        },
        (error) => {
          this.validateFormMiembros = this.fb.group({
            miembros: [null, [Validators.required]],
            estado: [true, [Validators.required]],
          });
          console.log(error);
          this.createNotification('error', 'Error', '¡Algo salio mal');
        }
      );

  }

  openActividad(): void {
    this.visibleActividad = true;
  }

  closeActividad(): void {
    this.visibleActividad = false;
  }

  openMiembro(idProAct): void {
    this.idProgramaAct = idProAct;
    this.visibleMiembro = true;
  }

  closeMiembro(): void {
    this.visibleMiembro = false;
  }

  operVerMiembros(idProAct) {
    this.verMiembro = true;
    this.dataEquipoModal = this.listaProgramacionEquipo.filter(x => x.programacionproyecto === idProAct);

  }

  closeVerMiembro() {
    this.verMiembro = false;
  }

  showModal(idProAct): void {

    this.dataEquipoModal = this.listaProgramacionEquipo.filter(x => x.programacionproyecto === idProAct);
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  ngOnDestroy() {
    this.rutaService.destroyInfo();
  }

  async ngOnInit() {
    // (this.detalleProyecto == undefined) ? this.rutaService.getInfoNavegacion() : this.detalleProyecto;
    this.detalleProyecto = this.rutaService.getInfoNavegacion();
    this.infoLogin = this.userService.getInfoLogin();

    this.serviceProgramacionProyectos.getProgramacionProyecto(this.infoLogin.idCuenta, this.detalleProyecto._id)
      .toPromise()
      .then(
        (data: ProgramacionProyectoModel[]) => {

          if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              this.horasAsiganadas += data[index].tiempoProyectado;
            }
          } else {
            this.horasAsiganadas = 0;
          }
          //  this.horasProyecto = this.detalleProyecto.tiempoProyectadoPro;
          this.horasAsignables = this.detalleProyecto.tiempoProyectadoPro - this.horasAsiganadas;

          this.barChartData = [
            { data: [this.detalleProyecto.tiempoProyectadoPro], label: 'Proyectado' },
            { data: [this.horasAsiganadas], label: 'Asiganado' },
            { data: [this.detalleProyecto.tiempoRealPro], label: 'Trabajado' }
          ];

          this.listaProgramacionProyectos = data;
          this.listOfDisplayData = [...this.listaProgramacionProyectos];
          this.loadingTable = false;
        }
      );


    this.serviceActividades.getActividades()
      .toPromise()
      .then(
        (data: []) => {
          this.listaActividades = data;
        }
      );

    this.serviceProgramacionMiembro.getProgramacionEquipos()
      .toPromise()
      .then(
        (data: ProgramacionEquipoModel[]) => {
          this.listaProgramacionEquipo = [...data];
        }
      );

    this.serviceMiembros.getMiembros()
      .toPromise()
      .then(
        (data: []) => {
          this.listaMiembros = data;
        }
      );

    this.validateFormActividades = this.fb.group({
      actividades: [null, [Validators.required]],
      tiempoProyectado: [null, [Validators.required]],
      tiempoReal: [null, [Validators.required]],
      presupuestoProyectado: [null, [Validators.required]],
      presupuestoReal: [null, [Validators.required]],
      estado: [true, [Validators.required]],
    });

    this.validateFormMiembros = this.fb.group({
      miembros: [null, [Validators.required]],
      estado: [true, [Validators.required]],
    });

  }

}