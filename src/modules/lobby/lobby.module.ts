import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LobbyController } from './lobby.controller';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';

@Module({
  imports: [
    UsersModule
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
