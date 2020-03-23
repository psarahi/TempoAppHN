import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
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
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NgZorroAntdModule,
      IconsProviderModule
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
