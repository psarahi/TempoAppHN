import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { AppComponent } from './app.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!

// Importaciones de componentes
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { ProgramacionProyectosComponent } from './pages/programacionProyectos/programacionProyectos.component';
import { ProyectoComponent } from './pages/proyecto/proyecto.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { PruebasComponent } from './pages/pruebas/pruebas.component';
import { AsignacionesComponent } from './pages/asignaciones/asignaciones.component';


// Servicios
import { ActividadesService } from './Servicios/actividades.service';
import { CuentaService } from './Servicios/cuenta.service';
import { LoginService } from './Servicios/login.service';
import { MiembrosService } from './Servicios/miembros.service';
import { PerfilesService } from './Servicios/perfiles.service';
import { ProgramacionProyectoService } from './Servicios/programacionProyecto.service';
import { ProgramacionEquipoService } from './Servicios/programacionEquipo.service';
import { ProyectosService } from './Servicios/proyectos.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActividadActivasComponent } from './pages/actividadActivas/actividadActivas.component';
import { LoginGuard } from './Servicios/Guards/login.guard';
import { InterceptorServicervice } from './Servicios/interceptor.service';

// config angular i18n
import { registerLocaleData, CommonModule } from '@angular/common';
import en from '@angular/common/locales/en';
import { IconsProviderModule } from './icons-provider.module';

// Importaciones de componentes
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ErrorComponent } from './pages/error/error.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { ChartsModule } from 'ng2-charts';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
registerLocaleData(en);

const config: SocketIoConfig = { url: environment.apiUrlSocket, options: {} };


@NgModule({
   declarations: [
      AppComponent,
      WelcomeComponent,
      CuentasComponent,
      ActividadesComponent,
      EquipoComponent,
      ProgramacionProyectosComponent,
      ProyectoComponent,
      RegistroComponent,
      LoginComponent,
      ErrorComponent,
      PruebasComponent,
      DashboardComponent,
      ActividadActivasComponent,
      AsignacionesComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NgZorroAntdModule,
      IconsProviderModule,
      ReactiveFormsModule,
      SocketIoModule.forRoot(config),
      FullCalendarModule, // for FullCalendar!
      //////////////////////////////
      NzCardModule,
      NzGridModule,
      NzLayoutModule,
      NzAvatarModule,
      NzTableModule,
      NzMenuModule,
      NzDropDownModule,
      NzButtonModule,
      NzIconModule,
      NzModalModule,
      NzDrawerModule,
      NzFormModule,
      NzSelectModule,
      NzInputNumberModule,
      NzInputModule,
      NzAlertModule,
      NzSwitchModule,
      NzMessageModule,
      NzNotificationModule,
      NzPageHeaderModule,
      NzPaginationModule,
      NzCheckboxModule,
      NzDatePickerModule,
      NzTimePickerModule,
      NzEmptyModule,
      NzListModule,
      NzStatisticModule,
      NzDividerModule,
      NzSpinModule,
      NzCalendarModule,
      NzToolTipModule,
      ///////////////////////////
      ChartsModule
   ],
   providers: [
      { provide: NZ_I18N, useValue: en_US },
      {
         provide: HTTP_INTERCEPTORS,
         useClass: InterceptorServicervice,
         multi: true
      },
      ActividadesService,
      CuentaService,
      LoginService,
      MiembrosService,
      PerfilesService,
      ProgramacionProyectoService,
      ProgramacionEquipoService,
      ProyectosService,
      LoginGuard
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
