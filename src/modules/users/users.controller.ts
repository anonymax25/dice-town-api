import { UsersService } from './users.service';
import { Controller, Req, UseGuards, Get, Put, Body, Query } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/passport/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import User from 'entities/user/user.entity';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async getProfile(@Req() req: RequestWithUser, @Query('id') id) {
    return await this.usersService.findOneById(id)
  }
  
  @UseGuards(JwtAuthenticationGuard)
  @Put()
  async update(@Req() req: RequestWithUser, @Body() user: User) {
    return this.usersService.updateFields(req.user.id, user);
  }
}
