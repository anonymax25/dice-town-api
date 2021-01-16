import { Injectable } from '@nestjs/common';
import { Lobby } from 'entities/lobby.entity';
import { BaseService } from 'shared/classes/base.service';
import * as crypto from "crypto"
import { UsersService } from 'modules/users/users.service';
import { Message } from 'entities/chat/message.entity';

@Injectable()
export class MessageService extends BaseService<Message>{
    constructor(){
        super(Message)
    }
}
