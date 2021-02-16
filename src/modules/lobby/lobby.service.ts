import { Injectable } from '@nestjs/common';
import { Lobby } from '../../entities/lobby.entity';
import { BaseService } from '../../shared/classes/base.service';
import * as crypto from "crypto"
import { UsersService } from '../users/users.service';
import { Message } from '../../entities/chat/message.entity';

@Injectable()
export class LobbyService extends BaseService<Lobby>{
    constructor(private usersService: UsersService){
        super(Lobby)
    }

    async create(ownerId: number) {
        
        let lobby = new Lobby()
        lobby.code = await (await this.genUnusedCode()).toUpperCase()
        lobby.is_private = true
        lobby.isGameStarted = false
        lobby.name = "Dice Town Test Game"
        lobby.ownerId = ownerId
        lobby.game = null
        const user = await this.usersService.findOne({id: ownerId})
        lobby.users = [user]
        lobby.messages = []
        return await this.save(lobby)
    }

    async addUserToLobby(userId: number, code: string){
        let lobby = await this.findLobbyComplete('lobby.code = :code ',{code})
        let user = await this.usersService.findOne({id: userId})
        lobby.users.push(user)
        return await this.save(lobby)
    }
    
    async addMessageToLobby(message: Message, lobbyId: number){
        let lobby = await this.findOneLobbyPopulate({id: lobbyId})
        lobby.messages.push(message)
        return await this.save(lobby)
    }

    async removeUserFromLobby(userId: number, code: string){
        let lobby = await this.findLobbyComplete('lobby.code = :code ',{code})
        let user = await this.usersService.findOne({id: userId})
        lobby.users.splice(lobby.users.indexOf(user),1)
        return await this.save(lobby)
    }

    async genUnusedCode(): Promise<string>{
        let code: string
        let isConflict = true
        while(isConflict){
            code = crypto.randomBytes(4).toString('hex')
            if(!await this.findOne({code}) && code !== "21A0E546")
                isConflict = false
        }
        return code
    }

    async findOneLobbyPopulate(where) {
        return await this.getRepository().findOne(
            {
                relations: ['users', 'messages'],
                where,
            }
          );
    }
    async findLobbyComplete(whereCondition: string, whereParam: Object): Promise<Lobby>{
        
        return await this.getRepository()
          .createQueryBuilder('lobby')
          .leftJoinAndSelect('lobby.users', 'users')
          .leftJoinAndSelect('lobby.game', 'game')
          //.innerJoin('lobby.messages', 'messages')
          .where(whereCondition, whereParam)
          .getOne();
          
      }
}
