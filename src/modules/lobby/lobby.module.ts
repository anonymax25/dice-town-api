import { Module } from '@nestjs/common';
import { UsersModule } from 'modules/users/users.module';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';

@Module({
  imports: [
    UsersModule
  ],
  providers: [
    LobbyService
  ],
  controllers: [LobbyController],
  exports: [
    LobbyService
  ]
})
export class LobbyModule {}
