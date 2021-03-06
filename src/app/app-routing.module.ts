import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { ProgramacionProyectosComponent } from './pages/programacionProyectos/programacionProyectos.component';
import { ProyectoComponent } from './pages/proyecto/proyecto.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { PruebasComponent } from './pages/pruebas/pruebas.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActividadActivasComponent } from './pages/actividadActivas/actividadActivas.component';
import { LoginGuard } from './Servicios/Guards/login.guard';
import { AsignacionesComponent } from './pages/asignaciones/asignaciones.component';
import { ReporteDiarioComponent } from './Reportes/reporteDiario/reporteDiario.component';
import { ReporteDiarioAdminComponent } from './Reportes/reporteDiarioAdmin/reporteDiarioAdmin.component';
import { ReportePorMiembrosComponent } from './Reportes/reportePorMiembros/reportePorMiembros.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  // { path: 'error', component: ErrorComponent },
  // { path: '**', redirectTo: '/error' },
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [LoginGuard],
    children: [
      { path: 'proyecto', component: ProyectoComponent },
      { path: 'equipo', component: EquipoComponent },
      { path: 'cuentas', component: CuentasComponent },
      { path: 'actividades', component: ActividadesComponent },
      { path: 'programacionProyectos', component: ProgramacionProyectosComponent },
      { path: 'pruebas', component: PruebasComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'actividadActiva', component: ActividadActivasComponent },
      { path: 'asinacion', component: AsignacionesComponent },
      { path: 'reporteDiario', component: ReporteDiarioComponent },
      { path: 'reporteDiarioAdmin', component: ReporteDiarioAdminComponent },
      { path: 'reportePorMiembro', component: ReportePorMiembrosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
