import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(3001,{
  path: '/websockets',
  serveClient: true,
  namespace: '/chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer()
  server: Server;
  
  private logger: Logger = new Logger("ChatGateway")

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
  @SubscribeMessage('chatToServerAll')
  handleMessageAll(client: Socket, message: {sender: string, room: string, text: string}): void {
   this.server.to(message.room).emit('msgToClient', message)
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string){
    client.join(room)
    client.emit('joinedRoom', room)
  }
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string){
    client.leave(room)
    client.emit('leftRoom', room)
  }
    
  

}
