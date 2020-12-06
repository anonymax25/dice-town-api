import { Injectable } from '@nestjs/common';
import { Lobby } from 'entities/lobby.entity';
import { BaseService } from 'shared/classes/base.service';
import * as crypto from "crypto"
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class LobbyService extends BaseService<Lobby>{
    constructor(private usersService: UsersService){
        super(Lobby)
    }

    async create(ownerId: number) {
        
        let lobby = new Lobby()
        lobby.code = await this.genUnusedCode()
        lobby.is_private = true
        lobby.name = "Dice Town Test Game"
        lobby.ownerId = ownerId
        const user = await this.usersService.findOne({id: ownerId})
        lobby.users = [user]
        return await this.getRepository().create(lobby)
    }

    async genUnusedCode(){
        let code
        let isConflict = true
        while(isConflict){
            
            code = crypto.randomBytes(3).toString('hex')
            if(!await this.findOne({code}))
                isConflict = false

        }
        return code
    }
}
