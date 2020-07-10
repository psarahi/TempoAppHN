import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import * as moment from 'moment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }


  postSesion(sesion) {
    return this.http.post(`${apiUrl}/sesiones/`, sesion);
  }

  putSesion(id, sesion) {
    return this.http.put(`${apiUrl}/sesiones/${id}`, sesion);
  }

  getSesionesCuentaDia() {
    const { idCuenta } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/sesiones/sesionesCuentaDia/${idCuenta}`);
  }

  getSesionesCuenta() {
    const { idCuenta } = this.userService.getInfoLogin();
    return this.http.get(`${apiUrl}/sesiones/sesionesCuenta/${idCuenta}`);
  }

  manejoSesiones(idCuenta, idMiembro, sesion, accion) {

    switch (accion) {
      case 'logout': {
        const localInfoSesion = JSON.parse(localStorage.getItem('infosesion'));

        const inicio = moment([
          moment(localInfoSesion.fechaLoginTemp).get('year'),
          moment(localInfoSesion.fechaLoginTemp).get('month'),
          moment(localInfoSesion.fechaLoginTemp).get('day'),
          moment(localInfoSesion.fechaLoginTemp).get('hour'),
          moment(localInfoSesion.fechaLoginTemp).get('minute'),
          moment(localInfoSesion.fechaLoginTemp).get('second')
        ]);

        const fin = moment([
          moment().get('year'),
          moment().get('month'),
          moment().get('day'),
          moment().get('hour'),
          moment().get('minute'),
          moment().get('second')
        ]);
        const difMin = fin.diff(inicio, 'minutes');

        const userSesion = {
          cuentas: idCuenta,
          miembros: idMiembro,
          fechaLogin: moment(localInfoSesion.fechaLogin).format('YYYY-MM-DD HH:mm:ss'),
          fechaLoginTemp: moment().format('YYYY-MM-DD HH:mm:ss'),
          fechaLogout: moment().format('YYYY-MM-DD HH:mm:ss'),
          tiempoLogin: localInfoSesion.tiempoLogin + difMin,
          estado: false
        };

        this.putSesion(localInfoSesion._id, userSesion)
          .toPromise()
          .then((data => {
            localStorage.setItem('infosesion', JSON.stringify(data));

          }));


        break;
      }
      case 'refresh': {

        const localInfoSesion = JSON.parse(localStorage.getItem('infosesion'));

        if (localInfoSesion) {
          // const inicio = moment([
          //   moment(localInfoSesion.fechaLoginTemp).get('year'),
          //   moment(localInfoSesion.fechaLoginTemp).get('month'),
          //   moment(localInfoSesion.fechaLoginTemp).get('day'),
          //   moment(localInfoSesion.fechaLoginTemp).get('hour'),
          //   moment(localInfoSesion.fechaLoginTemp).get('minute'),
          //   moment(localInfoSesion.fechaLoginTemp).get('second')
          // ]);

          // const fin = moment([
          //   moment().get('year'),
          //   moment().get('month'),
          //   moment().get('day'),
          //   moment().get('hour'),
          //   moment().get('minute'),
          //   moment().get('second')
          // ]);
          // const difMin = fin.diff(inicio, 'minutes');

          const userSesion = {
            cuentas: idCuenta,
            miembros: idMiembro,
            fechaLogin: moment(localInfoSesion.fechaLogin).format('YYYY-MM-DD HH:mm:ss'),
            fechaLoginTemp: moment(localInfoSesion.fechaLoginTemp).format('YYYY-MM-DD HH:mm:ss'),
            fechaLogout: moment().format('YYYY-MM-DD HH:mm:ss'),
            tiempoLogin: localInfoSesion.tiempoLogin,
            estado: true
          };

          this.putSesion(localInfoSesion._id, userSesion)
            .toPromise()
            .then((data => {
              localStorage.setItem('infosesion', JSON.stringify(data));
            }));
        }
        break;
      }
      case 'login': {

        if (sesion.length > 0) {
          const userSesion = {
            cuentas: idCuenta,
            miembros: idMiembro,
            fechaLogin: moment(sesion[0].fechaLogin).format('YYYY-MM-DD HH:mm:ss'),
            fechaLoginTemp: moment().format('YYYY-MM-DD HH:mm:ss'),
            fechaLogout: moment().format('YYYY-MM-DD HH:mm:ss'),
            tiempoLogin: sesion[0].tiempoLogin,
            estado: true
          };

          this.putSesion(sesion[0]._id, userSesion)
            .toPromise()
            .then((data => {
              localStorage.setItem('infosesion', JSON.stringify(data));
            }));


        } else {

          const userSesion = {
            cuentas: idCuenta,
            miembros: idMiembro,
            fechaLogin: moment().format('YYYY-MM-DD HH:mm:ss'),
            fechaLoginTemp: moment().format('YYYY-MM-DD HH:mm:ss'),
            fechaLogout: moment().format('YYYY-MM-DD HH:mm:ss'),
            tiempoLogin: 0,
            estado: true
          };

          this.postSesion(userSesion)
            .toPromise()
            .then((data => {
              localStorage.setItem('infosesion', JSON.stringify(data));

            }));

        }
        break;
      }
      default:
        break;
    }

  }

}
