import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'shared/classes/base.service';
import User from '../../entities/user/user.entity';

@Injectable()
export class UsersService extends BaseService<User>{
  constructor(
  ) {
    super(User)
  }
}
