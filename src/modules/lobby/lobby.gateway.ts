import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Game } from 'entities/game/game.entity';
import { ReadyStatus } from 'entities/lobby/ready-status';
import { Server, Socket } from 'socket.io';
import { LobbyService } from './lobby.service';

const { WEBSOCKETS_PORT } = process.env

@WebSocketGateway(
  parseInt(WEBSOCKETS_PORT),
  {
    path: '/websockets',
    serveClient: true,
    namespace: '/lobby'
  }
)
export class LobbyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer()
  server: Server;
  
  private logger: Logger = new Logger("LobbyGateway")

  constructor(private lobbyService: LobbyService){

  }
  
  afterInit(server: Server) {    
    this.logger.log("Initialized!")
  }

  handleDisconnect(client: Socket) {
    //this.logger.log("client disconnected!", client.id)
  }

  handleConnection(client: Socket, ...args: any[]) {
    //this.logger.log("client connected!", client.id)
  }

  @SubscribeMessage('updateReadyStatus')
  async updateReadyStatus(client: Socket, readyStatus: ReadyStatus) {
    const lobby = await this.lobbyService.changeReadyStatus(readyStatus)
    this.server.to(lobby.id.toString()).emit('updatedReadyStatus', lobby.readyStatus)
  }

  @SubscribeMessage('joinLobbySocket')
  handleJoinRoom(client: Socket, body: {lobbyId: string, username: string}){
    this.server.to(body.lobbyId).emit('userJoinedLobby', body.username)
    client.join(body.lobbyId)
    client.emit('joinedLobbySocket', body.lobbyId)
  }
  @SubscribeMessage('leaveLobbySocket')
  handleLeaveRoom(client: Socket, body: {lobbyId: string, username: string}){
    this.server.to(body.lobbyId).emit('userLeftLobby', body.username)
    client.leave(body.lobbyId)
    client.emit('leftLobbySocket', body.lobbyId)
  }
}

