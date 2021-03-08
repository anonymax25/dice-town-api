import { Module } from '@nestjs/common';
import { GameModule } from 'modules/game/game.module';
import { UsersModule } from '../users/users.module';
import { LobbyController } from './lobby.controller';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';

@Module({
  imports: [
    UsersModule,
    GameModule
  ],
  providers: [
    LobbyService,
    LobbyGateway
  ],
  controllers: [LobbyController],
  exports: [
    LobbyService
  ]
})
export class LobbyModule {}
