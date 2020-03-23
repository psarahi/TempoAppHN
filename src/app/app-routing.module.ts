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

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: '',
    component: WelcomeComponent,
    children: [
      { path: 'proyecto', component: ProyectoComponent },
      { path: 'equipo', component: EquipoComponent },
      { path: 'cuentas', component: CuentasComponent },
      { path: 'actividades', component: ActividadesComponent },
      { path: 'programacionProyectos', component: ProgramacionProyectosComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
