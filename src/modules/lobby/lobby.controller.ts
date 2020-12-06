import { Body, Request, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Lobby } from 'entities/lobby.entity';
import JwtAuthenticationGuard from 'modules/authentication/passport/jwt-authentication.guard';
import RequestWithUser from 'modules/authentication/requestWithUser.interface';
import { LobbyService } from './lobby.service';

@Controller('lobby')
@UseGuards(JwtAuthenticationGuard)
export class LobbyController {

  constructor(private readonly lobbyService: LobbyService) {}


  @Get(':code')
  
  async get(@Request() req, @Query('code') code): Promise<Lobby> {
    if (!code)
      throw new HttpException(
        'CODE parameter is missing',
        HttpStatus.BAD_REQUEST,
      );

    const room = await this.lobbyService.findOne({code});
    if (!room)
      throw new HttpException(
        `The room with the code: ${code} does not exists`,
        HttpStatus.BAD_REQUEST,
      );

    return room;
  }

  @Post()
  async create(@Request() req: RequestWithUser): Promise<Lobby> {
    // if (!body || (body && Object.keys(body).length === 0))
    //   throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
    console.log(req.user);
    
    return await this.lobbyService.create(req.user.id);
  }

  @Put(':id')
  async update(@Request() req) {
    const id = req.params.id;
    if (!id)
      throw new HttpException(
        'ID parameter is missing',
        HttpStatus.BAD_REQUEST,
      );

    await this.lobbyService.updateFields(id, req.body);
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
