import { Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway(3001,{
  path: '/websockets',
  serveClient: true,
  namespace: '/alerts'
})
export class AlertsGateway implements OnGatewayInit{
  
  @WebSocketServer()
  server: Server;
  
  private logger: Logger = new Logger("AlertsGateway")

  afterInit(server: Server) {    
    this.logger.log("Initialized!")
  }
  
  sendAlert(msg: string): void {
   this.server.emit('alertToClient',  { type: "Alert", message: msg})
  }
}
