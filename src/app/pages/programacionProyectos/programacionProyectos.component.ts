import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-programacionProyectos',
  templateUrl: './programacionProyectos.component.html',
  styleUrls: ['./programacionProyectos.component.css']
})
export class ProgramacionProyectosComponent implements OnInit {

  dataEquipoModal;
  isVisible = false;
  idProgramaAct;
  detalleProyecto;
  validateFormActividades: FormGroup;
  validateFormMiembros: FormGroup;
  loadingTable = true;
  visibleActividad = false;
  visibleMiembro = false;
  nombreProyecto;
  listaActividades: [];
  listaMiembros: [];
  listOfDisplayData: ProgramacionProyectoModel[];
  listaProgramacionProyectos: ProgramacionProyectoModel[];
  dataProgramacionProyecto;
  dataProgramacionEquipo;
  listaProgramacionEquipo: ProgramacionEquipoModel[];


  constructor(
    private router: Router,
    private serviceProgramacionProyectos: ProgramacionProyectoService,
    private serviceActividades: ActividadesService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private serviceMiembros: MiembrosService,
    private serviceProgramacionMiembro: ProgramacionEquipoService,
    private notification: NzNotificationService

  ) {
    this.detalleProyecto = this.router.getCurrentNavigation().extras.state;
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
      idCuenta: localStorage.getItem('infoUser'),
      idProyecto: this.detalleProyecto._id,
      tiempoReal: 0,
      presupuestoReal: 0
    };

    this.serviceProgramacionProyectos.postProgramacionProyecto(this.dataProgramacionProyecto)
      .toPromise()
      .then(
        (data: ProgramacionProyectoModel) => {
          this.listOfDisplayData = [...this.listOfDisplayData, data];
          this.listOfDisplayData = this.listOfDisplayData.filter(x => x.idProyecto === this.detalleProyecto._id)
          this.loadingTable = false;

          this.createMessage('success', 'Registro creado con exito');

          this.validateFormActividades = this.fb.group({
            idActividad: [null, [Validators.required]],
            tiempoProyectado: [null, [Validators.required]],
            presupuestoProyectado: [null, [Validators.required]],
            estado: [null, [Validators.required]],
          });
        },
        (error) => {
          console.log(error);

          this.createMessage('error', 'Opps!!! Algo salio mal');
        }
      );

  }

  submitFormMiembro(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormActividades.controls) {
      this.validateFormActividades.controls[i].markAsDirty();
      this.validateFormActividades.controls[i].updateValueAndValidity();
    }
    this.dataProgramacionEquipo = {
      ...this.validateFormMiembros.value,
      idProgramacionProyecto: this.idProgramaAct
    };

    this.serviceProgramacionMiembro.postProgramacionEquipos(this.dataProgramacionEquipo)
      .toPromise()
      .then(
        (data: ProgramacionEquipoModel) => {

          this.listaProgramacionEquipo = [...this.listaProgramacionEquipo, data];

          this.createNotification('success', 'Éxito', '¡Se agrego correctamente el equipo!');

          this.idProgramaAct = '';
          this.validateFormMiembros = this.fb.group({
            idMiembro: [null, [Validators.required]],
            estado: [null, [Validators.required]],
          });
        },
        (error) => {
          console.log(error);
          this.createNotification('error', 'Error', '¡Algo salio mal');
        }
      );

  }
  ngOnInit() {

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
          console.log(this.listaProgramacionEquipo);

        }
      );

    this.serviceMiembros.getMiembros()
      .toPromise()
      .then(
        (data: []) => {
          this.listaMiembros = data;
        }
      );

    this.serviceProgramacionProyectos.getProgramacionProyecto()
      .toPromise()
      .then(
        (data: ProgramacionProyectoModel[]) => {
          this.listaProgramacionProyectos = data;
          this.listOfDisplayData = [...this.listaProgramacionProyectos];
          this.listOfDisplayData = this.listOfDisplayData.filter(x => x.idProyecto === this.detalleProyecto._id);
          this.loadingTable = false;
        }
      );

    this.validateFormActividades = this.fb.group({
      idActividad: [null, [Validators.required]],
      tiempoProyectado: [null, [Validators.required]],
      tiempoReal: [null, [Validators.required]],
      presupuestoProyectado: [null, [Validators.required]],
      presupuestoReal: [null, [Validators.required]],
      estado: [null, [Validators.required]],
    });

    this.validateFormMiembros = this.fb.group({
      idMiembro: [null, [Validators.required]],
      estado: [null, [Validators.required]],
    });

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

  showModal(idProAct): void {

    this.dataEquipoModal = this.listaProgramacionEquipo.filter(x => x.idProgramacionProyecto === idProAct);
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
}
