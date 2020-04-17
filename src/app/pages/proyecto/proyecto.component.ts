import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../Servicios/proyectos.service';
import { ProyectoModel } from 'src/app/Modelos/proyecto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MiembrosModel } from '../../Modelos/miembros';
import { MiembrosService } from '../../Servicios/miembros.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  validateForm: FormGroup;
  visible = false;
  loadingTable = true;
  listaProtectos: ProyectoModel[];
  listOfDisplayData: ProyectoModel[];
  dataProyectos;
  dataMiembros: MiembrosModel[];
  infoLogin: any = JSON.parse(localStorage.getItem('infoUser'));

  constructor(
    private serviceProyecto: ProyectosService,
    private fb: FormBuilder,
    private serviceMiembros: MiembrosService,
    private message: NzMessageService,
    private router: Router

  ) { }

  createMessage(type: string, mensaje: string): void {
    this.message.create(type, mensaje);
  }

  ngOnInit(): void {

    this.serviceMiembros.getMiembros().toPromise().then(
      (data: MiembrosModel[]) => {
        this.dataMiembros = data;
        // console.log(this.dataMiembros);

      }
    );

    this.serviceProyecto.getProyecto().toPromise().then(
      (data: ProyectoModel[]) => {
        this.listaProtectos = data;
        this.listOfDisplayData = [...this.listaProtectos];
        this.loadingTable = false;
      }
    );
    this.validateForm = this.fb.group({
      nombreProyecto: [null, [Validators.required]],
      miembros: [null, [Validators.required]],
      tiempoProyectadoPro: [null, [Validators.required]],
      presuProyectadoPro: [null, [Validators.required]],
      estado: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    // console.log(this.validateForm.get(['estado']).value);

    // localStorage.getItem('infoUser');
    this.dataProyectos = {
      ...this.validateForm.value,
      cuentas: this.infoLogin.idCuenta,
      tiempoRealPro: 0,
      presupuestoRealPro: 0
    };

    this.serviceProyecto.postProyecto(this.dataProyectos).toPromise().then(
      (data: ProyectoModel) => {

        this.listOfDisplayData = [...this.listOfDisplayData, data];

        this.loadingTable = false;
        this.createMessage('success', 'Registro creado con exito');

        this.validateForm = this.fb.group({
          nombreProyecto: [null, [Validators.required]],
          miembros: [null, [Validators.required]],
          tiempoProyectadoPro: [null, [Validators.required]],
          presuProyectadoPro: [null, [Validators.required]],
          estado: [null, [Validators.required]]
        });

      },
      (error) => {
        console.log(error);

        this.createMessage('error', 'Opps!!! Algo salio mal');
      }
    );
    this.visible = false;

  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  programacion(detalleProyecto: ProyectoModel) {
    let navigationExtras: NavigationExtras = {
      state: detalleProyecto
    };
    // console.log(navigationExtras);
    this.router.navigate(['programacionProyectos'], navigationExtras);
  }

}
