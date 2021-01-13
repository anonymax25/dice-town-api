import { Injectable } from '@nestjs/common';
import { Lobby } from 'entities/lobby.entity';
import { BaseService } from 'shared/classes/base.service';
import * as crypto from "crypto"
import { UsersService } from 'modules/users/users.service';
import User from 'entities/user.entity';

@Injectable()
export class LobbyService extends BaseService<Lobby>{
    constructor(private usersService: UsersService){
        super(Lobby)
    }

    async create(ownerId: number) {
        
        let lobby = new Lobby()
        lobby.code = await (await this.genUnusedCode()).toUpperCase()
        lobby.is_private = true
        lobby.name = "Dice Town Test Game"
        lobby.ownerId = ownerId
        const user = await this.usersService.findOne({id: ownerId})
        lobby.users = [user]
        return await this.save(lobby)
    }

    async addUserToLobby(userId: number, code: string){
        let lobby = await this.findLobbyComplete('lobby.code = :code ',{code})
        let user = await this.usersService.findOne({id: userId})
        lobby.users.push(user)
        return await this.save(lobby)
    }

    async genUnusedCode(): Promise<string>{
        let code: string
        let isConflict = true
        while(isConflict){
            
            code = crypto.randomBytes(4).toString('hex')
            if(!await this.findOne({code}))
                isConflict = false

        }
        return code
    }

    async findLobbyComplete(whereCondition: string, whereParam: Object): Promise<Lobby>{
        return await this.getRepository()
          .createQueryBuilder('lobby')
          .leftJoinAndSelect('lobby.users', 'users')
          .where(whereCondition, whereParam)
          .getOne();
      }
}
