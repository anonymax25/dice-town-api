import { Body, Request, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, Query, UseGuards, Param } from '@nestjs/common';
import { Lobby } from 'entities/lobby.entity';
import JwtAuthenticationGuard from 'modules/authentication/passport/jwt-authentication.guard';
import RequestWithUser from 'modules/authentication/requestWithUser.interface';
import { LobbyService } from './lobby.service';

@Controller('lobby')
@UseGuards(JwtAuthenticationGuard)
export class LobbyController {

  constructor(private readonly lobbyService: LobbyService) {}


  @Get(':code')
  async get(@Param() params): Promise<Lobby> {
    const code = params.code
    if (!code)
      throw new HttpException('CODE parameter is missing', HttpStatus.BAD_REQUEST);

    const room = await this.lobbyService.findOneLobbyPopulate({code: code})

    if (!room)
      throw new HttpException(`The room with the code: ${code} does not exists`, HttpStatus.BAD_REQUEST);

    return room;
  }

  @Post()
  async create(@Request() req: RequestWithUser): Promise<Lobby> {
    return await this.lobbyService.create(req.user.id);
  }

  @Put(':id')
  async update(@Request() req: RequestWithUser, @Param('id') id) {
    if (!id)
      throw new HttpException(
        'ID parameter is missing',
        HttpStatus.BAD_REQUEST,
      );

    await this.lobbyService.updateFields(id, req.body);
  }
  
  @Put(':code/join/:uid')
  async addUserToLobby(@Request() req: RequestWithUser, @Param('code') code, @Param('uid') uid) {    
    if(req.user.id != uid)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    if (!code || !uid)
      throw new HttpException('CODE or UID parameter is missing', HttpStatus.BAD_REQUEST);
    return await this.lobbyService.addUserToLobby(uid, code);
  }
  
  @Put(':code/quit/:uid')
  async removeUserToLobby(@Request() req: RequestWithUser, @Param('code') code, @Param('uid') uid) {    
    if(req.user.id != uid)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    if (!code || !uid)
      throw new HttpException('CODE or UID parameter is missing', HttpStatus.BAD_REQUEST);

    return await this.lobbyService.removeUserFromLobby(uid, code);
  }

  @Delete(':id')
  public async delete(@Request() req) {
    const id = req.params.id;
    if (!id)
      throw new HttpException(
        'ID parameter is missing',
        HttpStatus.BAD_REQUEST,
      );

    await this.lobbyService.delete(id);
  }
}
