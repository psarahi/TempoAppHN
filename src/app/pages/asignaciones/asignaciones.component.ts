import { Component, OnInit } from '@angular/core';
import { ProgramacionEquipoService } from '../../Servicios/programacionEquipo.service';
import { ProgramacionEquipoDetalladoModel } from 'src/app/Modelos/programacionEquipo';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})



export class AsignacionesComponent implements OnInit {
  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };

  listaAsigancionesPendientes: ProgramacionEquipoDetalladoModel[] = [];
  listaAsigancionesFinalizada: ProgramacionEquipoDetalladoModel[] = [];
  sinPendientes: boolean;
  sinFinalizada: boolean;

  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  constructor(
    private serviceProgramacionEquipos: ProgramacionEquipoService

  ) { }

  ngOnInit() {

    this.serviceProgramacionEquipos.getProgramaEquipo_Detallado()
      .toPromise()
      .then((data: ProgramacionEquipoDetalladoModel[]) => {

        this.listaAsigancionesPendientes = data.filter(x => x.estado === true);
        this.listaAsigancionesFinalizada = data.filter(x => x.estado === false);

        this.sinFinalizada = (this.listaAsigancionesFinalizada.length > 0) ? false : true;
        this.sinPendientes = (this.listaAsigancionesPendientes.length > 0) ? false : true;
        console.log(this.listaAsigancionesPendientes);
        console.log(this.listaAsigancionesFinalizada);


      }
      );
  }

}
