import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { DetalleActividadService } from '../../Servicios/detalleActividad.service';
import { DetalleActividadModel } from '../../Modelos/detalleActividad';
import * as moment from 'moment';
import { WebSocketService } from '../../Servicios/webSocket.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../Servicios/user.service';
import { ProgramacionEquipoDetalladoModel } from '../../Modelos/programacionEquipo';
import swal from 'sweetalert';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProgramacionEquipoService } from '../../Servicios/programacionEquipo.service';

moment.locale('es');

interface Cronometro {
  id: string;
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
  programacion: string;
  control: boolean;
  abandono: boolean;
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

  trabajando: boolean = false;
  up: boolean = false;
  down: boolean = true;
  validateForm: FormGroup;
  isVisibleTime = false;
  infoLogin: any;
  sinTrabajar: boolean;
  perfilCambio: boolean;
  acumularTime: number = 0;
  control: any[] = [];
  cronTemp;
  acumularTime2: any;
  timeActual;
  programacionequipos: string = '';
  listaProgramacion: ProgramacionEquipoDetalladoModel[] = [];
  hh: any = '00';
  mm: any = '00';
  ss: any = '00';
  timeInicial;
  isMarch: boolean = false;
  btnStop: boolean;
  btnResumen: boolean;
  btnPause: boolean;
  actividades: Cronometro[] = [];
  actividadesActuales: DetalleActividadModel[] = [];
  pausa;
  empezo;

  actividadActiva: DetalleActividadModel;
  actividadPausada: DetalleActividadModel;

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
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private serviceProgramacionEquipos: ProgramacionEquipoService,

  ) { }

  cronometro(id, inicio, fin, num, miembro, proyecto, actividad, descripcion, estado, typeAlert, programacion, control, abandono) {
    const timeActual: any = new Date();
    let acumularTime: any;
    let acumularTime2: any;
    acumularTime = timeActual - inicio;
    acumularTime2 = new Date();
    acumularTime2.setTime(acumularTime);

    let hh: any;
    let mm: any;
    let ss: any;

    ss = acumularTime2.getSeconds();
    mm = acumularTime2.getMinutes();
    hh = acumularTime2.getHours() - 18;

    if (ss < 10) { ss = '0' + ss; }
    if (mm < 10) { mm = '0' + mm; }
    if (hh < 10) { hh = '0' + hh; }

    this.actividades[num] = {
      id,
      hh,
      mm,
      ss,
      inicio: `Empezo a las ${moment(inicio).format('HH:mm')}`,
      fin: `Pausada a las ${moment(fin).format('HH:mm')}`,
      miembro,
      proyecto,
      actividad,
      descripcion,
      estado,
      typeAlert,
      programacion,
      control,
      abandono
    };
  }

  cronometroActividad(inicio) {
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
  }

  submitForm(
    value: { programacionequipos: string; descripcion: string }): void {
    // tslint:disable-next-line: forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }


  postActividad(inicio, fin, programacionEquipo, descripcion, estado, accion) {

    const dataDetalleActividad = {
      inicio: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
      fin: moment(fin).format('YYYY-MM-DD HH:mm:ss'),
      fecha: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: programacionEquipo,
      descripcion,
      estado
    };

    if (accion === 'curso') {
      this.detalleActividadService.postDetalleActividad(dataDetalleActividad)
        .toPromise()
        .then(
          (data: DetalleActividadModel) => {
            this.actividadActiva = data;
          },
          (error) => {
            console.log(error);
            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    } else {
      this.detalleActividadService.postDetalleActividad(dataDetalleActividad)
        .toPromise()
        .then(
          (data: DetalleActividadModel) => {
            this.actividadPausada = data;
            this.pausa = `Pausada a las ${moment(this.actividadPausada.inicio).format('HH:mm a')} `;
          },
          (error) => {
            console.log(error);
            // this.createMessage('error', 'Opps!!! Algo salio mal');
          }
        );
    }
  }

  putActividad(inicio, fin, programacionEquipo, descripcion, estado, id, accion) {

    const dataDetalleActividad = {
      inicio: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
      fin: moment(fin).format('YYYY-MM-DD HH:mm:ss'),
      fecha: moment(fin).format('YYYY-MM-DD HH:mm:ss'),
      cuentas: this.infoLogin.idCuenta,
      programacionequipos: programacionEquipo,
      descripcion,
      estado
    };

    switch (accion) {
      case 'stop': {
        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => {
            this.serviceProgramacionEquipos.getProgramaEquipo_DetalladoActivo()
              .toPromise()
              .then((data: ProgramacionEquipoDetalladoModel[]) => {
                this.listaProgramacion = data;
              }
              );
            swal({
              title: '¡Actividad finalizada!',
              icon: 'success',
            });

            this.btnStop = false;
            this.btnPause = false;
            this.btnResumen = false;
            this.isVisibleTime = false;
            this.pausa = '';
            this.empezo = '';
            this.reset();
          }
          );
        break;
      }
      case 'pause': {

        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => {
            this.validateForm = this.fb.group({
              programacionequipos: [data.programacionequipos, [Validators.required]],
              descripcion: [null, [Validators.required]],
            });
          }        );
        break;
      }
      case 'resumenA': {
        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => { }     );
        break;
      }
      case 'resumenP': {

        this.detalleActividadService.putDetalleActividad(id, dataDetalleActividad)
          .toPromise()
          .then((data: DetalleActividadModel) => {

          }
          );

        break;
      }
      default:
        break;
    }
  }

  stop() {
    this.putActividad(
      this.actividadActiva[0].inicio,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      this.actividadActiva[0].programacionequipos._id,
      `${this.actividadActiva[0].descripcion}, ${this.validateForm.value.descripcion}`,
      '5f00e4f88c10d277700bcfa3',
      this.actividadActiva[0]._id,
      'stop'
    );

    if (this.actividadPausada[0]) {
      this.putActividad(
        this.actividadPausada[0].inicio,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        this.actividadPausada[0].programacionequipos._id,
        this.actividadPausada[0].descripcion,
        '5f03ce10fbd6f3df7d7251b2',
        this.actividadPausada[0]._id,
        'resumenP'
      );
    }
  }

  pause() {
    this.btnStop = true;
    this.btnPause = false;
    this.btnResumen = true;

    this.postActividad(
      new Date(),
      new Date(),
      this.validateForm.value.programacionequipos,
      this.validateForm.value.descripcion,
      '5f03ce10fbd6f3df7d7251b2',
      'pausa'
    );

    this.putActividad(
      this.actividadActiva[0].inicio,
      new Date(),
      this.actividadActiva[0].programacionequipos._id,
      this.actividadActiva[0].descripcion,
      '5f00e4e58c10d277700bcfa2',
      this.actividadActiva[0]._id,
      'pause'
    );

  }

  resume() {
    this.btnStop = true;
    this.btnPause = true;
    this.btnResumen = false;
    this.pausa = '';

    this.putActividad(
      this.actividadActiva[0].inicio,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      this.actividadActiva[0].programacionequipos._id,
      `${this.actividadActiva[0].descripcion}, ${this.validateForm.value.descripcion}`,
      '5f00e4c38c10d277700bcfa0',
      this.actividadActiva[0]._id,
      'resumenA'
    );

    this.putActividad(
      this.actividadPausada[0].inicio,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      this.actividadPausada[0].programacionequipos._id,
      this.actividadPausada[0].descripcion,
      '5f03ce10fbd6f3df7d7251b2',
      this.actividadPausada[0]._id,
      'resumenP'
    );
  }

  reset() {
    // if (this.isMarch == true) {
    //   clearInterval(this.control);
    //   this.isMarch = false;
    // }
    this.acumularTime = 0;
    this.hh = '00';
    this.mm = '00';
    this.ss = '00';
  }

  handleCancel(): void {
    this.isVisibleTime = false;
    clearInterval(this.cronTemp);
    this.reset();
  }

  actividadesEnCurso(actividadesData: DetalleActividadModel[]) {

    this.limpiarSetInterval();
    this.actividadesActuales = [];
    this.control = [];
    this.actividades = [];

    this.sinTrabajar = (actividadesData.length <= 0) ? true : false;
    if (this.sinTrabajar === true) {
      this.perfilCambio = (this.infoLogin.perfil === '5e8e222fce7ae6c0d4926b88') ? true : false;
    }
    this.actividadesActuales = actividadesData;

    for (let index = 0; index < this.actividadesActuales.length; index++) {
      const nombre = `${this.actividadesActuales[index].programacionequipos.miembros.nombre}
       ${this.actividadesActuales[index].programacionequipos.miembros.apellido}`;

      const id = this.actividadesActuales[index]._id;
      const proyecto = this.actividadesActuales[index].programacionequipos.programacionproyecto.proyectos.nombreProyecto;
      const actividad = this.actividadesActuales[index].programacionequipos.programacionproyecto.actividades.nombre;
      const descripcion = this.actividadesActuales[index].descripcion;
      const estado = this.actividadesActuales[index].estado.nombre;
      const inicio = moment(this.actividadesActuales[index].inicio);
      const fin = this.actividadesActuales[index].fin;
      const programacion = this.actividadesActuales[index].programacionequipos._id;
      this.timeActual = new Date();
      const typeAlert = (this.actividadesActuales[index].estado._id === '5f00e4c38c10d277700bcfa0') ? false : true;
      const abandono = (this.actividadesActuales[index].estado._id === '5f0a934eb250787e784ab1af') ? true : false;
      const control = (this.actividadesActuales[index].programacionequipos.miembros._id === this.infoLogin.id) ? true : false;
      this.control[index] = (setInterval(() => {
        this.cronometro(
          id,
          inicio,
          fin,
          index,
          nombre,
          proyecto,
          actividad,
          descripcion,
          estado,
          typeAlert,
          programacion,
          control,
          abandono);
      }, 1000)
      );
    }
  }

  escucharSoket() {
    if (this.infoLogin.perfil === '5e8e222fce7ae6c0d4926b88') {

      this.webSoketService.listen('actividades-enCurso')
        .subscribe((data: any[]) => {

          if (data[2] === this.infoLogin.id) {
            let arrayMiembro: [] = [];
            arrayMiembro = data[0].filter(x => x.programacionequipos.miembros._id === this.infoLogin.id);
            this.actividadesEnCurso(arrayMiembro);
          }
        },
          (err) => {
            console.log(err);
          });

      this.webSoketService.listen('actividades-actualizada')
        .subscribe((data: any[]) => {

          const actividadesActualizadas: any[] = [];

          if (data[4] === this.infoLogin.id) {

            let arrayMiembro: [] = [];
            arrayMiembro = data[0].filter(x => x.programacionequipos.miembros._id === this.infoLogin.id);

            actividadesActualizadas.push(data[1]);

            switch (data[3]) {
              case '5f00e4c38c10d277700bcfa0': {
                this.accionActividad(
                  actividadesActualizadas,
                  'retomado'
                );
                this.actividadesEnCurso(arrayMiembro);
                break;
              }
              case '5f00e4e58c10d277700bcfa2': {
                this.accionActividad(
                  actividadesActualizadas,
                  'pausado'
                );
                this.actividadesEnCurso(arrayMiembro);
                break;
              }
              case '5f00e4f88c10d277700bcfa3': {
                this.accionActividad(
                  actividadesActualizadas,
                  'finalizado'
                );
                this.actividadesEnCurso(arrayMiembro);
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

    } else {
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
  }

  accionActividad(actActualizada, accion) {
    let message = '';
    // tslint:disable-next-line: prefer-for-of
    const nombre = `${actActualizada[0].programacionequipos.miembros.nombre}
      ${actActualizada[0].programacionequipos.miembros.apellido}`;
    message = `${nombre} a ${accion} su actividad`;
    this.createBasicNotification(message);
  }

  revisarActividades(idProgra) {
    this.detalleActividadService.getDetalleActividadIndividual(idProgra)
      .toPromise()
      .then(
        (data: any) => {

          this.actividadActiva = data[0];
          this.actividadPausada = data[1];

          console.log(this.actividadActiva);
          console.log(this.actividadPausada);



          if (this.actividadActiva[0]) {
            this.empezo = `Empezo a las ${moment(this.actividadActiva[0].inicio).format('HH:mm a')}`;
            this.btnStop = true;
            this.btnPause = true;
            this.btnResumen = false;
            this.isMarch = true;

            if (this.actividadPausada[0]) {
              this.btnStop = true;
              this.btnPause = false;
              this.btnResumen = true;
              this.isMarch = true;
              // tslint:disable-next-line: max-line-length
              this.pausa = (this.actividadPausada[0]) ? `Pausada a las ${moment(this.actividadPausada[0].inicio).format('HH:mm a')}` : '';
            }

            const programacionequipos = this.actividadActiva[0].programacionequipos._id;
            // tslint:disable-next-line: max-line-length
            this.trabajando = true;
            // const descripcion = (this.actividadPausada[0]) ? this.actividadPausada[0].descripcion : this.actividadActiva[0].descripcion;
            this.validateForm = this.fb.group({
              programacionequipos: [programacionequipos, [Validators.required]],
              descripcion: ['', [Validators.required]],
            });

            const inicio = moment(this.actividadActiva[0].inicio);

            this.timeActual = new Date();
            this.timeInicial = new Date(
              inicio.get('year'),
              inicio.get('month'),
              inicio.get('day'),
              inicio.get('hour'),
              inicio.get('minute'),
              inicio.get('second')
            );

            this.cronTemp = setInterval(() => {
              this.cronometroActividad(inicio);
            }, 1000);

          }
        }
      );
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
    this.btnResumen = false;
    this.btnPause = false;
    this.btnStop = false;

    this.infoLogin = this.userService.getInfoLogin();
    this.up = false;
    this.down = true;

    if (this.infoLogin.perfil === '5e8e222fce7ae6c0d4926b88') {

      this.detalleActividadService.getDetalleActividadActivoMiembros()
        .toPromise()
        .then(
          (data: any) => {
            this.sinTrabajar = (data[0]) ? true : false;
            this.perfilCambio = true;

            if (data[0]) {
              this.actividadesEnCurso(data[0]);
            }
          }
        );

    } else {

      this.detalleActividadService.getAllDetalleActividadActivasCuenta()
        .toPromise()
        .then(
          (data: DetalleActividadModel[]) => {
            this.sinTrabajar = (data.length <= 0) ? true : false;
            this.perfilCambio = false;

            if (data.length > 0) {
              this.actividadesEnCurso(data);
            }

          }
        );
    }

    this.serviceProgramacionEquipos.getProgramaEquipo_Detallado()
      .toPromise()
      .then((data: ProgramacionEquipoDetalladoModel[]) => {
        this.listaProgramacion = data;
      }
      );

    this.validateForm = this.fb.group({
      programacionequipos: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });

    this.escucharSoket();
  }

  mostrar() {
    this.up = true;
    this.down = false;
  }

  ocultar() {
    this.up = false;
    this.down = true;
  }

  showModalActividad(id): void {
    this.revisarActividades(id);
    this.isVisibleTime = true;
  }

}
