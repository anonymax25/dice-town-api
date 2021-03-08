import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Game } from 'entities/game/game.entity';
import { Lobby } from 'entities/lobby.entity';
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
  joinLobby(client: Socket, body: {lobbyId: string, username: string, uid: string}){
    this.server.to(body.lobbyId).emit('userJoinedLobby', body.username)
    client.join(body.lobbyId)
    client.emit('joinedLobbySocket', body.lobbyId)
  }

  @SubscribeMessage('leaveLobbySocket')
  leaveLobby(client: Socket, body: {lobbyId: string, username: string, uid: string}){
    client.leave(body.lobbyId)
    client.emit('leftLobbySocket', body.lobbyId)
    this.server.to(body.lobbyId).emit('userLeftLobby', body.username)
    this.updateReadyStatus(client, new ReadyStatus(parseInt(body.lobbyId), parseInt(body.uid), false))
  }
  
  @SubscribeMessage('switchStartGame')
  async switchStartGame(client: Socket, body: {lobbyId: string}){
    const lobby = await this.lobbyService.switchStartGame(parseInt(body.lobbyId))
    this.server.to(body.lobbyId).emit('startGameSwitched', lobby)
  }
}

