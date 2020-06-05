import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorServicervice implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem('token');
   // console.log(token);

    let request = req;

    //console.log('Paso por aca');

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: token
        }
      });
    }

    // const headers = new HttpHeaders({
    //   'authorization': token
    // });

    // const reqClone = req.clone({
    //   headers
    // });

    return next.handle(request);

  }
}
