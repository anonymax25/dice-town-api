import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Observable, from } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { map } from 'rxjs/operators';


@WebSocketGateway(3001,{
  path: '/websockets',
  serveClient: true,
  namespace: '/'
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer()
  server: Server;
  
  private logger: Logger = new Logger("SocketGateway")

  afterInit(server: Server) {    
    this.logger.log("Initialized!")
  }

  handleDisconnect(client: Socket) {
    this.logger.log("client disconnected!", client.id)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log("client connected!", client.id)
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    return {event: 'msgToClient', data: text + "_from-server"};//client.emit("msgToClient", text)
  }
  
  //msg to all connected users
  @SubscribeMessage('msgToServerAll')
  handleMessageAll(client: Socket, text: string): void {
   this.server.emit('msgToClient', text)
  }

  

}
