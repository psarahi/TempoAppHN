import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { AppComponent } from './app.component';

// Importaciones de componentes
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { ProgramacionProyectoComponent } from './pages/programacionProyecto/programacionProyecto.component';
import { ProyectoComponent } from './pages/proyecto/proyecto.component';
import { RegistroComponent } from './pages/registro/registro.component';


// config angular i18n
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { IconsProviderModule } from './icons-provider.module';
import { LoginComponent } from './login/login.component';

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


registerLocaleData(en);

@NgModule({
   declarations: [
      AppComponent,
      CuentasComponent,
      ActividadesComponent,
      EquipoComponent,
      ProgramacionProyectoComponent,
      ProyectoComponent,
      RegistroComponent,
      LoginComponent,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NgZorroAntdModule,
      IconsProviderModule,
      ReactiveFormsModule,
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
   ],
   providers: [
      { provide: NZ_I18N, useValue: en_US }
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
