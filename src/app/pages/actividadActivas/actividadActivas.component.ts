import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actividadActivas',
  templateUrl: './actividadActivas.component.html',
  styleUrls: ['./actividadActivas.component.css']
})
export class ActividadActivasComponent implements OnInit {
  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };

  constructor() { }

  ngOnInit() {
  }

}
