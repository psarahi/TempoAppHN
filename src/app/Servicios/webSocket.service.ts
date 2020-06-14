import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public socketStatus = false;

  constructor(
    private socket: Socket
  ) {
    this.checkStatus();
  }


  checkStatus() {

    this.socket.on('connect', () => {
      console.log('Servidor conectado');

      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Servidor desconectado');

      this.socketStatus = false;
    });
  }

  emit(evento, data?) {
    // debugger;
    this.socket.emit(evento, data);
  }


  listen(evento: string) {
    return this.socket.fromEvent(evento);
  }

}
